/* global cart, updateCartBadge */

let SERVICE_CATALOG = {};
let SERVICE_LOCATIONS = [];
const KNOWN_CITIES = ['ahmedabad', 'betul', 'chennai', 'ghaziabad', 'indore'];

// Get current location from URL, data attribute, session storage, or known locations
function getCurrentLocation() {
  // Check URL params first
  const urlParams = new URLSearchParams(window.location.search);
  const paramLocation = (urlParams.get('location') || '').toLowerCase();
  if (paramLocation && KNOWN_CITIES.includes(paramLocation)) {
    sessionStorage.setItem('dirtfree-location', paramLocation);
    return paramLocation;
  }

  // Check body data attribute
  const bodyLocation = (document.body.dataset.location || '').toLowerCase();
  if (bodyLocation && KNOWN_CITIES.includes(bodyLocation)) {
    sessionStorage.setItem('dirtfree-location', bodyLocation);
    return bodyLocation;
  }

  // Check page filename only if it's a known city (not "service", "booking", etc)
  const pageFile = window.location.pathname.split('/').pop().replace('.html', '').toLowerCase();
  if (pageFile && KNOWN_CITIES.includes(pageFile)) {
    sessionStorage.setItem('dirtfree-location', pageFile);
    return pageFile;
  }

  // Check path parts for known cities
  const pathParts = window.location.pathname.split('/').filter(p => p);
  for (let part of pathParts) {
    const cleanPart = part.replace('.html', '').toLowerCase();
    if (KNOWN_CITIES.includes(cleanPart)) {
      sessionStorage.setItem('dirtfree-location', cleanPart);
      return cleanPart;
    }
  }

  // Check session storage as fallback
  const storedLocation = sessionStorage.getItem('dirtfree-location');
  if (storedLocation && KNOWN_CITIES.includes(storedLocation)) {
    return storedLocation;
  }

  return null;
}

// Set location explicitly and refresh UI
function setLocation(location) {
  const normalized = String(location || '').toLowerCase();
  if (KNOWN_CITIES.includes(normalized)) {
    sessionStorage.setItem('dirtfree-location', normalized);
    refreshServiceData();
    return true;
  }
  return false;
}

// Change location and show picker
function changeLocation() {
  sessionStorage.removeItem('dirtfree-location');
  const container = document.getElementById('service-category-container');
  if (container) {
    container.innerHTML = '';
    showLocationPickerModal();
  }
}

// Refresh service data and prices for current location
function refreshServiceData() {
  const container = document.getElementById('service-category-container');
  if (container) {
    const currentServiceName = document.querySelector('.cat-main-title')?.dataset.serviceName || null;
    initServiceCategory('service-category-container', currentServiceName);
  }
}

// Get price for a specific service and tier in the current location
function getPrice(serviceName, tierName) {
  const service = getServicesData()[serviceName];
  const tier = service?.tiers.find((item) => item.name === tierName);
  return tier?.price ?? 0;
}

function getServicesData() {
  return SERVICE_CATALOG || {};
}

function getServiceDisplayName(serviceName) {
  return getServicesData()[serviceName]?.title || serviceName;
}

function resolveServiceName(serviceName) {
  const catalog = getServicesData();
  if (catalog[serviceName]) return serviceName;

  const keys = Object.keys(catalog);
  return keys.find((key) => catalog[key].title === serviceName) || keys[0] || '';
}

function formatPrice(price) {
  return `&#8377;${price}`;
}

function getTierPriceLabel(tier, price) {
  return tier.isCustomQuote ? 'Custom Quote' : formatPrice(price);
}

function capitalize(str) {
  return String(str || '').replace(/\b\w/g, (char) => char.toUpperCase());
}

function findTier(serviceName, tierName) {
  return getServicesData()[serviceName]?.tiers.find((tier) => tier.name === tierName) || null;
}

