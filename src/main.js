import './main.scss';
import menuData from './menu.json';
import partnersData from './partners.json';
import './assets/fonts/Marcheile-Bold-Condensed.woff';
import './assets/fonts/Marcheile-Bold-Condensed.woff2';
import { createShoppingCart, clearCart, removeProduct, shoppingCartCounter, saveLocalStorage, addProductsToCart } from './shoppingCart.js';
import { addPartners } from './partners.js';

// Inicialización del carrito de compras desde el almacenamiento local o creación de uno nuevo si no existe
export let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

// Función para actualizar el carrito en el almacenamiento local y en otros módulos
export const updateShoppingCart = (newCart) => {
    shoppingCart = newCart;
    saveLocalStorage();
    shoppingCartCounter();
};

// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    const btnShoppingCart = document.getElementById('btnShoppingCart'); // Botón para mostrar el carrito
    const products = menuData.menuList; // Obtiene la lista de productos desde el archivo JSON

    // Añade productos al index al cargar la página
    addProductsToCart(products);

    // Asigna la función para mostrar el carrito cuando se hace clic en el botón de carrito de compras
    btnShoppingCart.addEventListener("click", createShoppingCart);

    // Actualiza el contador del carrito al cargar la página
    shoppingCartCounter();

    // Crea el HTML para mostrar la sección Partners
    const partners = partnersData.partnersList;
    addPartners(partners);
    
});