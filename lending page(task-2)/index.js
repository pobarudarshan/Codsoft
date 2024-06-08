document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.createElement('button');
    navToggle.innerHTML = '☰';
    navToggle.classList.add('nav-toggle');
    document.querySelector('nav').prepend(navToggle);

    navToggle.addEventListener('click', () => {
        document.querySelector('nav ul').classList.toggle('show');
    });
});