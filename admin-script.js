// --- User Management ---

// Use localStorage for persistence (INSECURE for production, use a real backend)
const USERS_STORAGE_KEY = 'crmUsers';
const LOGGED_IN_USER_KEY = 'crmLoggedInUser'; // Key to store current logged-in user

function getUsers() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
        return JSON.parse(storedUsers);
    } else {
        // Initialize with a default admin user if no users exist
        const defaultUsers = [{ username: 'admin', password: 'password123' }]; // Insecure password!
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function findUser(username) {
    const users = getUsers();
    return users.find(user => user.username === username);
}

function addUser(username, password) {
    const users = getUsers();
    if (findUser(username)) {
        return false; // User already exists
    }
    users.push({ username, password });
    saveUsers(users);
    return true;
}

function updateUserPassword(username, currentPassword, newPassword) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return { success: false, message: 'Пользователь не найден.' };
    }
    if (users[userIndex].password !== currentPassword) {
        return { success: false, message: 'Текущий пароль введен неверно.' };
    }
    users[userIndex].password = newPassword;
    saveUsers(users);
    return { success: true };
}

function setLoggedInUser(username) {
    currentLoggedInUser = username;
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
}

function getLoggedInUser() {
    return localStorage.getItem(LOGGED_IN_USER_KEY);
}

function clearLoggedInUser() {
    currentLoggedInUser = null;
    localStorage.removeItem(LOGGED_IN_USER_KEY);
}

let currentLoggedInUser = null; // Store the username of the logged-in user

// --- Orders Data ---
let orders = []; // Global array to hold order data

// Function to get orders from localStorage or initialize
function getOrders() {
    const storedOrders = localStorage.getItem('crmOrders');
    if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        // Ensure all orders have the expected fields, add defaults if missing
        return orders.map(order => ({
             id: order.id, // Keep original ID
             date: order.date, // Keep original date
             name: order.name || 'Не указано',
             phone: order.phone || 'Не указано',
             city: order.city || '',
             address: order.address || '', // Keep address field for existing orders in the table
             direction: order.direction || '',
             offer: order.offer || '',
             additionalPhone: order.additionalPhone || '',
             source: order.source || '',
             problem: order.problem || '', // Keep original problem field
             clientComment: order.clientComment || '', // Ensure clientComment exists
             status: order.status || 'new',
             notes: order.notes || '' // Ensure notes exists
        }));
    }
    // Initial dummy data if no orders are stored
    return [
        {
            id: 1,
            date: '2024-05-15T10:30:00',
            name: 'Иван Петров',
            phone: '+7 (999) 123-45-67',
            city: 'Липецк',
            address: 'ул. Ленина, 42, кв. 56',
            direction: 'Сантехника',
            offer: 'Сломался смеситель',
            additionalPhone: '',
            source: 'Google',
            problem: 'Сантехника / Сломался смеситель', // Simpler representation for table display
            clientComment: 'Требуется замена смесителя в ванной комнате.',
            status: 'new',
            notes: ''
        },
        {
            id: 2,
            date: '2024-05-14T14:15:00',
            name: 'Елена Смирнова',
            phone: '+7 (917) 987-65-43',
            city: 'Липецк',
            address: 'Профсоюзная ул., 100, кв. 22',
            direction: 'Электрика',
            offer: 'Не работает розетка',
            additionalPhone: '',
            source: 'Yandex',
            problem: 'Электрика / Не работает розетка', // Simpler representation
            clientComment: 'Одна из розеток на кухне не подает питание.',
            status: 'inProgress',
            notes: 'Мастер выезжает 16 мая'
        },
        {
            id: 3,
            date: '2024-05-13T09:45:00',
            name: 'Алексей Иванов',
            phone: '+7 (905) 456-78-90',
            city: 'Липецк',
            address: 'ул. Тверская, 15, кв. 89',
            direction: 'Мебель',
            offer: 'Сборка шкафа',
            additionalPhone: '',
            source: 'Рекомендация',
            problem: 'Мебель / Сборка шкафа', // Simpler representation
            clientComment: 'Требуется собрать шкаф IKEA.',
            status: 'completed',
            notes: 'Выполнено 14 мая, клиент доволен'
        },
        {
            id: 4,
            date: '2024-05-12T16:20:00',
            name: 'Ольга Кузнецова',
            phone: '+7 (926) 111-22-33',
            city: 'Липецк',
            address: 'Ленинградский пр-т, 78, кв. 145',
            direction: 'Сантехника',
            offer: 'Протечка под раковиной',
            additionalPhone: '',
            source: 'Google',
            problem: 'Сантехника / Протечка под раковиной', // Simpler representation
            clientComment: 'Требуется устранить протечку.',
            status: 'cancelled',
            notes: 'Клиент отменил заказ'
        },
         {
            id: 5, // New ID
            date: '2024-05-16T11:00:00', // New date
            name: 'Петр Сидоров',
            phone: '+7 (951) 222-33-44',
            city: 'Липецк',
            address: 'ул. Гагарина, 5, кв. 10',
            direction: 'Дезинсекция', // New Direction
            offer: 'Обработка от тараканов', // New Offer
            additionalPhone: '',
            source: 'Website',
            problem: 'Дезинсекция / Обработка от тараканов', // Simpler representation
            clientComment: 'Появились тараканы на кухне, нужна обработка.',
            status: 'new',
            notes: ''
        }
    ];
}

