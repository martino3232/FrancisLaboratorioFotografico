<style>
    /* ――― Botón flotante ――― */
#cart-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: var(--color-primario);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 1000;
}
#cart-toggle .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #e74c3c;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* ――― Drawer del carrito ――― */
#cart-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100%;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
}
#cart-drawer.open {
  right: 0;
}
#cart-drawer .drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}
#cart-drawer .drawer-header h3 {
  margin: 0;
  font-size: 1.2rem;
}
#cart-drawer .close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
#cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
.cart-item {
  display: flex;
  margin-bottom: 1rem;
}
.cart-item img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 0.75rem;
}
.cart-item .details .name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}
.cart-item .details .qty-price {
  margin: 0;
  font-size: 0.85rem;
  color: #555;
}
#cart-drawer .drawer-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}
#cart-drawer .checkout-btn {
  background: var(--color-primario);
  color: #fff;
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: var(--border-radius);
  width: 100%;
  font-weight: 600;
  cursor: pointer;
}

</style>

<!-- Botón flotante -->
<div id="cart-toggle">
  <i class="fas fa-shopping-bag"></i>
  <span class="badge" id="cart-badge">0</span>
</div>

<!-- Drawer -->
<aside id="cart-drawer">
  <div class="drawer-header">
    <h3>Tu Carrito</h3>
    <button class="close-btn" id="cart-close">&times;</button>
  </div>
  <div id="cart-items">
    <!-- Productos inyectados por JS -->
  </div>
  <div class="drawer-footer">
    <button class="checkout-btn" id="checkout-btn">Ir al Checkout</button>
  </div>
</aside>

<script>
    // — API de carrito — 
function getCart() {
  const raw = localStorage.getItem('cart');
  return raw ? JSON.parse(raw) : {};
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartBadge() {
  const total = Object.values(getCart()).reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cart-badge').textContent = total;
}
function renderCartOverlay() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (!Object.keys(cart).length) {
    container.innerHTML = '<p style="text-align:center; padding:1rem">Tu carrito está vacío</p>';
    return;
  }
  container.innerHTML = Object.entries(cart).map(([id, item]) => `
    <div class="cart-item">
      <img src="${item.urlImagen}" alt="${item.nombre}">
      <div class="details">
        <p class="name">${item.nombre}</p>
        <p class="qty-price">${item.qty} x $${Number(item.precio).toLocaleString('es-AR')}</p>
      </div>
    </div>
  `).join('');
}
function addToCart(id, data) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = {...data, qty:1};
  }
  saveCart(cart);
  updateCartBadge();
  renderCartOverlay();
}

// — Listeners de apertura/cierre drawer — 
document.getElementById('cart-toggle')
  .addEventListener('click', () => {
    document.getElementById('cart-drawer').classList.add('open');
    updateCartBadge();
    renderCartOverlay();
  });
document.getElementById('cart-close')
  .addEventListener('click', () => {
    document.getElementById('cart-drawer').classList.remove('open');
  });

// — Inicialización al cargar la página — 
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartOverlay();
});

</script>