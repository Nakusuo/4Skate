# WinGei 98

Un escritorio falso de Windows 98 que funciona como cápsula del tiempo. Los recuerdos
están guardados como si fueran archivos: carpetas que se abren en ventanas, notas de
texto, un visor de imágenes, un reproductor de CD y un `.exe` que se niega a
desinstalarse.

Es un regalo de aniversario, así que el contenido es lo que es. El código, en cambio,
está pensado para que se pueda reutilizar y cambiarle los recuerdos a otro.

## Cómo abrirlo

Abre `index.html` en el navegador. No hay build, ni dependencias, ni `npm install`:
es HTML, CSS y JavaScript a mano.

Si tu navegador se pone quisquilloso con los archivos locales, sírvelo desde una
carpeta local:

```bash
npx http-server . -p 8080
```

## Qué hace

Arranca con una BIOS falsa que va cargando "recuerdos", suelta el escritorio y abre el
reproductor de música. A partir de ahí se explora a mano.

La carpeta `06_nosotras` **empieza bloqueada**: solo se abre después de haber visitado
las cinco carpetas anteriores. Dentro está la nota final.

El `.exe` del escritorio es una broma: se puede intentar borrar, pero el sistema no lo
permite.

## Estructura

Cada archivo hace una sola cosa.

```
index.html          la cáscara: pantalla de arranque, escritorio, barra de tareas

css/
  variables.css     paleta, medidas, reset y biseles estilo Win98
  desktop.css       escritorio, iconos, barra de tareas y menú de inicio
  windows.css       ventanas y diálogos
  apps.css          notas, visor de imágenes, reproductor, arranque y apagado
  responsive.css    todas las media queries, de pantalla grande a pequeña

js/
  sound.js          bips de 8 bits sintetizados con Web Audio (clics, errores)
  audio.js          AudioHub: motor de reproducción de los mp3
  assets.js         los iconos pixel-art y las ilustraciones, en SVG
  data.js           el contenido: carpetas, textos, rutas de fotos y música
  windowManager.js  crear, mover, redimensionar, minimizar y cerrar ventanas
  apps.js           qué se dibuja dentro de cada ventana
  desktop.js        iconos del escritorio y qué ventana abre cada tipo de archivo
  system.js         reloj, menú de inicio, secuencia de arranque y apagado
```

Los scripts se cargan en ese orden en `index.html` y cada uno depende solo de los
anteriores.

## El audio

Todo el sonido de archivos pasa por `AudioHub` (`js/audio.js`), que es la única fuente
de verdad. Las reglas que impone:

- **Solo suena una pista a la vez.** Darle play a una canción pausa automáticamente la
  música de fondo.
- **La música de fondo vuelve sola.** Cuando la canción interrumpida termina —o se
  cierra su ventana— la de fondo continúa desde donde se quedó. Si la pausas tú a
  propósito, se queda callada.
- **La interfaz no guarda estado.** Los reproductores se suscriben a los eventos del
  `<audio>` real y se repintan desde ahí, así que nunca se desincronizan entre ventanas.
- **Si el navegador bloquea el autoplay**, se reintenta en cada gesto del usuario hasta
  que arranca de verdad.

Los bips retro del sistema (`js/sound.js`) son aparte: se sintetizan en tiempo real con
la Web Audio API, no son archivos.

## Cambiarle el contenido

Casi todo vive en `js/data.js`, que lleva una guía en el propio archivo. En resumen:

| Para... | Añade un objeto de tipo... |
|---|---|
| una nota manuscrita | `note-hand` con `text` (y `src` si lleva foto) |
| un `.txt` de máquina de escribir | `note-mono` con `text` |
| una foto | `image` con `src` y `caption` |
| una canción | `audio` con `src`, `title`, `artist` y `cover` |
| un vídeo | `video` con `src` |

Las fotos van en `Imagenes/` y la música en `musica/`. La música de fondo se elige con
`BG_MUSIC_SRC`, justo debajo de la guía que abre el archivo.

Para cambiar las carpetas, edita `F01`…`F06` y `F_4MESES`. Si añades o quitas carpetas,
ajusta también `TRACKED_FOLDERS` y `UNLOCK_THRESHOLD` en `js/desktop.js`, que son las que
deciden cuándo se desbloquea la última.

## Detalles

- Funciona con ratón y con dedo: doble clic para abrir en escritorio, un toque en móvil.
- Las ventanas se arrastran, se redimensionan, se maximizan y se apilan. En móvil se
  abren a pantalla completa, menos los diálogos.
- Respeta `prefers-reduced-motion`.
- Sin librerías. Las únicas cosas de fuera son dos tipografías de Google Fonts.
