// 🔑 API KEY (осында өз кілтіңді қой)
const API_KEY = "PASTE_YOUR_API_KEY";

// HTML элементтер
const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");
const modeSelect = document.getElementById("mode");
const counterText = document.getElementById("counter");

// image
const imgBtn = document.getElementById("generateImg");

let requestCount = 0;

// 📌 режимге байланысты жауап стилі
function getSystemPrompt(mode) {
    if (mode === "smart") return "Сен ақылды ассистентсің, нақты әрі түсінікті жауап бер.";
    if (mode === "super") return "Сен өте күшті ассистентсің, толық әрі пайдалы жауап бер.";
    if (mode === "ultra") return "Сен экспертсің, максимум ақпарат бер және мысалдар келтір.";
    return "Қысқа және қарапайым жауап бер.";
}

// 📌 хабарлама қосу
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = sender;
    div.innerText = text;
    chatBox.appendChild(div);

    // авто скролл
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 📌 ЧАТ функциясы
async function sendMessage() {
    const userText = input.value.trim();
    const mode = modeSelect.value;

    if (!userText) return;

    addMessage("Сен: " + userText, "user");

    input.value = "";

    // счетчик
    requestCount++;
    counterText.innerText = "Сұраныстар саны: " + requestCount;

    // typing эффект
    addMessage("Гений AI жазып жатыр...", "bot");

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: getSystemPrompt(mode) },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();

        // соңғы "typing" тексті өшіру
        chatBox.lastChild.remove();

        const aiText = data.choices[0].message.content;
        addMessage("Гений AI: " + aiText, "bot");

    } catch (error) {
        chatBox.lastChild.remove();
        addMessage("Қате шықты 😢", "bot");
        console.error(error);
    }
}

// 📌 IMAGE генерация
async function generateImage() {
    const prompt = document.getElementById("imagePrompt").value.trim();
    const resultDiv = document.getElementById("imageResult");

    if (!prompt) return;

    resultDiv.innerHTML = "Жүктелуде...";

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: "gpt-image-1",
                prompt: prompt,
                size: "512x512"
            })
        });

        const data = await response.json();
        const imageUrl = data.data[0].url;

        resultDiv.innerHTML = `<img src="${imageUrl}" alt="AI Image">`;

    } catch (error) {
        resultDiv.innerHTML = "Қате шықты 😢";
        console.error(error);
    }
}

// 📌 батырмалар
button.addEventListener("click", sendMessage);

// Enter басқанда
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// image кнопка
imgBtn.addEventListener("click", generateImage);