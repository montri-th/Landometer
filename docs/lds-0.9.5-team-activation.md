# DS 0.9.5 — team activation

[คู่มือเปิดใช้ภาษาไทย](../plugins/landometer-design-system/docs/activation-th.md) covers Codex, ChatGPT, Claude Chat/Cowork/Code, Claude Design and the human review/release checks. [Brand and visual continuity](../plugins/landometer-design-system/docs/brand-and-visual.md) preserves the 0.9.1 voice and visual foundations.

## Distribution files

| Consumer | Source |
|---|---|
| OpenAI workspace marketplace | `.agents/plugins/marketplace.json` |
| Portable plugin | `plugins/landometer-design-system/plugin.json` |
| Codex compatibility manifest | `plugins/landometer-design-system/.codex-plugin/plugin.json` |
| Claude marketplace | `.claude-plugin/marketplace.json` |
| Claude plugin | `plugins/landometer-design-system/.claude-plugin/plugin.json` |
| Shared skill | `plugins/landometer-design-system/skills/apply-landometer-design-system/SKILL.md` |
| Local installer | `tools/install-lds095.py` — dry-run by default |
| Machine assets | `plugins/landometer-design-system/assets/lds-0.9.5/machine/` |
| Complete normative | `plugins/landometer-design-system/assets/lds-0.9.5/normative/Landometer-Design-System-v0.9.5.md` |
| Per-surface evidence | `plugins/landometer-design-system/docs/activation-receipt.template.json` |

For ChatGPT or Claude Projects, upload the **complete standalone LDS 0.9.5 Markdown** from the [Project Source selector](../deployment/v0.9.5/project-source-0.9.5.md). For ijji or CityChat, also upload its **separate current Product Add-on**. CityWiki uses the same base-plus-profile arrangement. The base follows the 0.9.1 structure updated in place to 0.9.5 and includes exact machine JSON. Product Add-ons contain product rules only; they bind the exact base and do not copy LDS. No 0.9.4 master, predecessor overlay or eight-file set is required. JSON is a lossless alternative to each document's Markdown; do not upload both formats.

Set Project Instructions to name LDS as the current shared normative and the applicable Add-on as scoped product rules. Remove or retire previous DS masters, fragmented machine sources and replaced Add-on revisions after the new sources are available; preserve business briefs, research, factual evidence, rights and product operational requirements. Test retrieval in a new session from both files where applicable: document identities, exact density.capita dark seven-class colors, protected voice, motion and product rules. Uploading normative documents does not install binary fonts, logos or runtime code: use the complete plugin assets for rendering.

Current normative revision: **standalone-0.9.5-r2**. Documentation package revision: **standalone-0.9.5-r2-docs1**; normative files are unchanged. Approved design values remain **v0.9.5-owner.1 / color-srgb-08**. Use the [standalone release](https://github.com/montri-th/Landometer/releases/tag/v0.9.5-standalone-r2-docs1); earlier distributions remain historical records.

The repository marketplace is named `landometer`, distinct from an operator’s existing `personal` marketplace. It must be imported/registered before a plugin manager can install from it. The local filesystem installer does not edit marketplace or account settings. Avoid installing both the standalone skill and plugin to the same client unless needed; they carry the same source but can appear twice in discovery.

## Local install and rollback

From a checked-out release, run `python3 tools/install-lds095.py` to see the exact plan; `--apply` performs it. `--targets codex` or `--targets claude` limits the local clients. `--home <isolated-directory>` supports staging/validation. No network download, administrator escalation, account change, or team message is performed by the installer.

The installer verifies the source and staged skill before replacing a skill directory. Changed files/directories are backed up under the home directory’s `.local/state/landometer-ds/backups/<timestamp>/`. The receipt records each changed path, digest and backup root. To roll back, close sessions using the skill, restore only the receipt’s replaced paths from that backup and remove only receipt-listed newly created files/directories. Keep the backup and receipt as historical evidence. Do not delete a whole skill root, user instruction file or unrelated plugin.

New work resolves to 0.9.5. The 0.9.4 resolver entry becomes a thin route with its original preserved in `legacy-0.9.4-SKILL.md`; the historical 0.9.4 apply skill becomes explicit-only. Historical 0.9.1/ijji/CityChat receipts keep their matching packages and trust. The installer does not alter signed historical assets.

## Enforcement boundary

Account/default installation, instruction loading, runtime asset access, artifact validation, human review and required repository checks are separate states. Record them separately. A locally verified package is not proof that every team account is installed. A static artifact validator is not a complete browser/accessibility/brand certificate. Required/default installation cannot guarantee every generated answer.

Platform behavior was checked against official documentation on 2026-09-29; the linked activation guide contains the source links and should be rechecked when administration UI changes.
