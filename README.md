# gregorybalechatgpt.github.io

<h1>FreeChatgptByGregoryBale</h1>

<p>Это продвинутое веб-приложение для чата с различными моделями искусственного интеллекта. Оно предоставляет пользователям возможность взаимодействовать с несколькими AI моделями, сохранять историю чатов и легко переключаться между ними.</p>

<h2>Особенности</h2>

<ul>
  <li>Поддержка множества AI моделей:
    <ul>
      <li>LLaMA 3-8B: Мощная открытая языковая модель</li>
      <li>Gemini AI: Новейшая мультимодальная AI модель от Google</li>
      <li>GPT-3.5: Широко используемая модель для генерации текста</li>
      <li>GPT-4 32k: Самая продвинутая модель с расширенным контекстным окном</li>
    </ul>
  </li>
  <li>Случайный выбор модели AI для разнообразия ответов</li>
  <li>Сохранение и управление историей чатов</li>
  <li>Подсветка синтаксиса для блоков кода в сообщениях</li>
  <li>Адаптивный дизайн для оптимального отображения на различных устройствах</li>
  <li>Интеграция рекламы Яндекса для монетизации</li>
  <li>Локальное хранение данных для сохранения конфиденциальности пользователя</li>
</ul>

<h2>Технический стек</h2>

<ul>
  <li>Frontend: HTML5, CSS3, JavaScript (ES6+)</li>
  <li>Хранение данных: LocalStorage API</li>
  <li>API взаимодействия: Fetch API для асинхронных запросов</li>
  <li>Стилизация: Custom CSS с использованием CSS переменных</li>
  <li>Отзывчивый дизайн: CSS Media Queries</li>
  <li>Подсветка синтаксиса: Интеграция с библиотекой Prism.js</li>
</ul>

<h2>Установка и запуск</h2>

<ol>
  <li>Склонируйте репозиторий:
    <pre><code>git clone https://github.com/GregoryBale/gregorybalechatgpt.github.io.git</code></pre>
  </li>
  <li>Перейдите в директорию проекта:
    <pre><code>cd gregorybalechatgpt.github.io</code></pre>
  </li>
  <li>Откройте файл <code>index.html</code> в вашем веб-браузере или используйте локальный сервер для разработки.</li>
</ol>

<h2>Детальное использование</h2>

<h3>Выбор AI модели</h3>
<ol>
  <li>Найдите выпадающий список "Выбор модели" в верхней части приложения.</li>
  <li>Выберите конкретную модель или оставьте "Случайный ИИ" для разнообразия.</li>
  <li>Выбранная модель будет использоваться для всех последующих сообщений в текущем чате.</li>
</ol>

<h3>Отправка сообщений</h3>
<ol>
  <li>Введите ваше сообщение в текстовое поле внизу экрана.</li>
  <li>Нажмите кнопку отправки или используйте клавишу Enter для отправки.</li>
  <li>Ожидайте ответа от выбранной AI модели.</li>
</ol>

<h3>Управление чатами</h3>
<ol>
  <li>Используйте боковую панель для просмотра истории чатов.</li>
  <li>Нажмите на любой чат для его загрузки.</li>
  <li>Для создания нового чата нажмите кнопку "Новый чат".</li>
  <li>Чтобы очистить текущий чат, используйте кнопку "Очистить чат".</li>
</ol>

<h2>Структура проекта</h2>

<ul>
  <li><code>index.html</code>: Основная структура веб-приложения
    <pre><code>&lt;!-- Пример структуры -->
&lt;div class="chat-app">
  &lt;div class="sidebar">
    &lt;!-- Сайдбар с историей чатов -->
  &lt;/div>
  &lt;div class="chat-main">
    &lt;div id="chat-messages">
      &lt;!-- Сообщения чата -->
    &lt;/div>
    &lt;div class="chat-input-container">
      &lt;!-- Поле ввода и кнопка отправки -->
    &lt;/div>
  &lt;/div>
&lt;/div></code></pre>
  </li>
  <li><code>script.js</code>: JavaScript код для функциональности приложения
    <pre><code>// Пример основных функций
const sendMessage = async () => {
  // Логика отправки сообщения
};

const createNewChat = () => {
  // Создание нового чата
};

const loadChat = (chatId) => {
  // Загрузка выбранного чата
};

// Обработчики событий
sendButton.addEventListener('click', sendMessage);
newChatButton.addEventListener('click', createNewChat);
// ... другие обработчики ...</code></pre>
  </li>
  <li><code>styles.css</code>: CSS стили для оформления приложения
    <pre><code>/* Пример стилей */
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  /* ... другие переменные ... */
}

.chat-app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  background-color: var(--tg-theme-secondary-bg-color);
}

