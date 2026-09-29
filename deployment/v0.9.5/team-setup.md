# DS 0.9.5 — team activation

[คู่มือเปิดใช้ภาษาไทย](./package/docs/activation-th.md) covers Codex, ChatGPT, Claude Chat/Cowork/Code, Claude Design and the human review/release checks. [Brand and visual continuity](./package/docs/brand-and-visual.md) preserves the 0.9.1 voice and visual foundations.

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
| Human guide | `plugins/landometer-design-system/assets/lds-0.9.5/GUIDE.md` |
| Per-surface evidence | `plugins/landometer-design-system/docs/activation-receipt.template.json` |

For a ChatGPT Project that cannot read the verified plugin/skill files, use the [eight-file Project Source list](./project-source-0.9.5.md). Upload the linked Markdown and JSON files individually, apply the stated rule order in Project instructions, then test in a new chat. The 0.9.5 guide is an overlay on the inherited 0.9.4 normative master; neither the guide alone nor the historical 0.9.1 master is the complete current source. A Project Source upload does not install native fonts, logos, CSS, validators or Claude Design assets.

The repository marketplace is named `landometer`, distinct from an operator’s existing `personal` marketplace. It must be imported/registered before a plugin manager can install from it. The local filesystem installer does not edit marketplace or account settings. Avoid installing both the standalone skill and plugin to the same client unless needed; they carry the same source but can appear twice in discovery.

## Local install and rollback

From a checked-out release, run `python3 tools/install-lds095.py` to see the exact plan; `--apply` performs it. `--targets codex` or `--targets claude` limits the local clients. `--home <isolated-directory>` supports staging/validation. No network download, administrator escalation, account change, or team message is performed by the installer.

The installer verifies the source and staged skill before replacing a skill directory. Changed files/directories are backed up under the home directory’s `.local/state/landometer-ds/backups/<timestamp>/`. The receipt records each changed path, digest and backup root. To roll back, close sessions using the skill, restore only the receipt’s replaced paths from that backup and remove only receipt-listed newly created files/directories. Keep the backup and receipt as historical evidence. Do not delete a whole skill root, user instruction file or unrelated plugin.

New work resolves to 0.9.5. The 0.9.4 resolver entry becomes a thin route with its original preserved in `legacy-0.9.4-SKILL.md`; the historical 0.9.4 apply skill becomes explicit-only. Historical 0.9.1/ijji/CityChat receipts keep their matching packages and trust. The installer does not alter signed historical assets.

## Enforcement boundary

Account/default installation, instruction loading, runtime asset access, artifact validation, human review and required repository checks are separate states. Record them separately. A locally verified package is not proof that every team account is installed. A static artifact validator is not a complete browser/accessibility/brand certificate. Required/default installation cannot guarantee every generated answer.

Platform behavior was checked against official documentation on 2026-09-29; the linked activation guide contains the source links and should be rechecked when administration UI changes.
