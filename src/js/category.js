import { getParam } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");

    searchBox.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // ✅ Redirect to the same search mechanism used on the main page
            window.location.href = `/searchResults.html?query=${encodeURIComponent(query)}`;
        }
    });
});



// Get the category from the URL
const category = getParam("category");

// Set the page title dynamically
document.getElementById("category-title").textContent = `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

// Determine the correct JSON file path
const categoryFile = `json/${category}.json`;

// Fetch data and display products
fetch(categoryFile)
    .then(response => response.json())
    .then(data => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous data

        // Determine whether the JSON contains a "Result" array or is a direct array
        const products = Array.isArray(data) ? data : data.Result || [];

        if (products.length === 0) {
            productList.innerHTML = "<p>No products found in this category.</p>";
            return;
        }

        // Loop through products and create list items
        products.forEach(product => {
            const productItem = document.createElement("li");
            productItem.classList.add("product-card");

            productItem.innerHTML = `
                <a href="product_pages/?product=${product.Id}&category=${category}">
                    <img src="${product.Images?.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}">
                    <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
                    <h2 class="card__name">${product.NameWithoutBrand}</h2>
                    <p class="product-card__price">$${product.FinalPrice}</p>
                </a>
            `;

            productList.appendChild(productItem);
        });
    })
    .catch(error => {
        console.error("Error loading category products:", error);
        document.getElementById("product-list").innerHTML = "<p>Error loading products.</p>";
    });

    document.querySelectorAll(".category-link").forEach(category => {
        category.addEventListener("click", (event) => {
          event.preventDefault();
          const selectedCategory = event.target.dataset.category;
          localStorage.setItem("selectedCategory", selectedCategory);
          window.location.href = "searchResults.html";  // Redirect to search page
        });
      });
      