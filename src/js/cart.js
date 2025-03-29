import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs"
import { getWishlist, removeFromWishlist, moveToCart } from "./wishlist.js"
import { isLoggedIn } from "./auth.js"

// ✅ Function to generate cart item template with increment/decrement buttons
function cartItemTemplate(item) {
  // Use the selected color's image if available, otherwise use the default image
  const imageUrl =
    item.selectedColor?.ColorPreviewImageSrc ||
    item.Images?.PrimaryLarge ||
    item.Images?.PrimarySmall ||
    item.Image ||
    "/images/default-product.jpg"

  // Include the selected color information in the cart item display
  const colorInfo = item.selectedColor
    ? `<p class="cart-card__color">Color: ${item.selectedColor.ColorName}</p>`
    : item.Colors && item.Colors.length > 0
      ? `<p class="cart-card__color">Color: ${item.Colors[0].ColorName}</p>`
      : ""

  const itemName = item.NameWithoutBrand || item.Name || "Product"
  const quantity = item.quantity || item.Quantity || 1

  /**
   * displaying / hiding the checkout button
   */

  return `<li class="cart-card divider" data-id="${item.Id}">
    <img class="cart-card__image" src="${imageUrl}" alt="${itemName}" />
    <div class="cart-card__content">
      <h2 class="card__name">${itemName}</h2>
      ${colorInfo}
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
      <p class="cart-card__quantity">
        <button class="decrement-item" data-id="${item.Id}">➖</button>
        Quantity: <span class="item-quantity">${quantity}</span>
        <button class="increment-item" data-id="${item.Id}">➕</button>
        <button class="remove-item" data-id="${item.Id}">❌ Remove</button>
      </p>
    </div>
  </li>`
}

// Function to generate wishlist item template
function wishlistItemTemplate(item) {
  // Use the selected color's image if available, otherwise use the default image
  const imageUrl =
    item.selectedColor?.ColorPreviewImageSrc ||
    item.Images?.PrimaryLarge ||
    item.Images?.PrimarySmall ||
    item.Image ||
    "/images/default-product.jpg"

  // Include the selected color information in the wishlist item display
  const colorInfo = item.selectedColor
    ? `<p class="wishlist-card__color">Color: ${item.selectedColor.ColorName}</p>`
    : item.Colors && item.Colors.length > 0
      ? `<p class="wishlist-card__color">Color: ${item.Colors[0].ColorName}</p>`
      : ""

  const itemName = item.NameWithoutBrand || item.Name || "Product"

  return `<li class="wishlist-card divider" data-id="${item.Id}">
    <img class="wishlist-card__image" src="${imageUrl}" alt="${itemName}" />
    <div class="wishlist-card__content">
      <h2 class="card__name">${itemName}</h2>
      ${colorInfo}
      <p class="wishlist-card__price">$${item.FinalPrice.toFixed(2)}</p>
      <div class="wishlist-card__actions">
        <button class="move-to-cart" data-id="${item.Id}">Add to Cart</button>
        <button class="remove-from-wishlist" data-id="${item.Id}">Remove</button>
      </div>
    </div>
  </li>`
}

// ✅ Function to calculate the total of items in the cart
function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const quantity = item.quantity || item.Quantity || 1
    return total + item.FinalPrice * quantity
  }, 0)
}

// ✅ Function to update the cart footer with the total
function updateCartFooter() {
  const cart = getLocalStorage("so-cart") || []
  const totalPrice = calculateTotal(cart)

  console.log("🛒 Total price:", totalPrice.toFixed(2))

  // Try both potential cart total elements
  const cartTotalElement = qs(".cart-total")
  const cartPriceElement = qs(".cart-price")

  if (cartTotalElement) {
    cartTotalElement.textContent = `Total: $${totalPrice.toFixed(2)}`
  }

  if (cartPriceElement) {
    if (totalPrice > 0) {
      cartPriceElement.innerHTML = `<p class='total-price'>Total Price: $${totalPrice.toFixed(2)}</p>`
    } else {
      cartPriceElement.innerHTML = "<p class='total-price'>Your cart is empty.</p>"
    }
  }
}

