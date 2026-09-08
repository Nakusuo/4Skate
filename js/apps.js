/* ================= CONTENIDO DE VENTANAS (apps.js) =================
   Cada "aplicacion" de WinGei 98: carpetas, notas, visor de imagenes,
   reproductor de medios, dialogos y ventanas especiales.
   El chrome de la ventana lo pone windowManager.js.
=================================================================== */

/* ---------- utilidades de texto ---------- */
function escapeHTML(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function noteWrap(text) {
  return text.split('\n').map(line => (line === '' ? '<br>' : escapeHTML(line))).join('<br>');
}

/* ---------- ruta mostrada en la barra de direccion ---------- */
function pathFor(item) {
  if (item === F_4MESES) return '4_meses';
  for (const folder of [F01, F02, F03, F04, F05, F06]) {
    if (folder === item) return '4_meses\\' + folder.name;
    if (folder.children && folder.children.includes(item)) {
      return '4_meses\\' + folder.name + '\\' + item.name;
    }
  }
  return item.name;
}

/* ================= CARPETAS ================= */
function openFolderWindow(item) {
  const isRoot = item === F_4MESES;
  const win = createWindow({
    id: item.id,
    title: item.name,
    icon: isRoot ? '📁' : (item.locked ? '💗' : '📁'),
    width: isRoot ? 430 : 380,
    height: isRoot ? 300 : 280,
    path: pathFor(item),
    statusText: `${item.children.length} objeto(s)`,
    bodyHTML: '<div class="icon-grid"></div>',
    onMount: (el) => {
      const grid = el.querySelector('.icon-grid');
      item.children.forEach(child => grid.appendChild(makeIconEl(child)));
    }
  });
  return win;
}

/* ================= NOTAS ================= */
function openNoteHandWindow(item) {
  const isFinal = item.special === 'final';
  const imgHTML = item.src
    ? `<div class="note-img"><img src="${item.src}" alt="${escapeHTML(item.name)}" loading="lazy"></div>`
    : '';

  createWindow({
    id: item.id,
    title: item.name,
    icon: '📝',
    width: isFinal ? 440 : 380,
    statusText: 'bloc de notas',
    bodyHTML: `<div class="note-hand${isFinal ? ' is-final' : ''}">
      <span class="sticker">${isFinal ? '💌' : '🩷'}</span>
      ${noteWrap(item.text)}
      ${imgHTML}
    </div>`
  });
}

function openNoteMonoWindow(item) {
  createWindow({
    id: item.id,
    title: item.name,
    icon: '📄',
    width: 300,
    statusText: 'solo lectura',
    bodyHTML: `<div class="note-mono">${escapeHTML(item.text)}</div>`
  });
}

/* ================= VISOR DE IMAGENES ================= */
function openIlloWindow(item) {
  const media = item.src
    ? `<img class="illo-img" src="${item.src}" alt="${escapeHTML(item.name)}" loading="lazy">`
    : (ILLO[item.illo] || '');

  createWindow({
    id: item.id,
    title: item.name,
    icon: '🖼️',
    width: 340,
    statusText: 'visor de imagenes',
    bodyHTML: `<div class="illo-wrap">
      ${media}
      ${item.caption ? `<div class="illo-caption">${noteWrap(item.caption)}</div>` : ''}
    </div>`
  });
}

/* ================= REPRODUCTOR ================= */
/* Un unico componente para el CD Player de fondo y los .mp3 de las carpetas.
   Toda la logica de sonido la lleva AudioHub: aqui solo se pinta el estado. */

const WAVE_BARS = 14;

function playerHTML({ cover, title, artist, lcdLabel, caption }) {
  const bars = Array.from({ length: WAVE_BARS },
    (_, i) => `<span style="--h:${Math.round(30 + Math.random() * 70)}%;--d:${(i * 0.07).toFixed(2)}s"></span>`).join('');

  return `<div class="player">
    <div class="player-cover-container">
      <img class="player-cover" src="${cover || 'Imagenes/mp3.jpg'}" alt="Caratula">
    </div>

    <div class="player-meta">
      <div class="player-title">${escapeHTML(title)}</div>
      ${artist ? `<div class="player-artist">${escapeHTML(artist)}</div>` : ''}
    </div>

    <div class="player-lcd">
      <span>${escapeHTML(lcdLabel)}</span>
      <span class="player-status">READY</span>
    </div>

    <div class="player-seek" role="slider" tabindex="0" aria-label="Progreso"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="player-seek-fill"></div>
    </div>
    <div class="player-time"><span class="player-elapsed">0:00</span><span class="player-duration">0:00</span></div>

    <div class="waveform">${bars}</div>

    <div class="player-transport">
      <button class="pixel-btn player-play" type="button">Play ▶</button>
      <button class="pixel-btn player-pause" type="button">Pause ⏸</button>
      <button class="pixel-btn player-stop" type="button">Stop ■</button>
    </div>

    <label class="player-volume">
      <span>Volumen</span>
      <input type="range" min="0" max="1" step="0.05" aria-label="Volumen">
    </label>

    ${caption ? `<div class="player-caption">${noteWrap(caption)}</div>` : ''}
  </div>`;
}

/**
 * Conecta el DOM del reproductor con AudioHub.
 * Devuelve la funcion de limpieza que hay que llamar al cerrar la ventana.
 */
function wirePlayer(root, { src, loop = false }) {
  const player = root.querySelector('.player');
  const cover = player.querySelector('.player-cover');
  const status = player.querySelector('.player-status');
  const seek = player.querySelector('.player-seek');
  const seekFill = player.querySelector('.player-seek-fill');
  const elapsed = player.querySelector('.player-elapsed');
  const duration = player.querySelector('.player-duration');
  const volume = player.querySelector('.player-volume input');

  volume.value = AudioHub.volume;

  /* --- pintar estado (unica fuente: el <audio> real) --- */
  const unsubscribe = AudioHub.subscribe(src, state => {
    player.classList.toggle('is-playing', state.playing);
    seekFill.style.width = (state.progress * 100) + '%';
    seek.setAttribute('aria-valuenow', Math.round(state.progress * 100));
    elapsed.textContent = formatTime(state.time);
    duration.textContent = formatTime(state.duration);

    if (state.playing) status.textContent = 'PLAYING';
    else if (state.ended) status.textContent = 'END';
    else if (state.started) status.textContent = 'PAUSED';
    else status.textContent = 'READY';
  }, { loop });

  /* --- transporte --- */
  const onPlay = () => {
    SND.click();
    AudioHub.play(src, { loop }).then(ok => {
      if (!ok) showToast('toca la pantalla para permitir el audio 🔈');
    });
  };
  const onPause = () => { SND.click(); AudioHub.pause(src); };
  const onStop = () => { SND.click(); AudioHub.stop(src); };

  player.querySelector('.player-play').addEventListener('click', onPlay);
  player.querySelector('.player-pause').addEventListener('click', onPause);
  player.querySelector('.player-stop').addEventListener('click', onStop);
  cover.addEventListener('click', () => (AudioHub.isPlaying(src) ? onPause() : onPlay()));

  /* --- barra de progreso: click y arrastre --- */
  const seekTo = clientX => {
    const rect = seek.getBoundingClientRect();
    AudioHub.seek(src, (clientX - rect.left) / rect.width);
  };
  let scrubbing = false;
  seek.addEventListener('pointerdown', e => {
    scrubbing = true;
    seek.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  });
  seek.addEventListener('pointermove', e => { if (scrubbing) seekTo(e.clientX); });
  const endScrub = () => { scrubbing = false; };
  seek.addEventListener('pointerup', endScrub);
  seek.addEventListener('pointercancel', endScrub);
  seek.addEventListener('keydown', e => {
    const step = e.key === 'ArrowRight' ? 0.05 : e.key === 'ArrowLeft' ? -0.05 : 0;
    if (!step) return;
    e.preventDefault();
    AudioHub.seek(src, AudioHub.state(src).progress + step);
  });

  /* --- volumen compartido entre todos los reproductores abiertos --- */
  volume.addEventListener('input', e => {
    AudioHub.setVolume(e.target.value);
    document.querySelectorAll('.player-volume input').forEach(other => {
      if (other !== e.target) other.value = AudioHub.volume;
    });
  });

  return unsubscribe;
}

/** Ventana de un .mp3 guardado en una carpeta. */
function openAudioWindow(item) {
  if (!item.src) {
    // Sin archivo vinculado: se mantiene el gag del sistema roto.
    createWindow({
      id: item.id,
      title: item.name,
      icon: '🎵',
      width: 300,
      statusText: 'reproductor de medios',
      bodyHTML: `<div class="player">
        <div class="player-cover-container"><img class="player-cover" src="${item.cover || 'Imagenes/mp3.jpg'}" alt="Caratula"></div>
        <div class="player-title">${escapeHTML(item.title || item.name)}</div>
        <button class="pixel-btn player-play" type="button">Play ▶</button>
        ${item.caption ? `<div class="player-caption">${noteWrap(item.caption)}</div>` : ''}
      </div>`,
      onMount: el => el.querySelector('.player-play').addEventListener('click', () => {
        SND.error();
        showToast('no se puede reproducir aquí 🙃');
      })
    });
    return;
  }

  let cleanup = null;
  createWindow({
    id: item.id,
    title: item.name,
    icon: '🎵',
    width: 300,
    statusText: 'reproductor de medios',
    bodyHTML: playerHTML({
      cover: item.cover,
      title: item.title || item.name,
      artist: item.artist,
      lcdLabel: item.name,
      caption: item.caption
    }),
    onMount: el => { cleanup = wirePlayer(el, { src: item.src, loop: false }); },
    // Al cerrar: parar el audio, devolver la musica de fondo y soltar la suscripcion.
    onClose: () => {
      AudioHub.pause(item.src);
      AudioHub.resumeInterrupted(item.src);
      if (cleanup) cleanup();
    }
  });
}

/** Ventana de video con controles nativos. */
function openVideoWindow(item) {
  let videoEl = null;
  createWindow({
    id: item.id,
    title: item.name,
    icon: '🖤',
    width: 340,
    statusText: 'visor de video',
    bodyHTML: `<div class="player">
      <div class="player-title">${escapeHTML(item.title || item.name)}</div>
      <video class="player-video" src="${item.src}" controls playsinline preload="metadata"></video>
      ${item.caption ? `<div class="player-caption">${noteWrap(item.caption)}</div>` : ''}
    </div>`,
    onMount: el => {
      videoEl = el.querySelector('video');
      // El video tambien hace ruido: calla la musica y la devuelve al acabar.
      videoEl.addEventListener('play', () => AudioHub.duck());
      videoEl.addEventListener('ended', () => AudioHub.resumeInterrupted());
    },
    onClose: () => {
      if (videoEl) videoEl.pause();
      AudioHub.resumeInterrupted();
    }
  });
}

/** CD Player: la musica de fondo del sistema. */
function openCdPlayerWindow(item) {
  let cleanup = null;
  createWindow({
    id: item.id,
    title: 'CD Player (Música)',
    icon: '🎵',
    width: 300,
    statusText: 'reproductor de cd',
    bodyHTML: playerHTML({
      cover: 'Imagenes/mp3.jpg',
      title: 'CD Player',
      artist: 'Música de Fondo',
      lcdLabel: '[TRACK 01]'
    }),
    onMount: el => { cleanup = wirePlayer(el, { src: BG_MUSIC_SRC, loop: true }); },
    // Cerrar la ventana no corta la musica de fondo: solo suelta la suscripcion.
    onClose: () => { if (cleanup) cleanup(); }
  });
}

/* ================= DIALOGOS ================= */
let dialogCount = 0;
function openDialog({ title, icon, text, buttons }) {
  const id = 'dlg' + (++dialogCount);
  const win = createWindow({
    id,
    title,
    icon: icon || '⚠️',
    width: 300,
    fitMobile: false,          // un dialogo se queda pequeño, tambien en movil
    bodyHTML: `<div class="dialog-body">
        <div class="dialog-icon">${icon || '⚠️'}</div>
        <div class="dialog-text">${text}</div>
      </div>
      <div class="dialog-btns">${buttons
        .map((b, i) => `<button class="pixel-btn dlg-btn" type="button" data-i="${i}">${b.label}</button>`)
        .join('')}</div>`,
    onMount: el => {
      el.querySelectorAll('.dlg-btn').forEach((btn, i) => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          closeWindow(id);
          if (buttons[i].onClick) buttons[i].onClick();
        });
      });
    }
  });
  return win;
}

