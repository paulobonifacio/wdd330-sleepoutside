// Function to create and show a customizable alert
function showAlert(message, type = "info", duration = 3000) {
  const alertContainer = document.getElementById("custom-alert-container");

  // Define color styles for different alert types
  const alertColors = {
    success: "green",
    error: "red",
    warning: "orange",
    info: "blue"
  };

  // Create the alert element
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("custom-alert");
  alertDiv.style.backgroundColor = alertColors[type] || "gray";
  alertDiv.innerHTML = `
    <span>${message}</span>
    <button class="close-alert">✖</button>
  `;

  // Add event listener for closing the alert manually
  alertDiv.querySelector(".close-alert").addEventListener("click", () => {
    alertDiv.remove();
  });

  // Append alert to the container
  alertContainer.appendChild(alertDiv);

  // Auto-remove alert after the specified duration
  setTimeout(() => {
    alertDiv.remove();
  }, duration);
}

// Example usage (You can remove this after testing)
document.addEventListener("DOMContentLoaded", () => {
  showAlert("Welcome to Sleep Outside!", "info");
});
