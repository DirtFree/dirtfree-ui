// Cart Management System
class CartManager {
  constructor() {
    this.cartKey = 'dirtfree_cart';
    this.locationKey = 'dirtfree_location';
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
        top: -7px;
        right: -7px;
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

// Initialize cart manager
window.cart = new CartManager();
const cart = window.cart;

// Update button state on page load
document.addEventListener('DOMContentLoaded', function() {
  initMobileNavbar();
  cart.updateBookNowButton();
  updateCartBadge();
});

function initMobileNavbar() {
  const header = document.querySelector('.main-header');
  const headerContainer = document.querySelector('.header-container');
  const navMenu = document.querySelector('.nav-menu');

  if (!header || !headerContainer || !navMenu || document.querySelector('.nav-toggle')) return;

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
