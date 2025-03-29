import ProductData from "./ProductData.mjs"
import { updateCartCount } from "./cart.js"
import { addToWishlist, isInWishlist, removeFromWishlist } from "./wishlist.js"
import { isLoggedIn } from "./auth.js"

export default class ProductDetails {
  constructor(productId, category) {
    this.productId = productId
    this.category = category
    this.dataSource = new ProductData(category)
  }

  async init() {
    console.log(`🔎 Looking for product ID: ${this.productId} in ${this.category}`)

    const product = await this.dataSource.findProductById(this.productId)

    if (!product) {
      console.warn(`⚠️ Product ID ${this.productId} not found in ${this.category}`)
      document.querySelector("main").innerHTML = `<p>⚠️ Product not found.</p>`
      return
    }

    this.renderProductDetails(product)
  }

  renderProductDetails(product) {
    const element = document.querySelector("main")

    // Determine if we need a carousel (if there are extra images)
    const hasExtraImages = product.Images?.ExtraImages && product.Images.ExtraImages.length > 0

    // Prepare all images for the carousel
    const allImages = []
    if (product.Images?.PrimaryExtraLarge) {
      allImages.push({
        src: product.Images.PrimaryExtraLarge,
        title: "Main Image",
      })
    }

    if (hasExtraImages) {
      product.Images.ExtraImages.forEach((img) => {
        allImages.push({
          src: img.Src,
          title: img.Title,
        })
      })
    }

    // Determine if we have multiple colors
    const hasMultipleColors = product.Colors && product.Colors.length > 1

    // Check if product is in wishlist
    const inWishlist = isInWishlist(product.Id)

    // Check if user is logged in
    const userLoggedIn = isLoggedIn()

    element.innerHTML = `
       <div class="product-detail">
        <div class="product-image-container">
            ${
              hasExtraImages
                ? `
                <div class="carousel-container">
                    <div class="carousel-main">
                        <button class="carousel-btn prev-btn">&lt;</button>
                        <div class="carousel-image-wrapper">
                            <img id="mainImage" src="${allImages[0].src}" alt="${product.NameWithoutBrand}" class="carousel-image">
                        </div>
                        <button class="carousel-btn next-btn">&gt;</button>
                    </div>
                    <div class="carousel-thumbnails">
                        ${allImages
                          .map(
                            (img, index) => `
                            <div class="thumbnail ${index === 0 ? "active" : ""}" data-index="${index}">
                                <img src="${img.src}" alt="${img.title}">
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `
                : `
                <div class="product-image">
                    <img id="mainImage" src="${product.Images?.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}">
                </div>
            `
            }
        </div>
        <div class="product-info">
            <h3 class="product-brand">${product.Brand?.Name || "Unknown Brand"}</h3>
            <h1 class="product-title">${product.NameWithoutBrand}</h1>
            
            <div class="price-container">
                <div class="discount-flag">SAVE ${Math.floor((1 - product.FinalPrice / product.SuggestedRetailPrice) * 100)}%</div>
                <p class="final-price">Final Price: $${product.FinalPrice}</p>
                <p class="list-price">Original Price: $${product.SuggestedRetailPrice}</p>
                <p class="savings-amount">You save: $${(product.SuggestedRetailPrice - product.FinalPrice).toPrecision(4)}</p>
            </div>
            
            ${
              hasMultipleColors
                ? `
                <div class="product-colors">
                    <p>Available Colors:</p>
                    <div class="color-options">
                        ${product.Colors.map(
                          (color, index) => `
                            <div class="color-swatch ${index === 0 ? "selected" : ""}" 
                                 data-color-code="${color.ColorCode}" 
                                 data-color-name="${color.ColorName}"
                                 data-preview-image="${color.ColorPreviewImageSrc}">
                                <img src="${color.ColorChipImageSrc}" alt="${color.ColorName}">
                                <span class="color-name">${color.ColorName}</span>
                            </div>
                        `,
                        ).join("")}
                    </div>
                </div>
                <p class="selected-color">Selected Color: <span id="currentColor">${product.Colors[0].ColorName}</span></p>
            `
                : `
                <p class="product-color">Color: ${product.Colors?.[0]?.ColorName || "No Color"}</p>
            `
            }
            
            <p class="product-description">${product.DescriptionHtmlSimple || "No description available."}</p>
            
            <div class="product-actions">
                <button id="addToCart" data-id="${product.Id}" class="primary-button">Add to Cart</button>
                <button id="wishlistButton" data-id="${product.Id}" class="wishlist-button ${inWishlist ? "in-wishlist" : ""}">
                    ${inWishlist ? "Remove from Wishlist" : "Add to Wishlist"} 
                    <span class="wishlist-icon">${inWishlist ? "❤️" : "🤍"}</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Comments Section -->
    <div class="comments-section">
        <h2>Customer Reviews</h2>
        <div id="comments-container">
            <div id="comments-list">
                <!-- Comments will be loaded here -->
                <p class="loading-comments">Loading comments...</p>
            </div>
            
            <div class="comment-form-container">
                <h3>Add Your Review</h3>
                ${
                  userLoggedIn
                    ? `
                    <form id="comment-form">
                        <div class="form-group">
                            <label for="comment-name">Your Name</label>
                            <input type="text" id="comment-name" required placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="comment-rating">Rating</label>
                            <div class="rating-input">
                                <span class="star" data-rating="1">★</span>
                                <span class="star" data-rating="2">★</span>
                                <span class="star" data-rating="3">★</span>
                                <span class="star" data-rating="4">★</span>
                                <span class="star" data-rating="5">★</span>
                                <input type="hidden" id="comment-rating" value="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="comment-text">Your Review</label>
                            <textarea id="comment-text" required placeholder="Share your thoughts about this product"></textarea>
                        </div>
                        <button type="submit" class="submit-comment">Submit Review</button>
                    </form>
                `
                    : `
                    <div class="login-to-comment">
                        <p>Please <a href="/login/index.html">log in</a> to leave a review.</p>
                    </div>
                `
                }
            </div>
        </div>
    </div>
    `

    // Add event listeners for the carousel if it exists
    if (hasExtraImages) {
      let currentIndex = 0
      const totalImages = allImages.length

      const updateCarousel = (newIndex) => {
        // Update main image
        document.getElementById("mainImage").src = allImages[newIndex].src

        // Update thumbnails
        document.querySelectorAll(".thumbnail").forEach((thumb, idx) => {
          if (idx === newIndex) {
            thumb.classList.add("active")
          } else {
            thumb.classList.remove("active")
          }
        })

        currentIndex = newIndex
      }

      // Previous button
      document.querySelector(".prev-btn").addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + totalImages) % totalImages
        updateCarousel(newIndex)
      })

      // Next button
      document.querySelector(".next-btn").addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % totalImages
        updateCarousel(newIndex)
      })

      // Thumbnail clicks
      document.querySelectorAll(".thumbnail").forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const newIndex = Number.parseInt(thumb.dataset.index)
          updateCarousel(newIndex)
        })
      })
    }

    // Add event listeners for color swatches if multiple colors exist
    if (hasMultipleColors) {
      document.querySelectorAll(".color-swatch").forEach((swatch) => {
        swatch.addEventListener("click", () => {
          // Update selected swatch
          document.querySelectorAll(".color-swatch").forEach((s) => s.classList.remove("selected"))
          swatch.classList.add("selected")

          // Update color name display
          document.getElementById("currentColor").textContent = swatch.dataset.colorName

          // Update main image to show the selected color
          if (!hasExtraImages) {
            document.getElementById("mainImage").src = swatch.dataset.previewImage
          }
        })
      })
    }

    // Update the "Add to Cart" event listener to include the selected color information
    document.getElementById("addToCart").addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("so-cart")) || []

      // Create a copy of the product to avoid modifying the original
      const productToAdd = { ...product }

      // If multiple colors exist and a color is selected, save the selected color info
      if (hasMultipleColors) {
        const selectedSwatch = document.querySelector(".color-swatch.selected")
        if (selectedSwatch) {
          const colorCode = selectedSwatch.dataset.colorCode
          const colorName = selectedSwatch.dataset.colorName
          const colorImage = selectedSwatch.dataset.previewImage

          // Store the selected color information
          productToAdd.selectedColor = {
            ColorCode: colorCode,
            ColorName: colorName,
            ColorPreviewImageSrc: colorImage,
          }

          // Update the product image to match the selected color
          if (productToAdd.Images) {
            productToAdd.Images.PrimaryLarge = colorImage
            productToAdd.Images.PrimaryExtraLarge = colorImage
          }
        }
      }

      const existingItem = cart.find((item) => item.Id === productToAdd.Id)

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1
        // If the product already exists but with a different color, update the color
        if (productToAdd.selectedColor) {
          existingItem.selectedColor = productToAdd.selectedColor
          if (existingItem.Images) {
            existingItem.Images.PrimaryLarge = productToAdd.selectedColor.ColorPreviewImageSrc
            existingItem.Images.PrimaryExtraLarge = productToAdd.selectedColor.ColorPreviewImageSrc
          }
        }
      } else {
        productToAdd.quantity = 1
        cart.push(productToAdd)
      }

      localStorage.setItem("so-cart", JSON.stringify(cart))
      updateCartCount() // Update cart counter
      showNotification(`${productToAdd.NameWithoutBrand} added to cart!`)
    })

    // Add wishlist button functionality
    const wishlistButton = document.getElementById("wishlistButton")
    wishlistButton.addEventListener("click", () => {
      const productId = wishlistButton.dataset.id
      const inWishlist = wishlistButton.classList.contains("in-wishlist")

      if (inWishlist) {
        // Remove from wishlist
        if (removeFromWishlist(productId)) {
          wishlistButton.classList.remove("in-wishlist")
          wishlistButton.innerHTML = 'Add to Wishlist <span class="wishlist-icon">🤍</span>'
          showNotification(`${product.NameWithoutBrand} removed from wishlist`)
        }
      } else {
        // Add to wishlist
        // Create a copy of the product with selected color
        const productToAdd = { ...product }

        // If multiple colors exist and a color is selected, save the selected color info
        if (hasMultipleColors) {
          const selectedSwatch = document.querySelector(".color-swatch.selected")
          if (selectedSwatch) {
            const colorCode = selectedSwatch.dataset.colorCode
            const colorName = selectedSwatch.dataset.colorName
            const colorImage = selectedSwatch.dataset.previewImage

            // Store the selected color information
            productToAdd.selectedColor = {
              ColorCode: colorCode,
              ColorName: colorName,
              ColorPreviewImageSrc: colorImage,
            }

            // Update the product image to match the selected color
            if (productToAdd.Images) {
              productToAdd.Images.PrimaryLarge = colorImage
              productToAdd.Images.PrimaryExtraLarge = colorImage
            }
          }
        }

        if (addToWishlist(productToAdd)) {
          wishlistButton.classList.add("in-wishlist")
          wishlistButton.innerHTML = 'Remove from Wishlist <span class="wishlist-icon">❤️</span>'
          showNotification(`${product.NameWithoutBrand} added to wishlist`)
        }
      }
    })

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

    // Initialize the comments system
    this.initComments(product.Id)
  }

  // Comments system methods
  initComments(productId) {
    // Load existing comments
    this.loadComments(productId)

    // Only set up comment form if user is logged in
    if (isLoggedIn()) {
      // Set up rating stars
      this.setupRatingStars()

      // Set up comment form submission
      const commentForm = document.getElementById("comment-form")
      if (commentForm) {
        commentForm.addEventListener("submit", (e) => {
          e.preventDefault()
          this.submitComment(productId)
        })
      }
    }
  }

  loadComments(productId) {
    const commentsKey = `product-comments-${productId}`
    const comments = JSON.parse(localStorage.getItem(commentsKey)) || []
    const commentsList = document.getElementById("comments-list")

    if (commentsList) {
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">Be the first to review this product!</p>'
      } else {
        // Sort comments by date (newest first)
        comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

        commentsList.innerHTML = `
                    <h3>${comments.length} Review${comments.length !== 1 ? "s" : ""}</h3>
                    <div class="comments-list">
                        ${comments.map((comment) => this.renderComment(comment)).join("")}
                    </div>
                `
      }
    }
  }

  renderComment(comment) {
    const date = new Date(comment.timestamp)
    const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

    // Generate star rating HTML
    const stars = "★".repeat(comment.rating) + "☆".repeat(5 - comment.rating)

    return `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${this.escapeHtml(comment.name)}</span>
                    <span class="comment-date">${formattedDate}</span>
                </div>
                <div class="comment-rating">${stars}</div>
                <div class="comment-body">${this.escapeHtml(comment.text)}</div>
            </div>
        `
  }

  setupRatingStars() {
    const stars = document.querySelectorAll(".star")
    const ratingInput = document.getElementById("comment-rating")

    if (!stars.length || !ratingInput) return

    stars.forEach((star) => {
      star.addEventListener("mouseover", () => {
        const rating = Number.parseInt(star.dataset.rating)
        this.highlightStars(rating)
      })

      star.addEventListener("mouseout", () => {
        const currentRating = Number.parseInt(ratingInput.value) || 0
        this.highlightStars(currentRating)
      })

      star.addEventListener("click", () => {
        const rating = Number.parseInt(star.dataset.rating)
        ratingInput.value = rating
        this.highlightStars(rating)
      })
    })
  }

  highlightStars(rating) {
    const stars = document.querySelectorAll(".star")
    stars.forEach((star) => {
      const starRating = Number.parseInt(star.dataset.rating)
      if (starRating <= rating) {
        star.classList.add("selected")
      } else {
        star.classList.remove("selected")
      }
    })
  }

  submitComment(productId) {
    // Double-check that user is logged in before submitting
    if (!isLoggedIn()) {
      this.showCommentError("You must be logged in to submit a review")
      return
    }

    const nameInput = document.getElementById("comment-name")
    const textInput = document.getElementById("comment-text")
    const ratingInput = document.getElementById("comment-rating")

    if (!nameInput || !textInput || !ratingInput) return

    const name = nameInput.value.trim()
    const text = textInput.value.trim()
    const rating = Number.parseInt(ratingInput.value) || 0

    if (!name || !text) {
      this.showCommentError("Please fill in all required fields")
      return
    }

    if (rating === 0) {
      this.showCommentError("Please select a rating")
      return
    }

    // Create new comment object
    const newComment = {
      name,
      text,
      rating,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    const commentsKey = `product-comments-${productId}`
    const existingComments = JSON.parse(localStorage.getItem(commentsKey)) || []
    existingComments.push(newComment)
    localStorage.setItem(commentsKey, JSON.stringify(existingComments))

    // Reset form
    nameInput.value = ""
    textInput.value = ""
    ratingInput.value = "0"
    this.highlightStars(0)

    // Show success message
    this.showCommentSuccess("Your review has been added!")

    // Reload comments
    this.loadComments(productId)
  }

  showCommentError(message) {
    const form = document.getElementById("comment-form")
    if (!form) return

    // Remove any existing error messages
    const existingError = form.querySelector(".error-message")
    if (existingError) existingError.remove()

    // Create and add new error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message
    form.prepend(errorDiv)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      errorDiv.classList.add("fade-out")
      setTimeout(() => errorDiv.remove(), 500)
    }, 3000)
  }

  showCommentSuccess(message) {
    const form = document.getElementById("comment-form")
    if (!form) return

    // Create and add success message
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    form.prepend(successDiv)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      successDiv.classList.add("fade-out")
      setTimeout(() => successDiv.remove(), 500)
    }, 3000)
  }

  // Helper function to escape HTML to prevent XSS
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
}
