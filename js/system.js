/* ================= RETRO SYSTEM ENTRYPOINT (system.js) ================= */
// Este archivo coordina el reloj, menú de inicio, secuencias de arranque, apagado e inicialización.

/* ================= 1. RELOJ DEL SISTEMA ================= */
function updateClock() {
  const d = new Date();
  let h = d.getHours(); 
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  h = h % 12; 
  if (h === 0) h = 12;
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    clockEl.textContent = `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
}

/* ================= 2. MENÚ DE INICIO ================= */
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const startList = document.getElementById('start-list');

function renderStartMenu() {
  if (!startList) return;
  startList.innerHTML = '';
  MENU_ITEMS.forEach(mi => {
    if (mi.sep) { 
      const s = document.createElement('div'); 
      s.className = 'menu-sep'; 
      startList.appendChild(s); 
      return; 
    }
    const d = document.createElement('div'); 
    d.className = 'menu-item';
    d.innerHTML = `<span>${mi.emoji}</span><span>${mi.label}</span>`;
    d.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      SND.click(); 
      closeStartMenu(); 
      mi.action(); 
    });
    startList.appendChild(d);
  });
}

function openStartMenu() { 
  if (startMenu && startBtn) {
    startMenu.classList.add('open'); 
    startBtn.classList.add('active'); 
  }
}

function closeStartMenu() { 
  if (startMenu && startBtn) {
    startMenu.classList.remove('open'); 
    startBtn.classList.remove('active'); 
  }
}

if (startBtn) {
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    SND.click();
    startMenu.classList.contains('open') ? closeStartMenu() : openStartMenu();
  });
}

document.addEventListener('click', (e) => {
  if (startMenu && startBtn && !startMenu.contains(e.target) && e.target !== startBtn) {
    closeStartMenu();
  }
  if (!e.target.closest('.icon')) {
    document.querySelectorAll('.icon.selected').forEach(i => i.classList.remove('selected'));
  }
});

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

function confirmShutdown() {
  openDialog({
    title: 'Apagar el sistema', 
    icon: '🔌',
    text: '¿deseas apagar tu equipo?',
    buttons: [
      { label: 'Sí', onClick: () => doShutdown() },
      { label: 'Cancelar', onClick: () => {} }
    ]
  });
}

function doShutdown() {
  const desktop = document.getElementById('desktop');
  const taskbar = document.getElementById('taskbar');
  const winLayer = document.getElementById('windows-layer');
  
  if (desktop) desktop.style.display = 'none';
  if (taskbar) taskbar.style.display = 'none';
  if (winLayer) winLayer.style.display = 'none';
  
  closeStartMenu();
  
  const scr = document.getElementById('shutdown-screen');
  if (scr) {
    scr.classList.add('show');
    setTimeout(() => {
      const finalMsg = document.getElementById('shutdown-final');
      if (finalMsg) {
        finalMsg.textContent = 'no esperaba que una ida al cine terminara convirtiéndose en una de mis amistades favoritas.\n\nfeliz geiversario, Glenn. 🩷';
        finalMsg.classList.add('show');
      }
    }, 1600);
  }
}

/* ================= 3. SECUENCIA DE ARRANQUE ================= */
function runBoot() {
  const cont = document.getElementById('boot-lines');
  const fill = document.getElementById('boot-bar-fill');
  let i = 0;
  
  function step() {
    if (i < BOOT_LINES.length) {
      if (cont) cont.innerHTML += BOOT_LINES[i] + '\n';
      if (fill) fill.style.width = ((i + 1) / BOOT_LINES.length * 100) + '%';
      i++;
      setTimeout(step, 420);
    } else {
      setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) bootScreen.style.display = 'none';
        SND.success();

        // Abrir automáticamente el CD Player (Música) al iniciar
        const cdPlayItem = DESKTOP_ITEMS.find(it => it.special === 'ytplayer');
        if (cdPlayItem) {
          openItem(cdPlayItem);
        }
      }, 500);
    }
  }
  step();
}

window.bgPlayerStarted = false;
window.bgAudioPlayer = null;

function initBgPlayer() {
  if (typeof BG_MUSIC_SRC !== 'undefined' && BG_MUSIC_SRC) {
    window.bgAudioPlayer = new Audio(BG_MUSIC_SRC);
    window.bgAudioPlayer.loop = true;
    
    const startPlay = () => {
      if (window.bgPlayerStarted) return;
      window.bgPlayerStarted = true;
      window.bgAudioPlayer.play().catch(e => {
        console.log("Autoplay bloqueado. Se reproducirá al interactuar:", e);
      });
      const statusText = document.getElementById('cd-status');
      if (statusText) statusText.textContent = 'PLAYING';
      
      document.removeEventListener('pointerdown', startPlay);
      document.removeEventListener('click', startPlay);
    };
    
    document.addEventListener('pointerdown', startPlay);
    document.addEventListener('click', startPlay);
  }
}

function init() {
  renderDesktop();
  renderStartMenu();
  updateClock();
  setInterval(updateClock, 1000);
  runBoot();
  initBgPlayer();
  
  // Inicialización del AudioContext en la primera interacción
  document.body.addEventListener('pointerdown', () => SND.init(), { once: true });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
