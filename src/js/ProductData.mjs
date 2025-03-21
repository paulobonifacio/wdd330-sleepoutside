export default class ProductData {
  constructor(category) {
      console.log("🔍 Received category:", category, "(Type:", typeof category, ")");

      if (!category || typeof category !== "string") {
          console.error("❌ Category is missing or invalid:", category);
          this.category = "tents"; // Default category
      } else {
          this.category = category.toLowerCase();
      }

      console.log("✅ Final category value:", this.category);
  }

  async fetchData(category) {
      const url = `../json/${category}.json`;
      console.log(`📂 Attempting to fetch data from: ${url}`);

      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          console.log(`📦 Raw JSON data loaded from ${category}:`, data);

          // ✅ Handle both JSON formats: Flat array and "Result"
          return Array.isArray(data) ? data : data.Result || [];
      } catch (error) {
          console.error(`❌ Error fetching data for ${category}:`, error);
          return []; // Return empty array on error
      }
  }

  async findProductById(productId) {
      console.log(`🔎 Searching for product ID: ${productId} in category: ${this.category}`);

      // ✅ Try finding in the detected category first
      let products = await this.fetchData(this.category);
      let product = products.find(p => p.Id === productId);

      // ✅ If not found, search in all categories
      if (!product) {
          console.warn(`⚠️ Product ${productId} not found in ${this.category}. Searching all categories...`);
          const categories = ["tents", "backpacks", "sleeping-bags"];
          for (let cat of categories) {
              if (cat === this.category) continue; // Skip already-searched category

              products = await this.fetchData(cat);
              product = products.find(p => p.Id === productId);

              if (product) {
                  console.log(`✅ Product ${productId} found in ${cat}!`);
                  return product;
              }
          }
      }

      if (!product) {
          console.warn(`❌ Product ${productId} was not found in any category.`);
          return null;
      }

      return product;
  }
}
