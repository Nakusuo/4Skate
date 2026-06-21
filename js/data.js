/* ================= RETRO SYSTEM DATABASE (data.js) ================= */
// Este archivo contiene los recursos visuales SVG de Windows 95 y la estructura de archivos/recuerdos.

/* 
=============================================================================
✍️ CÓMO MODIFICAR TUS TEXTOS Y AGREGAR TU PROPIO CONTENIDO (Fotos, Audio, Vídeo):
=============================================================================

1. MODIFICAR TEXTOS (.txt / notas manuscritas):
   - Busca los bloques de texto dentro de la estructura de carpetas (F01, F02, etc.) abajo.
   - Modifica el atributo `text: 'Tu texto aquí...'`.
   - Puedes usar '\n' para dar saltos de línea (ej: 'Hola\nmundo').

2. AGREGAR TUS PROPIAS FOTOS (PNG, JPG, WEBP):
   - Guarda tu foto en tu proyecto (por ejemplo, crea una carpeta "fotos" y coloca "recuerdo.jpg" allí).
   - En la estructura de carpetas de abajo, busca o crea un objeto de tipo 'image'.
   - Agrégale la propiedad `src` con la ruta de tu foto y opcionalmente un `caption`.
   - Ejemplo de código a usar:
        it({
          name: 'nuestra_foto.jpg', 
          type: 'image', 
          emoji: '🖼️', 
          src: 'fotos/recuerdo.jpg', 
          caption: 'Foto tomada esa tarde maravillosa.'
        })

3. AGREGAR TU PROPIO AUDIO / MÚSICA (MP3, WAV):
   - Guarda tu canción en el proyecto (ej: "musica/favorita.mp3").
   - Busca un objeto de tipo 'audio' abajo y agrégale la propiedad `src` con la ruta del archivo.
   - El reproductor de música de la ventana cargará el audio real y se reproducirá al hacer clic en (▶).
   - Ejemplo de código a usar:
        it({
          name: 'cancion.mp3', 
          type: 'audio', 
          emoji: '🎵', 
          title: 'cancion.mp3', 
          artist: 'Twenty One Pilots', 
          src: 'musica/favorita.mp3', 
          caption: 'Esta canción nos encanta.'
        })

4. AGREGAR TU PROPIO VÍDEO (MP4, WEBM):
   - Guarda tu vídeo en el proyecto (ej: "videos/tarde_cine.mp4").
   - Busca un objeto de tipo 'video' abajo y agrégale la propiedad `src` con la ruta de tu vídeo.
   - La ventana de vídeo cargará un reproductor de HTML5 real con controles de reproducción.
   - Ejemplo de código a usar:
        it({
          name: 'video_cine.mp4', 
          type: 'video', 
          emoji: '🖤', 
          title: 'video_cine.mp4', 
          src: 'videos/tarde_cine.mp4', 
          caption: 'Grabación de la salida.'
        })
=============================================================================
*/

const BG_MUSIC_SRC = 'musica/Tv girl.mp3';

/* ================= 1. ICONOS PIXEL-ART (SVG) ================= */
function pix(rows, map, cell = 1) {
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0), h = rows.length;
  let s = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '.' && map[ch]) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="${map[ch]}"/>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

const PAL = { K: '#4A3550', P: '#F49AC1', W: '#FFF8F2', L: '#D9C2EC' };
const PAL_LILAC = { K: '#4A3550', P: '#C9A6E8', W: '#FFF8F2', L: '#D9C2EC' };
const PAL_FADE = { K: '#9b8a9e', P: '#e7d7e2', W: '#FFF8F2', L: '#e3d7ec' };

const HEART_ROWS = ['.KK..KK.', 'KPPKKPPK', 'KPPPPPPK', 'KPPPPPPK', '.KPPPPK.', '..KPPK..', '...KK...'];
const STAR_ROWS = ['..K..', '..P..', 'KPPPK', '..P..', '..K..'];

const ICON_HEART = pix(HEART_ROWS, PAL);
const ICON_HEART_LILAC = pix(HEART_ROWS, PAL_LILAC);
const ICON_STAR = pix(STAR_ROWS, PAL);

// Iconos estilo Windows 95 nítidos
const ICON_FOLDER = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="10" height="4" fill="#000000"/>
  <rect x="4" y="6" width="8" height="3" fill="#d8a050"/>
  <rect x="2" y="9" width="28" height="18" fill="#000000"/>
  <rect x="3" y="10" width="26" height="16" fill="#ffd860"/>
  <rect x="3" y="10" width="26" height="1" fill="#ffffff"/>
  <rect x="3" y="10" width="1" height="16" fill="#ffffff"/>
  <rect x="4" y="25" width="25" height="1" fill="#b88030"/>
  <rect x="28" y="11" width="1" height="15" fill="#b88030"/>
