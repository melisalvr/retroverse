// ============================================================
//  REGISTRO ProductoVintage (implementa el pseudocódigo)
// ============================================================
function ProductoVintage(CodProd, Nombre, Decada, Precio, Stock, imagen, descripcion) {
  this.CodProd     = CodProd;
  this.Nombre      = Nombre;
  this.Decada      = Decada;
  this.Precio      = parseFloat(Precio);
  this.Stock       = parseInt(Stock);
  this.imagen      = imagen;
  this.descripcion = descripcion;
}

// ============================================================
//  "ARCHIVO" — simulación del archivo de registros ordenado
//  por CodProd, con los 6 productos cargados al iniciar
// ============================================================
var Arch = []; // Array que simula el archivo secuencial
var totalProductos = 0;

function cargarProducto(CodProd, Nombre, Decada, Precio, Stock, imagen, desc) {
  var prod = new ProductoVintage(CodProd, Nombre, Decada, Precio, Stock, imagen, desc);
  Arch.push(prod);
  totalProductos++;
}

// SVG inline para cada producto (no dependen de internet)
var IMGS = {
  walkman:   svgWalkman(),
  polaroid:  svgPolaroid(),
  atari:     svgAtari(),
  vhs:       svgVhs(),
  discman:   svgDiscman(),
  gameboy:   svgGameboy()
};

// Carga inicial de los 6 productos (simula el bucle del pseudocódigo)
cargarProducto("WALK-001","Walkman Sony TPS-L2",1979, 89.99, 5,  IMGS.walkman,
  "El legendario Walkman original de Sony lanzado en 1979. Reproductor de casetes portátil que revolucionó la forma de escuchar música. Incluye auriculares de esponja originales y estuche de transporte. Funciona con 2 pilas AA. Estado: Excelente. Ideal para coleccionistas.");

cargarProducto("POLA-002","Cámara Polaroid OneStep",1977, 74.50, 8,  IMGS.polaroid,
  "Icónica cámara Polaroid OneStep de revelado instantáneo. Capturá tus momentos y tené la foto en segundos. Compatible con cartuchos 600 (no incluidos). Cuerpo en excelente estado, mecanismo de expulsión funcionando perfectamente. Un clásico indispensable de cualquier colección retro.");

cargarProducto("ATAR-003","Consola Atari 2600",1977, 129.00, 3,  IMGS.atari,
  "La mítica consola Atari 2600 con sus joysticks originales. Incluye 4 juegos clásicos: Pac-Man, Space Invaders, Pitfall y Breakout. Todos los conectores en perfecto estado. Revivé la era dorada de los videojuegos. Funciona con TV por señal RCA. Cable de alimentación incluido.");

cargarProducto("VHSC-004","Videocasetera VHS Philips",1985,  55.00, 6,  IMGS.vhs,
  "Videocasetera VHS Philips modelo N1700 con mando a distancia original. Sistema HQ de alta definición para la época. Control de velocidad de reproducción, contador de cinta digital y función rebobinado rápido. Perfecta para revivir tus películas favoritas de la videoteca familiar.");

cargarProducto("DISC-005","Discman Sony D-50",1984,  69.00, 7,  IMGS.discman,
  "El primer Discman del mundo: Sony D-50 de 1984. Reproductor de CD portátil compacto y liviano. Sistema Anti-skip para reproducción sin saltos. Incluye auriculares MDR-E252 originales y adaptador de pilas AA. El comienzo de la era digital en el bolsillo.");

cargarProducto("GAMB-006","Game Boy Original Nintendo",1989,  95.00, 4,  IMGS.gameboy,
  "Game Boy original de Nintendo lanzado en 1989. La consola portátil que conquistó el mundo. Pantalla LCD de 2.6 pulgadas, sistema de retroiluminación tipo espejo. Incluye Tetris y Super Mario Land. Funciona con 4 pilas AA. En perfecto estado de conservación.");

// Ordenar por CodProd (como especifica el pseudocódigo)
Arch.sort(function(a, b) { return a.CodProd.localeCompare(b.CodProd); });

// ============================================================
//  CARRITO
// ============================================================
var carrito = []; // Array de { prod, cantidad }

