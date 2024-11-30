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

// Делаем функцию глобальной
window.handleImageGeneration = async function(message) {
    const prompt = message.slice(7).trim(); // Удаляем '/image ' из начала сообщения
    addMessage(`🖌 Генерация изображения для запроса: "${prompt}"`, false);

    try {
        const translationResponse = await fetch(`https://api.paxsenix.biz.id/ai/gpt3?text=${encodeURIComponent(`переведи текст на английский ${prompt}`)}`);
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
                addMessage("😔 Не удалось сгенерировать изображение. Пожалуйста, попробуйте еще раз или перейдите на сайт Кибер генератор: https://0imagegeneratorbygregorybale.netlify.app/, о проблеме мы знаем, и делаем всё возможное чтобы решить её. С уважением Григорий Бэйл", false);
            }
        } else {
            addMessage("😔 Не удалось перевести запрос. Пожалуйста, попробуйте еще раз.", false);
            }
    } catch (error) {
        console.error('Error:', error);
        addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз или перейдите на сайт Кибер генератор: https://0imagegeneratorbygregorybale.netlify.app/, о проблеме мы знаем, и делаем всё возможное чтобы решить её. С уважением Григорий Бэйл", false);
    }
};
