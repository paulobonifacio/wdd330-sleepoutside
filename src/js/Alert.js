// Alert.js
export default class Alert {
  constructor(alertsUrl) {
      this.alertsUrl = alertsUrl;
  }

  async fetchAlerts() {
      try {
          const response = await fetch(this.alertsUrl);
          const alerts = await response.json();
          this.renderAlerts(alerts);
      } catch (error) {
          console.error('Failed to load alerts:', error);
      }
  }

  renderAlerts(alerts) {
      if (!alerts.length) return;
      
      const alertSection = document.createElement('section');
      alertSection.className = 'alert-list';
      
      alerts.forEach(alert => {
          const alertElement = document.createElement('p');
          alertElement.className= "alert-message"
          alertElement.textContent = alert.message;
          alertElement.style.backgroundColor = alert.background;
          alertElement.style.color = alert.color;
          alertSection.appendChild(alertElement);
      });
      
      const mainElement = document.querySelector('main');
      if (mainElement) {
          mainElement.prepend(alertSection);
      }
  }
}
