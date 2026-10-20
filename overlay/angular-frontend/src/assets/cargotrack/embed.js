/*
 * CargoTrack: runs before the Angular app (loaded from index.html, after env.js).
 *
 * - Embedded mode: when the app runs in an iframe (CargoTrack Web App) or is opened with ?embedded=1,
 *   <html> gets the class "ct-embedded"; cargotrack.scss hides chrome the host app already provides.
 * - Language: ?lang=<code> (e.g. from the CargoTrack iframe URL) is written to the key the upstream
 *   AppComponent reads on startup, so the host can pass its UI language.
 * - Theme: the CargoTrack design has no dark variant, so the upstream theme switch is pinned to light.
 *
 * Storage can be unavailable (blocked third-party storage); everything degrades to upstream defaults.
 */
(function () {
  var LANGUAGES = ['ro', 'en', 'de', 'es', 'fr', 'it', 'pl', 'sk', 'cs'];

  var params = new URLSearchParams(window.location.search);
  var inFrame;
  try {
    inFrame = window.self !== window.top;
  } catch (e) {
    inFrame = true;
  }

  function storage(name) {
    try {
      return window[name];
    } catch (e) {
      return null;
    }
  }

  var session = storage('sessionStorage');
  var local = storage('localStorage');

  function attempt(fn) {
    try {
      fn();
    } catch (e) {
      // storage blocked or full
    }
  }

  // Remembered for the tab, so the mode survives the OIDC redirect round trip when opened with ?embedded=1.
  var embedded = inFrame || params.get('embedded') === '1';
  if (!embedded && session) {
    attempt(function () {
      embedded = session.getItem('ct-embedded') === '1';
    });
  }
  if (embedded) {
    document.documentElement.classList.add('ct-embedded');
    if (session) {
      attempt(function () {
        session.setItem('ct-embedded', '1');
      });
    }
  }

  if (local) {
    var lang = (params.get('lang') || '').toLowerCase().slice(0, 2);
    attempt(function () {
      if (LANGUAGES.indexOf(lang) !== -1) {
        local.setItem('selectedLanguage', lang);
      }
      local.setItem('theme', 'light-theme');
    });
  }
}());
