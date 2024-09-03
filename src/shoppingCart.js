
// Importación de la función para actualizar el carrito desde el main.js
import { shoppingCart, updateShoppingCart } from './main.js';

// Selección de elementos del DOM que se van a usar para mostrar el carrito y la cantidad de productos
const modalContainer = document.getElementById('modal-shoppingCart');// Div del modal del carrito
const quantityShoppingCart = document.getElementById('quantityShoppingCart');// Contador de productos
const btnShoppingCart = document.getElementById('btnShoppingCart'); // Botón para abrir el carrito

// Función para guardar el carrito de compras en el almacenamiento local
export const saveLocalStorage = () => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};

// Función para añadir productos al carrito y gestionar los eventos de clic
export const addProductsToCart = (products) => {
    const cartContent = document.getElementById('cart');
    cartContent.innerHTML = "";

    products.forEach(product => {
        let content = document.createElement('div');
        content.className = 'cart-content';
        // Crear el HTML para el contenido del producto
        let priceHTML = `<h3 class="cart-precio${product.menuDiscount > 0.0 ? ' cart-price-old' : ''}">${product.menuPrice} €</h3>`;

        // Si hay descuento, agrupar los precios en un div con clase .price-discounted
        if (product.menuDiscount > 0.0) {
            const discountedPrice = (product.menuPrice - (product.menuPrice * product.menuDiscount)).toFixed(2);
            priceHTML = `
                <div class="price-discounted">
                    ${priceHTML}
                    <h3 class="cart-precio-oferta">${discountedPrice} €</h3>
                </div>`;
        }

        // Crear el HTML final del producto
        content.innerHTML = ` 
            <img class="img-fluid" alt="${product.menuName}" src="${product.menuImage}">
            <h2 class="cart-titulo">${product.menuName}</h2>
            <p class="cart-description">${product.menuDescription}</p>
            ${priceHTML}`;

        cartContent.append(content);
        // Crea boton de agregar el producto al carrito
        let shop = document.createElement('button');
        shop.innerText = "Add to Cart";
        shop.className = 'btn-shop';
        content.append(shop);

        // Aca se fija con un map si el producto ya se agrego y le suma la cantidad en caso de ser asi
        shop.addEventListener("click", () => {
            const repeat = shoppingCart.some((repeatProduct) => repeatProduct.id === product.menuId);
            if (repeat) {
                const newCart = shoppingCart.map((prod) => {
                    if (prod.id === product.menuId) {
                        prod.quantity++;
                    }
                    return prod;
                });
                updateShoppingCart(newCart);
            } else {
                const newCart = [...shoppingCart, {
                    id: product.menuId,
                    img: product.menuImage,
                    name: product.menuName,
                    price: product.menuPrice,
                    quantity: 1,
                    discount: product.menuDiscount,
                }];
                updateShoppingCart(newCart);
            }
            showNotification();
        });
    });
};
// Aca crea la notificacion flotante de que se agrego un nuevo producto
const showNotification = () => {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
};

// Función para crear y mostrar el carrito de compras en el modal-shoppingCart
export const createShoppingCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `<h1 class="modal-titulo">ShoppingCart</h1>`;
    modalContainer.append(modalHeader);

    // crea el boton de cerrar modal
    const modalButton = document.createElement("h1");
    modalButton.innerHTML = "X";
    modalButton.className = "modal-close";
    modalButton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });
    modalHeader.append(modalButton);
    // se fija si el carrito tiene algun producto, si es asi muestra el cartel de carrito vacio, sino muestra los productos añadidos
    if (shoppingCart.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-cart-message";
        emptyMessage.innerHTML = "<h2>Your Cart is Empty</h2>";
        modalContainer.append(emptyMessage);
        quantityShoppingCart.style.display = "none";

        const clearCartButton = document.querySelector(".clear-cart");
        if (clearCartButton) {
            clearCartButton.style.display = "none";
        }
    } else {
        const headerRow = document.createElement("div");
        headerRow.className = "cart-header-row";
        headerRow.innerHTML = `
            <div class="cart-header-product">Products</div>
            <div class="cart-header-price">Price</div>
            <div class="cart-header-quantity">Quantity</div>
            <div class="cart-header-total">Total</div>
        `;
        modalContainer.append(headerRow);

        shoppingCart.forEach((product) => {
            let shoppingCartContent = document.createElement("div");
            shoppingCartContent.className = "modal-content";
            shoppingCartContent.innerHTML = `
                <img class="img-fluid" alt="${product.name}" src="${product.img}">
                <h3 class="nombre-cart">${product.name}</h3>
                <h3 class="cart-precio">${(product.price - (product.price * product.discount)).toFixed(2)} €</h3>
                <div class="cantidad-cart">
                    <button class="subtract"> - </button>
                    <h4>${product.quantity}</h4>
                    <button class="more"> + </button>
                </div>
                <button class="delete-product">Delete</button>
                <h2 class="total-product"> Total + VAT: ${(product.quantity * product.price * 1.21).toFixed(2)}</h2>
            `;
            modalContainer.append(shoppingCartContent);
            // Botton para restar producto desde el carrito
            let subtract = shoppingCartContent.querySelector(".subtract");
            subtract.addEventListener("click", () => {
                if (product.quantity > 1) {
                    product.quantity--;
                } else {
                    removeProduct(product.id); // Eliminar el producto si la cantidad es 0 o menor
                }
                saveLocalStorage();
                createShoppingCart();
                shoppingCartCounter();
            });
            // Botton para sumar producto desde el carrito
            let more = shoppingCartContent.querySelector(".more");
            more.addEventListener("click", () => {
                product.quantity++;
                saveLocalStorage();
                createShoppingCart();
                shoppingCartCounter();
            });
            // Botton para eliminar producto desde el carrito
            let deleteProduct = shoppingCartContent.querySelector(".delete-product");
            deleteProduct.addEventListener("click", () => {
                removeProduct(product.id);
            });
        });

        // totales

        const total = shoppingCart.reduce((acc, productShopping) => acc + (productShopping.price - (productShopping.price * productShopping.discount)) * productShopping.quantity, 0);
        const totalIVA = shoppingCart.reduce((acc, productShopping) => acc + (productShopping.price - (productShopping.price * productShopping.discount)) * productShopping.quantity * 1.21, 0);

        const totalBuying = document.createElement("div");
        totalBuying.className = "modal-total";
        totalBuying.innerHTML = `<h1>Total: $${total.toFixed(2)}</h1><hr><h1>Total + VAT: $${totalIVA.toFixed(2)}</h1>`;
        modalContainer.append(totalBuying);

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "modal-buttons";

        // Botton para vaciar el carrito
        let clearCartButton = document.querySelector(".clear-cart");
        if (!clearCartButton) {
            clearCartButton = document.createElement("button");
            clearCartButton.innerHTML = "Empty Cart";
            clearCartButton.className = "clear-cart";
            clearCartButton.addEventListener("click", () => {
                clearCart();
                createShoppingCart();
                shoppingCartCounter();
            });
            buttonContainer.append(clearCartButton);
        }

        // Boton  de "Finalizar compra"
        const finalizeButton = document.createElement("button");
        finalizeButton.innerHTML = "Checkout";
        finalizeButton.className = "finalize-purchase";
        finalizeButton.addEventListener("click", finalizePurchase);
        buttonContainer.append(finalizeButton);

        modalContainer.append(buttonContainer);

    }

    shoppingCartCounter();
};

