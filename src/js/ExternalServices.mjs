
// const baseURL = "https://wdd330-backend.onrender.com";

// export default class ExternalServices {
//   constructor() {
//     // Nothing needed for now
//   }

//   async getData(category) {
//     const response = await fetch(baseURL + `/products/search/${category}`);
//     const data = await response.json();
//     return data.Result;
//   }

//   async findProductById(id) {
//     const response = await fetch(baseURL + `/product/${id}`);
//     const data = await response.json();
//     return data.Result;
//   }

//   async checkout(order) {
//     try {
//       const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify(order),
//         mode: "cors" // Explicitly set CORS mode
//       };
      
//       // Use https instead of http
//       const response = await fetch(baseURL + "/checkout", options);
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "There was a problem with your order.");
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error("Checkout error:", err);
//       throw new Error("Network error: Unable to connect to the server. Please check your internet connection and try again.");
//     }
//   }

//   // New authentication methods
//   async loginUser(credentials) {
//     try {
//       const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       };
      
//       const response = await fetch(baseURL + "/login", options);
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed. Please check your credentials.");
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error("Login error:", err);
//       throw err;
//     }
//   }

//   async getOrders(token) {
//     try {
//       const options = {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       };
      
//       const response = await fetch(baseURL + "/orders", options);
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch orders. Please try again.");
//       }
      
//       return await response.json();
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       throw err;
//     }
//   }
// }



/**
 * version 2.0
 */

// const baseURL = "https://wdd330-backend.onrender.com";

// export default class ExternalServices {
//  constructor() {
//    // Make baseURL accessible as a property
//    this.baseURL = baseURL;
//  }

//  async getData(category) {
//    const response = await fetch(baseURL + `/products/search/${category}`);
//    const data = await response.json();
//    return data.Result;
//  }

//  async findProductById(id) {
//    const response = await fetch(baseURL + `/product/${id}`);
//    const data = await response.json();
//    return data.Result;
//  }

//  async checkout(order) {
//    try {
//      const options = {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//          "Accept": "application/json"
//        },
//        body: JSON.stringify(order),
//        mode: "cors" // Explicitly set CORS mode
//      };
     
//      // Use https instead of http
//      const response = await fetch(baseURL + "/checkout", options);
     
//      if (!response.ok) {
//        const errorData = await response.json();
//        throw new Error(errorData.message || "There was a problem with your order.");
//      }
     
//      return await response.json();
//    } catch (err) {
//      console.error("Checkout error:", err);
//      throw new Error("Network error: Unable to connect to the server. Please check your internet connection and try again.");
//    }
//  }

//  // Authentication methods
//  async loginUser(credentials) {
//    try {
//      const options = {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(credentials),
//      };
     
//      const response = await fetch(baseURL + "/login", options);
     
//      if (!response.ok) {
//        const errorData = await response.json();
//        throw new Error(errorData.message || "Login failed. Please check your credentials.");
//      }
     
//      return await response.json();
//    } catch (err) {
//      console.error("Login error:", err);
//      throw err;
//    }
//  }

//  async getOrders(token) {
//    try {
//      const options = {
//        method: "GET",
//        headers: {
//          "Authorization": `Bearer ${token}`,
//        },
//      };
     
//      const response = await fetch(baseURL + "/orders", options);
     
//      if (!response.ok) {
//        throw new Error("Failed to fetch orders. Please try again.");
//      }
     
//      return await response.json();
//    } catch (err) {
//      console.error("Error fetching orders:", err);
//      throw err;
//    }
//  }

//  // New method for registering users
//  async registerUser(userData) {
//    try {
//      const options = {
//        method: "POST",
//        headers: {
//          "Content-Type": "application/json",
//        },
//        body: JSON.stringify(userData),
//      };
     
//      const response = await fetch(baseURL + "/users", options);
     
//      if (!response.ok) {
//        const errorData = await response.json();
//        throw new Error(errorData.message || "Registration failed. Please try again.");
//      }
     
//      return await response.json();
//    } catch (err) {
//      console.error("Registration error:", err);
//      throw err;
//    }
//  }
// }






/**
 * verison 3.0
 * 
 */

const baseURL = "https://wdd330-backend.onrender.com";

export default class ExternalServices {
  constructor() {
    // Make baseURL accessible as a property
    this.baseURL = baseURL;
  }

  async getData(category) {
    const response = await fetch(baseURL + `/products/search/${category}`);
    const data = await response.json();
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(baseURL + `/product/${id}`);
    const data = await response.json();
    return data.Result;
  }

  async checkout(order) {
    try {
        console.log("Sending checkout request to:", baseURL + "/checkout");

        // Ensure orderDate is provided
        if (!order.orderDate) {
            order.orderDate = new Date().toISOString();
        }

        // Ensure cardNumber contains only digits
        if (order.cardNumber) {
            order.cardNumber = order.cardNumber.replace(/\D/g, "");
        }

        console.log("Order data:", JSON.stringify(order));

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("so-token")}`
            },
            body: JSON.stringify(order),
            mode: "cors"
        };

        // Make the request
        const response = await fetch(baseURL + "/checkout", options);

        console.log("Checkout response status:", response.status);

        // Handle non-OK responses
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Checkout error response:", errorData);
            throw new Error(errorData.message || JSON.stringify(errorData));
        }

        // Parse and return the successful response
        const responseData = await response.json();
        console.log("Checkout success response:", responseData);
        return responseData;
    } catch (err) {
        console.error("Checkout error:", err);
        throw new Error(err.message || "Network error: Unable to connect to the server.");
    }
}


//   async checkout(order) {
//     try {
//         console.log("Sending checkout request to:", baseURL + "/checkout");

//         // Ensure orderDate is correctly formatted
//         if (!order.orderDate) {
//             order.orderDate = new Date().toISOString(); // Set orderDate if missing
//         }

//         console.log("Final Order Data:", JSON.stringify(order, null, 2));

//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json",
//                 "Authorization": `Bearer ${localStorage.getItem("so-token")}`
//             },
//             body: JSON.stringify(order),
//             mode: "cors"
//         };

//         // Make the request
//         const response = await fetch(baseURL + "/checkout", options);

//         console.log("Checkout response status:", response.status);

//         // Handle non-OK responses
//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Checkout error response:", errorData);

//             // Log if the error is due to missing orderDate
//             if (errorData.orderDate) {
//                 console.error("Error related to orderDate:", errorData.orderDate);
//             }

//             throw new Error(errorData.message || JSON.stringify(errorData));
//         }

//         // Parse and return the successful response
//         const responseData = await response.json();
//         console.log("Checkout success response:", responseData);
//         return responseData;
//     } catch (err) {
//         console.error("Checkout error:", err);
//         throw new Error(err.message || "Network error: Unable to connect to the server. Please check your internet connection and try again.");
//     }
// }




  // Authentication methods
  async loginUser(credentials) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      };
      
      const response = await fetch(baseURL + "/login", options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please check your credentials.");
      }
      
      return await response.json();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  }

  async getOrders(token) {
    try {
      const options = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      };
      
      const response = await fetch(baseURL + "/orders", options);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders. Please try again.");
      }
      
      return await response.json();
    } catch (err) {
      console.error("Error fetching orders:", err);
      throw err;
    }
  }

  // Method for registering users
  async registerUser(userData) {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };
      
      const response = await fetch(baseURL + "/users", options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed. Please try again.");
      }
      
      return await response.json();
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  }
}

