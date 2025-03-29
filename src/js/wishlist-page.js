// wishlist-page.js - Handles the wishlist page functionality

import { getWishlist, removeFromWishlist, moveToCart } from "./wishlist.js"

export default class WishlistPage {
  constructor() {
    this.wishlist = []
  }

  init() {
    this.loadWishlist()
    this.setupEventListeners()
  }

  loadWishlist() {
    this.wishlist = getWishlist()
    this.renderWishlist()
  }

  renderWishlist() {
    const mainElement = document.querySelector("main")
    if (!mainElement) return

    if (this.wishlist.length === 0) {
      mainElement.innerHTML = `
                <div class="wishlist-container empty-wishlist">
                    <h1>Your Wishlist</h1>
                    <p>Your wishlist is empty.</p>
                    <a href="/" class="continue-shopping">Continue Shopping</a>
                </div>
            `
      return
    }

    mainElement.innerHTML = `
            <div class="wishlist-container">
                <h1>Your Wishlist</h1>
                <p class="wishlist-count-display">You have ${this.wishlist.length} item${this.wishlist.length !== 1 ? "s" : ""} in your wishlist</p>
                
                <ul class="wishlist-items">
                    ${this.wishlist.map((item) => this.renderWishlistItem(item)).join("")}
                </ul>
                
                <div class="wishlist-actions">
                    <a href="/" class="continue-shopping">Continue Shopping</a>
                </div>
            </div>
        `

    // Add event listeners to the newly created elements
    this.setupItemEventListeners()
  }

  renderWishlistItem(item) {
    // Use the selected color image if available
    const imageUrl =
      item.selectedColor?.ColorPreviewImageSrc ||
      item.Images?.PrimaryLarge ||
      item.Image ||
      "/images/default-product.jpg"

    // Include the selected color information if available
    const colorInfo = item.selectedColor
      ? `<p class="wishlist-item-color">Color: ${item.selectedColor.ColorName}</p>`
      : ""

    return `
            <li class="wishlist-item" data-id="${item.Id}">
                <div class="wishlist-item-image">
                    <img src="${imageUrl}" alt="${item.NameWithoutBrand}">
                </div>
                <div class="wishlist-item-details">
                    <h3 class="wishlist-item-title">${item.NameWithoutBrand}</h3>
                    <p class="wishlist-item-brand">${item.Brand?.Name || "Unknown Brand"}</p>
                    ${colorInfo}
                    <p class="wishlist-item-price">$${item.FinalPrice.toFixed(2)}</p>
                    <div class="wishlist-item-actions">
                        <button class="move-to-cart-btn" data-id="${item.Id}">Add to Cart</button>
                        <button class="remove-from-wishlist-btn" data-id="${item.Id}">Remove</button>
                    </div>
                </div>
            </li>
        `
  }

  setupEventListeners() {
    // Listen for auth changes to update wishlist
    window.addEventListener("user-auth-changed", () => {
      this.loadWishlist()
    })
  }

  setupItemEventListeners() {
    // Add to cart buttons
    document.querySelectorAll(".move-to-cart-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id
        if (moveToCart(productId)) {
          this.showNotification("Item added to cart")
          this.loadWishlist() // Reload wishlist after moving item
        }
      })
    })

    // Remove buttons
    document.querySelectorAll(".remove-from-wishlist-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = e.target.dataset.id
        const itemElement = e.target.closest(".wishlist-item")

        if (itemElement) {
          // Add fade-out animation
          itemElement.style.transition = "opacity 0.3s"
          itemElement.style.opacity = "0"

          // Remove after animation completes
          setTimeout(() => {
            if (removeFromWishlist(productId)) {
              this.showNotification("Item removed from wishlist")
              this.loadWishlist() // Reload wishlist after removing item
            }
          }, 300)
        }
      })
    })
  }

  showNotification(message) {
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
}

