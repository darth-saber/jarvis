// JARVIS Advanced Animation Engine
// Enhanced particle system, smooth transitions, and micro-interactions

class JarvisAnimationEngine {
    constructor() {
        this.isActive = true;
        this.animations = new Map();
        this.particleSystem = null;
        this.transitionQueue = [];
        this.microInteractions = new Map();
        this.performanceMode = 'high'; // high, medium, low
        
        this.init();
    }

    init() {
        console.log('JARVIS Animation Engine initializing...');
        
        this.initializeParticleSystem();
        this.setupMicroInteractions();
        this.initializeTransitions();
        this.setupPerformanceOptimization();
        
        console.log('JARVIS Animation Engine ready');
    }

    // Enhanced Particle System with Physics
    initializeParticleSystem() {
        this.particleSystem = new AdvancedParticleSystem();
        
        // Different particle effects for different events
        this.particleEffects = {
            wakeWord: () => this.particleSystem.createBurstEffect('wake-word'),
            command: () => this.particleSystem.createStreamEffect('command'),
            listening: () => this.particleSystem.createPulsingEffect('listening'),
            success: () => this.particleSystem.createSparkleEffect('success'),
            error: () => this.particleSystem.createShockwaveEffect('error'),
            systemLoad: () => this.particleSystem.createFlowEffect('system')
        };
    }

    setupMicroInteractions() {
        // Define micro-interactions for different UI elements
        this.microInteractions.set('button-hover', {
            trigger: 'mouseenter',
            animation: 'scalePulse',
            duration: 200,
            easing: 'ease-out'
        });

        this.microInteractions.set('button-click', {
            trigger: 'click',
            animation: 'rippleEffect',
            duration: 300,
            easing: 'ease-out'
        });

        this.microInteractions.set('modal-open', {
            trigger: 'open',
            animation: 'modalSlideIn',
            duration: 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        this.microInteractions.set('voice-indicator', {
            trigger: 'voice-activity',
            animation: 'voiceWaveform',
            duration: 100,
            easing: 'linear'
        });

        this.microInteractions.set('status-change', {
            trigger: 'status-update',
            animation: 'statusGlow',
            duration: 800,
            easing: 'ease-in-out'
        });
    }

    initializeTransitions() {
        // Smooth page transitions
        this.pageTransitions = {
            fade: (element, direction = 'in') => {
                return this.createTransition(element, {
                    property: 'opacity',
                    from: direction === 'in' ? 0 : 1,
                    to: direction === 'in' ? 1 : 0,
                    duration: 300
                });
            },
            
            slide: (element, direction = 'up') => {
                const transforms = {
                    up: { from: 'translateY(20px)', to: 'translateY(0px)' },
                    down: { from: 'translateY(-20px)', to: 'translateY(0px)' },
                    left: { from: 'translateX(20px)', to: 'translateX(0px)' },
                    right: { from: 'translateX(-20px)', to: 'translateX(0px)' }
                };
                
                const transform = transforms[direction] || transforms.up;
                
                return this.createTransition(element, {
                    property: 'transform',
                    from: transform.from,
                    to: transform.to,
                    duration: 400
                });
            },
            
            scale: (element, scale = 1.1) => {
                return this.createTransition(element, {
                    property: 'transform',
                    from: 'scale(1)',
                    to: `scale(${scale})`,
                    duration: 200
                });
            }
        };
    }

    setupPerformanceOptimization() {
        // Adaptive performance based on device capabilities
        this.detectPerformanceCapabilities();
        
        // Reduce animations on low-end devices
        if (this.performanceMode === 'low') {
            this.disableHeavyAnimations();
        }
    }

    detectPerformanceCapabilities() {
        // Simple performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            this.performanceMode = 'low';
            return;
        }

        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        
        // Basic GPU detection
        if (renderer && renderer.toLowerCase().includes('intel')) {
            this.performanceMode = 'medium';
        } else if (renderer && (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('amd'))) {
            this.performanceMode = 'high';
        } else {
            this.performanceMode = 'medium';
        }

        console.log(`JARVIS Animation Engine: ${this.performanceMode} performance mode`);
    }

    disableHeavyAnimations() {
        // Disable computationally expensive animations
        this.particleSystem.setPerformanceMode('low');
    }

    // Public API for triggering animations
    triggerAnimation(type, data = {}) {
        if (!this.isActive) return;

        switch (type) {
            case 'wake-word':
                this.particleEffects.wakeWord();
                this.animateCore('wake-word');
                break;
                
            case 'command':
                this.particleEffects.command();
                this.animateInterface('command');
                break;
                
            case 'listening':
                this.particleEffects.listening();
                this.animateVoiceIndicator(true);
                break;
                
            case 'stop-listening':
                this.animateVoiceIndicator(false);
                break;
                
            case 'success':
                this.particleEffects.success();
                this.animateSuccess();
                break;
                
            case 'error':
                this.particleEffects.error();
                this.animateError();
                break;
                
            case 'system-update':
                this.particleEffects.systemLoad();
                this.animateSystemMetrics();
                break;
        }
    }

    animateCore(eventType) {
        const core = document.querySelector('.center-core');
        if (!core) return;

        const animations = {
            'wake-word': () => {
                core.style.animation = 'none';
                core.offsetHeight; // Trigger reflow
                core.style.animation = 'coreWakeWord 1s ease-out';
            },
            
            'command': () => {
                core.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    core.style.transform = 'scale(1)';
                }, 200);
            },
            
            'listening': () => {
                core.style.boxShadow = '0 0 50px rgba(0, 212, 255, 0.8)';
            }
        };

