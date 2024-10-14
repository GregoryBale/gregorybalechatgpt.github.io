const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const clearChatBtn = document.getElementById('clearChatBtn');
const saveChatBtn = document.getElementById('saveChatBtn');
const toggleDarkModeBtn = document.getElementById('toggleDarkModeBtn');
const toast = document.getElementById('toast');
const md = window.markdownit();

let chatHistory = [];
let darkMode = false;
let context = '';
let maxContextLength = 1000;
let lastApiCallTime = 0;
const apiCallDelay = 5000; // 5 секунд задержки между вызовами API

hljs.configure({
    languages: ['javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'ruby', 'php', 'go', 'rust']
});

const APIs = [
    { url: 'https://paxsenix.serv00.net/v1/gpt4o.php?text=', name: 'GPT-4' },
    { url: 'https://paxsenix.serv00.net/v1/gpt4-32k.php?text=', name: 'GPT-4 32k' },
    { url: 'https://paxsenix.serv00.net/v1/gpt3.5.php?text=', name: 'GPT-3.5' }
];

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

clearChatBtn.addEventListener('click', clearChat);
saveChatBtn.addEventListener('click', saveChat);
toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessageToChat(userMessage, 'user');
    chatInput.value = '';

    showTypingIndicator();

    try {
        const response = await getResponseFromAPI(userMessage);
        hideTypingIndicator();
        addMessageToChat(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        console.error('Error in sendMessage:', error);
        addMessageToChat(`Произошла ошибка при получении ответа: ${error.message}. Пожалуйста, попробуйте еще раз.`, 'system');
    }
}

async function fetchFromAPI(api, message) {
    const now = Date.now();
    if (now - lastApiCallTime < apiCallDelay) {
        await new Promise(resolve => setTimeout(resolve, apiCallDelay - (now - lastApiCallTime)));
    }
    lastApiCallTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
        const response = await fetch(api.url + encodeURIComponent(message), {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data && data.response) {
            return { success: true, data: data.response };
        } else {
            console.error('Invalid API response structure:', data);
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error(`Error with ${api.name} API:`, error);
        return { success: false, error: error.message };
    }
}

async function getResponseFromAPI(message) {
    updateContext();
    const fullMessage = `Контекст предыдущих сообщений:\n${context}\n\nНовое сообщение: ${message}`;

    for (const api of APIs) {
        addMessageToChat(`Пробуем использовать модель ${api.name}...`, 'system');
        const result = await fetchFromAPI(api, fullMessage);
        if (result.success) {
            addMessageToChat(`Успешно использована модель ${api.name}`, 'system');
            return result.data;
        } else {
            addMessageToChat(`Модель ${api.name} не ответила (${result.error}), пробуем следующую...`, 'system');
        }
    }

    throw new Error('Не удалось получить ответ от всех доступных моделей. Попробуйте очистить чат или повторить запрос позже.');
}

function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    
    if (sender === 'system') {
        messageElement.classList.add('system-message');
        messageElement.textContent = message;
    } else {
        const formattedMessage = md.render(message);
        messageElement.innerHTML = formattedMessage;

        messageElement.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
            addCopyCodeButton(block);
        });

        if (sender === 'bot') {
            addRegenerateButton(messageElement);
        }
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender !== 'system') {
        chatHistory.push({ sender, message });
    }
}

function addCopyCodeButton(block) {
    const button = document.createElement('button');
    button.textContent = 'Копировать';
    button.className = 'copy-code-btn';
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
            showToast('Код скопирован!', 'success');
        }, () => {
            showToast('Не удалось скопировать код', 'error');
        });
    });
    block.parentNode.insertBefore(button, block);
}

function addRegenerateButton(messageElement) {
    const button = document.createElement('button');
    button.textContent = 'Регенерировать';
    button.className = 'regenerate-btn';
    button.addEventListener('click', async () => {
        const originalMessage = chatHistory[chatHistory.length - 2].message;
        showTypingIndicator();
        try {
            const response = await getResponseFromAPI(originalMessage);
            hideTypingIndicator();
            messageElement.innerHTML = md.render(response);
            messageElement.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
                addCopyCodeButton(block);
            });
            addRegenerateButton(messageElement);
            chatHistory[chatHistory.length - 1].message = response;
        } catch (error) {
            hideTypingIndicator();
            showToast('Ошибка при регенерации ответа', 'error');
        }
    });
    messageElement.appendChild(button);
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    setTimeout(() => typingIndicator.classList.add('visible'), 100);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.classList.remove('visible');
        setTimeout(() => typingIndicator.remove(), 300);
    }
}

function updateContext() {
    const lastMessages = chatHistory.slice(-5);
    context = lastMessages.map(msg => `${msg.sender}: ${msg.message}`).join('\n');
    
    if (context.length > maxContextLength) {
        context = context.substring(context.length - maxContextLength);
    }
}

function clearChat() {
    chatMessages.innerHTML = '';
    chatHistory = [];
    context = '';
    showToast('Чат очищен', 'success');
}

function saveChat() {
    const chatContent = chatHistory.map(msg => `${msg.sender}: ${msg.message}`).join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'chat_history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Чат сохранен', 'success');
}

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    toggleDarkModeBtn.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    showToast(darkMode ? 'Темная тема включена' : 'Светлая тема включена', 'success');
}

function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

chatInput.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chatInput.classList.add('dragover');
});

chatInput.addEventListener('dragleave', () => {
    chatInput.classList.remove('dragover');
});

chatInput.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chatInput.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            chatInput.value = event.target.result;
        };
        reader.readAsText(file);
    }
});

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ru-RU';

    const voiceInputBtn = document.createElement('button');
    voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceInputBtn.className = 'chat-action-btn';
    voiceInputBtn.title = 'Голосовой ввод';
    document.querySelector('.chat-actions').appendChild(voiceInputBtn);

    voiceInputBtn.addEventListener('click', () => {
        recognition.start();
        showToast('Говорите...', 'success');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        showToast('Голосовой ввод завершен', 'success');
    };

    recognition.onerror = (event) => {
        showToast('Ошибка голосового ввода', 'error');
    };
}

showToast('Добро пожаловать в Расширенный AI Чат!', 'success');