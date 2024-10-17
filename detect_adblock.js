function detectAdBlock() {
    // Проверяем, было ли сообщение уже показано ранее
    if (localStorage.getItem('adblockMessageShown')) {
        return; // Если сообщение уже показывалось, выходим из функции
    }

    // 1. Проверка элемента, который обычно блокируется
    const adElement = document.createElement('div');
    adElement.className = 'ad-banner';
    adElement.style.display = 'none';
    document.body.appendChild(adElement);

    // 2. Проверка через попытку загрузки рекламного скрипта
    const adScript = document.createElement('script');
    adScript.src = 'https://ads.example.com/fake-ad.js'; // Подставьте фальшивый URL, который обычно блокируется
    adScript.onerror = () => {
        displayAdblockMessage(); // Если не удалось загрузить скрипт, блокировщик обнаружен
    };
    document.body.appendChild(adScript);

    // 3. Таймер для проверки элемента через небольшой промежуток времени
    setTimeout(() => {
        if (adElement.offsetHeight === 0) {
            displayAdblockMessage(); // Если элемент не отображается, блокировщик обнаружен
        }
        document.body.removeChild(adElement); // Удаление тестового элемента
    }, 500);

    // 4. Дополнительная проверка через классические рекламные классы и стили
    const bait = document.createElement('div');
    bait.innerHTML = '&nbsp;';
    bait.className = 'adsbox';
    bait.style.display = 'none';
    document.body.appendChild(bait);

    setTimeout(() => {
        if (window.getComputedStyle(bait).display === 'none') {
            displayAdblockMessage(); // Блокировщик обнаружен, если элемент скрыт
        }
        document.body.removeChild(bait);
    }, 500);
}

// Функция для отображения сообщения о блокировке рекламы
function displayAdblockMessage() {
    const chatMessages = document.getElementById('chat-messages');

    // Создаем элемент для сообщения
    const adblockMessage = document.createElement('div');
    adblockMessage.className = 'message adblock-message ai-message';
    adblockMessage.innerHTML = `
        <p>Обнаружен блокировщик рекламы. Он может мешать работе сайта и доступа к API моделей ИИ.</p>
        <button class="support-button" id="more-info-button">Подробнее</button>
    `;

    // Добавляем сообщение в чат
    chatMessages.appendChild(adblockMessage);

    // Сохраняем в локальном хранилище, что сообщение было показано
    localStorage.setItem('adblockMessageShown', 'true');

    // Добавляем событие клика для кнопки "Подробнее"
    document.getElementById('more-info-button').addEventListener('click', openAdblockInfoModal);
}

// Функция для открытия модального окна с информацией
function openAdblockInfoModal() {
    const modal = document.getElementById('adblock-info-modal');
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeAdblockInfoModal() {
    const modal = document.getElementById('adblock-info-modal');
    modal.style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('adblock-info-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Запуск функции проверки при загрузке страницы
window.onload = () => {
    detectAdBlock();
};