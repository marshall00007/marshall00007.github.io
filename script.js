// --- CONFIGURATION ---
const GEMINI_API_KEY = "AIzaSyBlHArqwsBu3A_qX1RatlTRlbiEcb4ZZ8c";
const SUPABASE_URL = "https://tvjztcrrpyunwmkuaisi.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_eIHuOUIEe3BkfnA7tjcAgg_7YY9yqb6"; 

let userName = "";

// --- 1. START CHAT (NAME ENTRY) ---
function startChat() {
    const nameInput = document.getElementById('nameInput').value;
    if (nameInput && nameInput.trim() !== "") {
        userName = nameInput;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';
        addMessage("System", `Welcome to the XUNIVERSE vault, ${userName}! How can I help you today?`);
    } else {
        alert("Please enter your name first!");
    }
}

// --- 2. MAIN AI LOGIC ---
async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput) return;

    addMessage(userName, userInput);
    document.getElementById('userInput').value = "";

    let botReply = "";
    let generatedImage = null;

    try {
        // A. Check for Image Generation (Meme/Art)
        if (userInput.toLowerCase().includes("make image") || userInput.toLowerCase().includes("draw")) {
            generatedImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(userInput)}?width=1024&height=1024&nologo=true`;
            botReply = "I've generated that image and stored the link in our private vault!";
        } 
        // B. Ask Gemini (Search enabled for research/facts)
        else {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }]
                })
            });
            const data = await response.json();
            botReply = data.candidates[0].content.parts[0].text;
        }

        addMessage("XUNIVERSE AI", botReply, generatedImage);

        // C. SAVE TO SUPABASE VAULT
        await saveToVault(userInput, botReply, generatedImage);

    } catch (error) {
        console.error("Error:", error);
        addMessage("System", "Sorry, my brain hit a snag. Try again!");
    }
}

// --- 3. THE VAULT SYNC ---
async function saveToVault(userMsg, aiMsg, imgUrl) {
    await fetch(`${SUPABASE_URL}/rest/v1/xuniverse_ai_chats`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({
            user_name: userName,
            user_message: userMsg,
            bot_response: aiMsg,
            image_url: imgUrl
        })
    });
}

// Helper to show messages on screen
function addMessage(sender, text, img = null) {
    const box = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = "15px";
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    if (img) {
        const i = document.createElement('img');
        i.src = img;
        i.style.width = "100%";
        i.style.maxWidth = "300px";
        i.style.display = "block";
        i.style.marginTop = "10px";
        msgDiv.appendChild(i);
    }
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
}
