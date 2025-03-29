// wishlist.js - Handles wishlist functionality

import { getLoggedInUser } from "./auth.js"
import { updateCartCount } from "./cart.js"

// Get the wishlist key based on user status
function getWishlistKey() {
  const user = getLoggedInUser()
  return user ? `wishlist-${user.id}` : "wishlist-guest"
}

// Get the current wishlist
export function getWishlist() {
  const wishlistKey = getWishlistKey()
  const wishlist = localStorage.getItem(wishlistKey)
  return wishlist ? JSON.parse(wishlist) : []
}

// Save the wishlist
function saveWishlist(wishlist) {
  const wishlistKey = getWishlistKey()
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist))
  updateWishlistCount()

  // Dispatch event for other components to react
  window.dispatchEvent(
    new CustomEvent("wishlist-updated", {
      detail: { wishlist: wishlist },
    }),
  )
}

// Add an item to the wishlist
export function addToWishlist(product) {
  const wishlist = getWishlist()

  // Check if product is already in wishlist
  const existingIndex = wishlist.findIndex((item) => item.Id === product.Id)

  if (existingIndex === -1) {
    // Add to wishlist if not already there
    wishlist.push(product)
    saveWishlist(wishlist)
    return true
  }

  return false
}

// Remove an item from the wishlist
export function removeFromWishlist(productId) {
  const wishlist = getWishlist()
  const updatedWishlist = wishlist.filter((item) => item.Id !== productId)

  if (updatedWishlist.length !== wishlist.length) {
    saveWishlist(updatedWishlist)
    return true
  }

  return false
}

// Check if a product is in the wishlist
export function isInWishlist(productId) {
  const wishlist = getWishlist()
  return wishlist.some((item) => item.Id === productId)
}

// Move an item from wishlist to cart
export function moveToCart(productId) {
  const wishlist = getWishlist()
  const product = wishlist.find((item) => item.Id === productId)

  if (!product) return false

  // Add to cart
  const cart = JSON.parse(localStorage.getItem("so-cart")) || []
  const existingItem = cart.find((item) => item.Id === product.Id)

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    product.quantity = 1
    cart.push(product)
  }

  localStorage.setItem("so-cart", JSON.stringify(cart))

  // Remove from wishlist
  removeFromWishlist(productId)

  // Update cart count
  updateCartCount()

  return true
}

// Update wishlist count in UI
export function updateWishlistCount() {
  const wishlist = getWishlist()
  const count = wishlist.length

  document.querySelectorAll(".wishlist-count").forEach((el) => {
    el.textContent = count.toString()
  })
}

// Initialize wishlist functionality
export function initWishlist() {
  // Update wishlist count on page load
  updateWishlistCount()

  // Listen for auth changes to update wishlist
  window.addEventListener("user-auth-changed", () => {
    updateWishlistCount()
  })
}





