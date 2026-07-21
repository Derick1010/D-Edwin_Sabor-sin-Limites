/* ============================================================
   MENÚ, PRECIOS Y PEDIDOS  -  "Venta de Hot Dog"
   ------------------------------------------------------------
   Aquí controlas:
     1) Tu número de WhatsApp (para recibir los pedidos)
     2) Los productos y sus precios
   ============================================================ */
/* ============================================================
   1) CONFIGURACIÓN DEL NEGOCIO
   ============================================================ */
const CONFIG = {

  /* 📱 TU NÚMERO DE WHATSAPP         */
  whatsapp: "18299900469",

  /* Símbolo de moneda que se muestra antes de los precios */
  moneda: "RD$",

  /* Nombre del negocio (se usa en el mensaje de WhatsApp) */
  nombreNegocio: "Venta de Hot Dog"
};


/* ============================================================
   2) EL MENÚ  (aquí agregas, quitas o editas productos)
   ------------------------------------------------------------
   Está organizado por CATEGORÍAS. Cada categoría tiene:
       titulo:   nombre de la categoría
       emoji:    un dibujito (opcional)
       productos: lista de productos

   Cada PRODUCTO tiene:
       nombre:  nombre del producto
       desc:    descripción corta
       precio:  el precio (solo el número, sin RD$)
       emoji:   dibujito que se ve si NO hay foto
       img:     nombre de la foto dentro de la carpeta img/
                (déjalo vacío  ""  si todavía no tienes foto)

   👉 PARA PONER UNA FOTO:
      1. Guarda la imagen dentro de la carpeta  img/
      2. Escribe su nombre aquí. Ejemplo:  img: "hotdog-especial.jpg"
   ============================================================ */
const MENU = [

  /* -------------------- HOT DOGS -------------------- */
  {
    titulo: "Hot Dogs",
    emoji: "🌭",
    productos: [
      { nombre: "Hot Dog Sencillo", desc: "Pan suave, salchicha y tus salsas favoritas.", precio: 120, emoji: "🌭", img: "hotdog-especial.jpg" },
      { nombre: "Hot Dog Especial", desc: "Con papitas trituradas, queso y salsa rosada.", precio: 180, emoji: "🌭", img: "" },
      { nombre: "Hot Dog Doble",    desc: "Doble salchicha para el que llega con hambre.", precio: 220, emoji: "🌭", img: "" },
    ]
  },

  /* -------------------- CHIMIS -------------------- */
  {
    titulo: "Chimis",
    emoji: "🍔",
    productos: [
      { nombre: "Chimi de Res",   desc: "Carne de res, repollo y salsa de la casa.", precio: 180, emoji: "🍔", img: "" },
      { nombre: "Chimi de Pollo", desc: "Pollo jugoso, vegetales y pan tostado.",    precio: 180, emoji: "🍔", img: "" },
      { nombre: "Chimi Mixto",    desc: "Res y pollo juntos. El más pedido.",         precio: 220, emoji: "🍔", img: "" }
    ]
  },

  /* -------------------- SÁNDWICHES -------------------- */
  {
    titulo: "Sándwiches",
    emoji: "🥪",
    productos: [
      { nombre: "Sándwich de Pollo", desc: "Pollo desmenuzado con vegetales frescos.", precio: 200, emoji: "🥪", img: "" },
      { nombre: "Sándwich Mixto",    desc: "Jamón y queso derretido en pan tostado.",  precio: 150, emoji: "🥪", img: "" },
      { nombre: "Sándwich Cubano",   desc: "Jamón, cerdo, queso y pepinillos.",        precio: 250, emoji: "🥪", img: "" }
    ]
  },

  /* -------------------- BATIDAS -------------------- */
  {
    titulo: "Batidas",
    emoji: "🥤",
    productos: [
      { nombre: "Batida de Lechosa", desc: "Cremosa y bien fría.",         precio: 120, emoji: "🥤", img: "" },
      { nombre: "Batida de Fresa",   desc: "Con fresas naturales.",        precio: 130, emoji: "🍓", img: "" },
      { nombre: "Batida de Guineo",  desc: "Dulce y espesa.",              precio: 120, emoji: "🍌", img: "" },
      { nombre: "Batida Mixta",      desc: "Combinación de frutas.",       precio: 140, emoji: "🥤", img: "" }
    ]
  },

  /* -------------------- BEBIDAS -------------------- */
  {
    titulo: "Bebidas",
    emoji: "🧃",
    productos: [
      { nombre: "Refresco en lata", desc: "Coca-Cola, Sprite, etc.",  precio: 60,  emoji: "🥫", img: "" },
      { nombre: "Agua",             desc: "Botella de agua fría.",     precio: 40,  emoji: "💧", img: "" },
      { nombre: "Jugo Natural",     desc: "Del día, pregunta el sabor.", precio: 80, emoji: "🧃", img: "" },
      { nombre: "Morir Soñando",    desc: "El clásico dominicano.",    precio: 100, emoji: "🥛", img: "" }
    ]
  }

  /* 👉 ¿Quieres OTRA categoría? Copia un bloque completo de arriba
     (desde la llave  {  hasta la llave  }  ) y pégalo aquí antes de
     este comentario, poniéndole una coma  ,  al bloque anterior.   */
];