function getCartIndex(CodProd) {
  for (var i = 0; i < carrito.length; i++) {
    if (carrito[i].prod.CodProd === CodProd) return i;
  }
  return -1;
}

function agregarAlCarrito(CodProd) {
  var prod = buscarProducto(CodProd);
  if (!prod) return;
  if (prod.Stock <= 0) { alert("⚠️ Sin stock disponible para: " + prod.Nombre); return; }

  var idx = getCartIndex(CodProd);
  if (idx >= 0) {
    if (carrito[idx].cantidad < prod.Stock) {
      carrito[idx].cantidad++;
    } else {
      alert("⚠️ No hay más stock disponible de: " + prod.Nombre);
      return;
    }
  } else {
    carrito.push({ prod: prod, cantidad: 1 });
  }
  actualizarUI();
  showToast("✅ " + prod.Nombre + " agregado al carrito");
}

function quitarDelCarrito(CodProd) {
  var idx = getCartIndex(CodProd);
  if (idx < 0) return;
  carrito[idx].cantidad--;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  actualizarUI();
  if (document.getElementById('cart').classList.contains('active')) renderCart();
}

function eliminarDelCarrito(CodProd) {
  var idx = getCartIndex(CodProd);
  if (idx >= 0) carrito.splice(idx, 1);
  actualizarUI();
  renderCart();
}

function totalCarrito() {
  var t = 0;
  for (var i = 0; i < carrito.length; i++) t += carrito[i].prod.Precio * carrito[i].cantidad;
  return t;
}

function cantidadCarrito() {
  var c = 0;
  for (var i = 0; i < carrito.length; i++) c += carrito[i].cantidad;
  return c;
}

function buscarProducto(CodProd) {
  for (var i = 0; i < Arch.length; i++) {
    if (Arch[i].CodProd === CodProd) return Arch[i];
  }
  return null;
}

// ============================================================
//  ACTUALIZAR CONTADORES Y BADGES
// ============================================================
function actualizarUI() {
  var cant = cantidadCarrito();
  var total = totalCarrito();
  document.getElementById('cartBadge').textContent = cant;
  document.getElementById('cartCountDisplay').textContent = cant;
  document.getElementById('totalAccDisplay').textContent = '$' + total.toFixed(2);
  document.getElementById('totalProdDisplay').textContent = totalProductos;
  document.getElementById('navCounter').textContent = 'Productos cargados: ' + totalProductos;
}

// ============================================================
//  RENDERIZAR CATÁLOGO
// ============================================================
function renderCatalog() {
  var tbody = document.getElementById('catalogBody');
  tbody.innerHTML = '';
  for (var i = 0; i < Arch.length; i++) {
    var p = Arch[i];
    var stockClass = p.Stock <= 3 ? 'stock-low' : 'stock-ok';
    var stockLabel = p.Stock <= 3 ? '⚠️ ' + p.Stock : '✅ ' + p.Stock;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><img src="' + p.imagen + '" class="prod-thumb" alt="' + p.Nombre + '"></td>' +
      '<td style="font-family:\'Courier New\',monospace;font-size:11px;">' + p.CodProd + '</td>' +
      '<td><b style="font-family:\'Times New Roman\',serif;">' + p.Nombre + '</b></td>' +
      '<td><span class="decade-badge">' + p.Decada + 's</span></td>' +
      '<td style="color:#cc0000;font-weight:bold;font-family:\'Courier New\',monospace;">$' + p.Precio.toFixed(2) + '</td>' +
      '<td class="' + stockClass + '">' + stockLabel + '</td>' +
      '<td style="white-space:nowrap;">' +
        '<button class="btn btn-blue" onclick="verDetalle(\'' + p.CodProd + '\')">🔍 Ver</button>&nbsp;' +
        '<button class="btn btn-green" onclick="agregarAlCarrito(\'' + p.CodProd + '\')">🛒 Agregar</button>' +
      '</td>';
    // Click en fila (excepto botones)
    (function(cod){ tr.addEventListener('click', function(e){
      if(e.target.tagName !== 'BUTTON') verDetalle(cod);
    }); })(p.CodProd);
    tbody.appendChild(tr);
  }
}

