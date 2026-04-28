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

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // 1. Check if the clicked item is already active
            const isOpen = item.classList.contains('active');

            // 2. Close all other items (optional - remove if you want multiple open at once)
            faqItems.forEach(i => i.classList.remove('active'));

            // 3. Toggle the clicked item
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
});