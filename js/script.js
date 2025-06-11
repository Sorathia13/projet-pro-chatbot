// Fichier : script.js

// --- Configuration ---
// La clé API est maintenant importée depuis config.js comme variable globale
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${window.API_KEY}`;

// --- Éléments du DOM ---
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

// --- Fonctions ---

/**
 * Ajoute un message à l'interface du chat
 * @param {string} message Le contenu du message
 * @param {string} sender 'user' ou 'bot'
 */
function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    // Fait défiler vers le bas pour voir le nouveau message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Envoie la question à l'API Gemini et affiche la réponse
 */
async function handleUserQuestion() {
    const question = userInput.value.trim();
    if (question === "") return;

    addMessage(question, 'user');
    userInput.value = ""; // Vide le champ de saisie

    // Affiche un indicateur de chargement
    addMessage("...", 'bot');
    const thinkingMessage = chatMessages.lastChild;

    try {
        // C'est le "prompt" que nous envoyons à l'IA. C'est la partie la plus importante !
        const prompt = `
        Tu es un assistant virtuel pour le site web "WebInnov".
        Ta mission est de répondre aux questions des utilisateurs en te basant EXCLUSIVEMENT sur le contexte fourni ci-dessous.
        Si la réponse n'est pas dans le contexte, réponds poliment que tu ne disposes pas de cette information.
        Sois concis et aimable.

        --- CONTEXTE ---
        ${CONTEXTE_DU_SITE}
        --- FIN DU CONTEXTE ---

        Question de l'utilisateur : "${question}"
        
        Réponse :
        `;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.statusText}`);
        }

        const data = await response.json();
        // Extrait le texte de la réponse de l'API
        const botResponse = data.candidates[0].content.parts[0].text;
        
        // Met à jour le message "..." avec la vraie réponse
        thinkingMessage.textContent = botResponse;

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Gemini:", error);
        thinkingMessage.textContent = "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.";
    }
}

// --- Écouteurs d'événements ---
sendBtn.addEventListener('click', handleUserQuestion);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleUserQuestion();
    }
});