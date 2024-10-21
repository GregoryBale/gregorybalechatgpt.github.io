// Функция для безопасного получения элемента DOM
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Элемент с id "${id}" не найден`);
    }
    return element;
}

// Функция для безопасного добавления слушателя событий
function safeAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.error(`Не удалось добавить обработчик события ${event}`);
    }
}

const chatMessages = safeGetElement('chat-messages');
const userInput = safeGetElement('user-input');
const sendButton = safeGetElement('send-message');
const clearButton = safeGetElement('clear-chat');
const aiModelSelect = safeGetElement('ai-model-select');
const currentModelSpan = safeGetElement('current-model');
const chatHistory = safeGetElement('chat-history');

function safeAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.error(`Не удалось добавить обработчик события ${event}`);
    }
}

safeAddEventListener(sendButton, 'click', () => {
    if (typeof sendMessage === 'function') {
        sendMessage().catch(console.error);
    } else {
        console.error('Функция sendMessage не определена');
    }
});

safeAddEventListener(userInput, 'keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (typeof sendMessage === 'function') {
            sendMessage().catch(console.error);
        } else {
            console.error('Функция sendMessage не определена');
        }
    }
});

safeAddEventListener(clearButton, 'click', () => {
    if (currentChatId && chatMessages) {
        chatMessages.innerHTML = '';
        chats[currentChatId].messages = [];
        messageCount = 0;
        saveChatToLocalStorage();
    }
});

safeAddEventListener(aiModelSelect, 'change', (e) => {
    selectedModel = e.target.value;
    if (currentModelSpan) {
        currentModelSpan.textContent = e.target.options[e.target.selectedIndex].text;
    }
});

let selectedModel = 'random';
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('chats')) || {};
let messageCount = 0;

const aiSessions = {};

const aiModels = {
    'llama': {
        url: 'https://paxsenix.serv00.net/v1/llama.php?text=',
        responseType: 'response'
    },
    'gemini': {
        url: 'https://paxsenix.serv00.net/v1/gemini.php?text=',
        responseType: 'response'
    },
    'gpt3.5': {
        url: 'https://paxsenix.serv00.net/v1/gpt3.5.php?text=',
        responseType: 'response'
    },
    'gpt4-32k': {
        url: 'https://paxsenix.serv00.net/v1/gpt4-32k.php?text=',
        responseType: 'response'
    },
    'llama3': {
        url: 'https://api.paxsenix.biz.id/ai/llama3?text=',
        responseType: 'message'
    },
    'gpt3': {
        url: 'https://api.paxsenix.biz.id/ai/gpt3?text=',
        responseType: 'message'
    },
    'gpt4': {
        url: 'https://api.paxsenix.biz.id/ai/gpt4?text=',
        responseType: 'message'
    },
    'gpt4o': {
        url: 'https://api.paxsenix.biz.id/ai/gpt4o?text=',
        responseType: 'message'
    },
    'phi3': {
        url: 'https://api.paxsenix.biz.id/ai/phi3?text=',
        responseType: 'message'
    },
    'qwen2': {
        url: 'https://api.paxsenix.biz.id/ai/qwen2?text=',
        responseType: 'message'
    },
    'gemma': {
        url: 'https://api.paxsenix.biz.id/ai/gemma?text=',
        responseType: 'message'
    },
    'wizardlm': {
        url: 'https://api.paxsenix.biz.id/ai/wizardlm?text=',
        responseType: 'message'
    },
    'claude': {
        url: 'https://api.paxsenix.biz.id/ai/claude?text=',
        responseType: 'message'
    },
    'openchat': {
        url: 'https://api.paxsenix.biz.id/ai/openchat?text=',
        responseType: 'message'
    }
};

function initAISession(model) {
    if (!aiSessions[model]) {
        aiSessions[model] = {
            messages: [],
            context: ''
        };
    }
}

function updateAIContext(model, message, response) {
    if (!aiSessions[model]) {
        initAISession(model);
    }
    aiSessions[model].messages.push({ role: 'user', content: message });
    aiSessions[model].messages.push({ role: 'assistant', content: response });
    
    // Ограничиваем количество сохраненных сообщений
    if (aiSessions[model].messages.length > 10) {
        aiSessions[model].messages = aiSessions[model].messages.slice(-10);
    }
    
    // Обновляем контекст
    aiSessions[model].context = aiSessions[model].messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
}

const imageGenerationApis = [
    { url: 'https://api.paxsenix.biz.id/ai-image/fluxSchnell?text=', name: 'FluxSchnell' },
    { url: 'https://api.paxsenix.biz.id/ai-image/fluxPro?text=', name: 'FluxPro' },
    { url: 'https://api.paxsenix.biz.id/ai-image/sdxlImage?text=', name: 'SDXL Image' },
    { url: 'https://api.paxsenix.biz.id/ai-image/sdxlBeta?text=', name: 'SDXL Beta' },
    { url: 'https://api.paxsenix.biz.id/ai-image/magicstudio?text=', name: 'Magic Studio' },
    { url: 'https://api.paxsenix.biz.id/ai-image/prodia?text=', name: 'Prodia' },
    { url: 'https://api.paxsenix.biz.id/ai-image/upscale?text=', name: 'Upscale' },
    { url: 'https://api.paxsenix.biz.id/ai-image/blackbox?text=', name: 'Blackbox' },
    { url: 'https://api.paxsenix.biz.id/ai-image/dreamshaper?text=', name: 'Dreamshaper' }
];

async function tryGenerateImage(api, prompt) {
    try {
        const response = await fetch(api.url + encodeURIComponent(prompt));
        const data = await response.json();
        
        if (data.ok && data.url) {
            return { ok: true, url: data.url, model: api.name };
        }
    } catch (error) {
        console.error(`Error with ${api.name}:`, error);
    }
    return { ok: false };
}

async function generateImage(prompt) {
    const shuffledApis = [...imageGenerationApis].sort(() => Math.random() - 0.5);

    for (const api of shuffledApis) {
        const result = await tryGenerateImage(api, prompt);
        if (result.ok) {
            return result;
        }
    }

    return { ok: false, error: "😔 Не удалось сгенерировать изображение ни с одной из доступных API." };
}

function getRandomModel() {
    const models = Object.keys(aiModels);
    return models[Math.floor(Math.random() * models.length)];
}

function addMessage(content, isUser = false, aiInfo = '', isAd = false) {
    if (!chatMessages) {
        console.error('Элемент chatMessages не найден');
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : isAd ? 'ad-message' : 'ai-message');
    
    if (isAd) {
        const adId = `yandex_rtb_R-A-12365980-1-${Date.now()}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>Рекламное сообщение:</p>
                <div id="${adId}"></div>
            </div>
        `;
        handleAdRendering(adId);
    } else if (isUser) {
        messageDiv.textContent = content;
    } else {
        // Создаем контейнер для контента и кнопок
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');

        // Добавляем контент сообщения
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        const formattedContent = typeof formatAIMessage === 'function' ? formatAIMessage(content) : content;
        contentDiv.innerHTML = formattedContent;
        messageContainer.appendChild(contentDiv);

        // Создаем панель с кнопками
        const buttonsPanel = createMessageButtons(content, messageDiv);
        messageContainer.appendChild(buttonsPanel);
        
        messageDiv.appendChild(messageContainer);

        // Добавляем обработчики событий для desktop и mobile
        setupMessageInteractions(messageDiv, buttonsPanel);
    }

    if (!isUser && !isAd && aiInfo) {
        const aiInfoDiv = document.createElement('div');
        aiInfoDiv.classList.add('ai-info');
        aiInfoDiv.textContent = aiInfo;
        messageDiv.appendChild(aiInfoDiv);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Сохраняем сообщение в текущий чат
    if (currentChatId && !isAd) {
        if (!chats[currentChatId]) {
            chats[currentChatId] = { messages: [] };
        }
        chats[currentChatId].messages.push({
            content,
            isUser,
            aiInfo,
            timestamp: new Date().toISOString()
        });
        saveChatToLocalStorage();
    }
    
    handleMessageCount(isAd);
}

// Обновленная функция handleMessageCount
function handleMessageCount(isAd) {
    if (typeof messageCount !== 'undefined') {
        messageCount++;
        if (messageCount % 5 === 0 && !isAd) {
            addMessage('', false, '', true);
        }
    } else {
        console.error('messageCount не определен');
    }
}

// Функция для сохранения состояния чата в localStorage
function saveChatToLocalStorage() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function createMessageButtons(content, messageDiv) {
    const buttonsPanel = document.createElement('div');
    buttonsPanel.classList.add('message-buttons');
    buttonsPanel.innerHTML = `
        <button class="message-btn copy-btn" title="Копировать">
            <i class="fas fa-copy"></i>
        </button>
        <button class="message-btn regenerate-btn" title="Регенерировать">
            <i class="fas fa-redo"></i>
        </button>
        <button class="message-btn share-btn" title="Поделиться">
            <i class="fas fa-share"></i>
        </button>
        <button class="message-btn translate-btn" title="Перевести">
            <i class="fas fa-language"></i>
        </button>
    `;

    // Добавляем обработчики для кнопок
    const copyBtn = buttonsPanel.querySelector('.copy-btn');
    const regenerateBtn = buttonsPanel.querySelector('.regenerate-btn');
    const shareBtn = buttonsPanel.querySelector('.share-btn');
    const translateBtn = buttonsPanel.querySelector('.translate-btn');

    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyMessageContent(content);
    });

    regenerateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        regenerateMessage(messageDiv);
    });

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareMessage(content);
    });

    translateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        translateMessage(messageDiv, content);
    });

    // Создаем контейнер для сообщения и кнопок
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    
    // Перемещаем содержимое messageDiv в messageContainer
    while (messageDiv.firstChild) {
        messageContainer.appendChild(messageDiv.firstChild);
    }
    
    // Добавляем buttonsPanel и messageContainer в messageDiv
    messageDiv.appendChild(buttonsPanel);
    messageDiv.appendChild(messageContainer);

    return buttonsPanel;
}

function setupMessageInteractions(messageDiv, buttonsPanel) {
    // Desktop hover
    messageDiv.addEventListener('mouseenter', () => {
        buttonsPanel.classList.add('visible');
    });

    messageDiv.addEventListener('mouseleave', () => {
        buttonsPanel.classList.remove('visible');
    });

    // Mobile long press
    let pressTimer;
    let isLongPress = false;

    messageDiv.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
            isLongPress = true;
            buttonsPanel.classList.add('visible');
            // Добавляем вибрацию для обратной связи
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, 500);
    });

    messageDiv.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
        if (isLongPress) {
            setTimeout(() => {
                buttonsPanel.classList.remove('visible');
                isLongPress = false;
            }, 3000); // Скрываем через 3 секунды после отпускания
        }
    });

    messageDiv.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
    });
}

async function copyMessageContent(content) {
    try {
        await navigator.clipboard.writeText(content);
        showNotification('Текст скопирован в буфер обмена');
    } catch (err) {
        console.error('Failed to copy text:', err);
        showNotification('Не удалось скопировать текст', 'error');
    }
}

async function regenerateMessage(messageDiv) {
    const originalMessage = messageDiv.querySelector('.message-content').textContent;
    messageDiv.classList.add('regenerating');
    
    try {
        const model = selectedModel === 'random' ? getRandomModel() : selectedModel;
        const apiUrl = aiModels[model].url + encodeURIComponent(originalMessage);
        const response = await fetch(apiUrl);
        const data = await response.json();
        const newResponse = await processAPIResponse(data, model);
        
        messageDiv.querySelector('.message-content').innerHTML = 
            typeof formatAIMessage === 'function' ? formatAIMessage(newResponse) : newResponse;
        
        showNotification('Сообщение регенерировано');
    } catch (error) {
        console.error('Ошибка при регенерации:', error);
        showNotification('Не удалось регенерировать сообщение', 'error');
    } finally {
        messageDiv.classList.remove('regenerating');
    }
}

async function shareMessage(content) {
    if (navigator.share) {
        try {
            await navigator.share({
                text: content
            });
        } catch (err) {
            console.error('Error sharing:', err);
            showNotification('Не удалось поделиться сообщением', 'error');
        }
    } else {
        copyMessageContent(content);
        showNotification('Текст скопирован для отправки');
    }
}

async function translateMessage(messageDiv, content) {
    messageDiv.classList.add('translating');
    
    try {
        const response = await fetch(`https://paxsenix.serv00.net/v1/gpt3.5.php?text=${encodeURIComponent('Переведи текст на английский: ' + content)}`);
        const data = await response.json();
        
        if (data.ok) {
            const translation = data.response;
            messageDiv.querySelector('.message-content').innerHTML = 
                typeof formatAIMessage === 'function' ? formatAIMessage(translation) : translation;
            showNotification('Текст переведен');
        } else {
            throw new Error('Translation failed');
        }
    } catch (error) {
        console.error('Error translating:', error);
        showNotification('Не удалось перевести текст', 'error');
    } finally {
        messageDiv.classList.remove('translating');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}