// ============================================================
//  VER DETALLE
// ============================================================
function verDetalle(CodProd) {
  var p = buscarProducto(CodProd);
  if (!p) return;
  document.getElementById('detailTitle').textContent = '🔍 Detalle: ' + p.Nombre;
  var html =
    '<div class="detail-img-box">' +
      '<img src="' + p.imagen + '" class="detail-img" alt="' + p.Nombre + '"><br>' +
      '<span class="decade-badge" style="margin-top:6px;display:inline-block;">' + p.Decada + 's</span>' +
    '</div>' +
    '<div class="detail-info">' +
      '<table>' +
        '<tr><td>Código</td><td style="font-family:\'Courier New\',monospace;">' + p.CodProd + '</td></tr>' +
        '<tr><td>Nombre</td><td><b>' + p.Nombre + '</b></td></tr>' +
        '<tr><td>Década</td><td>' + p.Decada + 's</td></tr>' +
        '<tr><td>Precio</td><td><div class="detail-price">$' + p.Precio.toFixed(2) + '</div></td></tr>' +
        '<tr><td>Stock</td><td>' + (p.Stock > 0 ? '<span class="stock-ok">✅ ' + p.Stock + ' disponibles</span>' : '<span class="stock-low">❌ Sin stock</span>') + '</td></tr>' +
      '</table>' +
      '<div class="detail-desc">' + p.descripcion + '</div>' +
      '<div style="margin-top:10px;">' +
        '<button class="btn btn-green" style="font-size:14px;padding:6px 18px;" onclick="agregarAlCarrito(\'' + p.CodProd + '\')">🛒 Agregar al carrito</button>' +
        '&nbsp;<button class="btn btn-blue" onclick="showSection(\'cart\')">👁 Ver carrito</button>' +
      '</div>' +
    '</div>';
  document.getElementById('detailContent').innerHTML = html;
  showSection('detail');
}

// ============================================================
//  RENDERIZAR CARRITO
// ============================================================
function renderCart() {
  var div = document.getElementById('cartContent');
  if (carrito.length === 0) {
    div.innerHTML = '<div class="empty-cart">🛒 Tu carrito está vacío.<br><br>' +
      '<button class="btn btn-blue" onclick="showSection(\'catalog\')">← Ir al Catálogo</button></div>';
    return;
  }
  var html = '<table class="cart-table"><thead><tr>' +
    '<th>Imagen</th><th>Producto</th><th>Precio unit.</th>' +
    '<th>Cantidad</th><th>Subtotal</th><th>Quitar</th>' +
    '</tr></thead><tbody>';
  for (var i = 0; i < carrito.length; i++) {
    var item = carrito[i];
    var sub = item.prod.Precio * item.cantidad;
    html += '<tr>' +
      '<td><img src="' + item.prod.imagen + '" style="width:44px;height:44px;object-fit:contain;border:1px solid #808080;"></td>' +
      '<td><b>' + item.prod.Nombre + '</b><br><span style="font-family:\'Courier New\',monospace;font-size:10px;color:#808080;">' + item.prod.CodProd + '</span></td>' +
      '<td style="font-family:\'Courier New\',monospace;color:#cc0000;font-weight:bold;">$' + item.prod.Precio.toFixed(2) + '</td>' +
      '<td><div class="qty-ctrl">' +
        '<button onclick="quitarDelCarrito(\'' + item.prod.CodProd + '\')">−</button>' +
        '<span class="qty-val">' + item.cantidad + '</span>' +
        '<button onclick="agregarAlCarrito(\'' + item.prod.CodProd + '\')">+</button>' +
      '</div></td>' +
      '<td style="font-family:\'Courier New\',monospace;font-weight:bold;">$' + sub.toFixed(2) + '</td>' +
      '<td><button class="btn btn-red" onclick="eliminarDelCarrito(\'' + item.prod.CodProd + '\')">✕ Quitar</button></td>' +
    '</tr>';
  }
  html += '</tbody></table>';
  html += '<div class="cart-total-box">TOTAL A PAGAR: <span>$' + totalCarrito().toFixed(2) + '</span></div>';
  html += '<div style="text-align:right;margin-top:10px;">' +
    '<button class="btn btn-gold" style="font-size:14px;padding:6px 20px;" onclick="showSection(\'pay\')">💳 Ir a Pagar →</button>' +
  '</div>';
  div.innerHTML = html;
}

