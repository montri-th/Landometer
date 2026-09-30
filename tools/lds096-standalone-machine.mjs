/** Derive current standalone contracts without changing any frozen source file. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = path.join(ROOT, 'plugins/landometer-design-system');
const INHERITED = path.join(PLUGIN, 'references/inherited/lds-0.9.4/machine');
const CURRENT = path.join(PLUGIN, 'assets/lds-0.9.6/machine');
export const STANDALONE_RELEASE_REF = 'v0.9.6-owner.1';
export const STANDALONE_SCHEMA_NAMESPACE = 'https://montri-th.github.io/Landometer/v0.9.6/standalone-0.9.6-r1/schemas/';
const STATES = ['measured', 'measured_zero', 'no_data', 'out_of_scope', 'suppressed', 'not_yet'];
const SOCIAL_TARGETS = ['target.social.square.1080.01', 'target.social.og.1200x630.01'];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const canonicalContractBytes = object => JSON.stringify(object, null, 2) + '\n';
const clone = value => JSON.parse(JSON.stringify(value));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function transform(value, stringFn, nodeFn = x => x) {
  if (typeof value === 'string') return stringFn(value);
  if (Array.isArray(value)) return nodeFn(value.map(x => transform(x, stringFn, nodeFn)));
  if (value && typeof value === 'object') return nodeFn(Object.fromEntries(Object.entries(value).map(([k, v]) => [k, transform(v, stringFn, nodeFn)])));
  return value;
}

/** Resolve metadata/policy contradictions without changing any approved token value. */
export function normalizeCurrentTokens(input) {
  const tokens = clone(input);
  tokens.motion.motifs.carrierPolicy.registerRef = 'motif-register.v0.9.6.json#/carrierPolicy';
  tokens.motion.productOverlays.register = 'motif-register.v0.9.6.json';
  for (const kind of Object.values(tokens.motion.motifs.kinds)) kind.allowedFormats = kind.allowedFormats.filter(x => x !== 'social_square_1080');
  tokens.constraints.colourValuesOutsideApprovedRegistryForbidden = tokens.constraints.colourValuesOutsideProposalForbidden;
  delete tokens.constraints.colourValuesOutsideProposalForbidden;
  delete tokens.constraints.forbiddenHueFamilies;
  tokens.constraints.forbiddenHueWindows = 'machine.policy.analytical.bannedHue';
  tokens.constraints.runtimeDarkAnchorDerivationForbidden = true;
  tokens.constraints.runtimeAnalyticalInterpolationForbidden = true;
  tokens.constraints.approvedThemeLutRequired = true;
  // Human hue nicknames are not an alternate validator for exact approved samples.
  tokens.constraints.pinkAllowedOutsideVioletWindow = true;
  const colorLiterals = value => JSON.stringify(value).match(/#[A-Fa-f0-9]{6}\b/g)?.sort() ?? [];
  if (!same(colorLiterals(input), colorLiterals(tokens))) throw new Error('Token normalization changed approved colour values');
  for (const key of ['brand','atmosphere','foundation','semanticState','dataState','map','typography','icon','control','theme','layout','categoricalSeries','analyticalScales']) {
    if (!same(input[key], tokens[key])) throw new Error(`Token normalization changed protected ${key}`);
  }
  return tokens;
}

/** Preserve every rule and check ID; take normative text directly from human master. */
export function rulesFromHumanMaster(humanMaster) {
  if (typeof humanMaster !== 'string' || !humanMaster.trim()) throw new Error('humanMaster must be complete UTF-8 Markdown text');
  const headings = [...humanMaster.matchAll(/^\*\*([A-Z][A-Z0-9-]*-\d{2}) — (.+?)\*\*(.*)$/gm)];
  const out = new Map();
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const chunk = humanMaster.slice(h.index, headings[i + 1]?.index ?? humanMaster.length);
    const acceptanceAt = chunk.search(/^Acceptance\s*:/m);
    if (acceptanceAt < 0) throw new Error(`Missing Acceptance for ${h[1]}`);
    const body = (h[3] + '\n' + chunk.slice(h[0].length, acceptanceAt)).trim();
    const acceptance = [...chunk.matchAll(/^- ([A-Z][A-Z0-9-]*-\d{2}-[A-Z]) — ([^\n]+)(?:\n((?:(?!\n|[-#*]).+\n?)*))?/gm)]
      .filter(x => x[1].startsWith(`${h[1]}-`)).map(x => {
        const text = (x[2] + (x[3] ? '\n' + x[3].trim() : '')).trim();
        const m = text.match(/^(automated|manual|visual|interaction|accessibility|production)([^:]*):\s*([\s\S]*)$/);
        if (!m) throw new Error(`Unrecognized acceptance method: ${x[1]}`);
        return { checkId: x[1], method: m[1], ...(m[2].trim() ? { methodDetail: (m[1] + m[2]).trim() } : {}), criterion: m[3].trim() };
      });
    if (!body || !acceptance.length || out.has(h[1])) throw new Error(`Invalid or repeated rule ${h[1]}`);
    out.set(h[1], { id: h[1], title: h[2].replace(/\.$/, ''), requirement: body, acceptance, fullText: chunk.trim() });
  }
  return out;
}

export function buildMachineContracts({ humanMaster }) {
  const normalizationLog = [];
  const sources = [];
  function read(directory, name) {
    const file = path.join(directory, name);
    const bytes = fs.readFileSync(file);
    sources.push({ path: path.relative(PLUGIN, file), sha256: sha256(bytes), bytes: bytes.length,
      role: directory === INHERITED ? 'historical-input-only' : 'current-0.9.6-input',
      url: `https://montri-th.github.io/Landometer/v0.9.6/package/${path.relative(PLUGIN, file)}` });
    return JSON.parse(bytes.toString('utf8'));
  }
  const sourceSchemas = Object.fromEntries(fs.readdirSync(INHERITED).filter(n => n.endsWith('.schema.json') && !n.includes('.example.')).sort().map(name => [name, read(INHERITED, name)]));
  sourceSchemas['social-sidecar.schema.json'] = read(CURRENT, 'social-sidecar.schema.json');
  sourceSchemas['evidence-value.schema.json'] = read(CURRENT, 'evidence-value.schema.json');
  const schemaIdMap = {};
  for (const [name, schema] of Object.entries(sourceSchemas)) schemaIdMap[schema.$id] = STANDALONE_SCHEMA_NAMESPACE + name;
  // References in inherited schemas may still use the superseded social schema ID.
  schemaIdMap['https://landometer.org/design-system/0.9.4/social-sidecar.schema.1.2.json'] = STANDALONE_SCHEMA_NAMESPACE + 'social-sidecar.schema.json';

  function normalizeString(s) {
    for (const [oldId, newId] of Object.entries(schemaIdMap)) s = s.replaceAll(oldId, newId);
    return s.replaceAll('v0.9.4-mp1', STANDALONE_RELEASE_REF)
      .replaceAll('tokens.v0.9.4.json', 'tokens.v0.9.6.json')
      .replaceAll('motif-register.v0.9.4.json', 'motif-register.v0.9.6.json')
      .replaceAll('component-contracts.v0.9.4.json', 'component-contracts.v0.9.6.json')
      .replaceAll('color-srgb-07.scales.json', 'color-srgb-09.scales.json')
      .replaceAll('color-srgb-07.tokens.json', 'color-srgb-09.tokens.json')
      .replaceAll('landometer-series-10-v7', 'landometer-series-10-v8')
      .replaceAll('motion-riddim-approach-02', 'motion-riddim-approach-03')
      .replaceAll('css-rem-clamp-v0.9.4', 'css-rem-clamp-v0.9.6')
      .replaceAll('platform-scaled-type-v0.9.4', 'platform-scaled-type-v0.9.6')
      .replaceAll('five EVID-05 value states', 'six EVID-05 value states')
      .replaceAll('five EVID-05 states', 'six EVID-05 states')
      .replaceAll('five-value enum', 'six-value enum')
      .replaceAll('five value states', 'six value states')
      .replaceAll('subset of the five', 'subset of the six')
      .replaceAll('one of the five', 'one of the six');
  }
  const normalize = value => transform(clone(value), normalizeString, node => {
    if (Array.isArray(node) && node.length === 5 && STATES.slice(1).every(s => node.includes(s))) return [...STATES];
    return node;
  });
  const schemas = Object.fromEntries(Object.entries(sourceSchemas).map(([name, schema]) => [name, normalize(schema)]));
  for (const [name, schema] of Object.entries(schemas)) {
    schema.$id = STANDALONE_SCHEMA_NAMESPACE + name;
    schema.$comment = 'Resolved standalone LDS 0.9.6 contract, revision standalone-0.9.6-r1. The distribution is owner-approved and unsigned; this schema is not a release attestation. Historical source identities and hashes are recorded separately.';
  }
  schemas['build-card.schema.json'].title = 'Landometer Design System 0.9.6 Build Card — standalone-0.9.6-r1';
  schemas['build-card.schema.json'].description = 'Author-supplied intent and resolver-supplied configuration for one design output under the current standalone 0.9.6 resolved-only audience contract. Owner-approved distribution does not establish signed artifact conformance.';
  schemas['social-sidecar.schema.json'].properties.actionBinding.properties.destinationVerification.properties.freshnessTtlSeconds.description = 'Explicit bounded maximum age at both promotionCheckedAt and productionObservedAt when production verification is claimed; an unbounded destination check is prohibited.';
  const ledgerTuple = schemas['migration-ledger.schema.json'].properties.releaseRef.properties;
  ledgerTuple.dsVersion.const = '0.9.6';
  ledgerTuple.authoringRevision.const = '0.9.6-owner.1';
  ledgerTuple.rulesetId.const = 'lds-rules-0.9.6';
  const predecessor = schemas['migration-ledger.schema.json'].properties.predecessor.properties;
  predecessor.dsVersion.const = '0.9.4';
  predecessor.authoringRevision.const = '0.9.4-r2';
  if (predecessor.machinePackage) predecessor.machinePackage.const = 'v0.9.4-mp1';
  normalizationLog.push({ area: 'identity', change: 'Current schema IDs use a unique standalone-0.9.6-r1 namespace; current release bindings and all mapped schema references resolve to 0.9.6. Historical source bytes remain untouched.' });

  const inheritedRules = read(INHERITED, 'rule-catalog.json');
  const ruleCatalog = normalize(inheritedRules);
  const humanRules = rulesFromHumanMaster(humanMaster);
  if (humanRules.size !== inheritedRules.rules.length) throw new Error(`Human rule count ${humanRules.size} differs from catalog ${inheritedRules.rules.length}`);
  for (const rule of ruleCatalog.rules) {
    const human = humanRules.get(rule.id);
    if (!human) throw new Error(`Human master missing ${rule.id}`);
    if (!same(rule.acceptance.map(x => x.checkId), human.acceptance.map(x => x.checkId))) throw new Error(`Acceptance IDs changed for ${rule.id}`);
    Object.assign(rule, human);
  }
  normalizationLog.push({ area: 'rules', change: 'All 64 rule requirements and acceptance criteria are projected from the complete current human master; stable rule IDs, scopes, levels and required-core inventory are preserved.' });

  const contracts = {
    componentContracts: normalize(read(INHERITED, 'component-contracts.v0.9.4.json')),
    formatPacks: normalize(read(INHERITED, 'format-packs.json')),
    formatKits: normalize(read(INHERITED, 'format-kits.json')),
    targetProfiles: normalize(read(INHERITED, 'target-profiles.json')),
    assetRegistry: normalize(read(INHERITED, 'asset-registry.json')),
    motifRegister: normalize(read(INHERITED, 'motif-register.v0.9.4.json')),
  };
  contracts.componentContracts.note = 'Current standalone 0.9.6 component contracts. Stable component IDs preserve exact format/runtime behavior; six evidence states and exact color-srgb-09 classes replace superseded state and color clauses.';
  contracts.formatKits.note = 'Current standalone 0.9.6 semantic production controls. Each artifact binds its selected kit, target, preset, exact delivery bytes, required test evidence and actual editable/native sources. These controls do not claim to supply native templates.';
  const table = contracts.componentContracts.contracts.find(x => /cellStates/.test(x.contract?.contentContract ?? ''));
  if (table) table.contract.contentContract = 'Props caption, columns, rows, cellStates: one of measured, measured_zero, no_data, out_of_scope, suppressed, not_yet for every governed value. measured is a finite nonzero number; measured_zero is exactly 0; exceptional states carry null. noDataLabel remains a deprecated alias of no_data; show glyph plus reason in text.metadata, sort no_data last, show suppression threshold or expected date as applicable. Metadata/provenance requirements remain governed by the claim contract.';
  const legend = contracts.componentContracts.contracts.find(x => /Props layer, method, classes/.test(x.contract?.contentContract ?? ''));
  if (legend) legend.contract.contentContract = 'Props layer, method, classes from the exact color-srgb-09 family and theme LUT (3, 5, 7 or 9 samples at round(i*40/(n-1))), unit with denominator, present states drawn from all six EVID-05 states, source, asOf and limitation. No runtime interpolation or light-to-dark formula. State rows show the applicable swatch/pattern, glyph and label in text.metadata; measured values retain units and analytical classes.';
  const evidenceCard = contracts.componentContracts.contracts.find(x => /Props value, unit, state/.test(x.contract?.contentContract ?? ''));
  if (evidenceCard) evidenceCard.contract.contentContract = evidenceCard.contract.contentContract.replace('one of six EVID-05 states', 'one of six EVID-05 states: measured, measured_zero, no_data, out_of_scope, suppressed, not_yet');
  normalizationLog.push({ area: 'evidence', change: 'DataTable, MapLegend, EvidenceCard and capability schema enums include measured; value-state semantics resolve the embedded six-state evidence-value schema.' });

  const dataOverlay = contracts.formatPacks.overlays.find(x => x.id === 'data.visualization.01');
  const mapOverlay = contracts.formatPacks.overlays.find(x => x.id === 'map.spatial.01');
  if (dataOverlay) dataOverlay.testMatrix = dataOverlay.testMatrix.map(s => /derived dark anchors/.test(s) ? 'Every family/theme uses its exact approved 41-sample color-srgb-09 LUT; classes 3/5/7/9 use round(i*40/(n-1)); no runtime interpolation, dark-anchor formula, clipping or silent normalization; all six value states and categorical variant/cue rules resolve and render.' : s);
  if (mapOverlay) mapOverlay.testMatrix = mapOverlay.testMatrix.map(s => /dark classes are derived/.test(s) ? 'Map units carry one of six value states and the legend shows every present state; classes use exact theme-specific LUT samples; every delivered analytical value avoids applicable retired hue windows.' : s);
  contracts.formatKits.kits = contracts.formatKits.kits.map(kit => ({ ...kit, requiredImplementationControls: kit.requiredImplementationControls.map(s => /dark scale custom properties.*derivation/.test(s) ? 'Exact color-srgb-09 CSS or theme-specific LUT classes; no runtime interpolation or light-to-dark anchor formula' : s) }));
  contracts.formatPacks.experienceProfileTestMatrix.campaign = contracts.formatPacks.experienceProfileTestMatrix.campaign.map(s => s.replace('governed square target', 'declared governed square or OG target'));
  normalizationLog.push({ area: 'analytical', change: 'Resolved overlays and format controls require the approved 41-sample light/dark LUTs and 3/5/7/9 classes; legacy dark derivation controls are retired.' });

  for (const name of ['build-card.schema.json', 'format-implementation.schema.json']) {
    function replaceSquareConst(node) {
      if (!node || typeof node !== 'object') return;
      if (node.properties?.targetProfileRef?.const === SOCIAL_TARGETS[0]) node.properties.targetProfileRef = { enum: [...SOCIAL_TARGETS] };
      for (const value of Object.values(node)) if (value && typeof value === 'object') replaceSquareConst(value);
    }
    replaceSquareConst(schemas[name]);
  }
  const socialArtifact = schemas['social-sidecar.schema.json'].properties.artifact;
  socialArtifact.properties.creativeWidthPx = { type: 'integer', minimum: 1 };
  socialArtifact.properties.creativeHeightPx = { type: 'integer', minimum: 1 };
  socialArtifact.required.push('creativeWidthPx', 'creativeHeightPx');
  socialArtifact.allOf = SOCIAL_TARGETS.map((id, index) => ({ if: { properties: { targetProfileRef: { const: id } }, required: ['targetProfileRef'] }, then: { properties: { creativeWidthPx: { const: index ? 1200 : 1080 }, creativeHeightPx: { const: index ? 630 : 1080 } } } }));
  normalizationLog.push({ area: 'social', change: 'Build Card, implementation and sidecar accept square1080x1080 or OG1200x630; sidecar requires target-consistent exact creative dimensions and hash.' });

  const og = contracts.targetProfiles.profiles.find(x => x.id === SOCIAL_TARGETS[1]);
  const unapprovedOgProposal = clone(og.typeAdapter);
  og.typeAdapter = { sourceMinimumPx: 22, derivationNote: 'The destination cue floor is 22px. Headline and body sizes must pass actual Thai/English feed-size and crop fixtures; historical 28px/48px proposals were never separately approved as fixed minima.' };
  normalizationLog.push({ area: 'social-type', change: 'Retains approved22px destination cue and visual legibility/crop requirements; unapproved fixed28px body/48px headline proposal is provenance only.' });

  const noBracket = 'Do not use decorative bracket-shaped highlights or colored left-rail accents for selected navigation, tabs, cards or callouts. Use restrained background, text weight and spacing; retain visible keyboard focus outlines and meaningful chart/table borders. Inspect actual Thai/English content at narrow and desktop widths for squeezed headings or overlaps.';
  contracts.formatPacks.commonTestMatrix.push(noBracket);
  for (const entry of contracts.componentContracts.contracts) if (entry.contract?.antiPatterns) entry.contract.antiPatterns.push('Decorative bracket highlight or colored left-rail accent');
  normalizationLog.push({ area: 'visual-preference', change: 'Owner no-bracket/no-colored-left-rail preference and rendered Thai/English narrow/desktop review are explicit common controls; accessibility focus and meaningful data borders remain.' });

  // Social creatives forbid motifs even though the historic asset catalog offered them.
  contracts.motifRegister = transform(contracts.motifRegister, x => x, node => Array.isArray(node) && node.includes('social_square_1080') ? node.filter(x => x !== 'social_square_1080') : node);
  for (const name of ['build-card.schema.json', 'capability-config.schema.json']) {
    const format = schemas[name].$defs?.staticMotifPlacement?.properties?.format;
    if (format?.enum) format.enum = format.enum.filter(x => x !== 'social_square_1080');
  }
  normalizationLog.push({ area: 'motifs', change: 'Exact asset bytes and lifecycle contracts retained; active motif allowed-format lists follow the stricter social no-motif rule. Historical broad asset-format permission remains source provenance only.' });

  const sourceAssetApproval = {
    appliesToHistoricalSourceOnly: true,
    appliesToCurrentStandaloneDocument: false,
    appliesToNewRegistry: false,
    attestationRef: contracts.assetRegistry.approvalAttestationRef,
    attestationSha256: contracts.assetRegistry.approvalAttestationSha256,
    note: 'Original attestation binds original approved asset records. It does not sign this derived registry, the standalone document, the distribution or downstream artifacts. No offline cryptographic verification is claimed.'
  };
  for (const iconSet of contracts.assetRegistry.iconSets) if (iconSet.approvalDetail?.note) iconSet.approvalDetail.note = 'Owner approval of the unchanged source portfolio icon_set is retained. Historical asset evidence applies only to those source bytes; the current standalone registry is unsigned.';
  for (const subset of contracts.assetRegistry.iconSubsets) if (subset.note === 'FILL 1 variants are excluded from v0.9.1.') subset.note = 'FILL 1 variants are excluded; selected state does not change icon fill.';
  contracts.assetRegistry.approvalAttestationRef = null;
  contracts.assetRegistry.approvalAttestationSha256 = null;
  contracts.assetRegistry.motifRegisterRef.sha256 = sha256(canonicalContractBytes(contracts.motifRegister));
  const receipt = schemas['conformance-receipt.schema.json'];
  receipt.properties.protocolId.pattern = '^lds-v0\\.9\\.6/[A-Z0-9][A-Z0-9-]{2,79}$';
  receipt.description = 'Artifact criterion receipts retain operator attestation requirements. Unsigned standalone document checks use scoped-check-receipt.schema.json and cannot be promoted into this schema by inventing an attestation.';
  schemas['scoped-check-receipt.schema.json'] = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: STANDALONE_SCHEMA_NAMESPACE + 'scoped-check-receipt.schema.json',
    title: 'Standalone0.9.6 scoped document/package check', type: 'object', additionalProperties: false,
    required: ['releaseRef', 'kind', 'signatureStatus', 'fullArtifactConformance', 'checkedAt', 'checks', 'limitations'],
    properties: {
      releaseRef: { const: STANDALONE_RELEASE_REF }, kind: { const: 'scoped_document_package_check' }, signatureStatus: { const: 'unsigned' }, fullArtifactConformance: { const: false }, checkedAt: { type: 'string', format: 'date-time' },
      checks: { type: 'array', minItems: 1, items: { type: 'object', additionalProperties: false, required: ['id','result','evidence'], properties: { id: { type: 'string', minLength: 1 }, result: { enum: ['pass','fail','not_run'] }, evidence: { type: 'string', minLength: 1 } } } },
      limitations: { type: 'array', minItems: 1, items: { type: 'string', minLength: 1 } }
    }
  };
  normalizationLog.push({ area: 'approval', change: 'Original asset attestation moves to historical provenance; current derived registry is unsigned. Separate scoped-check schema cannot claim full artifact conformance. Operational authority and artifact receipt signature controls remain intact.' });

  const provenance = { appliesToHistoricalSourcesOnly: true, sourceHashesDoNotAttestDerivedBytes: true, sourceAssetApproval, unapprovedOgProposal, schemaIdMap, sources, humanMasterSha256: sha256(humanMaster) };
  const bundle = { ruleCatalog, contracts, schemas, normalizationLog, provenance };
  bundle.validation = assertMachineContracts(bundle);
  return bundle;
}

/** Essential consistency checks; deliberately not a claim of artifact conformance. */
export function assertMachineContracts(bundle) {
  const { ruleCatalog, contracts, schemas } = bundle;
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  check(ruleCatalog.rules.length === 64, 'Expected all64 governing rules');
  check(new Set(ruleCatalog.rules.map(x => x.id)).size === 64, 'Rule IDs repeat');
  for (const id of ruleCatalog.requiredCoreRuleIds) check(ruleCatalog.rules.some(x => x.id === id), `Missing required core ${id}`);
  for (const [key, value] of Object.entries(contracts)) check(value.releaseRef === STANDALONE_RELEASE_REF, `${key} has wrong active releaseRef`);
  for (const [name, schema] of Object.entries(schemas)) check(schema.$id === STANDALONE_SCHEMA_NAMESPACE + name, `${name} has wrong schema ID`);
  const cap = schemas['capability-config.schema.json'];
  check(same(cap.$defs.dataTable.properties.cellStates.items.enum, STATES), 'DataTable state enum incomplete');
  check(same(cap.$defs.dataVisualization.properties.valueStates.items.enum, STATES), 'DataVisualization state enum incomplete');
  check(same(cap.$defs.map.properties.dataStates.items.enum, STATES), 'Map state enum incomplete');
  check(same(schemas['social-sidecar.schema.json'].properties.artifact.properties.targetProfileRef.enum, SOCIAL_TARGETS), 'Social targets incomplete');
  check(cap.$defs.motionBrowserObserver.properties.onceOnlyUnobserve.const === false, 'Motion must replay on re-entry');
  check(contracts.assetRegistry.approvalAttestationRef === null, 'New registry must not claim old attestation');
  check(contracts.assetRegistry.motifRegisterRef.sha256 === sha256(canonicalContractBytes(contracts.motifRegister)), 'Normalized motif register hash mismatch');
  const active = JSON.stringify({ ruleCatalog, contracts, schemas });
  const stale = active.match(/.{0,90}(?:one of five states|five-value enum|five EVID-05 states|dark classes are derived|derived dark anchors).{0,100}/);
  check(!stale, 'Stale state or dark derivation requirement: ' + (stale?.[0] ?? ''));
  check(!active.includes('https://landometer.org/design-system/0.9.4/'), 'Unmapped legacy schema reference');
  if (failures.length) throw new Error('Standalone machine consistency failed:\n' + failures.join('\n'));
  return { status: 'pass', scope: 'document-contract-consistency', rules: ruleCatalog.rules.length, schemas: Object.keys(schemas).length, fullArtifactConformance: false, signatureStatus: 'unsigned' };
}