</svg>
`;

const ICON_FOLDER_LILAC = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="10" height="4" fill="#000000"/>
  <rect x="4" y="6" width="8" height="3" fill="#B79AD6"/>
  <rect x="2" y="9" width="28" height="18" fill="#000000"/>
  <rect x="3" y="10" width="26" height="16" fill="#D9C2EC"/>
  <rect x="3" y="10" width="26" height="1" fill="#ffffff"/>
  <rect x="3" y="10" width="1" height="16" fill="#ffffff"/>
  <rect x="4" y="25" width="25" height="1" fill="#B79AD6"/>
  <rect x="28" y="11" width="1" height="15" fill="#B79AD6"/>
</svg>
`;

const ICON_FOLDER_FADE = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="10" height="4" fill="#808080"/>
  <rect x="4" y="6" width="8" height="3" fill="#c0c0c0"/>
  <rect x="2" y="9" width="28" height="18" fill="#808080"/>
  <rect x="3" y="10" width="26" height="16" fill="#e0e0e0"/>
  <rect x="3" y="10" width="26" height="1" fill="#ffffff"/>
  <rect x="3" y="10" width="1" height="16" fill="#ffffff"/>
  <rect x="4" y="25" width="25" height="1" fill="#b0b0b0"/>
  <rect x="28" y="11" width="1" height="15" fill="#b0b0b0"/>
</svg>
`;

const ICON_MYPC = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="20" height="15" fill="#c0c0c0" stroke="#000000" stroke-width="1"/>
  <rect x="5" y="5" width="16" height="11" fill="#000000"/>
  <rect x="6" y="6" width="14" height="9" fill="#a0d0f0"/>
  <rect x="6" y="6" width="14" height="2" fill="#000080"/>
  <line x1="4" y1="4" x2="22" y2="4" stroke="#ffffff"/>
  <line x1="4" y1="4" x2="4" y2="17" stroke="#ffffff"/>
  <line x1="22" y1="5" x2="22" y2="17" stroke="#808080"/>
  <line x1="4" y1="17" x2="22" y2="17" stroke="#808080"/>
  <path d="M10,18 h6 l2,4 h-10 z" fill="#c0c0c0" stroke="#000000"/>
  <line x1="11" y1="19" x2="15" y2="19" stroke="#ffffff"/>
  <rect x="7" y="22" width="12" height="3" fill="#c0c0c0" stroke="#000000"/>
  <line x1="8" y1="23" x2="18" y2="23" stroke="#ffffff"/>
  <rect x="21" y="8" width="8" height="17" fill="#c0c0c0" stroke="#000000"/>
  <line x1="22" y1="9" x2="28" y2="9" stroke="#ffffff"/>
  <line x1="22" y1="9" x2="22" y2="24" stroke="#ffffff"/>
  <rect x="23" y="11" width="4" height="2" fill="#808080"/>
  <rect x="23" y="15" width="2" height="2" fill="#00ff00"/>
  <rect x="26" y="15" width="2" height="2" fill="#ff0000"/>
  <rect x="25" y="27" width="4" height="2" fill="#c0c0c0" stroke="#000000"/>
  <line x1="21" y1="28" x2="25" y2="28" stroke="#000000"/>
</svg>
`;

const ICON_TRASH = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="16" cy="7" rx="9" ry="3" fill="#c0c0c0" stroke="#000000"/>
  <ellipse cx="16" cy="7" rx="7" ry="1.8" fill="#808080"/>
  <path d="M12,4 L15,1 L17,4 Z" fill="#ffffff" stroke="#000000"/>
  <path d="M16,5 L19,2 L21,5 Z" fill="#ffffff" stroke="#000000"/>
  <path d="M7,7 L10,26 Q11,29 16,29 Q21,29 22,26 L25,7" fill="none" stroke="#000000" stroke-width="1"/>
  <path d="M8,7 L11,25 C12,27 20,27 21,25 L24,7" fill="#c0c0c0"/>
  <line x1="11" y1="7" x2="13" y2="25" stroke="#808080"/>
  <line x1="14" y1="7" x2="15" y2="26" stroke="#808080"/>
  <line x1="16" y1="7" x2="16" y2="26" stroke="#000000"/>
  <line x1="18" y1="7" x2="17" y2="26" stroke="#ffffff"/>
  <line x1="21" y1="7" x2="19" y2="25" stroke="#ffffff"/>
  <path d="M8,7 L11,25" stroke="#ffffff" stroke-width="1"/>
  <path d="M24,7 L21,25" stroke="#808080" stroke-width="1"/>
</svg>
`;

const ICON_NOTE = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <polygon points="6,2 20,2 26,8 26,29 6,29" fill="#ffffff" stroke="#000000"/>
  <polygon points="20,2 20,8 26,8" fill="#c0c0c0" stroke="#000000"/>
  <line x1="10" y1="3" x2="10" y2="28" stroke="#ff8080"/>
  <line x1="12" y1="12" x2="22" y2="12" stroke="#a0c0e0"/>
  <line x1="12" y1="16" x2="24" y2="16" stroke="#a0c0e0"/>
  <line x1="12" y1="20" x2="20" y2="20" stroke="#a0c0e0"/>
  <line x1="12" y1="24" x2="24" y2="24" stroke="#a0c0e0"/>
</svg>
`;