function openExeDialog() {
  openDialog({
    title: 'bolita rosa.exe',
    icon: '📁',
    text: '¿Deseas eliminar "bolita rosa.exe"?',
    buttons: [
      {
        label: 'Sí',
        onClick: () => {
          SND.error();
          openDialog({
            title: 'Error',
            icon: '❌',
            text: '<strong>Desinstalación fallida.</strong><br><br>"bolita rosa.exe" no puede ser eliminado.<br><br>Motivo:<br>Marcó mi vida demasiado profundo como para enviarlo a la papelera.<br><br>El sistema recomienda conservar este archivo para siempre.',
            buttons: [{ label: 'Entendido', onClick: () => SND.click() }]
          });
        }
      },
      {
        label: 'No',
        onClick: () => {
          SND.click();
          showToast('Decisión sabia. Bolita rosa se queda.');
        }
      }
    ]
  });
}

/* ================= VENTANAS ESPECIALES ================= */
const SPECIAL_WINDOWS = {
  mypc: () => createWindow({
    id: 'mypc',
    title: 'Propiedades del sistema',
    icon: '🖥️',
    width: 300,
    bodyHTML: `<div class="note-mono">Sistema: Windows Geiversario 98
Procesador: Corazón Dual Core, 4.0 MHz
Memoria RAM: 4 meses (en uso: 100%)
Disco C:: 99% lleno de recuerdos sin organizar
Edición: especial — amistad</div>`
  }),

  trash: () => createWindow({
    id: 'trash',
    title: 'Papelera de reciclaje',
    icon: '🗑️',
    width: 280,
    bodyHTML: `<div class="note-mono">no hay nada aquí.
todo lo importante se quedó guardado.</div>`
  }),

  ytplayer: item => openCdPlayerWindow(item)
};

function openSpecialWindow(item) {
  const open = SPECIAL_WINDOWS[item.special];
  if (open) open(item);
}

function openAbout() {
  createWindow({
    id: 'about',
    title: 'Acerca de WinGei 98',
    icon: '💗',
    width: 300,
    bodyHTML: `<div class="note-mono">WinGei 98
edición especial de geiversario

hecho a mano, con html, css y js,
y bastante nostalgia.

para Glenn. feliz geiversario.</div>`
  });
}
