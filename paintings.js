const RECAPTCHA_SITE_KEY = '6LcmN7ktAAAAALiV4lNaFJRe4CM0i5CnGiHemQm7';

let artworkWidgetId = null;
let recaptchaApiReady = false;
let paintingsDomReady = false;

function renderArtworkRecaptcha() {
    if (!recaptchaApiReady || !paintingsDomReady || artworkWidgetId !== null) return;
    const holder = document.getElementById('recaptchaArtwork');
    if (!holder) return;
    artworkWidgetId = grecaptcha.render(holder, { sitekey: RECAPTCHA_SITE_KEY });
}

window.onRecaptchaApiLoad = function () {
    recaptchaApiReady = true;
    renderArtworkRecaptcha();
};

document.addEventListener('DOMContentLoaded', () => {
    paintingsDomReady = true;
    renderArtworkRecaptcha();

    const cards = document.querySelectorAll('.painting-card');
    const touchQuery = window.matchMedia('(hover: none)');

    function clearActive(except) {
        cards.forEach(card => {
            if (card !== except) card.classList.remove('is-active');
        });
    }

    cards.forEach(card => {
        const link = card.querySelector('a');
        if (!link) return;

        link.addEventListener('click', (e) => {
            if (!touchQuery.matches) return;
            if (!card.classList.contains('is-active')) {
                e.preventDefault();
                clearActive(card);
                card.classList.add('is-active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.painting-card') && !e.target.closest('.conversation-modal-overlay')) clearActive(null);
    });

    const overlay = document.getElementById('artworkRequestModalOverlay');
    const closeBtn = document.getElementById('artworkRequestModalClose');
    const detailsView = document.getElementById('artworkRequestDetailsView');
    const successView = document.getElementById('artworkRequestSuccessView');
    const titleEl = document.getElementById('artworkRequestModalTitle');
    const imgEl = document.getElementById('artworkRequestImage');
    const form = document.getElementById('artworkRequestForm');
    const submitBtn = form ? form.querySelector('.artwork-request-submit') : null;

    if (!overlay || !form) return;

    const facts = {
        status: document.getElementById('artworkFactStatus'),
        technique: document.getElementById('artworkFactTechnique'),
        dimensions: document.getElementById('artworkFactDimensions'),
        price: document.getElementById('artworkFactPrice')
    };

    const factRows = {
        technique: document.getElementById('artworkFactTechniqueRow'),
        dimensions: document.getElementById('artworkFactDimensionsRow'),
        price: document.getElementById('artworkFactPriceRow')
    };

    function showView(view) {
        [detailsView, successView].forEach(v => { v.hidden = (v !== view); });
    }

    function setFact(key, value) {
        facts[key].textContent = value || '';
        if (factRows[key]) factRows[key].hidden = !value;
    }

    function openModal(card) {
        const title = card.dataset.title || 'Artwork';
        const statusEl = card.querySelector('.painting-status');
        const status = statusEl ? statusEl.textContent.trim() : '';
        const info = (window.ARTWORK_DETAILS && window.ARTWORK_DETAILS[title]) || {};
        const isSold = status.toLowerCase() === 'sold';

        let price = '';
        if (info.price) {
            price = `${info.price} EUR`;
        } else if (!isSold) {
            price = 'On request';
        }

        const imgNode = card.querySelector('img');
        const imgSrc = imgNode ? imgNode.getAttribute('src') : '';

        showView(detailsView);
        titleEl.textContent = title;
        setFact('status', status);
        setFact('technique', info.technique);
        setFact('dimensions', info.dimensions);
        setFact('price', price);

        if (imgSrc) {
            imgEl.src = imgSrc;
            imgEl.alt = title;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }

        form.dataset.artworkTitle = title;
        form.dataset.artworkStatus = status;
        form.dataset.artworkTechnique = info.technique || '';
        form.dataset.artworkDimensions = info.dimensions || '';
        form.dataset.artworkPrice = info.price ? `${info.price} EUR` : '';

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function validateRequiredFields(formEl) {
        const requiredFields = formEl.querySelectorAll('[required]');
        for (const field of requiredFields) {
            if (!field.value.trim()) {
                alert('Please fill in all required fields before sending.');
                field.focus();
                return false;
            }
        }
        return true;
    }

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.painting-card');
            if (card) openModal(card);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateRequiredFields(form)) return;

        if (typeof grecaptcha === 'undefined' || artworkWidgetId === null) {
            alert('The security check did not load. Please refresh the page and try again.');
            return;
        }

        const captchaToken = grecaptcha.getResponse(artworkWidgetId);
        if (!captchaToken) {
            alert('Please confirm the "I am not a robot" checkbox before sending.');
            return;
        }

        if (typeof emailjs === 'undefined') {
            alert('The email service did not load. Please refresh the page and try again.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const userMessage = form.elements['message'].value.trim();

        const details = [
            ['Artwork', form.dataset.artworkTitle],
            ['Status', form.dataset.artworkStatus],
            ['Technique', form.dataset.artworkTechnique],
            ['Dimensions', form.dataset.artworkDimensions],
            ['Price', form.dataset.artworkPrice]
        ]
            .filter(([, value]) => value)
            .map(([label, value]) => `${label}: ${value}`)
            .join('\n');

        const templateParams = {
            subject: `Artwork Inquiry - ${form.dataset.artworkTitle}`,
            from_name: form.elements['name'].value.trim(),
            from_email: form.elements['email'].value.trim(),
            message: `${details}\n\n${userMessage || '(no message provided)'}`,
            'g-recaptcha-response': captchaToken
        };

        emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showView(successView);
                form.reset();
                grecaptcha.reset(artworkWidgetId);
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                alert('Something went wrong sending your inquiry. Please try again, or email me directly at milasworldofart@yahoo.com.');
                grecaptcha.reset(artworkWidgetId);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send inquiry';
            });
    });
});