// ✅ Function to update cart count on ALL cart icons
function updateCartCount() {
  const cart = getLocalStorage("so-cart") || []
  const totalItems = cart.reduce((sum, item) => {
    const quantity = item.quantity || item.Quantity || 1
    return sum + quantity
  }, 0)

  // Select all cart count elements across all pages
  document.querySelectorAll(".cart-count").forEach((cartCountElement) => {
    cartCountElement.textContent = totalItems
  })
}

// ✅ Function to enable "Remove", "Increment", and "Decrement" buttons
function enableCartButtons() {
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id")
      removeFromCart(itemId)
    })
  })

  document.querySelectorAll(".increment-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id")
      changeItemQuantity(itemId, 1) // Increase quantity
    })
  })

  document.querySelectorAll(".decrement-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id")
      changeItemQuantity(itemId, -1) // Decrease quantity
    })
  })
}

// ✅ Modified function to change item quantity without full re-render
function changeItemQuantity(itemId, change) {
  const cart = getLocalStorage("so-cart") || []
  const itemIndex = cart.findIndex((item) => item.Id === itemId)

  if (itemIndex !== -1) {
    // Handle both quantity property names
    const currentQuantity = cart[itemIndex].quantity || cart[itemIndex].Quantity || 1
    const newQuantity = currentQuantity + change

    // Update the quantity using the property that exists
    if ("quantity" in cart[itemIndex]) {
      cart[itemIndex].quantity = newQuantity
    } else {
      cart[itemIndex].Quantity = newQuantity
    }

    if (newQuantity <= 0) {
      // Remove item if quantity is zero
      cart.splice(itemIndex, 1)
      // Need to do a full re-render when removing an item
      setLocalStorage("so-cart", cart)
      renderCartContents()
      return
    }

    // Update only the quantity display for this specific item
    const quantityElement = document.querySelector(`.cart-card[data-id="${itemId}"] .item-quantity`)
    if (quantityElement) {
      quantityElement.textContent = newQuantity
    }
  }

  setLocalStorage("so-cart", cart)
  updateCartFooter() // Update only the total price
  updateCartCount() // Update only the cart count
  setupCheckoutButton() // Update checkout button visibility
}

// ✅ Function to remove items from the cart
function removeFromCart(itemId) {
  let cart = getLocalStorage("so-cart") || []

  // Find the item element to remove it with animation
  const itemElement = document.querySelector(`.cart-card[data-id="${itemId}"]`)

  if (itemElement) {
    // Add a fade-out animation
    itemElement.style.transition = "opacity 0.3s"
    itemElement.style.opacity = "0"

    // Wait for animation to complete before removing
    setTimeout(() => {
      cart = cart.filter((item) => item.Id !== itemId)
      setLocalStorage("so-cart", cart)

      // Only re-render if cart is empty after removal
      if (cart.length === 0) {
        renderCartContents()
      } else {
        // Otherwise just remove the element
        itemElement.remove()
        updateCartFooter()
        updateCartCount()
        setupCheckoutButton() // Update checkout button visibility
      }
    }, 300) // Match this to the transition duration
  } else {
    // Fallback if element not found
    cart = cart.filter((item) => item.Id !== itemId)
    setLocalStorage("so-cart", cart)
    renderCartContents()
  }
}

// Function to enable wishlist buttons
function enableWishlistButtons() {
  // Move to cart buttons
  document.querySelectorAll(".move-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id")
      const itemElement = event.target.closest(".wishlist-card")

      if (itemElement) {
        // Add animation
        itemElement.classList.add("moving-to-cart")

        // Wait for animation to complete
        setTimeout(() => {
          if (moveToCart(itemId)) {
            showNotification("Item added to cart")
            renderCartContents() // Re-render both cart and wishlist
          }
        }, 300)
      }
    })
  })

  // Remove from wishlist buttons
  document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.getAttribute("data-id")
      const itemElement = event.target.closest(".wishlist-card")

      if (itemElement) {
        // Add fade-out animation
        itemElement.style.transition = "opacity 0.3s"
        itemElement.style.opacity = "0"

        // Wait for animation to complete
        setTimeout(() => {
          if (removeFromWishlist(itemId)) {
            showNotification("Item removed from wishlist")
            renderWishlistSection() // Only re-render wishlist section
          }
        }, 300)
      }
    })
  })
}

