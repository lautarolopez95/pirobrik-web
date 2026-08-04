// Inicializar Iconos
feather.replace();

// Estado Global
let cart = [];
let productosDB = []; // Ahora empezará vacío y se llenará desde Google Sheets

// Cargar configuración en el DOM
function loadConfig() {
    // Media & Logos
    document.getElementById('header-logo').src = SITE_CONFIG.logos.logoPrincipalHeader;
    document.getElementById('footer-logo').src = SITE_CONFIG.logos.logoFooter;
    
    let favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = SITE_CONFIG.logos.favicon;
    document.head.appendChild(favicon);

    document.getElementById('hero-bg').src = SITE_CONFIG.media.heroBannerBg;
    document.getElementById('manifesto-bg').style.backgroundImage = `url('${SITE_CONFIG.media.nosotrosBanner}')`;
    document.getElementById('sabias-que-video').src = SITE_CONFIG.media.secadoHornoVideo;

    // Contacto
    document.getElementById('contact-phone').innerText = SITE_CONFIG.contactInfo.telefonoContacto;
    document.getElementById('contact-email').innerText = SITE_CONFIG.contactInfo.emailContacto;
    document.getElementById('contact-address').innerText = SITE_CONFIG.contactInfo.direccion;

    // Iconos de contacto (muestran texto limpio)
    document.getElementById('contact-ig').href = SITE_CONFIG.contactInfo.redesSociales.instagram;
    document.getElementById('contact-ig').innerText = "instagram.com/pirobrik";
    
    document.getElementById('contact-tk').href = SITE_CONFIG.contactInfo.redesSociales.tiktok;
    document.getElementById('contact-tk').innerText = "tiktok.com/@pirobrik";
}

