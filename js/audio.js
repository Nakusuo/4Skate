/* ================= AUDIO HUB (audio.js) =================
   Fuente unica de verdad para TODO el audio de archivos (.mp3 de fondo y
   canciones de las ventanas). SND (sound.js) es aparte: solo bips sintetizados.

   Reglas que impone este modulo:
   1. Un unico objeto Audio por archivo, reutilizado entre aperturas de ventana.
   2. Solo suena una pista a la vez: reproducir una pausa automaticamente las demas.
   3. La UI nunca guarda estado propio: se suscribe y se pinta desde el audio real.
   4. Volumen compartido por todas las pistas.
   5. Si el navegador bloquea el autoplay, se reintenta en cada gesto del usuario
      hasta que la reproduccion arranque de verdad.
========================================================================= */

const AudioHub = {
  volume: 0.7,

  /** @type {Map<string, {src:string, audio:HTMLAudioElement, subs:Set<Function>}>} */
  _tracks: new Map(),
  /** src de la pista que el usuario quiere escuchar (aunque el navegador la bloquee) */
  _wanted: null,
  /** src que el sistema pauso solo para dejar sonar otra: se reanuda al terminar esa */
  _interrupted: null,
  _unlockBound: false,

  /* ---------- registro de pistas ---------- */

  _track(src, { loop = false } = {}) {
    let track = this._tracks.get(src);
    if (track) return track;

    const audio = new Audio(src);
    audio.preload = 'metadata';
    audio.loop = loop;
    audio.volume = this.volume;

    track = { src, audio, subs: new Set(), started: false };
    this._tracks.set(src, track);

    // El estado real del elemento <audio> es el que manda: cada evento repinta.
    ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'error']
      .forEach(type => audio.addEventListener(type, () => {
        if (type === 'play') track.started = true;
        if (type === 'ended' && this._wanted === src) this._wanted = null;
        this._emit(track);
        // Al acabar una cancion vuelve sola la que estaba sonando antes.
        if (type === 'ended') this.resumeInterrupted(src);
      }));

    return track;
  },

  /* ---------- lectura de estado ---------- */

  state(src) {
    const track = this._tracks.get(src);
    if (!track) return { playing: false, started: false, time: 0, duration: 0, progress: 0, ended: false };
    const { audio } = track;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    return {
      playing: !audio.paused && !audio.ended,
      started: track.started,
      time: audio.currentTime,
      duration,
      progress: duration ? audio.currentTime / duration : 0,
      ended: audio.ended
    };
  },

  isPlaying(src) { return this.state(src).playing; },

  /* ---------- suscripcion de la UI ---------- */

  /** Devuelve una funcion para darse de baja (usar al cerrar la ventana). */
  subscribe(src, fn, opts) {
    const track = this._track(src, opts);
    track.subs.add(fn);
    fn(this.state(src));
    return () => track.subs.delete(fn);
  },

  _emit(track) {
    const state = this.state(track.src);
    track.subs.forEach(fn => fn(state));
  },

  /* ---------- control ---------- */

  /** Reproduce src y pausa cualquier otra pista. Devuelve una promesa booleana. */
  play(src, opts) {
    const track = this._track(src, opts);

    // Lo que sonaba justo antes queda anotado para reanudarlo cuando esta acabe.
    const previous = this._playingSrc();
    if (previous && previous !== src) this._interrupted = previous;
    if (this._interrupted === src) this._interrupted = null;

    this._wanted = src;
    this._pauseOthers(src);

    return track.audio.play()
      .then(() => { this._unbindUnlock(); return true; })
      .catch(() => {
        // Autoplay bloqueado: reintentar en el proximo gesto real del usuario.
        this._bindUnlock();
        return false;
      });
  },

  pause(src) {
    const track = this._tracks.get(src);
    if (!track) return;
    if (this._wanted === src) this._wanted = null;
    // Si la pausa el usuario a proposito, deja de estar pendiente de reanudarse.
    if (this._interrupted === src) this._interrupted = null;
    track.audio.pause();
  },

  stop(src) {
    const track = this._tracks.get(src);
    if (!track) return;
    if (this._wanted === src) this._wanted = null;
    if (this._interrupted === src) this._interrupted = null;
    track.audio.pause();
    track.audio.currentTime = 0;
    track.started = false;
    this._emit(track);
  },

  /**
   * Reanuda, desde donde se quedo, la pista que el sistema pauso sola.
   * Se llama al terminar una cancion y al cerrar su ventana.
   */
  resumeInterrupted(afterSrc) {
    const src = this._interrupted;
    if (!src || src === afterSrc) return false;
    this._interrupted = null;
    this.play(src);
    return true;
  },

  /**
   * Pausa lo que suene ahora y lo deja anotado para reanudarlo despues.
   * Lo usa el video, que no es una pista de AudioHub pero tambien hace ruido.
   */
  duck() {
    const previous = this._playingSrc();
    if (!previous) return;
    this._interrupted = previous;
    this._wanted = null;
    this._pauseOthers(null);
  },

  /** src de la pista que suena ahora mismo, si hay alguna. */
  _playingSrc() {
    for (const track of this._tracks.values()) {
      if (!track.audio.paused && !track.audio.ended) return track.src;
    }
    return null;
  },

  toggle(src, opts) {
    return this.isPlaying(src) ? (this.pause(src), Promise.resolve(false)) : this.play(src, opts);
  },

  /** ratio entre 0 y 1 */
  seek(src, ratio) {
    const track = this._tracks.get(src);
    if (!track) return;
    const { duration } = track.audio;
    if (!Number.isFinite(duration) || !duration) return;
    track.audio.currentTime = Math.max(0, Math.min(1, ratio)) * duration;
    this._emit(track);
  },

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, Number(value) || 0));
    this._tracks.forEach(track => { track.audio.volume = this.volume; });
  },

  /** Silencia todas las pistas de archivo (lo usa el video al empezar y el apagado). */
  pauseAll() {
    this._wanted = null;
    this._interrupted = null;
    this._pauseOthers(null);
  },

  _pauseOthers(src) {
    this._tracks.forEach(track => {
      if (track.src !== src && !track.audio.paused) track.audio.pause();
    });
  },

  /* ---------- desbloqueo de autoplay ---------- */

  _onGesture: null,

  _bindUnlock() {
    if (this._unlockBound) return;
    this._unlockBound = true;
    this._onGesture = () => {
      const src = this._wanted;
      if (!src) return this._unbindUnlock();
      const track = this._tracks.get(src);
      if (!track) return this._unbindUnlock();
      // Solo se desengancha cuando el audio arranca de verdad.
      track.audio.play().then(() => this._unbindUnlock()).catch(() => {});
    };
    document.addEventListener('pointerdown', this._onGesture);
    document.addEventListener('keydown', this._onGesture);
  },

  _unbindUnlock() {
    if (!this._unlockBound) return;
    this._unlockBound = false;
    document.removeEventListener('pointerdown', this._onGesture);
    document.removeEventListener('keydown', this._onGesture);
    this._onGesture = null;
  }
};

/** mm:ss para los displays del reproductor */
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