        if (animations[eventType]) {
            animations[eventType]();
        }
    }

    animateInterface(eventType) {
        // Animate interface elements based on events
        const elements = {
            'command': ['.command-text', '.response-text'],
            'system-update': ['.system-metrics .metric'],
            'modal-open': ['.search-interface', '.file-manager', '.system-info']
        };

        if (elements[eventType]) {
            elements[eventType].forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    this.applyMicroInteraction(element, 'button-hover');
                }
            });
        }
    }

    animateVoiceIndicator(isActive) {
        const indicator = document.getElementById('speechIndicator');
        if (!indicator) return;

        if (isActive) {
            indicator.classList.add('listening');
            indicator.style.display = 'flex';
        } else {
            indicator.classList.remove('listening');
        }
    }

    animateSuccess() {
        // Success animation for entire interface
        const container = document.querySelector('.jarvis-container');
        if (container) {
            container.style.animation = 'successPulse 1s ease-out';
            setTimeout(() => {
                container.style.animation = '';
            }, 1000);
        }
    }

    animateError() {
        // Error animation for entire interface
        const container = document.querySelector('.jarvis-container');
        if (container) {
            container.style.animation = 'errorShake 0.5s ease-out';
            setTimeout(() => {
                container.style.animation = '';
            }, 500);
        }
    }

    animateSystemMetrics() {
        // Animate metric updates
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            metric.style.transform = 'scale(1.1)';
            setTimeout(() => {
                metric.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // Micro-interaction system
    applyMicroInteraction(element, interactionType) {
        const interaction = this.microInteractions.get(interactionType);
        if (!interaction || !element) return;

        switch (interaction.animation) {
            case 'scalePulse':
                this.scalePulse(element, interaction.duration);
                break;
                
            case 'rippleEffect':
                this.rippleEffect(element, interaction.duration);
                break;
                
            case 'modalSlideIn':
                this.modalSlideIn(element, interaction.duration);
                break;
                
            case 'voiceWaveform':
                this.voiceWaveform(element, interaction.duration);
                break;
                
            case 'statusGlow':
                this.statusGlow(element, interaction.duration);
                break;
        }
    }

    scalePulse(element, duration) {
        element.style.transition = `transform ${duration}ms ${this.getEasing('ease-out')}`;
        element.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
    }

    rippleEffect(element, duration) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
        `;

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = rect.width / 2 - size / 2 + 'px';
        ripple.style.top = rect.height / 2 - size / 2 + 'px';

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    modalSlideIn(element, duration) {
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.transform = 'translate(-50%, -50%) scale(0.9)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transform = 'translate(-50%, -50%) scale(1)';
            element.style.opacity = '1';
        }, 50);
    }

    voiceWaveform(element, duration) {
        element.style.animation = `voiceWaveform ${duration}ms linear`;
    }

    statusGlow(element, duration) {
        element.style.transition = `box-shadow ${duration}ms ease-in-out`;
        element.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6)';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, duration);
    }

    // Transition system
    createTransition(element, options) {
        return new Promise(resolve => {
            const { property, from, to, duration = 300 } = options;
            
            element.style.transition = `${property} ${duration}ms ease-out`;
            element.style[property] = to;
            
            const handleTransitionEnd = () => {
                element.removeEventListener('transitionend', handleTransitionEnd);
                resolve();
            };
            
            element.addEventListener('transitionend', handleTransitionEnd);
        });
    }

    // Page transition methods
    transitionToPage(pageElement, transitionType = 'fade') {
        if (this.transitionQueue.length > 0) {
            this.transitionQueue.push({ pageElement, transitionType });
            return;
        }

        this.executePageTransition(pageElement, transitionType);
    }

    async executePageTransition(pageElement, transitionType) {
        const transition = this.pageTransitions[transitionType];
        if (!transition) return;

        // Fade out current content
        const currentContent = document.querySelector('.main-interface');
        if (currentContent) {
            await transition(currentContent, 'out');
        }

        // Replace content
        if (pageElement) {
            pageElement.style.opacity = '0';
            document.querySelector('.main-interface').innerHTML = '';
            document.querySelector('.main-interface').appendChild(pageElement);
        }

        // Fade in new content
        if (pageElement) {
            await transition(pageElement, 'in');
        }

        // Process queue
        if (this.transitionQueue.length > 0) {
            const next = this.transitionQueue.shift();
            this.executePageTransition(next.pageElement, next.transitionType);
        }
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        this.performanceInterval = setInterval(() => {
            this.checkAnimationPerformance();
        }, 5000);
    }

    checkAnimationPerformance() {
        const fps = this.calculateFPS();
        
        if (fps < 30 && this.performanceMode === 'high') {
            console.log('JARVIS: Reducing animation quality due to performance');
            this.performanceMode = 'medium';
            this.disableHeavyAnimations();
        } else if (fps < 20 && this.performanceMode === 'medium') {
            console.log('JARVIS: Further reducing animation quality');
            this.performanceMode = 'low';
            this.disableHeavyAnimations();
        }
    }

    calculateFPS() {
        // Simple FPS calculation
        const frameCount = performance.now() - this.lastFrameTime;
        this.lastFrameTime = performance.now();
        return Math.round(1000 / frameCount);
    }

    // Easing functions
    getEasing(type) {
        const easings = {
            'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
            'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
            'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
            'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        };
        
        return easings[type] || easings['ease-out'];
    }

    // Utility methods
    pauseAllAnimations() {
        this.isActive = false;
        document.body.style.animationPlayState = 'paused';
    }

    resumeAllAnimations() {
        this.isActive = true;
        document.body.style.animationPlayState = 'running';
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
        if (mode === 'low') {
            this.disableHeavyAnimations();
        }
    }

    // Cleanup
    destroy() {
        this.pauseAllAnimations();
        
        if (this.performanceInterval) {
            clearInterval(this.performanceInterval);
        }
        
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
        
        this.animations.clear();
        this.microInteractions.clear();
        this.transitionQueue = [];
    }
}

// Advanced Particle System Class
class AdvancedParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.isActive = false;
        this.performanceMode = 'high';
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.startRendering();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.8;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startRendering() {
        const render = () => {
            if (this.performanceMode !== 'low') {
                this.clearCanvas();
                this.updateParticles();
                this.renderParticles();
            }
            
            if (this.isActive || this.particles.length > 0) {
                requestAnimationFrame(render);
            }
        };
        
        this.isActive = true;
        render();
    }

    clearCanvas() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.life > 0;
        });
    }

    renderParticles() {
        this.particles.forEach(particle => {
            particle.render(this.ctx);
        });
    }

    // Particle effect methods
    createBurstEffect(type) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const particleCount = this.performanceMode === 'high' ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 5 + 2;
            
            this.particles.push(new Particle(
                centerX, centerY,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                type
            ));
        }
    }

    createStreamEffect(type) {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight + 10;
            const velocityY = -(Math.random() * 3 + 1);
            
            this.particles.push(new Particle(
                x, y, 0, velocityY, type
            ));
        }
    }

    createPulsingEffect(type) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            this.particles.push(new Particle(
                x, y, 0, 0, type
            ));
        }
    }

    createSparkleEffect(type) {
        const count = this.performanceMode === 'high' ? 40 : 20;
        
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const velocity = Math.random() * 2 - 1;
            
            this.particles.push(new Particle(
                x, y, velocity, velocity, type
            ));
        }
    }

    createShockwaveEffect(type) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 60; i++) {
            const angle = (Math.PI * 2 * i) / 60;
            const velocity = Math.random() * 8 + 5;
            
            this.particles.push(new Particle(
                centerX, centerY,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                type
            ));
        }
    }

    createFlowEffect(type) {
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const velocityX = (Math.random() - 0.5) * 2;
            const velocityY = (Math.random() - 0.5) * 2;
            
            this.particles.push(new Particle(
                x, y, velocityX, velocityY, type
            ));
        }
    }

    setPerformanceMode(mode) {
        this.performanceMode = mode;
    }

    destroy() {
        this.isActive = false;
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }
}

// Particle class
class Particle {
    constructor(x, y, velocityX, velocityY, type) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.type = type;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 1;
        
        this.setColor();
    }

    setColor() {
        const colors = {
            'wake-word': '#00d4ff',
            'command': '#00ff88',
            'listening': '#ffaa00',
            'success': '#00ff00',
            'error': '#ff4444',
            'system': '#8844ff'
        };
        
        this.color = colors[this.type] || '#00d4ff';
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.life -= this.decay;
        
        // Add some physics
        this.velocityY += 0.1; // gravity
        this.velocityX *= 0.99; // air resistance
        
        // Boundary checks
        if (this.x < 0 || this.x > window.innerWidth) {
            this.velocityX *= -0.5;
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.velocityY *= -0.5;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes coreWakeWord {
        0% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }
        50% {
            transform: scale(1.3);
            box-shadow: 0 0 60px rgba(0, 212, 255, 1);
        }
        100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }
    }
    
    @keyframes successPulse {
        0%, 100% {
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
        }
        50% {
            box-shadow: 0 0 60px rgba(0, 255, 0, 0.8);
        }
    }
    
    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes voiceWaveform {
        0% { transform: scaleY(1); }
        50% { transform: scaleY(1.5); }
        100% { transform: scaleY(1); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animation engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationEngine = new JarvisAnimationEngine();
    
    // Start performance monitoring
    window.animationEngine.startPerformanceMonitoring();
});
