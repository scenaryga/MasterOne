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
// Function to get orders from localStorage or initialize
function getOrders() {
    const storedOrders = localStorage.getItem('crmOrders');
    if (storedOrders) {
        return JSON.parse(storedOrders);
    }
    // Initial dummy data if no orders are stored
    return [
        {
            id: 1,
            date: '2024-05-15T10:30:00',
            name: 'Иван Петров',
            phone: '+7 (999) 123-45-67',
            address: 'ул. Ленина, 42, кв. 56',
            problem: 'Сломался смеситель в ванной',
            status: 'new',
            notes: ''
        },
        {
            id: 2,
            date: '2024-05-14T14:15:00',
            name: 'Елена Смирнова',
            phone: '+7 (917) 987-65-43',
            address: 'Профсоюзная ул., 100, кв. 22',
            problem: 'Не работает розетка на кухне',
            status: 'inProgress',
            notes: 'Мастер выезжает 16 мая'
        },
        {
            id: 3,
            date: '2024-05-13T09:45:00',
            name: 'Алексей Иванов',
            phone: '+7 (905) 456-78-90',
            address: 'ул. Тверская, 15, кв. 89',
            problem: 'Требуется собрать шкаф IKEA',
            status: 'completed',
            notes: 'Выполнено 14 мая, клиент доволен'
        },
        {
            id: 4,
            date: '2024-05-12T16:20:00',
            name: 'Ольга Кузнецова',
            phone: '+7 (926) 111-22-33',
            address: 'Ленинградский пр-т, 78, кв. 145',
            problem: 'Протечка под раковиной',
            status: 'cancelled',
            notes: 'Клиент отменил заказ'
        }
    ];
}

// Function to save orders to localStorage
function saveOrders(ordersToSave) {
    localStorage.setItem('crmOrders', JSON.stringify(ordersToSave));
}

// Initialize orders from storage or default
let orders = getOrders();

// Function to handle new orders from the main site
window.addNewOrder = function(orderData) {
    const newOrder = {
        id: Date.now(), // Simple unique ID
        date: new Date().toISOString(),
        name: orderData.name || 'Не указано',
        phone: orderData.phone || 'Не указано',
        address: orderData.address || '',
        problem: orderData.problem || '',
        status: 'new', // New orders default to 'new' status
        notes: ''
    };
    orders.push(newOrder);
    saveOrders(orders);
    console.log('New order added:', newOrder);
    // If logged in and on the orders page, refresh the table
    if (dashboardContainer.style.display !== 'none' && document.getElementById('orders').classList.contains('active')) {
        renderOrdersTable();
        updateStatistics();
    }
    return true; // Indicate successful processing
};

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
const closeModalButton = document.querySelector('.close-modal'); // Corrected variable name
const orderEditForm = document.getElementById('orderEditForm');
const cancelEditButton = document.getElementById('cancelEdit');
const changePasswordForm = document.getElementById('changePasswordForm');
const passwordChangeSuccess = document.getElementById('passwordChangeSuccess');
const passwordChangeError = document.getElementById('passwordChangeError');
const modalOrderId = document.getElementById('modalOrderId');

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
    // Load initial dashboard content
    activateSection('orders');
    renderOrdersTable(); // Initial render
    updateStatistics(); // Initial stats
    initializeChart(); // Initialize chart on stats tab
    renderOrdersChart(filterOrdersForChart()); // Initial chart render
    loadPendingOrders(); // Load any orders from the main site's localStorage
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

    // Add event listeners for view toggling
    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterView();
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });

    // Existing event listeners...
    // ... (loginForm, registerForm, logoutButton, sidebarLinks, filters, modal)
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
    updateStatistics(); // Update stats based on filtered data (or all data depending on requirement)
    renderOrdersChart(filterOrdersForChart()); // Update chart based on filtered data
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
    document.getElementById('modalAddress').value = order.address;
    document.getElementById('modalProblem').value = order.problem;
    // Set the status select value
    document.getElementById('modalStatus').value = order.status;
    document.getElementById('modalNotes').value = order.notes;

    orderModal.style.display = 'flex';
}

