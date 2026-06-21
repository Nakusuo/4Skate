/* ================= RETRO WINDOW MANAGER (windowManager.js) ================= */
// Este archivo maneja la creación de ventanas, arrastre, eventos y renderizado de contenidos.

let zTop = 10;
let openWindows = {};
let cascade = 0;
let visited = new Set();
const winLayer = document.getElementById('windows-layer');
const taskbarApps = document.getElementById('taskbar-apps');

function glyphHTML(item) {
  if (item.type === 'folder') {
    if (item.locked && !folderUnlocked()) return ICON_FOLDER_FADE;
    if (item.locked) return ICON_FOLDER_LILAC;
    return ICON_FOLDER;
  }
  if (item.special === 'mypc') return ICON_MYPC;
  if (item.special === 'trash') return ICON_TRASH;
  if (item.type === 'illo' || item.type === 'image') return ICON_IMAGE;
  if (item.type === 'note-hand' || item.type === 'note-mono') return ICON_NOTE;
  if (item.type === 'audio') return ICON_AUDIO;
  if (item.type === 'video') return ICON_VIDEO;
  if (item.type === 'exe') return ICON_EXE;
  
  return `<span>${item.emoji || '📄'}</span>`;
}

function folderUnlocked() { return visited.size >= 5; }

function makeIconEl(item) {
  const div = document.createElement('div');
  div.className = 'icon' + (item.locked && !folderUnlocked() ? ' locked' : '');
  div.dataset.id = item.id;
  div.innerHTML = `<div class="glyph">${glyphHTML(item)}${item.locked ? `<span class="badge">${folderUnlocked() ? '✨' : '🔒'}</span>` : ''}</div><div class="label">${item.name}</div>`;
  let lastTap = 0;
  div.addEventListener('pointerup', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.icon.selected').forEach(i => { if (i !== div) i.classList.remove('selected'); });
    div.classList.add('selected');
    const now = Date.now();
    if (now - lastTap < 450) { 
      lastTap = 0; 
      openItem(item); 
    } else { 
      lastTap = now; 
    }
  });
  return div;
}

function renderDesktop() {
  const cont = document.getElementById('desktop-icons');
  if (!cont) return;
  cont.innerHTML = '';
  DESKTOP_ITEMS.forEach(it => cont.appendChild(makeIconEl(it)));
}

function openItem(item) {
  if (item.type === 'folder' && item.locked && !folderUnlocked()) {
    SND.error();
    showToast('todavía falta explorar más recuerdos antes de esto 🔒');
    return;
  }
  SND.click();
  if (item.type === 'folder') {
    SND.open();
    const tracked = ['01_cine_top', '02_despues_del_docu', '03_cosas_que_me_compartiste', '04_metro', '05_sketchbook'];
    if (tracked.includes(item.name)) {
      visited.add(item.name);
      if (folderUnlocked()) unlockF06();
    }
    openFolderWindow(item);
  } 
  else if (item.type === 'illo' || item.type === 'image') { openIlloWindow(item); }
  else if (item.type === 'note-hand') { openNoteHandWindow(item); }
  else if (item.type === 'note-mono') { openNoteMonoWindow(item); }
  else if (item.type === 'audio') { openPlayerWindow(item, 'audio'); }
  else if (item.type === 'video') { openPlayerWindow(item, 'video'); }
  else if (item.type === 'exe') { openExeDialog(item); }
  else if (item.special) { openSpecialWindow(item); }
}

function unlockF06() {
  const el = document.querySelector(`.icon[data-id="${F06.id}"]`);
  if (el && el.classList.contains('locked')) {
    el.classList.remove('locked');
    el.querySelector('.glyph').innerHTML = glyphHTML(F06) + '<span class="badge">✨</span>';
    SND.success();
    showToast('✨ has desbloqueado 06_nosotras');
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; 
  t.classList.add('show');
  clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove('show'), 2600);
}

function nextPos() {
  cascade = (cascade + 1) % 7;
  return { x: 80 + cascade * 26, y: 40 + cascade * 22 };
}