function handleAdRendering(adId) {
    if (window.yaContextCb && typeof window.yaContextCb.push === 'function') {
        window.yaContextCb.push(() => {
            if (Ya && Ya.Context && Ya.Context.AdvManager && typeof Ya.Context.AdvManager.render === 'function') {
                Ya.Context.AdvManager.render({
                    "blockId": "R-A-12365980-1",
                    "renderTo": adId
                });
            } else {
                console.error('Yandex.Direct API не доступен');
            }
        });
    } else {
        console.error('window.yaContextCb не найден или не является массивом');
    }
}

function handleMessageStorage(chatId, content, isUser, aiInfo, isAd) {
    if (chatId && !isAd) {
        if (!chats[chatId]) {
            console.error('Текущий чат не найден');
            return;
        }
        if (!Array.isArray(chats[chatId].messages)) {
            chats[chatId].messages = [];
        }
        chats[chatId].messages.push({
            content,
            isUser,
            aiInfo,
            isAd: false
        });
        try {
            saveChatToLocalStorage();
        } catch (error) {
            console.error('Ошибка при сохранении чата в localStorage:', error);
        }
    }
}

function handleMessageCount(isAd) {
    if (typeof messageCount !== 'undefined') {
        messageCount++;
        if (messageCount % 5 === 0 && !isAd) {
            addMessage('', false, '', true);
        }
    } else {
        console.error('messageCount не определен');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (currentModelSpan && aiModelSelect) {
        currentModelSpan.textContent = aiModelSelect.options[aiModelSelect.selectedIndex].text;
    }
    updateChatHistory();
    if (Object.keys(chats).length === 0) {
        createNewChat();
    } else {
        loadChat(Object.keys(chats)[0]);
    }
    
    // Загрузка кастомных моделей при инициализации
    if (typeof loadCustomModels === 'function') {
        loadCustomModels();
    }
});

