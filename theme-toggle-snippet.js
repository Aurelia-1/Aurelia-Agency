/* ============================================================
   THEME TOGGLE — replace/update your existing themeToggle code
   Works for: index.html, projects.html, team.html
   
   THEMES: dark (default) → light → blue → dark ...
   ============================================================ */

(function () {
  const THEMES = ['dark', 'light', 'blue'];
  const STORAGE_KEY = 'aurelia-theme';

  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-blue');
    if (theme === 'light') document.body.classList.add('theme-light');
    if (theme === 'blue')  document.body.classList.add('theme-blue');
  }

  // On load, restore saved theme
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);

  // Hook toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = localStorage.getItem(STORAGE_KEY) || 'dark';
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      // Update tooltip/title
      themeToggle.title = next === 'dark' ? 'Switch to Light' : next === 'light' ? 'Switch to Blue' : 'Switch to Dark';
    });
  }
})();
