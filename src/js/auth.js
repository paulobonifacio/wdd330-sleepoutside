// auth.js - Handles user authentication and session management

// Check if user is logged in
export function isLoggedIn() {
    const user = getLoggedInUser()
    return user !== null
  }
  
  // Get the currently logged in user
  export function getLoggedInUser() {
    const userJson = localStorage.getItem("current-user")
    if (!userJson) return null
  
    try {
      return JSON.parse(userJson)
    } catch (e) {
      console.error("Error parsing user data:", e)
      return null
    }
  }
  
  // Set the current user after login/registration
  export function setCurrentUser(userData) {
    localStorage.setItem("current-user", JSON.stringify(userData))
  
    // Update UI elements that show user status
    updateUserUI()
  
    // Dispatch event for other components to react
    window.dispatchEvent(
      new CustomEvent("user-auth-changed", {
        detail: { user: userData, status: "logged-in" },
      }),
    )
  }
  
  // Log out the current user
  export function logoutUser() {
    localStorage.removeItem("current-user")
  
    // Update UI elements
    updateUserUI()
  
    // Dispatch event for other components to react
    window.dispatchEvent(
      new CustomEvent("user-auth-changed", {
        detail: { user: null, status: "logged-out" },
      }),
    )
  }
  
  // Update UI elements based on login status
  export function updateUserUI() {
    const user = getLoggedInUser()
    const authLinks = document.querySelectorAll(".auth-link")
    const userInfoElements = document.querySelectorAll(".user-info")
  
    if (user) {
      // User is logged in
      authLinks.forEach((link) => {
        if (link.classList.contains("login-link") || link.classList.contains("register-link")) {
          link.style.display = "none"
        } else if (link.classList.contains("logout-link") || link.classList.contains("profile-link")) {
          link.style.display = "inline-block"
        }
      })
  
      // Update user info displays
      userInfoElements.forEach((el) => {
        el.textContent = user.name || user.email
        el.style.display = "inline-block"
      })
    } else {
      // User is logged out
      authLinks.forEach((link) => {
        if (link.classList.contains("login-link") || link.classList.contains("register-link")) {
          link.style.display = "inline-block"
        } else if (link.classList.contains("logout-link") || link.classList.contains("profile-link")) {
          link.style.display = "none"
        }
      })
  
      // Hide user info displays
      userInfoElements.forEach((el) => {
        el.style.display = "none"
      })
    }
  }
  

 export function getCurrentUser() {
    const userData = localStorage.getItem("so-user")
    return userData ? JSON.parse(userData) : null
  }
  
  
  // Initialize auth system
  export function initAuth() {
    // Set up logout functionality
    document.querySelectorAll(".logout-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        logoutUser()
        window.location.href = "/"
      })
    })
  
    // Update UI on page load
    updateUserUI()
  }
  
  

  // Function to get the current user


  /**
   * 
   */


  