ordersTableBody?.addEventListener('click', (e) => {
    const target = e.target;
    const id = parseInt(target.getAttribute('data-id'));

    if (target.classList.contains('edit-button')) {
        const order = orders.find(o => o.id === id);
        if (order) {
            openOrderModal(order);
        }
    } else if (target.classList.contains('delete-button')) {
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
        orders[orderIndex] = {
            ...orders[orderIndex], // Keep existing properties like date
            name: document.getElementById('modalName').value,
            phone: document.getElementById('modalPhone').value,
            address: document.getElementById('modalAddress').value,
            problem: document.getElementById('modalProblem').value,
            // Get the updated status from the select input
            status: document.getElementById('modalStatus').value,
            notes: document.getElementById('modalNotes').value
        };
        saveOrders(orders);
        filterOrders(); // Re-render table with current filters
        // Also update stats and chart as status affects them
        updateStatistics();
        renderOrdersChart(filterOrdersForChart());
        closeOrderModal();
    }
});

function deleteOrder(id) {
    orders = orders.filter(order => order.id !== id);
    saveOrders(orders);
    filterOrders(); // Re-render table with current filters
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
     if (!ctx) return; // Ensure context exists

    if (ordersChart) {
        ordersChart.destroy(); // Destroy existing chart instance if any
    }

    ordersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // Labels will be dates or periods
            datasets: [{
                label: 'Количество заявок',
                data: [], // Data will be counts
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
                         stepSize: 1, // Ensure integer steps for count
                         callback: function(value) {
                             if (value % 1 === 0) { return value; } // Only show integers
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
                    display: false // Hide legend for single dataset
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
     // Use all orders for the chart, regardless of table filters
     return orders;
}

function renderOrdersChart(ordersForChart) {
    if (!ordersChart) {
        initializeChart();
         if (!ordersChart) return; // If initialization failed, stop
    }

    // Group orders by date (day)
    const orderCountsByDate = ordersForChart.reduce((acc, order) => {
        const date = new Date(order.date).toISOString().split('T')[0]; // Get 'YYYY-MM-DD'
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Sort dates chronologically and extract labels and data
    const sortedDates = Object.keys(orderCountsByDate).sort();
    const labels = sortedDates.map(date => {
        // Format date for display (e.g., DD.MM)
        const [year, month, day] = date.split('-');
        return `${day}.${month}`;
    });
    const data = sortedDates.map(date => orderCountsByDate[date]);

    // Update chart data
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
         passwordChangeError.textContent = 'Ошибка: Пользователь не авторизован.'; // Should not happen if dashboard is shown
    }
});

// --- Load Pending Orders from Main Site (if any) ---
function loadPendingOrders() {
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    if (pendingOrders.length > 0) {
        console.log(`Found ${pendingOrders.length} pending orders in localStorage.`);
        let newOrdersAdded = 0;
        pendingOrders.forEach(orderData => {
            // Check if an order with the same timestamp already exists (basic deduplication)
            const exists = orders.some(order => order.date === orderData.date && order.phone === orderData.phone);
            if (!exists) {
                 const newOrder = {
                    id: Date.now() + newOrdersAdded, // Add a small offset for uniqueness if dates are same
                    date: orderData.date,
                    name: orderData.name || 'Не указано',
                    phone: orderData.phone || 'Не указано',
                    address: orderData.address || '',
                    problem: orderData.problem || '',
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
             filterOrders(); // Re-render table
             updateStatistics(); // Update stats
             renderOrdersChart(filterOrdersForChart()); // Update chart
        }

        // Clear pending orders after processing
        localStorage.removeItem('pendingOrders');
    }
}

// Call loadPendingOrders when the dashboard is shown
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing login check logic) ...
     currentLoggedInUser = getLoggedInUser();
    if (currentLoggedInUser) {
         if (findUser(currentLoggedInUser)) {
             showDashboard(currentLoggedInUser);
             // loadPendingOrders is now called within showDashboard
         } else {
            clearLoggedInUser();
            hideDashboard();
        }
    } else {
        hideDashboard();
    }

    // Add event listeners for view toggling
    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterView();
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });

    // ... (rest of existing DOMContentLoaded logic) ...
});