const ICON_AUDIO = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="12" fill="#c0c0c0" stroke="#000000" stroke-width="1.2"/>
  <circle cx="16" cy="16" r="8" fill="#e8e8e8"/>
  <circle cx="16" cy="16" r="3" fill="#ffffff" stroke="#000000"/>
  <path d="M12,8 L10,12" stroke="#B79AD6" stroke-width="2"/>
  <path d="M20,24 L22,20" stroke="#F49AC1" stroke-width="2"/>
  <circle cx="12" cy="20" r="3" fill="#000000"/>
  <rect x="14" y="9" width="2" height="12" fill="#000000"/>
  <rect x="14" y="9" width="6" height="3" fill="#000000"/>
</svg>
`;

const ICON_VIDEO = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="4" width="22" height="24" fill="#4A3550" stroke="#000000" stroke-width="1.5"/>
  <rect x="7" y="6" width="3" height="3" fill="#ffffff"/>
  <rect x="7" y="12" width="3" height="3" fill="#ffffff"/>
  <rect x="7" y="18" width="3" height="3" fill="#ffffff"/>
  <rect x="7" y="24" width="3" height="3" fill="#ffffff"/>
  <rect x="22" y="6" width="3" height="3" fill="#ffffff"/>
  <rect x="22" y="12" width="3" height="3" fill="#ffffff"/>
  <rect x="22" y="18" width="3" height="3" fill="#ffffff"/>
  <rect x="22" y="24" width="3" height="3" fill="#ffffff"/>
  <rect x="11" y="8" width="10" height="16" fill="#FFF8F2"/>
  <polygon points="14,11 14,21 19,16" fill="#F49AC1"/>
</svg>
`;

const ICON_IMAGE = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <path d="M8,8 Q4,12 5,18 Q6,26 16,26 Q24,26 26,18 Q28,10 18,8 Q13,7 8,8 Z" fill="#ffd890" stroke="#000000" stroke-width="1.2"/>
  <ellipse cx="12" cy="14" rx="2.2" ry="1.4" fill="#FFF8F2" stroke="#000000"/>
  <circle cx="9" cy="20" r="2" fill="#ff0000"/>
  <circle cx="15" cy="22" r="2" fill="#0000ff"/>
  <circle cx="21" cy="21" r="2" fill="#00ff00"/>
  <circle cx="22" cy="15" r="2" fill="#ffff00"/>
  <line x1="26" y1="6" x2="16" y2="16" stroke="#804000" stroke-width="2" stroke-linecap="round"/>
  <polygon points="17,15 15,17 14,19" fill="#c0c0c0" stroke="#000000"/>
  <polygon points="15,17 13,19 12,20" fill="#000000"/>
</svg>
`;

const ICON_EXE = `
<svg viewBox="0 0 32 32" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000000" stroke-width="1"/>
  <rect x="5" y="5" width="22" height="4" fill="#000080"/>
  <rect x="24" y="6" width="2" height="2" fill="#ffffff"/>
  <line x1="5" y1="9" x2="27" y2="9" stroke="#808080"/>
  <line x1="5" y1="5" x2="27" y2="5" stroke="#ffffff"/>
  <line x1="5" y1="5" x2="5" y2="27" stroke="#ffffff"/>
  <circle cx="16" cy="18" r="4" fill="#808080" stroke="#000000"/>
  <circle cx="16" cy="18" r="1.5" fill="#c0c0c0"/>
  <rect x="15" y="12" width="2" height="3" fill="#808080"/>
  <rect x="15" y="21" width="2" height="3" fill="#808080"/>
  <rect x="10" y="17" width="3" height="2" fill="#808080"/>
  <rect x="19" y="17" width="3" height="2" fill="#808080"/>
</svg>
`;

/* ================= 2. DIBUJOS / ILUSTRACIONES (ILLO) ================= */
function svgWrap(vb, inner) { return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;">${inner}</svg>`; }
function pixStarSmall(x, y) { return `<g transform="translate(${x},${y})"><path d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z" fill="#F49AC1" stroke="#4A3550" stroke-width="0.6"/></g>`; }
function pixHeartSmall(x, y) { return `<g transform="translate(${x},${y})"><path d="M6 11 C-2 4 1 -2 6 2 C11 -2 14 4 6 11 Z" fill="#F49AC1" stroke="#4A3550" stroke-width="1"/></g>`; }

const ILLO = {};

