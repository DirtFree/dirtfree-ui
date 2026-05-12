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
    sessionStorage.setItem("dirtfree-location", cityName.toLowerCase());

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

    const selectCityWithoutRedirect = (cityName) => {
        if (typeof window.cart === "undefined") {
            saveSelectedCity(cityName);
            cityDropdown?.classList.remove('active');
            return;
        }

        const currentLocation = window.cart.getLocation();
        const isSameCity = currentLocation && currentLocation.toLowerCase() === cityName.toLowerCase();
        const cartItems = window.cart.getCart();

        if (!isSameCity && cartItems.length > 0) {
            showLocationModal(
                () => {
                    window.cart.clearCart();
                    saveSelectedCity(cityName);
                    cityDropdown?.classList.remove('active');
                },
                () => {}
            );
            return;
        }

        saveSelectedCity(cityName);
        cityDropdown?.classList.remove('active');
    };

    const getLocationKey = (cityName) => cityName.trim().toLowerCase();

    const goToServiceForCity = (serviceName, cityName) => {
        const locationKey = getLocationKey(cityName);
        saveSelectedCity(cityName);
        sessionStorage.setItem('dirtfree-location', locationKey);

        const params = new URLSearchParams({
            service: serviceName,
            location: locationKey
        });

        window.location.href = `service.html?${params.toString()}`;
    };

    const createServiceLocationModal = () => {
        if (document.getElementById('serviceLocationModal')) return;

        const cities = ['Ahmedabad', 'Betul', 'Chennai', 'Ghaziabad', 'Indore'];
        const modal = document.createElement('div');
        modal.id = 'serviceLocationModal';
        modal.innerHTML = `
            <div class="service-location-overlay" role="presentation">
                <div class="service-location-dialog" role="dialog" aria-modal="true" aria-labelledby="serviceLocationTitle">
                    <button class="service-location-close" type="button" aria-label="Close location selector">x</button>
                    <div class="service-location-header">
                        <span class="service-location-kicker">Select location</span>
                        <h2 id="serviceLocationTitle">Where do you need this service?</h2>
                        <p id="serviceLocationName"></p>
                    </div>
                    <div class="service-location-grid">
                        ${cities.map((city) => `<button class="service-location-city" type="button" data-city="${city}">${city}</button>`).join('')}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            #serviceLocationModal {
                display: none;
                position: fixed;
                inset: 0;
                z-index: 10020;
            }

            #serviceLocationModal.active {
                display: block;
            }

            .service-location-overlay {
                min-height: 100%;
                background: rgba(8, 21, 40, 0.58);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
            }

            .service-location-dialog {
                position: relative;
                width: min(92vw, 520px);
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 24px 70px rgba(8, 21, 40, 0.28);
                padding: 28px;
                animation: serviceLocationIn 0.22s ease;
            }

            @keyframes serviceLocationIn {
                from {
                    opacity: 0;
                    transform: translateY(12px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .service-location-close {
                position: absolute;
                top: 14px;
                right: 14px;
                width: 34px;
                height: 34px;
                border: 1px solid #e5e7eb;
                border-radius: 50%;
                background: #ffffff;
                color: #475569;
                font-weight: 700;
                cursor: pointer;
            }

            .service-location-header {
                padding-right: 34px;
                margin-bottom: 22px;
            }

            .service-location-kicker {
                display: inline-flex;
                color: #1663d8;
                background: rgba(74, 144, 226, 0.12);
                border: 1px solid rgba(74, 144, 226, 0.18);
                border-radius: 999px;
                padding: 5px 13px;
                font-size: 0.78rem;
                font-weight: 700;
                margin-bottom: 12px;
            }

            .service-location-header h2 {
                margin: 0;
                color: #071a33;
                font-size: 1.55rem;
                line-height: 1.25;
            }

            .service-location-header p {
                margin: 8px 0 0;
                color: #64748b;
                font-size: 0.95rem;
            }

            .service-location-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
            }

            .service-location-city {
                min-height: 48px;
                border: 1px solid #dbe3ef;
                border-radius: 10px;
                background: #f8fafc;
                color: #10233f;
                font: inherit;
                font-weight: 700;
                cursor: pointer;
                transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
            }

            .service-location-city:hover,
            .service-location-city:focus-visible {
                border-color: #1663d8;
                background: #eef6ff;
                transform: translateY(-1px);
                outline: none;
            }

            @media (max-width: 520px) {
                .service-location-dialog {
                    padding: 24px;
                }

                .service-location-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const showServiceLocationModal = (serviceName) => {
        createServiceLocationModal();

        const modal = document.getElementById('serviceLocationModal');
        const selectedName = document.getElementById('serviceLocationName');
        selectedName.textContent = `Selected service: ${serviceName}`;
        modal.classList.add('active');

        const closeModal = () => modal.classList.remove('active');

        modal.querySelector('.service-location-close').onclick = closeModal;
        modal.querySelector('.service-location-overlay').onclick = (event) => {
            if (event.target === event.currentTarget) closeModal();
        };

        modal.querySelectorAll('.service-location-city').forEach((button) => {
            button.onclick = () => {
                const cityName = button.dataset.city;
                const currentLocation = window.cart?.getLocation();
                const isSameCity = currentLocation && currentLocation.toLowerCase() === cityName.toLowerCase();
                const cartItems = window.cart?.getCart ? window.cart.getCart() : [];

                if (!isSameCity && cartItems.length > 0) {
                    closeModal();
                    showLocationModal(
                        () => {
                            window.cart.clearCart();
                            goToServiceForCity(serviceName, cityName);
                        },
                        () => {}
                    );
                    return;
                }

                goToServiceForCity(serviceName, cityName);
            };
        });
    };

    const openServiceFromCard = (serviceName) => {
        const selectedCity = getSavedCity();

        if (selectedCity) {
            goToServiceForCity(serviceName, selectedCity);
            return;
        }

        showServiceLocationModal(serviceName);
    };

    // --- 1. Dropdown Selection ---
    const cityItems = document.querySelectorAll('.city-item');
    cityItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const cityName = getCityNameFromUrl(item.dataset.url);
            selectCityWithoutRedirect(cityName);
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

    const serviceCards = document.querySelectorAll('.services-grid .service-card[data-service]');
    serviceCards.forEach((card) => {
        const openLocationSelector = () => openServiceFromCard(card.dataset.service);

        card.addEventListener('click', openLocationSelector);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLocationSelector();
            }
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
