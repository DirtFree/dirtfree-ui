# Location-Based Rates Management Guide

## Overview
The DirtFree UI now supports location-specific pricing. Different cities can have different service rates, and you can easily manage and update these rates.

## How It Works

### Location Detection
The system automatically detects the location based on:
1. **Current Page**: Detects location from the page filename (e.g., `ghaziabad.html` → location is `ghaziabad`)
2. **Session Storage**: Stores the selected location in browser session storage
3. **Fallback**: Defaults to the first available location if not detected

### Rate Structure
All rates are stored in the `LOCATION_RATES` object in `public/serviceCategory.js`:

```javascript
LOCATION_RATES = {
  'location-name': {
    'Service Category': {
      'Service Tier Name': price
    }
  }
}
```

## Current Rates

### Ghaziabad
- **1 BHK Flat Cleaning**: ₹799
- **2 BHK Flat Cleaning**: ₹1299
- **3 BHK Flat Cleaning**: ₹1799
- **Deep Washroom Cleaning**: ₹249
- **Basic Washroom Cleaning**: ₹99
- **Kitchen Deep Cleaning**: ₹499
- **Modular Kitchen Deep Cleaning**: ₹999
- **Car Interior & Exterior Cleaning**: ₹699
- **Professional Water Tank Cleaning (500L-1000L)**: ₹599

### Other Locations (Ahmedabad, Chennai, Indore, Betul)
Default rates maintained for all other locations.

## How to Update Rates

### Step 1: Open the File
Open `public/serviceCategory.js`

### Step 2: Locate the LOCATION_RATES Object
Find the `LOCATION_RATES` object at the beginning of the file (after the global comment).

### Step 3: Update or Add Rates
- **To update existing location**: Find the location key and update the price values
- **To add a new location**: Add a new key with the complete rate structure

Example - Adding a new location:
```javascript
LOCATION_RATES = {
  'ghaziabad': {
    'Washroom Cleaning': {
      'Deep Washroom Cleaning': 249,
      // ...
    }
  },
  'newcity': {  // New location
    'Washroom Cleaning': {
      'Deep Washroom Cleaning': 300,  // Your price
      'Basic Washroom Cleaning': 100,
    },
    // ... add all other services
  }
}
```

### Step 4: Update HTML Pages (if adding new location)
Create corresponding HTML files for the new location:
- `newcity.html` - Will automatically be detected as a location

## Using Location Functions in Code

### Get Current Location
```javascript
const location = getCurrentLocation();
console.log(location); // e.g., 'ghaziabad'
```

### Set Location Manually
```javascript
setLocation('ahmedabad');  // Returns true if valid, false otherwise
```

### Get Price for a Service
```javascript
const price = getPrice('Flat Cleaning', '1 BHK Flat Cleaning');
// Returns the price for current location
```

### Get Price for Specific Location
```javascript
const price = LOCATION_RATES['ghaziabad']['Flat Cleaning']['1 BHK Flat Cleaning'];
// Returns ₹799
```

## Service Categories and Tiers

The available service categories are:
1. **Washroom Cleaning**
   - Deep Washroom Cleaning
   - Basic Washroom Cleaning

2. **Kitchen Cleaning**
   - Kitchen Deep Cleaning
   - Modular Kitchen Deep Cleaning

3. **Flat Cleaning**
   - 1 BHK Flat Cleaning
   - 2 BHK Flat Cleaning
   - 3 BHK Flat Cleaning

4. **Car Cleaning**
   - Car Interior & Exterior Cleaning

5. **Water Tank Cleaning**
   - Professional Water Tank Cleaning (500L-1000L)

## Important Notes

1. **Exact Naming**: Service names and tier names must match exactly with what's in `LOCATION_RATES` for pricing to work correctly.

2. **All Locations Must Have All Services**: Every location in `LOCATION_RATES` must have pricing for all service categories and tiers.

3. **Session Persistence**: The selected location is stored in session storage, so it persists within the same browser session but resets when the browser closes.

4. **Page Reloading**: Prices update automatically when switching between location pages or when manually setting location.

5. **No Cache Issues**: Prices are fetched dynamically, so updating rates takes effect immediately after saving and refreshing the page.

## Example: Complete Workflow to Update Ghaziabad Prices

1. Open `public/serviceCategory.js`
2. Find the `LOCATION_RATES` object
3. Locate `'ghaziabad'` section
4. Update the desired prices:
   ```javascript
   'ghaziabad': {
     'Flat Cleaning': {
       '1 BHK Flat Cleaning': 799,      // Updated
       '2 BHK Flat Cleaning': 1299,     // Updated
       '3 BHK Flat Cleaning': 1799,     // Updated
     },
     // ...
   }
   ```
5. Save the file
6. Refresh the website to see updated prices

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Prices showing as ₹0 | Check if service/tier name matches exactly in LOCATION_RATES |
| Old prices still showing | Clear browser cache and refresh page |
| Location not detected | Ensure HTML filename matches location key in LOCATION_RATES |
| Manual location not working | Use lowercase location name (e.g., 'ghaziabad', not 'Ghaziabad') |

## Future Enhancements

Possible improvements for the pricing system:
- Admin panel for easy price updates without code changes
- Database integration for dynamic rate management
- Seasonal pricing variations
- Promotional discounts by location
- Bulk service discounts
