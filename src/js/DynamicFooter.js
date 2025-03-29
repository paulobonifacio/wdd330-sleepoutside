document.addEventListener("DOMContentLoaded", function () {
    // Insert the dynamic header
    const header = document.getElementById("header-container");
    if (header) {
        header.innerHTML = `
       
            <header>
                <div class="logo">
                    <img src="/images/noun_Tent_2517.svg" alt="Tent Logo">
                    <a href="../index.html"> Sleep<span class="highlight">Outside</span></a>
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
            </header>
        `;
    }

    // Insert the dynamic footer
    const footer = document.getElementById("footer-container");
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.innerHTML = `
            <div class="footer-content">
                <p>&copy; ${currentYear} Sleep Outside. All Rights Reserved.</p>
                <nav class="footer-links">
                    <a href="/about.html">About Us</a>
                    <a href="/contact.html">Contact</a>
                    <a href="/privacy.html">Privacy Policy</a> 
                    <a class="sign-up"  href="./register.html">Register </a>
                </nav>
            </div>
        `;
    }
});
