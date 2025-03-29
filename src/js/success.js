import { loadHeaderFooter, updateCartCount } from "./utils.mjs"

// Load the header and footer
loadHeaderFooter()

document.addEventListener("DOMContentLoaded", () => {
  // Update cart count (should be 0 after successful checkout)
  updateCartCount()

  // Get order details from localStorage
  const orderDetails = JSON.parse(localStorage.getItem("so-order") || "{}")

  // Display order details
  const orderDetailsElement = document.getElementById("order-details")
  if (orderDetailsElement && orderDetails) {
    orderDetailsElement.innerHTML = `
      <h2>Order Summary</h2>
      <p><strong>Order Number:</strong> ${orderDetails.orderNumber || "Unknown"}</p>
      <p><strong>Order Date:</strong> ${orderDetails.orderDate || new Date().toLocaleDateString()}</p>
      <p><strong>Items:</strong> ${orderDetails.items || 0}</p>
      <p><strong>Shipping:</strong> $${orderDetails.shipping?.toFixed(2) || "0.00"}</p>
      <p><strong>Total:</strong> $${orderDetails.orderTotal?.toFixed(2) || "0.00"}</p>
      <p>A confirmation email has been sent to your email address.</p>
    `
  }

  // Clear the order details from localStorage after displaying
  localStorage.removeItem("so-order")
})

