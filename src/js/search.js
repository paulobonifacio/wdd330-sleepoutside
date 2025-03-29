document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission

      const query = searchInput.value.trim().toLowerCase();
      if (query !== "") {
          const searchURL = `searchResults.html?query=${encodeURIComponent(query)}`;
          window.open(searchURL, "_blank"); // Open search results in a new tab
      }
  });
});


function searchProducts(query) {
  // Fetch product data (assume data is in a JSON file)
  fetch("json/tents.json") // Modify path if necessary
    .then((response) => response.json())
    .then((products) => {
      // Filter products based on query
      let filteredProducts = products.filter((product) =>
        product.NameWithoutBrand.toLowerCase().includes(query)
      );

      // Display filtered results
      displaySearchResults(filteredProducts);
    })
    .catch((error) => console.error("Error fetching products:", error));
}

async function displaySearchResults() {
  const searchQuery = getParam("search")?.toLowerCase() || "";

  if (!searchQuery) {
    qs(".product-list").innerHTML = "<p>❌ Please enter a search term.</p>";
    return;
  }

  console.log(`🔍 Searching for: "${searchQuery}"`);

  const allProducts = await fetchAllProducts();

  console.log(`📦 Total products available for search: ${allProducts.length}`);

  if (allProducts.length === 0) {
    qs(".product-list").innerHTML = "<p>❌ No products available to search.</p>";
    return;
  }

  // ✅ Search by Name or Brand (Case-Insensitive)
  const filteredProducts = allProducts.filter(product => {
    const name = product.NameWithoutBrand?.toLowerCase() || "";
    const brand = product.Brand?.Name?.toLowerCase() || "";
    return name.includes(searchQuery) || brand.includes(searchQuery);
  });

  console.log(`🔎 Search results found: ${filteredProducts.length}`);

  const listElement = qs(".product-list");
  if (!listElement) return;

  if (filteredProducts.length === 0) {
    listElement.innerHTML = `<p>❌ No products found for "${searchQuery}".</p>`;
  } else {
    listElement.innerHTML = filteredProducts
      .map(product => `
        <div class="product-card">
          <a href="product.html?product=${product.Id}&category=${product.category}">
            <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.NameWithoutBrand}" />
            <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
            <h2>${product.NameWithoutBrand}</h2>
            <p>$${product.FinalPrice}</p>
          </a>
        </div>
      `)
      .join("");
  }
}
