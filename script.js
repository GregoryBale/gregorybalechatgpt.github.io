const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-message');
const clearButton = document.getElementById('clear-chat');
const aiModelSelect = document.getElementById('ai-model-select');
const currentModelSpan = document.getElementById('current-model');
const chatHistory = document.getElementById('chat-history');

let selectedModel = 'random';
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('chats')) || {};
let messageCount = 0;

const aiModels = {
    'llama': 'https://paxsenix.serv00.net/v1/llama.php?text=',
    'gemini': 'https://paxsenix.serv00.net/v1/gemini.php?text=',
    'gpt3.5': 'https://paxsenix.serv00.net/v1/gpt3.5.php?text=',
    'gpt4-32k': 'https://paxsenix.serv00.net/v1/gpt4-32k.php?text=',
};

function getRandomModel() {
    const models = Object.keys(aiModels);
    return models[Math.floor(Math.random() * models.length)];
}

function addMessage(content, isUser = false, aiInfo = '', isAd = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : isAd ? 'ad-message' : 'ai-message');
    
    if (isAd) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>Рекламное сообщение:</p>
                <div id="yandex_rtb_R-A-12365980-1"></div>
            </div>
        `;
        // Рендерим рекламу Яндекса
        window.yaContextCb.push(() => {
            Ya.Context.AdvManager.render({
                "blockId": "R-A-12365980-1",
                "renderTo": "yandex_rtb_R-A-12365980-1"
            })
        });
    } else if (content.includes('```')) {
        const parts = content.split('```');
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                messageDiv.innerHTML += `<p>${part}</p>`;
            } else {
                messageDiv.innerHTML += `<pre><code>${part}</code></pre>`;
            }
        });
    } else {
        messageDiv.textContent = content;
    }

    if (!isUser && !isAd && aiInfo) {
        const aiInfoDiv = document.createElement('div');
        aiInfoDiv.classList.add('ai-info');
        aiInfoDiv.textContent = aiInfo;
        messageDiv.appendChild(aiInfoDiv);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (currentChatId && !isAd) {
        if (!chats[currentChatId].messages) {
            chats[currentChatId].messages = [];
        }
        chats[currentChatId].messages.push({
            content,
            isUser,
            aiInfo,
            isAd: false
        });
        saveChatToLocalStorage();
    }

    messageCount++;
    if (messageCount % 5 === 0 && !isAd) {
        addMessage('', false, '', true); // Добавляем рекламу после каждого 5-го сообщения
    }
}

async function sendMessage() {
    ensureCurrentChat();
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

        const model = selectedModel === 'random' ? getRandomModel() : selectedModel;
        const apiUrl = aiModels[model];

        try {
            const response = await fetch(apiUrl + encodeURIComponent(message.replace(/ /g, '+')));
            if (!response.ok) {
                throw new Error('API request failed');
            }
            const data = await response.json();
            if (data.ok && data.response) {
                addMessage(data.response, false, `Ответ получен от: ${model}`);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Произошла ошибка при получении ответа. Попробуем другую модель.', false);
            const newModel = getRandomModel();
            const newApiUrl = aiModels[newModel];
            try {
                const newResponse = await fetch(newApiUrl + encodeURIComponent(message.replace(/ /g, '+')));
                if (!newResponse.ok) {
                    throw new Error('API request failed');
                }
                const newData = await newResponse.json();
                if (newData.ok && newData.response) {
                    addMessage(newData.response, false, `Ответ получен от: ${newModel} (после ошибки)`);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (newError) {
                console.error('Error with new model:', newError);
                addMessage('К сожалению, не удалось получить ответ. Пожалуйста, попробуйте позже.', false);
            }
        }
        updateChatHistory();
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
}

function saveChatToLocalStorage() {
    localStorage.setItem('chats', JSON.stringify(chats));
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
}

function ensureCurrentChat() {
    if (!currentChatId) {
        createNewChat();
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

clearButton.addEventListener('click', () => {
    if (currentChatId) {
        chatMessages.innerHTML = '';
        chats[currentChatId].messages = [];
        messageCount = 0;
        saveChatToLocalStorage();
    }
});

aiModelSelect.addEventListener('change', (e) => {
    selectedModel = e.target.value;
    currentModelSpan.textContent = e.target.options[e.target.selectedIndex].text;
});

document.addEventListener('DOMContentLoaded', () => {
    currentModelSpan.textContent = aiModelSelect.options[aiModelSelect.selectedIndex].text;
    updateChatHistory();
    if (Object.keys(chats).length === 0) {
        createNewChat();
    } else {
        loadChat(Object.keys(chats)[0]);
    }
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