// Dibujo: Cine
ILLO.cine = svgWrap('0 0 320 210', `
<rect x="0" y="0" width="320" height="210" fill="#FFF8F2"/>
<rect x="30" y="40" width="260" height="140" fill="#F3D9E6" stroke="#4A3550" stroke-width="3"/>
<rect x="50" y="20" width="220" height="34" fill="#C9A6E8" stroke="#4A3550" stroke-width="3"/>
<text x="160" y="43" text-anchor="middle" font-family="Caveat,cursive" font-size="24" fill="#4A3550" font-weight="bold">CINE</text>
${[60, 90, 120, 150, 180, 210, 240].map(x => `<circle cx="${x}" cy="20" r="3" fill="#F49AC1"/>`).join('')}
${[60, 90, 120, 150, 180, 210, 240].map(x => `<circle cx="${x}" cy="54" r="3" fill="#F49AC1"/>`).join('')}
<rect x="135" y="120" width="50" height="60" fill="#fff" stroke="#4A3550" stroke-width="3"/>
<line x1="160" y1="120" x2="160" y2="180" stroke="#4A3550" stroke-width="2"/>
<circle cx="178" cy="150" r="2.4" fill="#4A3550"/>
<rect x="60" y="70" width="48" height="64" fill="#fff" stroke="#4A3550" stroke-width="2.5" transform="rotate(-4 84 102)"/>
<text x="84" y="106" text-anchor="middle" font-family="Caveat,cursive" font-size="13" fill="#B79AD6" transform="rotate(-4 84 102)">TOP</text>
<text x="84" y="120" text-anchor="middle" font-family="Caveat,cursive" font-size="10" fill="#B79AD6" transform="rotate(-4 84 102)">more than we ever imagined</text>
${pixStarSmall(232, 82)} ${pixStarSmall(252, 150)} ${pixHeartSmall(40, 150)}
`);

// Dibujo: Entrada / Boleto
ILLO.ticket = svgWrap('0 0 320 150', `
<rect x="0" y="0" width="320" height="150" fill="#FFF8F2"/>
<rect x="20" y="20" width="280" height="110" fill="#fdf0f6" stroke="#4A3550" stroke-width="3" rx="4"/>
<circle cx="20" cy="75" r="9" fill="#FFF8F2" stroke="#4A3550" stroke-width="3"/>
<circle cx="300" cy="75" r="9" fill="#FFF8F2" stroke="#4A3550" stroke-width="3"/>
<line x1="225" y1="26" x2="225" y2="124" stroke="#B79AD6" stroke-width="2" stroke-dasharray="4 4"/>
<text x="35" y="48" font-family="Caveat,cursive" font-size="20" font-weight="bold" fill="#4A3550">ENTRADA</text>
<text x="35" y="72" font-family="Caveat,cursive" font-size="15" fill="#8C5B82">documental · twenty one pilots</text>
<text x="35" y="100" font-family="Caveat,cursive" font-size="16" fill="#4A3550">fila 4 · butaca 6</text>
<text x="35" y="118" font-family="Caveat,cursive" font-size="13" fill="#B79AD6">función: tarde, como siempre</text>
<g transform="translate(245,55) rotate(8)">${pixHeartSmall(0, 0)}</g>
<g transform="translate(270,95) rotate(-6)">${pixStarSmall(0, 0)}</g>
`);

// Dibujo: Esperando
ILLO.esperando = svgWrap('0 0 260 230', `
<rect x="0" y="0" width="260" height="230" fill="#FFF8F2"/>
<rect x="10" y="40" width="14" height="170" fill="#F3D9E6" stroke="#4A3550" stroke-width="2.5"/>
<rect x="24" y="20" width="120" height="190" fill="#fdf0f6" stroke="#4A3550" stroke-width="2.5"/>
<g transform="translate(150,90)">
  <circle cx="30" cy="22" r="20" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.5"/>
  <path d="M10 14 Q30 -8 50 14 Q52 30 46 36 L44 22 Q30 10 16 22 L14 36 Q8 30 10 14 Z" fill="#8C5B82" stroke="#4A3550" stroke-width="2"/>
  <circle cx="23" cy="23" r="1.6" fill="#4A3550"/><circle cx="37" cy="23" r="1.6" fill="#4A3550"/>
  <path d="M25 30 Q30 33 35 30" stroke="#4A3550" stroke-width="1.6" fill="none"/>
  <rect x="14" y="42" width="32" height="55" rx="6" fill="#F49AC1" stroke="#4A3550" stroke-width="2.5"/>
  <rect x="16" y="60" width="10" height="14" rx="2" fill="#fff" stroke="#4A3550" stroke-width="1.6"/>
  <line x1="10" y1="97" x2="10" y2="135" stroke="#4A3550" stroke-width="3"/>
  <line x1="50" y1="97" x2="50" y2="135" stroke="#4A3550" stroke-width="3"/>
</g>
${pixStarSmall(40, 30)} ${pixStarSmall(220, 40)} ${pixHeartSmall(205, 150)}
`);

