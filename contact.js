document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startConversationBtn');
    const overlay = document.getElementById('conversationModalOverlay');
    const closeBtn = document.getElementById('conversationModalClose');

    if (!startBtn || !overlay || !closeBtn) return;

    function openModal() {
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
});