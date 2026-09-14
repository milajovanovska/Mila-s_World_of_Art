# Mila's World of Art

A responsive portfolio and interactive digital gallery designed to showcase my artwork, artistic journey, exhibitions, interviews, and merchandise in a modern and visually engaging way.

The project combines clean UI design, responsive layouts, subtle animations, and interactive contact/request features to create an immersive browsing experience while serving as my personal online portfolio.

**Live Demo:** https://milajovanovska.github.io/Mila-s_World_of_Art/

## About the Project

Mila's World of Art is a front-end web application developed to present both my artistic work and professional background in a single place, while also letting visitors interact directly with the gallery, asking about pieces, requesting to purchase available artwork, or commissioning something new.

The website includes:

* Home page with an introduction
* About Me section
* Artwork gallery with live availability status (Available / Reserved / Sold)
* Exhibitions
* Interviews and media appearances
* Merchandise
* Contact page with a guided "Start a conversation" flow
* Per-painting artwork request system
* Custom artwork/commission request form with reference image upload

The goal of this project was not only to build a visually appealing portfolio, but also to practice responsive web development, modern CSS techniques, interactive user interfaces, and integrating third-party services (email delivery, spam protection, image hosting) into a fully static, backend-free site.

## Features

* Responsive design for desktop, tablet, and mobile devices
* Modern navigation with a responsive hamburger menu
* Circular logo mark with brand wordmark in the header
* Light/dark mode toggle with persisted preference
* Interactive image gallery with hover-revealed availability status
* "Start a conversation" modal with guided topics (ask about an artwork, share an idea, request a piece, or ask about seeing it in your space)
* Per-painting "Request this artwork" / "Ask about this artwork" / "Ask about this piece" buttons, driven by each painting's live status
* Custom artwork/commission request form (description, colors, mood, subject, dimensions, room, notes) with optional reference image upload
* All requests delivered by email via EmailJS, with Google reCAPTCHA v2 spam protection and required-field validation
* Reference images uploaded to Cloudinary and linked in the resulting email
* Smooth scrolling reveal animations
* Hover effects and transitions throughout
* Clean and organized layout
* Merchandise showcase
* Contact section with direct social/email links

## Technologies Used

* HTML5
* CSS3
* JavaScript (vanilla, no frameworks)
* Flexbox
* CSS Grid
* Media Queries
* CSS Animations & Transitions
* [EmailJS](https://www.emailjs.com/) - client-side email delivery from a static site
* [Google reCAPTCHA v2](https://www.google.com/recaptcha/about/) - spam/bot protection on all forms
* [Cloudinary](https://cloudinary.com/) - unsigned browser uploads for reference images

## Responsive Design

The website has been optimized for multiple screen sizes using responsive design techniques.
Supported devices include:

* Desktop
* Laptop
* Tablet
* Mobile phones

Responsive improvements include:

* Adaptive layouts
* Flexible image scaling
* Responsive gallery
* Mobile navigation with hamburger menu
* Optimized spacing and typography
* Responsive modals and forms for all contact/request flows

## Configuration

This site sends real emails from a fully static, backend-free deployment. `email-config.js` holds the public-facing configuration needed for that:

* EmailJS public key, service ID, and template ID (safe to expose client-side by design- EmailJS's public key is the equivalent of a publishable key, not a secret)
* Cloudinary cloud name and unsigned upload preset (also safe to expose- the preset only permits uploads, nothing else)

No secret API keys are ever stored in this repository or exposed in the browser.

## What I Learned

Through this project I gained practical experience with:

* Semantic HTML structure
* Responsive web design
* CSS Flexbox
* CSS Grid
* Mobile-first thinking
* JavaScript DOM manipulation
* Responsive navigation
* Building and coordinating multi-step modal UI flows
* Integrating third-party APIs (EmailJS, reCAPTCHA, Cloudinary) into a static site without a backend
* Form validation and spam protection
* Website organization and file structure
* Git and GitHub workflow, including tagged releases

## Author

Mila Jovanovska
GitHub: https://github.com/milajovanovska
LinkedIn: https://www.linkedin.com/in/milajovanovsska/

## License

This project is intended for educational and portfolio purposes.
Artwork and website content are © Mila Jovanovska. Unauthorized reproduction or commercial use of the artwork is not permitted without permission.