// Dibujo: Llegando Tarde
ILLO.tarde = svgWrap('0 0 260 230', `
<rect x="0" y="0" width="260" height="230" fill="#FFF8F2"/>
<g transform="translate(60,80) rotate(-6)">
  <circle cx="30" cy="22" r="19" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.5"/>
  <path d="M10 14 Q30 -10 50 14 L46 30 Q30 6 14 30 Z" fill="#4A3550"/>
  <circle cx="24" cy="22" r="1.6" fill="#4A3550"/><circle cx="36" cy="22" r="1.6" fill="#4A3550"/>
  <ellipse cx="30" cy="30" rx="3" ry="2" fill="#4A3550"/>
  <rect x="13" y="41" width="34" height="52" rx="8" fill="#C9A6E8" stroke="#4A3550" stroke-width="2.5"/>
  <line x1="13" y1="93" x2="0" y2="125" stroke="#4A3550" stroke-width="3"/>
  <line x1="47" y1="93" x2="62" y2="118" stroke="#4A3550" stroke-width="3"/>
  <rect x="44" y="55" width="16" height="20" fill="#F49AC1" stroke="#4A3550" stroke-width="2" transform="rotate(20 52 65)"/>
</g>
<path d="M150 100 q-12 2 -22 -2 M150 112 q-14 3 -26 0 M150 124 q-12 2 -20 -3" stroke="#B79AD6" stroke-width="2" fill="none" stroke-linecap="round"/>
<text x="170" y="60" font-family="Caveat,cursive" font-size="22" fill="#8C5B82" font-weight="bold">¡tarde otra vez!</text>
${pixStarSmall(200, 100)} ${pixStarSmall(220, 160)}
`);

// Dibujo: Chat / Conversación
ILLO.chat = svgWrap('0 0 320 220', `
<rect x="0" y="0" width="320" height="220" fill="#fdf0f6"/>
<rect x="14" y="14" width="190" height="34" rx="14" fill="#fff" stroke="#4A3550" stroke-width="2"/>
<text x="28" y="36" font-family="Patrick Hand,cursive" font-size="13" fill="#4A3550">¿la peli te dejó mal o normal?</text>
<rect x="120" y="56" width="186" height="34" rx="14" fill="#F49AC1" stroke="#4A3550" stroke-width="2"/>
<text x="134" y="78" font-family="Patrick Hand,cursive" font-size="13" fill="#fff">mal. en el buen sentido</text>
<rect x="14" y="98" width="220" height="34" rx="14" fill="#fff" stroke="#4A3550" stroke-width="2"/>
<text x="28" y="120" font-family="Patrick Hand,cursive" font-size="13" fill="#4A3550">tipo llorando en el bus tipo</text>
<rect x="170" y="140" width="136" height="34" rx="14" fill="#F49AC1" stroke="#4A3550" stroke-width="2"/>
<text x="184" y="162" font-family="Patrick Hand,cursive" font-size="13" fill="#fff">tipo SÍ</text>
<rect x="14" y="182" width="240" height="30" rx="14" fill="#C9A6E8" stroke="#4A3550" stroke-width="2"/>
<text x="28" y="202" font-family="Patrick Hand,cursive" font-size="13" fill="#fff">ok creo que somos amigas ahora</text>
${pixHeartSmall(280, 190)}
`);

// Dibujo: Metro / Colectivo nocturno
ILLO.metro = svgWrap('0 0 320 200', `
<rect x="0" y="0" width="320" height="200" fill="#3a2d44"/>
${Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 37 + 13) % 320}" cy="${(i * 53 + 10) % 90}" r="${i % 3 === 0 ? 1.6 : 1}" fill="#fff" opacity="${0.4 + (i % 4) * 0.15}"/>`).join('')}
<circle cx="270" cy="35" r="16" fill="#fdf0f6" opacity="0.9"/>
<rect x="0" y="120" width="320" height="80" fill="#2c2230"/>
<rect x="10" y="100" width="40" height="40" fill="#241b2c"/>
<rect x="60" y="80" width="34" height="60" fill="#241b2c"/>
<rect x="100" y="110" width="50" height="30" fill="#241b2c"/>
<rect x="40" y="135" width="240" height="45" rx="6" fill="#F3D9E6" stroke="#fff" stroke-width="2.5"/>
${[60, 100, 140, 180, 220, 260].map(x => `<rect x="${x}" y="143" width="18" height="14" fill="#FFE9B5" stroke="#4A3550" stroke-width="1.4"/>`).join('')}
<circle cx="65" cy="182" r="9" fill="#241b2c" stroke="#fff" stroke-width="2"/>
<circle cx="255" cy="182" r="9" fill="#241b2c" stroke="#fff" stroke-width="2"/>
`);

// Dibujo: Chibis caricaturas
ILLO.chibis = svgWrap('0 0 300 190', `
<rect x="0" y="0" width="300" height="190" fill="#FFF8F2"/>
<rect x="20" y="120" width="260" height="14" fill="#C9A6E8" stroke="#4A3550" stroke-width="2"/>
<rect x="40" y="60" width="60" height="60" fill="none"/>
<g transform="translate(80,55)">
  <circle cx="30" cy="20" r="19" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.4"/>
  <path d="M10 12 Q30 -8 50 12 L48 30 Q30 6 12 30 Z" fill="#8C5B82"/>
  <circle cx="24" cy="20" r="1.6" fill="#4A3550"/><circle cx="36" cy="20" r="1.6" fill="#4A3550"/>
  <path d="M24 27 Q30 31 36 27" stroke="#4A3550" stroke-width="1.6" fill="none"/>
  <rect x="13" y="39" width="34" height="46" rx="8" fill="#F49AC1" stroke="#4A3550" stroke-width="2.4"/>
  <line x1="13" y1="85" x2="13" y2="120" stroke="#4A3550" stroke-width="3"/>
  <line x1="47" y1="85" x2="47" y2="120" stroke="#4A3550" stroke-width="3"/>
