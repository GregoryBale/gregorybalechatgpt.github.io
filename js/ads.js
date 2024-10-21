function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addAdvertisement() {
    const adElement = document.createElement('div');
    adElement.classList.add('message', 'ad-message');
    adElement.innerHTML = `
        <div class="message-content">
            <p>Рекламное сообщение:</p>
            <div id="yandex_rtb_R-A-12365980-1"></div>
        </div>
    `;
    chatMessages.appendChild(adElement);
    
    window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
            "blockId": "R-A-12365980-1",
            "renderTo": "yandex_rtb_R-A-12365980-1"
        })
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage('user', message);
        userInput.value = '';
        
        // Симулируем ответ ИИ
        setTimeout(() => {
            addMessage('ai', 'Это ответ ИИ на ваше сообщение.');
            
            // Добавляем рекламу после каждого 5-го сообщения
            if (document.querySelectorAll('.message').length % 5 === 0) {
                addAdvertisement();
            }
        }, 1000);
    }
});