/* ============================================================
   ⚠️ DE AQUÍ HACIA ABAJO ES LA "MAGIA" (la programación).
   No necesitas editar nada de esto. Si algo se daña, esta parte
   es la que hace que el menú y el carrito funcionen.
   ============================================================ */

/* El "carrito" guarda lo que el cliente va agregando.
   Cada elemento tiene: nombre, precio y cantidad. */
let carrito = [];

/* Guarda la ubicación que el cliente comparte (o null si no la compartió).
   Se llena con { lat, lng } cuando presiona "Compartir mi ubicación". */
let ubicacionCliente = null;

/* --- Formatea un número como precio: 120 -> "RD$120" --- */
function precioTexto(numero) {
  return CONFIG.moneda + numero.toLocaleString("es-DO");
}

/* --- Dibuja TODO el menú en la página --- */
function dibujarMenu() {
  const contenedor = document.getElementById("contenedor-menu");
  let html = "";

  // Recorremos cada categoría
  MENU.forEach((categoria, indexCat) => {
    html += `
      <section class="categoria">
        <h3 class="categoria-titulo">
          <span class="cat-emoji">${categoria.emoji || ""}</span> ${categoria.titulo}
        </h3>
        <div class="row g-3">`;

    // Recorremos cada producto de la categoría
    categoria.productos.forEach((prod, indexProd) => {
      // Si el producto tiene foto, la mostramos; si no, mostramos el emoji
      const visual = prod.img
        ? `<img src="img/${prod.img}" alt="${prod.nombre}"
                onerror="this.parentElement.innerHTML='<span class=&quot;producto-emoji&quot;>${prod.emoji}</span>'">`
        : `<span class="producto-emoji">${prod.emoji}</span>`;

      html += `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="tarjeta-producto">
            <div class="producto-imagen">${visual}</div>
            <div class="producto-cuerpo">
              <div class="producto-nombre">${prod.nombre}</div>
              <div class="producto-desc">${prod.desc}</div>
              <div class="producto-pie">
                <span class="producto-precio">${precioTexto(prod.precio)}</span>
                <button class="btn-agregar" onclick="agregar(${indexCat}, ${indexProd})">
                  <i class="bi bi-plus-lg"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>`;
    });

    html += `</div></section>`;
  });

  contenedor.innerHTML = html;
}

/* --- Agrega un producto al carrito --- */
function agregar(indexCat, indexProd) {
  const prod = MENU[indexCat].productos[indexProd];

  // ¿Ya está en el carrito? Si sí, solo sumamos 1 a la cantidad
  const existente = carrito.find(item => item.nombre === prod.nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
  }
  actualizarCarrito();
}

/* --- Cambia la cantidad de un producto (+1 o -1) --- */
function cambiarCantidad(nombre, delta) {
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  // Si la cantidad llega a 0, quitamos el producto del carrito
  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.nombre !== nombre);
  }
  actualizarCarrito();
}

