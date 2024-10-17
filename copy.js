// copy.js

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Сообщение скопировано в буфер обмена!');
    }).catch(err => {
        console.error('Ошибка при копировании текста: ', err);
    });
}

function addCopyButtonToMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        const content = message.textContent.trim();
        
        // Проверяем, есть ли уже кнопка "СКОПИРОВАТЬ"
        if (!message.querySelector('.copy-button')) {
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button');
            copyButton.textContent = 'СКОПИРОВАТЬ';
            copyButton.addEventListener('click', () => {
                copyToClipboard(content);
            });

            message.appendChild(copyButton);
        }
    });
}

// Вызов функции для добавления кнопок после загрузки сообщений
document.addEventListener('DOMContentLoaded', addCopyButtonToMessages);