async function processAPIResponse(data, model) {
    if (!data.ok) {
        throw new Error(data.message || 'API response not ok');
    }

    const responseType = aiModels[model]?.responseType || 'response';
    
    if (responseType === 'message' && data.message) {
        return data.message;
    } else if (responseType === 'response' && data.response) {
        return data.response;
    } else if (data.text) {
        return data.text;
    }
    
    throw new Error('Неподдерживаемый формат ответа');
}

async function sendMessage() {
    ensureCurrentChat();
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        showTypingIndicator();

        try {
            if (message.startsWith('/image ')) {
                await handleImageGeneration(message);
            } else {
                const model = selectedModel === 'random' ? getRandomModel() : selectedModel;
                initAISession(model);
                
                let responseMessage;
                const customModels = JSON.parse(localStorage.getItem('customModels')) || {};
                if (customModels[model]) {
                    responseMessage = await customAiModels.getResponse(model, message, aiSessions[model].context);
                } else {
                    const contextMessage = `${aiSessions[model].context}\nUser: ${message}\nAssistant:`;
                    const apiUrl = aiModels[model].url + encodeURIComponent(contextMessage.replace(/ /g, '+'));
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                        throw new Error('API request failed');
                    }
                    const data = await response.json();
                    responseMessage = await processAPIResponse(data, model);
                }
                
                updateAIContext(model, message, responseMessage);
                addMessage(responseMessage, false, `🤖 Ответ получен от: ${model}`);
            }
        } catch (error) {
            console.error('Error:', error);
            if (message.startsWith('/image ')) {
                addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.", false);
            } else {
                addMessage('🔄 Произошла ошибка при получении ответа. Пробую другую модель.', false);
                await retryWithAnotherModel(message);
            }
        } finally {
            hideTypingIndicator();
        }
        
        updateChatHistory();
    }
}

