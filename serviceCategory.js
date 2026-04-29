/* global cart, updateCartBadge */

const SERVICES_DATA = {
  'Washroom Cleaning': {
    title: 'Bathroom Cleaning',
    tiers: [
      {
        name: 'Deep Washroom Cleaning',
        price: 289,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Machine-assisted deep cleaning to remove stains, grime, and bacteria for complete sanitation.',
        image: 'Images/washroom.png',
        badge: 'BESTSELLER',
        detailsSummary: 'Machine-assisted deep bathroom cleaning.',
        included: [
          'Deep cleaning of toilet seat, washbasin, taps and tiles',
          'Stain removal from key bathroom surfaces',
          'Mirror and fixture cleaning',
          'Floor scrubbing and mopping',
          'Germ control for improved sanitation'
        ],
        excluded: [
          'Ceiling and exhaust fan dismantling',
          'Major repair or plumbing work',
          'Acid damage and permanent stain reversal',
          'Cleaning in inaccessible shaft areas'
        ]
      },
      {
        name: 'Basic Washroom Cleaning',
        price: 189,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Surface cleaning, mopping, mirror cleaning, fixture polishing',
        image: 'Images/washroom.png',
        detailsSummary: 'Surface-level bathroom cleaning.',
        included: [
          'Surface cleaning of toilet, washbasin and taps',
          'Mirror cleaning and fixture polishing',
          'Floor mopping',
          'Basic tile wipe-down'
        ],
        excluded: [
          'Machine-assisted stain removal',
          'Hard water deposit treatment',
          'Deep grout scrubbing',
          'Ceiling and wall washing'
        ]
      }
    ]
  },
  'Kitchen Cleaning': {
    title: 'Kitchen Cleaning',
    tiers: [
      {
        name: 'Kitchen Deep Cleaning',
        price: 499,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Complete cleaning of kitchen surfaces to remove oil, grease, and dirt, ensuring a clean and hygienic cooking space.',
        image: 'Images/Kitchen.png',
        badge: 'BESTSELLER',
        detailsSummary: 'Deep kitchen cleaning for daily cooking zones.',
        included: [
          'Degreasing of visible kitchen surfaces',
          'Cleaning of countertop, sink and backsplash',
          'Exterior wiping of cabinets and drawers',
          'Hob and chimney exterior cleaning',
          'Floor cleaning and mopping'
        ],
        excluded: [
          'Internal cleaning of appliances',
          'Dismantling of chimney filters',
          'Pest-control treatment',
          'Carpentry or plumbing work'
        ]
      },
      {
        name: 'Modular Kitchen Deep Cleaning',
        price: 1199,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Intensive removal of oil, grease, and food residue from all key modular kitchen surfaces for a hygienic cooking space.',
        image: 'Images/Kitchen.png',
        detailsSummary: 'Detailed modular kitchen cleaning.',
        included: [
          'Deep cleaning of shutters, drawers and shelves',
          'Degreasing of cabinet exteriors and accessible interiors',
          'Countertop, sink and backsplash cleaning',
          'Hob and chimney exterior cleaning',
          'Floor scrubbing and mopping'
        ],
        excluded: [
          'Full appliance servicing',
          'Removal of permanently damaged laminate marks',
          'Pest-control treatment',
          'Cleaning inside sealed or inaccessible sections'
        ]
      }
    ]
  },
  'Flat Cleaning': {
    title: 'Home Cleaning',
    tiers: [
      {
        name: '1 BHK Flat Cleaning',
        price: 1499,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Thorough deep cleaning for unfurnished 1 BHK flats, covering all essential living areas.',
        image: 'Images/flat.png',
        badge: 'BESTSELLER',
        detailsSummary: 'Unfurnished flat deep cleaning.',
        included: [
          'Deep cleaning of living room, bedroom, kitchen, bathroom and balcony',
          'Floor sweeping, mopping and machine scrubbing where required',
          'Dusting of ceilings, fans, switchboards and light fixtures',
          'Kitchen slab, tiles and sink cleaning',
          'Bathroom deep cleaning including toilet seat, washbasin, taps and tiles',
          'Side walls, partition glass and stain removal'
        ],
        excluded: [
          'Furnished interiors and furniture cleaning',
          'Glue, paint stain or sticker removal',
          'Terrace cleaning or inaccessible areas',
          'Wet wiping of walls and ceilings',
          'Window tracks and mirror cleaning',
          'Acid damage, permanent stains, or etched surfaces'
        ]
      },
      {
        name: '2 BHK Flat Cleaning',
        price: 2499,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Comprehensive deep cleaning for unfurnished 2 BHK flats, ensuring complete hygiene and freshness.',
        image: 'Images/flat.png',
        detailsSummary: 'Unfurnished flat deep cleaning.',
        included: [
          'Deep cleaning of all rooms, kitchen, bathrooms and balcony',
          'Floor sweeping, mopping and machine scrubbing where required',
          'Dusting of ceilings, fans, switchboards and light fixtures',
          'Kitchen slab, tiles and sink cleaning',
          'Bathroom deep cleaning including toilet seat, washbasin, taps and tiles',
          'Side walls, partition glass and stain removal'
        ],
        excluded: [
          'Furnished interiors and furniture cleaning',
          'Glue, paint stain or sticker removal',
          'Terrace cleaning or inaccessible areas',
          'Wet wiping of walls and ceilings',
          'Window tracks and mirror cleaning',
          'Acid damage, permanent stains, or etched surfaces'
        ]
      },
      {
        name: '3 BHK Flat Cleaning',
        price: 3499,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'End-to-end deep cleaning for unfurnished 3 BHK flats with detailed attention to every room.',
        image: 'Images/flat.png',
        detailsSummary: 'Unfurnished flat deep cleaning.',
        included: [
          'Deep cleaning of all rooms, kitchen, bathrooms and balcony',
          'Floor sweeping, mopping and machine scrubbing where required',
          'Dusting of ceilings, fans, switchboards and light fixtures',
          'Kitchen slab, tiles and sink cleaning',
          'Bathroom deep cleaning including toilet seat, washbasin, taps and tiles',
          'Side walls, partition glass and stain removal'
        ],
        excluded: [
          'Furnished interiors and furniture cleaning',
          'Glue, paint stain or sticker removal',
          'Terrace cleaning or inaccessible areas',
          'Wet wiping of walls and ceilings',
          'Window tracks and mirror cleaning',
          'Acid damage, permanent stains, or etched surfaces'
        ]
      }
    ]
  },
  'Car Cleaning': {
    title: 'Car Cleaning',
    tiers: [
      {
        name: 'Car Interior & Exterior Cleaning',
        price: 599,
        duration: '1-2 hours',
        rating: 4.7,
        reviews: '856',
        description: 'Professional interior and exterior car cleaning including seats, carpets, and polish.',
        image: 'Images/Car.png',
        badge: 'POPULAR',
        detailsSummary: 'Interior and exterior car cleaning.',
        included: [
          'Interior vacuuming',
          'Seat cleaning',
          'Carpet shampooing',
          'Exterior wash',
          'Polish finish'
        ],
        excluded: [
          'Mechanical servicing',
          'Scratch repair',
          'Paint restoration'
        ]
      }
    ]
  },
  'Water Tank Cleaning': {
    title: 'Water Tank Cleaning',
    tiers: [
      {
        name: 'Professional Water Tank Cleaning',
        price: 799,
        duration: '2-4 hours',
        rating: 4.8,
        reviews: '743',
        description: 'Deep cleaning and disinfection of overhead water tanks with professional equipment.',
        image: 'Images/WT.png',
        badge: 'BESTSELLER',
        detailsSummary: 'Water tank deep cleaning.',
        included: [
          'Tank inspection',
          'Deep scrubbing',
          'Disinfection',
          'Debris removal',
          'Water quality check'
        ],
        excluded: [
          'Structural repair',
          'Plumbing replacement',
          'Civil work'
        ]
      }
    ]
  }
};

