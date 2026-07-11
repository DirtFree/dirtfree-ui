// Cart Management System
class CartManager {
  constructor() {
    this.cartKey = 'dirtfree_cart';
    this.locationKey = 'dirtfree_location';
    this.usersKey = 'dirtfree_auth_users';
    this.authStateKey = 'dirtfree_auth_state';
    this.ordersKey = 'dirtfree_order_history';
    this.authModal = null;
    this.historyModal = null;
    this.pendingAuthAction = null;
    this.addButtonStyles();
  }

  addButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .book-now-btn {
        position: relative;
      }

      .book-now-btn:disabled,
      .book-now-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Tooltip styling - only show on home page */
      .book-now-btn[data-tooltip-enabled="true"]:disabled::after,
      .book-now-btn[data-tooltip-enabled="true"].disabled::after,
      .book-now-btn[data-tooltip-enabled="true"]:disabled:hover::after,
      .book-now-btn[data-tooltip-enabled="true"].disabled:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: #fff;
        padding: 10px 16px;
        border-radius: 8px;
        white-space: nowrap;
        font-size: 13px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: tooltipFadeIn 0.3s ease;
      }

      .book-now-btn[data-tooltip-enabled="true"]:disabled::before,
      .book-now-btn[data-tooltip-enabled="true"].disabled::before,
      .book-now-btn[data-tooltip-enabled="true"]:disabled:hover::before,
      .book-now-btn[data-tooltip-enabled="true"].disabled:hover::before {
        content: '';
        position: absolute;
        bottom: calc(100% + 4px);
        left: 50%;
        transform: translateX(-50%);
        border: 8px solid transparent;
        border-top-color: #333;
        z-index: 1000;
        display: block;
      }

      @keyframes tooltipFadeIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      .cart-badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(38%, -38%);
        background: linear-gradient(135deg, #ef4444, #f97316);
        color: white;
        border-radius: 50%;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        display: none !important;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        line-height: 1;
        font-weight: 800;
        z-index: 999;
        border: 2px solid #ffffff;
        box-shadow: 0 8px 18px rgba(239, 68, 68, 0.28);
      }

      .cart-badge.show {
        display: flex !important;
      }

      /* Improved button styling for responsive */
      .auth-nav-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 8px;
      }

      .nav-menu .auth-nav-actions {
        margin-left: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .auth-nav-pill {
        border: 1px solid #dbeafe;
        background: #f8fbff;
        color: #2563eb;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .auth-nav-pill:hover {
        background: #eef6ff;
        transform: translateY(-1px);
      }

      .auth-nav-pill.auth-primary {
        background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        color: white;
        border-color: transparent;
      }

      .auth-nav-pill.auth-primary:hover {
        background: linear-gradient(135deg, #357ABD 0%, #245b95 100%);
      }

      .nav-menu .auth-nav-actions .auth-nav-pill,
      .nav-menu .auth-nav-actions .auth-user-wrap {
        order: 2;
      }

      .nav-menu .card-btn,
      .nav-menu .book-now-btn {
        order: 1;
      }

      .auth-user-wrap {
        position: relative;
      }

      .auth-user-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        min-width: 220px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.16);
        padding: 10px;
        display: none;
        z-index: 2100;
      }

      .auth-user-wrap.open .auth-user-dropdown {
        display: block;
      }

      .auth-user-dropdown .profile-card {
        padding: 10px 8px 8px;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 8px;
      }

      .auth-user-dropdown .profile-name {
        font-weight: 800;
        color: #0f172a;
        font-size: 15px;
      }

      .auth-user-dropdown .profile-phone {
        font-size: 12px;
        color: #64748b;
        margin-top: 2px;
      }

      .auth-user-dropdown button {
        width: 100%;
        text-align: left;
        border: 0;
        background: transparent;
        color: #334155;
        padding: 10px 8px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      }

      .auth-user-dropdown button:hover {
        background: #f8fafc;
        color: #2563eb;
      }

      .auth-overlay,
      .history-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
      }

      .auth-overlay.active,
      .history-overlay.active {
        display: flex;
      }

      .auth-modal,
      .history-modal {
        width: min(100%, 460px);
        background: #fff;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
        position: relative;
      }

      .history-modal {
        width: min(100%, 560px);
      }

      .auth-close,
      .history-close {
        position: absolute;
        top: 14px;
        right: 14px;
        border: 0;
        background: #f4f7fb;
        color: #475569;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
      }

      .auth-header h3,
      .history-header h3 {
        font-size: 22px;
        color: #0f172a;
        margin-bottom: 6px;
      }

      .auth-header p,
      .history-header p {
        color: #64748b;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .auth-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 18px;
      }

      .auth-tab {
        flex: 1;
        border: 0;
        border-radius: 999px;
        padding: 10px 12px;
        font-weight: 700;
        color: #64748b;
        background: #f1f5f9;
        cursor: pointer;
      }

      .auth-tab.active {
        background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        color: white;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .auth-form label {
        font-size: 13px;
        font-weight: 700;
        color: #334155;
      }

      .auth-form .auth-name-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .auth-form input {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 14px;
      }

      .auth-form input:focus {
        outline: none;
        border-color: #4A90E2;
        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.14);
      }

      .auth-submit {
        margin-top: 6px;
        border: 0;
        border-radius: 12px;
        padding: 12px 14px;
        background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        color: white;
        font-weight: 700;
        cursor: pointer;
      }

      .auth-message {
        min-height: 20px;
        margin-top: 12px;
        font-size: 13px;
        color: #0f766e;
      }

      .history-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 12px;
        max-height: 320px;
        overflow: auto;
      }

      .history-card {
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 12px 14px;
        background: #f8fafc;
      }

      .history-card .title {
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 4px;
      }

      .history-card .meta {
        font-size: 12px;
        color: #64748b;
      }

      .history-empty {
        padding: 20px;
        text-align: center;
        color: #64748b;
        background: #f8fafc;
        border-radius: 14px;
      }

      @media (max-width: 768px) {
        .book-now-btn[data-tooltip-enabled="true"]:disabled::after,
        .book-now-btn[data-tooltip-enabled="true"].disabled::after {
          white-space: normal;
          width: 120px;
          font-size: 12px;
        }

        .auth-nav-actions {
          margin-right: 0;
          margin-bottom: 6px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Get cart items
  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Add item to cart
  addToCart(service, tier, price, duration, rating, reviews) {
    const cart = this.getCart();
    const existingItem = cart.find(
      item => item.service === service && item.tier === tier
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: Date.now(),
        service,
        tier,
        price,
        duration,
        rating,
        reviews,
        quantity: 1
      });
    }

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }

  // Remove item from cart
  removeFromCart(itemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }

  // Update quantity
  updateQuantity(itemId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
    }
    return cart;
  }

  // Clear cart
  clearCart() {
    localStorage.removeItem(this.cartKey);
  }

  // Get cart count
  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get cart total
  getCartTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Set location
  setLocation(location) {
    localStorage.setItem(this.locationKey, location);
    this.updateBookNowButton();
  }

  // Get location
  getLocation() {
    return localStorage.getItem(this.locationKey);
  }

  // Update Book Now button state
  updateBookNowButton() {
    const bookNowBtns = document.querySelectorAll('.book-now-btn');
    if (bookNowBtns.length === 0) return;

    const location = this.getLocation();
    bookNowBtns.forEach(btn => {
      if (location) {
        btn.disabled = false;
        btn.classList.remove('disabled');
        btn.removeAttribute('data-tooltip');
        btn.removeAttribute('data-tooltip-enabled');
      } else {
        btn.disabled = true;
        btn.classList.add('disabled');
        // Only enable tooltip on home page
        if (btn.getAttribute('data-home-page') === 'true') {
          btn.setAttribute('data-tooltip', 'Select a location to book');
          btn.setAttribute('data-tooltip-enabled', 'true');
        }
      }
    });
  }
}