async function handleImageGeneration(message) {
    const prompt = message.slice(7).trim(); // Удаляем '/image ' из начала сообщения
    addMessage(`🖌 Генерация изображения для запроса: "${prompt}"`, false);

    try {
        const translationResponse = await fetch(`https://paxsenix.serv00.net/v1/gpt3.5.php?text=${encodeURIComponent(`переведи текст на английский ${prompt}`)}`);
        const translationData = await translationResponse.json();
        
        if (translationData.ok) {
            const englishPrompt = translationData.response.replace(/^"|"$/g, ''); // Удаляем кавычки
            const imageResult = await generateImage(englishPrompt);
            
            if (imageResult.ok) {
                const imageMessage = `
                    <img src="${imageResult.url}" alt="🖌 Сгенерированное изображение" style="max-width: 100%; height: auto;">
                    <p class="model-info" style="font-size: 0.8em; color: #666; margin-top: 5px;">Изображение сгенерировано с помощью модели: ${imageResult.model}</p>
                    <a href="${imageResult.url}" download="generated_image.png" class="download-button">Скачать изображение</a>
                `;
                addMessage(imageMessage, false);
            } else {
                addMessage("😔 Не удалось сгенерировать изображение. Пожалуйста, попробуйте еще раз.", false);
            }
        } else {
            addMessage("😔 Не удалось перевести запрос. Пожалуйста, попробуйте еще раз.", false);
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.", false);
    }
}

async function retryWithAnotherModel(message) {
    const newModel = getRandomModel();
    initAISession(newModel);
    
    const contextMessage = `${aiSessions[newModel].context}\nUser: ${message}\nAssistant:`;
    const newApiUrl = aiModels[newModel].url + encodeURIComponent(contextMessage.replace(/ /g, '+'));
    
    try {
        const newResponse = await fetch(newApiUrl);
        if (!newResponse.ok) {
            throw new Error('API request failed');
        }
        const newData = await newResponse.json();
        const responseMessage = await processAPIResponse(newData, newModel);
        updateAIContext(newModel, message, responseMessage);
        addMessage(responseMessage, false, `🤖 Ответ получен от: ${newModel} (после ошибки)`);
    } catch (newError) {
        console.error('Error with new model:', newError);
        addMessage('😔 К сожалению, не удалось получить ответ. Пожалуйста, попробуйте другой модель.', false);
    }
}


function createNewChat() {
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
    
    // Сбрасываем контекст для всех моделей при создании нового чата
    Object.keys(aiSessions).forEach(model => {
        aiSessions[model] = { messages: [], context: '' };
    });
}

function saveChatToLocalStorage() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function loadChatFromLocalStorage() {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
        chats = JSON.parse(savedChats);
        if (Object.keys(chats).length > 0) {
            currentChatId = Object.keys(chats)[0];
            loadChat(currentChatId);
        } else {
            createNewChat();
        }
    } else {
        createNewChat();
    }
}

