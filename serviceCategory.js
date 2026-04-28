// Service Category Component - Reusable across all locations
const SERVICES_DATA = {
  'Washroom Cleaning': {
    icon: '🚿',
    tiers: [
      {
        name: 'Deep Washroom Cleaning',
        price: 289,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Machine-assisted deep cleaning to remove stains, grime, and bacteria for complete sanitation.',
        features: ['Machine-assisted cleaning', 'Stain removal', 'Germ elimination', 'Complete sanitation'],
        image: 'Images/washroom.png',
        badge: '★ BESTSELLER'
      },
      {
        name: 'Basic Washroom Cleaning',
        price: 189,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Surface cleaning, mopping, mirror cleaning, fixture polishing',
        features: ['Surface cleaning', 'Mopping', 'Mirror cleaning', 'Fixture polishing'],
        image: 'Images/washroom.png'
      }
    ]
  },
  'Kitchen Cleaning': {
    icon: '🍳',
    tiers: [
      {
        name: 'Deep Kitchen Cleaning',
        price: 599,
        duration: '90 mins',
        rating: 4.7,
        reviews: '980',
        description: 'Professional kitchen deep cleaning including appliances, cabinets, and tiles.',
        features: ['Appliance cleaning', 'Cabinet degreasing', 'Tile scrubbing', 'Stove cleaning'],
        image: 'Images/Kitchen.png',
        badge: '★ BESTSELLER'
      },
      {
        name: 'Basic Kitchen Cleaning',
        price: 499,
        duration: '60 mins',
        rating: 4.7,
        reviews: '980',
        description: 'Counter cleaning, sink scrubbing, floor mopping, basic appliance wipe.',
        features: ['Counter cleaning', 'Sink scrubbing', 'Floor mopping', 'Appliance wipe'],
        image: 'Images/Kitchen.png'
      }
    ]
  },
  'Flat Cleaning': {
    icon: '🏠',
    tiers: [
      {
        name: 'Complete Flat Deep Cleaning',
        price: 1999,
        duration: '4 hours',
        rating: 4.9,
        reviews: '2.1K',
        description: 'Comprehensive cleaning of entire flat including all rooms, kitchen, and bathrooms.',
        features: ['All rooms', 'Kitchen', 'Bathrooms', 'Dusting', 'Mopping', 'Vacuuming'],
        image: 'Images/flat.png',
        badge: '★ BESTSELLER'
      },
      {
        name: 'Standard Flat Cleaning',
        price: 1499,
        duration: '3 hours',
        rating: 4.9,
        reviews: '2.1K',
        description: 'Regular flat maintenance cleaning with dusting, sweeping, and mopping.',
        features: ['Dusting', 'Sweeping', 'Mopping', 'Basic cleaning'],
        image: 'Images/flat.png'
      }
    ]
  },
  'Car Cleaning': {
    icon: '🚗',
    tiers: [
      {
        name: 'Car Interior & Exterior Cleaning',
        price: 599,
        duration: '1-2 hours',
        rating: 4.7,
        reviews: '856',
        description: 'Professional interior and exterior car cleaning including seats, carpets, and polish.',
        features: ['Interior vacuuming', 'Seat cleaning', 'Carpet shampooing', 'Exterior wash', 'Polish finish'],
        image: 'Images/Car.png',
        badge: '★ POPULAR'
      }
    ]
  },
  'Water Tank Cleaning': {
    icon: '💧',
    tiers: [
      {
        name: 'Professional Water Tank Cleaning',
        price: 799,
        duration: '2-4 hours',
        rating: 4.8,
        reviews: '743',
        description: 'Deep cleaning and disinfection of overhead water tanks with professional equipment.',
        features: ['Tank inspection', 'Deep scrubbing', 'Disinfection', 'Debris removal', 'Water quality check'],
        image: 'Images/WT.png',
        badge: '★ BESTSELLER'
      }
    ]
  }
};

