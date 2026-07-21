/* ============================================================
   GALERÍA DE FOTOS  -  "Venta de Hot Dog"
   ------------------------------------------------------------
   ¿Cómo funciona esto de forma sencilla?

   Tú SOLO guardas fotos dentro de la carpeta  galeria/  y las
   nombras con números seguidos:

        galeria/1.jpg
        galeria/2.jpg
        galeria/3.jpg   ... y así.

   La página las busca sola y las muestra. No tienes que
   escribir nada aquí. (Un navegador NO puede "ver" una carpeta
   por seguridad, por eso usamos números para encontrarlas.)

   👉 REGLAS FÁCILES:
      - Usa números seguidos: 1, 2, 3, 4...
      - Formatos válidos: .jpg  .jpeg  .png  .webp
      - Si borras una foto del medio, deja el número o
        renombra las siguientes para que no queden huecos.

   Casi nada de aquí abajo hay que tocarlo.
   ============================================================ */

const GALERIA_CONFIG = {
  /* Carpeta donde guardas las fotos */
  carpeta: "galeria/",

  /* Hasta cuántas fotos buscar (puedes subirlo si algún día
     tienes muchísimas) */
  maximoFotos: 60,

  /* Formatos de imagen que se intentan (mayúsculas incluidas
     por si el celular guarda como .JPG) */
  extensiones: ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"],

  /* Cuántos números seguidos pueden faltar antes de dejar de
     buscar. Con 3, la galería aguanta pequeños huecos. */
  tolerancia: 3
};


/* ------------------------------------------------------------
   Comprueba si una imagen existe intentando cargarla.
   Prueba cada extensión (1.jpg, 1.png, ...) y devuelve la
   primera que cargue, o null si ninguna existe.
   ------------------------------------------------------------ */
function buscarFoto(numero) {
  return new Promise((resolve) => {
    let i = 0;

    function intentar() {
      if (i >= GALERIA_CONFIG.extensiones.length) {
        resolve(null); // ninguna extensión funcionó para este número
        return;
      }
      const ext = GALERIA_CONFIG.extensiones[i++];
      const ruta = GALERIA_CONFIG.carpeta + numero + "." + ext;

      const img = new Image();
      img.onload = () => resolve(ruta);   // ¡existe!
      img.onerror = intentar;             // probamos la siguiente extensión
      img.src = ruta;
    }

    intentar();
  });
}


/* ------------------------------------------------------------
   Recorre los números buscando fotos y arma la lista.
   ------------------------------------------------------------ */
async function cargarGaleria() {
  const encontradas = [];
  let huecosSeguidos = 0;
  let numero = 1;

  while (numero <= GALERIA_CONFIG.maximoFotos &&
         huecosSeguidos < GALERIA_CONFIG.tolerancia) {

    const ruta = await buscarFoto(numero);

    if (ruta) {
      encontradas.push(ruta);
      huecosSeguidos = 0;
    } else {
      huecosSeguidos++;
    }
    numero++;
  }

  mostrarGaleria(encontradas);
}


/* ------------------------------------------------------------
   Dibuja las fotos en la página.
   Si no hay ninguna, esconde toda la sección para que no se
   vea un espacio vacío.
   ------------------------------------------------------------ */
function mostrarGaleria(fotos) {
  const seccion = document.getElementById("galeria");
  const grid = document.getElementById("galeria-grid");
  if (!seccion || !grid) return;

  if (fotos.length === 0) {
    seccion.style.display = "none"; // sin fotos = sin sección
    return;
  }

  let html = "";
  fotos.forEach((ruta, i) => {
    html += `
      <button type="button" class="galeria-item"
              onclick="abrirLightbox(${i})">
        <img src="${ruta}" alt="Foto ${i + 1}" loading="lazy">
      </button>`;
  });
  grid.innerHTML = html;

  // Guardamos las rutas para el visor ampliado (lightbox)
  window._galeriaFotos = fotos;

  seccion.style.display = "block";
}


/* ------------------------------------------------------------
   VISOR AMPLIADO (lightbox): al tocar una foto se ve grande.
   ------------------------------------------------------------ */
let _fotoActual = 0;

function abrirLightbox(indice) {
  _fotoActual = indice;
  pintarLightbox();
  document.getElementById("galeria-lightbox").classList.add("abierto");
  document.body.style.overflow = "hidden"; // que no se mueva el fondo
}

function cerrarLightbox() {
  document.getElementById("galeria-lightbox").classList.remove("abierto");
  document.body.style.overflow = "";
}

function moverLightbox(delta) {
  const total = window._galeriaFotos.length;
  _fotoActual = (_fotoActual + delta + total) % total; // da la vuelta
  pintarLightbox();
}

function pintarLightbox() {
  const img = document.getElementById("galeria-lightbox-img");
  img.src = window._galeriaFotos[_fotoActual];
}


/* ------------------------------------------------------------
   Arranque: cuando la página carga, buscamos las fotos y
   conectamos los botones del visor.
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  cargarGaleria();

  // Botones del visor ampliado
  const cerrar = document.getElementById("galeria-cerrar");
  const prev = document.getElementById("galeria-prev");
  const next = document.getElementById("galeria-next");
  const fondo = document.getElementById("galeria-lightbox");

  if (cerrar) cerrar.addEventListener("click", cerrarLightbox);
  if (prev) prev.addEventListener("click", (e) => { e.stopPropagation(); moverLightbox(-1); });
  if (next) next.addEventListener("click", (e) => { e.stopPropagation(); moverLightbox(1); });
  // Tocar el fondo oscuro también cierra
  if (fondo) fondo.addEventListener("click", (e) => {
    if (e.target === fondo) cerrarLightbox();
  });

  // Teclas de flecha y Escape (para computadora)
  document.addEventListener("keydown", (e) => {
    const visor = document.getElementById("galeria-lightbox");
    if (!visor || !visor.classList.contains("abierto")) return;
    if (e.key === "Escape") cerrarLightbox();
    if (e.key === "ArrowLeft") moverLightbox(-1);
    if (e.key === "ArrowRight") moverLightbox(1);
  });
});