// Función para finalizar la compra
export const finalizePurchase = () => {
    // Guardar la información del carrito en el localStorage antes de vaciarlo
    const finalCart = shoppingCart.map(product => ({
        name: product.name,
        quantity: product.quantity,
        totalPriceWithIVA: (product.quantity * product.price * 1.21).toFixed(2)
    }));
    localStorage.setItem("finalCart", JSON.stringify(finalCart));

    // Limpiar el contenido del modal y mostrar la información final de la compra
    modalContainer.innerHTML = "";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `<h1 class="modal-titulo">Your order is complete</h1>`;
    modalContainer.append(modalHeader);

    const modalButton = document.createElement("h1");
    modalButton.innerHTML = "X";
    modalButton.className = "modal-close";
    modalButton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });
    modalHeader.append(modalButton);
    // Genera un HTML con el contenido del pedido realizado
    const purchaseList = document.createElement("div");
    purchaseList.className = "modal-content-finalize";
    purchaseList.innerHTML = `<h2>Order details</h2>`;
    finalCart.forEach(product => {
        purchaseList.innerHTML += `<p>${product.name} (Quantity: ${product.quantity}) - Total + VAT: $${product.totalPriceWithIVA}</p>`;
    });

    const totalIVA = finalCart.reduce((acc, product) => acc + parseFloat(product.totalPriceWithIVA), 0);
    purchaseList.innerHTML += `<h3>Total + VAT: $${totalIVA.toFixed(2)}</h3>`;
    purchaseList.innerHTML += `<h3 class="order-way">Your order is on its way!</h3>`;
    modalContainer.append(purchaseList);

    // Vaciar el carrito, actualizar el contador y el localStorage
    shoppingCart.length = 0;
    shoppingCartCounter();
    saveLocalStorage();
};

export const clearCart = () => {
    shoppingCart.length = 0;
    createShoppingCart();
    shoppingCartCounter();
    saveLocalStorage();
};

// Función para eliminar un producto del carrito
export const removeProduct = (id) => {
    // Encuentra el índice del producto a eliminar
    const index = shoppingCart.findIndex((product) => product.id === id);

    // Si el producto existe en el carrito
    if (index !== -1) {
        // Elimina el producto usando splice
        shoppingCart.splice(index, 1);
        saveLocalStorage(); // Guarda los cambios en el Local Storage
        createShoppingCart(); // Vuelve a generar el carrito visualmente
        shoppingCartCounter(); // Actualiza el contador del carrito
    }
};

// Función para actualizar el contador del carrito
export const shoppingCartCounter = () => {
    if (quantityShoppingCart) {
        const shoppingCartLength = shoppingCart.reduce((acc, product) => acc + product.quantity, 0);
        quantityShoppingCart.innerHTML = shoppingCartLength;
        localStorage.setItem("shoppingCartLength", JSON.stringify(shoppingCartLength));

        if (shoppingCartLength === 0) {
            quantityShoppingCart.style.display = "none";
        } else {
            quantityShoppingCart.style.display = "block";
        }
    } else {
        console.error("El elemento quantityShoppingCart no está definido.");
    }
};

// Event listener para abrir el carrito cuando se hace clic en el botón correspondiente
btnShoppingCart.addEventListener('click', () => {
    createShoppingCart();
});

// Event listener para cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        modalContainer.style.display = "none";
    }
});