function createWindow({ id, title, icon, width, height, bodyHTML, path, statusText, onMount }) {
  if (openWindows[id]) {
    const w = openWindows[id];
    if (w.minimized) { 
      w.el.style.display = 'flex'; 
      w.minimized = false; 
    }
    bringToFront(id);
    return w;
  }
  const pos = nextPos();
  const win = document.createElement('div');
  win.className = 'window';
  win.style.width = (width || 320) + 'px';
  win.style.left = pos.x + 'px';
  win.style.top = pos.y + 'px';
  win.style.zIndex = ++zTop;
  if (height) win.style.height = height + 'px';
  
  win.innerHTML = `
    <div class="titlebar">
      <span class="ticon">${icon || '🗂️'}</span>
      <span class="ttext">${title}</span>
      <div class="titlebar-btns">
        <div class="titlebar-btn tb-min">_</div>
        <div class="titlebar-btn tb-close">x</div>
      </div>
    </div>
    ${path ? `<div class="pathbar">📁 <div class="pbox">${path}</div></div>` : ''}
    <div class="window-body">${bodyHTML}</div>
    ${statusText ? `<div class="statusbar"><span>${statusText}</span><span>WinGei 98</span></div>` : ''}
    <div class="win-resize-handle"></div>
  `;
  winLayer.appendChild(win);
  makeDraggable(win);
  makeResizable(win, win.querySelector('.win-resize-handle'));
  
  win.addEventListener('mousedown', () => bringToFront(id));
  win.querySelector('.tb-close').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    closeWindow(id); 
  });
  win.querySelector('.tb-min').addEventListener('click', (e) => { 
    e.stopPropagation(); 
    minimizeWindow(id); 
  });
  
  openWindows[id] = { el: win, title, icon, minimized: false };
  addTaskbarBtn(id, title, icon);
  bringToFront(id);
  if (onMount) onMount(win);
  return openWindows[id];
}

let activeWinId = null;
function bringToFront(id) {
  const w = openWindows[id]; 
  if (!w) return;
  w.el.style.zIndex = ++zTop;
  document.querySelectorAll('.window').forEach(el => el.classList.add('inactive'));
  w.el.classList.remove('inactive');
  document.querySelectorAll('.taskbar-app').forEach(b => b.classList.toggle('active', b.dataset.id === id));
  activeWinId = id;
}

function closeWindow(id) {
  const w = openWindows[id]; 
  if (!w) return;
  SND.close();
  w.el.remove();
  const btn = document.querySelector(`.taskbar-app[data-id="${id}"]`);
  if (btn) btn.remove();
  delete openWindows[id];
  if (activeWinId === id) activeWinId = null;
}

function minimizeWindow(id) {
  const w = openWindows[id]; 
  if (!w) return;
  w.el.style.display = 'none'; 
  w.minimized = true;
  const btn = document.querySelector(`.taskbar-app[data-id="${id}"]`);
  if (btn) btn.classList.remove('active');
  if (activeWinId === id) activeWinId = null;
}

function restoreWindow(id) {
  const w = openWindows[id]; 
  if (!w) return;
  if (w.minimized) { 
    w.el.style.display = 'flex'; 
    w.minimized = false; 
    bringToFront(id); 
  } else if (activeWinId === id) { 
    minimizeWindow(id); 
  } else { 
    bringToFront(id); 
  }
}

function addTaskbarBtn(id, title, icon) {
  const btn = document.createElement('div');
  btn.className = 'taskbar-app pixel-btn'; 
  btn.dataset.id = id;
  btn.innerHTML = `<span>${icon || '🗂️'}</span><span>${title}</span>`;
  btn.addEventListener('click', () => { SND.click(); restoreWindow(id); });
  taskbarApps.appendChild(btn);
}

