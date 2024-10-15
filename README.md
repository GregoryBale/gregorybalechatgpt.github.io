# gregorybalechatgpt.github.io

<h1>gregorybalechatgpt</h1>

<p>Это веб-приложение для чата с различными моделями искусственного интеллекта. Приложение позволяет пользователям общаться с разными AI моделями, сохранять историю чатов и переключаться между ними.</p>

<h2>Особенности</h2>

<ul>
  <li>Поддержка нескольких AI моделей: LLaMA 3-8B, Gemini AI, GPT-3.5, GPT-4 32k</li>
  <li>Возможность случайного выбора модели AI</li>
  <li>Сохранение истории чатов</li>
  <li>Подсветка синтаксиса для блоков кода</li>
  <li>Адаптивный дизайн для мобильных устройств</li>
  <li>Интеграция рекламы Яндекса</li>
</ul>

<h2>Установка</h2>

<ol>
  <li>Склонируйте репозиторий:
    <pre><code>git clone https://github.com/your-username/chat-ai-web-app.git</code></pre>
  </li>
  <li>Откройте файл <code>index.html</code> в вашем веб-браузере.</li>
</ol>

<h2>Использование</h2>

<ol>
  <li>Выберите модель AI из выпадающего списка или оставьте "Случайный ИИ".</li>
  <li>Введите ваше сообщение в поле ввода внизу экрана.</li>
  <li>Нажмите кнопку отправки или клавишу Enter для отправки сообщения.</li>
  <li>AI ответит на ваше сообщение.</li>
  <li>Используйте боковую панель для переключения между чатами или создания нового чата.</li>
</ol>

<h2>Структура проекта</h2>

<ul>
  <li><code>index.html</code>: Основная структура веб-приложения</li>
  <li><code>script.js</code>: JavaScript код для функциональности приложения</li>
  <li><code>styles.css</code>: CSS стили для оформления приложения</li>
</ul>

<h2>Основные функции</h2>

<h3>Отправка сообщений</h3>
<pre><code>async function sendMessage() {
    // ... код функции ...
}</code></pre>
<p>Эта функция отправляет сообщение пользователя выбранной модели AI и обрабатывает ответ.</p>

<h3>Создание нового чата</h3>
<pre><code>function createNewChat() {
    // ... код функции ...
}</code></pre>
<p>Создает новый чат и добавляет его в историю.</p>

<h3>Загрузка чата</h3>
<pre><code>function loadChat(chatId) {
    // ... код функции ...
}</code></pre>
<p>Загружает выбранный чат из истории.</p>

<h3>Очистка чата</h3>
<pre><code>clearButton.addEventListener('click', () => {
    // ... код обработчика ...
});</code></pre>
<p>Очищает текущий чат.</p>

<h3>Выбор модели AI</h3>
<pre><code>aiModelSelect.addEventListener('change', (e) => {
    // ... код обработчика ...
});</code></pre>
<p>Обрабатывает выбор модели AI пользователем.</p>

<h2>Стилизация</h2>

<p>Приложение использует переменные CSS для легкой настройки темы:</p>

<pre><code>:root {
    --tg-theme-bg-color: #ffffff;
    --tg-theme-text-color: #000000;
    // ... другие переменные ...
}</code></pre>

<h2>Адаптивный дизайн</h2>

<p>Приложение адаптируется к мобильным устройствам при ширине экрана менее 768px:</p>

<pre><code>@media (max-width: 768px) {
    // ... медиа-запросы ...
}</code></pre>

<h2>Интеграция рекламы</h2>

<p>Приложение интегрирует рекламу Яндекса после каждого 5-го сообщения:</p>

<pre><code>if (messageCount % 5 === 0 && !isAd) {
    addMessage('', false, '', true); // Добавляем рекламу
}</code></pre>

<h2>Лицензия</h2>

<p><a href="https://choosealicense.com/licenses/mit/">MIT</a></p>

<h2>Вклад в проект</h2>

<p>Пулл реквесты приветствуются. Для крупных изменений, пожалуйста, сначала создайте issue, чтобы обсудить, что вы хотите изменить.</p>

<h2>Контакты</h2>

<p>Ваше Имя - <a href="https://t.me/gregorybale">@gregorybale</a> - gregorymorozovidme@bk.ru</p>

<p>Ссылка на проект: <a href="[https://github.com/your-username/chat-ai-web-app](https://github.com/GregoryBale/gregorybalechatgpt.github.io)">https://github.com/your-username/chat-ai-web-app</a></p>