</g>
<g transform="translate(155,55)">
  <circle cx="30" cy="20" r="19" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.4"/>
  <path d="M8 16 Q30 -10 52 16 Q54 40 48 46 L46 24 Q30 8 14 24 L12 46 Q6 40 8 16 Z" fill="#4A3550"/>
  <circle cx="24" cy="21" r="1.6" fill="#4A3550"/><circle cx="36" cy="21" r="1.6" fill="#4A3550"/>
  <ellipse cx="30" cy="28" rx="4" ry="2.4" fill="#4A3550"/>
  <rect x="13" y="39" width="34" height="46" rx="8" fill="#C9A6E8" stroke="#4A3550" stroke-width="2.4"/>
  <line x1="13" y1="85" x2="13" y2="120" stroke="#4A3550" stroke-width="3"/>
  <line x1="47" y1="85" x2="47" y2="120" stroke="#4A3550" stroke-width="3"/>
</g>
${pixHeartSmall(135, 40)} ${pixStarSmall(60, 30)} ${pixStarSmall(225, 90)}
`);

// Dibujo: Sketchbook
ILLO.sketchbook = svgWrap('0 0 280 200', `
<rect x="0" y="0" width="280" height="200" fill="#FFF8F2"/>
<g transform="rotate(-3 140 100)">
  <rect x="70" y="30" width="120" height="150" fill="#fdf0f6" stroke="#4A3550" stroke-width="3"/>
  ${Array.from({ length: 10 }, (_, i) => `<circle cx="70" cy="${42 + i * 14}" r="3" fill="#fff" stroke="#4A3550" stroke-width="2"/>`).join('')}
  <g transform="translate(150,55) rotate(8)">${pixHeartSmall(0, 0)}</g>
  <path d="M90 150 q15 -10 30 0" stroke="#B79AD6" stroke-width="2" fill="none" stroke-linecap="round"/>
</g>
<g transform="translate(195,140) rotate(35)">
  <rect x="0" y="0" width="8" height="55" fill="#F8E3A0" stroke="#4A3550" stroke-width="2"/>
  <polygon points="0,55 8,55 4,68" fill="#4A3550"/>
</g>
${pixStarSmall(40, 40)} ${pixStarSmall(225, 50)} ${pixStarSmall(50, 160)}
`);

// Dibujo: Tweet
ILLO.tweet = svgWrap('0 0 300 140', `
<rect x="0" y="0" width="300" height="140" fill="#fff" stroke="#4A3550" stroke-width="2.5"/>
<circle cx="35" cy="34" r="16" fill="#C9A6E8" stroke="#4A3550" stroke-width="2"/>
<text x="60" y="30" font-family="Tahoma" font-size="12" font-weight="bold" fill="#4A3550">glenn_anon</text>
<text x="60" y="44" font-family="Tahoma" font-size="10" fill="#B79AD6">@no_dire_nombres</text>
<text x="20" y="75" font-family="Patrick Hand,cursive" font-size="15" fill="#4A3550">no diré nombres pero alguien</text>
<text x="20" y="95" font-family="Patrick Hand,cursive" font-size="15" fill="#4A3550">todavía me debe un asado 🙃</text>
<text x="20" y="120" font-family="Tahoma" font-size="10" fill="#B79AD6">3:14 a.m. · vía compu vieja</text>
`);

// Dibujo: Collage final
ILLO.collage = svgWrap('0 0 320 230', `
<rect x="0" y="0" width="320" height="230" fill="#fdf0f6"/>
<g transform="translate(20,20) rotate(-6) scale(0.55)">${ticketInner()}</g>
<g transform="translate(190,15) rotate(5) scale(0.62)">${sketchInner()}</g>
<g transform="translate(20,120) rotate(3) scale(0.62)">${metroInner()}</g>
<g transform="translate(195,120) rotate(-4)">${chibisMiniInner()}</g>
<rect x="120" y="8" width="50" height="16" fill="rgba(201,166,232,.55)" transform="rotate(-8 145 16)"/>
<rect x="8" y="95" width="50" height="16" fill="rgba(244,154,193,.55)" transform="rotate(5 33 103)"/>
<rect x="250" y="95" width="50" height="16" fill="rgba(244,154,193,.55)" transform="rotate(-5 275 103)"/>
${pixHeartSmall(150, 200)} ${pixStarSmall(10, 200)} ${pixStarSmall(290, 205)} ${pixHeartSmall(290, 30)}
`);
function ticketInner() { return `<rect width="280" height="110" fill="#fdf0f6" stroke="#4A3550" stroke-width="4"/><text x="20" y="45" font-family="Caveat,cursive" font-size="26" fill="#4A3550">ENTRADA</text><text x="20" y="75" font-family="Caveat,cursive" font-size="16" fill="#8C5B82">cine · TØP</text>`; }
function sketchInner() { return `<rect width="100" height="130" fill="#fdf0f6" stroke="#4A3550" stroke-width="3"/>${pixHeartSmall(70, 20)}`; }
function metroInner() { return `<rect width="160" height="80" fill="#2c2230"/><rect x="20" y="40" width="120" height="30" rx="6" fill="#F3D9E6" stroke="#fff" stroke-width="2"/>`; }
function chibisMiniInner() { return `<circle cx="20" cy="20" r="16" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.4"/><circle cx="60" cy="20" r="16" fill="#F8E3EE" stroke="#4A3550" stroke-width="2.4"/>`; }

