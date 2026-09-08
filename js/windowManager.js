/* ================= WINDOW MANAGER (windowManager.js) =================
   Solo el "chrome" de las ventanas: crear, enfocar, mover, redimensionar,
   minimizar, maximizar, cerrar y la barra de tareas.
   El contenido de cada ventana vive en apps.js.
===================================================================== */

const WM = (() => {
  const MOBILE_BREAKPOINT = 600;
  const TASKBAR_H = 34;

  let zTop = 10;
  let cascade = 0;
  let activeId = null;

  /** @type {Object<string,{el:HTMLElement,title:string,icon:string,minimized:boolean,maximized:boolean,onClose:Function|null,prevRect:Object|null}>} */
  const windows = {};

  const layer = () => document.getElementById('windows-layer');
  const tray = () => document.getElementById('taskbar-apps');

  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

  /* ---------- geometria ---------- */

  function nextPos(w, h) {
    const maxX = Math.max(8, window.innerWidth - w - 8);
    const maxY = Math.max(8, window.innerHeight - TASKBAR_H - h - 8);
    if (isMobile()) {
      cascade = (cascade + 1) % 5;
      return { x: Math.round((window.innerWidth - w) / 2), y: Math.min(8 + cascade * 14, maxY) };
    }
    cascade = (cascade + 1) % 7;
    return { x: Math.min(80 + cascade * 26, maxX), y: Math.min(40 + cascade * 22, maxY) };
  }

  /** Mantiene la ventana dentro de la pantalla (al abrir y al rotar el movil). */
  function clampIntoView(el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const maxX = Math.max(0, window.innerWidth - Math.min(w, 120));
    const maxY = Math.max(0, window.innerHeight - TASKBAR_H - 24);
    el.style.left = Math.max(0, Math.min(maxX, el.offsetLeft)) + 'px';
    el.style.top = Math.max(0, Math.min(maxY, el.offsetTop)) + 'px';
  }

  /* ---------- ciclo de vida ---------- */

  function create({ id, title, icon, width, height, bodyHTML, path, statusText, onMount, onClose, fitMobile = true }) {
    const existing = windows[id];
    if (existing) {
      if (existing.minimized) restore(id);
      else focus(id);
      return existing;
    }

    const maxW = window.innerWidth - (isMobile() ? 12 : 24);
    const maxH = window.innerHeight - TASKBAR_H - (isMobile() ? 16 : 40);
    const targetW = Math.min(width || 320, maxW);
    const targetH = height ? Math.min(height, maxH) : null;

    const el = document.createElement('div');
    el.className = 'window';
    el.style.width = targetW + 'px';
    if (targetH) el.style.height = targetH + 'px';
    el.style.maxHeight = maxH + 'px';
    el.style.zIndex = ++zTop;

    el.innerHTML = `
      <div class="titlebar">
        <span class="ticon">${icon || '🗂️'}</span>
        <span class="ttext">${title}</span>
        <div class="titlebar-btns">
          <button class="titlebar-btn tb-min" type="button" aria-label="Minimizar">_</button>
          <button class="titlebar-btn tb-max" type="button" aria-label="Maximizar">□</button>
          <button class="titlebar-btn tb-close" type="button" aria-label="Cerrar">x</button>
        </div>
      </div>
      ${path ? `<div class="pathbar">📁 <div class="pbox">${path}</div></div>` : ''}
      <div class="window-body">${bodyHTML || ''}</div>
      ${statusText ? `<div class="statusbar"><span>${statusText}</span><span>WinGei 98</span></div>` : ''}
      <div class="win-resize-handle" aria-hidden="true"></div>
    `;

    layer().appendChild(el);

    const pos = nextPos(el.offsetWidth, el.offsetHeight);
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    clampIntoView(el);

    const win = { el, id, title, icon, minimized: false, maximized: false, onClose: onClose || null, prevRect: null };
    windows[id] = win;

    makeDraggable(win);
    makeResizable(win);

    // pointerdown (no mousedown): asi el foco tambien funciona con dedo.
    el.addEventListener('pointerdown', () => focus(id));
    el.querySelector('.tb-close').addEventListener('click', e => { e.stopPropagation(); close(id); });
    el.querySelector('.tb-min').addEventListener('click', e => { e.stopPropagation(); minimize(id); });
    el.querySelector('.tb-max').addEventListener('click', e => { e.stopPropagation(); toggleMaximize(id); });
    el.querySelector('.titlebar').addEventListener('dblclick', () => toggleMaximize(id));

    addTaskbarBtn(win);
    focus(id);
    // En movil el contenido se ve mejor a pantalla completa (los dialogos no).
    if (isMobile() && fitMobile) maximize(id);
    if (onMount) onMount(el, win);
    return win;
  }

  function focus(id) {
    const win = windows[id];
    if (!win || win.minimized) return;
    win.el.style.zIndex = ++zTop;
    Object.values(windows).forEach(w => w.el.classList.toggle('inactive', w.id !== id));
    document.querySelectorAll('.taskbar-app').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    activeId = id;
  }

  function close(id) {
    const win = windows[id];
    if (!win) return;
    SND.close();
    if (win.onClose) { try { win.onClose(); } catch (e) { console.error(e); } }
    win.el.remove();
    const btn = document.querySelector(`.taskbar-app[data-id="${id}"]`);
    if (btn) btn.remove();
    delete windows[id];
    if (activeId === id) {
      activeId = null;
      focusTopmost();
    }
  }

  function focusTopmost() {
    const open = Object.values(windows).filter(w => !w.minimized);
    if (!open.length) return;
    open.sort((a, b) => Number(a.el.style.zIndex) - Number(b.el.style.zIndex));
    focus(open[open.length - 1].id);
  }

  function minimize(id) {
    const win = windows[id];
    if (!win) return;
    win.el.classList.add('minimized');
    win.minimized = true;
    const btn = document.querySelector(`.taskbar-app[data-id="${id}"]`);
    if (btn) btn.classList.remove('active');
    if (activeId === id) { activeId = null; focusTopmost(); }
  }

  function restore(id) {
    const win = windows[id];
    if (!win) return;
    win.el.classList.remove('minimized');
    win.minimized = false;
    focus(id);
  }

  /** Click en la barra de tareas: restaura, enfoca o minimiza segun el estado. */
  function toggleFromTaskbar(id) {
    const win = windows[id];
    if (!win) return;
    if (win.minimized) restore(id);
    else if (activeId === id) minimize(id);
    else focus(id);
  }

  function maximize(id) {
    const win = windows[id];
    if (!win || win.maximized) return;
    const { el } = win;
    win.prevRect = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
    win.maximized = true;
    el.classList.add('maximized');
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.maxHeight = 'none';
  }

  function unmaximize(id) {
    const win = windows[id];
    if (!win || !win.maximized) return;
    const { el, prevRect } = win;
    win.maximized = false;
    el.classList.remove('maximized');
    Object.assign(el.style, prevRect || {});
    el.style.maxHeight = (window.innerHeight - TASKBAR_H - 40) + 'px';
    clampIntoView(el);
  }

  function toggleMaximize(id) {
    SND.click();
    const win = windows[id];
    if (!win) return;
    win.maximized ? unmaximize(id) : maximize(id);
  }

  function addTaskbarBtn(win) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'taskbar-app pixel-btn';
    btn.dataset.id = win.id;
    btn.innerHTML = `<span class="tba-icon">${win.icon || '🗂️'}</span><span class="tba-label">${win.title}</span>`;
    btn.addEventListener('click', () => { SND.click(); toggleFromTaskbar(win.id); });
    tray().appendChild(btn);
  }

  /* ---------- arrastre ---------- */

  function makeDraggable(win) {
    const bar = win.el.querySelector('.titlebar');
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;

    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('.titlebar-btn')) return;
      if (win.maximized) return;           // una ventana maximizada no se mueve
      dragging = true;
      win.el.classList.add('dragging');
      sx = e.clientX; sy = e.clientY;
      ox = win.el.offsetLeft; oy = win.el.offsetTop;
      bar.setPointerCapture(e.pointerId);
    });

    bar.addEventListener('pointermove', e => {
      if (!dragging) return;
      e.preventDefault();
      const nx = Math.max(-60, Math.min(window.innerWidth - 120, ox + (e.clientX - sx)));
      const ny = Math.max(0, Math.min(window.innerHeight - TASKBAR_H - 24, oy + (e.clientY - sy)));
      win.el.style.left = nx + 'px';
      win.el.style.top = ny + 'px';
    });

    const end = () => { dragging = false; win.el.classList.remove('dragging'); };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  /* ---------- redimensionado ---------- */

  function makeResizable(win) {
    const handle = win.el.querySelector('.win-resize-handle');
    let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;

    handle.addEventListener('pointerdown', e => {
      e.stopPropagation();
      e.preventDefault();
      if (win.maximized) return;
      resizing = true;
      sx = e.clientX; sy = e.clientY;
      sw = win.el.offsetWidth; sh = win.el.offsetHeight;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener('pointermove', e => {
      if (!resizing) return;
      const minW = Math.min(220, window.innerWidth - 20);
      const nw = Math.max(minW, Math.min(window.innerWidth - win.el.offsetLeft - 4, sw + (e.clientX - sx)));
      const nh = Math.max(120, Math.min(window.innerHeight - win.el.offsetTop - TASKBAR_H - 4, sh + (e.clientY - sy)));
      win.el.style.width = nw + 'px';
      win.el.style.height = nh + 'px';
      win.el.style.maxHeight = 'none';
    });

    const end = () => { resizing = false; };
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  /* ---------- reacciones globales ---------- */

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Object.values(windows).forEach(win => {
        if (win.maximized) {
          win.el.style.height = '100%';
          return;
        }
        const maxW = window.innerWidth - 12;
        if (win.el.offsetWidth > maxW) win.el.style.width = maxW + 'px';
        win.el.style.maxHeight = (window.innerHeight - TASKBAR_H - 16) + 'px';
        clampIntoView(win.el);
      });
    }, 120);
  });

  // Escape cierra la ventana activa.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeId) close(activeId);
  });

  return {
    create, close, focus, minimize, restore, toggleMaximize,
    get activeId() { return activeId; },
    has: id => Boolean(windows[id]),
    get: id => windows[id]
  };
})();

/* Alias cortos para el resto del codigo (apps.js / system.js). */
const createWindow = opts => WM.create(opts);
const closeWindow = id => WM.close(id);

/* ---------- avisos flotantes ---------- */
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2600);
}