function getServiceDisplayName(serviceName) {
  return SERVICES_DATA[serviceName]?.title || serviceName;
}

function resolveServiceName(serviceName) {
  if (SERVICES_DATA[serviceName]) return serviceName;

  return Object.keys(SERVICES_DATA).find(
    (key) => SERVICES_DATA[key].title === serviceName
  ) || Object.keys(SERVICES_DATA)[0];
}

function formatPrice(price) {
  return `&#8377;${price}`;
}

function findTier(serviceName, tierName) {
  return SERVICES_DATA[serviceName]?.tiers.find((tier) => tier.name === tierName) || null;
}

function initServiceCategory(containerId, selectedService = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const serviceNames = Object.keys(SERVICES_DATA);
  const firstService = selectedService ? resolveServiceName(selectedService) : serviceNames[0];

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
                <div class="cat-trust-seal">OK</div>
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
  const service = SERVICES_DATA[serviceName];
  return service.tiers.map((tier) => `
    <div class="cat-tier-card">
      <div class="cat-tier-info">
        ${tier.badge ? `<div class="cat-tier-badge"><span class="cat-badge-bestseller">${tier.badge}</span></div>` : ''}
        <h3 class="cat-tier-name">${tier.name}</h3>
        <div class="cat-tier-rating">
          <span class="cat-rating-stars">* ${tier.rating}</span>
          <span class="cat-rating-count">(${tier.reviews} reviews)</span>
        </div>
        <div class="cat-tier-price-row">
          <span class="cat-tier-price">${formatPrice(tier.price)}</span>
          <span class="cat-tier-duration">&bull; ${tier.duration}</span>
        </div>
        <p class="cat-tier-features">${tier.description}</p>
        <button class="cat-tier-details-btn" type="button" onclick="openTierDetails('${serviceName}', '${tier.name.replace(/'/g, "\\'")}')">View details</button>
      </div>
      <div class="cat-tier-action">
        <div class="cat-tier-image-wrapper">
          <img src="${tier.image}" alt="${tier.name}" class="cat-tier-image">
          <div class="cat-cart-control" data-tier="${tier.name}">
            <button class="cat-add-btn" type="button" data-tier="${tier.name}" onclick="addToCart('${tier.name.replace(/'/g, "\\'")}', ${tier.price})">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
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
      const tier = findTier(serviceName, tierName);
      control.innerHTML = `<button class="cat-add-btn" type="button" data-tier="${tierName}" onclick="addToCart('${tierName.replace(/'/g, "\\'")}', ${tier?.price || 0})">Add</button>`;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initServiceCategory('service-category-container');
  });
} else {
  initServiceCategory('service-category-container');
}
