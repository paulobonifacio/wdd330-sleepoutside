// import { loadHeaderFooter } from "./utils.mjs"
// import ExternalServices from "./ExternalServices.mjs"

// // Load the header and footer
// loadHeaderFooter()

// // Create an instance of ExternalServices
// const services = new ExternalServices()

// // Function to handle login
// async function login(e) {
//   e.preventDefault()

//   const email = document.getElementById("email").value
//   const password = document.getElementById("password").value
//   const messageElement = document.getElementById("loginMessage")
//   const loginButton = document.getElementById("loginButton")

//   // Clear previous messages
//   messageElement.textContent = ""
//   messageElement.className = "message"

//   // Disable the login button and show loading state
//   loginButton.disabled = true
//   loginButton.textContent = "Logging in..."

//   try {
//     // Attempt to login
//     const result = await services.loginUser({ email, password })

//     // If successful, store the token and redirect to orders page
//     if (result.accessToken) {
//       // Store the token in localStorage
//       localStorage.setItem("so-token", result.accessToken)

//       // Show success message
//       messageElement.textContent = "Login successful! Redirecting..."
//       messageElement.classList.add("success")

//       // Redirect to orders page after a short delay
//       setTimeout(() => {
//         window.location.href = "/orders/index.html"
//       }, 1500)
//     } else {
//       throw new Error("Invalid response from server")
//     }
//   } catch (err) {
//     // Show error message
//     messageElement.textContent = err.message || "Login failed. Please try again."
//     messageElement.classList.add("error")

//     // Re-enable the login button
//     loginButton.disabled = false
//     loginButton.textContent = "Login"
//   }
// }

// // Add event listener to the login form
// document.getElementById("loginForm").addEventListener("submit", login)




import { loadHeaderFooter } from "./utils.mjs"
import ExternalServices from "./ExternalServices.mjs"
import { setCurrentUser } from "./auth.js"

// Load the header and footer
loadHeaderFooter()

// Create an instance of ExternalServices
const services = new ExternalServices()

// Function to handle login
async function login(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const messageElement = document.getElementById("loginMessage")
  const loginButton = document.getElementById("loginButton")

  // Clear previous messages
  messageElement.textContent = ""
  messageElement.className = "message"

  // Disable the login button and show loading state
  loginButton.disabled = true
  loginButton.textContent = "Logging in..."

  try {
    // Attempt to login
    const result = await services.loginUser({ email, password })

    // If successful, store the token and redirect to orders page
    if (result.accessToken) {
      // Store the token in localStorage
      localStorage.setItem("so-token", result.accessToken)

      // Store user data for auth.js
      setCurrentUser({
        email: email,
        token: result.accessToken,
      })

      // Show success message
      messageElement.textContent = "Login successful! Redirecting..."
      messageElement.classList.add("success")

      // Check if we need to redirect to checkout
      const checkoutRedirect = localStorage.getItem("checkout-redirect")

      // Redirect after a short delay
      setTimeout(() => {
        if (checkoutRedirect === "true") {
          // Clear the redirect flag
          localStorage.removeItem("checkout-redirect")
          // Redirect to checkout
          window.location.href = "/checkout/index.html"
        } else {
          // Default redirect to orders page
          window.location.href = "/orders/index.html"
        }
      }, 1500)
    } else {
      throw new Error("Invalid response from server")
    }
  } catch (err) {
    // Show error message
    messageElement.textContent = err.message || "Login failed. Please try again."
    messageElement.classList.add("error")

    // Re-enable the login button
    loginButton.disabled = false
    loginButton.textContent = "Login"
  }
}

// Add event listener to the login form
document.getElementById("loginForm").addEventListener("submit", login)

