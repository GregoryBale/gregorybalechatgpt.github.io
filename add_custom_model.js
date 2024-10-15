document.addEventListener('DOMContentLoaded', function() {
    const addModelButton = document.getElementById('add-model-button');
    const modal = document.getElementById('add-model-modal');
    const closeModal = document.getElementById('close-modal');
    const addModelForm = document.getElementById('add-model-form');
    const errorMessage = document.getElementById('error-message');

    // Открытие модального окна
    addModelButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        errorMessage.textContent = '';
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            errorMessage.textContent = '';
        }
    });

    // Обработка формы
    addModelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const modelName = document.getElementById('model-name').value;
        const apiKey = document.getElementById('api-key').value;

        try {
            const response = await testApiKey(apiKey);
            if (response.ok) {
                const modelSelect = document.getElementById('ai-model-select');
                const newOption = document.createElement('option');
                newOption.text = modelName;
                newOption.value = modelName;
                modelSelect.add(newOption);

                document.getElementById('current-model').textContent = modelName;
                localStorage.setItem(`apiKey_${modelName}`, apiKey);
                modal.style.display = 'none';
                errorMessage.textContent = '';
            } else {
                throw new Error('Invalid API key');
            }
        } catch (error) {
            errorMessage.textContent = 'Error: ' + error.message;
        }
    });
});
