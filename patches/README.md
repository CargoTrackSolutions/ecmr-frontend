# Patches

Changes to upstream files that cannot be done via `overlay/` (new files only) or configuration.
Keep them few and small: the CargoTrack look lives in `overlay/angular-frontend/src/cargotrack/cargotrack.scss`,
the patches only wire it in.

| Patch | What | Upstream? |
|---|---|---|
| `0001-cargotrack-shell.patch` | `angular.json`: adds `cargotrack.scss` after `styles.scss`; `index.html`: title, favicon, DM Sans, `embed.js` | No, CargoTrack-specific |
| `0002-romanian-language.patch` | Romanian in the language list (translations: `overlay/.../i18n/ro.json`) | Yes, candidate for a merge request |
| `0003-user-guide.patch` | `/user-guide` route; the drawer's "User Guide & Docs" entry (no target upstream) links to it | No, CargoTrack-specific |
| `0004-share-dialog-groups-admin-only.patch` | Share dialogs request the all-groups list only for admins (backend: 403 for others) | Yes, candidate for a merge request |
| `0005-landing-page.patch` | `/` shows the public landing page instead of redirecting to the overview | No, CargoTrack-specific |

Rules:
- One change per file, numbered: `0003-short-description.patch`, created with `git diff` in an assembled tree
  (`cd build/src && git init -q && git add -A && git commit -qm base`, edit, `git diff > ../../patches/...`).
- Patched source files get a "Modified by CargoTrack" note (OLF License 1.3 §4 requires a prominent notice).
- Several upstream files use CRLF line endings; patches are stored byte-exact (`.gitattributes`: `-text`).
- For patches meant for upstream: link the merge request in the first line, delete the patch once the lock is bumped past it.
- `scripts/assemble.sh` fails if a patch no longer applies - the upstream bump PR will show it.