// ============================================================
//  FORMULARIO DE PAGO
// ============================================================
function renderPay() {
  var body = document.getElementById('payBody');
  if (carrito.length === 0) {
    body.innerHTML = '<div class="empty-cart">⚠️ Tu carrito está vacío. <br><br>' +
      '<button class="btn btn-blue" onclick="showSection(\'catalog\')">← Ir al Catálogo</button></div>';
    return;
  }

  var summaryRows = '';
  for (var i = 0; i < carrito.length; i++) {
    summaryRows += '<tr><td>' + carrito[i].prod.Nombre + ' x' + carrito[i].cantidad + '</td>' +
      '<td style="text-align:right;font-family:\'Courier New\',monospace;">$' + (carrito[i].prod.Precio * carrito[i].cantidad).toFixed(2) + '</td></tr>';
  }

  body.innerHTML =
    '<div class="pay-summary">' +
      '<b>📋 Resumen de tu pedido:</b>' +
      '<table style="width:100%;margin-top:4px;font-size:12px;">' + summaryRows + '</table>' +
      '<div style="text-align:right;margin-top:6px;font-weight:bold;font-family:\'Courier New\',monospace;">TOTAL: $' + totalCarrito().toFixed(2) + '</div>' +
    '</div>' +
    '<div class="pay-form">' +
      '<div class="form-section-title">👤 Datos Personales</div>' +
      '<label>Nombre completo:</label>' +
      '<input type="text" id="payNombre" placeholder="Ej: Juan Pérez">' +
      '<label>Dirección de envío:</label>' +
      '<input type="text" id="payDireccion" placeholder="Ej: Av. Corrientes 1234, Buenos Aires">' +
      '<label>Ciudad:</label>' +
      '<input type="text" id="payCiudad" placeholder="Ej: Buenos Aires">' +
      '<label>Email:</label>' +
      '<input type="email" id="payEmail" placeholder="tu@email.com">' +

      '<div class="form-section-title">💳 Datos de Tarjeta (simulado)</div>' +
      '<label>Número de tarjeta:</label>' +
      '<input type="text" id="payCard" placeholder="0000 0000 0000 0000" maxlength="19" oninput="formatCard(this)">' +
      '<div class="card-row">' +
        '<div>' +
          '<label>Vencimiento:</label>' +
          '<input type="text" id="payExp" placeholder="MM/AA" maxlength="5" oninput="formatExp(this)">' +
        '</div>' +
        '<div>' +
          '<label>CVV:</label>' +
          '<input type="text" id="payCvv" placeholder="123" maxlength="3">' +
        '</div>' +
      '</div>' +
      '<label>Titular de la tarjeta:</label>' +
      '<input type="text" id="payTitular" placeholder="NOMBRE APELLIDO">' +

      '<div style="margin-top:16px;">' +
        '<button class="btn btn-green" style="font-size:14px;padding:7px 24px;" onclick="procesarPago()">✅ Confirmar compra</button>' +
        '&nbsp;&nbsp;<button class="btn" onclick="showSection(\'cart\')">← Volver al carrito</button>' +
      '</div>' +
    '</div>';
}

function formatCard(inp) {
  var v = inp.value.replace(/\D/g,'').substring(0,16);
  inp.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function formatExp(inp) {
  var v = inp.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 3) v = v.substring(0,2) + '/' + v.substring(2);
  inp.value = v;
}

