//Book now script
document.addEventListener("DOMContentLoaded", function () {
    const bookBtn = document.getElementById("bookNowBtn");
    const cityButtons = document.querySelectorAll(".city-btn, .city-item");

    let selectedCity = null;

    // When user selects city
    cityButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const url = this.getAttribute("data-url");

            // extract city name from url (ghaziabad.html → ghaziabad)
            selectedCity = url.replace(".html", "");

            // save it
            localStorage.setItem("selectedCity", selectedCity);
            document.getElementById("currentCity").innerText = selectedCity;
            // enable button
            bookBtn.classList.remove("disabled");
            bookBtn.removeAttribute("title");

            // update link
            bookBtn.href = url;
        });
    });

    
    // If already selected before
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
        bookBtn.classList.remove("disabled");
        bookBtn.href = savedCity + ".html";
        bookBtn.removeAttribute("title");
        document.getElementById("currentCity").innerText = savedCity;
    }

    // If user clicks while disabled
    bookBtn.addEventListener("click", function (e) {
        if (bookBtn.classList.contains("disabled")) {
            e.preventDefault();
            bookBtn.title = "Please select a location first";
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Generic Navigation Function ---
    const navigateToCity = (cityName) => {
    const fileName = cityName.toLowerCase().trim() + ".html";

    // 🧠 Get current location
    const currentLocation = window.cart.getLocation();

    // ✅ If same city → do nothing
    if (currentLocation && currentLocation.toLowerCase() === cityName.toLowerCase()) {
        console.log("Same city selected, no action");
        return;
    }

    // 🛑 Ensure cart exists
    if (typeof window.cart === "undefined") {
        window.location.href = fileName;
        return;
    }

    const cartItems = window.cart.getCart();

    // 🚨 If cart has items → warn
    if (cartItems.length > 0) {
        const confirmChange = confirm(
            "Your cart has items. Changing location will remove them. Continue?"
        );

        if (!confirmChange) return;

        window.cart.clearCart();
    }

    // ✅ Set location
    window.cart.setLocation(cityName);

    // ✅ Navigate to city page
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