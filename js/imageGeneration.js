async function tryGenerateImage(api, prompt) {
    try {
        const response = await fetch(api.url + encodeURIComponent(prompt), { method: 'GET' });
        const data = await response.json();

        if (data.ok && data.url) {
            return { ok: true, url: data.url, model: api.name };
        }

        // Логируем ошибочный ответ API
        console.warn(`API ${api.name} вернуло некорректный ответ:`, data);
    } catch (error) {
        console.error(`Ошибка с API ${api.name}:`, error);
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
window.handleImageGeneration = async function (message) {
    const prompt = message.slice(7).trim(); // Удаляем '/image ' из начала сообщения
    addMessage(`🖌 Генерация изображения для запроса: "${prompt}"`, false);

    try {
        const imageResult = await generateImage(prompt);

        if (imageResult.ok) {
            const imageMessage = `
                <img src="${imageResult.url}" alt="🖌 Сгенерированное изображение" style="max-width: 100%; height: auto;">
                <p class="model-info" style="font-size: 0.8em; color: #666; margin-top: 5px;">Изображение сгенерировано с помощью модели: ${imageResult.model}</p>
                <a href="${imageResult.url}" download="generated_image.png" class="download-button">Скачать изображение</a>
            `;
            addMessage(imageMessage, false);
        } else {
            console.error("Ошибка генерации изображения:", imageResult.error);
            addMessage("😔 Не удалось сгенерировать изображение. Пожалуйста, попробуйте еще раз.", false);
        }
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.", false);
    }
};
