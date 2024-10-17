document.addEventListener('DOMContentLoaded', function() {
    // Загрузка всех сообщений для добавления кнопок реакций
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => addReactionButton(message));

    // Подключение обработчика для новых сообщений
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('message')) {
                        addReactionButton(node);
                    }
                });
            }
        });
    });

    observer.observe(document.getElementById('chat-messages'), {
        childList: true
    });
});

function addReactionButton(messageDiv) {
    // Создание кнопки для реакций
    const reactionButton = document.createElement('button');
    reactionButton.classList.add('reaction-button');
    reactionButton.textContent = '😊'; // Иконка эмодзи для кнопки

    // Прикрепляем кнопку к сообщению
    messageDiv.appendChild(reactionButton);

    // Обработчик клика по кнопке
    reactionButton.addEventListener('click', function() {
        openEmojiPicker(messageDiv);
    });
}

function openEmojiPicker(messageDiv) {
    // Элементы с доступными эмодзи
    const emojiPicker = document.createElement('div');
    emojiPicker.classList.add('emoji-picker');

    const emojis = ['😊', '😂', '👍', '❤️', '😮', '😢', '👏', '🔥', '🎉', '🤔']; // Можно добавить больше

    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.classList.add('emoji');
        emojiButton.textContent = emoji;

        // Прикрепляем эмодзи к сообщению
        emojiButton.addEventListener('click', function() {
            addReaction(messageDiv, emoji);
            emojiPicker.remove();
        });

        emojiPicker.appendChild(emojiButton);
    });

    // Удаление предыдущего выбора эмодзи перед добавлением нового
    const existingPicker = messageDiv.querySelector('.emoji-picker');
    if (existingPicker) {
        existingPicker.remove();
    }

    messageDiv.appendChild(emojiPicker);
}

function addReaction(messageDiv, emoji) {
    // Создание контейнера для реакций, если его еще нет
    let reactionContainer = messageDiv.querySelector('.reactions');
    if (!reactionContainer) {
        reactionContainer = document.createElement('div');
        reactionContainer.classList.add('reactions');
        messageDiv.appendChild(reactionContainer);
    }

    // Поиск уже добавленной реакции
    let reactionElement = reactionContainer.querySelector(`[data-emoji="${emoji}"]`);
    if (reactionElement) {
        // Увеличиваем счетчик реакций
        let count = parseInt(reactionElement.dataset.count) + 1;
        reactionElement.dataset.count = count;
        reactionElement.querySelector('.reaction-count').textContent = count;
    } else {
        // Создаем новый элемент реакции
        reactionElement = document.createElement('div');
        reactionElement.classList.add('reaction');
        reactionElement.dataset.emoji = emoji;
        reactionElement.dataset.count = 1;

        const emojiSpan = document.createElement('span');
        emojiSpan.classList.add('reaction-emoji');
        emojiSpan.textContent = emoji;

        const countSpan = document.createElement('span');
        countSpan.classList.add('reaction-count');
        countSpan.textContent = '1';

        reactionElement.appendChild(emojiSpan);
        reactionElement.appendChild(countSpan);

        reactionContainer.appendChild(reactionElement);
    }
}