
// ShopZone JavaScript

// Get HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store products and cart
let products = [];

let cart = JSON.parse(localStorage.getItem("shopZoneCart")) || [];

// Format prices in Indian Rupees
function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

// Fetch Products from JSON File
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productGrid.innerHTML = `
            <p class="no-products">
                Unable to load products.
                Please run the project using Live Server.
            </p>
        `;

        console.error(error);

    }

}

// Display Products Dynamically
function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `
            <p class="no-products">
                No products found!
            </p>
        `;

        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ${"★".repeat(Math.round(product.rating))}
                    ${"☆".repeat(5 - Math.round(product.rating))}
                    <span>${product.rating}/5</span>
                </div>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >
                        + Add
                    </button>

                </div>

            </div>
        `;

        productGrid.appendChild(card);

    });

}

// Add Product to Cart
function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });

    }

    saveCart();

    alert(product.name + " added to cart!");

}

// Save Cart to Local Storage
function saveCart() {

    localStorage.setItem(
        "shopZoneCart",
        JSON.stringify(cart)
    );

    updateCart();

}

// Update Cart Information
function updateCart() {

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartItems.innerHTML = "";

    let totalPrice = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty!
            </p>
        `;

    }

    cart.forEach(item => {

        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            formatPrice(item.price) + " × " + item.quantity;

        details.append(name, price);

        const removeButton = document.createElement("button");

        removeButton.className = "remove-item";
        removeButton.textContent = "Remove";
        removeButton.dataset.id = item.id;

        cartItem.append(details, removeButton);

        cartItems.appendChild(cartItem);

    });

    cartTotal.textContent = formatPrice(totalPrice);

}

// Remove Product from Cart
function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

}

// Search Products
function searchProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);

}

// Event Delegation for Product Buttons
productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (button) {

        const productId = Number(button.dataset.id);

        addToCart(productId);

    }

});

// Search Events
searchInput.addEventListener("input", searchProducts);

searchBtn.addEventListener("click", searchProducts);

// Open Cart
cartButton.addEventListener("click", function() {

    cartOverlay.classList.add("active");

});

// Close Cart
closeCart.addEventListener("click", function() {

    cartOverlay.classList.remove("active");

});

// Close Cart when clicking outside
cartOverlay.addEventListener("click", function(event) {

    if (event.target === cartOverlay) {

        cartOverlay.classList.remove("active");

    }

});

// Remove Cart Items
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest(".remove-item");

    if (button) {

        removeFromCart(Number(button.dataset.id));

    }

});

// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }

    alert(
        "Thank you for shopping with ShopZone!\n" +
        "Your total is " + cartTotal.textContent +
        ".\nThis is a demo checkout."
    );

});

// Close cart with Escape key
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        cartOverlay.classList.remove("active");

    }

});

// Initialize Website
loadProducts();

updateCart();
