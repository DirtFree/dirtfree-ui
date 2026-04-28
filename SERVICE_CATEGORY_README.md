# Service Category Component - Documentation

## Overview
The Service Category Component is a reusable, responsive UI component that displays cleaning services with the ability to switch between different service types. It's designed to work across all location pages (Ahmedabad, Betul, Chennai, Ghaziabad, Indore) with minimal setup.

## Features
✅ **Interactive Service Selection** - Click sidebar buttons to switch between services
✅ **Service Tiers** - Each service displays multiple pricing tiers with full details
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
✅ **Trust Indicators** - Coupon and trust card sidebars for credibility
✅ **Customizable Data** - Easy to modify services, prices, and descriptions
✅ **Reusable Component** - One code base for all location pages

## Files Included

1. **serviceCategory.js** - Main component logic
2. **serviceCategory.css** - Styling for the component
3. **Location HTML files** - Updated (ahmedabad.html, betul.html, chennai.html, ghaziabad.html, indore.html)

## How to Use

### Basic Implementation
Add these three lines to any HTML page:

```html
<!-- CSS Link (in <head> section) -->
<link rel="stylesheet" href="serviceCategory.css">

<!-- Component Container (in <body> section) -->
<div id="service-category-container"></div>

<!-- JavaScript (before closing </body> tag) -->
<script src="serviceCategory.js"></script>
```

### Component Structure

The component automatically renders with:

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR          │  MAIN CONTENT       │  RIGHT BAR │
│  • Washroom   ✓   │  Service Title      │  % Coupon  │
│  • Kitchen        │  [Tier Cards]       │  ✅ Trust   │
│  • Flat           │    - Name           │            │
│                   │    - Price          │            │
│                   │    - Rating         │            │
│                   │    - Add Button     │            │
└─────────────────────────────────────────────────────┘
```

## Customizing Services

To modify services, edit `serviceCategory.js` - update the `SERVICES_DATA` object:

```javascript
const SERVICES_DATA = {
  'Service Name': {
    icon: '🎯',  // Emoji for sidebar
    tiers: [
      {
        name: 'Tier Name',
        price: 299,
        duration: '60 mins',
        rating: 4.8,
        reviews: '1.2K',
        description: 'Service description...',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        image: 'Images/image.png',
        badge: '★ BESTSELLER'  // Optional
      }
    ]
  }
};
```

## Current Services

### 1. Washroom Cleaning 🚿
- **Deep Washroom Cleaning** - ₹289 (60 mins)
- **Basic Washroom Cleaning** - ₹189 (60 mins)

### 2. Kitchen Cleaning 🍳
- **Deep Kitchen Cleaning** - ₹599 (90 mins)
- **Basic Kitchen Cleaning** - ₹499 (60 mins)

### 3. Flat Cleaning 🏠
- **Complete Flat Deep Cleaning** - ₹1999 (4 hours)
- **Standard Flat Cleaning** - ₹1499 (3 hours)

## Customization Options

### Colors
Edit the CSS variables in `serviceCategory.css`:
- Primary color: `#4A90E2` (blue)
- Accent color: `#FF6B6B` (red for bestseller)
- Background: gradient blues

### Responsive Breakpoints
- **Desktop**: Full 3-column layout (1024px+)
- **Tablet**: 1-column with flex sidebar (1024px and below)
- **Mobile**: Single column, hidden labels on services (768px and below)

### Add to Cart Logic
Modify the `addToCart()` function in `serviceCategory.js` to connect to your backend:

```javascript
function addToCart(tierName, price) {
  // Replace alert() with your cart logic
  console.log('Adding to cart:', tierName, price);
  // Example: sendToBackend({ service: tierName, price: price })
}
```

### View Details Logic
Modify the button in the tier card to link to detailed pages:

```html
<button class="cat-tier-details-btn" 
        onclick="window.location.href='/details/' + tierName">
  View details
</button>
```

## Browser Support
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## Troubleshooting

### Component Not Showing?
1. Ensure `<div id="service-category-container"></div>` exists in HTML
2. Check that `serviceCategory.js` and `serviceCategory.css` are linked correctly
3. Verify file paths are correct relative to HTML file location

### Styling Issues?
1. Check that `serviceCategory.css` is loaded before other CSS files
2. Ensure Poppins font is loaded: `<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">`

### Layout Breaking on Mobile?
- Responsive design handles all screen sizes
- Test on real devices or use browser DevTools (F12)

## API Integration

To connect to your backend, modify these functions:

```javascript
// In serviceCategory.js

function addToCart(tierName, price) {
  fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service: tierName, price: price })
  });
}

function loadServicesFromAPI() {
  fetch('/api/services')
    .then(res => res.json())
    .then(data => {
      // Update SERVICES_DATA with API data
      // Then reinitialize component
      initServiceCategory('service-category-container');
    });
}
```

## Performance Notes
- Lightweight: ~15KB JS + ~12KB CSS (uncompressed)
- No external dependencies (pure vanilla JS)
- Instant service switching with no page reload
- Mobile-optimized rendering

## Future Enhancements
- Add favorites/wishlist feature
- Integrate with booking system
- Add filters (price range, rating)
- Service comparison feature
- Real-time availability status

---

**Questions?** Check the inline comments in `serviceCategory.js` and `serviceCategory.css`
