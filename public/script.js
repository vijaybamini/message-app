const socket = io(); // Connects to the backend server

const messageContainer = document.querySelector('.overflow-y-auto.p-6');
const messageInput = document.querySelector('input[type="text"]');
const sendBtn = document.querySelector('button.bg-indigo-600');

// Function to append messages to the UI
function appendMessage(text, type) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isSent = type === 'sent';
    
    const msgHTML = `
        <div class="flex items-end ${isSent ? 'justify-end' : ''}">
            <div class="${isSent ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-100'} p-3 rounded-lg ${isSent ? 'rounded-br-none' : 'rounded-bl-none'} shadow-sm max-w-md">
                ${text}
                <p class="text-[10px] ${isSent ? 'text-indigo-200' : 'text-gray-400'} mt-1 text-right">${time}</p>
            </div>
        </div>`;
    
    messageContainer.insertAdjacentHTML('beforeend', msgHTML);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to bottom
}

// Sending a message
sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        appendMessage(message, 'sent');
        socket.emit('chatMessage', message); // Send to server
        messageInput.value = '';
    }
});

// Listening for messages from others
socket.on('message', (msg) => {
    appendMessage(msg, 'received');
});
