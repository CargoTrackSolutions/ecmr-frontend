#!/bin/sh
# Renders the runtime configuration and starts nginx.
#   assets/deployment/env.js  <- upstream env.template.js (backend URL, OIDC, theme colours)
#   nginx default.conf        <- nginx.conf.template (CSP connect-src / frame-ancestors)
set -eu

: "${BACKEND_API_URL:?BACKEND_API_URL is required}"
: "${OAUTH_ISSUER:?OAUTH_ISSUER is required}"
: "${OAUTH_CLIENT_ID:?OAUTH_CLIENT_ID is required}"

origin() {
  echo "$1" | sed -E 's#^(https?://[^/]+).*#\1#'
}

export CSP_CONNECT_SRC="${CSP_CONNECT_SRC:-$(origin "$BACKEND_API_URL") $(origin "$OAUTH_ISSUER")}"
export FRAME_ANCESTORS="${FRAME_ANCESTORS:-'self' https://*.cargotrack.ro}"

html=/usr/share/nginx/html
envsubst < "$html/assets/deployment/env.template.js" > "$html/assets/deployment/env.js"
envsubst '${CSP_CONNECT_SRC} ${FRAME_ANCESTORS}' \
  < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