function procesarPago() {
  var nombre    = (document.getElementById('payNombre')    ||{}).value || '';
  var direccion = (document.getElementById('payDireccion') ||{}).value || '';
  var ciudad    = (document.getElementById('payCiudad')    ||{}).value || '';
  var email     = (document.getElementById('payEmail')     ||{}).value || '';
  var card      = (document.getElementById('payCard')      ||{}).value || '';
  var exp       = (document.getElementById('payExp')       ||{}).value || '';
  var cvv       = (document.getElementById('payCvv')       ||{}).value || '';

  if (!nombre.trim())    { alert('⚠️ Por favor ingresá tu nombre.'); return; }
  if (!direccion.trim()) { alert('⚠️ Por favor ingresá tu dirección.'); return; }
  if (card.replace(/\s/g,'').length < 16) { alert('⚠️ Número de tarjeta inválido.'); return; }
  if (exp.length < 5)    { alert('⚠️ Fecha de vencimiento inválida.'); return; }
  if (cvv.length < 3)    { alert('⚠️ CVV inválido.'); return; }

  var orderNum = 'RV-' + Math.floor(Math.random() * 90000 + 10000);
  var total = totalCarrito();

  var itemsList = '';
  for (var i = 0; i < carrito.length; i++) {
    itemsList += '<tr><td>' + carrito[i].prod.Nombre + '</td><td>x' + carrito[i].cantidad + '</td>' +
      '<td>$' + (carrito[i].prod.Precio * carrito[i].cantidad).toFixed(2) + '</td></tr>';
  }

  var body = document.getElementById('payBody');
  body.innerHTML =
    '<div class="ticket">' +
      '<div class="stars">★ ★ ★ ★ ★</div>' +
      '<h2>¡COMPRA CONFIRMADA!</h2>' +
      '<div class="stars">★ ★ ★ ★ ★</div>' +
      '<p style="font-size:13px;margin:8px 0;">Gracias por comprar en <b>RetroVerse</b></p>' +
      '<hr style="border:1px dashed #000;margin:8px 0;">' +
      '<table class="ticket-detail" style="width:100%;">' +
        '<tr><td><b>N° Pedido:</b></td><td>' + orderNum + '</td></tr>' +
        '<tr><td><b>Cliente:</b></td><td>' + nombre + '</td></tr>' +
        '<tr><td><b>Dirección:</b></td><td>' + direccion + (ciudad ? ', ' + ciudad : '') + '</td></tr>' +
        '<tr><td><b>Email:</b></td><td>' + (email || '—') + '</td></tr>' +
      '</table>' +
      '<hr style="border:1px dashed #000;margin:8px 0;">' +
      '<table style="width:100%;font-size:11px;">' +
        '<tr><th style="text-align:left;">Producto</th><th>Cant.</th><th>Subtotal</th></tr>' +
        itemsList +
      '</table>' +
      '<hr style="border:1px dashed #000;margin:8px 0;">' +
      '<div style="font-size:16px;font-weight:bold;">TOTAL COBRADO: $' + total.toFixed(2) + '</div>' +
      '<div style="font-size:10px;margin-top:8px;color:#808080;">Tarjeta: **** **** **** ' + card.replace(/\s/g,'').slice(-4) + '</div>' +
      '<hr style="border:1px dashed #000;margin:10px 0;">' +
      '<p style="font-size:11px;">Tu pedido será enviado en 3–5 días hábiles.<br>¡Gracias por elegirnos! 📼🎮📷</p>' +
      '<div style="margin-top:12px;">' +
        '<button class="btn btn-blue" onclick="nuevaCompra()">🏠 Volver al inicio</button>' +
      '</div>' +
    '</div>';

  // Vaciar carrito
  carrito = [];
  actualizarUI();
}

function nuevaCompra() {
  showSection('catalog');
}

// ============================================================
//  NAVEGACIÓN ENTRE SECCIONES
// ============================================================
function showSection(id) {
  var sections = ['catalog','detail','cart','pay','addprod','contact'];
  for (var i = 0; i < sections.length; i++) {
    document.getElementById(sections[i]).classList.remove('active');
  }
  document.getElementById(id).classList.add('active');
  if (id === 'cart') renderCart();
  if (id === 'pay')  renderPay();
  window.scrollTo(0, 0);
}

// ============================================================
//  FORMULARIO: AGREGAR NUEVO PRODUCTO
// ============================================================

// Ícono SVG genérico para productos sin imagen
function svgGenerico() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="5" y="5" width="90" height="90" rx="8" fill="#e0e0e0" stroke="#aaa" stroke-width="2"/>' +
    '<rect x="20" y="25" width="60" height="40" rx="4" fill="#bbb"/>' +
    '<polygon points="20,65 40,40 55,55 70,38 80,65" fill="#999"/>' +
    '<circle cx="35" cy="38" r="7" fill="#ccc"/>' +
    '<text x="50" y="85" text-anchor="middle" fill="#888" font-size="9" font-family="Arial">SIN IMAGEN</text>' +
    '</svg>');
}

