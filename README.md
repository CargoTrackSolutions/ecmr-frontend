# eCMR Frontend (CargoTrack)

CargoTrack build of the [Open Logistics Foundation eCMR frontend](https://git.openlogisticsfoundation.org/wg-electronictransportdocuments/ecmr/ecmr-frontend)
(Angular 20 + Angular Material), restyled after the TMS-Diurne design and prepared for embedding in the CargoTrack Web App (iframe).
Backend: [ecmr-backend](https://github.com/CargoTrackSolutions/ecmr-backend).

This repository is an **overlay**, not a fork: it does not contain the upstream source code.
The build downloads upstream at a pinned commit and adds CargoTrack's files on top.

```
upstream.lock     pinned upstream commit (bumped by PR, see below)
overlay/          new files copied into the upstream tree (must not override upstream files)
patches/          small changes to upstream files, see patches/README.md
docker/           runtime image (nginx, runtime config, CSP)
config/           environment variable reference
scripts/          assemble.sh - builds the source tree in build/src
```

## What the overlay adds

| File | Purpose |
|---|---|
| `overlay/angular-frontend/src/cargotrack/cargotrack.scss` | CargoTrack look (TMS-Diurne "tmslight"): white surfaces, DM Sans, 8px buttons/cards, 12px outlined fields, light-gray lines, muted table headers, white header and navigation with shadowed active items, normal-case black page titles. Only overrides Material tokens and upstream classes |
| `overlay/angular-frontend/src/assets/cargotrack/embed.js` | Runs before Angular: detects the iframe (or `?embedded=1`) and sets `html.ct-embedded`, takes the UI language from `?lang=`, pins the theme to light |
| `overlay/angular-frontend/src/assets/i18n/ro.json` | Romanian translation: the wording of the earlier CargoTrack build (ecmr-frontend-old, formal address, matches the PDF manuals) plus the keys upstream added since; CI checks for missing keys |
| `overlay/angular-frontend/src/assets/texts/{privacy,imprint}.{ro,en}.html` | Privacy policy and legal notice (Cargo Track Solutions S.R.L.), loaded by upstream's privacy / imprint pages; other UI languages get the English text (nginx fallback) |
| `overlay/angular-frontend/src/app/cargotrack/user-guide/` + `assets/docs/*.pdf` | User guide page (`/user-guide`, public) with the Romanian manuals for sender, carrier and consignee |
| `overlay/angular-frontend/src/app/cargotrack/landing/` + `src/cargotrack/_landing.scss` | Public landing page at `/` (ro/en, factual tone as required for the OLF partner listing); signed-in users and the embedded app go straight to the overview |
| `overlay/angular-frontend/src/assets/cargotrack/favicon.ico` | CargoTrack favicon (upstream OLF icon not used, OLFL §6) |

Brand colours come from upstream's runtime theme variables (`PRIMARY_COLOR`, ...), defaulting to the TMS palette in the image.
Dark mode is not offered (TMS has none). In embedded mode the language picker, avatar and logout are hidden, since the host app owns those.

## Build locally

Requires Git Bash and Node 22 (or only Docker):

```bash
scripts/assemble.sh
cd build/src/angular-frontend && npm ci && npx ng serve      # dev server, upstream development environment
docker build -f docker/Dockerfile -t ecmr-frontend:local .   # from the repository root
```

Upstream tests: `npx ng test --watch=false --browsers=ChromeHeadless` in `build/src/angular-frontend`.

## Run

```bash
docker run -p 8080:8080 --env-file frontend.env ghcr.io/cargotracksolutions/ecmr-frontend:main
```

See [`config/frontend.env.example`](config/frontend.env.example). Required: `BACKEND_API_URL`, `OAUTH_ISSUER`, `OAUTH_CLIENT_ID`.
The backend must list the frontend origin in `WEB_CORS_ORIGINS` and `APP_FRONTEND_URL`. Health check: `GET /healthz`.

## Embedding in the CargoTrack Web App

```html
<iframe src="https://ecmr.cargotrack.ro/ecmr-overview?lang=ro" style="border:0;width:100%;height:100%"></iframe>
```

- Host the frontend under `*.cargotrack.ro` (like TMS-Diurne on `tms2.cargotrack.ro`). The iframe is then cross-origin but
  same-site with the `dsX.cargotrack.ro` dashboards, so browser storage and identity-provider cookies are not treated as third-party.
- `FRAME_ANCESTORS` (CSP) allows `https://*.cargotrack.ro` by default.
- Deep links work: `/ecmr-editor` (new eCMR), `/ecmr-editor/<id>`, `/ecmr-archive`, `/templates-overview`, `/transport-folder`.
- Login: the app uses upstream's OIDC code flow. The identity provider must allow being framed by the frontend
  (Keycloak: realm → Realm settings → Security defenses → `Content-Security-Policy: frame-ancestors 'self' https://*.cargotrack.ro`,
  and `X-Frame-Options` cleared), otherwise the login page cannot load inside the iframe.

## CI

- **Build** (`.github/workflows/build.yml`): assemble → Romanian key check → upstream unit tests → production build → image.
  Pushes `ghcr.io/cargotracksolutions/ecmr-frontend:<overlay-sha>-up<upstream-sha>` and `:main` from `main`.
- **Upstream bump** (`.github/workflows/upstream-bump.yml`): weekly or manual PR moving `upstream.lock` to the latest upstream `main`.
  The PR body lists the commits, the `en.json` diff (to mirror in `ro.json`), and changes to the files the theme depends on.
  Set secret `UPSTREAM_BUMP_TOKEN` so bump PRs get CI checks.

### Upgrade procedure

1. Review the bump PR: add new/changed strings to `ro.json`, rebase or drop patches, check that the backend
   (`ecmr-backend` `upstream.lock`) is at a compatible revision - frontend and backend are released together upstream.
2. Visual check of overview, editor, drawer and embedded mode (shell selectors in `cargotrack.scss` follow upstream markup).
3. Merge → deploy to staging → smoke test → production.

## License

Upstream: Open Logistics Foundation License 1.3 (see upstream `LICENSE`, shipped in the build tree). Patched upstream files
carry a "Modified by CargoTrack" notice. CargoTrack overlay code: proprietary, © CargoTrack.
The OLF license grants no rights to OLF trademarks/logos; the CargoTrack build uses its own title and favicon.