CartManager.prototype.getUsers = function() {
  const users = localStorage.getItem(this.usersKey);
  return users ? JSON.parse(users) : [];
};

CartManager.prototype.saveUsers = function(users) {
  localStorage.setItem(this.usersKey, JSON.stringify(users));
};

CartManager.prototype.getCurrentUser = function() {
  const stored = localStorage.getItem(this.authStateKey);
  return stored ? JSON.parse(stored) : null;
};

CartManager.prototype.isAuthenticated = function() {
  return Boolean(this.getCurrentUser());
};

CartManager.prototype.setCurrentUser = function(user) {
  localStorage.setItem(this.authStateKey, JSON.stringify(user));
  this.updateAuthControls();
};

CartManager.prototype.clearCurrentUser = function() {
  localStorage.removeItem(this.authStateKey);
  this.updateAuthControls();
};

CartManager.prototype.findUserByPhone = function(phone) {
  return this.getUsers().find(user => user.phone === phone);
};

CartManager.prototype.registerUser = function(phone, password, firstName = '', lastName = '') {
  const users = this.getUsers();
  if (this.findUserByPhone(phone)) {
    return { success: false, message: 'This mobile number is already registered.' };
  }

  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Customer';
  const user = {
    id: Date.now(),
    phone,
    password,
    firstName,
    lastName,
    displayName,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  this.saveUsers(users);
  this.setCurrentUser(user);
  return { success: true, user };
};

CartManager.prototype.loginUser = function(phone, password) {
  const users = this.getUsers();
  const match = users.find(user => user.phone === phone && user.password === password);

  if (!match) {
    return { success: false, message: 'Invalid mobile number or password.' };
  }

  this.setCurrentUser(match);
  return { success: true, user: match };
};

CartManager.prototype.logoutUser = function() {
  this.clearCurrentUser();
};

CartManager.prototype.queueAfterAuth = function(action) {
  this.pendingAuthAction = action;
};

CartManager.prototype.runPendingAuthAction = function() {
  if (this.pendingAuthAction) {
    const action = this.pendingAuthAction;
    this.pendingAuthAction = null;
    setTimeout(action, 0);
  }
};

CartManager.prototype.saveOrderToHistory = function(orderData) {
  const currentUser = this.getCurrentUser();
  if (!currentUser) return null;

  const history = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
  const entry = {
    id: `DF-${Date.now()}`,
    userPhone: currentUser.phone,
    createdAt: new Date().toISOString(),
    ...orderData
  };

  history.unshift(entry);
  localStorage.setItem(this.ordersKey, JSON.stringify(history));
  return entry;
};

CartManager.prototype.getOrderHistory = function() {
  const currentUser = this.getCurrentUser();
  if (!currentUser) return [];

  const history = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
  return history
    .filter(entry => entry.userPhone === currentUser.phone)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

CartManager.prototype.initAuthUI = function() {
  if (document.getElementById('dirtfreeAuthModal')) return;

  const modal = document.createElement('div');
  modal.id = 'dirtfreeAuthModal';
  modal.className = 'auth-overlay';
  modal.innerHTML = `
    <div class="auth-modal">
      <button class="auth-close" type="button" aria-label="Close">×</button>
      <div class="auth-header">
        <h3>Welcome to DirtFree</h3>
        <p>Sign in or create an account to place your order and track your booking history.</p>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" type="button" data-mode="signin">Sign In</button>
        <button class="auth-tab" type="button" data-mode="signup">Sign Up</button>
      </div>
      <form class="auth-form" id="dirtfreeAuthForm">
        <div class="auth-name-row" id="authNameRow" style="display:none;">
          <div>
            <label for="authFirstName">First Name</label>
            <input id="authFirstName" name="firstName" type="text" placeholder="First name">
          </div>
          <div>
            <label for="authLastName">Last Name</label>
            <input id="authLastName" name="lastName" type="text" placeholder="Last name">
          </div>
        </div>
        <label for="authPhone">Mobile Number</label>
        <input id="authPhone" name="phone" type="tel" placeholder="Enter your mobile number" required>
        <label for="authPassword">Password</label>
        <input id="authPassword" name="password" type="password" placeholder="Choose a password" required>
        <button class="auth-submit" type="submit">Continue</button>
      </form>
      <p class="auth-message" id="authMessage"></p>
    </div>
  `;

  document.body.appendChild(modal);
  this.authModal = modal;

  modal.querySelector('.auth-close').addEventListener('click', () => this.hideAuthModal());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) this.hideAuthModal();
  });

  modal.querySelectorAll('.auth-tab').forEach(button => {
    button.addEventListener('click', () => this.setAuthMode(button.dataset.mode));
  });

  modal.querySelector('#dirtfreeAuthForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const phone = modal.querySelector('#authPhone').value.trim();
    const password = modal.querySelector('#authPassword').value.trim();
    const firstName = modal.querySelector('#authFirstName')?.value.trim() || '';
    const lastName = modal.querySelector('#authLastName')?.value.trim() || '';
    const mode = modal.querySelector('.auth-tab.active').dataset.mode;

    let result;
    if (mode === 'signup') {
      result = this.registerUser(phone, password, firstName, lastName);
    } else {
      result = this.loginUser(phone, password);
    }

    const messageNode = modal.querySelector('#authMessage');
    if (result.success) {
      messageNode.textContent = mode === 'signup' ? 'Account created successfully.' : 'Signed in successfully.';
      messageNode.style.color = '#0f766e';
      this.updateAuthControls();
      this.runPendingAuthAction();
      setTimeout(() => this.hideAuthModal(), 350);
    } else {
      messageNode.textContent = result.message;
      messageNode.style.color = '#dc2626';
    }
  });

  this.updateAuthControls();
};

