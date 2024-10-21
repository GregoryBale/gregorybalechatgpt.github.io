(function() {
    let hasError = false;
    let alertMessage = '';

    // Функция для установки куки
    function createCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
    }

    // Функция для получения значения куки
    function readCookie(name) {
        return document.cookie.split('; ').reduce((result, current) => {
            const parts = current.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : result;
        }, '');
    }

    // Функция для отправки уведомления
    function sendNotification() {
        if (hasError && alertMessage !== '' && readCookie('doNotShowAgain') !== 'true') {
            // Проверяем, существует ли функция addNotification
            if (typeof addNotification === 'function') {
                addNotification(alertMessage);
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