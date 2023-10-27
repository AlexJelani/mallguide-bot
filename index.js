import { Configuration, OpenAIApi } from 'openai'
let openai;

// const configuration = new Configuration({
//     apiKey: import.meta.env.OPENAI_KEY,
// })
//
// const openai = new OpenAIApi(configuration)

async function getOpenAIKey() {
    try {
        const apiKeyResponse = await fetch('/.netlify/functions/fetchAI'); // Update the URL to match your Netlify function endpoint
        const apiKeyData = await apiKeyResponse.json();
        return apiKeyData.apiKey;
    } catch (error) {
        // Handle error
        console.error('Failed to fetch API key', error);
        return null;
    }
}

async function initializeOpenAI() {
    const apiKey = await getOpenAIKey();

    if (apiKey) {
        const configuration = new Configuration({
            apiKey,
        });

        openai = new OpenAIApi(configuration);

        // You can now use 'openai' for your API calls
    } else {
        // Handle the case where the API key retrieval failed
        console.error('API key not available');
    }
}

initializeOpenAI();


const chatbotConversation = document.getElementById('chatbot-conversation')

let conversationStr = ''


document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')
    conversationStr += `${userInput.value}`


    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})

async function fetchReply(){
    const response = await openai.createCompletion({
        model: 'davinci:ft-personal-2023-10-26-08-00-34',
        prompt: conversationStr,
        presence_penalty: 0,
        frequency_penalty: 0.3,
        max_tokens:300,
        temperature:0,
        stop: ['\n']
    })
    conversationStr += ` ${response.data.choices[0].text} \n`
    renderTypewriterText(response.data.choices[0].text)
}

function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}
