// // import { getLocalStorage } from "./utils.mjs";


// // wrapper for querySelector...returns matching element
// export function qs(selector, parent = document) {
//   return parent.querySelector(selector);
// }


// // retrieve data from localstorage
// export function getLocalStorage(key) {
//   return JSON.parse(localStorage.getItem(key));
// }
// // save data to local storage
// export function setLocalStorage(key, data) {
//   localStorage.setItem(key, JSON.stringify(data));
// }

// // helper to get parameter strings
// export function getParam(param) {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const product = urlParams.get(param);
//   return product;
// }

// // set a listener for both touchend and click
// export function setClick(selector, callback) {
//   qs(selector).addEventListener("touchend", (event) => {
//     event.preventDefault();
//     callback();
//   });
//   qs(selector).addEventListener("click", callback);
// }


// export function handleSearch() {
//   const searchForm = document.getElementById("searchBox");
//   const searchInput = document.getElementById("searchInput");

//   if (!searchForm || !searchInput) return;

//   searchForm.addEventListener("submit", (event) => {
//     event.preventDefault(); // Prevent page reload

//     const query = searchInput.value.trim(); // Get the search query
//     if (query) {
//       // Redirect to product listing page with search query
//       window.location.href = `product_listing/index.html?search=${encodeURIComponent(query)}`;
//     }
//   });
// }








// /**
//  * Loads the header dynamically into the page
//  * @param {string} selector - The selector for the element where the header should be inserted
//  */
// function loadHeader(selector = "header") {
//   const headerElement = document.querySelector(selector);
//   if (!headerElement) return;

//   // Create the header HTML
//   const headerHTML = `
//     <div class="logo">
//         <img src="/images/noun_Tent_2517.svg" alt="Tent Logo">
//         <a href="/index.html"> Sleep<span class="highlight">Outside</span></a>
//     </div>

//     <div class="header-right">
//         <form id="searchBox" class="search-form">
//             <input type="text" id="searchInput" placeholder="Search for a product..." />
//             <button type="submit">🔍</button>
//         </form>

//         <a href="/cart/index.html" class="cart-icon">
//             <img src="/images/noun_Backpack_65884.svg" alt="Cart">
//             <span class="cart-count">0</span>
//         </a>
//     </div>
//   `;

//   // Insert the header HTML
//   headerElement.innerHTML = headerHTML;
//   headerElement.classList.add("divider");

//   // Update the cart count
//   updateCartCount();

//   // Add event listener for search form
//   const searchForm = document.getElementById("searchBox");
//   if (searchForm) {
//     searchForm.addEventListener("submit", function(e) {
//       e.preventDefault();
//       const searchTerm = document.getElementById("searchInput").value.trim();
//       if (searchTerm) {
//         window.location.href = `/search/index.html?q=${encodeURIComponent(searchTerm)}`;
//       }
//     });
//   }
// }

// /**
//  * Updates the cart count in the header
//  */
// function updateCartCount() {
//   const cart = getLocalStorage("so-cart") || [];
//   const totalItems = cart.reduce((sum, item) => {
//     const quantity = item.quantity || item.Quantity || 1;
//     return sum + quantity;
//   }, 0);

//   // Update all cart count elements
//   document.querySelectorAll(".cart-count").forEach(element => {
//     element.textContent = totalItems;
//   });
// }

// /**
//  * Loads both header and footer dynamically
//  */
// function loadHeaderFooter() {
//   loadHeader();
//   loadFooter();
// }

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

/**
 * Loads the header dynamically into the page
 * @param {string} selector - The selector for the element where the header should be inserted
 */
export function loadHeader(selector = "header") {
  const headerElement = document.querySelector(selector);
  if (!headerElement) return;

  // Create the header HTML
  const headerHTML = `
    <div class="logo">
        <img src="/images/noun_Tent_2517.svg" alt="Tent Logo">
        <a href="/index.html"> Sleep<span class="highlight">Outside</span></a>
    </div>

    <div class="header-right">
        <form id="searchBox" class="search-form">
            <input type="text" id="searchInput" placeholder="Search for a product..." />
            <button type="submit">🔍</button>
        </form>

        <a href="/cart/index.html" class="cart-icon">
            <img src="/images/noun_Backpack_65884.svg" alt="Cart">
            <span class="cart-count">0</span>
        </a>
    </div>
  `;

  // Insert the header HTML
  headerElement.innerHTML = headerHTML;
  headerElement.classList.add("divider");

  // Update the cart count
  updateCartCount();

  // Add event listener for search form
  const searchForm = document.getElementById("searchBox");
  if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const searchTerm = document.getElementById("searchInput").value.trim();
      if (searchTerm) {
        window.location.href = `/search/index.html?q=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
}

/**
 * Updates the cart count in the header
 */
export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const totalItems = cart.reduce((sum, item) => {
    const quantity = item.quantity || item.Quantity || 1;
    return sum + quantity;
  }, 0);

  // Update all cart count elements
  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = totalItems;
  });
}

/**
 * Loads the footer dynamically into the page
 * @param {string} selector - The selector for the element where the footer should be inserted
 */
export function loadFooter(selector = "footer") {
  const footerElement = document.querySelector(selector);
  if (!footerElement) return;

  const footerHTML = `
    <div class="footer-content">
      <div class="footer-logo">
        <img src="/images/noun_Tent_2517.svg" alt="Tent Logo" width="50">
        <p>&copy; ${new Date().getFullYear()} Sleep Outside</p>
      </div>
      <div class="footer-links">
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/product-listing/index.html?category=tents">Tents</a></li>
          <li><a href="/product-listing/index.html?category=backpacks">Backpacks</a></li>
          <li><a href="/product-listing/index.html?category=sleeping-bags">Sleeping Bags</a></li>
          <li><a href="/cart/index.html">Cart</a></li>
          <li><a href="/login/index.html">Admin Login</a></li>
        </ul>
      </div>
    </div>
  `;

  footerElement.innerHTML = footerHTML;
}

/**
 * Loads both header and footer dynamically
 */
export function loadHeaderFooter() {
  loadHeader();
  loadFooter();
}

