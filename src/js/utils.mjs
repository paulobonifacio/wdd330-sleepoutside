// import { getLocalStorage } from "./utils.mjs";


// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// helper to get parameter strings
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


export function handleSearch() {
  const searchForm = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload

    const query = searchInput.value.trim(); // Get the search query
    if (query) {
      // Redirect to product listing page with search query
      window.location.href = `product_listing/index.html?search=${encodeURIComponent(query)}`;
    }
  });
}


// // ✅ Function to update cart count across all pages
// function updateCartCountGlobal() {
//   let cart = getLocalStorage("so-cart") || [];
//   const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

//   // Update cart count on all pages
//   document.querySelectorAll(".cart-count").forEach(cartCountElement => {
//     cartCountElement.textContent = totalItems;
//   });
// }

// // ✅ Run this function on every page
// document.addEventListener("DOMContentLoaded", updateCartCountGlobal);
