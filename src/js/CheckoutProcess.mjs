import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.externalServices = new ExternalServices();
    
    console.log("CheckoutProcess initialized with key:", key);
    console.log("OutputSelector:", outputSelector);
  }

  init() {
    // Get cart items from localStorage
    const cartItems = getLocalStorage(this.key);
    console.log("Cart items from localStorage:", cartItems);
    
    if (!cartItems || cartItems.length === 0) {
      console.warn("No items in cart!");
      this.list = [];
      
      // Display empty cart message
      const summaryItemsElement = document.querySelector(".summary-items");
      if (summaryItemsElement) {
        summaryItemsElement.innerHTML = "<p>Your cart is empty. Please add items before checkout.</p>";
      }
    } else {
      this.list = cartItems;
      console.log("Cart items loaded:", this.list.length, "items");
    }
    
    // Calculate and display item summary
    this.calculateItemSummary();
    
    // Display order items
    this.displayOrderItems();
  }

  calculateItemSummary() {
    // Calculate the total amount of the items in the cart
    const summaryElement = document.querySelector(this.outputSelector + " #subtotal");
    console.log("Calculating item summary");
    
    if (this.list.length === 0) {
      this.itemTotal = 0;
      if (summaryElement) {
        summaryElement.textContent = "$0.00";
      }
      return;
    }
    
    this.itemTotal = this.list.reduce((total, item) => {
      const quantity = item.quantity || item.Quantity || 1;
      const price = item.FinalPrice || item.Price || 0;
      return total + price * quantity;
    }, 0);
    
    console.log("Item total calculated:", this.itemTotal);
    
    if (summaryElement) {
      summaryElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    console.log("Calculating order total");
    
    // Calculate the shipping and tax amounts, then use them to calculate the order total
    this.tax = this.itemTotal * 0.06; // 6% sales tax
    
    // Shipping: $10 for the first item plus $2 for each additional item
    const totalItems = this.list.reduce((sum, item) => {
      const quantity = item.quantity || item.Quantity || 1;
      return sum + quantity;
    }, 0);
    
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    
    console.log("Order total calculated:", {
      itemTotal: this.itemTotal,
      tax: this.tax,
      shipping: this.shipping,
      orderTotal: this.orderTotal
    });

    // Display the totals on the page
    const taxElement = document.querySelector(this.outputSelector + " #tax");
    const shippingElement = document.querySelector(this.outputSelector + " #shipping");
    const orderTotalElement = document.querySelector(this.outputSelector + " #order-total");
    
    if (taxElement) {
      taxElement.textContent = `$${this.tax.toFixed(2)}`;
    }
    
    if (shippingElement) {
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    }
    
    if (orderTotalElement) {
      orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  displayOrderItems() {
    const summaryItemsElement = document.querySelector(".summary-items");
    if (!summaryItemsElement) {
      console.error("Summary items element not found");
      return;
    }

    if (this.list.length === 0) {
      summaryItemsElement.innerHTML = "<p>Your cart is empty</p>";
      return;
    }

    console.log("Displaying order items:", this.list.length, "items");

    const itemsHtml = this.list.map(item => {
      const imageUrl = item.selectedColor?.ColorPreviewImageSrc || 
                      item.Images?.PrimaryLarge || 
                      item.Images?.PrimarySmall ||
                      item.Image || 
                      "/images/default-product.jpg";
      
      const itemName = item.NameWithoutBrand || item.Name || "Product";
      const quantity = item.quantity || item.Quantity || 1;
      const price = item.FinalPrice || item.Price || 0;
      
      return `
        <div class="summary-item">
          <div class="summary-item-image">
            <img src="${imageUrl}" alt="${itemName}" width="50">
          </div>
          <div class="summary-item-details">
            <div class="summary-item-name">${itemName}</div>
            <div class="summary-item-quantity">Qty: ${quantity}</div>
          </div>
          <div class="summary-item-price">$${(price * quantity).toFixed(2)}</div>
        </div>
      `;
    }).join("");

    summaryItemsElement.innerHTML = itemsHtml;
  }

  async checkout() {
    console.log("Starting checkout process");
    
    const formElement = document.forms["checkout"];
    
    // Create a normalized order object with consistent property names
    const normalizedItems = this.list.map(item => {
      return {
        Id: item.Id,
        Name: item.Name || item.NameWithoutBrand || "Product",
        Price: item.FinalPrice || item.Price || 0,
        Quantity: item.quantity || item.Quantity || 1
      };
    });
    
    const order = {
      fname: formElement.fname.value,
      lname: formElement.lname.value,
      street: formElement.street.value,
      city: formElement.city.value,
      state: formElement.state.value,
      zip: formElement.zip.value,
      cardNumber: formElement.cardNumber.value,
      expiration: formElement.expiration.value,
      code: formElement.code.value,
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax,
      items: normalizedItems,
    };
    
    try {
      // For testing purposes, log the order object
      console.log("Submitting order:", order);
      
      // Show a loading message
      this.displayMessage("Processing order...", "info-message");
      
      const res = await this.externalServices.checkout(order);
      console.log("Order submitted successfully:", res);
      
      // Clear the cart and redirect to success page
      localStorage.removeItem(this.key);
      
      // Store order details for the success page
      localStorage.setItem("so-order", JSON.stringify({
        orderId: res.orderId || "Unknown",
        orderDate: new Date().toLocaleDateString(),
        orderTotal: this.orderTotal,
        shipping: this.shipping,
        items: this.list.length
      }));
      
      // Redirect to success page
      location.assign("/checkout/success.html");
      
    } catch (err) {
      console.error("Error submitting order:", err);
      
      // Display error message to user
      this.displayMessage(
        err.message || "There was an error processing your order. Please try again.",
        "error-message"
      );
      
      // Re-enable the submit button
      const submitButton = document.getElementById("checkout-button");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Place Order";
      }
    }
  }
  
  displayMessage(message, className) {
    // Get the message container
    const messageContainer = document.getElementById("checkout-message");
    
    if (messageContainer) {
      messageContainer.textContent = message;
      messageContainer.className = "checkout-message " + className;
      messageContainer.style.display = "block";
      
      // Scroll to the message
      messageContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      // If no message container exists, create one
      const element = document.createElement("div");
      element.id = "checkout-message";
      element.classList.add("checkout-message", className);
      element.textContent = message;
      
      // Insert at the top of the form
      const form = document.getElementById("checkout-form");
      if (form) {
        form.prepend(element);
      }
    }
  }
}

