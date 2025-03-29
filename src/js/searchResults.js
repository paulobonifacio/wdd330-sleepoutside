document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query")?.toLowerCase();
    const searchResultsContainer = document.getElementById("searchResults");

    if (query) {
        console.log(`🔍 Searching for: ${query}`);

        try {
            // ✅ Fetch products from all categories
            const [tents, backpacks, sleepingBags] = await Promise.all([
                fetch("./json/tents.json").then(res => res.json()).catch(() => []),
                fetch("./json/backpacks.json").then(res => res.json()).catch(() => []),
                fetch("./json/sleeping-bags.json").then(res => res.json()).catch(() => [])
            ]);

            console.log("📂 Raw fetched data:", { tents, backpacks, sleepingBags });

            // ✅ Handle different JSON formats
            const allProducts = [
                ...(Array.isArray(tents.Result) ? tents.Result : Array.isArray(tents) ? tents : []),
                ...(Array.isArray(backpacks.Result) ? backpacks.Result : Array.isArray(backpacks) ? backpacks : []),
                ...(Array.isArray(sleepingBags.Result) ? sleepingBags.Result : Array.isArray(sleepingBags) ? sleepingBags : [])
            ].map(product => ({
                ...product,
                category: detectCategory(product) // ✅ Attach correct category
            }));

            console.log("✅ Combined products:", allProducts);

            // ✅ Filter products based on query
            const filteredProducts = allProducts.filter(product =>
                product.NameWithoutBrand?.toLowerCase().includes(query) ||
                (product.Brand?.Name && product.Brand.Name.toLowerCase().includes(query))
            );

            console.log(`🎯 Filtered results: ${filteredProducts.length} matches for "${query}"`);

            // ✅ Display search results
            if (filteredProducts.length === 0) {
                searchResultsContainer.innerHTML = `<p>No products found for "${query}"</p>`;
            } else {
                searchResultsContainer.innerHTML = filteredProducts.map(product => `
                    <div class="product-card">
                        <a href="product.html?product=${product.Id}&category=${product.category}" class="product-link">
                            <img src="${product.Image || product.Images?.PrimaryLarge || 'default-image.jpg'}" alt="${product.NameWithoutBrand}">
                            <h3 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h3>
                            <h2 class="card__name">${product.NameWithoutBrand}</h2>
                            <p class="product-card__price">$${product.FinalPrice}</p>
                        </a>
                    </div>
                `).join("");
            }
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            searchResultsContainer.innerHTML = "<p>Error loading search results.</p>";
        }
    }
});

// ✅ Function to detect category based on product ID
function detectCategory(product) {
    if (product.Id.startsWith("880") || product.Id.startsWith("98")) return "tents";
    if (product.Id.startsWith("223") || product.Id.startsWith("810")) return "backpacks";
    if (product.Id.startsWith("21")) return "sleeping-bags";
    return "unknown";
}


function enableProductLinks() {
    document.querySelectorAll(".product-link").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const productId = new URL(event.target.closest("a").href).searchParams.get("product");
            let category = event.target.closest("a").getAttribute("data-category");

            // ✅ If category is missing, fallback to stored category
            if (!category) {
                console.warn("⚠️ Category missing from link, using localStorage.");
                category = localStorage.getItem("selectedCategory") || "unknown";
            }

            localStorage.setItem("selectedCategory", category);
            console.log(`🛒 Storing category: ${category} for product ${productId}`);

            window.location.href = `product.html?product=${productId}&category=${category}`;
        });
    });
}
