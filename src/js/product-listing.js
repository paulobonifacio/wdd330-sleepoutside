import { getParam, qs } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

async function displaySearchResults() {
  const searchQuery = getParam("search")?.toLowerCase() || "";
  const category = getParam("category") || "tents"; // Default to "tents" if category is missing

  const dataSource = new ProductData(category);
  let products;

  try {
    products = await dataSource.fetchData(); // Ensure we use the correct function
  } catch (error) {
    qs(".product-list").innerHTML = "<p>Error loading products.</p>";
    return;
  }

  // ✅ Filter Products by Search Query
  const filteredProducts = products.filter(product => {
    const name = product.NameWithoutBrand.toLowerCase();
    const brand = product.Brand?.Name?.toLowerCase() || "";
    return name.includes(searchQuery) || brand.includes(searchQuery);
  });

  // ✅ Ensure category is in product links
  const listElement = qs(".product-list");
  if (!listElement) return;

  if (filteredProducts.length === 0) {
    listElement.innerHTML = `<p>No products found for "${searchQuery}".</p>`;
  } else {
    listElement.innerHTML = filteredProducts.map(product => `
      <div class="product-card">
        <a href="product.html?product=${product.Id}&category=${category}">
          <img src="${product.Images?.PrimaryMedium || product.Image}" alt="${product.NameWithoutBrand}" />
          <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
          <h2>${product.NameWithoutBrand}</h2>
          <p>$${product.FinalPrice}</p>
        </a>
      </div>
    `).join("");
  }
}

displaySearchResults();
