function showTypingIndicator() {
    // Создаем индикатор набора текста
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');

    let phraseIndex = 0;

    const phraseSpan = document.createElement('span');
    phraseSpan.classList.add('typing-phrase');
    phraseSpan.textContent = phrases[phraseIndex];

    typingIndicator.appendChild(phraseSpan);
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Меняем фразы каждые 2 секунды
    const intervalId = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phraseSpan.textContent = phrases[phraseIndex];
    }, 80);
}

function hideTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

const phrases = [
    "Генерация... 😊",
    "Генерация... 🤝",
    "Генерация... 👍",
    "Генерация... ❤️",
    "Генерация... 😌",
    "Генерация... 👌",
    "Генерация... 🌟",
    "Генерация... 🎉",
    "Генерация... 🚀",
    "Генерация... 💪",
    "Генерация... 😄",
    "Генерация... 🌈",
    "Генерация... 😍",
    "Генерация... 🎈",
    "Генерация... 🤗",
    "Генерация... ✨",
    "Генерация... 🌻",
    "Генерация... 🥳",
    "Генерация... 🌊",
    "Генерация... 🍀",
    "Генерация... 🎶",
    "Генерация... 🤩",
    "Генерация... 💖",
    "Генерация... 🏆",
    "Генерация... 🌍",
    "Генерация... 🤔",
    "Генерация... 🔥",
    "Генерация... 🥇",
    "Генерация... 🍭",
    "Генерация... 💫",
    "Генерация... 🦄",
    "Генерация... 🍰",
    "Генерация... 🍉",
    "Генерация... 🥂",
    "Генерация... 🌼",
    "Генерация... 🎀",
    "Генерация... 🌺",
    "Генерация... 🍩",
    "Генерация... 🚴",
    "Генерация... 🎤",
    "Генерация... 📸",
    "Генерация... 🤖",
    "Генерация... 🥕",
    "Генерация... 💌",
    "Генерация... 🍕",
    "Генерация... 🍳",
    "Генерация... 🐉",
    "Генерация... 🎨",
    "Генерация... 🎭",
    "Генерация... 🎧",
    "Генерация... 🧩",
    "Генерация... 🌌",
    "Генерация... 🏖️",
    "Генерация... 🏕️",
    "Генерация... 🥨",
    "Генерация... 🎬",
    "Генерация... 🐳",
    "Генерация... 🍣",
    "Генерация... 🌙",
    "Генерация... 🌪️",
    "Генерация... 🥗",
    "Генерация... 🍇",
    "Генерация... 🍒",
    "Генерация... 🍈",
    "Генерация... 🍊",
    "Генерация... 🍋",
    "Генерация... 🥭",
    "Генерация... 🍍",
    "Генерация... 🥥",
    "Генерация... 🥔",
    "Генерация... 🧀",
    "Генерация... 🍤",
    "Генерация... 🌭",
    "Генерация... 🍔",
    "Генерация... 🌮",
    "Генерация... 🌯",
    "Генерация... 🍝",
    "Генерация... 🥙",
    "Генерация... 🧁",
    "Генерация... 😇",
    "Генерация... 🤓",
    "Генерация... 🙌",
    "Генерация... 😸",
    "Генерация... 🙃",
    "Генерация... 😻",
    "Генерация... 😼",
    "Генерация... 😽",
    "Генерация... 🥺",
    "Генерация... 😺",
    "Генерация... 😋",
    "Генерация... 🥰",
    "Генерация... 🤗",
    "Генерация... 😘",
    "Генерация... 🤩",
    "Генерация... 🤯",
    "Генерация... 💕",
    "Генерация... 🌍",
    "Генерация... 🔑",
    "Генерация... 🧙‍♂️",
    "Генерация... 🦸‍♀️",
    "Генерация... 🦸‍♂️",
    "Генерация... 👑",
    "Генерация... 🥇",
    "Генерация... 🌺",
    "Генерация... 🦋",
    "Генерация... 🌷",
    "Генерация... 🌸",
    "Генерация... 🌼",
    "Генерация... 🍃",
    "Генерация... 🌹",
    "Генерация... 🎊",
    "Генерация... 🧁",
    "Генерация... 🍦",
    "Генерация... 🍧",
    "Генерация... 🍨",
    "Генерация... 🏅",
    "Генерация... 💌",
    "Генерация... 🌈",
    "Генерация... 🍀",
    "Генерация... 🎡",
    "Генерация... 🎢",
    "Генерация... 🎠",
    "Генерация... 🎣",
    "Генерация... 🥞",
    "Генерация... 🥓",
    "Генерация... 🌰",
    "Генерация... 🍄",
    "Генерация... 🥑",
    "Генерация... 🥕",
    "Генерация... 🍆",
    "Генерация... 🌶️",
    "Генерация... 🥭",
    "Генерация... 🥝",
    "Генерация... 🌽",
    "Генерация... 🍅",
    "Генерация... 🍖",
    "Генерация... 🍗",
    "Генерация... 🥩",
    "Генерация... 🌭",
    "Генерация... 🍟",
    "Генерация... 🍕",
    "Генерация... 🍣",
    "Генерация... 🍜",
    "Генерация... 🥡",
    "Генерация... 🥘",
    "Генерация... 🍽️",
    "Генерация... 🍹",
    "Генерация... 🍸",
    "Генерация... 🥂",
    "Генерация... 🍻",
    "Генерация... 🥃",
    "Генерация... 🥤",
    "Генерация... 🍧",
    "Генерация... 🍦",
    "Генерация... 🥛",
    "Генерация... 🥤",
    "Генерация... 🥡",
    "Генерация... 🍚",
    "Генерация... 🍙",
    "Генерация... 🍘",
    "Генерация... 🍱",
    "Генерация... 🍚",
    "Генерация... 🍘",
    "Генерация... 🍱",
    "Генерация... 🍣",
    "Генерация... 🍙",
    "Генерация... 🍛",
    "Генерация... 🍝",
    "Генерация... 🥘",
    "Генерация... 🍲",
    "Генерация... 🥗",
    "Генерация... 🥑",
    "Генерация... 🍅",
    "Генерация... 🍆",
    "Генерация... 🌽",
    "Генерация... 🌶️",
    "Генерация... 🥔",
    "Генерация... 🥕",
    "Генерация... 🍥",
    "Генерация... 🍡",
    "Генерация... 🍢",
    "Генерация... 🍜",
    "Генерация... 🍛",
    "Генерация... 🍗",
    "Генерация... 🍖",
    "Генерация... 🌭",
    "Генерация... 🌮",
    "Генерация... 🍕",
    "Генерация... 🍔",
    "Генерация... 🌭",
    "Генерация... 🍟",
    "Генерация... 🌭",
    "Генерация... 🍗",
    "Генерация... 🍖",
    "Генерация... 🌯",
    "Генерация... 🍤"
]