function initServiceCategory(containerId, selectedService = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const serviceNames = Object.keys(SERVICES_DATA);
  const firstService = selectedService && SERVICES_DATA[selectedService] ? selectedService : serviceNames[0];

  container.innerHTML = `
    <section class="cat-section">
      <div class="container">
        <div class="cat-layout">
          <aside class="cat-sidebar">
            <div class="cat-sidebar-header">Select a service</div>
            <nav class="cat-sidebar-nav">
              ${serviceNames.map((serviceName) => `
                <button class="cat-sidebar-item ${serviceName === firstService ? 'active' : ''}" data-service="${serviceName}">
                  <span class="cat-sidebar-icon">${SERVICES_DATA[serviceName].icon}</span>
                  <span class="cat-sidebar-label">${serviceName}</span>
                </button>
              `).join('')}
            </nav>
          </aside>

          <main class="cat-main">
            <h2 class="cat-main-title">${firstService}</h2>
            <div class="cat-tier-list" id="tierList">
              ${renderTiers(firstService)}
            </div>
          </main>

          <aside class="cat-right-sidebar">
            <div class="cart-info-card">
              <div class="cart-info-header">
                <h3 class="cart-info-title">📦 Your Cart</h3>
                <span class="cart-count-badge">0</span>
              </div>
              <div class="cart-items-display" id="cartItemsDisplay">
                <p class="empty-cart-text">No items yet</p>
              </div>
              <div class="cart-info-footer">
                <div class="cart-total-row">
                  <span>Total:</span>
                  <span class="cart-total-amount">₹0</span>
                </div>
              </div>
            </div>

            <div class="cat-coupon-card">
              <div class="cat-coupon-icon">%</div>
              <div>
                <div class="cat-coupon-title">Get ₹50 coupon</div>
                <div class="cat-coupon-sub">After first service delivery</div>
              </div>
            </div>
            <div class="cat-trust-card">
              <div class="cat-trust-header">
                <h4>DirtFree Promise</h4>
                <div class="cat-trust-seal">✅</div>
              </div>
              <ul class="cat-trust-list">
                <li><span class="cat-trust-check">✓</span>Verified Professionals</li>
                <li><span class="cat-trust-check">✓</span>Safe Chemicals</li>
                <li><span class="cat-trust-check">✓</span>Superior Results</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;

  attachServiceListeners(containerId);
  updateCartDisplay();
}

function renderTiers(serviceName) {
  const service = SERVICES_DATA[serviceName];
  return service.tiers.map(tier => `
    <div class="cat-tier-card">
      <div class="cat-tier-info">
        ${tier.badge ? `<div class="cat-tier-badge"><span class="cat-badge-bestseller">${tier.badge}</span></div>` : ''}
        <h3 class="cat-tier-name">${tier.name}</h3>
        <div class="cat-tier-rating">
          <span class="cat-rating-stars">⭐ ${tier.rating}</span>
          <span class="cat-rating-count">(${tier.reviews} reviews)</span>
        </div>
        <div class="cat-tier-price-row">
          <span class="cat-tier-price">₹${tier.price}</span>
          <span class="cat-tier-duration">• ${tier.duration}</span>
        </div>
        <p class="cat-tier-features">${tier.description}</p>
        <button class="cat-tier-details-btn" onclick="alert('Features: ${tier.features.join(', ')}')">View details</button>
      </div>
      <div class="cat-tier-action">
        <div class="cat-tier-image-wrapper">
          <img src="${tier.image}" alt="${tier.name}" class="cat-tier-image">
          <button class="cat-add-btn" onclick="addToCart('${tier.name}', ${tier.price})">Add</button>
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

  sidebarItems.forEach(item => {
    item.addEventListener('click', function() {
      sidebarItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');

      const serviceName = this.dataset.service;
      mainTitle.textContent = serviceName;
      tierList.innerHTML = renderTiers(serviceName);
    });
  });
}

function addToCart(tierName, price) {
  // Get the current service name from the page title
  const mainTitle = document.querySelector('.cat-main-title');
  const serviceName = mainTitle ? mainTitle.textContent : 'Service';
  
  // Get duration and rating from the tier card
  const tierCards = document.querySelectorAll('.cat-tier-card');
  let duration = '60 mins';
  let rating = 4.8;
  let reviews = '1K';
  
  // Find the matching tier card
  tierCards.forEach(card => {
    if (card.querySelector('.cat-tier-name').textContent === tierName) {
      const durationEl = card.querySelector('.cat-tier-duration');
      const ratingEl = card.querySelector('.cat-rating-stars');
      
      if (durationEl) {
        duration = durationEl.textContent.replace('• ', '');
      }
      if (ratingEl) {
        rating = ratingEl.textContent.replace('⭐ ', '');
      }
    }
  });

  // Add to cart using the cart manager
  if (typeof cart !== 'undefined') {
    cart.addToCart(serviceName, tierName, price, duration, rating, reviews);
    updateCartBadge();
    updateCartDisplay();
    
    // Show success message
    showNotification(`✓ ${tierName} added to cart!`, 'success');
  } else {
    alert(`Added "${tierName}" (₹${price}) to cart!`);
  }
}

// Notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Update cart display in right sidebar
function updateCartDisplay() {
  const cartDisplay = document.getElementById('cartItemsDisplay');
  const countBadge = document.querySelector('.cart-count-badge');
  const totalAmount = document.querySelector('.cart-total-amount');
  
  if (!cartDisplay) return;
  
  if (typeof cart !== 'undefined') {
    const cartItems = cart.getCart();
    const totalCount = cart.getCartCount();
    const totalPrice = cart.getCartTotal();
    
    countBadge.textContent = totalCount;
    totalAmount.textContent = '₹' + totalPrice;
    
    if (cartItems.length === 0) {
      cartDisplay.innerHTML = '<p class="empty-cart-text">No items yet</p>';
    } else {
      cartDisplay.innerHTML = cartItems.map(item => `
        <div class="cart-item-mini">
          <div class="cart-item-mini-info">
            <div class="cart-item-mini-service">${item.service}</div>
            <div class="cart-item-mini-tier">${item.tier}</div>
            <div class="cart-item-mini-price">₹${item.price} × ${item.quantity}</div>
          </div>
          <div class="cart-item-mini-remove" onclick="removeFromCartMini(${item.id})">×</div>
        </div>
      `).join('');
    }
  }
}

// Remove item from cart in mini display
function removeFromCartMini(itemId) {
  if (typeof cart !== 'undefined') {
    cart.removeFromCart(itemId);
    updateCartDisplay();
    updateCartBadge();
  }
}

// Listen for cart changes and update display
if (typeof cart !== 'undefined') {
  // Initial update
  updateCartDisplay();
  
  // Listen for storage changes (from other tabs)
  window.addEventListener('storage', updateCartDisplay);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initServiceCategory('service-category-container');
  });
} else {
  initServiceCategory('service-category-container');
}