// Function to save orders to localStorage
function saveOrders(ordersToSave) {
    localStorage.setItem('crmOrders', JSON.stringify(ordersToSave));
}

// Function to handle new orders from the main site
// This function is called from the main site script when an order is submitted
// It's made available globally via `window.addNewOrder`
window.addNewOrder = function(orderData) {
    const newOrder = {
        id: Date.now() + Math.floor(Math.random() * 1000), // Simple unique ID with random offset
        date: orderData.date || new Date().toISOString(),
        name: orderData.name || 'Не указано',
        phone: orderData.phone || 'Не указано',
        city: orderData.city || '', // These will be empty from the current form
        address: orderData.address || '', // This will be empty from the current form
        direction: orderData.direction || '', // These will be empty from the current form
        offer: orderData.offer || '', // These will be empty from the current form
        additionalPhone: orderData.additionalPhone || '', // These will be empty from the current form
        source: orderData.source || '', // These will be empty from the current form
        // The 'problem' field for the table display might need to be constructed
        // from the clientComment or default to it if other details are missing.
        // For now, use clientComment as problem if problem is empty
        problem: orderData.problem || orderData.clientComment || 'Не указано',
        clientComment: orderData.clientComment || '', // This holds the 'work' value from the main form
        status: 'new', // New orders default to 'new' status
        notes: ''
    };

    // Basic deduplication check: avoid adding duplicate orders with same phone, comment, and close timestamp
    // Increased time window slightly for potentially delayed data transfer
    const isDuplicate = orders.some(order =>
        order.phone === newOrder.phone &&
        order.clientComment === newOrder.clientComment &&
        Math.abs(new Date(order.date).getTime() - new Date(newOrder.date).getTime()) < 10000 // within 10 seconds
    );

    if (!isDuplicate) {
        orders.push(newOrder);
        saveOrders(orders);
        console.log('New order added:', newOrder);
        // If logged in and on the orders page, refresh the table
        if (dashboardContainer.style.display !== 'none' && document.getElementById('orders').classList.contains('active')) {
            filterOrders(); // Use filterOrders to ensure current filters are applied
            updateStatistics();
            // renderOrdersChart(filterOrdersForChart()); // Chart updates on tab switch or filters being applied
        }
        return true; // Indicate successful processing
    } else {
        console.log('Duplicate order detected and ignored:', newOrder);
        return false; // Indicate duplicate
    }
};

// Load orders from storage on script load
orders = getOrders();

// --- DOM Elements ---
const authContainer = document.getElementById('authContainer');
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');
const registerMessage = document.getElementById('registerMessage');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutButton = document.getElementById('logoutButton');
const adminUsernameDisplay = document.getElementById('adminUsernameDisplay');
const ordersTableBody = document.getElementById('ordersTableBody');
const noOrdersMessage = document.getElementById('noOrders');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const resetFiltersButton = document.getElementById('resetFilters');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const contentSections = document.querySelectorAll('.content-section');
const orderModal = document.getElementById('orderModal');
const closeModalButton = document.querySelector('.close-modal');
const orderEditForm = document.getElementById('orderEditForm');
const cancelEditButton = document.getElementById('cancelEdit');
const changePasswordForm = document.getElementById('changePasswordForm');
const passwordChangeSuccess = document.getElementById('passwordChangeSuccess');
const passwordChangeError = document.getElementById('passwordChangeError');
const modalOrderId = document.getElementById('modalOrderId');