// ✅ Function to render cart items
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || []
  const cartList = qs(".product-list")
  if (!cartList) return console.error("❌ Cart list element not found!")

  console.log("🛒 Rendering cart items:", cartItems)

  if (cartItems.length === 0) {
    cartList.innerHTML =
      "<p class='empty-cart-message'> 🛒 Your cart is empty... for now. Start adding some awesome picks!</p>"
  } else {
    cartList.innerHTML = cartItems.map(cartItemTemplate).join("")
    enableCartButtons() // Enable increment, decrement, and remove functionality
  }

  updateCartFooter()
  updateCartCount() // ✅ Update cart count globally

  // After rendering cart, also render wishlist section
  renderWishlistSection()

  // Set up checkout button
  setupCheckoutButton()
}

// Function to render wishlist section on cart page
function renderWishlistSection() {
  const wishlistItems = getWishlist ? getWishlist() : getLocalStorage("wishlist") || []

  // Create or get the wishlist section
  let wishlistSection = document.querySelector(".wishlist-section")

  if (!wishlistSection) {
    // Create the wishlist section if it doesn't exist
    const cartContainer = document.querySelector(".cart-container")
    if (!cartContainer) return

    wishlistSection = document.createElement("div")
    wishlistSection.className = "wishlist-section"
    cartContainer.appendChild(wishlistSection)
  }

  // Render the wishlist content
  if (wishlistItems.length === 0) {
    wishlistSection.innerHTML = `
      <h2>Your Wishlist</h2>
      <p class="empty-wishlist-message">Your wishlist is empty. Add items to your wishlist for later!</p>
    `
  } else {
    wishlistSection.innerHTML = `
      <h2>Your Wishlist (${wishlistItems.length})</h2>
      <ul class="wishlist-list">
        ${wishlistItems.map(wishlistItemTemplate).join("")}
      </ul>
    `

    // Add event listeners to wishlist buttons
    enableWishlistButtons()
  }
}

// Show notification function
function showNotification(message) {
  const notification = document.createElement("div")
  notification.classList.add("notification")
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("fade-out")
    setTimeout(() => {
      notification.remove()
    }, 500)
  }, 3000)
}

// Add event listener for checkout button
function setupCheckoutButton() {
  const checkoutButton = document.querySelector(".checkout-button")
  if (checkoutButton) {
    // Remove any existing event listeners to prevent duplicates
    const newCheckoutButton = checkoutButton.cloneNode(true)
    checkoutButton.parentNode.replaceChild(newCheckoutButton, checkoutButton)

    // Check if cart is empty and hide/show checkout button accordingly
    const cart = getLocalStorage("so-cart") || []
    if (cart.length === 0) {
      newCheckoutButton.classList.add("hide-checkout")
    } else {
      newCheckoutButton.classList.remove("hide-checkout")
    }

    // Add the event listener to the new button
    newCheckoutButton.addEventListener("click", () => {
      console.log("Checkout button clicked, checking login status")

      // Check if user is logged in
      if (isLoggedIn()) {
        // User is logged in, proceed to checkout
        console.log("User is logged in, proceeding to checkout")
        window.location.href = "/checkout/index.html"
      } else {
        // User is not logged in, redirect to login page
        console.log("User is not logged in, redirecting to login page")

        // Store the intended destination for after login
        localStorage.setItem("checkout-redirect", "true")

        // Show notification
        showNotification("Please log in to proceed to checkout")

        // Redirect to login page
        window.location.href = "/login/index.html"
      }
    })
  } else {
    console.error("Checkout button not found")
  }
}

// Call this function when rendering cart contents
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()
  if (window.location.pathname.includes("cart")) {
    renderCartContents()
    updateCartFooter()
    setupCheckoutButton() // Set up the checkout button
  }

  // Listen for wishlist changes to update the wishlist section
  window.addEventListener("wishlist-updated", () => {
    if (window.location.pathname.includes("cart")) {
      renderWishlistSection()
    }
  })
})

// ✅ Export functions for global use
export { updateCartCount, renderCartContents }
