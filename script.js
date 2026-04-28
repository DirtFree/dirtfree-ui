// /**
//  * DirtFree - Main Interactive Script
//  * This script handles:
//  * 1. Fixed Header transitions
//  * 2. City Picker dropdown toggle
//  * 3. City selection & redirection
//  * 4. Active state management
//  */

// document.addEventListener('DOMContentLoaded', () => {
//     // --- Elements ---
//     const header = document.querySelector('.main-header');
//     const cityPicker = document.getElementById('cityPicker');
//     const cityDropdown = document.getElementById('cityDropdown');
//     const cityItems = document.querySelectorAll('.city-item');
//     const currentCityText = document.getElementById('currentCity');

//     /**
//      * 1. HEADER SCROLL EFFECT
//      * Changes the header height and shadow when the user scrolls down
//      */
//     const handleHeaderScroll = () => {
//         if (window.scrollY > 50) {
//             header.style.height = '70px';
//             header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
//             header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
//         } else {
//             header.style.height = '80px';
//             header.style.backgroundColor = 'white';
//             header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
//         }
//     };

//     window.addEventListener('scroll', handleHeaderScroll);


//     /**
//      * 2. CITY DROPDOWN TOGGLE
//      * Opens/Closes the city selection menu
//      */
//     cityPicker.addEventListener('click', (e) => {
//         // Prevent clicking the picker from closing it immediately via the document listener
//         e.stopPropagation();
//         cityDropdown.classList.toggle('active');
        
//         // Rotate chevron icon if you added one
//         const chevron = cityPicker.querySelector('.chevron');
//         if (cityDropdown.classList.contains('active')) {
//             chevron.style.transform = 'rotate(180deg)';
//         } else {
//             chevron.style.transform = 'rotate(0deg)';
//         }
//     });


//     /**
//      * 3. CITY SELECTION & REDIRECTION
//      * Updates the UI and moves the user to the specific city page
//      */
//     cityItems.forEach(item => {
//         item.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevent trigger from firing again

//             // Extract city name (removes the arrow icon text)
//             const cityName = item.childNodes[1].textContent.trim(); 
//             const targetUrl = item.getAttribute('data-url');

//             // Update the header display
//             currentCityText.innerText = cityName;
            
//             // Visual feedback
//             console.log(`Navigating to cleaning services in: ${cityName}`);

//             // Close the dropdown
//             cityDropdown.classList.remove('active');

//             // REDIRECTION LOGIC
//             // In a real app, uncomment the line below:
//             // window.location.href = targetUrl; 
            
//             // For demo purposes, we'll just alert
//             alert(`Taking you to the ${cityName} service page!`);
//         });
//     });


//     /**
//      * 4. CLOSE DROPDOWN ON OUTSIDE CLICK
//      * If the user clicks anywhere else on the page, the menu closes
//      */
//     document.addEventListener('click', (e) => {
//         if (!cityPicker.contains(e.target)) {
//             cityDropdown.classList.remove('active');
//             const chevron = cityPicker.querySelector('.chevron');
//             chevron.style.transform = 'rotate(0deg)';
//         }
//     });


//     /**
//      * 5. SMOOTH SCROLL FOR NAV LINKS
//      * Makes clicking "Services" or "About" scroll smoothly to the section
//      */
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             const targetId = this.getAttribute('href');
//             if (targetId === '#') return;

//             e.preventDefault();
//             const targetElement = document.querySelector(targetId);

//             if (targetElement) {
//                 window.scrollTo({
//                     top: targetElement.offsetTop - 80, // Offset for the fixed header
//                     behavior: 'smooth'
//                 });
//             }
//         });
//     });


//     document.addEventListener('DOMContentLoaded', () => {
//     const heroCityButtons = document.querySelectorAll('.city-btn');

//     heroCityButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             const targetPage = button.getAttribute('data-url');
//             const cityName = button.innerText;

//             console.log(`Navigating to ${cityName} page: ${targetPage}`);

//             // Perform the redirection
//             // window.location.href = targetPage;

//             // Optional: Update the "Select City" text in the header to show the current choice
//             const headerCityDisplay = document.getElementById('currentCity');
//             if(headerCityDisplay) {
//                 headerCityDisplay.innerText = cityName;
//             }

//             // For demo:
//             alert(`Redirecting you to the ${cityName} cleaning services page!`);
//         });
//     });
// });
// });

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Generic Navigation Function ---
    const navigateToCity = (cityName) => {
        // Convert city name to lowercase for the filename (e.g., "Ahmedabad" -> "ahmedabad.html")
        const fileName = cityName.toLowerCase().trim() + ".html";
        
        console.log(`Navigating to: ${fileName}`);
        
        // Use this to actually change the page:
        window.location.href = fileName;
    };

    // --- 1. Dropdown Selection ---
    const cityItems = document.querySelectorAll('.city-item');
    cityItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Get text, remove the emoji/arrow, and trim
            const cityName = item.innerText.replace('📍', '').replace('→', '').trim();
            navigateToCity(cityName);
        });
    });

    // --- 2. Hero Pill Button Selection ---
    const cityButtons = document.querySelectorAll('.city-btn');
    cityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cityName = button.innerText.trim();
            navigateToCity(cityName);
        });
    });

    // --- 3. Dropdown Toggle Logic (UI Only) ---
    const cityPicker = document.getElementById('cityPicker');
    const cityDropdown = document.getElementById('cityDropdown');

    cityPicker.addEventListener('click', (e) => {
        e.stopPropagation();
        cityDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        cityDropdown.classList.remove('active');
    });
});

