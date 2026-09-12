document.addEventListener('DOMContentLoaded', () => {
    const YOUR_EMAIL = 'milasworldofart@yahoo.com';

    function normalizeStatus(text) {
        return (text || '').trim().toLowerCase();
    }

    function labelForStatus(status) {
        if (status === 'available') return '✦ Request this artwork';
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
    const titleEl = document.getElementById('artworkRequestModalTitle');
    const statusEl = document.getElementById('artworkRequestStatus');
    const imgEl = document.getElementById('artworkRequestImage');
    const form = document.getElementById('artworkRequestForm');

    if (!overlay || !form) return;

    function openModal(title, status, imgSrc) {
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
        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const message = form.elements['message'].value.trim();
        const title = form.dataset.artworkTitle;
        const status = form.dataset.artworkStatus;

        const subject = `Artwork Request — ${title}`;
        const bodyLines = [
            `Artwork: ${title}`,
            `Availability: ${status}`,
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            'Message:',
            message || '(no message provided)'
        ];
        const mailto = `mailto:${YOUR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        window.location.href = mailto;
        closeModal();
        form.reset();
    });
});