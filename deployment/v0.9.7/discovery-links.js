// Preserve the reader's language and theme on linked labs.
(() => {
  function sync() {
    const root = document.documentElement;
    for (const link of document.querySelectorAll('[data-lds097-preserve-context]')) {
      const url = new URL(link.getAttribute('href'), location.href);
      url.searchParams.set('lang', root.dataset.locale || root.lang || 'th');
      url.searchParams.set('theme', root.dataset.theme === 'dark' ? 'dark' : 'light');
      link.href = url.href;
    }
  }
  sync();
  new MutationObserver(sync).observe(document.documentElement, {attributes:true, attributeFilter:['data-locale','lang','data-theme']});
})();