/* --- Calcula el total del pedido --- */
function calcularTotal() {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

/* --- Cuenta cuántos productos hay en total --- */
function contarProductos() {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

/* --- Actualiza el botón flotante y el panel del pedido --- */
function actualizarCarrito() {
  const cantidad = contarProductos();
  const total = calcularTotal();

  // Botón flotante
  document.getElementById("carrito-cantidad").textContent = cantidad;
  document.getElementById("carrito-total").textContent = precioTexto(total);

  // Zonas del panel del pedido
  const lista = document.getElementById("lista-pedido");
  const vacio = document.getElementById("pedido-vacio");
  const resumen = document.getElementById("pedido-resumen");

  if (carrito.length === 0) {
    // Pedido vacío: mostramos el mensaje y ocultamos el resumen
    lista.innerHTML = "";
    vacio.style.display = "block";
    resumen.style.display = "none";
    return;
  }

  vacio.style.display = "none";
  resumen.style.display = "block";

  // Dibujamos cada línea del pedido
  let html = "";
  carrito.forEach(item => {
    html += `
      <div class="item-pedido">
        <div class="item-pedido-info">
          <div class="item-pedido-nombre">${item.nombre}</div>
          <div class="item-pedido-precio">${precioTexto(item.precio)} c/u</div>
        </div>
        <div class="control-cantidad">
          <button class="btn-cant" onclick="cambiarCantidad('${item.nombre}', -1)">−</button>
          <span class="cant-numero">${item.cantidad}</span>
          <button class="btn-cant" onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
        </div>
      </div>`;
  });
  lista.innerHTML = html;

  // Total
  document.getElementById("pedido-total-texto").textContent = precioTexto(total);
}

/* --- Vacía todo el pedido --- */
function vaciarPedido() {
  carrito = [];
  reiniciarUbicacion();
  actualizarCarrito();
}

/* --- Pide la ubicación actual del cliente y la guarda --- */
function compartirUbicacion() {
  const estado = document.getElementById("ubicacion-estado");
  const boton  = document.getElementById("btn-ubicacion");

  // Si el navegador no permite ubicación, avisamos
  if (!navigator.geolocation) {
    estado.textContent = "Tu dispositivo no permite compartir la ubicación.";
    estado.className = "ubicacion-estado error";
    return;
  }

  // Mientras busca la ubicación, mostramos "cargando"
  estado.textContent = "Obteniendo tu ubicación… (puede tardar unos segundos)";
  estado.className = "ubicacion-estado cargando";
  boton.disabled = true;

  // ✅ Cuando logra ubicar: guardamos las coordenadas
  function alLograr(pos) {
    ubicacionCliente = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    estado.innerHTML = '<i class="bi bi-check-circle-fill"></i> ¡Listo! Tu ubicación se enviará con el pedido.';
    estado.className = "ubicacion-estado ok";
    boton.innerHTML = '<i class="bi bi-geo-alt-fill"></i> Ubicación compartida ✓';
    boton.classList.add("listo");
    boton.disabled = false;
  }

  // ❌ Cuando falla del todo: explicamos el motivo
  function alFallar(err) {
    let mensaje = "No se pudo obtener tu ubicación. Intenta de nuevo.";
    if (err.code === 1) mensaje = "Diste 'No permitir'. Activa la ubicación para compartirla.";
    else if (err.code === 2) mensaje = "Ubicación no disponible. Revisa que el GPS esté encendido.";
    else if (err.code === 3) mensaje = "Tardó demasiado. Prueba desde un celular o revisa tu señal.";
    estado.textContent = mensaje;
    estado.className = "ubicacion-estado error";
    boton.disabled = false;
  }

  // PRIMER INTENTO: máxima precisión (GPS). Le damos hasta 20 segundos
  // y aceptamos una ubicación de hasta 1 minuto de antigüedad si ya la tiene.
  navigator.geolocation.getCurrentPosition(
    alLograr,
    (err) => {
      // Si falló por tiempo agotado o no disponible, reintentamos con
      // precisión normal (por WiFi/red), que suele ser más rápida.
      if (err.code === 3 || err.code === 2) {
        estado.textContent = "Reintentando con precisión normal…";
        estado.className = "ubicacion-estado cargando";
        navigator.geolocation.getCurrentPosition(
          alLograr,
          alFallar,
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 120000 }
        );
      } else {
        // Si fue por permiso denegado, no tiene sentido reintentar
        alFallar(err);
      }
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
  );
}

/* --- Deja el botón de ubicación como al inicio --- */
function reiniciarUbicacion() {
  ubicacionCliente = null;
  const estado = document.getElementById("ubicacion-estado");
  const boton  = document.getElementById("btn-ubicacion");
  if (estado) {
    estado.textContent = "";
    estado.className = "ubicacion-estado";
  }
  if (boton) {
    boton.disabled = false;
    boton.classList.remove("listo");
    boton.innerHTML = '<i class="bi bi-geo-alt"></i> Compartir mi ubicación';
  }
}

/* --- Arma el mensaje y lo envía por WhatsApp --- */
function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu pedido está vacío. Agrega algo del menú primero. 🌭");
    return;
  }

  // Leemos los datos que escribió el cliente
  const nombre = document.getElementById("cliente-nombre").value.trim();
  const mesa   = document.getElementById("cliente-mesa").value.trim();
  const nota   = document.getElementById("cliente-nota").value.trim();

  // Construimos el mensaje línea por línea
  let msg = `*NUEVO PEDIDO - ${CONFIG.nombreNegocio}* 🌭\n\n`;
  if (nombre) msg += `👤 Cliente: ${nombre}\n`;
  if (mesa)   msg += `🪑 ${mesa}\n`;
  msg += `\n*Pedido:*\n`;

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    msg += `• ${item.cantidad} x ${item.nombre} — ${precioTexto(subtotal)}\n`;
  });

  msg += `\n*TOTAL: ${precioTexto(calcularTotal())}*`;
  if (nota) msg += `\n\n📝 Nota: ${nota}`;

  // Si el cliente compartió su ubicación, la agregamos como enlace de Google Maps
  if (ubicacionCliente) {
    const mapsLink = `https://maps.google.com/?q=${ubicacionCliente.lat},${ubicacionCliente.lng}`;
    msg += `\n\n📍 Ubicación del cliente:\n${mapsLink}`;
  }

  // Codificamos el mensaje para que viaje bien en la dirección web
  const textoCodificado = encodeURIComponent(msg);

  // Abrimos WhatsApp con el pedido ya escrito, listo para enviar
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${textoCodificado}`;
  window.open(url, "_blank");

  // --- Después de enviar: dejamos todo como al inicio ---
  // 1) Vaciamos el carrito
  carrito = [];
  actualizarCarrito();

  // 1.5) Reiniciamos el botón de ubicación
  reiniciarUbicacion();

  // 2) Borramos lo que el cliente había escrito
  document.getElementById("cliente-nombre").value = "";
  document.getElementById("cliente-mesa").value   = "";
  document.getElementById("cliente-nota").value   = "";

  // 3) Cerramos el panel deslizante del pedido
  const panel = document.getElementById("panelPedido");
  const instancia = bootstrap.Offcanvas.getInstance(panel);
  if (instancia) instancia.hide();

  // 4) Volvemos al inicio de la página
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --- Cuando la página termina de cargar, preparamos todo --- */
document.addEventListener("DOMContentLoaded", () => {
  dibujarMenu();        // Dibuja el menú
  actualizarCarrito();  // Deja el carrito en 0

  // Conectamos los botones del panel
  document.getElementById("btn-enviar").addEventListener("click", enviarWhatsApp);
  document.getElementById("btn-vaciar").addEventListener("click", vaciarPedido);
  document.getElementById("btn-ubicacion").addEventListener("click", compartirUbicacion);

  // Muestra el año actual en el pie de página
  document.getElementById("anio").textContent = new Date().getFullYear();
});
