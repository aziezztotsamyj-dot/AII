let count = 0;

// Батырмаларға listener қосу
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("imgBtn").addEventListener("click", generateImage);

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const mode = document.getElementById("mode").value;

    const userText = input.value.trim();
    if (!userText) return;

    chatBox.innerHTML += `<p><b>Сен:</b> ${userText}</p>`;
    input.value = "";

    // Счетчик
    count++;
    document.getElementById("count").innerText = count;

    // Typing эффект
    const typing = document.createElement("p");
    typing.id = "typing";
    typing.innerHTML = "<b>Гений AI:</b> typing...";
    chatBox.appendChild(typing);

    const API_KEY = "YOUR_API_KEY";

    let systemPrompt = "";

    if (mode === "simple") systemPrompt = "Қысқа жауап бер";
    if (mode === "smart") systemPrompt = "Ақылды жауап бер";
    if (mode === "super") systemPrompt = "Кәсіби толық жауап бер";
    if (mode === "ultra") systemPrompt = "Өте терең анализ жаса";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();

        document.getElementById("typing").remove();

        const reply = data.choices[0].message.content;

        chatBox.innerHTML += `<p><b>Гений AI:</b> ${reply}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        document.getElementById("typing").remove();
        chatBox.innerHTML += `<p>Қате шықты</p>`;
    }
}

// IMAGE GENERATION
async function generateImage() {
    const prompt = document.getElementById("imgPrompt").value.trim();
    const result = document.getElementById("imageResult");

    if (!prompt) return;

    const API_KEY = "YOUR_API_KEY";

    result.innerHTML = "Жүктелуде...";

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                n: 1,
                size: "512x512"
            })
        });

        const data = await response.json();

        const imgUrl = data.data[0].url;

        result.innerHTML = `<img src="${imgUrl}">`;

    } catch (error) {
        result.innerHTML = "Қате шықты";
    }
}