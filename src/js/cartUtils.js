export function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    let totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
    // Update the cart count in the UI
    document.getElementById("cart-count").textContent = totalCount;
  }
  