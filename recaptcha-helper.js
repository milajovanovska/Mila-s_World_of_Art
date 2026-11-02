(function () {
    const SITE_KEY = '6LcmN7ktAAAAALiV4lNaFJRe4CM0i5CnGiHemQm7';
    const LOAD_TIMEOUT_MS = 8000;

    const registered = [];
    const widgetIds = {};
    let apiReady = false;

    function getNote(holder) {
        const wrapper = holder.closest('.recaptcha-wrapper') || holder;
        let note = wrapper.nextElementSibling;
        if (!note || !note.classList.contains('recaptcha-note')) {
            note = document.createElement('p');
            note.className = 'recaptcha-note';
            wrapper.insertAdjacentElement('afterend', note);
        }
        return note;
    }

    function showNote(holder, text) {
        getNote(holder).textContent = text;
    }

    function clearNote(holder) {
        const wrapper = holder.closest('.recaptcha-wrapper') || holder;
        const note = wrapper.nextElementSibling;
        if (note && note.classList.contains('recaptcha-note')) note.remove();
    }

    function render(entry) {
        const holder = document.getElementById(entry.id);
        if (!holder || widgetIds[entry.id] !== undefined) return;

        try {
            const widgetId = grecaptcha.render(holder, {
                sitekey: SITE_KEY,
                callback: function () { clearNote(holder); },
                'expired-callback': function () {
                    showNote(holder, 'The security check expired. Please tick the box again.');
                },
                'error-callback': function () {
                    showNote(holder, 'The security check lost its connection. Check your internet connection, then tick the box again.');
                }
            });
            widgetIds[entry.id] = widgetId;
            if (entry.onReady) entry.onReady(widgetId);
        } catch (err) {
            console.error('reCAPTCHA render error:', err);
            showNote(holder, 'The security check could not start: ' + err.message);
        }
    }

    window.onRecaptchaApiLoad = function () {
        apiReady = true;
        registered.forEach(render);
    };

    window.RecaptchaHelper = {
        register: function (id, onReady) {
            const entry = { id: id, onReady: onReady };
            registered.push(entry);

            const holder = document.getElementById(id);
            if (holder && window.location.protocol === 'file:') {
                showNote(holder, 'reCAPTCHA does not work when the page is opened as a file. Open it through the browser icon in WebStorm (localhost) or the live website.');
                return;
            }

            if (apiReady) render(entry);
        }
    };

    window.setTimeout(function () {
        if (apiReady) return;
        registered.forEach(function (entry) {
            const holder = document.getElementById(entry.id);
            if (holder && !holder.querySelector('iframe')) {
                showNote(holder, 'The security check did not load. An ad blocker, a privacy setting or your connection may be blocking google.com/recaptcha. Allow it and reload the page.');
            }
        });
    }, LOAD_TIMEOUT_MS);
})();