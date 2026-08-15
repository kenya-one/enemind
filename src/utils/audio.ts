// Web Audio API ambient beat generator for Kenyan House Hunt TikTok audio
class KenyanBeatEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private step: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;
      this.isPlaying = true;
      this.step = 0;

      // 108 BPM Kenyan Chill Afro House beat
      const bpm = 104;
      const stepTime = (60 / bpm) / 4 * 1000;

      this.intervalId = window.setInterval(() => {
        if (!this.isPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;
        const s = this.step % 16;

        // Kick drum on 0, 4, 8, 12
        if (s % 4 === 0) {
          this.playKick(now);
        }

        // Shaker / Hi-hat on every 2 steps + syncopation
        if (s % 2 === 0 || s === 7 || s === 15) {
          this.playHiHat(now, s % 4 === 2 ? 0.08 : 0.04);
        }

        // Kalimba / Marimba Afro chord tone on steps 0, 3, 6, 10, 14
        const chordNotes = [261.63, 329.63, 392.00, 493.88, 523.25]; // C major pentatonic
        if (s === 0 || s === 3 || s === 6 || s === 10 || s === 14) {
          const note = chordNotes[(s + Math.floor(this.step / 16)) % chordNotes.length];
          this.playMelodyPluck(now, note);
        }

        // Bassline on steps 0, 6, 8, 11
        if (s === 0 || s === 6 || s === 8 || s === 11) {
          this.playBass(now, 65.41 * (s === 6 ? 1.33 : s === 11 ? 1.5 : 1));
        }

        this.step++;
      }, stepTime);
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.35);
  }

  private playHiHat(time: number, volume: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'triangle';
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  private playMelodyPluck(time: number, freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.45);
  }

  private playBass(time: number, freq: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.4);
  }
}

export const kenyanAudio = new KenyanBeatEngine();