// NUEVO: Obtener productos desde Google Sheets
async function fetchProducts() {
    const container = document.getElementById('products-container');
    
    if (!SITE_CONFIG.api.googleSheetsEndpoint || SITE_CONFIG.api.googleSheetsEndpoint.includes("TU_SCRIPT_ID_AQUI")) {
        container.innerHTML = '<p style="text-align:center; width:100%; color: var(--accent-fire);">Falta configurar la URL de Google Sheets en config.js. Sigue la guía de despliegue para obtener tu link de Google Apps Script.</p>';
        return;
    }

    container.innerHTML = '<p style="text-align:center; width:100%;">Cargando catálogo desde Google Sheets...</p>';

    try {
        // Hacemos una petición GET a la API
        const response = await fetch(SITE_CONFIG.api.googleSheetsEndpoint);
        const result = await response.json();
        
        if (result.status === "success") {
            productosDB = result.data; // Guardamos los datos reales del Excel
            renderProducts(); // Dibujamos los productos en pantalla
        } else {
            console.error("Error del servidor:", result.message);
            container.innerHTML = '<p style="text-align:center; width:100%;">Error al cargar el catálogo.</p>';
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        container.innerHTML = '<p style="text-align:center; width:100%;">Error al conectar con Google Sheets. Revisa que el Web App tenga acceso "Cualquier persona".</p>';
    }
}

// Renderizar Productos Dinámicamente
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    productosDB.forEach(prod => {
        // Validar Stock
        const tieneStock = parseInt(prod.Stock) > 0;
        const textoBoton = tieneStock ? "Agregar al Carrito" : "Sin Stock";
        const btnDisabled = tieneStock ? "" : "disabled style='background-color: #555; cursor: not-allowed; color: #888;'";

        // Usar imágenes de la configuración en lugar de la hoja de cálculo
        let imagenUrl = (prod.Nombre && prod.Nombre.includes("4")) 
            ? SITE_CONFIG.media.producto_4kg 
            : SITE_CONFIG.media.producto_3kg;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${imagenUrl}" alt="${prod.Nombre}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${prod.Nombre}</h3>
                <div class="product-price">$${parseInt(prod.Precio).toLocaleString('es-AR')}</div>
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="changeQty('${prod.ID}', -1)" ${btnDisabled}>-</button>
                    <span id="qty-${prod.ID}">1</span>
                    <button class="quantity-btn" onclick="changeQty('${prod.ID}', 1)" ${btnDisabled}>+</button>
                </div>
                <button class="btn-primary btn-add-cart" onclick="addToCart('${prod.ID}')" ${btnDisabled}>${textoBoton}</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function changeQty(id, delta) {
    const el = document.getElementById(`qty-${id}`);
    let qty = parseInt(el.innerText) + delta;
    if (qty < 1) qty = 1;
    el.innerText = qty;
}

// Manejo del Carrito
function addToCart(id) {
    const prod = productosDB.find(p => p.ID == id);
    if (!prod) return;

    const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
    
    // Validar que no pida más del stock disponible en el Excel
    const existing = cart.find(item => item.ID == id);
    const currentCartQty = existing ? existing.cantidad : 0;
    
    if (currentCartQty + qty > parseInt(prod.Stock)) {
        alert(`¡Lo sentimos! Solo nos quedan ${prod.Stock} unidades en stock de este producto.`);
        return;
    }

    if (existing) {
        existing.cantidad += qty;
    } else {
        cart.push({ ...prod, cantidad: qty });
    }
    
    updateCartUI();
    toggleCart(); // Abre el carrito para mostrar el feedback
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-price');

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        total += item.Precio * item.cantidad;
        count += item.cantidad;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4 style="font-size: 1rem;">${item.Nombre}</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">$${item.Precio} x ${item.cantidad}</p>
                </div>
                <button class="quantity-btn" onclick="removeFromCart(${index})" style="background: var(--accent-fire);">&times;</button>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = `$${total.toLocaleString('es-AR')}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

// Checkout Modal
function openCheckout() {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    document.getElementById('checkout-modal').classList.add('open');
    toggleCart();
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('open');
}

// Enviar Formularios (API Google Sheets)
async function sendToApi(action, data, btnElement) {
    if (!SITE_CONFIG.api.googleSheetsEndpoint || SITE_CONFIG.api.googleSheetsEndpoint.includes("TU_SCRIPT_ID_AQUI")) {
        alert("Atención: Aún no has configurado la URL de la API de Google Sheets en config.js");
        return false;
    }

    const originalText = btnElement.innerText;
    btnElement.innerText = "Procesando...";
    btnElement.disabled = true;

    try {
        // Usamos text/plain para evitar el preflight OPTIONS de CORS y poder leer el JSON de respuesta
        const response = await fetch(SITE_CONFIG.api.googleSheetsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({ action: action, data: data })
        });
        
        const result = await response.json();
        
        if (action === 'nuevo_pedido') {
            if (result.checkout_url) {
                window.location.assign(result.checkout_url);
                return true;
            } else {
                alert("Hubo un error de Mercado Pago. Detalle técnico: " + (result.mp_error || "Desconocido"));
                return true;
            }
        }

        btnElement.innerText = originalText;
        btnElement.disabled = false;
        return true; 
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        btnElement.innerText = originalText;
        btnElement.disabled = false;
        alert("Ocurrió un error al enviar los datos. Intenta nuevamente.");
        return false;
    }
}

// Listeners Formularios
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let total = cart.reduce((acc, item) => acc + (item.Precio * item.cantidad), 0);
    const data = {
        clienteNombre: document.getElementById('chk_nombre').value,
        email: document.getElementById('chk_email').value,
        telefono: document.getElementById('chk_telefono').value,
        direccion: document.getElementById('chk_direccion').value,
        items: cart,
        montoTotal: total
    };

    const btn = document.getElementById('btn-confirm-order');
    const success = await sendToApi('nuevo_pedido', data, btn);
    
    if (success) {
        // En este punto, sendToApi ya está redirigiendo a Mercado Pago,
        // pero limpiamos el carrito localmente por las dudas
        cart = [];
        updateCartUI();
        closeCheckout();
        document.getElementById('checkoutForm').reset();
    }
});

document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('lead_nombre').value,
        email: document.getElementById('lead_email').value,
        asunto: document.getElementById('lead_asunto').value,
        mensaje: document.getElementById('lead_mensaje').value
    };

    const btn = document.getElementById('btn-submit-lead');
    const success = await sendToApi('nuevo_lead', data, btn);
    
    if (success) {
        alert("¡Mensaje enviado correctamente! Te responderemos a la brevedad.");
        document.getElementById('leadForm').reset();
    }
});

// Inicialización
window.onload = () => {
    loadConfig();
    fetchProducts(); // Cargar productos dinámicamente desde el Excel
};