async function fetchServicesFromSupabase() {
  if (!window.supabase) {
    return;
  }

  try {
    const location = getCurrentLocation();
    const query = window.supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })
      .order('tier', { ascending: true });

    if (location) {
      query.in('location', [location, 'all']);
    }

    const { data, error } = await query;

    if (error || !Array.isArray(data) || data.length === 0) {
      return;
    }

    const catalog = {};
    const locations = new Set();
    const serviceRows = {};

    data.forEach((row) => {
      const rowLocation = String(row.location || '').toLowerCase();
      if (rowLocation) locations.add(rowLocation);

      const serviceKey = `${row.category}||${row.tier}||${row.name}`;
      const existing = serviceRows[serviceKey];

      if (existing) {
        if (existing.location === 'all' && rowLocation !== 'all') {
          serviceRows[serviceKey] = row;
        }
        return;
      }

      serviceRows[serviceKey] = row;
    });

    Object.values(serviceRows).forEach((row) => {
      const category = row.category || row.name || 'Unknown Service';
      const title = row.title || row.name || category;
      const tierName = row.tier || row.name || title;

      if (!catalog[category]) {
        catalog[category] = {
          title,
          tiers: []
        };
      }

      catalog[category].tiers.push({
        name: tierName,
        price: row.price ?? null,
        duration: row.duration || '60 mins',
        rating: row.rating ?? 4.8,
        reviews: row.reviews || '1K',
        description: row.description || row.details_summary || '',
        image: row.image || 'Images/washroom.jpg',
        badge: row.badge || '',
        detailsSummary: row.details_summary || row.description || '',
        included: Array.isArray(row.included) ? row.included : [],
        excluded: Array.isArray(row.excluded) ? row.excluded : []
      });
    });

    if (Object.keys(catalog).length) {
      SERVICE_CATALOG = catalog;
      SERVICE_LOCATIONS = Array.from(locations);
    }
  } catch (err) {
    console.warn('Could not load service catalog from Supabase:', err);
  }
}

function showLocationPickerModal() {
  const existingModal = document.getElementById('serviceLocationPickerModal');
  if (existingModal) {
    existingModal.remove();
  }

  const CITIES = KNOWN_CITIES.map(city => city.charAt(0).toUpperCase() + city.slice(1));
  const modal = document.createElement('div');
  modal.id = 'serviceLocationPickerModal';
  modal.innerHTML = `
    <div class="location-picker-overlay">
      <div class="location-picker-dialog">
        <div class="location-picker-header">
          <h2>Select Your City</h2>
          <p>Choose a city to browse available services</p>
        </div>
        <div class="location-picker-grid">
          ${CITIES.map(city => `
            <button type="button" class="location-picker-btn" data-location="${city.toLowerCase()}">
              <span class="location-picker-emoji">📍</span>
              <span class="location-picker-name">${city}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    <style>
      #serviceLocationPickerModal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .location-picker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .location-picker-dialog {
        background: white;
        border-radius: 16px;
        padding: 32px 24px;
        max-width: 480px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .location-picker-header {
        text-align: center;
        margin-bottom: 28px;
      }

      .location-picker-header h2 {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        margin: 0 0 8px 0;
      }

      .location-picker-header p {
        font-size: 14px;
        color: #64748b;
        margin: 0;
      }

      .location-picker-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .location-picker-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
      }

      .location-picker-btn:hover {
        border-color: #4a90e2;
        background: #f0f4ff;
        transform: translateY(-2px);
      }

      .location-picker-emoji {
        font-size: 24px;
      }

      .location-picker-name {
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
      }

      @media (max-width: 480px) {
        .location-picker-dialog {
          padding: 24px 16px;
        }

        .location-picker-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('.location-picker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const location = btn.dataset.location;
      setLocation(location);
      modal.remove();
      initServiceCategory('service-category-container');
    });
  });
}