function updateChatHistory() {
    chatHistory.innerHTML = '';
    Object.values(chats).forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.textContent = chat.title;
        chatItem.addEventListener('click', () => loadChat(chat.id));
        if (chat.id === currentChatId) {
            chatItem.classList.add('active');
        }
        chatHistory.appendChild(chatItem);
    });
}

function loadChat(chatId) {
    currentChatId = chatId;
    chatMessages.innerHTML = '';
    messageCount = 0;
    chats[chatId].messages.forEach(msg => {
        addMessage(msg.content, msg.isUser, msg.aiInfo, msg.isAd);
    });
    updateChatHistory();
    
    // Восстанавливаем контекст для текущей модели
    const model = selectedModel === 'random' ? getRandomModel() : selectedModel;
    initAISession(model);
    aiSessions[model].messages = chats[chatId].messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
    }));
    aiSessions[model].context = aiSessions[model].messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
}

function ensureCurrentChat() {
    if (!currentChatId) {
        createNewChat();
    }
}

sendButton.addEventListener('click', () => {
    sendMessage().catch(console.error);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage().catch(console.error);
    }
});

clearButton.addEventListener('click', () => {
    if (currentChatId) {
        chatMessages.innerHTML = '';
        chats[currentChatId].messages = [];
        messageCount = 0;
        saveChatToLocalStorage();
        
        // Очищаем контекст для всех моделей
        Object.keys(aiSessions).forEach(model => {
            aiSessions[model] = { messages: [], context: '' };
        });
    }
});

