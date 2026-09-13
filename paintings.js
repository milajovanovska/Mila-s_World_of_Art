document.addEventListener('DOMContentLoaded', () => {
    function normalizeStatus(text) {
        return (text || '').trim().toLowerCase();
    }

    function labelForStatus(status) {
        if (status === 'available') return 'Request this artwork';
        if (status === 'reserved') return 'Ask about this artwork';
        if (status === 'sold') return 'Ask about this piece';
        return 'Ask about this piece';
    }

    document.querySelectorAll('.painting-card').forEach(card => {
        const statusEl = card.querySelector('.painting-status');
        const statusText = statusEl ? statusEl.textContent.trim() : 'Not specified';
        const btn = card.querySelector('.request-artwork-btn');
        if (btn) {
            btn.textContent = labelForStatus(normalizeStatus(statusText));
            btn.dataset.status = statusText;
        }
    });

    const overlay = document.getElementById('artworkRequestModalOverlay');
    const closeBtn = document.getElementById('artworkRequestModalClose');
    const detailsView = document.getElementById('artworkRequestDetailsView');
    const successView = document.getElementById('artworkRequestSuccessView');
    const titleEl = document.getElementById('artworkRequestModalTitle');
    const statusEl = document.getElementById('artworkRequestStatus');
    const imgEl = document.getElementById('artworkRequestImage');
    const form = document.getElementById('artworkRequestForm');
    const submitBtn = form ? form.querySelector('.artwork-request-submit') : null;

    if (!overlay || !form) return;

    function showView(view) {
        [detailsView, successView].forEach(v => { v.hidden = (v !== view); });
    }

    function openModal(title, status, imgSrc) {
        showView(detailsView);
        titleEl.textContent = title;
        statusEl.textContent = status;
        if (imgSrc) {
            imgEl.src = imgSrc;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
        form.dataset.artworkTitle = title;
        form.dataset.artworkStatus = status;
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

    document.querySelectorAll('.request-artwork-btn').forEach(btn => {

        btn.addEventListener('click', () => {
            const card = btn.closest('.painting-card');
            const title = card.dataset.title || 'this artwork';
            const status = btn.dataset.status || 'Not specified';
            const imgSrc = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';
            openModal(title, status, imgSrc);
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

        const captchaToken = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
        if (!captchaToken) {
            alert('Please confirm the "I am not a robot" checkbox before sending.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const title = form.dataset.artworkTitle;
        const status = form.dataset.artworkStatus;
        const userMessage = form.elements['message'].value.trim();

        const templateParams = {
            subject: `Artwork Request — ${title}`,
            from_name: form.elements['name'].value.trim(),
            from_email: form.elements['email'].value.trim(),
            message: `Artwork: ${title}\nAvailability: ${status}\n\n${userMessage || '(no message provided)'}`,
            'g-recaptcha-response': captchaToken
        };

        emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showView(successView);
                form.reset();
                grecaptcha.reset();
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                alert('Something went wrong sending your request. Please try again, or email me directly at milasworldofart@yahoo.com.');
                grecaptcha.reset();
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send request';
            });
    });
});