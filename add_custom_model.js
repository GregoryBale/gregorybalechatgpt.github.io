// add_custom_model.js

const customAiModels = {
    async getResponse(model, message) {
        const customModels = JSON.parse(localStorage.getItem('customModels') || '{}');
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

document.addEventListener('DOMContentLoaded', function() {
    const addModelButton = document.getElementById('add-model-button');
    const modal = document.getElementById('add-model-modal');
    const closeModal = document.querySelector('.close');
    const addModelForm = document.getElementById('add-model-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const customModelsList = document.getElementById('custom-models-list');
    const aiModelSelects = document.querySelectorAll('.model-select select');
    const currentModelSpans = document.querySelectorAll('#current-model, #current-model-mobile');

    const geminiModels = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-flash-002",
        "gemini-1.5-flash-8b"
    ];

    function loadCustomModels() {
        const customModels = JSON.parse(localStorage.getItem('customModels') || '{}');
        
        customModelsList.innerHTML = '';
        
        Object.keys(customModels).forEach(model => {
            addModelToList(model);
            aiModelSelects.forEach(select => {
                if (!select.querySelector(`option[value="${model}"]`)) {
                    addModelToSelect(select, model);
                }
            });
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

    function addModelToSelect(select, model) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        select.appendChild(option);
    }

    function deleteCustomModel(model) {
        const customModels = JSON.parse(localStorage.getItem('customModels') || '{}');
        delete customModels[model];
        localStorage.setItem('customModels', JSON.stringify(customModels));

        const modelItem = customModelsList.querySelector(`li:has(button[data-model="${model}"])`);
        if (modelItem) modelItem.remove();

        aiModelSelects.forEach(select => {
            const option = select.querySelector(`option[value="${model}"]`);
            if (option) option.remove();
        });

        currentModelSpans.forEach(span => {
            if (span.textContent === model) {
                const defaultModel = aiModelSelects[0].options[0].value;
                aiModelSelects.forEach(select => select.value = defaultModel);
                span.textContent = aiModelSelects[0].options[0].textContent;
            }
        });
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
                    
                    const customModels = JSON.parse(localStorage.getItem('customModels') || '{}');
                    customModels[model] = apiKey;
                    localStorage.setItem('customModels', JSON.stringify(customModels));
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

    aiModelSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedModel = this.options[this.selectedIndex].text;
            currentModelSpans.forEach(span => span.textContent = selectedModel);
            aiModelSelects.forEach(otherSelect => {
                if (otherSelect !== this) {
                    otherSelect.value = this.value;
                }
            });
        });
    });

    // Инициализация при загрузке страницы
    loadCustomModels();

    // Обработчики модального окна
    if (addModelButton) {
        addModelButton.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
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