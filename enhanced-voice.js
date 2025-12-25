class EnhancedVoiceProcessor {
  constructor() {
    this.isProcessing = false;
    this.noiseReductionEnabled = true;
    this.voiceActivityThreshold = 0.3;
    this.confidenceThreshold = 0.7;
    this.continuousMode = false;

    this.voiceCommands = new Map();
    this.voiceHistory = [];

    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.stream = null;
    this.continuousInterval = null;

    this.init();
  }

  async setupAdvancedAudio() {
    try {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )({
        latencyHint: "interactive",
      });

      // 🔑 REQUIRED for Chrome/Safari
      document.addEventListener(
        "click",
        () => {
          if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
          }
        },
        { once: true },
      );

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: this.noiseReductionEnabled,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      this.source = this.audioContext.createMediaStreamSource(this.stream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.source.connect(this.analyser);
    } catch (err) {
      console.warn("Audio init failed:", err);
    }
  }

  applyNoiseReduction(data) {
    if (!this.noiseReductionEnabled) return data;

    const cleaned = new Float32Array(data.length);
    for (let i = 1; i < data.length; i++) {
      let value = data[i] - data[i - 1] * 0.95;
      cleaned[i] = Math.max(-1, Math.min(1, value));
    }
    return cleaned;
  }

  detectVoiceActivity(data) {
    let sum = 0;
    for (const v of data) sum += v * v;
    return Math.min(1, Math.sqrt(sum / data.length) / 0.1);
  }

  calculateVoiceConfidence() {
    if (!this.analyser) return 0;

    const freq = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(freq);

    const energy = freq.reduce((a, b) => a + b, 0) / freq.length;
    const centroid = freq.findIndex((v) => v > 30);

    let confidence = 0;
    if (energy > 20) confidence += 0.4;
    if (centroid > 10) confidence += 0.3;
    if (energy > 40) confidence += 0.3;

    return Math.min(1, confidence);
  }

  updateVoiceActivityIndicator(activity) {
    const fill = document.querySelector(
      "#voiceActivityIndicator .voice-activity-fill",
    );
    if (fill) fill.style.width = `${activity * 100}%`;
  }

  updateConfidenceIndicator(confidence) {
    const value = document.getElementById("confidenceValue");
    if (!value) return;

    value.textContent = `${Math.round(confidence * 100)}%`;
    value.style.color =
      confidence > 0.8 ? "#00ff00" : confidence > 0.6 ? "#ffaa00" : "#ff4444";
  }

  startContinuousProcessing() {
    if (this.continuousInterval) return;

    this.continuousInterval = setInterval(() => {
      if (!this.isProcessing) return;

      const confidence = this.calculateVoiceConfidence();
      this.updateConfidenceIndicator(confidence);
    }, 100);
  }

  stopProcessing() {
    this.isProcessing = false;
    if (this.continuousInterval) {
      clearInterval(this.continuousInterval);
      this.continuousInterval = null;
    }
  }

  destroy() {
    this.stopProcessing();

    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
