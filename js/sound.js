/* ================= RETRO AUDIO SYNTHESIZER (SND) ================= */
// Este archivo sintetiza efectos de sonido retro de 8 bits en tiempo real usando la Web Audio API.

const SND = {
  ctx: null,
  init() { 
    if (!this.ctx) { 
      try { 
        this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
      } catch (e) {
        console.error("No se pudo iniciar AudioContext:", e);
      } 
    } 
  },
  tone(freq, start, dur, type = 'sine', vol = .05) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type; 
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    osc.connect(gain); 
    gain.connect(this.ctx.destination);
    osc.start(t0); 
    osc.stop(t0 + dur + .02);
  },
  click() { this.init(); this.tone(720, 0, .05, 'square', .035); },
  open() { this.init(); this.tone(660, 0, .09, 'sine', .05); this.tone(880, .07, .12, 'sine', .05); },
  close() { this.init(); this.tone(520, 0, .07, 'sine', .04); this.tone(380, .05, .09, 'sine', .04); },
  error() { this.init(); this.tone(220, 0, .12, 'square', .05); this.tone(180, .13, .14, 'square', .05); },
  success() { this.init(); this.tone(660, 0, .08, 'triangle', .05); this.tone(880, .09, .08, 'triangle', .05); this.tone(1100, .18, .16, 'triangle', .06); }
};
