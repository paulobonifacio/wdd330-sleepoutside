import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// ✅ Get product ID and category from URL
const productId = getParam("product");
let category = getParam("category");

// ✅ If category is missing, try to retrieve it from localStorage
if (!category) {
    console.warn("⚠️ Category missing in URL, checking localStorage...");
    category = localStorage.getItem("selectedCategory");
}

// ✅ If still missing, allow ProductData to search all categories
if (!category) {
    console.warn("⚠️ No category provided. The system will search all categories.");
}

// ✅ Create an instance of ProductData (will search all categories if needed)
console.log(`📦 Loading product ${productId} from category ${category || "unknown"}`);
const dataSource = new ProductData(category || "tents");

// ✅ Create an instance of ProductDetails and start loading
const product = new ProductDetails(productId, category || "tents");
product.init();
