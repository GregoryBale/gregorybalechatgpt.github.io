// Список API генерации изображений
const imageGenerationApis = [
    { url: 'https://api.paxsenix.biz.id/ai-image/fluxSchnell?text=', name: 'FluxSchnell' },
    { url: 'https://api.paxsenix.biz.id/ai-image/fluxPro?text=', name: 'FluxPro' },
    { url: 'https://api.paxsenix.biz.id/ai-image/sdxlImage?text=', name: 'SDXL Image' },
    { url: 'https://api.paxsenix.biz.id/ai-image/magicstudio?text=', name: 'Magic Studio' },
    { url: 'https://api.paxsenix.biz.id/ai-image/dreamshaper?text=', name: 'Dreamshaper' },
    { url: 'https://api.paxsenix.biz.id/ai-image/pixelart?text=', name: 'PixelArt' },
    { url: 'https://api.paxsenix.biz.id/ai-image/midjourney?text=', name: 'Midjourney' },
];

// Функция для обработки API генерации изображения
async function tryGenerateImage(api, prompt) {
    try {
        // Отправляем текст на генерацию изображения
        const initialResponse = await fetch(`${api.url}${encodeURIComponent(prompt)}`);
        const initialData = await initialResponse.json();

        if (initialData.ok && initialData.task_url) {
            // Ожидаем завершения задачи
            let statusData;
            do {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Ждем 3 секунды
                const statusResponse = await fetch(initialData.task_url);
                statusData = await statusResponse.json();

                if (statusData.ok && statusData.status === "done") {
                    // Возвращаем результат, если изображение готово
                    return { ok: true, url: statusData.url, model: api.name };
                }
            } while (statusData.status === "pending");

            console.error(`API ${api.name} не завершило генерацию. Статус: ${statusData.status}`);
        } else {
            console.error(`Ошибка на этапе запроса: ${initialData.message || 'Неизвестная ошибка'}`);
        }
    } catch (error) {
        console.error(`Ошибка в API ${api.name}:`, error);
    }
    return { ok: false };
}

// Функция генерации изображения с использованием доступных API
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

// Обработка команды /image
window.handleImageGeneration = async function (message) {
    const prompt = message.slice(7).trim(); // Удаляем '/image ' из начала сообщения
    addMessage(`🖌 Генерация изображения для запроса: "${prompt}"`, false);

    try {
        // Перевод текста на английский
        const translationResponse = await fetch(`https://api.paxsenix.biz.id/ai/gpt3?text=${encodeURIComponent(`переведи текст на английский: ${prompt}`)}`);
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
        console.error('Ошибка при генерации изображения:', error);
        addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.", false);
    }
};