/* ================= 3. ESTRUCTURA DE ARCHIVOS Y CARPETAS ================= */
// Función constructora para asignar ids automáticamente
function it(opts) { return Object.assign({ id: 'i' + (itCount++), }, opts); }
let itCount = 0;

// 📁 Carpeta 1
const F01 = it({
  name: '01_cine_top',
  type: 'folder',
  emoji: '🎬',
  children: [
    it({
      name: 'cine.jpg',
      type: 'image',
      src: 'Imagenes/Tarde.jpg',
      caption: 'Llegué tarde al cine esa vez, tú estabas ahí esperando con tu cospobre de Clancy. Lol, creo que ni nos saludamos.'
    }),

    it({
      name: 'ticket.jpg',
      type: 'image',
      src: 'Imagenes/Entrada.jpg',
      caption: 'Hora: 18:00, Sala: 4, Asientos: G9-G10. Sigo guardando la captura.'
    }),

    it({
      name: 'ella_esperando.jpg',
      type: 'image',
      src: 'Imagenes/Esperando.jpg',
      caption: 'tú ya estabas ahí.'
    }),

    it({
      name: 'us.jpg',
      type: 'image',
      src: 'Imagenes/us.jpg',
      caption: 'Sigo considerándolo de mis mejores días.'
    }),

    it({
      name: 'nota1.txt',
      type: 'note-hand',
      text: 'recuerdo n.º 1:\nNo imaginaba lo importante que se volvería para mí ese momento.',
      src: 'Imagenes/Mi mejor dia.jpg'
    }),
  ]
});

// Carpeta 2
const F02 = it({
  name: '02_despues',
  type: 'folder',
  emoji: '💬',
  children: [
    it({
      name: 'chat_resumen.png',
      type: 'illo',
      illo: 'chat',
      caption: 'Por primera vez tenía más de 3 mensajes de un mismo chat en mi vida.'
    }),

    it({
      name: 'nota.txt',
      type: 'note-hand',
      text: '¿Puedo considerar esto algo especial?'
    }),
  ]
});

// 📁 Carpeta 3
const F03 = it({
  name: '03_cosas_que_me_compartiste',
  type: 'folder',
  emoji: '📨',
  children: [
    /* ✍️ [MODIFICA AQUÍ] Si deseas subir un mp3 real, agrégale: src: 'musica/cancion.mp3' */
    it({
      name: 'Tu_musica.mp3',
      type: 'audio',
      title: 'canciones_fav.mp3',
      artist: '[clasificado]',
      caption: 'no puedo poner todas aquí, tienes como un millón de favoritas.'
    }),

    it({
      name: 'tweets.png',
      type: 'illo',
      illo: 'tweet',
      caption: 'Casi todo sobre Top y Tyler lol.'
    }),

    it({
      name: 'video_random.mp4',
      type: 'video',
      title: 'video_random.mp4',
      caption: 'Espero que sí te cargue.'
    }),

    it({
      name: 'referencias_internas.txt',
      type: 'note-mono',
      text: 'cosas que solo nosotras entendemos:\n\n- Joshler more than we ever imagined\n- bolitas de colores\n- que somos Ty y Josh\n- [contenido clasificado nivel 3]'
    }),
  ]
});

// 📁 Carpeta 4
const F04 = it({
  name: '04_metro',
  type: 'folder',
  emoji: '🚌',
  children: [
    it({
      name: 'metro_nocturno.png',
      type: 'illo',
      illo: 'metro',
      caption: 'No hablamos, pero sentía que nuestro interior sí.'
    }),

    it({
      name: 'nosotras_again.png',
      type: 'illo',
      illo: 'chibis',
      caption: 'Dibujo todo feo para recordarlo.'
    }),

    it({
      name: 'nota.txt',
      type: 'note-hand',
      text: 'Terminé llegando más tarde de lo que esperé, no importaba. Había pasado el día contigo.'
    }),
  ]
});

// 📁 Carpeta 5
const F05 = it({
  name: '05_sketchbook',
  type: 'folder',
  emoji: '📓',
  children: [
    it({
      name: 'sketchbook.png',
      type: 'illo',
      illo: 'sketchbook',
      caption: 'Mi primer sketchbook. No sabes cuánto lo adoro.'
    }),

    it({
      name: 'nota_sketchbook.txt',
      type: 'note-hand',
      text: 'Como sabes, eres la primera persona que me regala un sketch. Lo miré durante varios minutos cuando llegué a casa. No podía creer que fueras tan atenta. Y sí, lloré demasiado.'
    }),
  ]
});

