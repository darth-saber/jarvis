// JARVIS UI Manager
// Handles all user interface interactions and animations

class JarvisUI {
  constructor() {
    this.isSearchOpen = false;
    this.isFileManagerOpen = false;
    this.isSystemInfoOpen = false;
    this.activeAnimations = [];

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupKeyboardShortcuts();
    this.loadSettings();

    console.log("JARVIS UI Manager initialized");
  }

  setupEventListeners() {
    // Search interface
    const searchBtn = document.getElementById("searchBtn");
    const searchExecute = document.getElementById("searchExecute");
    const searchClose = document.getElementById("searchClose");
    const searchInput = document.getElementById("searchInput");

    searchBtn?.addEventListener("click", () => this.toggleSearchInterface());
    searchExecute?.addEventListener("click", () => this.executeSearch());
    searchClose?.addEventListener("click", () => this.hideSearchInterface());
    searchInput?.addEventListener(
      "keypress",
      (e) => e.key === "Enter" && this.executeSearch(),
    );

    // File Manager
    const fileBtn = document.getElementById("fileBtn");
    const fileManagerClose = document.getElementById("fileManagerClose");

    fileBtn?.addEventListener("click", () => this.showFileManager());
    fileManagerClose?.addEventListener("click", () => this.hideFileManager());

    // System Info
    const systemBtn = document.getElementById("systemBtn");
    const systemInfoClose = document.getElementById("systemInfoClose");

    systemBtn?.addEventListener("click", () => this.showSystemInfo());
    systemInfoClose?.addEventListener("click", () => this.hideSystemInfo());

    // Global click handler
    document.addEventListener("click", (e) => this.handleGlobalClick(e));
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (key === "escape") this.closeAllModals();
      if (ctrl && key === "k") {
        e.preventDefault();
        this.toggleSearchInterface();
      }
      if (ctrl && key === "f") {
        e.preventDefault();
        this.showFileManager();
      }
      if (ctrl && key === "i") {
        e.preventDefault();
        this.showSystemInfo();
      }
      if (ctrl && key === "s") {
        e.preventDefault();
        this.triggerVoiceCommand();
      }
    });
  }

  // Search Interface
  toggleSearchInterface() {
    this.isSearchOpen ? this.hideSearchInterface() : this.showSearchInterface();
  }

  showSearchInterface() {
    const searchInterface = document.getElementById("searchInterface");
    if (!searchInterface) return;

    searchInterface.style.display = "flex";
    this.isSearchOpen = true;

    // Focus input safely
    const searchInput = document.getElementById("searchInput");
    searchInput && setTimeout(() => searchInput.focus(), 100);

    this.animateElement(searchInterface, "fadeInScale");
    this.hideFileManager();
    this.hideSystemInfo();
  }

  hideSearchInterface() {
    const searchInterface = document.getElementById("searchInterface");
    if (!searchInterface) return;

    this.animateElement(searchInterface, "fadeOutScale", () => {
      searchInterface.style.display = "none";
    });
    this.isSearchOpen = false;

    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";
  }

  executeSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput || !searchInput.value.trim()) return;

    const query = searchInput.value.trim();

    // Process via Jarvis core safely
    let response = "";
    if (window.jarvisCore?.processCommand) {
      response = window.jarvisCore.processCommand(`search for ${query}`) || "";
    }

    // Open browser search
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      "_blank",
    );

    // Provide feedback via speech
    window.speechHandler?.speak(response);

    this.hideSearchInterface();
  }

  // File Manager
  showFileManager() {
    const fileManager = document.getElementById("fileManager");
    if (!fileManager) return;

    fileManager.style.display = "block";
    this.isFileManagerOpen = true;

    this.loadFileSystem();
    this.animateElement(fileManager, "slideInUp");
    this.hideSearchInterface();
    this.hideSystemInfo();
  }

  hideFileManager() {
    const fileManager = document.getElementById("fileManager");
    if (!fileManager) return;

    this.animateElement(fileManager, "slideOutDown", () => {
      fileManager.style.display = "none";
    });
    this.isFileManagerOpen = false;
  }

  loadFileSystem() {
    const fileTree = document.getElementById("fileTree");
    if (!fileTree) return;

    // Simulated file structure
    const fs = {
      Home: {
        type: "folder",
        children: {
          Documents: {
            type: "folder",
            children: { "resume.pdf": { type: "file", size: "2.1 MB" } },
          },
        },
      },
    };

    fileTree.innerHTML = this.renderFileTree(fs);
  }

  renderFileTree(files, path = "") {
    let html = "";
    for (const [name, item] of Object.entries(files)) {
      const fullPath = path ? `${path}/${name}` : name;
      if (item.type === "folder") {
        html += `<div class="file-item folder" data-path="${fullPath}">
                    <span class="file-icon">📁</span>
                    <span class="file-name">${name}</span>
                    <span class="file-type">Folder</span>
                </div>`;
        if (item.children)
          html += `<div class="folder-content" style="margin-left: 20px;">${this.renderFileTree(item.children, fullPath)}</div>`;
      } else {
        html += `<div class="file-item file" data-path="${fullPath}">
                    <span class="file-icon">📄</span>
                    <span class="file-name">${name}</span>
                    <span class="file-size">${item.size || "Unknown"}</span>
                </div>`;
      }
    }
    return html;
  }

  // System Info
  showSystemInfo() {
    const systemInfo = document.getElementById("systemInfo");
    if (!systemInfo) return;

    systemInfo.style.display = "block";
    this.isSystemInfoOpen = true;

    this.updateSystemInfo();
    this.animateElement(systemInfo, "slideInUp");
    this.hideSearchInterface();
    this.hideFileManager();
  }

  hideSystemInfo() {
    const systemInfo = document.getElementById("systemInfo");
    if (!systemInfo) return;

    this.animateElement(systemInfo, "slideOutDown", () => {
      systemInfo.style.display = "none";
    });
    this.isSystemInfoOpen = false;
  }

  updateSystemInfo() {
    document.getElementById("userInfo")?.textContent = "JARVIS User • Online";
    document.getElementById("browserInfo") &&
      (document.getElementById("browserInfo").textContent =
        `${navigator.userAgent.split(" ")[0]} • ${navigator.language}`);
    document.getElementById("screenInfo") &&
      (document.getElementById("screenInfo").textContent =
        `${screen.width} × ${screen.height} • ${window.devicePixelRatio}x`);
  }

  // Voice command
  triggerVoiceCommand() {
    document.getElementById("voiceBtn")?.click();
  }

  // Global click
  handleGlobalClick(e) {
    const searchInterface = document.getElementById("searchInterface");
    const fileManager = document.getElementById("fileManager");
    const systemInfo = document.getElementById("systemInfo");

    if (
      this.isSearchOpen &&
      searchInterface &&
      !searchInterface.contains(e.target)
    )
      this.hideSearchInterface();
    if (
      this.isFileManagerOpen &&
      fileManager &&
      !fileManager.contains(e.target)
    )
      this.hideFileManager();
    if (this.isSystemInfoOpen && systemInfo && !systemInfo.contains(e.target))
      this.hideSystemInfo();
  }

  // Animations
  initializeAnimations() {
    const style = document.createElement("style");
    style.textContent = `
            .fadeInScale { animation: fadeInScale 0.3s ease-out; }
            .fadeOutScale { animation: fadeOutScale 0.3s ease-in; }
            .slideInUp { animation: slideInUp 0.4s ease-out; }
            .slideOutDown { animation: slideOutDown 0.4s ease-in; }
            @keyframes fadeInScale { from {opacity:0;transform:scale(0.9);} to {opacity:1;transform:scale(1);} }
            @keyframes fadeOutScale { from {opacity:1;transform:scale(1);} to {opacity:0;transform:scale(0.9);} }
            @keyframes slideInUp { from {opacity:0;transform:translateY(50px);} to {opacity:1;transform:translateY(0);} }
            @keyframes slideOutDown { from {opacity:1;transform:translateY(0);} to {opacity:0;transform:translateY(50px);} }
        `;
    document.head.appendChild(style);
  }

  animateElement(element, animationClass, callback) {
    if (!element) return;
    element.classList.add(animationClass);

    const handleAnimationEnd = () => {
      element.classList.remove(animationClass);
      callback?.();
    };
    element.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  }

  closeAllModals() {
    this.hideSearchInterface();
    this.hideFileManager();
    this.hideSystemInfo();
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "15px 20px",
      background:
        type === "error" ? "rgba(255,68,68,0.9)" : "rgba(0,212,255,0.9)",
      color: "#fff",
      borderRadius: "8px",
      zIndex: "10000",
      fontSize: "14px",
      fontFamily: "Orbitron, monospace",
      maxWidth: "300px",
      wordWrap: "break-word",
      opacity: "0",
      transform: "translateX(100%)",
      transition: "all 0.3s ease",
    });
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateX(0)";
    }, 50);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  loadSettings() {
    const settings = localStorage.getItem("jarvisUISettings");
    if (!settings) return;
    try {
      this.applySettings(JSON.parse(settings));
    } catch {
      console.warn("Failed to load JARVIS UI settings");
    }
  }

  saveSettings() {
    localStorage.setItem(
      "jarvisUISettings",
      JSON.stringify({
        theme: "dark",
        animationsEnabled: true,
        soundEnabled: true,
      }),
    );
  }
  applySettings(settings) {
    if (settings.theme === "dark") document.body.classList.add("dark-theme");
    if (!settings.animationsEnabled)
      document.body.classList.add("no-animations");
  }

  isModalOpen() {
    return this.isSearchOpen || this.isFileManagerOpen || this.isSystemInfoOpen;
  }
  getOpenModal() {
    return this.isSearchOpen
      ? "search"
      : this.isFileManagerOpen
        ? "fileManager"
        : this.isSystemInfoOpen
          ? "systemInfo"
          : null;
  }
}

// Initialize UI manager
document.addEventListener("DOMContentLoaded", () => {
  window.jarvisUI = new JarvisUI();
});
