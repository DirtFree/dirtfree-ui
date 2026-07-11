// Cart Management System with Supabase Integration
class CartManager {
  constructor() {
    this.cartKey = 'dirtfree_cart';
    this.locationKey = 'dirtfree_location';
    this.authStateKey = 'dirtfree_auth_state';
    this.ordersKey = 'dirtfree_order_history';
    this.authModal = null;
    this.historyModal = null;
    this.pendingAuthAction = null;
    this.supabase = null;
    this.currentUser = null;
    this.initSupabase();
    this.addButtonStyles();
  }

  async initSupabase() {
    // Wait for supabase client to be available
    let attempts = 0;
    while (!window.supabase && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    this.supabase = window.supabase;
    if (this.supabase) {
      // Check if user is already logged in via Supabase session
      await this.checkSupabaseSession();
    }
  }

  async checkSupabaseSession() {
    if (!this.supabase) return;
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (user) {
        // Fetch user details from user table
        const { data, error } = await this.supabase
          .from('user')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          this.currentUser = data;
          this.setCurrentUser(data);
        }
      }
    } catch (error) {
      console.log('No active session');
    }
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
        min-height: 40px;
        border: 1px solid #dadce0;
        background: #ffffff;
        color: #1a73e8;
        border-radius: 7px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        white-space: nowrap;
      }

      .auth-nav-pill:hover {
        background: #f8fbff;
        border-color: #1a73e8;
      }

      .auth-nav-pill.auth-primary {
        background: #ffffff;
        color: #1a73e8;
        border-color: #dadce0;
      }

      .auth-nav-pill.auth-primary:hover {
        background: #f8fbff;
        color: #1a73e8;
        border-color: #1a73e8;
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

      .profile-subtitle {
        font-size: 12px;
        color: #64748b;
        margin-top: 4px;
        line-height: 1.4;
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

      .history-items {
        display: grid;
        gap: 6px;
        margin: 10px 0;
        padding: 10px;
        border-radius: 10px;
        background: #fff;
      }

      .history-item {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 12px;
        color: #334155;
      }

      .history-item-name {
        font-weight: 700;
      }

      .history-item-detail {
        color: #64748b;
        white-space: nowrap;
      }

      .history-empty {
        padding: 20px;
        text-align: center;
        color: #64748b;
        background: #f8fafc;
        border-radius: 14px;
      }

      .nav-link {
        color: #334155;
        text-decoration: none;
        font-weight: 600;
        font-size: 15px;
        transition: color 0.2s ease;
        cursor: pointer;
      }

      .nav-link:hover {
        color: #2563eb;
      }

      .nav-menu .auth-user-wrap {
        position: relative;
        display: inline-block;
      }

      @media (max-width: 768px) {
        .book-now-btn[data-tooltip-enabled="true"]:disabled::after,
        .book-now-btn[data-tooltip-enabled="true"].disabled::after {
          white-space: normal;
          width: 120px;
          font-size: 12px;
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

CartManager.prototype.getCurrentUser = function() {
  const stored = localStorage.getItem(this.authStateKey);
  return stored ? JSON.parse(stored) : null;
};

CartManager.prototype.isAuthenticated = function() {
  return Boolean(this.getCurrentUser());
};

CartManager.prototype.setCurrentUser = function(user) {
  const mappedUser = {
    id: user.id,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    mobile: user.mobile,
    displayName: [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Customer'
  };
  localStorage.setItem(this.authStateKey, JSON.stringify(mappedUser));
  this.updateAuthControls();
};

CartManager.prototype.clearCurrentUser = function() {
  localStorage.removeItem(this.authStateKey);
  this.updateAuthControls();
};

CartManager.prototype.registerUser = async function(phone, password, firstName = '', lastName = '') {
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Customer';

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await this.supabase
      .from('user')
      .select('*')
      .eq('mobile', phone)
      .single();

    if (existingUser) {
      return { success: false, message: 'This mobile number is already registered.' };
    }

    // Insert into user table directly
    const { data, error } = await this.supabase
      .from('user')
      .insert([{
        first_name: firstName,
        last_name: lastName,
        mobile: phone,
        password,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    this.currentUser = data;
    this.setCurrentUser(data);
    return { success: true, user: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

CartManager.prototype.loginUser = async function(phone, password) {
  try {
    // Fetch user details from user table
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .eq('mobile', phone)
      .eq('password', password)
      .single();

    if (error || !data) {
      return { success: false, message: 'Invalid mobile number or password.' };
    }

    this.currentUser = data;
    this.setCurrentUser(data);
    return { success: true, user: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

CartManager.prototype.logoutUser = async function() {
  if (this.supabase) {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out error:', error);
    }
  }
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

CartManager.prototype.saveOrderToHistory = async function(orderData) {
  const currentUser = this.getCurrentUser();
  if (!currentUser) {
    return { saved: false, error: new Error('Please sign in before placing an order.') };
  }

  if (!this.supabase) {
    return { saved: false, error: new Error('Supabase is not ready. Please reload the page and try again.') };
  }

  try {
    const baseOrderPayload = {
      user_id: currentUser.id,
      service: orderData.service,
      location: orderData.location,
      date: orderData.date,
      slot: orderData.slot,
      total: orderData.total,
      // The current orders.cart_items column is varchar, so store the cart
      // array as JSON text. (Use a jsonb column if you later need to query
      // individual cart items in SQL.)
      cart_items: JSON.stringify(orderData.cartItems),
      created_at: new Date().toISOString()
    };

    const orderPayload = { ...baseOrderPayload };
    if (orderData.name && String(orderData.name).trim()) {
      orderPayload.customer_name = orderData.name.trim();
    }
    if (orderData.phone && String(orderData.phone).trim()) {
      orderPayload.customer_phone = orderData.phone.trim();
    }
    if (orderData.address && String(orderData.address).trim()) {
      orderPayload.address = orderData.address.trim();
    }

    let { data, error } = await this.supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (error && error.message && /customer_name|customer_phone|address|column/i.test(error.message)) {
      const fallbackPayload = { ...baseOrderPayload };
      delete fallbackPayload.customer_name;
      delete fallbackPayload.customer_phone;
      delete fallbackPayload.address;

      ({ data, error } = await this.supabase
        .from('orders')
        .insert([fallbackPayload])
        .select()
        .single());
    }

    if (error) {
      console.error('Error saving order:', error);
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
      const entry = {
        id: `DF-${Date.now()}`,
        userPhone: currentUser.mobile,
        createdAt: new Date().toISOString(),
        ...orderData
      };
      history.unshift(entry);
      localStorage.setItem(this.ordersKey, JSON.stringify(history));
      return { saved: false, data: entry, error };
    }

    return { saved: true, data };
  } catch (error) {
    console.error('Order save error:', error);
    return { saved: false, error };
  }
};

CartManager.prototype.getOrderHistory = async function() {
  const currentUser = this.getCurrentUser();
  if (!currentUser) return [];

  try {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
      return history.filter(entry => entry.userPhone === currentUser.mobile);
    }

    return data || [];
  } catch (error) {
    console.error('Order fetch error:', error);
    return [];
  }
};

CartManager.prototype.getOrderCartItems = function(order) {
  const rawItems = order.cart_items ?? order.cartItems;

  if (Array.isArray(rawItems)) return rawItems;
  if (typeof rawItems !== 'string') return [];

  try {
    const parsedItems = JSON.parse(rawItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
};

CartManager.prototype.escapeHistoryText = function(value) {
  const element = document.createElement('div');
  element.textContent = String(value ?? '—');
  return element.innerHTML;
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

  modal.querySelector('#dirtfreeAuthForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const phone = modal.querySelector('#authPhone').value.trim();
    const password = modal.querySelector('#authPassword').value.trim();
    const firstName = modal.querySelector('#authFirstName')?.value.trim() || '';
    const lastName = modal.querySelector('#authLastName')?.value.trim() || '';
    const mode = modal.querySelector('.auth-tab.active').dataset.mode;

    let result;
    if (mode === 'signup') {
      result = await this.registerUser(phone, password, firstName, lastName);
    } else {
      result = await this.loginUser(phone, password);
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

  // Remove existing Order History link if present
  const oldHistoryLink = document.getElementById('orderHistoryNavLink');
  if (oldHistoryLink) oldHistoryLink.remove();

  // Remove existing auth user wrap if present
  const oldUserWrap = document.getElementById('authUserWrap');
  if (oldUserWrap) oldUserWrap.remove();

  // Remove existing sign in button if present
  const oldSignIn = document.getElementById('signInNavBtn');
  if (oldSignIn) oldSignIn.remove();

  const currentUser = this.getCurrentUser();

  // Always add Order History link (before Services/About)
  const historyLink = document.createElement('a');
  historyLink.id = 'orderHistoryNavLink';
  historyLink.href = '#';
  historyLink.className = 'nav-link';
  historyLink.textContent = 'Order History';
  historyLink.addEventListener('click', (e) => {
    e.preventDefault();
    this.showOrderHistory();
  });

  // Find where to insert (after Services link)
  const servicesLink = navMenu.querySelector('a[href="#services"]');
  if (servicesLink && servicesLink.nextElementSibling) {
    servicesLink.parentNode.insertBefore(historyLink, servicesLink.nextElementSibling);
  } else if (servicesLink) {
    servicesLink.parentNode.appendChild(historyLink);
  }

  // Add auth controls at the end
  if (currentUser) {
    const displayName = currentUser.firstName || currentUser.displayName || 'Customer';
    const formattedPhone = formatDisplayPhone(currentUser.mobile || currentUser.phone || '');
    const signedInText = formattedPhone ? `Signed in with ${formattedPhone}` : 'Signed in';

    const userWrap = document.createElement('div');
    userWrap.id = 'authUserWrap';
    userWrap.className = 'auth-user-wrap';
    userWrap.innerHTML = `
      <button class="auth-nav-pill auth-primary" id="userNavBtn" type="button">${displayName}</button>
      <div class="auth-user-dropdown" id="authUserDropdown">
        <div class="profile-card">
          <div class="profile-name">${displayName}</div>
          <div class="profile-subtitle">${signedInText}</div>
        </div>
        <button type="button" id="authProfileBtn">Profile</button>
        <button type="button" id="authLogoutBtn">Logout</button>
      </div>
    `;
    navMenu.appendChild(userWrap);

    const userButton = userWrap.querySelector('#userNavBtn');
    const dropdown = userWrap.querySelector('#authUserDropdown');
    const logoutButton = userWrap.querySelector('#authLogoutBtn');
    const profileButton = userWrap.querySelector('#authProfileBtn');

    if (userButton && dropdown) {
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
        userWrap.classList.remove('open');
        this.showOrderHistory();
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        await this.logoutUser();
        userWrap.classList.remove('open');
      });
    }
  } else {
    const signInBtn = document.createElement('button');
    signInBtn.id = 'signInNavBtn';
    signInBtn.className = 'auth-nav-pill auth-primary';
    signInBtn.type = 'button';
    signInBtn.textContent = 'Sign In';
    signInBtn.addEventListener('click', () => this.showAuthModal('signin'));
    navMenu.appendChild(signInBtn);
  }
};

function formatDisplayPhone(rawPhone) {
  const normalized = String(rawPhone || '').replace(/\D/g, '');
  if (!normalized) return '';
  if (normalized.length === 10) return `+91 ${normalized}`;
  if (normalized.length === 11 && normalized.startsWith('0')) return `+91 ${normalized.slice(1)}`;
  if (normalized.length === 12 && normalized.startsWith('91')) return `+91 ${normalized.slice(2)}`;
  if (String(rawPhone).trim().startsWith('+')) return String(rawPhone).trim();
  return `+91 ${normalized}`;
}

CartManager.prototype.showOrderHistory = async function() {
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

  list.innerHTML = '<div class="history-empty">Loading orders...</div>';
  const orders = await this.getOrderHistory();

  if (!orders || orders.length === 0) {
    list.innerHTML = '<div class="history-empty">No orders yet. Your first booking will appear here.</div>';
  } else {
    list.innerHTML = orders.map(order => {
      const cartItems = this.getOrderCartItems(order);
      const totalServices = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
      const bookingTitle = totalServices
        ? `Booking · ${totalServices} service${totalServices === 1 ? '' : 's'}`
        : 'Cleaning booking';
      const itemsMarkup = cartItems.length
        ? `<div class="history-items">${cartItems.map(item => {
            const quantity = Number(item.quantity) || 1;
            const itemName = item.tier || item.service || 'Cleaning service';
            const price = Number(item.price) || 0;
            return `<div class="history-item">
              <span class="history-item-name">${this.escapeHistoryText(itemName)}</span>
              <span class="history-item-detail">${quantity} × ₹${price}</span>
            </div>`;
          }).join('')}</div>`
        : '';

      return `
        <div class="history-card">
          <div class="title">${bookingTitle}</div>
          <div class="meta">Order ID: ${this.escapeHistoryText(order.id)}</div>
          <div class="meta">Location: ${this.escapeHistoryText(order.location)}</div>
          <div class="meta">Date: ${this.escapeHistoryText(order.date)} • ${this.escapeHistoryText(order.slot)}</div>
          ${itemsMarkup}
          <div class="meta">Total: ₹${this.escapeHistoryText(order.total || 0)}</div>
        </div>
      `;
    }).join('');
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

  initAdaptiveNavbarTheme(header);
}

function initAdaptiveNavbarTheme(header) {
  const darkSections = document.querySelectorAll('[data-nav-theme="dark"]');
  if (!header || darkSections.length === 0 || !('IntersectionObserver' in window)) return;

  const setHeaderTheme = () => {
    // The header is visually over a dark section while its bottom edge falls
    // within that section. This keeps its text readable while scrolling.
    const headerBottom = header.getBoundingClientRect().bottom;
    const isOnDarkSection = Array.from(darkSections).some((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= headerBottom && bounds.bottom > headerBottom;
    });
    header.classList.toggle('is-on-dark', isOnDarkSection);
  };

  const observer = new IntersectionObserver(setHeaderTheme, {
    threshold: [0, 0.01, 1]
  });

  darkSections.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', setHeaderTheme, { passive: true });
  window.addEventListener('resize', setHeaderTheme);
  setHeaderTheme();
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