aiModelSelect.addEventListener('change', (e) => {
    selectedModel = e.target.value;
    currentModelSpan.textContent = e.target.options[e.target.selectedIndex].text;
    
    // Инициализируем сессию для выбранной модели, если она еще не существует
    if (selectedModel !== 'random') {
        initAISession(selectedModel);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    currentModelSpan.textContent = aiModelSelect.options[aiModelSelect.selectedIndex].text;
    updateChatHistory();
    if (Object.keys(chats).length === 0) {
        createNewChat();
    } else {
        loadChat(Object.keys(chats)[0]);
    }
    
    // Загрузка кастомных моделей при инициализации
    loadCustomModels();
});

function highlightCode() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

const originalAddMessage = addMessage;
addMessage = function(content, isUser = false, aiInfo = '', isAd = false) {
    originalAddMessage(content, isUser, aiInfo, isAd);
    highlightCode();
};

// Мобильное меню
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const currentModelMobile = document.getElementById('current-model-mobile');
const aiModelSelectMobile = document.getElementById('ai-model-select-mobile');
const clearChatMobile = document.getElementById('clear-chat-mobile');

// Клонируем опции из основного селекта в мобильный
Array.from(aiModelSelect.options).forEach(option => {
    const newOption = option.cloneNode(true);
    aiModelSelectMobile.appendChild(newOption);
});

// Обработчик для кнопки мобильного меню
mobileMenuButton.addEventListener('click', () => {
    mobileMenuButton.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Синхронизация выбора модели между мобильной и десктопной версиями
aiModelSelectMobile.addEventListener('change', (e) => {
    selectedModel = e.target.value;
    aiModelSelect.value = e.target.value;
    currentModelSpan.textContent = e.target.options[e.target.selectedIndex].text;
    currentModelMobile.textContent = e.target.options[e.target.selectedIndex].text;
});

// Обработчик для мобильной кнопки очистки чата
clearChatMobile.addEventListener('click', () => {
    if (currentChatId) {
        chatMessages.innerHTML = '';
        chats[currentChatId].messages = [];
        messageCount = 0;
        saveChatToLocalStorage();
    }
    mobileMenu.classList.remove('active');
    mobileMenuButton.classList.remove('active');
});

// Закрытие мобильного меню при клике вне его
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuButton.classList.remove('active');
    }
});

// Синхронизация начального состояния
document.addEventListener('DOMContentLoaded', () => {
    currentModelMobile.textContent = aiModelSelect.options[aiModelSelect.selectedIndex].text;
});
