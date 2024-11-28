async function tryTranslateText(apiUrl, prompt) {
    try {
        const response = await fetch(apiUrl + encodeURIComponent(prompt));
        const data = await response.json();

        if (data.ok && data.response) {
            return { ok: true, text: data.response.replace(/^"|"$/g, '') }; // Убираем кавычки из строки
        }
    } catch (error) {
        console.error(`Ошибка при запросе к API ${apiUrl}:`, error);
    }
    return { ok: false };
}

async function translateText(prompt) {
    const translationApis = [
        "https://api.paxsenix.biz.id/ai/gemma?text=",
        "https://api.paxsenix.biz.id/ai/qwen2?text=",
        "https://api.paxsenix.biz.id/ai/phi3?text=",
        "https://api.paxsenix.biz.id/ai/gemini?text=",
        "https://api.paxsenix.biz.id/ai/gpt4o?text=",
        "https://api.paxsenix.biz.id/ai/gpt4omni?text=",
        "https://api.paxsenix.biz.id/ai/gpt4?text=",
        "https://api.paxsenix.biz.id/ai/gpt3?text=",
        "https://api.paxsenix.biz.id/ai/llama?text=",
        "https://api.paxsenix.biz.id/ai/nemotron?text=",
        "https://api.paxsenix.biz.id/ai/llama3.1-70B?text="
    ];

    for (const apiUrl of translationApis) {
        const result = await tryTranslateText(apiUrl, `переведи текст на английский ${prompt}`);
        if (result.ok) {
            return result.text;
        }
    }

    throw new Error("Не удалось перевести текст ни с одним из доступных API.");
}

async function tryGenerateImage(api, prompt) {
    try {
        const response = await fetch(api.url + encodeURIComponent(prompt));
        const data = await response.json();

        if (data.ok && data.url) {
            return { ok: true, url: data.url, model: api.name };
        }
    } catch (error) {
        console.error(`Ошибка с ${api.name}:`, error);
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
        const translatedPrompt = await translateText(prompt);
        const imageResult = await generateImage(translatedPrompt);

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
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("😔 Произошла ошибка при генерации изображения. Пожалуйста, попробуйте еще раз.", false);
    }
};
