// ==========================================
// 1. DELETE THE TEXT BELOW AND PASTE YOUR KEY
// ==========================================
const GEMINI_API_KEY = "AIzaSyCL4IL-0G6BNazsZHdpj6fhkhaqGhAXikg"; 

// ==========================================
// 2. DO NOT CHANGE ANYTHING BELOW THIS LINE
// ==========================================
const S_URL = 'https://tvjztcrpyunwmkuaisi.supabase.co';
const S_KEY = 'sb_publishable_eIHuOUIEe3BkfnA7tjcAgg_7YY9yqb6';
const _sb = supabase.createClient(S_URL, S_KEY);

function showPage(id){ 
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
}

function handleLogin(){ 
    if(document.getElementById('user-id').value==='Marshall' && document.getElementById('user-pw').value==='123456798'){ 
        document.getElementById('admin-card').style.display='block'; 
        document.getElementById('logoutBtn').style.display='block'; 
        showPage('pg-dash'); 
    } else { alert("Access Denied"); } 
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const msg = input.value;
    if(!msg) return;

    const box = document.getElementById('chat-box');
    box.innerHTML += `<p style="color:#3d7fff;"><b>You:</b> ${msg}</p>`;
    input.value = "";

    try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: msg }]
                }]
            })
        });

        const data = await resp.json();

        if (data.error) {
            box.innerHTML += `<p style="color:red;"><b>Error:</b> ${data.error.message}</p>`;
        } else {
            const reply = data.candidates[0].content.parts[0].text;
            box.innerHTML += `<p><b>AI:</b> ${reply}</p>`;
        }
        box.scrollTop = box.scrollHeight;
    } catch(e) {
        box.innerHTML += `<p style="color:red;"><b>System Error:</b> Could not connect.</p>`;
    }
}

async function sendWish(){
    const name = document.getElementById('w-name').value;
    const text = document.getElementById('w-msg').value;
    await _sb.from('Wishes').insert([{ Name: name, Text: text }]);
    toast("Wish Sent!");
}

async function handleUp(b, i){
    const f = document.getElementById(i).files[0];
    if(!f) return;
    toast("Uploading...");
    await _sb.storage.from(b).upload(`${Date.now()}_${f.name}`, f);
    toast("Done!");
}

function openVault(){ if(prompt("Security Key:")==='Ankit@9905296'){ showPage('pg-vault'); } }
function toast(m){ const t=document.getElementById('toast'); t.innerText=m; t.style.display='block'; setTimeout(()=>t.style.display='none',3000); }
