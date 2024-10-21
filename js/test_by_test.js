// Инициализация функции для проверки состояния сайта
(function() {
    let hasError = false; // Переменная для отслеживания ошибок
    let alertMessage = ''; // Переменная для хранения сообщения об ошибке

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

    // Проверка наличия блокировщиков скриптов
    function detectAdBlocker() {
        if (typeof window.yaContextCb === 'undefined') {
            hasError = true;
            alertMessage += 'Обнаружен блокировщик рекламы или блокировка сторонних скриптов. ';
        }
    }

    // Проверка на ошибки загрузки скриптов
    window.addEventListener('error', function(event) {
        if (event.target.tagName === 'SCRIPT') {
            hasError = true;
            alertMessage = `
                <div style="text-align: center; padding: 20px;">
                    <img src="https://img.freepik.com/premium-vector/warning-icon-vector-isolated-white-background_162100-446.jpg" alt="Описание изображения" style="max-width: 20%; height: auto;"><br>
                    <strong style="font-size: 20px; color: #333;">Обнаружен блокировщик рекламы и скриптов!</strong><br><br>
                    <span style="color: #555;"><b>Проблемы, которые могут возникнуть:</b></span><br>
                    <ul style="list-style-type: none; padding: 0; color: #555;">
                        <li>Некоторые функции могут <strong>работать некорректно.</strong> Сайт может <strong>загружаться медленнее</strong> или отображаться неправильно.</strong></li>
                    </ul>
                    <br>
                    <span style="color: #777;">Сайтом можно пользоваться и с включённым блокировщиком рекламы или других плагинов, но возможны сбои.</span>
                </div>
            `;
        }
    }, true);

    // Функция для отображения сообщения в виде модального окна
    function showAlertMessage() {
        if (hasError && alertMessage !== '' && readCookie('doNotShowAgain') !== 'true') {
            // Создаем модальное окно
            const overlay = document.createElement('div');
            overlay.className = 'overlay';
            document.body.appendChild(overlay);

            // Создаем контейнер для сообщения
            const alertContainer = document.createElement('div');
            alertContainer.className = 'alert-container';
            alertContainer.innerHTML = `
                <div class="alert-content">${alertMessage}</div>
                <button id="close-alert" class="close-alert">Закрыть</button>
            `;
            overlay.appendChild(alertContainer);

            // Обработчик события для кнопки "Закрыть"
            document.getElementById('close-alert').addEventListener('click', function() {
                overlay.remove(); // Удалить модальное окно из DOM
            });

            // Обработчик события для чекбокса "Не показывать снова"
            document.getElementById('do-not-show-again').addEventListener('change', function() {
                if (this.checked) {
                    createCookie('doNotShowAgain', 'true', 365); // Установить куки на 1 год
                }
            });
        }
    }

    // Запуск проверок при загрузке страницы
    window.addEventListener('load', function() {
        detectAdBlocker(); // Проверка на блокировку рекламы
        showAlertMessage(); // Отображение сообщения, если проблемы обнаружены
    });

    // CSS стили
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .alert-container {
            background-color: #fefefe;
            border-radius: 12px;
            padding: 20px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            position: relative;
        }
        .alert-content {
            margin-bottom: 20px;
            color: #333;
        }
        h2 {
            font-size: 24px;
            color: #d9534f; /* Красный цвет для заголовка */
            margin: 10px 0;
        }
        .do-not-show-again {
            display: block;
            margin: 15px 0;
            font-size: 14px;
            text-align: left; /* Выравнивание текста влево */
        }
        .close-alert {
            background-color: #f3f4f6; /* Цвет кнопки */
            color: black;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .close-alert:hover {
            background-color: black; /* Темнее при наведении */
            color: white;
        }
    `;
    document.head.appendChild(style);

})();
