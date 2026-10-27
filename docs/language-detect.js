// Language detection and automatic redirection based on browser preferences

(function() {
  const PREF_KEY = 'preferred_language';

  function getBase(pathname) {
    if (pathname.includes('/cs/')) {
      return pathname.split('/cs/')[0] + '/';
    }
    let base = pathname.replace(/\/[^/]*\.[^/]*$/, '/');
    if (!base.endsWith('/')) base += '/';
    return base;
  }

  function detectAndRedirect() {
    const pathname = window.location.pathname;
    const base = getBase(pathname);
    const csPath = base + 'cs/';
    const enPath = base;

    const isEnglishRoot = pathname === enPath || pathname === enPath + 'index.html';
    const isCzechRoot = pathname === csPath || pathname === csPath + 'index.html';

    const savedPref = localStorage.getItem(PREF_KEY);

    if (isEnglishRoot) {
      if (savedPref === 'cs') {
        window.location.replace(csPath + window.location.search + window.location.hash);
        return;
      }
      if (!savedPref) {
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
        if (browserLang.startsWith('cs') || browserLang.startsWith('sk')) {
          window.location.replace(csPath + window.location.search + window.location.hash);
          return;
        }
      }
    } else if (isCzechRoot) {
      if (savedPref === 'en') {
        window.location.replace(enPath + window.location.search + window.location.hash);
        return;
      }
    }
  }

  // Intercept user clicking the language switcher to record preference
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[hreflang], .md-select__link');
    if (link) {
      const hreflang = link.getAttribute('hreflang');
      if (hreflang === 'cs') {
        localStorage.setItem(PREF_KEY, 'cs');
      } else if (hreflang === 'en') {
        localStorage.setItem(PREF_KEY, 'en');
      }
    }
  });

  detectAndRedirect();
})();
