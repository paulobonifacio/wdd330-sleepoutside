document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("registerModal");
    const closeBtn = document.querySelector(".close-btn");
    const registerBtn = document.getElementById("registerBtn");

    // Check if the user has seen the modal before
    if (!localStorage.getItem("hasSeenRegisterModal")) {
        modal.style.display = "block"; // Show modal

        // When user closes modal, store that they’ve seen it
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            localStorage.setItem("hasSeenRegisterModal", "true");
        });

        // Redirect to signup page on button click
        registerBtn.addEventListener("click", function () {
            window.location.href = "/register.html";
        });

        // Close modal when clicking outside
        window.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
                localStorage.setItem("hasSeenRegisterModal", "true");
            }
        });
    }
});
