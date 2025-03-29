import { loadHeaderFooter } from "./utils.mjs"
import CheckoutProcess from "./CheckoutProcess.mjs" // Fixed capitalization
import { isLoggedIn, getCurrentUser } from "./auth.js"

// Load the header and footer
loadHeaderFooter()

// Debug information
console.log("Checkout.js loaded")
console.log("Login status:", isLoggedIn() ? "Logged in" : "Not logged in")
console.log("Cart contents:", localStorage.getItem("so-cart"))

// Check if user is logged in before proceeding
if (!isLoggedIn()) {
  console.log("User not logged in, redirecting to login page")

  // Store the intended destination for after login
  localStorage.setItem("checkout-redirect", "true")

  // Show message and redirect
  const messageElement = document.getElementById("checkout-message")
  if (messageElement) {
    messageElement.textContent = "Please log in to proceed with checkout. Redirecting..."
    messageElement.classList.add("error-message")
  }

  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = "/login/index.html"
  }, 2000)
} else {
  console.log("User is logged in, proceeding with checkout")

  // Get current user info
  const user = getCurrentUser()
  console.log("Current user:", user)

  // Pre-fill form with user data if available
  if (user) {
    const form = document.getElementById("checkout-form")
    if (form && user.name) {
      // Try to split name into first and last
      const nameParts = user.name.split(" ")
      if (nameParts.length > 1) {
        form.fname.value = nameParts[0]
        form.lname.value = nameParts.slice(1).join(" ")
      } else {
        form.fname.value = user.name
      }
    }

    // Fill in address if available
    if (user.address) {
      const { street, city, state, zip } = user.address
      if (form) {
        if (street) form.street.value = street
        if (city) form.city.value = city
        if (state) form.state.value = state
        if (zip) form.zip.value = zip
      }
    }
  }

  // Initialize the checkout process
  const myCheckout = new CheckoutProcess("so-cart", ".order-summary")

  // Debug the cart contents
  console.log("Cart contents for checkout:", JSON.parse(localStorage.getItem("so-cart") || "[]"))

  // Initialize the checkout process
  try {
    myCheckout.init()
    console.log("Checkout process initialized")
  } catch (error) {
    console.error("Error initializing checkout process:", error)
  }

  // Calculate order total when zip code is entered
  document.querySelector("#zip").addEventListener("blur", () => {
    try {
      myCheckout.calculateOrderTotal()
      console.log("Order total calculated")
    } catch (error) {
      console.error("Error calculating order total:", error)
    }
  })

  // Handle form submission
  document.querySelector("#checkout-form").addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("Checkout form submitted")

    // Disable the submit button to prevent double submission
    const submitButton = document.getElementById("checkout-button")
    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = "Processing..."
    }

    // Validate form
    if (e.target.checkValidity()) {
      console.log("Form is valid, proceeding with checkout")
      try {
        myCheckout.checkout()
      } catch (error) {
        console.error("Error during checkout:", error)

        // Re-enable the button if there's an error
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = "Place Order"
        }

        // Show error message
        const messageElement = document.getElementById("checkout-message")
        if (messageElement) {
          messageElement.textContent = "An error occurred during checkout. Please try again."
          messageElement.classList.add("error-message")
        }
      }
    } else {
      console.log("Form validation failed")
      // Show validation messages
      e.target.reportValidity()

      // Re-enable the button
      if (submitButton) {
        submitButton.disabled = false
        submitButton.textContent = "Place Order"
      }
    }
  })

  // Calculate the order total on page load
  try {
    myCheckout.calculateOrderTotal()
    console.log("Initial order total calculated")
  } catch (error) {
    console.error("Error calculating initial order total:", error)
  }
}