async function initServiceCategory(containerId, selectedService = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentLocation = getCurrentLocation();
  if (!currentLocation) {
    container.innerHTML = '';
    showLocationPickerModal();
    return;
  }

  await fetchServicesFromSupabase();
  
  const serviceNames = Object.keys(getServicesData());
  if (serviceNames.length === 0) {
    container.innerHTML = `
      <div class="service-loading-error">
        <p>No services are available in ${capitalize(currentLocation)} yet. Please check back soon or try another location.</p>
        <button type="button" onclick="changeLocation()" class="card-btn" style="margin-top: 16px;">Change Location</button>
      </div>`;
    return;
  }

  const firstService = selectedService ? resolveServiceName(selectedService) : serviceNames[0] || serviceNames[0];

  container.innerHTML = `
    <section class="cat-section">
      <div class="container">
        <div class="cat-layout">
          <aside class="cat-sidebar">
            <div class="cat-sidebar-header">Select a service</div>
            <nav class="cat-sidebar-nav">
              ${serviceNames.map((serviceName) => `
                <button class="cat-sidebar-item ${serviceName === firstService ? 'active' : ''}" data-service="${serviceName}">
                  <span class="cat-sidebar-label">${getServiceDisplayName(serviceName)}</span>
                </button>
              `).join('')}
            </nav>
          </aside>

          <main class="cat-main">
            <h2 class="cat-main-title" data-service-name="${firstService}">${getServiceDisplayName(firstService)}</h2>
            <div class="cat-tier-list" id="tierList">
              ${renderTiers(firstService)}
            </div>
          </main>

          <aside class="cat-right-sidebar">
            <div class="cart-info-card">
              <div class="cart-info-header">
                <h3 class="cart-info-title">Your Cart</h3>
                <span class="cart-count-badge">0</span>
              </div>
              <div class="cart-items-display" id="cartItemsDisplay">
                <p class="empty-cart-text">No items yet</p>
              </div>
              <div class="cart-info-footer">
                <div class="cart-total-row">
                  <span>Total:</span>
                  <span class="cart-total-amount">&#8377;0</span>
                </div>
              </div>
            </div>

            <div class="cat-trust-card">
              <div class="cat-trust-header">
                <h4>DirtFree Promise</h4>
              </div>
              <ul class="cat-trust-list">
                <li><span class="cat-trust-check">+</span>Verified Professionals</li>
                <li><span class="cat-trust-check">+</span>Safe Chemicals</li>
                <li><span class="cat-trust-check">+</span>Superior Results</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div class="cat-details-modal" id="catDetailsModal" aria-hidden="true">
      <div class="cat-details-backdrop" data-close-modal="true"></div>
      <div class="cat-details-dialog" role="dialog" aria-modal="true" aria-labelledby="catDetailsTitle">
        <button class="cat-details-close" type="button" aria-label="Close details" data-close-modal="true">x</button>
        <h3 class="cat-details-title" id="catDetailsTitle"></h3>
        <p class="cat-details-summary" id="catDetailsSummary"></p>
        <div class="cat-details-section">
          <h4 class="cat-details-section-title cat-details-section-title-included">What's Included</h4>
          <ul class="cat-details-list" id="catDetailsIncluded"></ul>
        </div>
        <div class="cat-details-section">
          <h4 class="cat-details-section-title cat-details-section-title-excluded">Not Included</h4>
          <ul class="cat-details-list" id="catDetailsExcluded"></ul>
        </div>
      </div>
    </div>
  `;

  attachServiceListeners(containerId);
  updateCartDisplay();
}

function renderTiers(serviceName) {
  const service = getServicesData()[serviceName];
  if (!service || !Array.isArray(service.tiers)) {
    return '<p class="service-loading-error">Service information is not available.</p>';
  }
  return service.tiers.map((tier) => {
    const price = getPrice(serviceName, tier.name);
    const safeTierName = tier.name.replace(/'/g, "\\'");
    const tierPrice = getTierPriceLabel(tier, price);
    const actionButton = `<div class="cat-cart-control" data-tier="${tier.name}">
            <button class="cat-add-btn" type="button" data-tier="${tier.name}" onclick="addToCart('${safeTierName}', ${price})">Add</button>
          </div>`;
    return `
    <div class="cat-tier-card">
      <div class="cat-tier-info">
        ${tier.badge ? `<div class="cat-tier-badge"><span class="cat-badge-bestseller">${tier.badge}</span></div>` : ''}
        <h3 class="cat-tier-name">${tier.name}</h3>
        <div class="cat-tier-rating">
          <span class="cat-rating-stars">* ${tier.rating}</span>
          <span class="cat-rating-count">(${tier.reviews} reviews)</span>
        </div>
        <div class="cat-tier-price-row">
          <span class="cat-tier-price">${tierPrice}</span>
          <span class="cat-tier-duration">&bull; ${tier.duration}</span>
        </div>
        <p class="cat-tier-features">${tier.description}</p>
        <button class="cat-tier-details-btn" type="button" onclick="openTierDetails('${serviceName}', '${safeTierName}')">View details</button>
      </div>
      <div class="cat-tier-action">
        <div class="cat-tier-image-wrapper">
          <img src="${tier.image}" alt="${tier.name}" class="cat-tier-image" loading="lazy" decoding="async">
          ${actionButton}
        </div>
      </div>
    </div>
  `; }).join('');
}

function attachServiceListeners(containerId) {
  const container = document.getElementById(containerId);
  const sidebarItems = container.querySelectorAll('.cat-sidebar-item');
  const tierList = container.querySelector('#tierList');
  const mainTitle = container.querySelector('.cat-main-title');
  const modal = container.querySelector('#catDetailsModal');

  sidebarItems.forEach((item) => {
    item.addEventListener('click', function() {
      sidebarItems.forEach((sidebarItem) => sidebarItem.classList.remove('active'));
      this.classList.add('active');

      const serviceName = this.dataset.service;
      mainTitle.textContent = getServiceDisplayName(serviceName);
      mainTitle.dataset.serviceName = serviceName;
      tierList.innerHTML = renderTiers(serviceName);
      updateCartDisplay();
    });
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-modal="true"]')) {
        closeTierDetails();
      }
    });
  }

  if (!document.body.dataset.catDetailsEscapeBound) {
    document.addEventListener('keydown', handleDetailsEscape);
    document.body.dataset.catDetailsEscapeBound = 'true';
  }
}

