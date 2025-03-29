// register.js - Handles user registration functionality

import { setCurrentUser } from "./auth.js"
import ExternalServices from "./ExternalServices.mjs"

// Initialize the registration form
export function initRegistrationForm() {
  const form = document.getElementById("registration-form")
  if (!form) {
    console.error("Registration form not found")
    return
  }

  console.log("Registration form initialized")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log("Form submitted")

    // Disable form during submission
    const submitButton = form.querySelector('button[type="submit"]')
    submitButton.disabled = true
    submitButton.textContent = "Creating Account..."

    // Clear previous error messages
    clearErrors(form)

    // Validate form
    if (!validateForm(form)) {
      submitButton.disabled = false
      submitButton.textContent = "Create Account"
      return
    }

    // Get form data
    const formData = new FormData(form)
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      address: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
      },
    }

    // Handle avatar if provided
    const avatarInput = form.querySelector("#avatar")
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        userData.avatar = e.target.result
        registerUser(userData, form, submitButton)
      }
      reader.readAsDataURL(avatarInput.files[0])
    } else {
      registerUser(userData, form, submitButton)
    }
  })

  // Preview avatar image when selected
  const avatarInput = document.getElementById("avatar")
  const avatarPreview = document.getElementById("avatar-preview")

  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          avatarPreview.src = e.target.result
          avatarPreview.style.display = "block"
        }
        reader.readAsDataURL(this.files[0])
      }
    })
  }
}

// Register the user
async function registerUser(userData, form, submitButton) {
  try {
    console.log("Registering user:", userData)

    // Create an instance of ExternalServices
    const services = new ExternalServices()

    // Make the actual API call to register the user
    const response = await fetch(`${services.baseURL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    console.log("Registration response status:", response.status)

    // Parse the response
    const data = await response.json()
    console.log("Registration response data:", data)

    if (response.ok) {
      // Set the current user
      setCurrentUser({
        email: userData.email,
        name: userData.name,
        token: data.accessToken || data.token,
      })

      // Store the token in localStorage
      if (data.accessToken) {
        localStorage.setItem("so-token", data.accessToken)
      } else if (data.token) {
        localStorage.setItem("so-token", data.token)
      }

      // Show success message
      showNotification("Account created successfully!")

      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } else {
      // Show error message from the server
      showFormError(form, data.message || "Registration failed. Please try again.")
      submitButton.disabled = false
      submitButton.textContent = "Create Account"
    }
  } catch (error) {
    console.error("Registration error:", error)
    showFormError(form, "An unexpected error occurred. Please try again.")
    submitButton.disabled = false
    submitButton.textContent = "Create Account"
  }
}

// Validate the registration form
function validateForm(form) {
  let isValid = true

  // Validate name
  const nameInput = form.querySelector('[name="name"]')
  if (!nameInput.value.trim()) {
    showInputError(nameInput, "Name is required")
    isValid = false
  }

  // Validate email
  const emailInput = form.querySelector('[name="email"]')
  if (!emailInput.value.trim()) {
    showInputError(emailInput, "Email is required")
    isValid = false
  } else if (!isValidEmail(emailInput.value)) {
    showInputError(emailInput, "Please enter a valid email address")
    isValid = false
  }

  // Validate password
  const passwordInput = form.querySelector('[name="password"]')
  if (!passwordInput.value) {
    showInputError(passwordInput, "Password is required")
    isValid = false
  } else if (passwordInput.value.length < 6) {
    showInputError(passwordInput, "Password must be at least 6 characters")
    isValid = false
  }

  // Validate confirm password
  const confirmInput = form.querySelector('[name="confirm-password"]')
  if (passwordInput.value !== confirmInput.value) {
    showInputError(confirmInput, "Passwords do not match")
    isValid = false
  }

  return isValid
}

// Show error for a specific input
function showInputError(input, message) {
  const formGroup = input.closest(".form-group")
  const errorElement = document.createElement("div")
  errorElement.className = "error-message"
  errorElement.textContent = message
  formGroup.appendChild(errorElement)
  input.classList.add("error")
}

// Show form-wide error
function showFormError(form, message) {
  const errorContainer = form.querySelector(".form-error-container")
  if (errorContainer) {
    errorContainer.textContent = message
    errorContainer.style.display = "block"
  }
}

// Clear all error messages
function clearErrors(form) {
  form.querySelectorAll(".error-message").forEach((el) => el.remove())
  form.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))

  const errorContainer = form.querySelector(".form-error-container")
  if (errorContainer) {
    errorContainer.textContent = ""
    errorContainer.style.display = "none"
  }
}

// Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Show notification
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

