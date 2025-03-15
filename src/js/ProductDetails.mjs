import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail"> 
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors?.[0]?.ColorName || "No Color"}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  </section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Search for product details
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails("main");

    // Add event to the “Add to Cart” button
    document.getElementById("addToCart").addEventListener("click", this.addProductToCart.bind(this));
  }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML("afterBegin", productDetailsTemplate(this.product));
  }

  addProductToCart() {
    // Get the current cart from LocalStorage
    let cart = getLocalStorage("so-cart") || [];

    if (!Array.isArray(cart)) {
      cart = [];
    }

    cart.push(this.product);
 
    //Update LocalStorage
    setLocalStorage("so-cart", cart);

    //Success message
    alert(`${this.product.NameWithoutBrand} has been added to your cart!`);
  }
}
