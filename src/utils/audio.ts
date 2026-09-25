// Synthesized Web Audio API sound generator for authentic mechanical shutter & time-warp audio

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('chronos_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      // fallback
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('chronos_muted', String(this.isMuted));
    } catch {
      // ignore
    }
    return this.isMuted;
  }

  // Realistic mechanical twin-lens / reflex shutter click sound
  public playShutter() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Shutter mirror snap (first mechanical click)
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(320, t);
    snapOsc.frequency.exponentialRampToValueAtTime(80, t + 0.04);
    snapGain.gain.setValueAtTime(0.4, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    snapOsc.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snapOsc.start(t);
    snapOsc.stop(t + 0.05);

    // 2. Metallic shutter curtain noise burst
    const bufferSize = this.ctx.sampleRate * 0.08;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t + 0.02);
    filter.Q.setValueAtTime(3, t + 0.02);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    whiteNoise.start(t + 0.02);
    whiteNoise.stop(t + 0.1);

    // 3. Shutter release latch (second click ~80ms later)
    const latchOsc = this.ctx.createOscillator();
    const latchGain = this.ctx.createGain();
    latchOsc.type = 'sine';
    latchOsc.frequency.setValueAtTime(540, t + 0.09);
    latchOsc.frequency.exponentialRampToValueAtTime(120, t + 0.14);
    latchGain.gain.setValueAtTime(0.25, t + 0.09);
    latchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    latchOsc.connect(latchGain);
    latchGain.connect(this.ctx.destination);
    latchOsc.start(t + 0.09);
    latchOsc.stop(t + 0.15);
  }

  // Countdown timer beep
  public playCountdown(isFinal: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 1046.5 : 587.33; // C6 or D5
    const duration = isFinal ? 0.25 : 0.08;

    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  // Time travel warp whoosh sound
  public playTimeWarp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sweeping tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.2);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.45);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }
}

export const sound = new SoundEngine();
