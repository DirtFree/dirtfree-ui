# DirtFree Service Navigation Flow

## How It Works

### 🏠 Home Page / Location Pages (Same for all locations)
- Show 3 service cards: Washroom Cleaning, Flat Cleaning, Kitchen Cleaning
- Each card has pricing and a "View Services" button
- **Same content** across all locations (Ahmedabad, Betul, Chennai, Ghaziabad, Indore)
- Links: `ahmedabad.html`, `betul.html`, `chennai.html`, `ghaziabad.html`, `indore.html`

### 🔍 Service Browsing Page
- NEW page: `service.html`
- Displays the interactive service browsing component
- Shows sidebar with service types and tiers
- URL parameters: `?service=ServiceName`

## Navigation Flow

```
HOME PAGE (index.html / city pages)
    ↓
    [Washroom Cleaning Card]
    ↓
    service.html?service=Washroom%20Cleaning
    ↓
SERVICE BROWSING PAGE
    ├─ Sidebar: Washroom Cleaning ✓
    ├─ Sidebar: Kitchen Cleaning
    ├─ Sidebar: Flat Cleaning
    └─ Main Area: Deep/Basic Washroom options
```

## File Structure

```
📁 DirtFree/
├── index.html                 (Home page)
├── ahmedabad.html             (Location: Shows 3 service cards)
├── betul.html                 (Location: Shows 3 service cards)
├── chennai.html               (Location: Shows 3 service cards)
├── ghaziabad.html             (Location: Shows 3 service cards)
├── indore.html                (Location: Shows 3 service cards)
├── service.html               (NEW: Service browsing page)
├── serviceCategory.js         (Component logic)
├── serviceCategory.css        (Component styling)
├── style.css                  (General styling)
└── Images/                    (Service images)
    ├── washroom.png
    ├── flat.png
    └── Kitchen.png
```

## URLs Examples

### Service Card Links (from location pages)
```
service.html?service=Washroom%20Cleaning
service.html?service=Kitchen%20Cleaning
service.html?service=Flat%20Cleaning
```

### How URL Parameters Work
```javascript
// In service.html, the script reads the URL parameter:
const selectedService = new URLSearchParams(window.location.search).get('service');
// If no parameter, defaults to 'Washroom Cleaning'
```

## Key Features

✅ **Same Home Page Across Locations**
- Location pills still work to switch cities
- Service cards remain consistent

✅ **Dynamic Service Browsing**
- Click any service card → goes to service.html with that service pre-selected
- Sidebar shows all available services
- Click sidebar items to switch between services

✅ **No Page Changes on Location Switch**
- Clicking different city buttons on ahmedabad.html → loads that city page
- Service cards are identical on all city pages

✅ **Sidebar Navigation**
- Users can browse all 3 services without leaving the page
- Each service displays its specific tiers and pricing

## Customization

### Adding a New Service
Edit `serviceCategory.js`:
```javascript
const SERVICES_DATA = {
  'Washroom Cleaning': { /* existing */ },
  'Kitchen Cleaning': { /* existing */ },
  'Flat Cleaning': { /* existing */ },
  'New Service': {
    icon: '🎯',
    tiers: [
      { name: '...', price: 0, /* ... */ }
    ]
  }
};
```

Then add a card to location pages:
```html
<div class="booking-card" style="background-image:url('Images/new-service.png');">
  <div class="card-overlay-content">
    <h3>New Service</h3>
    <p>starting from <strong>₹XXX.</strong></p>
    <a href="service.html?service=New%20Service" class="card-btn">View Services</a>
  </div>
</div>
```

### Changing Service Names
Remember to update:
1. `serviceCategory.js` - SERVICES_DATA object
2. Location page HTML - card links
3. Keep URL encoding: spaces → `%20`

## Testing

### ✅ Test Checklist
1. [ ] Click on location pills (ahmedabad → betul) - should show same service cards
2. [ ] Click "View Services" on any card - should go to service.html
3. [ ] Check URL shows `?service=ServiceName`
4. [ ] Sidebar shows correct service highlighted
5. [ ] Click sidebar items - should switch services
6. [ ] Mobile view - should be responsive
7. [ ] Home link works from service.html
8. [ ] Each service shows correct tiers and prices

## Troubleshooting

**Service not showing on service.html?**
- Check URL parameter spelling matches SERVICES_DATA key exactly
- Defaults to 'Washroom Cleaning' if parameter is missing

**Service cards not linking correctly?**
- Verify URL encoding: `Kitchen%20Cleaning` (space = %20)
- Check `service.html` exists in same directory

**Sidebar not showing service?**
- Ensure service name matches SERVICES_DATA key exactly
- Check browser console for errors (F12)

---

**Summary:** Location pages are now identical across all cities and show 3 service cards that link to the dedicated `service.html` browsing page, where users can explore all services and switch between them using the sidebar.
