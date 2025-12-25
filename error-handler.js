class JarvisErrorHandler {
  constructor() {
    this.errorLog = [];
    this.feedbackQueue = [];
    this.retryAttempts = new Map();
    this.userPreferences = this.loadUserPreferences();
    this.connectionStatus = navigator.onLine;

    // Bind handlers to preserve `this`
    this.handleJavaScriptError = this.handleJavaScriptError.bind(this);
    this.handlePromiseRejection = this.handlePromiseRejection.bind(this);

    this.init();
  }

  init() {
    console.log("JARVIS Error Handler initializing...");
    this.setupConnectionMonitoring();
    this.setupErrorHandlers();
    this.loadErrorHistory();
    console.log("JARVIS Error Handler ready");
  }

  setupConnectionMonitoring() {
    window.addEventListener("online", () => this.handleConnectionChange(true));
    window.addEventListener("offline", () =>
      this.handleConnectionChange(false),
    );
  }

  setupErrorHandlers() {
    window.addEventListener("error", this.handleJavaScriptError);
    window.addEventListener("unhandledrejection", this.handlePromiseRejection);
  }

  handleJavaScriptError(error) {
    const errorInfo = {
      type: "javascript",
      message: error?.message || String(error),
      stack: error?.stack || "",
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: this.assessErrorSeverity(error),
    };
    console.error("JARVIS JavaScript Error:", errorInfo);
    this.logError(errorInfo);
    this.provideErrorFeedback(errorInfo);
    this.attemptRecovery(errorInfo);
  }

  handlePromiseRejection(reason) {
    const errorInfo = {
      type: "promise",
      message: reason?.message || String(reason),
      stack: reason?.stack || "",
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      severity: "medium",
    };
    console.error("JARVIS Promise Rejection:", errorInfo);
    this.logError(errorInfo);
    this.provideErrorFeedback(errorInfo);
  }

  handleConnectionChange(isOnline) {
    this.connectionStatus = isOnline;
    const feedback = isOnline
      ? {
          message: "Connection restored! All features are now available.",
          type: "success",
          autoHide: true,
        }
      : {
          message: "You are currently offline. Some features may be limited.",
          type: "warning",
          persistent: true,
        };
    this.logError({
      type: "connection",
      message: feedback.message,
      timestamp: new Date().toISOString(),
      severity: "low",
    });
    this.displayFeedback(feedback);

    if (!isOnline) this.activateOfflineMode();
    else this.deactivateOfflineMode();
  }

  displayFeedback(feedback) {
    if (!this.userPreferences.showNotifications) return;
    const notification = this.createNotificationElement(feedback);
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add("show"));
    this.feedbackQueue.push(notification);

    if (feedback.autoHide && !feedback.persistent) {
      setTimeout(() => this.hideNotification(notification), 5000);
    }
  }

  createNotificationElement(feedback) {
    const notification = document.createElement("div");
    notification.className = `jarvis-notification notification-${feedback.type}`;
    notification.setAttribute("data-type", feedback.type);
    notification.setAttribute("data-timestamp", feedback.timestamp);
    if (feedback.persistent)
      notification.setAttribute("data-persistent", "true");

    const iconMap = { error: "⚠️", warning: "⚠️", success: "✅", info: "ℹ️" };
    notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${iconMap[feedback.type] || "ℹ️"}</div>
                <div class="notification-message">${feedback.message}</div>
                ${feedback.actions ? this.createActionButtons(feedback.actions) : ""}
            </div>
            <button class="notification-close">×</button>
        `;

    // Action buttons
    if (feedback.actions) {
      feedback.actions.forEach((action) => {
        const button = notification.querySelector(
          `[data-action="${action.action}"]`,
        );
        if (button)
          button.addEventListener("click", () =>
            this.handleAction(action.action, action.permission, notification),
          );
      });
    }

    // Close button
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () =>
      this.hideNotification(notification),
    );

    return notification;
  }

  createActionButtons(actions) {
    return `<div class="notification-actions">${actions
      .map(
        (a) =>
          `<button class="notification-action" data-action="${a.action}">${a.label}</button>`,
      )
      .join("")}</div>`;
  }

  hideNotification(notification) {
    notification.classList.remove("show");
    notification.classList.add("hide");
    setTimeout(() => {
      if (notification.parentNode)
        notification.parentNode.removeChild(notification);
      const index = this.feedbackQueue.indexOf(notification);
      if (index > -1) this.feedbackQueue.splice(index, 1);
    }, 300);
  }

  handleAction(action, permission, notification) {
    switch (action) {
      case "retry-voice":
        this.retryVoiceRecognition();
        break;
      case "open-permissions":
        this.openPermissionSettings();
        break;
      case "request-permission":
        this.requestPermission(permission);
        break;
      case "show-permission-help":
        this.showPermissionHelp(permission);
        break;
      case "check-connection":
        this.checkConnection();
        break;
      case "refresh-page":
        this.refreshPage();
        break;
      case "report-error":
        this.reportError();
        break;
      default:
        console.log("Unknown action:", action);
    }
    if (notification) this.hideNotification(notification);
  }

  destroy() {
    window.removeEventListener("error", this.handleJavaScriptError);
    window.removeEventListener(
      "unhandledrejection",
      this.handlePromiseRejection,
    );
    this.feedbackQueue.forEach((n) => this.hideNotification(n));
  }

  // ... Keep rest of your original methods (logError, loadErrorHistory, permissions, recovery) unchanged
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  window.errorHandler = new JarvisErrorHandler();
  window.errorHandler.integrateWithSpeechHandler?.();
});