CartManager.prototype.setAuthMode = function(mode) {
  const modal = this.authModal || document.getElementById('dirtfreeAuthModal');
  if (!modal) return;

  modal.querySelectorAll('.auth-tab').forEach(button => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });

  const form = modal.querySelector('#dirtfreeAuthForm');
  const passwordInput = modal.querySelector('#authPassword');
  const submitButton = modal.querySelector('.auth-submit');
  const heading = modal.querySelector('.auth-header h3');
  const subText = modal.querySelector('.auth-header p');
  const nameRow = modal.querySelector('#authNameRow');

  if (mode === 'signup') {
    heading.textContent = 'Create your account';
    subText.textContent = 'Use your mobile number and password to keep your orders and history in one place.';
    passwordInput.placeholder = 'Create a password';
    submitButton.textContent = 'Create account';
    nameRow.style.display = 'grid';
  } else {
    heading.textContent = 'Welcome back';
    subText.textContent = 'Sign in to place your order and view your booking history.';
    passwordInput.placeholder = 'Enter your password';
    submitButton.textContent = 'Continue';
    nameRow.style.display = 'none';
  }

  form.reset();
  modal.querySelector('#authMessage').textContent = '';
};

CartManager.prototype.showAuthModal = function(mode = 'signin') {
  this.initAuthUI();
  this.authModal.classList.add('active');
  this.setAuthMode(mode);
};

