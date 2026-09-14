let recaptchaConversationWidgetId = null;
let recaptchaCustomWidgetId = null;

window.onRecaptchaApiLoad = function () {
    recaptchaConversationWidgetId = grecaptcha.render('recaptchaConversation', {
        sitekey: '6LcmN7ktAAAAALiV4lNaFJRe4CM0i5CnGiHemQm7'
    });
    recaptchaCustomWidgetId = grecaptcha.render('recaptchaCustom', {
        sitekey: '6LcmN7ktAAAAALiV4lNaFJRe4CM0i5CnGiHemQm7'
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startConversationBtn');
    const overlay = document.getElementById('conversationModalOverlay');
    const closeBtn = document.getElementById('conversationModalClose');

    const optionsView = document.getElementById('conversationOptionsView');
    const formView = document.getElementById('conversationFormView');
    const successView = document.getElementById('conversationSuccessView');
    const backBtn = document.getElementById('conversationBackBtn');
    const formTitle = document.getElementById('conversationFormTitle');
    const form = document.getElementById('conversationForm');
    const submitBtn = document.getElementById('conversationSubmitBtn');

    if (!startBtn || !overlay) return;

    const customFormView = document.getElementById('conversationCustomFormView');
    const customForm = document.getElementById('conversationCustomForm');
    const customSubmitBtn = document.getElementById('conversationCustomSubmitBtn');
    const customBackBtn = document.getElementById('conversationCustomBackBtn');

    function showView(view) {
        [optionsView, formView, successView, customFormView].forEach(v => { if (v) v.hidden = (v !== view); });
    }

    function openModal() {
        showView(optionsView);
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

    startBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });

    document.querySelectorAll('.conversation-option').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.topic === 'An idea for a painting') {
                showView(customFormView);
                return;
            }
            formTitle.textContent = btn.querySelector('.conversation-option-title').textContent;
            form.dataset.topic = btn.dataset.topic;
            showView(formView);
        });
    });

    backBtn.addEventListener('click', () => showView(optionsView));
    if (customBackBtn) customBackBtn.addEventListener('click', () => showView(optionsView));

    function uploadReferenceImage(file) {
        if (!file) return Promise.resolve('');
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', window.CLOUDINARY_UPLOAD_PRESET);

        return fetch(`https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(json => json.secure_url || '');
    }

    if (customForm) {
        customForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateRequiredFields(customForm)) return;

            const captchaToken = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse(recaptchaCustomWidgetId) : '';
            if (!captchaToken) {
                alert('Please confirm the "I am not a robot" checkbox before sending.');
                return;
            }

            const file = customForm.elements['image'].files[0];

            customSubmitBtn.disabled = true;
            customSubmitBtn.textContent = file ? 'Uploading image...' : 'Sending...';

            uploadReferenceImage(file)
                .then((imageUrl) => {
                    customSubmitBtn.textContent = 'Sending...';

                    const fields = [
                        ['Description', customForm.elements['description'].value.trim()],
                        ['Preferred colors', customForm.elements['colors'].value.trim()],
                        ['Mood', customForm.elements['mood'].value.trim()],
                        ['Subject/theme', customForm.elements['subject_theme'].value.trim()],
                        ['Dimensions', customForm.elements['dimensions'].value.trim()],
                        ['Room/space', customForm.elements['room'].value.trim()],
                        ['Additional notes', customForm.elements['notes'].value.trim()],
                        ['Reference image', imageUrl || '(none provided)']
                    ];

                    const messageBody = fields
                        .filter(([, value]) => value)
                        .map(([label, value]) => `${label}: ${value}`)
                        .join('\n');

                    const templateParams = {
                        subject: 'New Custom Artwork Request',
                        from_name: customForm.elements['name'].value.trim(),
                        from_email: customForm.elements['email'].value.trim(),
                        message: messageBody,
                        'g-recaptcha-response': captchaToken
                    };

                    return emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, templateParams);
                })
                .then(() => {
                    showView(successView);
                    customForm.reset();
                    grecaptcha.reset(recaptchaCustomWidgetId);
                })
                .catch((err) => {
                    console.error('Custom request error:', err);
                    alert('Something went wrong sending your idea. Please try again, or email me directly at milasworldofart@yahoo.com.');
                    grecaptcha.reset(recaptchaCustomWidgetId);
                })
                .finally(() => {
                    customSubmitBtn.disabled = false;
                    customSubmitBtn.textContent = 'Send idea';
                });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateRequiredFields(form)) return;

        const captchaToken = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse(recaptchaConversationWidgetId) : '';
        if (!captchaToken) {
            alert('Please confirm the "I am not a robot" checkbox before sending.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const templateParams = {
            subject: form.dataset.topic,
            from_name: form.elements['name'].value.trim(),
            from_email: form.elements['email'].value.trim(),
            message: form.elements['message'].value.trim(),
            'g-recaptcha-response': captchaToken
        };

        emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showView(successView);
                form.reset();
                grecaptcha.reset(recaptchaConversationWidgetId);
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                alert('Something went wrong sending your message. Please try again, or email me directly at milasworldofart@yahoo.com.');
                grecaptcha.reset(recaptchaConversationWidgetId);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send message';
            });
    });
});