function makeDraggable(win) {
  const bar = win.querySelector('.titlebar');
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.titlebar-btn')) return;
    dragging = true; 
    win.classList.add('dragging');
    sx = e.clientX; 
    sy = e.clientY;
    ox = win.offsetLeft; 
    oy = win.offsetTop;
    bar.setPointerCapture(e.pointerId);
  });
  
  bar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    let nx = ox + (e.clientX - sx), ny = oy + (e.clientY - sy);
    nx = Math.max(-60, Math.min(window.innerWidth - 120, nx));
    ny = Math.max(0, Math.min(window.innerHeight - 70, ny));
    win.style.left = nx + 'px'; 
    win.style.top = ny + 'px';
  });
  
  bar.addEventListener('pointerup', () => { dragging = false; win.classList.remove('dragging'); });
  bar.addEventListener('pointercancel', () => { dragging = false; win.classList.remove('dragging'); });
}

function makeResizable(win, handle) {
  let resizing = false, sx = 0, sy = 0, sw = 0, sh = 0;
  
  handle.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    resizing = true;
    sx = e.clientX;
    sy = e.clientY;
    sw = win.offsetWidth;
    sh = win.offsetHeight;
    handle.setPointerCapture(e.pointerId);
  });
  
  handle.addEventListener('pointermove', (e) => {
    if (!resizing) return;
    let nw = sw + (e.clientX - sx), nh = sh + (e.clientY - sy);
    nw = Math.max(260, Math.min(window.innerWidth - win.offsetLeft, nw));
    nh = Math.max(120, Math.min(window.innerHeight - win.offsetTop - 34, nh));
    win.style.width = nw + 'px';
    win.style.height = nh + 'px';
  });
  
  handle.addEventListener('pointerup', () => { resizing = false; });
  handle.addEventListener('pointercancel', () => { resizing = false; });
}

/* ================= 4. CONSTRUCTORES DE CONTENIDO DE VENTANA ================= */
function pathFor(item) {
  if (item === F_4MESES) return '4_meses';
  for (const sub of [F01, F02, F03, F04, F05, F06]) {
    if (sub === item) return '4_meses\\' + sub.name;
    if (sub.children && sub.children.includes(item)) return '4_meses\\' + sub.name + '\\' + item.name;
  }
  return item.name;
}

function openFolderWindow(item) {
  const grid = document.createElement('div');
  grid.className = 'icon-grid';
  const win = createWindow({
    id: item.id, 
    title: item.name, 
    icon: item === F_4MESES ? '📁' : (item.locked ? '💗' : '📁'),
    width: item === F_4MESES ? 430 : 380, 
    height: item === F_4MESES ? 300 : 280,
    bodyHTML: '', 
    path: pathFor(item),
    statusText: `${item.children.length} objeto(s)`
  });
  const body = win.el.querySelector('.window-body');
  body.appendChild(grid);
  item.children.forEach(child => grid.appendChild(makeIconEl(child)));
}

