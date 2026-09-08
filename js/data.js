/* ================= CONTENIDO Y ESTRUCTURA (data.js) ================= */
// Este archivo contiene SOLO el contenido: carpetas, textos, rutas de medios,
// menu de inicio y lineas de arranque. Los dibujos SVG estan en assets.js.

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

const BG_MUSIC_SRC = 'musica/Tv_girl.mp3';

/* ================= ESTRUCTURA DE ARCHIVOS Y CARPETAS ================= */
// Función constructora para asignar ids automáticamente
let itCount = 0;
function it(opts) { return Object.assign({ id: 'i' + (itCount++) }, opts); }

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
      src: 'Imagenes/Mi_mejor_dia.jpg'
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
      name: 'chat_resumen.jpg',
      type: 'image',
      src: 'Imagenes/Chat.jpg',
      caption: 'Por primera vez tenía más de 3 mensajes de un mismo chat en mi vida.'
    }),

    it({
      name: 'nota.txt',
      type: 'note-hand',
      text: '¿Puedo considerar esto algo especial?',
      src: 'Imagenes/nota02despues.png'
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
      title: 'Harvey.mp3',
      artist: "Her's",
      src: 'musica/Harvey.mp3',
      cover: 'Imagenes/mp3.jpg',
      caption: 'Una de tus favoritas. 🎵'
    }),

    it({
      name: 'tweets.png',
      type: 'image',
      src: 'Imagenes/tweet.png',
      caption: 'Casi todo sobre Top y Tyler lol.'
    }),

    it({
      name: 'video_random.mp4',
      type: 'video',
      title: 'video_random.mp4',
      src: 'Imagenes/videorandom.mp4',
      caption: 'Yo creo que hacer esto es lo que nos sentenció.\nEspero que sí te cargue.'
    }),

    it({
      name: 'referencias_internas.jpg',
      type: 'image',
      src: 'Imagenes/referencias.internas.jpg',
      caption: 'cosas que solo nosotras entendemos:\n\n- Joshler more than we ever imagined\n- bolitas de colores\n- que somos Ty y Josh\n- [contenido clasificado nivel 3]'
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
      name: 'nosotras_again.jpg',
      type: 'image',
      src: 'Imagenes/metrojuntas.jpg',
      caption: 'Creo que es la mejor foto (por no decir la única) que nos tomamos juntas.'
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
      name: 'sketchbook.jpg',
      type: 'image',
      src: 'Imagenes/sketch.jpg',
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
      type: 'image',
      src: 'Imagenes/collage.png',
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
      text: 'Han pasado 4 meses desde que fuimos al cine.Sigo pensando que fue una de las mejores casualidades de mi vida.\n\nfeliz geiversario, Glenn.\n\n— yo'
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

    it({
      name: 'cosas_que_nunca_superamos.doc',
      type: 'note-mono',
      text: 'cosas_que_nunca_superamos.doc\n\n- JOSHLER FICS\n- cualquier momento gay'
    }),

    it({
      name: 'definitivamente_normales.txt',
      type: 'note-mono',
      text: 'definitivamente_normales.txt\n\ncosas 100% normales que hacemos:\n\n- discutir algo nada que ver a las 2am\n- tener una lista de fics por leer\n- escribirnos cosas muy sentimentales\n\nsí. muy normales. 0 dudas.'
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
    text: 'Glenn,\n\nsi estás leyendo esto es porque encontraste esta compu vieja en el internet (es broma, te la mandé yo, pero finjamos que la encontraste vagando por distintos link).\n\naquí adentro están guardados 4 meses. no sé bien cómo explicarlos sin que suene cursi, así que mejor los organicé en carpetas, como si fueran archivos importantes. porque lo son, para mi.\n\nempieza por 4_meses. ve abriendo todo, no hay apuro, no hay orden correcto. al final hay algo, pero no te adelantes.\n\nfeliz geiversario, supongo.\n(sigue sonando raro decirlo así pero ya qué).\n\n— yo'
  }),

  it({ name: 'bolita_rosa.exe', type: 'exe', desktop: true }),
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
  'cargando sentimientos .. OK',
  'iniciando WinGei 98 ...........'
];
