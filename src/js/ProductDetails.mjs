import ProductData from "./ProductData.mjs";
import { updateCartCount } from "./cart.js";


export default class ProductDetails {
    constructor(productId, category) {
        this.productId = productId;
        this.category = category;
        this.dataSource = new ProductData(category);
    }

    async init() {
        console.log(`🔎 Looking for product ID: ${this.productId} in ${this.category}`);

        const product = await this.dataSource.findProductById(this.productId);

        if (!product) {
            console.warn(`⚠️ Product ID ${this.productId} not found in ${this.category}`);
            document.querySelector("main").innerHTML = `<p>⚠️ Product not found.</p>`;
            return;
        }

        this.renderProductDetails(product);
    }

    renderProductDetails(product) {
        const element = document.querySelector("main");

        element.innerHTML = `
            <section class="product-detail"> 
                <h3>${product.Brand?.Name || "Unknown Brand"}</h3>
                <h2 class="divider">${product.NameWithoutBrand}</h2>
                <img class="divider" src="${product.Images?.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}" />
                <p class="product-card__price">$${product.FinalPrice}</p>
                <p class="product__color">${product.Colors?.[0]?.ColorName || "No Color"}</p>
                <p class="product__description">${product.DescriptionHtmlSimple || "No description available."}</p>
                <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
            </section>
        `;

        document.getElementById("addToCart").addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
            const existingItem = cart.find(item => item.Id === product.Id);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            localStorage.setItem("so-cart", JSON.stringify(cart));
            updateCartCount(); // ✅ increasing cart counter
            alert(`${product.NameWithoutBrand} added to cart!`);


        });
    }
}