function noteWrap(text) {
  return text.split('\n').map(l => l === '' ? '<br>' : escapeHTML(l)).join('<br>');
}
function escapeHTML(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function openNoteHandWindow(item) {
  const isFinal = item.special === 'final';
  createWindow({
    id: item.id, 
    title: item.name, 
    icon: '📝',
    width: isFinal ? 440 : 380,
    bodyHTML: `<div class="note-hand" style="${isFinal ? 'font-size:23px;' : ''}">
      <span class="sticker" style="top:6px;right:10px;">${isFinal ? '💌' : '🩷'}</span>
      ${noteWrap(item.text)}
    </div>`,
    statusText: 'bloc de notas'
  });
}

function openNoteMonoWindow(item) {
  createWindow({
    id: item.id, 
    title: item.name, 
    icon: '📄', 
    width: 300,
    bodyHTML: `<div class="note-mono">${escapeHTML(item.text)}</div>`,
    statusText: 'solo lectura'
  });
}

function openIlloWindow(item) {
  let contentHTML = '';
  // Soporte para imágenes subidas por el usuario
  if (item.type === 'image' || item.src) {
    contentHTML = `<div class="illo-wrap">
      <img src="${item.src}" style="max-width:100%;height:auto;border:1px solid var(--ink);box-shadow:inset 1px 1px 0 #fff;background:#fff;" />
      <div class="illo-caption">${item.caption || ''}</div>
    </div>`;
  } else {
    contentHTML = `<div class="illo-wrap">
      ${ILLO[item.illo]}
      <div class="illo-caption">${item.caption || ''}</div>
    </div>`;
  }
  
  createWindow({
    id: item.id, 
    title: item.name, 
    icon: '🖼️', 
    width: 340,
    bodyHTML: contentHTML,
    statusText: 'visor de imágenes'
  });
}

function openPlayerWindow(item, kind) {
  const bars = Array.from({ length: 14 }, () => Math.round(6 + Math.random() * 26));
  
  let playerBody = '';
  // Soporte para vídeo subido por el usuario
  if (kind === 'video' && item.src) {
    playerBody = `<div class="player">
      <div class="player-title">${item.title}</div>
      <video src="${item.src}" controls style="max-width:100%;height:auto;border:1.5px solid var(--ink);background:#000;"></video>
      <div class="player-caption">${item.caption || ''}</div>
    </div>`;
  } else {
    playerBody = `<div class="player">
      <div class="player-title">${item.title}</div>
      ${item.artist ? `<div class="player-artist">${item.artist}</div>` : ''}
      <div class="play-btn" id="play-${item.id}">▶</div>
      <div class="waveform">${bars.map(h => `<span style="height:${h}px"></span>`).join('')}</div>
      <div class="player-caption">${item.caption || ''}</div>
    </div>`;
  }

  createWindow({
    id: item.id, 
    title: item.name, 
    icon: kind === 'audio' ? '🎵' : '🖤', 
    width: 300,
    bodyHTML: playerBody,
    statusText: kind === 'audio' ? 'reproductor de medios' : 'visor de video',
    onMount: (win) => {
      const playBtn = win.querySelector('#play-' + item.id);
      if (!playBtn) return; // El vídeo usa controles nativos
      
      // Soporte para audio subido por el usuario
      if (item.src) {
        const audio = new Audio(item.src);
        let playing = false;
        
        playBtn.addEventListener('click', () => {
          SND.click();
          if (playing) {
            audio.pause();
            playBtn.textContent = '▶';
            playing = false;
          } else {
            audio.play().catch(e => {
              console.error("Error al reproducir audio:", e);
              SND.error();
              showToast("no se pudo reproducir el audio 😭");
            });
            playBtn.textContent = '⏸';
            playing = true;
          }
        });
        
        // Detener sonido cuando cierran la ventana
        win.querySelector('.tb-close').addEventListener('click', () => {
          audio.pause();
        });
      } else {
        // Caso demo de audio sin archivo vinculado
        playBtn.addEventListener('click', () => {
          SND.error();
          showToast(kind === 'audio' ? 'no se puede reproducir aquí 🙃' : 'formato no compatible 😭');
        });
      }
    }
  });
}

let dlgCount = 0;
function openDialog({ title, icon, text, buttons }) {
  const id = 'dlg' + (++dlgCount);
  const win = createWindow({
    id, 
    title, 
    icon: icon || '⚠️', 
    width: 300,
    bodyHTML: `<div class="dialog-body"><div class="dialog-icon">${icon || '⚠️'}</div><div class="dialog-text">${text}</div></div>
      <div class="dialog-btns">${buttons.map((b, i) => `<button class="pixel-btn dlg-btn" data-i="${i}">${b.label}</button>`).join('')}</div>`,
  });
  
  win.el.querySelectorAll('.dlg-btn').forEach((b, i) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(id);
      if (buttons[i].onClick) buttons[i].onClick();
    });
  });
  return id;
}

function openExeDialog(item) {
  openDialog({
    title: 'top_brainrot.exe', 
    icon: '⚠️',
    text: 'este archivo contiene niveles críticos de brainrot.<br>¿deseas continuar?',
    buttons: [
      { 
        label: 'Sí', 
        onClick: () => {
          SND.success();
          openNoteMonoWindow({ 
            id: 'ranking-oficial', 
            name: 'ranking_oficial.txt', 
            text: 'ranking oficial de brainrot (clasificado):\n\n1. [redactado]\n2. [redactado]\n3. el asado pendiente (técnicamente no es brainrot pero igual entra)\n\ngracias por tu cooperación.' 
          });
        } 
      },
      { label: 'No', onClick: () => { showToast('decisión sabia.'); } }
    ]
  });
}

