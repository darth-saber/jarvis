// JARVIS System Monitor
// Real-time system monitoring and performance tracking

class SystemMonitor {
    constructor() {
        this.isMonitoring = false;
        this.updateInterval = null;
        this.metrics = {
            cpu: 0,
            memory: 0,
            network: 'online',
            battery: 100,
            batteryStatus: 'Full',
            storage: 0,
            uptime: 0,
            loadTime: 0,
            domContentLoaded: 0,
            usedJSHeapSize: 0,
            totalJSHeapSize: 0,
            jsHeapSizeLimit: 0
        };
        this.history = {
            cpu: [],
            memory: [],
            battery: []
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSystemInfo();
        this.startMonitoring();
        console.log('JARVIS System Monitor initialized');
    }

    setupEventListeners() {
        // Network status monitoring
        window.addEventListener('online', () => this.handleNetworkChange('online'));
        window.addEventListener('offline', () => this.handleNetworkChange('offline'));

        // Battery API support
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => this.setupBatteryMonitoring(battery));
        }

        // Storage estimation
        if (navigator.storage && navigator.storage.estimate) {
            this.updateStorageInfo();
        }

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.pauseMonitoring() : this.resumeMonitoring();
        });
    }

    handleNetworkChange(status) {
        this.metrics.network = status;
        this.updateNetworkStatus();
        this.logEvent(`Network: ${status.charAt(0).toUpperCase() + status.slice(1)}`);
    }

    loadSystemInfo() {
        const systemInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            online: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0
        };

        this.updateDetailedSystemInfo(systemInfo);
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        this.updateInterval = setInterval(() => this.updateMetrics(), 2000);
        this.updateMetrics();
    }

    stopMonitoring() {
        this.isMonitoring = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    pauseMonitoring() {
        if (this.updateInterval) clearInterval(this.updateInterval);
    }

    resumeMonitoring() {
        if (this.isMonitoring) this.startMonitoring();
    }

    updateMetrics() {
        this.updateCPUMetrics();
        this.updateMemoryMetrics();
        this.updateNetworkStatus();
        this.updateUptime();
        this.updatePerformanceMetrics();
    }

    // CPU
    updateCPUMetrics() {
        const cpuUsage = this.simulateCPULoad();
        this.metrics.cpu = cpuUsage;
        this.history.cpu.push(cpuUsage);
        if (this.history.cpu.length > 50) this.history.cpu.shift();
        this.updateCPUDisplay();
    }

    simulateCPULoad() {
        const baseLoad = 15;
        const timeVariation = Math.sin(Date.now() / 10000) * 10;
        const randomVariation = Math.random() * 20;
        return Math.max(0, Math.min(100, baseLoad + timeVariation + randomVariation));
    }

    updateCPUDisplay() {
        const elem = document.getElementById('cpuUsage');
        if (elem) {
            elem.textContent = `${Math.round(this.metrics.cpu)}%`;
            elem.style.color = this.metrics.cpu > 80 ? '#ff4444' : this.metrics.cpu > 60 ? '#ffaa00' : '#00ff00';
        }
    }

    // Memory
    updateMemoryMetrics() {
        const memoryUsage = this.simulateMemoryUsage();
        this.metrics.memory = memoryUsage;
        this.history.memory.push(memoryUsage);
        if (this.history.memory.length > 50) this.history.memory.shift();
        this.updateMemoryDisplay();
    }

    simulateMemoryUsage() {
        const base = 40;
        const activity = Math.cos(Date.now() / 15000) * 15;
        const random = Math.random() * 25;
        return Math.max(20, Math.min(90, base + activity + random));
    }

    updateMemoryDisplay() {
        const elem = document.getElementById('memoryUsage');
        if (elem) {
            elem.textContent = `${Math.round(this.metrics.memory)}%`;
            elem.style.color = this.metrics.memory > 85 ? '#ff4444' : this.metrics.memory > 70 ? '#ffaa00' : '#00ff00';
        }
    }

    // Network
    updateNetworkStatus() {
        const elem = document.getElementById('networkStatus');
        if (elem) {
            const status = this.metrics.network === 'online' ? 'Online' : 'Offline';
            elem.textContent = status;
            elem.style.color = this.metrics.network === 'online' ? '#00ff00' : '#ff4444';
        }
    }

    // Battery
    setupBatteryMonitoring(battery) {
        const updateBattery = () => {
            this.metrics.battery = Math.round(battery.level * 100);
            this.metrics.batteryStatus = battery.charging ? 'Charging' : 'Discharging';
            this.updateBatteryDisplay();
        };
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
        updateBattery();
    }

    updateBatteryDisplay() {
        const elem = document.querySelector('.metric[data-type="battery"] .metric-value');
        if (elem) {
            elem.textContent = `${this.metrics.battery}%`;
            elem.style.color = this.metrics.battery < 20 ? '#ff4444' : this.metrics.battery < 50 ? '#ffaa00' : '#00ff00';
        }
    }

    // Storage
    async updateStorageInfo() {
        try {
            const estimate = await navigator.storage.estimate();
            const used = Math.round((estimate.usage / estimate.quota) * 100);
            this.metrics.storage = used;
            const elem = document.querySelector('.metric[data-type="storage"] .metric-value');
            if (elem) elem.textContent = `${used}%`;
        } catch (error) {
            console.warn('Storage estimation unavailable', error);
        }
    }

    // Uptime
    updateUptime() {
        this.metrics.uptime = Math.floor((Date.now() - (performance.timeOrigin || Date.now())) / 1000);
    }

    // Performance API
    updatePerformanceMetrics() {
        if (performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                this.metrics.loadTime = nav.loadEventEnd - nav.loadEventStart;
                this.metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
            }
            if (performance.memory) {
                this.metrics.usedJSHeapSize = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
                this.metrics.totalJSHeapSize = Math.round(performance.memory.totalJSHeapSize / 1048576); // MB
                this.metrics.jsHeapSizeLimit = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
            }
        }
    }

    // System Info UI
    updateDetailedSystemInfo(info) {
        const mapping = {
            userInfo: info.platform,
            browserInfo: `${info.userAgent.split(' ')[0]} • ${info.language}`,
            screenInfo: `${info.screenResolution} • ${info.pixelRatio}x`
        };
        for (const [id, value] of Object.entries(mapping)) {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = value;
        }
    }

    // System Diagnostics
    runSystemDiagnostics() {
        return {
            timestamp: new Date().toISOString(),
            platform: navigator.platform,
            browser: navigator.userAgent,
            online: navigator.onLine,
            screen: `${screen.width}x${screen.height}`,
            metrics: { ...this.metrics },
            performance: this.getPerformanceMetrics()
        };
    }

    getPerformanceMetrics() {
        const metrics = {};
        if (performance) {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) {
                metrics.pageLoad = nav.loadEventEnd - nav.loadEventStart;
                metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
            }
            if (performance.memory) {
                metrics.usedJSHeapSize = performance.memory.usedJSHeapSize;
                metrics.totalJSHeapSize = performance.memory.totalJSHeapSize;
                metrics.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
            }
        }
        return metrics;
    }

    // Health assessment & recommendations
    assessSystemHealth() {
        const health = { overall: 'Good', issues: [], score: 100 };
        if (this.metrics.cpu > 80) { health.issues.push('High CPU usage'); health.score -= 20; }
        if (this.metrics.memory > 85) { health.issues.push('High memory usage'); health.score -= 20; }
        if (!navigator.onLine) { health.issues.push('No network'); health.score -= 30; }
        if (this.metrics.battery < 15) { health.issues.push('Low battery'); health.score -= 10; }

        health.overall = health.score >= 80 ? 'Excellent' : health.score >= 60 ? 'Good' : health.score >= 40 ? 'Fair' : 'Poor';
        return health;
    }

    getRecommendations() {
        const recs = [];
        if (this.metrics.cpu > 70) recs.push('Close unnecessary apps to reduce CPU');
        if (this.metrics.memory > 75) recs.push('Close unused browser tabs to free memory');
        if (!navigator.onLine) recs.push('Check your internet connection');
        if (this.metrics.battery < 20) recs.push('Connect to power source');
        if (recs.length === 0) recs.push('System performance is optimal');
        return recs;
    }

    // Event logging
    logEvent(event, details = '') {
        const logEntry = { timestamp: new Date(), event, details, metrics: { ...this.metrics } };
        const log = JSON.parse(localStorage.getItem('jarvisEventLog') || '[]');
        log.push(logEntry);
        if (log.length > 100) log.splice(0, log.length - 100);
        localStorage.setItem('jarvisEventLog', JSON.stringify(log));
    }

    getEventLog() { return JSON.parse(localStorage.getItem('jarvisEventLog') || '[]'); }
    clearEventLog() { localStorage.removeItem('jarvisEventLog'); }

    getCurrentMetrics() { return { ...this.metrics }; }
    getMetricsHistory() { return { ...this.history }; }

    exportSystemData() {
        return {
            metrics: this.getCurrentMetrics(),
            history: this.getMetricsHistory(),
            diagnostics: this.runSystemDiagnostics(),
            report: this.generateSystemReport(),
            eventLog: this.getEventLog(),
            exportedAt: new Date().toISOString()
        };
    }

    generateSystemReport() {
        return {
            systemHealth: this.assessSystemHealth(),
            performance: this.getPerformanceMetrics(),
            recommendations: this.getRecommendations(),
            uptime: this.metrics.uptime,
            lastUpdated: new Date().toISOString()
        };
    }

    startDeepMonitoring() {
        this.stopMonitoring();
        this.isMonitoring = true;
        this.updateInterval = setInterval(() => {
            this.updateMetrics();
            this.logPerformanceSpikes();
        }, 500);
    }

    logPerformanceSpikes() {
        if (this.metrics.cpu > 85) {
            this.logEvent('High CPU Spike', `CPU at ${this.metrics.cpu}%`);
        }
        if (this.metrics.memory > 90) {
            this.logEvent('High Memory Spike', `Memory at ${this.metrics.memory}%`);
        }
    }
}

// Initialize the System Monitor
const jarvisSystemMonitor = new SystemMonitor();  
