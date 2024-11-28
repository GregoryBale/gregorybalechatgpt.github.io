// Массив API для перевода
const translationApis = [
    'https://api.paxsenix.biz.id/ai/gemma?text=',
    'https://api.paxsenix.biz.id/ai/qwen2?text=',
    'https://api.paxsenix.biz.id/ai/phi3?text=',
    'https://api.paxsenix.biz.id/ai/gemini?text=',
    'https://api.paxsenix.biz.id/ai/gpt4o?text=',
    'https://api.paxsenix.biz.id/ai/gpt4omni?text=',
    'https://api.paxsenix.biz.id/ai/gpt4?text=',
    'https://api.paxsenix.biz.id/ai/gpt3?text=',
    'https://api.paxsenix.biz.id/ai/llama?text=',
    'https://api.paxsenix.biz.id/ai/nemotron?text=',
    'https://api.paxsenix.biz.id/ai/llama3.1-70B?text='
];

async function tryTranslate(api, text) {
    try {
        const response = await fetch(api + encodeURIComponent(`переведи текст на английский: ${text}`));
        const data = await response.json();
        
        if (data.ok && data.response) {
            return {
                ok: true,
                text: data.response.replace(/^"|"$/g, '') // Удаляем кавычки
            };
        }
    } catch (error) {
        console.error(`Error with API ${api}:`, error);
    }
    return { ok: false };
}

async function translateText(text) {
    // Перемешиваем массив API случайным образом
    const shuffledApis = [...translationApis].sort(() => Math.random() - 0.5);

    for (const api of shuffledApis) {
        const result = await tryTranslate(api, text);
        if (result.ok) {
            return result;
        }
    }
    return { ok: false, error: "Не удалось перевести текст ни с одной из доступных API." };
}

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

window.handleImageGeneration = async function(message) {
    const prompt = message.slice(7).trim();
    addMessage(`🖌 Генерация изображения для запроса: "${prompt}"`, false);

    try {
        // Пытаемся перевести текст, используя разные API
        const translationResult = await translateText(prompt);
        
        if (translationResult.ok) {
            const englishPrompt = translationResult.text;
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
};