function getCurrentServiceName() {
  return document.querySelector('.cat-main-title')?.dataset.serviceName || '';
}

function openTierDetails(serviceName, tierName) {
  const tier = findTier(serviceName, tierName);
  const modal = document.getElementById('catDetailsModal');

  if (!tier || !modal) return;

  const included = Array.isArray(tier.included) ? tier.included : [];
  const excluded = Array.isArray(tier.excluded) ? tier.excluded : [];

  document.getElementById('catDetailsTitle').textContent = tier.name;
  document.getElementById('catDetailsSummary').textContent = tier.detailsSummary || tier.description;
  document.getElementById('catDetailsIncluded').innerHTML = tier.included.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('catDetailsExcluded').innerHTML = tier.excluded.map((item) => `<li>${item}</li>`).join('');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cat-modal-open');
}

function closeTierDetails() {
  const modal = document.getElementById('catDetailsModal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cat-modal-open');
}

function handleDetailsEscape(event) {
  if (event.key === 'Escape') {
    closeTierDetails();
  }
}

function addToCart(tierName, price) {
  const serviceName = getCurrentServiceName();
  const tier = findTier(serviceName, tierName);
  const duration = tier?.duration || '60 mins';
  const rating = tier?.rating || 4.8;
  const reviews = tier?.reviews || '1K';

  if (typeof cart !== 'undefined') {
    cart.addToCart(serviceName, tierName, price, duration, rating, reviews);
    updateCartBadge();
    updateCartDisplay();
    showNotification(`${tierName} added to cart`, 'success');
  } else {
    showNotification(`${tierName} added to cart`, 'success');
  }
}

function showNotification(message, type = 'info') {
  let snackbar = document.getElementById('cartSnackbar');

  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'cartSnackbar';
    snackbar.innerHTML = `
      <span class="snackbar-status"></span>
      <span class="snackbar-message"></span>
      <a class="snackbar-action" href="booking.html">View cart</a>
    `;
    document.body.appendChild(snackbar);
  }

  snackbar.className = `cart-snackbar cart-snackbar-${type}`;
  snackbar.querySelector('.snackbar-status').textContent = type === 'success' ? 'Added' : 'Notice';
  snackbar.querySelector('.snackbar-message').textContent = message;

  window.clearTimeout(snackbar.hideTimer);
  snackbar.classList.add('show');

  snackbar.hideTimer = window.setTimeout(() => {
    snackbar.classList.remove('show');
  }, 2800);
}

const style = document.createElement('style');
style.textContent = `
  .cart-snackbar {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translate(-50%, 120%);
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    width: min(92vw, 520px);
    padding: 14px 16px;
    border: 1px solid rgba(148, 163, 184, 0.24);
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.94);
    color: #ffffff;
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.28);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    opacity: 0;
    pointer-events: none;
    z-index: 10000;
    transition: transform 0.26s ease, opacity 0.26s ease;
  }

  .cart-snackbar.show {
    transform: translate(-50%, 0);
    opacity: 1;
    pointer-events: auto;
  }

  .snackbar-status {
    padding: 6px 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, #10b981, #06b6d4);
    font-size: 12px;
    font-weight: 800;
    color: #ffffff;
  }

  .snackbar-message {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
  }

  .snackbar-action {
    color: #93c5fd;
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
    white-space: nowrap;
  }

  .snackbar-action:hover {
    color: #ffffff;
  }

  @media (max-width: 560px) {
    .cart-snackbar {
      bottom: 16px;
      grid-template-columns: 1fr auto;
    }

    .snackbar-status {
      display: none;
    }
  }
`;
document.head.appendChild(style);