// New modal field elements
const modalCityInput = document.createElement('input');
modalCityInput.type = 'text';
modalCityInput.id = 'modalCity'; // Keep ID for label association
modalCityInput.name = 'city'; // Keep name for form data

const modalDirectionInput = document.createElement('input');
modalDirectionInput.type = 'text';
modalDirectionInput.id = 'modalDirection';
modalDirectionInput.name = 'direction';

const modalOfferInput = document.createElement('input');
modalOfferInput.type = 'text';
modalOfferInput.id = 'modalOffer';
modalOfferInput.name = 'offer';

const modalAdditionalPhoneInput = document.createElement('input');
modalAdditionalPhoneInput.type = 'tel'; // Use tel type
modalAdditionalPhoneInput.id = 'modalAdditionalPhone';
modalAdditionalPhoneInput.name = 'additionalPhone';

const modalSourceInput = document.createElement('input');
modalSourceInput.type = 'text';
modalSourceInput.id = 'modalSource';
modalSourceInput.name = 'source';

const modalClientCommentTextarea = document.createElement('textarea');
modalClientCommentTextarea.id = 'modalClientComment';
modalClientCommentTextarea.name = 'clientComment';
modalClientCommentTextarea.rows = 4; // Keep row count

// Function to insert new fields into the modal form
function addExtendedFieldsToModal() {
    const formGroups = orderEditForm.querySelectorAll('.form-group');
    if (formGroups.length === 0) return; // Exit if form groups aren't ready

    const modalNameGroup = orderEditForm.querySelector('#modalName')?.closest('.form-group');
    const modalPhoneGroup = orderEditForm.querySelector('#modalPhone')?.closest('.form-group');
    const modalProblemGroup = orderEditForm.querySelector('#modalProblem')?.closest('.form-group');
    const modalStatusGroup = orderEditForm.querySelector('#modalStatus')?.closest('.form-group');

    if (!modalNameGroup || !modalPhoneGroup || !modalProblemGroup || !modalStatusGroup) {
        console.error("Required form groups not found in modal.");
        return; // Exit if essential elements are missing
    }

    // Create new form groups for the new fields
    const cityGroup = document.createElement('div');
    cityGroup.classList.add('form-group');
    cityGroup.innerHTML = '<label for="modalCity">Город:</label>';
    cityGroup.appendChild(modalCityInput);

    const directionGroup = document.createElement('div');
    directionGroup.classList.add('form-group');
    directionGroup.innerHTML = '<label for="modalDirection">Направление:</label>';
    directionGroup.appendChild(modalDirectionInput);

    const offerGroup = document.createElement('div');
    offerGroup.classList.add('form-group');
    offerGroup.innerHTML = '<label for="modalOffer">Оффер:</label>';
    offerGroup.appendChild(modalOfferInput);

    const addPhoneGroup = document.createElement('div');
    addPhoneGroup.classList.add('form-group');
    addPhoneGroup.innerHTML = '<label for="modalAdditionalPhone">Доп. телефон:</label>';
    addPhoneGroup.appendChild(modalAdditionalPhoneInput);

    const sourceGroup = document.createElement('div');
    sourceGroup.classList.add('form-group');
    sourceGroup.innerHTML = '<label for="modalSource">Источник:</label>';
    sourceGroup.appendChild(modalSourceInput);

    const clientCommentGroup = document.createElement('div');
    clientCommentGroup.classList.add('form-group');
    clientCommentGroup.innerHTML = '<label for="modalClientComment">Комментарий клиента:</label>';
    clientCommentGroup.appendChild(modalClientCommentTextarea);

    modalPhoneGroup.parentNode.insertBefore(cityGroup, modalPhoneGroup.nextSibling);
    modalProblemGroup.parentNode.insertBefore(directionGroup, modalProblemGroup);
    directionGroup.parentNode.insertBefore(offerGroup, directionGroup.nextSibling);
    offerGroup.parentNode.insertBefore(addPhoneGroup, offerGroup.nextSibling);
    addPhoneGroup.parentNode.insertBefore(sourceGroup, addPhoneGroup.nextSibling);
    sourceGroup.parentNode.insertBefore(clientCommentGroup, sourceGroup.nextSibling);
}

