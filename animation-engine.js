// ===== FIXES APPLIED VERSION =====

class JarvisAnimationEngine {
  constructor() {
    this.isActive = true;
    this.animations = new Map();
    this.particleSystem = null;
    this.transitionQueue = [];
    this.microInteractions = new Map();
    this.performanceMode = "high";

    // ✅ FIX: Initialize FPS timer
    this.lastFrameTime = performance.now();

    this.init();
  }

  disableHeavyAnimations() {
    // ✅ FIX: Null safety
    if (this.particleSystem) {
      this.particleSystem.setPerformanceMode("low");
    }
  }

  createTransition(element, options) {
    return new Promise((resolve) => {
      const { property, from, to, duration = 300 } = options;

      // ✅ FIX: Apply FROM value first
      element.style.transition = "none";
      element.style[property] = from;

      element.offsetHeight; // force reflow

      element.style.transition = `${property} ${duration}ms ease-out`;
      element.style[property] = to;

      const handleTransitionEnd = () => {
        element.removeEventListener("transitionend", handleTransitionEnd);
        resolve();
      };

      element.addEventListener("transitionend", handleTransitionEnd);
    });
  }

  async executePageTransition(pageElement, transitionType) {
    const transition = this.pageTransitions[transitionType];
    if (!transition) return;

    const container = document.querySelector(".main-interface");
    if (!container) return;

    await transition(container, "out");

    // ✅ FIX: Do NOT destroy container
    container.replaceChildren(pageElement);

    await transition(pageElement, "in");
  }

  calculateFPS() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (delta <= 0) return 60;
    return Math.round(1000 / delta);
  }
}

// ===== PARTICLE SYSTEM FIX =====

class AdvancedParticleSystem {
  startRendering() {
    const render = () => {
      // ✅ FIX: Always keep loop alive
      if (this.performanceMode !== "low") {
        this.clearCanvas();
        this.updateParticles();
        this.renderParticles();
      }

      requestAnimationFrame(render);
    };

    this.isActive = true;
    render();
  }
}

// ===== RIPPLE EFFECT FIX =====

rippleEffect(element, duration);
const ripple = document.createElement("div");
ripple.className = "ripple-effect";

const rect = element.getBoundingClientRect();
const size = Math.max(rect.width, rect.height);

ripple.style.width = ripple.style.height = size + "px";

ripple.style.left = "50%";
ripple.style.top = "50%";
ripple.style.transform = "translate(-50%, -50%) scale(0)";

element.style.position = "relative";
element.appendChild(ripple);

ripple.style.animation = "ripple 600ms linear";

setTimeout(() => ripple.remove(), 600);
