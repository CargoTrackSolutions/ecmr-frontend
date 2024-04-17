/**
 * Template to replace environment variables during runtime.
 * Needs to be done in assets folder since environment.ts is barely accessible after build.
 * Attention: New environment variables also need to be added to assets/env.js.
 * Detailed Information: https://pumpingco.de/blog/environment-variables-angular-docker/
 */

(function (window) {
  window['env'] = window["env"] || {}

  window['env']['BACKEND_API_URL'] = "${BACKEND_API_URL}";
}(this))