CartManager.prototype.hideAuthModal = function() {
  if (this.authModal) {
    this.authModal.classList.remove('active');
  }
};

CartManager.prototype.updateAuthControls = function() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;

  let authContainer = document.getElementById('authNavActions');
  if (!authContainer) {
    authContainer = document.createElement('div');
    authContainer.id = 'authNavActions';
    authContainer.className = 'auth-nav-actions';
    navMenu.insertBefore(authContainer, navMenu.firstChild);
  }

  const currentUser = this.getCurrentUser();
  if (currentUser) {
    authContainer.innerHTML = `
      <button class="auth-nav-pill" id="historyNavBtn" type="button">Order History</button>
      <div class="auth-user-wrap">
        <button class="auth-nav-pill auth-primary" id="userNavBtn" type="button">${currentUser.displayName || 'Customer'}</button>
        <div class="auth-user-dropdown" id="authUserDropdown">
          <div class="profile-card">
            <div class="profile-name">${currentUser.displayName || 'Customer'}</div>
            <div class="profile-phone">${currentUser.phone}</div>
          </div>
          <button type="button" id="authProfileBtn">Profile</button>
          <button type="button" id="authLogoutBtn">Logout</button>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button class="auth-nav-pill" id="historyNavBtn" type="button">Order History</button>
      <button class="auth-nav-pill auth-primary" id="signinNavBtn" type="button">Sign In</button>
    `;
  }

  const historyButton = authContainer.querySelector('#historyNavBtn');
  if (historyButton) {
    historyButton.addEventListener('click', () => this.showOrderHistory());
  }

  const signinButton = authContainer.querySelector('#signinNavBtn');
  if (signinButton) {
    signinButton.addEventListener('click', () => this.showAuthModal('signin'));
  }

  const userButton = authContainer.querySelector('#userNavBtn');
  const userWrap = authContainer.querySelector('.auth-user-wrap');
  const dropdown = authContainer.querySelector('#authUserDropdown');
  const logoutButton = authContainer.querySelector('#authLogoutBtn');
  const profileButton = authContainer.querySelector('#authProfileBtn');

  if (userButton && userWrap && dropdown) {
    userButton.addEventListener('click', (event) => {
      event.stopPropagation();
      userWrap.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (!userWrap.contains(event.target)) {
        userWrap.classList.remove('open');
      }
    });
  }

  if (profileButton) {
    profileButton.addEventListener('click', () => {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return;
      userWrap.classList.remove('open');
      this.showOrderHistory();
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      this.logoutUser();
      userWrap.classList.remove('open');
    });
  }
};

