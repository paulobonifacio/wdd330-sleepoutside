import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

// ✅ Function to generate cart item template
function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryLarge || item.Image || "/images/default-product.jpg"; // Handle missing images

  return `<li class="cart-card divider">
    <img class="cart-card__image" src="${imageUrl}" alt="${item.NameWithoutBrand}" />
    <h2 class="card__name">${item.NameWithoutBrand}</h2>
    <p class="cart-card__quantity">Quantity: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
    <button class="remove-item" data-id="${item.Id}">❌ Remove</button>
  </li>`;
}

// ✅ Function to render cart items
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartList = qs(".product-list");

  if (!cartList) return console.error("❌ Cart list element not found!");

  console.log("🛒 Rendering cart items:", cartItems);

  if (cartItems.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartList.innerHTML = cartItems.map(cartItemTemplate).join("");
    enableRemoveButtons(); // Enable removal functionality
  }

  updateCartCount(); // ✅ Update cart count globally
}

// ✅ Function to enable "Remove" buttons
function enableRemoveButtons() {
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id");
      removeFromCart(itemId);
    });
  });
}

// ✅ Function to remove items from the cart
function removeFromCart(itemId) {
  let cart = getLocalStorage("so-cart") || [];
  const itemIndex = cart.findIndex(item => item.Id === itemId);

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1; // Decrease quantity
    } else {
      cart.splice(itemIndex, 1); // Remove item completely
    }
  }

  setLocalStorage("so-cart", cart);
  renderCartContents(); // Re-render the cart
}

// ✅ Function to update cart count on ALL cart icons
function updateCartCount() {
  let cart = getLocalStorage("so-cart") || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Select all cart count elements across all pages
  document.querySelectorAll(".cart-count").forEach(cartCountElement => {
    cartCountElement.textContent = totalItems;
  });
}

// ✅ Ensure cart count updates on all pages
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (window.location.pathname.includes("cart")) {
    renderCartContents();
  }
});

// ✅ Export function for global use
export { updateCartCount };