// 📁 Carpeta 6 (Bloqueada al inicio)
const F06 = it({
  name: '06_nosotras',
  type: 'folder',
  emoji: '💗',
  locked: true,
  children: [
    it({
      name: 'collage.png',
      type: 'illo',
      illo: 'collage',
      caption: 'Aunque mis memorias siempre son borrosas por mis problemas mentales, las tuyas siguen intactas.'
    }),

    it({
      name: 'referencias.txt',
      type: 'note-mono',
      text: 'cosas que ya son nuestras:\n\n- el cine\n- regresar en el metro\n- odiar a la ATU\n- el holder que me debes\n- tu playlist toda gay\n- esto, lo que sea que esto es'
    }),

    it({
      name: 'frase.txt',
      type: 'note-hand',
      text: 'Qué raro que termináramos siendo tan importantes la una para la otra.'
    }),

    it({
      name: 'ultima_nota.txt',
      type: 'note-hand',
      special: 'final',
      text: 'no esperaba que una ida al cine terminara convirtiéndose en una de mis amistades favoritas.\n\nfeliz geiversario, Glenn.\n\n— yo'
    }),
  ]
});

// Carpeta Raíz contenedora "4_meses"
const F_4MESES = it({
  name: '4_meses',
  type: 'folder',
  emoji: '📁',
  children: [
    F01, F02, F03, F04, F05, F06,

    /* ✍️ [MODIFICA AQUÍ] Cronología de lore */
    it({
      name: 'lore.txt',
      type: 'note-mono',
      text: 'lore.txt\n\ncronología no oficial (sujeta a revisión,\nautora poco objetiva):\n\ndía 1: cine. ella tarde. yo... también tarde, pero menos.\nsemana 2: empezamos a hablar todos los días sin darnos cuenta.\nmes 2: ya teníamos memes inside que nadie más entendía.\nmes 3: sketchbook.\nmes 4: esto. literalmente esto, esta página.\n\nfin de la cronología (por ahora).'
    }),

    it({
      name: 'cosas_que_nunca_superamos.doc',
      type: 'note-mono',
      text: 'cosas_que_nunca_superamos.doc\n\n- el asado que prometiste y nunca llegó\n- esa canción que nos rompió por dos semanas\n- el chiste de la fila 4, butaca 6\n- que siempre llega una tarde y la otra más tarde'
    }),

    it({
      name: 'definitivamente_normales.txt',
      type: 'note-mono',
      text: 'definitivamente_normales.txt\n\ncosas 100% normales que hacemos:\n\n- mandar memes a las 3am como si fuera trabajo urgente\n- tener un ranking oficial de brainrot\n- llorar (un poquito) por un sketchbook\n- escribirle cartas a través de una compu falsa de los 90\n\nsí. muy normales. 0 dudas.'
    }),
  ]
});

// Elementos colocados en el escritorio directamente
const DESKTOP_ITEMS = [
  F_4MESES,

  /* ✍️ [MODIFICA AQUÍ] Nota de bienvenida del escritorio */
  it({
    name: 'geiversario_notes.txt',
    type: 'note-hand',
    desktop: true,
    text: 'Glenn,\n\nsi estás leyendo esto es porque encontraste esta compu vieja (es broma, te la mandé yo, pero finjamos que la encontraste guardada en un cajón después de años).\n\naquí adentro están guardados 4 meses. no sé bien cómo explicarlos sin que suene cursi, así que mejor los organicé en carpetas, como si fueran archivos importantes. porque lo son.\n\nempieza por 4_meses. ve abriendo todo, no hay apuro, no hay orden correcto. al final hay algo, pero no te adelantes.\n\nfeliz geiversario, supongo.\n(sigue sonando raro decirlo así pero ya qué).\n\n— yo'
  }),

  it({ name: 'top_brainrot.exe', type: 'exe', desktop: true }),
  it({ name: 'Mi PC', type: 'special', special: 'mypc', desktop: true }),
  it({ name: 'Papelera de reciclaje', type: 'special', special: 'trash', desktop: true }),
  it({ name: 'CD Player (Música)', type: 'special', special: 'ytplayer', desktop: true }),
];

// Opciones de menú inicio
const MENU_ITEMS = [
  { label: 'Programas', emoji: '📁', action: () => showToast('ningún programa instalado. solo recuerdos.') },
  { label: 'Documentos', emoji: '📄', action: () => showToast('nada por aquí. todavía.') },
  { sep: true },
  { label: 'Acerca de WinGei 98', emoji: '💗', action: () => openAbout() },
  { sep: true },
  { label: 'Apagar el sistema...', emoji: '🔌', action: () => confirmShutdown() },
];

// Líneas de carga de la BIOS
const BOOT_LINES = [
  'detectando recuerdos.......... OK',
  'montando unidad C:\\4_meses .... OK',
  'cargando corazones pixelados .. OK',
  'iniciando WinGei 98 ...........'
];
