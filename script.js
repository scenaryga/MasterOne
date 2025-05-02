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

// Function to encode object to URL-encoded string
function obj2post(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

// Function to send order data to external API
function sendOrderToAPI(formData) { // Accept form data object
    // Use the ID and endpoint from the user's latest prompt
    var idp = 'deab5b64-d04e-7167-7cc339cbdb4c8819';
    var url = 'https://newapi.ru/mfh/addorders?idp=' + encodeURIComponent(idp);

    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    var xhr = new XHR();

    // Construct data object for the API using the passed formData
    // Use the fields from the new form structure
    var apiData = {
        'fullname': formData.fullname,
        'phone': formData.phone.replace(/\D/g, ''), // Remove non-digit characters
        'work': formData.work, // Use the 'work' field for comment
        'branch_id': formData.branch_id, // Include hidden fields
        'is_pm': formData.is_pm,
        'thread_id': formData.thread_id,
        'thread_type': formData.thread_type,
        'sub_id1': formData.sub_id1,
        'sub_id2': formData.sub_id2,
        'sub_id3': formData.sub_id3,
        'direction_id': formData.direction_id,
        'offer_id': formData.offer_id
    };

    var formDataAPI = obj2post(apiData); // Use apiData for POST body

    xhr.onload = function () {
        console.log(`API response: ${xhr.status} ${xhr.response}`);
        // Note: Depending on API response, you might want to check status or response body for confirmation
        // For now, just logging. The form submit handler will show page messages.
    };
    xhr.onerror = function () { // only triggers if the request couldn't be made at all
        console.error(`Network Error when sending to API`);
        // You might want to log this error on the page or console for debugging
    };
    xhr.ontimeout = function () { // Optional: Add ontimeout handler
         console.error(`API request timed out`);
         // You might want to log this error on the page or console for debugging
     };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(formDataAPI); // Send the constructed API data
}

// Form handling
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this; // Reference to the form
    const successMessageDiv = document.getElementById('formSuccessMessage');
    const errorMessageDiv = document.getElementById('formErrorMessage');

    // Clear previous messages
    successMessageDiv.textContent = '';
    successMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
    document.querySelectorAll('.error-message').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => { el.classList.remove('error'); });


    // Get form values using the new structure and names
    const fullnameInput = form.querySelector('[name="fullname"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const workInput = form.querySelector('[name="work"]'); // The comment field is now named 'work'

    // Get error message elements (reusing IDs)
    const fullnameError = document.getElementById('fullnameError');
    const phoneError = document.getElementById('phoneError');
    const commentError = document.getElementById('commentError'); // Error for the 'work' field

    let isValid = true;

    // Validate required fields (fullname and phone are required in the example)
    if (!fullnameInput.value.trim()) {
        fullnameError.textContent = 'Введите ваше имя.';
        fullnameError.style.display = 'block';
        fullnameInput.classList.add('error');
        isValid = false;
    }
     if (!phoneInput.value.trim()) {
        phoneError.textContent = 'Введите ваш номер телефона.';
        phoneError.style.display = 'block';
        phoneInput.classList.add('error');
        isValid = false;
    }
    // 'work' (comment) is not required based on the user's example form


    // If validation fails, stop here
    if (!isValid) {
        errorMessageDiv.textContent = 'Пожалуйста, заполните все обязательные поля.';
        errorMessageDiv.style.display = 'block';
        return;
    }

    // Collect all form values, including hidden inputs
    const formValues = {
        fullname: fullnameInput.value.trim(),
        phone: phoneInput.value.trim(),
        work: workInput.value.trim(),
        branch_id: form.querySelector('[name="branch_id"]').value,
        is_pm: form.querySelector('[name="is_pm"]').value,
        thread_id: form.querySelector('[name="thread_id"]').value,
        thread_type: form.querySelector('[name="thread_type"]').value,
        sub_id1: form.querySelector('[name="sub_id1"]').value,
        sub_id2: form.querySelector('[name="sub_id2"]').value,
        sub_id3: form.querySelector('[name="sub_id3"]').value,
        direction_id: form.querySelector('[name="direction_id"]').value,
        offer_id: form.querySelector('[name="offer_id"]').value
    };

    // Store order temporarily in localStorage for the admin page to pick up
    // This acts as a simple queue since we don't have a backend API to send orders to directly
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    pendingOrders.push({
        id: Date.now(), // Simple ID, will be replaced in CRM
        date: new Date().toISOString(),
        name: formValues.fullname,
        phone: formValues.phone,
        city: '',
        direction: '',
        clientComment: formValues.work, // Store detailed comment
        status: 'new',
        notes: ''
    });
    localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));

    // Send order data to external API
    sendOrderToAPI(formValues); // Pass the collected formValues object

    // Show success message on the page
    successMessageDiv.textContent = `Спасибо за заявку, ${formValues.fullname}! Мы скоро свяжемся с вами по телефону ${formValues.phone} для подтверждения заказа.`;
    successMessageDiv.style.display = 'block';

    // Reset form after successful submission
    form.reset();
});

// Service type tab switching
document.addEventListener('DOMContentLoaded', function() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            serviceTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all service sections
            const serviceSections = document.querySelectorAll('.service-section');
            serviceSections.forEach(section => section.classList.remove('active'));
            
            // Show the target service section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// Burger menu toggle
document.querySelector('.burger-menu')?.addEventListener('click', function() {
    document.querySelector('header').classList.toggle('nav-open');
    // Optional: Disable body scroll when menu is open
    // document.body.classList.toggle('no-scroll');
});