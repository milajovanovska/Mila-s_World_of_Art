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

    function showView(view) {
        [optionsView, formView, successView].forEach(v => { v.hidden = (v !== view); });
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
            formTitle.textContent = btn.querySelector('.conversation-option-title').textContent;
            form.dataset.topic = btn.dataset.topic;
            showView(formView);
        });
    });

    backBtn.addEventListener('click', () => showView(optionsView));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const captchaToken = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
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
                grecaptcha.reset();
            })
            .catch((err) => {
                console.error('EmailJS error:', err);
                alert('Something went wrong sending your message. Please try again, or email me directly at milasworldofart@yahoo.com.');
                grecaptcha.reset();
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send message';
            });
    });
});