function openSpecialWindow(item) {
  if (item.special === 'mypc') {
    createWindow({ 
      id: 'mypc', 
      title: 'Propiedades del sistema', 
      icon: '🖥️', 
      width: 300,
      bodyHTML: `<div class="note-mono">Sistema: Windows Geiversario 98
Procesador: Corazón Dual Core, 4.0 MHz
Memoria RAM: 4 meses (en uso: 100%)
Disco C:: 99% lleno de recuerdos sin organizar
Edición: especial — amistad</div>` 
    });
  } 
  else if (item.special === 'trash') {
    createWindow({ 
      id: 'trash', 
      title: 'Papelera de reciclaje', 
      icon: '🗑️', 
      width: 280,
      bodyHTML: `<div class="note-mono">no hay nada aquí.
todo lo importante se quedó guardado.</div>` 
    });
  }
  else if (item.special === 'ytplayer') {
    openYtPlayerWindow(item);
  }
}

function openYtPlayerWindow(item) {
  createWindow({
    id: item.id,
    title: 'CD Player (Música)',
    icon: '🎵',
    width: 320,
    height: 165,
    bodyHTML: `<div class="player" style="gap:6px;padding:6px 10px;">
      <div class="player-title" style="font-size:12px;align-self:flex-start;font-weight:bold;">CD Player</div>
      <div class="player-artist" style="font-size:11px;align-self:flex-start;color:var(--shadow);margin-bottom:2px;">Música de Fondo</div>
      
      <div style="background:#000;color:#00ff00;font-family:monospace;padding:6px 10px;width:100%;box-sizing:border-box;border:2px solid var(--shadow);display:flex;justify-content:space-between;align-items:center;font-size:13px;border-radius:2px;box-shadow:inset 1px 1px 0 rgba(0,0,0,.5);">
        <div>[TRACK 01]</div>
        <div id="cd-status">PLAYING</div>
      </div>
      
      <div style="display:flex;gap:6px;margin-top:4px;width:100%;">
        <button class="pixel-btn" id="yt-play" style="flex:1;font-weight:bold;height:24px;">Play ▶</button>
        <button class="pixel-btn" id="yt-pause" style="flex:1;font-weight:bold;height:24px;">Pause ⏸</button>
        <button class="pixel-btn" id="yt-stop" style="flex:1;font-weight:bold;height:24px;">Stop ■</button>
      </div>
    </div>`,
    statusText: 'reproductor de cd',
    onMount: (win) => {
      const audio = window.bgAudioPlayer;
      const iframe = document.getElementById('bg-player-iframe');
      const statusText = win.querySelector('#cd-status');
      
      if (statusText) {
        statusText.textContent = window.bgPlayerStarted ? 'PLAYING' : 'READY';
      }

      win.querySelector('#yt-play').addEventListener('click', () => {
        SND.click();
        if (audio) {
          audio.play().catch(e => console.error("Error reproduciendo audio:", e));
          window.bgPlayerStarted = true;
          if (statusText) statusText.textContent = 'PLAYING';
        } else if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          window.bgPlayerStarted = true;
          if (statusText) statusText.textContent = 'PLAYING';
        }
      });
      win.querySelector('#yt-pause').addEventListener('click', () => {
        SND.click();
        if (audio) {
          audio.pause();
          if (statusText) statusText.textContent = 'PAUSED';
        } else if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          if (statusText) statusText.textContent = 'PAUSED';
        }
      });
      win.querySelector('#yt-stop').addEventListener('click', () => {
        SND.click();
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          window.bgPlayerStarted = false;
          if (statusText) statusText.textContent = 'STOPPED';
        } else if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
          window.bgPlayerStarted = false;
          if (statusText) statusText.textContent = 'STOPPED';
        }
      });
    }
  });
}
