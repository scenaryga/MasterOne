

// No changes or updates provided in the plan, so the code remains the same.


// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"], .hero a[href^="#"], .pricing a[href^="#"], .footer-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate position, considering sticky header height if necessary
            const headerOffset = document.querySelector('header')?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Optional: Close mobile menu if open after clicking a link
            const header = document.querySelector('header');
            if (header.classList.contains('nav-open')) {
                 header.classList.remove('nav-open');
            }
        }
    });
});

// Add a subtle animation on scroll for service items (optional)
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            serviceObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the item is visible

document.querySelectorAll('.service-item').forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    serviceObserver.observe(item);
});

// Add animation on scroll for step items
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            stepObserver.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.step-item').forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    stepObserver.observe(item);
});

// Form handling
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simple form validation (check required fields)
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const problemInput = document.getElementById('problem');

    if (!nameInput.value || !phoneInput.value) {
         alert('Пожалуйста, заполните обязательные поля: Имя и Телефон.');
         return;
    }

    // Get form values
    const name = nameInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const problem = problemInput.value;

    // Create order data
    const orderData = {
        name: name,
        phone: phone,
        address: address,
        problem: problem
    };

    // Try to send to CRM if open, otherwise store in localStorage
    let orderSaved = false;

    // Check if the admin window is open and has the addNewOrder function
    if (window.opener && !window.opener.closed && typeof window.opener.addNewOrder === 'function') {
         try {
            orderSaved = window.opener.addNewOrder(orderData);
            console.log('Order sent to opener window:', orderData);
         } catch (error) {
             console.error('Error sending order to opener window:', error);
             orderSaved = false; // Fallback to localStorage if error
         }
    }

    // Store in localStorage as a backup or if opener failed/not present
    if (!orderSaved) {
        const storedOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
        storedOrders.push({
            ...orderData,
            date: new Date().toISOString() // Add timestamp
        });
        localStorage.setItem('pendingOrders', JSON.stringify(storedOrders));
        console.log('Order stored in localStorage (pendingOrders):', orderData);
        alert(`Спасибо за заявку, ${name}! Мы скоро свяжемся с вами по телефону ${phone} для подтверждения заказа.\n\n(Заявка временно сохранена локально, так как CRM не была открыта в отдельном окне).`);
    } else {
        // Show success message for the main site user
        alert(`Спасибо за заявку, ${name}! Мы скоро свяжемся с вами по телефону ${phone} для подтверждения заказа.`);
    }

    // Reset form
    this.reset();
});

// Burger menu toggle
document.querySelector('.burger-menu')?.addEventListener('click', function() {
    document.querySelector('header').classList.toggle('nav-open');
    // Optional: Disable body scroll when menu is open
    // document.body.classList.toggle('no-scroll');
});