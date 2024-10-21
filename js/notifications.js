// Инициализация уведомлений
let notifications = [];
let unreadCount = 0;

// Элементы DOM
const elements = {
    notificationsBtn: document.getElementById('notifications-btn'),
    notificationBadge: document.getElementById('notification-count'),
    notificationsModal: document.getElementById('notifications-modal'),
    notificationList: document.getElementById('notification-list'),
    closeNotificationsBtn: document.getElementById('close-notifications'),
    mobileNotificationsBtn: document.getElementById('mobile-notifications-btn'),
    mobileNotificationDot: document.getElementById('mobile-notification-dot'),
    menuNotificationDot: document.getElementById('menu-notification-dot')
};

// Добавление нового уведомления
function addNotification(title, message, type = 'info') {
    notifications.push({ title, message, type, timestamp: new Date(), read: false });
    unreadCount++;
    updateNotificationUI();
    saveNotifications();
}

// Обновление интерфейса уведомлений
function updateNotificationUI() {
    const hasUnread = unreadCount > 0;
    elements.notificationBadge.textContent = unreadCount;
    elements.notificationBadge.style.display = hasUnread ? 'inline' : 'none';
    elements.mobileNotificationDot.style.display = hasUnread ? 'inline-block' : 'none';
    elements.menuNotificationDot.style.display = hasUnread ? 'inline-block' : 'none';
}

// Открытие модального окна уведомлений
function openNotifications() {
    elements.notificationsModal.style.display = 'block';
    renderNotifications();
}

// Рендеринг уведомлений
function renderNotifications() {
    elements.notificationList.innerHTML = notifications.length ? '' : '<p>Нет уведомлений</p>';
    notifications.forEach((notification, index) => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`;
        notificationItem.innerHTML = `
            <div class="notification-header">
                <h3>${notification.title}</h3>
                <span class="notification-time">${formatTime(notification.timestamp)}</span>
            </div>
            <p class="notification-message">${notification.message}</p>
            <div class="notification-actions">
                <button class="toggle-read" data-index="${index}">${notification.read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}</button>
                <button class="delete-notification" data-index="${index}">Удалить</button>
            </div>
        `;
        elements.notificationList.appendChild(notificationItem);
    });
}

// Форматирование времени
function formatTime(date) {
    return date.toLocaleString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Закрытие модального окна
function closeNotifications() {
    elements.notificationsModal.style.display = 'none';
}

// Переключение статуса прочтения уведомления
function toggleReadStatus(index) {
    notifications[index].read = !notifications[index].read;
    if (notifications[index].read) {
        unreadCount = Math.max(0, unreadCount - 1);
    } else {
        unreadCount++;
    }
    updateNotificationUI();
    renderNotifications();
    saveNotifications();
}

// Удаление уведомления
function deleteNotification(index) {
    if (!notifications[index].read) {
        unreadCount = Math.max(0, unreadCount - 1);
    }
    notifications.splice(index, 1);
    updateNotificationUI();
    renderNotifications();
    saveNotifications();
}

// Сохранение уведомлений в localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('unreadCount', unreadCount);
}

// Загрузка уведомлений из localStorage
function loadNotifications() {
    const savedNotifications = localStorage.getItem('notifications');
    const savedUnreadCount = localStorage.getItem('unreadCount');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
        notifications.forEach(n => n.timestamp = new Date(n.timestamp));
    }
    if (savedUnreadCount) {
        unreadCount = parseInt(savedUnreadCount, 10);
    }
    updateNotificationUI();
}

// События
elements.notificationsBtn.addEventListener('click', openNotifications);
elements.mobileNotificationsBtn.addEventListener('click', openNotifications);
elements.closeNotificationsBtn.addEventListener('click', closeNotifications);
elements.notificationList.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-read')) {
        const index = parseInt(e.target.dataset.index, 10);
        toggleReadStatus(index);
    } else if (e.target.classList.contains('delete-notification')) {
        const index = parseInt(e.target.dataset.index, 10);
        deleteNotification(index);
    }
});

// Инициализация
loadNotifications();

// Функция для проверки и отправки уведомления о блокировщике рекламы
(function() {
    let hasError = false;
    let alertTitle = '';
    let alertMessage = '';

    // Функция для установки куки
    function createCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    // Функция для получения значения куки
    function readCookie(name) {
        return document.cookie.split('; ').reduce((r, c) => {
            const parts = c.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }

    // Проверка наличия блокировщиков скриптов
    function detectAdBlocker() {
        if (typeof window.yaContextCb === 'undefined') {
            hasError = false;
            alertTitle = 'Обнаружен блокировщик рекламы и проблема загрузке скриптов';
            alertMessage = 'Блокировщик рекламы или блокировка сторонних скриптов может повлиять на работу сайта. Рекомендуем отключить блокировщик для полной функциональности. Обнаружена проблема при загрузке некоторых скриптов. Это может повлиять на работу сайта. Попробуйте обновить страницу или отключить блокировщики рекламы.';
        }
    }

    // Проверка на ошибки загрузки скриптов
    window.addEventListener('error', function(event) {
        if (event.target.tagName === 'SCRIPT') {
            hasError = true;
            alertTitle = 'Обнаружен блокировщик рекламы и проблема загрузке скриптов';
            alertMessage = 'Обнаружена проблема при загрузке некоторых скриптов. Это может повлиять на работу сайта. Попробуйте обновить страницу или отключить блокировщики рекламы.';
        }
    }, true);

    // Функция для отправки уведомления
    function sendNotification() {
        if (hasError && alertTitle !== '' && alertMessage !== '' && readCookie('doNotShowAgain') !== 'true') {
            if (typeof addNotification === 'function') {
                addNotification(alertTitle, alertMessage, 'warning');
            } else {
                console.error('Функция addNotification не найдена');
            }
        }
    }

    // Запуск проверок при загрузке страницы
    window.addEventListener('load', function() {
        detectAdBlocker();
        sendNotification();
    });
})();