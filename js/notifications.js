// Инициализация уведомлений
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.elements = this.initializeElements();
        this.bindEvents();
        this.loadNotifications();
    }

    // Инициализация DOM элементов
    initializeElements() {
        return {
            notificationsBtn: document.getElementById('notifications-btn'),
            notificationBadge: document.querySelector('.notification-badge'),
            notificationsModal: document.getElementById('notifications-modal'),
            notificationList: document.getElementById('notification-list'),
            closeNotificationsBtn: document.getElementById('close-notifications'),
            mobileNotificationsBtn: document.getElementById('mobile-notifications-btn'),
            mobileNotificationDot: document.getElementById('mobile-notification-dot'),
            menuNotificationDot: document.getElementById('menu-notification-dot')
        };
    }

    // Привязка обработчиков событий
    bindEvents() {
        // Открытие уведомлений
        this.elements.notificationsBtn?.addEventListener('click', () => this.openNotifications());
        this.elements.mobileNotificationsBtn?.addEventListener('click', () => this.openNotifications());
        
        // Закрытие уведомлений
        this.elements.closeNotificationsBtn?.addEventListener('click', () => this.closeNotifications());
        
        // Закрытие по клику вне модального окна
        this.elements.notificationsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.notificationsModal) {
                this.closeNotifications();
            }
        });

        // Обработка действий с уведомлениями
        this.elements.notificationList?.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const index = parseInt(button.dataset.index, 10);
            if (button.classList.contains('toggle-read')) {
                this.toggleReadStatus(index);
            } else if (button.classList.contains('delete-notification')) {
                this.deleteNotification(index);
            }
        });

        // Обработка клавиши Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.notificationsModal.style.display === 'block') {
                this.closeNotifications();
            }
        });
    }

    // Добавление нового уведомления
    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(notification); // Добавляем в начало массива
        this.unreadCount++;
        this.updateNotificationUI();
        this.saveNotifications();
        
        // Показываем уведомление сразу, если модальное окно открыто
        if (this.elements.notificationsModal.style.display === 'block') {
            this.renderNotifications();
        }

        return notification.id;
    }

    // Обновление интерфейса уведомлений
    updateNotificationUI() {
        const hasUnread = this.unreadCount > 0;
        
        if (this.elements.notificationBadge) {
            this.elements.notificationBadge.textContent = this.unreadCount;
            this.elements.notificationBadge.style.display = hasUnread ? 'block' : 'none';
        }

        if (this.elements.mobileNotificationDot) {
            this.elements.mobileNotificationDot.style.display = hasUnread ? 'block' : 'none';
        }

        if (this.elements.menuNotificationDot) {
            this.elements.menuNotificationDot.style.display = hasUnread ? 'block' : 'none';
        }
    }

    // Открытие модального окна
    openNotifications() {
        if (this.elements.notificationsModal) {
            this.elements.notificationsModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку
            this.renderNotifications();
            this.elements.notificationsModal.classList.add('active');
        }
    }

    // Закрытие модального окна
    closeNotifications() {
        if (this.elements.notificationsModal) {
            this.elements.notificationsModal.classList.remove('active');
            document.body.style.overflow = ''; // Возвращаем прокрутку
            setTimeout(() => {
                this.elements.notificationsModal.style.display = 'none';
            }, 300); // Соответствует времени анимации в CSS
        }
    }

    // Рендеринг уведомлений
    renderNotifications() {
        if (!this.elements.notificationList) return;

        if (this.notifications.length === 0) {
            this.elements.notificationList.innerHTML = '<div class="notification-empty">Нет уведомлений</div>';
            return;
        }

        this.elements.notificationList.innerHTML = this.notifications
            .map((notification, index) => `
                <div class="notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}">
                    <div class="notification-header">
                        <h3>${this.escapeHtml(notification.title)}</h3>
                        <span class="notification-time">${this.formatTime(notification.timestamp)}</span>
                    </div>
                    <p class="notification-message">${this.escapeHtml(notification.message)}</p>
                    <div class="notification-actions">
                        <button class="toggle-read" data-index="${index}">
                            ${notification.read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
                        </button>
                        <button class="delete-notification" data-index="${index}">Удалить</button>
                    </div>
                </div>
            `)
            .join('');
    }

    // Переключение статуса прочтения
    toggleReadStatus(index) {
        if (index < 0 || index >= this.notifications.length) return;

        const notification = this.notifications[index];
        notification.read = !notification.read;
        
        if (notification.read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
        } else {
            this.unreadCount++;
        }

        this.updateNotificationUI();
        this.renderNotifications();
        this.saveNotifications();
    }

    // Удаление уведомления
    deleteNotification(index) {
        if (index < 0 || index >= this.notifications.length) return;

        if (!this.notifications[index].read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
        }

        this.notifications.splice(index, 1);
        this.updateNotificationUI();
        this.renderNotifications();
        this.saveNotifications();
    }

    // Форматирование времени
    formatTime(date) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Экранирование HTML
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Сохранение в localStorage
    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('unreadCount', this.unreadCount.toString());
        } catch (error) {
            console.error('Ошибка при сохранении уведомлений:', error);
        }
    }

    // Загрузка из localStorage
    loadNotifications() {
        try {
            const savedNotifications = localStorage.getItem('notifications');
            const savedUnreadCount = localStorage.getItem('unreadCount');

            if (savedNotifications) {
                this.notifications = JSON.parse(savedNotifications);
                this.notifications.forEach(n => {
                    if (typeof n.timestamp === 'string') {
                        n.timestamp = new Date(n.timestamp);
                    }
                });
            }

            if (savedUnreadCount) {
                this.unreadCount = parseInt(savedUnreadCount, 10) || 0;
            }

            this.updateNotificationUI();
        } catch (error) {
            console.error('Ошибка при загрузке уведомлений:', error);
            this.notifications = [];
            this.unreadCount = 0;
        }
    }
}

// Инициализация системы уведомлений
const notificationSystem = new NotificationSystem();

// Функция для проверки блокировщика рекламы
(function() {
    let hasError = false;
    let alertTitle = '';
    let alertMessage = '';

    function createCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    function readCookie(name) {
        return document.cookie.split('; ').reduce((r, c) => {
            const parts = c.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    }

    function detectAdBlocker() {
        if (typeof window.yaContextCb === 'undefined') {
            hasError = true;
            alertTitle = 'Обнаружен блокировщик рекламы';
            alertMessage = 'Использование блокировщика может повлиять на работу сайта. Рекомендуем отключить его для полной функциональности.';
        }
    }

    window.addEventListener('error', function(event) {
        if (event.target.tagName === 'SCRIPT') {
            hasError = true;
            alertTitle = 'Обнаружен блокировщик рекламы и скриптов!';
            alertMessage = 'Обратите внимание, что использование блокировщика рекламы может привести к некоторым проблемам с функциональностью сайта. В частности, некоторые функции могут работать некорректно, а загрузка страниц может занимать больше времени или отображаться неправильно. Вы все равно можете использовать сайт с включённым блокировщиком, однако имейте в виду, что возможны сбои в работе.';
        }
    }, true);

    function sendNotification() {
        if (hasError && alertTitle && alertMessage && readCookie('doNotShowAgain') !== 'true') {
            notificationSystem.addNotification(alertTitle, alertMessage, 'warning');
        }
    }

    window.addEventListener('load', function() {
        setTimeout(() => {
            detectAdBlocker();
            sendNotification();
        }, 1000);
    });
})();

// Экспорт для глобального доступа
window.addNotification = (title, message, type) => notificationSystem.addNotification(title, message, type);