/* ... другие стили ... */</code></pre>
  </li>
</ul>

<h2>Ключевые функции</h2>

<h3>Отправка сообщений</h3>
<pre><code>async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

        const model = selectedModel === 'random' ? getRandomModel() : selectedModel;
        const apiUrl = aiModels[model];

        try {
            const response = await fetch(apiUrl + encodeURIComponent(message.replace(/ /g, '+')));
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            if (data.ok && data.response) {
                addMessage(data.response, false, `Ответ получен от: ${model}`);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            // Обработка ошибки и попытка использовать другую модель
        }
    }
}</code></pre>
<p>Эта функция отправляет сообщение пользователя выбранной модели AI, обрабатывает ответ и добавляет его в чат.</p>

<h3>Управление историей чатов</h3>
<pre><code>function createNewChat() {
    const chatId = Date.now().toString();
    chats[chatId] = {
        id: chatId,
        title: `Чат ${Object.keys(chats).length + 1}`,
        messages: []
    };
    currentChatId = chatId;
    saveChatToLocalStorage();
    updateChatHistory();
    loadChat(chatId);
}

function loadChat(chatId) {
    currentChatId = chatId;
    chatMessages.innerHTML = '';
    messageCount = 0;
    chats[chatId].messages.forEach(msg => {
        addMessage(msg.content, msg.isUser, msg.aiInfo, msg.isAd);
    });
    updateChatHistory();
}</code></pre>
<p>Эти функции отвечают за создание новых чатов и загрузку существующих, обеспечивая удобное управление историей разговоров.</p>

<h3>Интеграция рекламы</h3>
<pre><code>function addMessage(content, isUser = false, aiInfo = '', isAd = false) {
    // ... существующий код ...

    messageCount++;
    if (messageCount % 5 === 0 && !isAd) {
        addMessage('', false, '', true); // Добавляем рекламу после каждого 5-го сообщения
    }
}</code></pre>
<p>Этот фрагмент кода отвечает за вставку рекламных сообщений в чат через определенные интервалы.</p>

<h2>Адаптивный дизайн</h2>

<p>Приложение адаптируется к различным размерам экрана для оптимального отображения на мобильных устройствах:</p>

<pre><code>@media (max-width: 768px) {
    .chat-app {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        height: auto;
        max-height: 40vh;
    }

    .chat-main {
        height: 60vh;
        max-width: 100%;
    }

    .chat-input-container {
        position: sticky;
        bottom: 0;
        background-color: var(--tg-theme-bg-color);
        z-index: 10;
    }
}</code></pre>

<h2>Безопасность и конфиденциальность</h2>

<ul>
  <li>Все данные чатов хранятся локально в браузере пользователя с использованием LocalStorage.</li>
  <li>Приложение не отправляет личные данные пользователя на сервер, кроме текста сообщений для обработки AI моделями.</li>
  <li>Рекомендуется не вводить конфиденциальную информацию в чат, так как сообщения отправляются внешним AI сервисам.</li>
</ul>

<h2>Планы по развитию</h2>

<ul>
  <li>Добавление возможности экспорта и импорта истории чатов</li>
  <li>Интеграция дополнительных AI моделей</li>
  <li>Улучшение пользовательского интерфейса и добавление темной темы</li>
  <li>Реализация системы тегов для лучшей организации чатов</li>
  <li>Добавление возможности отправки изображений и их обработки AI моделями</li>
</ul>

<h2>Вклад в проект</h2>

<p>Мы приветствуем вклад в развитие проекта! Если вы хотите внести свой вклад:</p>

<ol>
  <li>Форкните репозиторий</li>
  <li>Создайте ветку для вашей функции (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>Зафиксируйте ваши изменения (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>Отправьте изменения в вашу ветку (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>Откройте Pull Request</li>
</ol>

<h2>Лицензия</h2>

<p>Распространяется под лицензией MIT. Смотрите <a href="https://choosealicense.com/licenses/mit/">LICENSE</a> для получения дополнительной информации.</p>

<h2>Контакты</h2>

<p>Gregory Bale - <a href="https://github.com/GregoryBale">@GregoryBale</a></p>

<p>Ссылка на проект: <a href="https://github.com/GregoryBale/gregorybalechatgpt.github.io">https://github.com/GregoryBale/gregorybalechatgpt.github.io</a></p>

<h2>Благодарности</h2>

<ul>
  <li><a href="https://github.com/PrismJS/prism">Prism.js</a> за подсветку синтаксиса кода</li>
  <li>Всем контрибьюторам, которые помогли улучшить этот проект</li>
  <li>Вдохновлено различными открытыми AI проектами и чат-интерфейсами</li>
  <li>версия 0.012 (beta)</li>
</ul>
