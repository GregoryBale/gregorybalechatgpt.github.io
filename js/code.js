class CodeBlockManager {
    constructor() {
        this.codeBlocks = new Map();
        this.currentId = 0;
    }

    initializeEventListeners(container) {
        const copyButtons = container.querySelectorAll('.copy-code-btn');

        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const blockId = e.target.closest('.code-block-container').id;
                this.copyCode(blockId);
            });
        });
    }

    createCodeBlockUI(code, language = '') {
        const id = `code-block-${this.currentId++}`;
        this.codeBlocks.set(id, code);

        const container = document.createElement('div');
        container.className = 'code-block-container';
        container.id = id;

        const header = document.createElement('div');
        header.className = 'code-block-header';

        const langSpan = document.createElement('span');
        langSpan.className = 'code-language';
        langSpan.textContent = language || 'text';
        header.appendChild(langSpan);

        const actions = document.createElement('div');
        actions.className = 'code-block-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';

        actions.appendChild(copyBtn);
        header.appendChild(actions);

        const pre = document.createElement('pre');
        pre.className = 'code-block-pre';
        const codeElement = document.createElement('code');
        codeElement.textContent = code;
        pre.appendChild(codeElement);

        container.appendChild(header);
        container.appendChild(pre);

        setTimeout(() => this.initializeEventListeners(container), 0);

        return container;
    }

    async copyCode(id) {
        try {
            const code = this.codeBlocks.get(id);
            await navigator.clipboard.writeText(code);
            this.showNotification('Код скопирован!', 'success');
        } catch (err) {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка при копировании', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `code-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

function formatAIMessage(content) {
    const codeBlockManager = new CodeBlockManager();
    
    // Обработка блоков кода
    content = content.replace(/```(\w+)?\n([\s\S]+?)\n```/g, (match, language, code) => {
        const codeBlock = codeBlockManager.createCodeBlockUI(code.trim(), language);
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(codeBlock);
        return tempDiv.innerHTML;
    });

    // Остальное форматирование
    content = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        .replace(/\n/g, '<br>');

    return content;
}

const codeStyles = document.createElement('style');
codeStyles.textContent = `
    .code-block-container {
        margin: 1em 0;
        background: #f8f9fa;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #e9ecef;
    }

    .code-block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5em 1em;
        background: #e9ecef;
        border-bottom: 1px solid #dee2e6;
    }

    .code-language {
        font-family: monospace;
        color: #495057;
        font-size: 0.9em;
    }

    .code-block-actions button {
        background: none;
        border: none;
        padding: 0.25em 0.5em;
        cursor: pointer;
        color: #6c757d;
        transition: color 0.2s;
    }

    .code-block-actions button:hover {
        color: #212529;
    }

    .code-block-pre {
        margin: 0;
        padding: 1em;
        overflow-x: auto;
    }

    .code-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }

    .code-notification.success {
        background: #28a745;
    }

    .code-notification.error {
        background: #dc3545;
    }

    .code-notification.show {
        opacity: 1;
    }

    .inline-code {
        background: #f8f9fa;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: monospace;
    }
`;

document.head.appendChild(codeStyles);