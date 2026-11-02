document.addEventListener('DOMContentLoaded', () => {
    const touchQuery = window.matchMedia('(hover: none)');
    const cards = document.querySelectorAll('.flip-card');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!touchQuery.matches) return;
            if (e.target.closest('a')) return;

            const willFlip = !card.classList.contains('is-flipped');
            cards.forEach(c => c.classList.remove('is-flipped'));
            if (willFlip) card.classList.add('is-flipped');
        });
    });
});