document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px 400px 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    const aboutImg = document.querySelector('.bio-img');
    if (aboutImg) observer.observe(aboutImg);


    const aboutParagraphs = document.querySelectorAll('.bio-text p');

    aboutParagraphs.forEach((p, index) => {
        p.style.transitionDelay = `${index * 150}ms`;
        observer.observe(p);
    });

    const galleryItems = document.querySelectorAll('.gallery a');

    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 120}ms`;
        observer.observe(item);
    });

});