function updateCartDisplay() {
  const cartDisplay = document.getElementById('cartItemsDisplay');
  const countBadge = document.querySelector('.cart-count-badge');
  const totalAmount = document.querySelector('.cart-total-amount');

  if (!cartDisplay) return;

  if (typeof cart !== 'undefined') {
    const cartItems = cart.getCart();
    const totalCount = cart.getCartCount();
    const totalPrice = cart.getCartTotal();

    if (countBadge) countBadge.textContent = totalCount;
    if (totalAmount) totalAmount.innerHTML = formatPrice(totalPrice);

    if (cartItems.length === 0) {
      cartDisplay.innerHTML = '<p class="empty-cart-text">No items yet</p>';
    } else {
      cartDisplay.innerHTML = cartItems.map((item) => `
        <div class="cart-item-mini">
          <div class="cart-item-mini-info">
            <div class="cart-item-mini-service">${getServiceDisplayName(item.service)}</div>
            <div class="cart-item-mini-tier">${item.tier}</div>
            <div class="cart-item-mini-price">${formatPrice(item.price)} x ${item.quantity}</div>
          </div>
          <div class="cart-item-mini-remove" onclick="removeFromCartMini(${item.id})">x</div>
        </div>
      `).join('');
    }

    updateAddButtonCounts(cartItems);
  }
}

function updateAddButtonCounts(cartItems = null) {
  if (typeof cart === 'undefined') return;

  const items = cartItems || cart.getCart();
  const serviceName = getCurrentServiceName();
  const cartControls = document.querySelectorAll('.cat-cart-control[data-tier]');

  cartControls.forEach((control) => {
    const tierName = control.dataset.tier;
    const matchingItem = items.find((item) => item.service === serviceName && item.tier === tierName);

    if (matchingItem) {
      control.innerHTML = `
        <button class="cat-qty-btn" type="button" aria-label="Decrease ${tierName}" onclick="decreaseCartItem(${matchingItem.id})">-</button>
        <span class="cat-qty-count">${matchingItem.quantity}</span>
        <button class="cat-qty-btn" type="button" aria-label="Increase ${tierName}" onclick="increaseCartItem(${matchingItem.id})">+</button>
      `;
      control.classList.add('has-items');
    } else {
      const price = getPrice(serviceName, tierName);
      control.innerHTML = `<button class="cat-add-btn" type="button" data-tier="${tierName}" onclick="addToCart('${tierName.replace(/'/g, "\\'")}', ${price})">Add</button>`;
      control.classList.remove('has-items');
    }
  });
}

function increaseCartItem(itemId) {
  if (typeof cart === 'undefined') return;

  const item = cart.getCart().find((cartItem) => cartItem.id === itemId);
  if (!item) return;

  cart.updateQuantity(itemId, item.quantity + 1);
  updateCartDisplay();
  updateCartBadge();
}

function decreaseCartItem(itemId) {
  if (typeof cart === 'undefined') return;

  const item = cart.getCart().find((cartItem) => cartItem.id === itemId);
  if (!item) return;

  if (item.quantity <= 1) {
    cart.removeFromCart(itemId);
  } else {
    cart.updateQuantity(itemId, item.quantity - 1);
  }

  updateCartDisplay();
  updateCartBadge();
}

function removeFromCartMini(itemId) {
  if (typeof cart !== 'undefined') {
    cart.removeFromCart(itemId);
    updateCartDisplay();
    updateCartBadge();
  }
}

if (typeof cart !== 'undefined') {
  updateCartDisplay();
  window.addEventListener('storage', updateCartDisplay);
}

window.initServiceCategory = initServiceCategory;
window.openTierDetails = openTierDetails;
window.closeTierDetails = closeTierDetails;
window.addToCart = addToCart;
window.increaseCartItem = increaseCartItem;
window.decreaseCartItem = decreaseCartItem;
window.removeFromCartMini = removeFromCartMini;
window.getCurrentLocation = getCurrentLocation;
window.setLocation = setLocation;
window.changeLocation = changeLocation;
window.getPrice = getPrice;
window.refreshServiceData = refreshServiceData;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Clear cached location only on dedicated location pages with data-location attribute
    if (document.body.dataset.location) {
      sessionStorage.removeItem('dirtfree-location');
    }
    initServiceCategory('service-category-container');
  });
} else {
  // Clear cached location only on dedicated location pages with data-location attribute
  if (document.body.dataset.location) {
    sessionStorage.removeItem('dirtfree-location');
  }
  initServiceCategory('service-category-container');
}
