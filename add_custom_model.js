// add_custom_model.js

const customAiModels = {
    async getResponse(model, message) {
        const customModels = JSON.parse(getCookie('customModels') || '{}');
        const apiKey = customModels[model];
        
        if (!apiKey) {
            throw new Error('API ключ не найден для модели');
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
};

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    const addModelButton = document.getElementById('add-model-button');
    const modal = document.getElementById('add-model-modal');
    const closeModal = document.querySelector('.close');
    const addModelForm = document.getElementById('add-model-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const customModelsList = document.getElementById('custom-models-list');
    const aiModelSelect = document.querySelector('.model-select select');
    const currentModelSpan = document.getElementById('current-model');

    const geminiModels = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b"
    ];

    function loadCustomModels() {
        const customModels = JSON.parse(getCookie('customModels') || '{}');
        
        customModelsList.innerHTML = '';
        
        Object.keys(customModels).forEach(model => {
            addModelToList(model);
            if (!aiModelSelect.querySelector(`option[value="${model}"]`)) {
                addModelToSelect(model);
            }
        });
    }

    function addModelToList(model) {
        const li = document.createElement('li');
        li.className = 'custom-model-item';
        li.innerHTML = `
            ${model}
            <button class="delete-model-btn" data-model="${model}">×</button>
        `;
        customModelsList.appendChild(li);

        li.querySelector('.delete-model-btn').addEventListener('click', () => {
            deleteCustomModel(model);
        });
    }

    function addModelToSelect(model) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        aiModelSelect.appendChild(option);
    }

    function deleteCustomModel(model) {
        const customModels = JSON.parse(getCookie('customModels') || '{}');
        delete customModels[model];
        setCookie('customModels', JSON.stringify(customModels), 30);

        const modelItem = customModelsList.querySelector(`li:has(button[data-model="${model}"])`);
        if (modelItem) modelItem.remove();

        const option = aiModelSelect.querySelector(`option[value="${model}"]`);
        if (option) option.remove();

        if (currentModelSpan.textContent === model) {
            aiModelSelect.value = aiModelSelect.options[0].value;
            currentModelSpan.textContent = aiModelSelect.options[0].textContent;
        }
    }

    async function testAndAddGeminiModels(apiKey) {
        const successfulModels = [];
        const failedModels = [];

        for (const model of geminiModels) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: "Hello, World!"
                            }]
                        }]
                    })
                });

                if (response.ok) {
                    successfulModels.push(model);
                    
                    const customModels = JSON.parse(getCookie('customModels') || '{}');
                    customModels[model] = apiKey;
                    setCookie('customModels', JSON.stringify(customModels), 30);
                } else {
                    failedModels.push(model);
                }
            } catch (error) {
                failedModels.push(model);
                console.error(`Error testing ${model}:`, error);
            }
        }

        return { successfulModels, failedModels };
    }

    addModelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('api-key').value;

        errorMessage.textContent = 'Проверка API ключа...';
        successMessage.textContent = '';

        try {
            const { successfulModels, failedModels } = await testAndAddGeminiModels(apiKey);

            if (successfulModels.length > 0) {
                successMessage.textContent = `Успешно добавлены модели: ${successfulModels.join(', ')}`;
                errorMessage.textContent = failedModels.length > 0 ? 
                    `Не удалось добавить модели: ${failedModels.join(', ')}` : '';

                loadCustomModels();
            } else {
                errorMessage.textContent = 'Не удалось добавить ни одной модели. Проверьте API ключ.';
            }
        } catch (error) {
            errorMessage.textContent = 'Ошибка: ' + error.message;
            console.error('Error details:', error);
        }
    });

    aiModelSelect.addEventListener('change', function() {
        currentModelSpan.textContent = this.options[this.selectedIndex].text;
    });

    // Инициализация при загрузке страницы
    loadCustomModels();

    // Обработчики модального окна
    addModelButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});

// Добавляем стили для кнопки удаления
const style = document.createElement('style');
style.textContent = `
.custom-model-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #eee;
}

.delete-model-btn {
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 18px;
    padding: 0 5px;
}

.delete-model-btn:hover {
    color: #ff0000;
}
`;
document.head.appendChild(style);