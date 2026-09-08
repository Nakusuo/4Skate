/* ================= SISTEMA (system.js) =================
   Arranque del "SO": reloj, menu de inicio, secuencia de BIOS,
   apagado e inicializacion general.
======================================================================= */

/* ================= RELOJ ================= */
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'p.m.' : 'a.m.';
  const hours = now.getHours() % 12 || 12;
  el.textContent = `${hours}:${minutes} ${ampm}`;
}

/* ================= MENU DE INICIO ================= */
const StartMenu = {
  get menu() { return document.getElementById('start-menu'); },
  get button() { return document.getElementById('start-btn'); },

  render() {
    const list = document.getElementById('start-list');
    if (!list) return;
    list.innerHTML = '';

    MENU_ITEMS.forEach(entry => {
      if (entry.sep) {
        const sep = document.createElement('div');
        sep.className = 'menu-sep';
        list.appendChild(sep);
        return;
      }
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'menu-item';
      item.innerHTML = `<span>${entry.emoji}</span><span>${entry.label}</span>`;
      item.addEventListener('click', e => {
        e.stopPropagation();
        SND.click();
        this.close();
        entry.action();
      });
      list.appendChild(item);
    });
  },

  get isOpen() { return this.menu?.classList.contains('open'); },

  open() {
    this.menu?.classList.add('open');
    this.button?.classList.add('active');
  },

  close() {
    this.menu?.classList.remove('open');
    this.button?.classList.remove('active');
  },

  toggle() { this.isOpen ? this.close() : this.open(); },

  bind() {
    this.button?.addEventListener('click', e => {
      e.stopPropagation();
      SND.click();
      this.toggle();
    });
    document.addEventListener('click', e => {
      if (!this.isOpen) return;
      if (this.menu.contains(e.target) || this.button.contains(e.target)) return;
      this.close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }
};

/* ================= APAGADO ================= */
function confirmShutdown() {
  openDialog({
    title: 'Apagar el sistema',
    icon: '🔌',
    text: '¿deseas apagar tu equipo?',
    buttons: [
      { label: 'Sí', onClick: doShutdown },
      { label: 'Cancelar', onClick: () => {} }
    ]
  });
}

function doShutdown() {
  AudioHub.pauseAll();
  StartMenu.close();

  ['desktop', 'taskbar', 'windows-layer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const screen = document.getElementById('shutdown-screen');
  if (!screen) return;
  screen.classList.add('show');

  setTimeout(() => {
    const final = document.getElementById('shutdown-final');
    if (!final) return;
    final.textContent = 'no esperaba que una ida al cine terminara convirtiéndose en una de mis amistades favoritas.\n\nfeliz geiversario, Glenn. 🩷';
    final.classList.add('show');
  }, 1600);
}

/* ================= SECUENCIA DE ARRANQUE ================= */
function runBoot() {
  const lines = document.getElementById('boot-lines');
  const fill = document.getElementById('boot-bar-fill');
  const screen = document.getElementById('boot-screen');
  let i = 0;

  (function step() {
    if (i < BOOT_LINES.length) {
      if (lines) lines.textContent += BOOT_LINES[i] + '\n';
      if (fill) fill.style.width = ((i + 1) / BOOT_LINES.length * 100) + '%';
      i++;
      setTimeout(step, 420);
      return;
    }
    setTimeout(finishBoot, 500);
  })();

  function finishBoot() {
    if (screen) screen.classList.add('done');
    SND.success();

    // La musica de fondo empieza sola; si el navegador la bloquea,
    // AudioHub reintenta en el primer gesto del usuario.
    AudioHub.play(BG_MUSIC_SRC, { loop: true });

    const cdPlayer = DESKTOP_ITEMS.find(item => item.special === 'ytplayer');
    if (cdPlayer) openItem(cdPlayer);
  }
}

/* ================= INICIALIZACION ================= */
function init() {
  renderDesktop();
  StartMenu.render();
  StartMenu.bind();

  updateClock();
  setInterval(updateClock, 1000);

  runBoot();

  // El AudioContext de los bips solo puede crearse tras un gesto del usuario.
  document.addEventListener('pointerdown', () => SND.init(), { once: true });
}

document.addEventListener('DOMContentLoaded', init);
