# syntax=docker/dockerfile:1.7
# Build context: repository root, after scripts/assemble.sh
#   docker build -f docker/Dockerfile -t ecmr-frontend .

FROM node:22.12.0-alpine AS build
WORKDIR /app
COPY build/src/angular-frontend/package.json build/src/angular-frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY build/src/angular-frontend/ .
RUN npx ng build --configuration=production --output-path=dist

FROM nginxinc/nginx-unprivileged:1.29-alpine
USER root
RUN apk upgrade --no-cache && rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/browser /usr/share/nginx/html
# OLF License 1.3 §4: recipients of the (modified) work get a copy of the license
COPY build/src/LICENSE /usr/share/nginx/html/LICENSE.txt
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --chmod=755 docker/entrypoint.sh /entrypoint.sh
# Written at startup by the unprivileged user (runtime configuration, see config/frontend.env.example)
RUN touch /usr/share/nginx/html/assets/deployment/env.js /etc/nginx/conf.d/default.conf \
 && chown nginx:nginx /usr/share/nginx/html/assets/deployment/env.js /etc/nginx/conf.d/default.conf
USER nginx
EXPOSE 8080
ENV PRIMARY_COLOR=#2063F3 \
    SECONDARY_COLOR=#00C6DB \
    TERTIARY_COLOR=#49677D \
    ERROR_COLOR=#F32020
ENTRYPOINT ["/entrypoint.sh"]
