// Activa el menu mobile al hacer click en el icono de hamburguesa 
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navbarLinks = document.querySelector('.navbar-links');

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        navbarLinks.classList.toggle('active');
    });
});