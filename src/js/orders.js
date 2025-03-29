import { loadHeaderFooter } from "./utils.mjs"
import ExternalServices from "./ExternalServices.mjs"

// Load the header and footer
loadHeaderFooter()

// Create an instance of ExternalServices
const services = new ExternalServices()

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem("so-token")

  if (!token) {
    // Redirect to login page if no token is found
    window.location.href = "/login/index.html"
    return null
  }

  return token
}

// Function to format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Function to display orders
function displayOrders(orders) {
  const ordersListElement = document.getElementById("ordersList")

  if (!orders || orders.length === 0) {
    ordersListElement.innerHTML = `<p class="no-orders">No orders found.</p>`
    return
  }

  const ordersHTML = orders
    .map((order) => {
      // Format the order items
      const itemsHTML = order.items
        .map(
          (item) => `
      <li class="product-item">
        <span>${item.name}</span>
        <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
      </li>
    `,
        )
        .join("")

      return `
      <div class="order-item" data-id="${order.id}">
        <div class="order-header">
          <span class="order-id">Order #${order.id}</span>
          <span class="order-date">${formatDate(order.date)}</span>
        </div>
        
        <div class="order-customer">
          <p><strong>Customer:</strong> ${order.fname} ${order.lname}</p>
          <p><strong>Address:</strong> ${order.street}, ${order.city}, ${order.state} ${order.zip}</p>
        </div>
        
        <div class="order-details">
          <div>
            <p><strong>Status:</strong> ${order.status || "Pending"}</p>
          </div>
          <div>
            <p><strong>Total:</strong> $${order.orderTotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
            <p><strong>Shipping:</strong> $${order.shipping.toFixed(2)}</p>
          </div>
        </div>
        
        <div class="order-products">
          <h3>Products</h3>
          <ul class="product-list">
            ${itemsHTML}
          </ul>
        </div>
        
        <div class="order-status">
          ${
            order.status !== "Processed"
              ? `<button class="status-button process-button" data-id="${order.id}" data-action="process">Process Order</button>`
              : ""
          }
          ${
            order.status === "Processed"
              ? `<button class="status-button ship-button" data-id="${order.id}" data-action="ship">Ship Order</button>`
              : ""
          }
        </div>
      </div>
    `
    })
    .join("")

  ordersListElement.innerHTML = ordersHTML

  // Add event listeners to the status buttons
  document.querySelectorAll(".status-button").forEach((button) => {
    button.addEventListener("click", handleStatusChange)
  })
}

// Function to handle order status changes
async function handleStatusChange(e) {
  const orderId = e.target.dataset.id
  const action = e.target.dataset.action
  const token = checkAuth()

  if (!token) return

  try {
    // In a real application, you would make an API call to update the order status
    // For this example, we'll just simulate it

    // Update the UI to reflect the change
    const orderElement = document.querySelector(`.order-item[data-id="${orderId}"]`)
    const statusElement = orderElement.querySelector(".order-details p:first-child")

    if (action === "process") {
      statusElement.innerHTML = "<strong>Status:</strong> Processed"
      e.target.remove()

      // Add ship button
      const statusDiv = orderElement.querySelector(".order-status")
      statusDiv.innerHTML = `<button class="status-button ship-button" data-id="${orderId}" data-action="ship">Ship Order</button>`

      // Add event listener to the new button
      statusDiv.querySelector(".ship-button").addEventListener("click", handleStatusChange)

      // Show success message
      showMessage("Order has been processed successfully!", "success")
    } else if (action === "ship") {
      statusElement.innerHTML = "<strong>Status:</strong> Shipped"
      e.target.remove()

      // Show success message
      showMessage("Order has been shipped successfully!", "success")
    }
  } catch (err) {
    showMessage(err.message || "Failed to update order status", "error")
  }
}

// Function to show messages
function showMessage(message, type) {
  const messageElement = document.getElementById("ordersMessage")
  messageElement.textContent = message
  messageElement.className = `message ${type}`

  // Clear the message after 3 seconds
  setTimeout(() => {
    messageElement.textContent = ""
    messageElement.className = "message"
  }, 3000)
}

// Function to handle logout
function logout() {
  localStorage.removeItem("so-token")
  window.location.href = "/login/index.html"
}

// Add event listener to the logout button
document.getElementById("logoutButton").addEventListener("click", logout)

// Initialize the page
async function init() {
  const token = checkAuth()

  if (!token) return

  try {
    // Fetch orders
    const orders = await services.getOrders(token)
    displayOrders(orders)
  } catch (err) {
    showMessage(err.message || "Failed to fetch orders", "error")
    document.getElementById("ordersList").innerHTML = `<p class="loading">Error loading orders. Please try again.</p>`
  }
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", init)

