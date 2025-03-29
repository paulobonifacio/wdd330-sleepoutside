/** 
 * 
 * quick view 
 */
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("quickViewModal");
    const modalBody = document.getElementById("modal-body");
    const closeButton = document.querySelector(".close");

    if (!modal || !modalBody) {
        console.error("Modal elements not found");
        return;
    }

    // Global event listener to capture Quick View button clicks
    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("quick-view")) {
            console.log("quick view was clicked");
            event.preventDefault();

            // Find the closest product card
            const productCard = event.target.closest(".product-card");
            if (!productCard) return;

            // Get product description
            const description = productCard.querySelector(".hidden-description")?.innerHTML || "No description available.";

            // Create a clean clone of the product information
            const productInfo = document.createElement("div");
            
            // Get the product link for information
            const productLink = productCard.querySelector("a");
            if (!productLink) return;
            
            // Clone the product link content but not the quick view button
            const productClone = productLink.cloneNode(true);
            
            // Remove any quick view buttons from the clone
            const quickViewButtons = productClone.querySelectorAll(".quick-view");
            quickViewButtons.forEach(button => button.remove());
            
            // Also check for any quick view buttons that might be siblings of the link in the clone
            if (productClone.nextElementSibling && productClone.nextElementSibling.classList.contains("quick-view")) {
                productClone.nextElementSibling.remove();
            }
            
            // Add product details to modal
            modalBody.innerHTML = "";
            
            // Create a styled container for the product info
            const productContainer = document.createElement("div");
            productContainer.style.cssText = "margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;";
            productContainer.appendChild(productClone);
            modalBody.appendChild(productContainer);

            // Create a description container
            const descriptionContainer = document.createElement("div");
            descriptionContainer.style.cssText = "margin-top: 15px;";
            
            // Add a description label
            const descriptionLabel = document.createElement("h3");
            descriptionLabel.textContent = "Description";
            descriptionLabel.style.cssText = "font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;";
            descriptionContainer.appendChild(descriptionLabel);
            
            // Add the styled description
            const descriptionElement = document.createElement("div");
            descriptionElement.innerHTML = description; // Using innerHTML to preserve HTML formatting
            descriptionElement.style.cssText = "line-height: 1.5; color: #555; font-size: 14px; padding: 10px; background-color:skyblue; border-radius: 4px; color:black;";
            descriptionContainer.appendChild(descriptionElement);
            
            modalBody.appendChild(descriptionContainer);

            // Add "Close Quick View" button
            const closeQuickViewBtn = document.createElement("button");
            closeQuickViewBtn.textContent = "Close Quick View";
            closeQuickViewBtn.classList.add("close-quick-view");
            closeQuickViewBtn.style.cssText = "display:block; margin: 20px auto 0; padding: 10px 15px; background:#444; color:white; border:none; border-radius: 4px; cursor:pointer; font-weight: bold;";
            modalBody.appendChild(closeQuickViewBtn);

            // Open the modal
            modal.style.display = "flex";

            // Close the modal when clicking the "Close Quick View" button
            closeQuickViewBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }
    });

    // Close modal when clicking the "X" button
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
    } else {
        console.warn("Close button not found");
    }

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

import { getParam } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const category = getParam("category");
    const breadcrumb = document.getElementById("breadcrumb");
    const productList = document.getElementById("product-list");
    const modal = document.getElementById("quickViewModal");
    const modalBody = document.getElementById("modal-body");
    const closeButton = document.querySelector(".close");
    const sortBy = document.getElementById("sort-by");

    if (!category) {
        breadcrumb.style.display = "none";
        return;
    }

    // Capitalize first letter of category
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    // Set breadcrumb
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a> &raquo; 
        <span>${capitalize(category)}</span>
    `;

    // Fetch and render products
    const categoryFile = `json/${category}.json`;
    let products = [];

    fetch(categoryFile)
        .then((response) => response.json())
        .then((data) => {
            products = Array.isArray(data) ? data : data.Result || [];
            if (products.length === 0) {
                productList.innerHTML = "<p>No products found in this category.</p>";
                return;
            }
            renderProducts(products);
        })
        .catch((error) => {
            console.error("Error loading products:", error);
            productList.innerHTML = "<p>Error loading products.</p>";
        });

    // Render product list
    function renderProducts(products) {
        productList.innerHTML = "";

        products.forEach((product) => {
            const FinalPrice = product.FinalPrice;
            const SuggestedRetailPrice = product.SuggestedRetailPrice;

            const discount = FinalPrice < SuggestedRetailPrice
                ? `${Math.round((1 - FinalPrice / SuggestedRetailPrice) * 100)}% OFF`
                : "";

            const productItem = document.createElement("li");
            productItem.classList.add("product-card");

            productItem.innerHTML = `
                <a href="product_pages/?product=${product.Id}&category=${category}">
                    ${discount ? `<div class="discount-badge">${discount}</div>` : ""}
                    <img src="${product.Images?.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}">
                    <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
                    <h2 class="card__name">${product.NameWithoutBrand}</h2>
                    <p class="product-card__price"> $${FinalPrice.toFixed(2)}</p>
                    ${discount ? `<p class="list-price">Original: $${SuggestedRetailPrice.toFixed(2)}</p>` : ""}
                    <p class="hidden-description">${product.DescriptionHtmlSimple}</p>
                    <button class="quick-view">Quick View</button>
                </a>
            `;
            productList.appendChild(productItem);
        });
    }

    // Global modal close actions
    closeButton.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    // Sorting logic
    sortBy.addEventListener("change", function () {
        const sortByValue = this.value;
        const sortedProducts = [...products];

        if (sortByValue === "name") {
            sortedProducts.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
        } else if (sortByValue === "price-low-high") {
            sortedProducts.sort((a, b) => a.FinalPrice - b.FinalPrice);
        } else if (sortByValue === "price-high-low") {
            sortedProducts.sort((a, b) => b.FinalPrice - a.FinalPrice);
        }

        renderProducts(sortedProducts);
    });
});
