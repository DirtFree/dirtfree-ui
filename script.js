function getSavedCity() {
    if (window.cart && window.cart.getLocation()) {
        return window.cart.getLocation();
    }

    return localStorage.getItem("selectedCity");
}

function updateSelectedCityUI(cityName) {
    const currentCity = document.getElementById("currentCity");
    const bookBtn = document.getElementById("bookNowBtn");

    if (currentCity) {
        currentCity.textContent = cityName || "Select City";
    }

    if (!bookBtn) return;

    bookBtn.href = "service.html";

    if (cityName) {
        bookBtn.classList.remove("disabled");
        bookBtn.removeAttribute("title");
    } else {
        bookBtn.classList.add("disabled");
        bookBtn.title = "Select a location first";
    }
}

function saveSelectedCity(cityName) {
    localStorage.setItem("selectedCity", cityName);

    if (window.cart) {
        window.cart.setLocation(cityName);
    }

    updateSelectedCityUI(cityName);
}

//Book now script
document.addEventListener("DOMContentLoaded", function () {
    const bookBtn = document.getElementById("bookNowBtn");

    updateSelectedCityUI(getSavedCity());

    if (!bookBtn) return;

    // If user clicks while disabled
    bookBtn.addEventListener("click", function (e) {
        if (bookBtn.classList.contains("disabled")) {
            e.preventDefault();
            bookBtn.title = "Please select a location first";
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Create Modal for Location Confirmation ---
    const createLocationModal = () => {
        // Check if modal already exists
        if (document.getElementById('locationModal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'locationModal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Change Location?</h2>
                    </div>
                    <div class="modal-body">
                        <p>Your cart has items. Changing location will remove them. Do you want to continue?</p>
                    </div>
                    <div class="modal-footer">
                        <button id="modalCancel" class="modal-btn modal-btn-cancel">Cancel</button>
                        <button id="modalConfirm" class="modal-btn modal-btn-confirm">Continue</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #locationModal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
            }
            
            #locationModal.active {
                display: flex;
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 450px;
                width: 90%;
                z-index: 10002;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                padding: 24px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .modal-header h2 {
                font-size: 20px;
                font-weight: 700;
                color: #1a1a1a;
                margin: 0;
            }
            
            .modal-body {
                padding: 24px;
            }
            
            .modal-body p {
                font-size: 14px;
                color: #666;
                line-height: 1.6;
                margin: 0;
            }
            
            .modal-footer {
                padding: 24px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .modal-btn {
                padding: 10px 24px;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .modal-btn-cancel {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-btn-cancel:hover {
                background: #e0e0e0;
            }
            
            .modal-btn-confirm {
                background: #00A676;
                color: white;
            }
            
            .modal-btn-confirm:hover {
                background: #008a62;
            }
        `;
        document.head.appendChild(style);
        
        return modal;
    };
    
    const showLocationModal = (onConfirm, onCancel) => {
        let modal = document.getElementById('locationModal');
        if (!modal) {
            modal = createLocationModal();
        }
        
        modal.classList.add('active');
        
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');
        
        // Remove previous listeners
        confirmBtn.replaceWith(confirmBtn.cloneNode(true));
        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        
        // Add new listeners
        document.getElementById('modalConfirm').addEventListener('click', () => {
            modal.classList.remove('active');
            onConfirm();
        });
        
        document.getElementById('modalCancel').addEventListener('click', () => {
            modal.classList.remove('active');
            onCancel();
        });
        
        // Close on overlay click
        document.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === document.querySelector('.modal-overlay')) {
                modal.classList.remove('active');
                onCancel();
            }
        });
    };
    
    // --- Generic Navigation Function ---
    const getCityPage = (cityName) => {
        const cityPages = {
            Ahmedabad: "ahmedabad.html",
            Betul: "betul.html",
            Chennai: "chennai.html",
            Ghaziabad: "ghaziabad.html",
            Indore: "indore.html"
        };

        return cityPages[cityName] || `${cityName.toLowerCase()}.html`;
    };

    const getCityNameFromUrl = (url) => {
        const cityName = url.replace(".html", "");
        return cityName.charAt(0).toUpperCase() + cityName.slice(1);
    };

    const navigateToCity = (cityName) => {
        const fileName = getCityPage(cityName);

        // 🛑 Ensure cart exists
        if (typeof window.cart === "undefined") {
            localStorage.setItem("selectedCity", cityName);
            updateSelectedCityUI(cityName);
            window.location.href = fileName;
            return;
        }

        // 🧠 Get current location
        const currentLocation = window.cart.getLocation();
        const isSameCity = currentLocation && currentLocation.toLowerCase() === cityName.toLowerCase();

        const cartItems = window.cart.getCart();

        // 🚨 If DIFFERENT city AND cart has items → show modal
        if (!isSameCity && cartItems.length > 0) {
            showLocationModal(
                () => {
                    // User confirmed - clear cart and navigate
                    window.cart.clearCart();
                    saveSelectedCity(cityName);
                    window.location.href = fileName;
                },
                () => {
                    // User cancelled - do nothing
                    console.log("Location change cancelled by user");
                }
            );
            return;
        }

        // ✅ If same city (with or without cart items) or different city without items → just navigate
        saveSelectedCity(cityName);
        window.location.href = fileName;
    };

    // --- 1. Dropdown Selection ---
    const cityItems = document.querySelectorAll('.city-item');
    cityItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const cityName = getCityNameFromUrl(item.dataset.url);
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

    if (cityPicker && cityDropdown) {
        cityPicker.addEventListener('click', (e) => {
            e.stopPropagation();
            cityDropdown.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            cityDropdown.classList.remove('active');
        });
    }
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
