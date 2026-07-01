(function () {
    var root = document.documentElement;
    var toggleBtn = document.getElementById('themeToggle');

    function setPressed(isDark) {
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        }
    }

    var savedTheme = localStorage.getItem('theme');
    var isDark = savedTheme === 'dark';
    if (isDark) {
        root.classList.add('dark-mode');
    }
    setPressed(isDark);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            var nowDark = root.classList.toggle('dark-mode');
            localStorage.setItem('theme', nowDark ? 'dark' : 'light');
            setPressed(nowDark);
        });
    }
})();