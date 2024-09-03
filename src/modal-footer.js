document.addEventListener('DOMContentLoaded', () => {
    const modalTyC = document.getElementById('privacy-modal');
    const link = document.getElementById('privacy-link');
    const close = modalTyC.querySelector('.close');
  
    // Abre el modal de Privacy policy
    link.addEventListener('click', (event) => {
      event.preventDefault();
      modalTyC.style.display = 'block';
    });
  
    // Cierra el modal modal Privacy policy
    close.addEventListener('click', () => {
        modalTyC.style.display = 'none';
    });
  
    // Cierra el modal si se hace click afuera de Privacy policy
    window.addEventListener('click', (event) => {
      if (event.target === modalTyC) {
        modalTyC.style.display = 'none';
      }
    });
  });