// Call this function once when the page loads and modal elements are ready
document.addEventListener('DOMContentLoaded', () => {
    currentLoggedInUser = getLoggedInUser();
    if (currentLoggedInUser) {
        if (findUser(currentLoggedInUser)) {
            showDashboard(currentLoggedInUser);
        } else {
            clearLoggedInUser();
            hideDashboard();
        }
    } else {
        hideDashboard();
    }

    // Add the extended fields to the modal form once the DOM is ready
    addExtendedFieldsToModal();

    // Add event listeners for view toggling
    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterView();
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });
});

// --- Authentication Flow ---

function showLoginView() {
    loginView.style.display = 'block';
    registerView.style.display = 'none';
    registerMessage.textContent = ''; // Clear any previous registration message
    loginError.textContent = ''; // Clear login error
    registerError.textContent = ''; // Clear register error
}

function showRegisterView() {
    loginView.style.display = 'none';
    registerView.style.display = 'block';
    registerMessage.textContent = ''; // Clear any previous registration message
    loginError.textContent = ''; // Clear login error
    registerError.textContent = ''; // Clear register error
}

function showDashboard(username) {
    authContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex'; // Use flex as per CSS layout
    adminUsernameDisplay.textContent = username;
    activateSection('orders');
    renderOrdersTable();
    updateStatistics();
    loadPendingOrders();
}

function hideDashboard() {
    authContainer.style.display = 'flex'; // Use flex as per CSS layout
    dashboardContainer.style.display = 'none';
    showLoginView(); // Go back to login view
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    currentLoggedInUser = getLoggedInUser();
    if (currentLoggedInUser) {
        // Simple check if user still exists (optional, for robustness)
        if (findUser(currentLoggedInUser)) {
            showDashboard(currentLoggedInUser);
        } else {
            clearLoggedInUser();
            hideDashboard();
        }
    } else {
        hideDashboard();
    }
});

// Login Form Submit
loginForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = findUser(username);

    if (user && user.password === password) {
        setLoggedInUser(user.username);
        showDashboard(user.username);
        loginError.textContent = '';
    } else {
        loginError.textContent = 'Неверный логин или пароль.';
    }
});

// Registration Form Submit
registerForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const regUsername = document.getElementById('regUsername').value;
    const regPassword = document.getElementById('regPassword').value;
    const regConfirmPassword = document.getElementById('regConfirmPassword').value;

    registerError.textContent = '';
    registerMessage.textContent = '';

    if (regPassword !== regConfirmPassword) {
        registerError.textContent = 'Пароли не совпадают.';
        return;
    }

    if (addUser(regUsername, regPassword)) {
        registerMessage.textContent = 'Аккаунт успешно создан! Теперь вы можете войти.';
        registerForm.reset();
        // Optionally switch back to login view after successful registration
        setTimeout(showLoginView, 2000); // Switch after 2 seconds
    } else {
        registerError.textContent = 'Пользователь с таким логином уже существует.';
    }
});

// Logout Button
logoutButton?.addEventListener('click', () => {
    clearLoggedInUser();
    hideDashboard();
});

// --- Dashboard Functionality ---

// Section Switching
function activateSection(sectionId) {
    sidebarLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    contentSections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Trigger chart update if switching to statistics
    if (sectionId === 'statistics') {
        updateStatistics();
        renderOrdersChart(filterOrdersForChart());
    }
}

sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        activateSection(link.getAttribute('data-section'));
    });
});

// --- Orders Table Rendering and Filtering ---

function renderOrdersTable(filteredOrders = orders) {
    ordersTableBody.innerHTML = ''; // Clear current table body
    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    if (sortedOrders.length === 0) {
        noOrdersMessage.style.display = 'block';
        return;
    }

    noOrdersMessage.style.display = 'none';

    sortedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td>${order.address || '-'}</td>
            <td>${order.problem || '-'}</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-button edit-button" data-id="${order.id}">Редактировать</button>
                    <button class="action-button delete-button" data-id="${order.id}">Удалить</button>
                </div>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });
}