CartManager.prototype.showOrderHistory = function() {
  if (!this.historyModal) {
    const modal = document.createElement('div');
    modal.className = 'history-overlay';
    modal.innerHTML = `
      <div class="history-modal">
        <button class="history-close" type="button" aria-label="Close">×</button>
        <div class="history-header">
          <h3>Order History</h3>
          <p>Your recent bookings and service requests.</p>
        </div>
        <div class="history-list" id="historyList"></div>
      </div>
    `;
    document.body.appendChild(modal);
    this.historyModal = modal;
    modal.querySelector('.history-close').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('active');
    });
  }

  const list = this.historyModal.querySelector('#historyList');
  const currentUser = this.getCurrentUser();

  if (!currentUser) {
    list.innerHTML = '<div class="history-empty">Please sign in to view your order history.</div>';
    this.historyModal.classList.add('active');
    return;
  }

  const orders = this.getOrderHistory();
  if (!orders.length) {
    list.innerHTML = '<div class="history-empty">No orders yet. Your first booking will appear here.</div>';
  } else {
    list.innerHTML = orders.map(order => `
      <div class="history-card">
        <div class="title">${order.service || 'Cleaning booking'}</div>
        <div class="meta">Order ID: ${order.id}</div>
        <div class="meta">Location: ${order.location || '—'}</div>
        <div class="meta">Date: ${order.date || '—'} • ${order.slot || '—'}</div>
        <div class="meta">Total: ₹${order.total || 0}</div>
      </div>
    `).join('');
  }

  this.historyModal.classList.add('active');
};

// Initialize cart manager
window.cart = new CartManager();
const cart = window.cart;

// Update button state on page load
document.addEventListener('DOMContentLoaded', function() {
  initMobileNavbar();
  cart.initAuthUI();
  cart.updateBookNowButton();
  updateCartBadge();
});

function initMobileNavbar() {
  const header = document.querySelector('.main-header');
  const headerContainer = document.querySelector('.header-container');
  const navMenu = document.querySelector('.nav-menu');

  if (!header || !headerContainer || !navMenu || document.querySelector('.nav-toggle')) return;
  if (document.body.classList.contains('service-page')) return;

  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Open navigation menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  headerContainer.insertBefore(toggle, navMenu);

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });
}

// Update cart badge count
function updateCartBadge() {
  const cartButtons = document.querySelectorAll('.book-now-btn, .nav-menu .card-btn[href*="booking"]');
  cartButtons.forEach(btn => {
    if (!btn.querySelector('.cart-badge')) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      btn.appendChild(badge);
    }
  });

  const badges = document.querySelectorAll('.cart-badge');
  const count = cart.getCartCount();
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  });
}
