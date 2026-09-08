/* ================= ESCRITORIO E ICONOS (desktop.js) =================
   Dibuja los iconos, gestiona la seleccion, el desbloqueo de 06_nosotras
   y decide que ventana abre cada tipo de archivo.
==================================================================== */

/* Carpetas que cuentan para desbloquear 06_nosotras. */
const TRACKED_FOLDERS = ['01_cine_top', '02_despues', '03_cosas_que_me_compartiste', '04_metro', '05_sketchbook'];
const UNLOCK_THRESHOLD = 5;

const visited = new Set();
const folderUnlocked = () => visited.size >= UNLOCK_THRESHOLD;

/* ---------- icono segun el tipo de archivo ---------- */
const GLYPHS = {
  illo: ICON_IMAGE,
  image: ICON_IMAGE,
  'note-hand': ICON_NOTE,
  'note-mono': ICON_NOTE,
  audio: ICON_AUDIO,
  video: ICON_VIDEO,
  exe: ICON_EXE
};
const SPECIAL_GLYPHS = { mypc: ICON_MYPC, trash: ICON_TRASH, ytplayer: ICON_AUDIO };

function glyphHTML(item) {
  if (item.type === 'folder') {
    if (item.locked) return folderUnlocked() ? ICON_FOLDER_LILAC : ICON_FOLDER_FADE;
    return ICON_FOLDER;
  }
  if (item.special && SPECIAL_GLYPHS[item.special]) return SPECIAL_GLYPHS[item.special];
  return GLYPHS[item.type] || `<span>${item.emoji || '📄'}</span>`;
}

/* ---------- construccion del icono ---------- */
function makeIconEl(item) {
  const el = document.createElement('div');
  el.className = 'icon' + (item.locked && !folderUnlocked() ? ' locked' : '');
  el.dataset.id = item.id;
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.innerHTML = `
    <div class="glyph">
      ${glyphHTML(item)}
      ${item.locked ? `<span class="badge">${folderUnlocked() ? '✨' : '🔒'}</span>` : ''}
    </div>
    <div class="label">${escapeHTML(item.name)}</div>`;

  const select = () => {
    document.querySelectorAll('.icon.selected').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
  };

  let lastTap = 0;
  el.addEventListener('pointerup', e => {
    e.stopPropagation();
    select();
    // Con el dedo un toque abre; con raton se mantiene el doble clic de Windows.
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      openItem(item);
      return;
    }
    const now = Date.now();
    if (now - lastTap < 450) { lastTap = 0; openItem(item); }
    else { lastTap = now; }
  });

  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    select();
    openItem(item);
  });

  return el;
}

function renderDesktop() {
  const container = document.getElementById('desktop-icons');
  if (!container) return;
  container.innerHTML = '';
  DESKTOP_ITEMS.forEach(item => container.appendChild(makeIconEl(item)));
}

/* ---------- desbloqueo ---------- */
function unlockF06() {
  document.querySelectorAll(`.icon[data-id="${F06.id}"]`).forEach(el => {
    if (!el.classList.contains('locked')) return;
    el.classList.remove('locked');
    el.querySelector('.glyph').innerHTML = glyphHTML(F06) + '<span class="badge">✨</span>';
  });
  SND.success();
  showToast('✨ has desbloqueado 06_nosotras');
}

function trackVisit(item) {
  if (!TRACKED_FOLDERS.includes(item.name) || visited.has(item.name)) return;
  const wasLocked = !folderUnlocked();
  visited.add(item.name);
  if (wasLocked && folderUnlocked()) unlockF06();
}

/* ---------- enrutado: que ventana abre cada item ---------- */
const OPENERS = {
  folder: item => { SND.open(); trackVisit(item); openFolderWindow(item); },
  illo: openIlloWindow,
  image: openIlloWindow,
  'note-hand': openNoteHandWindow,
  'note-mono': openNoteMonoWindow,
  audio: openAudioWindow,
  video: openVideoWindow,
  exe: openExeDialog,
  special: openSpecialWindow
};

function openItem(item) {
  if (item.type === 'folder' && item.locked && !folderUnlocked()) {
    SND.error();
    showToast('todavía falta explorar más recuerdos antes de esto 🔒');
    return;
  }
  SND.click();
  const open = OPENERS[item.type] || (item.special ? openSpecialWindow : null);
  if (open) open(item);
}

/* Clic fuera de cualquier icono: deseleccionar. */
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.icon')) {
    document.querySelectorAll('.icon.selected').forEach(i => i.classList.remove('selected'));
  }
});