var imagenNuevoProducto = null; // guardará el data URL de la imagen cargada

function previewImagen(input) {
  var box = document.getElementById('imgPreviewBox');
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      imagenNuevoProducto = e.target.result;
      box.innerHTML = '<img src="' + e.target.result + '" alt="Vista previa">';
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    imagenNuevoProducto = null;
    box.innerHTML = '<span>Sin imagen</span>';
  }
}

function agregarNuevoProducto() {
  // Leer campos
  var cod     = document.getElementById('addCodProd').value.trim().toUpperCase();
  var nombre  = document.getElementById('addNombre').value.trim();
  var decada  = parseInt(document.getElementById('addDecada').value) || 0;
  var precio  = parseFloat(document.getElementById('addPrecio').value) || 0;
  var stock   = parseInt(document.getElementById('addStock').value);
  var desc    = document.getElementById('addDesc').value.trim();

  // Validaciones
  if (!cod)             { alert('⚠️ Ingresá el código de producto.'); return; }
  if (cod.length > 10)  { alert('⚠️ El código no puede superar los 10 caracteres.'); return; }
  if (!nombre)          { alert('⚠️ Ingresá el nombre del producto.'); return; }
  if (decada < 1900 || decada > 1999) { alert('⚠️ Ingresá una década válida entre 1900 y 1999.'); return; }
  if (isNaN(precio) || precio <= 0)   { alert('⚠️ Ingresá un precio válido mayor a $0.'); return; }
  if (isNaN(stock)  || stock < 0)     { alert('⚠️ Ingresá un stock válido (0 o más).'); return; }

  // Verificar código duplicado
  for (var i = 0; i < Arch.length; i++) {
    if (Arch[i].CodProd === cod) {
      alert('⚠️ Ya existe un producto con el código "' + cod + '". Usá un código diferente.');
      return;
    }
  }

  // Usar imagen cargada o genérica
  var imagen = imagenNuevoProducto || svgGenerico();
  if (!desc) desc = 'Artículo vintage de la década del ' + decada + 's. Consultá disponibilidad y estado al vendedor.';

  // Crear y guardar el registro (simula Esc(Arch, prod) del pseudocódigo)
  cargarProducto(cod, nombre, decada, precio, stock, imagen, desc);

  // Re-ordenar archivo por CodProd
  Arch.sort(function(a, b) { return a.CodProd.localeCompare(b.CodProd); });

  // Actualizar contadores
  actualizarUI();
  renderCatalog();

  // Mostrar mensaje de éxito
  var msg = document.getElementById('addSuccessMsg');
  msg.textContent = '✅ ¡Producto "' + nombre + '" (' + cod + ') agregado exitosamente al catálogo! Total de productos: ' + totalProductos;
  msg.style.display = 'block';
  setTimeout(function(){ msg.style.display = 'none'; }, 4000);

  // Toast
  showToast('✅ ' + nombre + ' agregado al catálogo');

  // Limpiar formulario
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById('addCodProd').value  = '';
  document.getElementById('addNombre').value   = '';
  document.getElementById('addDecada').value   = '';
  document.getElementById('addPrecio').value   = '';
  document.getElementById('addStock').value    = '';
  document.getElementById('addDesc').value     = '';
  document.getElementById('addImagen').value   = '';
  document.getElementById('imgPreviewBox').innerHTML = '<span>Sin imagen</span>';
  imagenNuevoProducto = null;
}

// ============================================================
//  CONTACTO — formulario de mensaje simulado
// ============================================================
function enviarMensaje() {
  var nombre  = document.getElementById('contactNombre').value.trim();
  var email   = document.getElementById('contactEmail').value.trim();
  var asunto  = document.getElementById('contactAsunto').value.trim();
  var mensaje = document.getElementById('contactMensaje').value.trim();

  if (!nombre)  { alert('⚠️ Por favor ingresá tu nombre.'); return; }
  if (!email)   { alert('⚠️ Por favor ingresá tu correo electrónico.'); return; }
  if (!mensaje) { alert('⚠️ Por favor escribí tu mensaje.'); return; }

  var msg = document.getElementById('contactSuccessMsg');
  msg.style.display = 'block';
  showToast('📨 ¡Mensaje enviado a Alvaro Melis!');
  setTimeout(function(){ limpiarContacto(); }, 3500);
}