function getStatusText(status) {
    switch (status) {
        case 'new': return 'Новая';
        case 'inProgress': return 'В работе';
        case 'completed': return 'Выполнена';
        case 'cancelled': return 'Отменена';
        default: return status;
    }
}

function filterOrders() {
    const status = statusFilter.value;
    const dateRange = dateFilter.value;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

    const filtered = orders.filter(order => {
        // Status filter
        if (status !== 'all' && order.status !== status) {
            return false;
        }

        // Date filter
        const orderDate = new Date(order.date);
        switch (dateRange) {
            case 'today':
                return orderDate >= today && orderDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
            case 'yesterday':
                const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                return orderDate >= yesterday && orderDate < today;
            case 'week':
                const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= lastWeek;
            case 'month':
                const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return orderDate >= lastMonth;
            case 'all':
            default:
                return true;
        }
    });

    renderOrdersTable(filtered);
    updateStatistics(); 
    renderOrdersChart(filterOrdersForChart()); 
}

// Filter event listeners
statusFilter?.addEventListener('change', filterOrders);
dateFilter?.addEventListener('change', filterOrders);
resetFiltersButton?.addEventListener('click', () => {
    statusFilter.value = 'all';
    dateFilter.value = 'all';
    filterOrders();
});

// --- Modal for Editing/Viewing Orders ---
function openOrderModal(order) {
    modalOrderId.textContent = order.id;
    document.getElementById('modalName').value = order.name;
    document.getElementById('modalPhone').value = order.phone;

    // Set values for the new fields
    modalCityInput.value = order.city || '';
    modalDirectionInput.value = order.direction || '';
    modalOfferInput.value = order.offer || '';
    modalAdditionalPhoneInput.value = order.additionalPhone || '';
    modalSourceInput.value = order.source || '';
    modalClientCommentTextarea.value = order.clientComment || '';

    // The 'problem' field in the modal now represents the combined summary for the table
    document.getElementById('modalProblem').value = order.problem || '';

    // Set the status select value
    document.getElementById('modalStatus').value = order.status;
    document.getElementById('modalNotes').value = order.notes;

    orderModal.style.display = 'flex';
}

ordersTableBody?.addEventListener('click', (e) => {
    const target = e.target;
    // Use closest() to find the parent button and get the id
    const button = target.closest('.action-button');
    if (!button) return; // Not a button clicked

    const id = parseInt(button.getAttribute('data-id'));

    if (button.classList.contains('edit-button')) {
        const order = orders.find(o => o.id === id);
        if (order) {
            openOrderModal(order);
        }
    } else if (button.classList.contains('delete-button')) {
        if (confirm(`Вы уверены, что хотите удалить заявку ID ${id}?`)) {
            deleteOrder(id);
        }
    }
});

function closeOrderModal() {
    orderModal.style.display = 'none';
    orderEditForm.reset();
}

closeModalButton?.addEventListener('click', closeOrderModal);
cancelEditButton?.addEventListener('click', closeOrderModal);

// Close modal if clicked outside
window.addEventListener('click', (event) => {
    if (event.target === orderModal) {
        closeOrderModal();
    }
});

// Order Edit Form Submit
orderEditForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(modalOrderId.textContent);
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex > -1) {
        // Update all fields including the new ones
        orders[orderIndex] = {
            ...orders[orderIndex], 
            name: document.getElementById('modalName').value.trim(),
            phone: document.getElementById('modalPhone').value.trim(),
            city: modalCityInput.value.trim(),
            address: '', 
            direction: modalDirectionInput.value.trim(),
            offer: modalOfferInput.value.trim(),
            additionalPhone: modalAdditionalPhoneInput.value.trim(),
            source: modalSourceInput.value.trim(),
            clientComment: modalClientCommentTextarea.value.trim(),
            problem: document.getElementById('modalProblem').value.trim(),
            status: document.getElementById('modalStatus').value,
            notes: document.getElementById('modalNotes').value.trim()
        };
        saveOrders(orders);
        filterOrders(); 
        updateStatistics();
        renderOrdersChart(filterOrdersForChart());
        closeOrderModal();
    }
});

