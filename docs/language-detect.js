// Language detection and automatic redirection based on browser preferences

(function() {
  const PREF_KEY = 'preferred_language';

  function detectAndRedirect() {
    const pathname = window.location.pathname;
    const isEnglishRoot = pathname === '/' || pathname === '/index.html' || pathname === '';
    const isCzechRoot = pathname === '/cs/' || pathname === '/cs/index.html';

    const savedPref = localStorage.getItem(PREF_KEY);

    if (isEnglishRoot) {
      if (savedPref === 'cs') {
        window.location.replace('/cs/' + window.location.search + window.location.hash);
        return;
      }
      if (!savedPref) {
        const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
        if (browserLang.startsWith('cs') || browserLang.startsWith('sk')) {
          window.location.replace('/cs/' + window.location.search + window.location.hash);
          return;
        }
      }
    } else if (isCzechRoot) {
      if (savedPref === 'en') {
        window.location.replace('/' + window.location.search + window.location.hash);
        return;
      }
    }
  }

  // Intercept user clicking the language switcher to record preference
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[hreflang], .md-select__link, .md-header__option a');
    if (link) {
      const href = link.getAttribute('href') || '';
      const hreflang = link.getAttribute('hreflang') || '';
      if (hreflang === 'cs' || href.includes('/cs/')) {
        localStorage.setItem(PREF_KEY, 'cs');
      } else if (hreflang === 'en' || href === '/' || href.endsWith('/')) {
        localStorage.setItem(PREF_KEY, 'en');
      }
    }
  });

  detectAndRedirect();
})();