function limpiarContacto() {
  document.getElementById('contactNombre').value  = '';
  document.getElementById('contactEmail').value   = '';
  document.getElementById('contactAsunto').value  = '';
  document.getElementById('contactMensaje').value = '';
  document.getElementById('contactSuccessMsg').style.display = 'none';
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function showToast(msg) {
  var existing = document.getElementById('toastEl');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'toastEl';
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#000080;color:#ffff00;' +
    'font-family:Arial,sans-serif;font-size:13px;font-weight:bold;padding:8px 16px;' +
    'border:2px solid #fff;z-index:9999;border-radius:0;pointer-events:none;';
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 2200);
}

// ============================================================
//  SVG ICONS (productos)
// ============================================================
function svgToDataUrl(svg) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function svgWalkman() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="15" y="20" width="70" height="60" rx="8" fill="#222" stroke="#555" stroke-width="2"/>' +
    '<rect x="22" y="28" width="56" height="30" rx="4" fill="#444"/>' +
    '<rect x="26" y="32" width="48" height="22" rx="2" fill="#111"/>' +
    '<circle cx="35" cy="70" r="7" fill="#888" stroke="#aaa" stroke-width="1.5"/>' +
    '<circle cx="35" cy="70" r="3" fill="#555"/>' +
    '<circle cx="65" cy="70" r="7" fill="#888" stroke="#aaa" stroke-width="1.5"/>' +
    '<circle cx="65" cy="70" r="3" fill="#555"/>' +
    '<rect x="43" y="66" width="14" height="8" rx="2" fill="#cc8800"/>' +
    '<text x="50" y="45" text-anchor="middle" fill="#00ccff" font-size="10" font-family="Arial" font-weight="bold">SONY</text>' +
    '<text x="50" y="55" text-anchor="middle" fill="#888" font-size="7" font-family="Arial">WALKMAN</text>' +
    '</svg>');
}

function svgPolaroid() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="10" y="10" width="80" height="80" rx="4" fill="#eee" stroke="#999" stroke-width="2"/>' +
    '<rect x="16" y="16" width="68" height="50" fill="#fff" stroke="#ccc" stroke-width="1"/>' +
    '<rect x="18" y="18" width="64" height="46" fill="#87CEEB"/>' +
    '<ellipse cx="50" cy="35" rx="12" ry="12" fill="#ffd700"/>' +
    '<rect x="20" y="45" width="60" height="16" fill="#87CEEB" opacity="0.5"/>' +
    '<rect x="20" y="45" width="60" height="16" fill="#228B22" opacity="0.3"/>' +
    '<rect x="16" y="66" width="68" height="18" fill="#fff"/>' +
    '<text x="50" y="78" text-anchor="middle" fill="#333" font-size="9" font-family="Arial" font-weight="bold">polaroid</text>' +
    '<circle cx="50" cy="12" r="4" fill="#cc0000"/>' +
    '</svg>');
}

function svgAtari() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="10" y="30" width="80" height="50" rx="6" fill="#2a2a2a" stroke="#555" stroke-width="2"/>' +
    '<rect x="18" y="38" width="40" height="26" rx="2" fill="#111"/>' +
    '<rect x="20" y="40" width="36" height="22" rx="1" fill="#1a1a2e"/>' +
    '<text x="38" y="54" text-anchor="middle" fill="#ff6600" font-size="8" font-family="Arial" font-weight="bold">ATARI</text>' +
    '<text x="38" y="62" text-anchor="middle" fill="#888" font-size="6" font-family="Arial">2600</text>' +
    '<rect x="64" y="42" width="6" height="14" rx="1" fill="#888"/>' +
    '<rect x="72" y="42" width="6" height="14" rx="1" fill="#888"/>' +
    '<rect x="80" y="42" width="6" height="14" rx="1" fill="#888"/>' +
    '<rect x="25" y="68" width="12" height="5" rx="1" fill="#888"/>' +
    '<rect x="63" y="68" width="12" height="5" rx="1" fill="#888"/>' +
    '<text x="50" y="25" text-anchor="middle" fill="#ff6600" font-size="12" font-family="Arial" font-weight="bold">⬛ ATARI</text>' +
    '</svg>');
}