function deleteOrder(id) {
    orders = orders.filter(order => order.id !== id);
    saveOrders(orders);
    filterOrders(); 
    updateStatistics(); 
    renderOrdersChart(filterOrdersForChart()); 
}

// --- Statistics ---
function updateStatistics() {
    const total = orders.length;
    const newCount = orders.filter(order => order.status === 'new').length;
    const inProgressCount = orders.filter(order => order.status === 'inProgress').length;
    const completedCount = orders.filter(order => order.status === 'completed').length;

    document.getElementById('totalOrders').textContent = total;
    document.getElementById('newOrders').textContent = newCount;
    document.getElementById('inProgressOrders').textContent = inProgressCount;
    document.getElementById('completedOrders').textContent = completedCount;
}

// --- Chart.js Integration ---
let ordersChart;

function initializeChart() {
    const ctx = document.getElementById('ordersChart')?.getContext('2d');
    if (!ctx) return; 

    if (ordersChart) {
        ordersChart.destroy(); 
    }

    ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], 
            datasets: [{
                label: 'Количество заявок',
                data: [], 
                backgroundColor: '#4A6DB5',
                borderColor: '#2A4D9B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1, 
                        callback: function(value) {
                            if (value % 1 === 0) { return value; } 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Количество заявок'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Дата'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false 
                },
                title: {
                    display: true,
                    text: 'Распределение заявок по датам'
                }
            }
        }
    });
}

function filterOrdersForChart() {
    return orders;
}

function renderOrdersChart(ordersForChart) {
    if (!ordersChart) {
        initializeChart();
        if (!ordersChart) return; 
    }

    const orderCountsByDate = ordersForChart.reduce((acc, order) => {
        const date = new Date(order.date).toISOString().split('T')[0]; 
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const sortedDates = Object.keys(orderCountsByDate).sort();
    const labels = sortedDates.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}.${month}`;
    });
    const data = sortedDates.map(date => orderCountsByDate[date]);

    ordersChart.data.labels = labels;
    ordersChart.data.datasets[0].data = data;
    ordersChart.update();
}

// --- Change Password ---
changePasswordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    passwordChangeSuccess.textContent = '';
    passwordChangeError.textContent = '';

    if (newPassword !== confirmPassword) {
        passwordChangeError.textContent = 'Новый пароль и подтверждение не совпадают.';
        return;
    }

    if (currentLoggedInUser) {
        const result = updateUserPassword(currentLoggedInUser, currentPassword, newPassword);
        if (result.success) {
            passwordChangeSuccess.textContent = 'Пароль успешно изменен!';
            changePasswordForm.reset();
        } else {
            passwordChangeError.textContent = result.message;
        }
    } else {
        passwordChangeError.textContent = 'Ошибка: Пользователь не авторизован.'; 
    }
});

// --- Load Pending Orders from Main Site (if any) ---
function loadPendingOrders() {
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    if (pendingOrders.length > 0) {
        console.log(`Found ${pendingOrders.length} pending orders in localStorage.`);
        let newOrdersAdded = 0;
        pendingOrders.forEach(orderData => {
            const exists = orders.some(order =>
                order.phone === orderData.phone &&
                order.clientComment === orderData.clientComment && 
                Math.abs(new Date(order.date).getTime() - new Date(orderData.date).getTime()) < 5000 
            );

            if (!exists) {
                const newOrder = {
                    id: Date.now() + newOrdersAdded + Math.floor(Math.random() * 1000), 
                    date: orderData.date,
                    name: orderData.name || 'Не указано',
                    phone: orderData.phone || 'Не указано',
                    city: orderData.city || '', 
                    address: orderData.address || '', 
                    direction: orderData.direction || '', 
                    offer: orderData.offer || '', 
                    additionalPhone: orderData.additionalPhone || '', 
                    source: orderData.source || '', 
                    problem: orderData.problem || '', 
                    clientComment: orderData.clientComment || '', 
                    status: 'new',
                    notes: ''
                };
                orders.push(newOrder);
                newOrdersAdded++;
            }
        });

        if (newOrdersAdded > 0) {
            saveOrders(orders);
            console.log(`${newOrdersAdded} new orders added from pending storage.`);
            filterOrders(); 
            updateStatistics(); 
            renderOrdersChart(filterOrdersForChart()); 
        }

        localStorage.removeItem('pendingOrders');
    }
}