function svgVhs() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="5" y="25" width="90" height="55" rx="4" fill="#1a1a1a" stroke="#555" stroke-width="2"/>' +
    '<rect x="12" y="32" width="76" height="35" rx="2" fill="#333"/>' +
    '<rect x="14" y="34" width="72" height="31" rx="1" fill="#111"/>' +
    '<circle cx="30" cy="49" r="11" fill="#222" stroke="#666" stroke-width="1.5"/>' +
    '<circle cx="30" cy="49" r="7" fill="#111"/>' +
    '<circle cx="30" cy="49" r="3" fill="#444"/>' +
    '<circle cx="70" cy="49" r="11" fill="#222" stroke="#666" stroke-width="1.5"/>' +
    '<circle cx="70" cy="49" r="7" fill="#111"/>' +
    '<circle cx="70" cy="49" r="3" fill="#444"/>' +
    '<rect x="42" y="42" width="16" height="14" rx="1" fill="#444"/>' +
    '<rect x="14" y="67" width="72" height="8" rx="1" fill="#222"/>' +
    '<text x="50" y="74" text-anchor="middle" fill="#888" font-size="7" font-family="Arial">PHILIPS VHS</text>' +
    '</svg>');
}

function svgDiscman() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="8" y="20" width="84" height="60" rx="10" fill="#ddd" stroke="#999" stroke-width="2"/>' +
    '<circle cx="50" cy="52" r="28" fill="#ccc" stroke="#aaa" stroke-width="1.5"/>' +
    '<circle cx="50" cy="52" r="24" fill="#e8e8e8"/>' +
    '<circle cx="50" cy="52" r="18" fill="url(#cd)"/>' +
    '<defs><radialGradient id="cd" cx="40%" cy="40%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#adf"/><stop offset="60%" stop-color="#fad"/><stop offset="100%" stop-color="#ddf"/></radialGradient></defs>' +
    '<circle cx="50" cy="52" r="4" fill="#bbb" stroke="#888" stroke-width="1"/>' +
    '<rect x="16" y="25" width="20" height="10" rx="2" fill="#c0c0c0" stroke="#aaa" stroke-width="1"/>' +
    '<text x="26" y="33" text-anchor="middle" fill="#000080" font-size="6" font-family="Arial" font-weight="bold">SONY</text>' +
    '<text x="50" y="18" text-anchor="middle" fill="#000080" font-size="9" font-family="Arial" font-weight="bold">D-50</text>' +
    '</svg>');
}

function svgGameboy() {
  return svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<rect x="22" y="5" width="56" height="90" rx="10" fill="#c0c0a0" stroke="#808060" stroke-width="2"/>' +
    '<rect x="28" y="12" width="44" height="36" rx="3" fill="#222" stroke="#444" stroke-width="1.5"/>' +
    '<rect x="30" y="14" width="40" height="32" rx="2" fill="#4a7a4a"/>' +
    '<text x="50" y="35" text-anchor="middle" fill="#90ee90" font-size="7" font-family="\'Courier New\'" font-weight="bold">GAME BOY</text>' +
    '<circle cx="50" cy="63" r="10" fill="#808060" stroke="#606040" stroke-width="1.5"/>' +
    '<rect x="46" y="59" width="8" height="8" rx="1" fill="#909070"/>' +
    '<rect x="44" y="61" width="4" height="4" rx="0" fill="#a0a080"/>' +
    '<rect x="52" y="61" width="4" height="4" rx="0" fill="#a0a080"/>' +
    '<rect x="48" y="57" width="4" height="4" rx="0" fill="#a0a080"/>' +
    '<rect x="48" y="65" width="4" height="4" rx="0" fill="#a0a080"/>' +
    '<circle cx="67" cy="72" r="5" fill="#cc0000" stroke="#990000" stroke-width="1"/>' +
    '<circle cx="56" cy="76" r="5" fill="#0000cc" stroke="#000099" stroke-width="1"/>' +
    '<text x="50" y="92" text-anchor="middle" fill="#606040" font-size="6" font-family="Arial">Nintendo</text>' +
    '</svg>');
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
renderCatalog();
actualizarUI();