// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const overlay = document.getElementById('overlay');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileUpload = document.getElementById('file-upload');
const attachmentBtn = document.getElementById('attachment-btn');
const learningStyleSelect = document.getElementById('learning-style');
const currentDateElement = document.getElementById('current-date');

// Initial setup
let messages = [];
let isUploading = false;
let currentLearningStyle = 'blended';
let ttsAvailable = false;
let currentAudioPlayer = null;

// Set current date
if (currentDateElement) {
    currentDateElement.textContent = formatDate(new Date());
}

// Mobile menu functionality
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    });
}

function closeSidebar() {
    if (overlay && sidebar) {
        overlay.classList.remove('active');
        setTimeout(() => {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        }, 300);
    }
}

if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
}

if (overlay) {
    overlay.addEventListener('click', closeSidebar);
}

// Toggle sidebar with toggle button
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        // Update the toggle icon
        if (sidebar.classList.contains('collapsed')) {
            sidebarToggle.innerHTML = '<i class="ri-arrow-right-line"></i>';
            sidebarToggle.classList.add('collapsed');
        } else {
            sidebarToggle.innerHTML = '<i class="ri-arrow-left-line"></i>';
            sidebarToggle.classList.remove('collapsed');
        }
    });
}

// Create toast notification
function showToast(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000); // Show for 5 seconds
}

// Format AI response for display
function formatAIResponse(text) {
    if (!text) return '';
    
    // Replace Markdown formatting with HTML
    let formattedText = text
        // Convert ** bold ** to <strong>bold</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Convert * italic * to <em>italic</em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Convert # Headers to <h> tags
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        
        // Convert bullet points
        .replace(/^- (.*?)$/gm, '<li>$1</li>')
        .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
        
        // Convert numbered lists
        .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
        .replace(/(<li>.*?<\/li>)/gs, '<ol>$1</ol>')
        
        // Convert paragraphs (double newlines)
        .replace(/\n\n/g, '</p><p>')
        
        // Convert single newlines to <br>
        .replace(/\n/g, '<br>')
        
        // Replace any potential HTML element duplications
        .replace(/<\/ul><ul>/g, '')
        .replace(/<\/ol><ol>/g, '')
        .replace(/<\/p><p>/g, '</p><p>');
    
    // Wrap in paragraph if not already
    if (!formattedText.startsWith('<')) {
        formattedText = '<p>' + formattedText + '</p>';
    }
    
    return formattedText;
}

// Chat functionality
function formatTime(date) {
    if (!(date instanceof Date)) {
        date = new Date(date * 1000); // Convert timestamp to Date
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date * 1000); // Convert timestamp to Date
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Create audio player for auditory learning style
function createAudioPlayer(audioUrl) {
    // Create audio container
    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-player';
    
    // Create audio element
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.preload = 'auto';
    
    // Create play button
    const playButton = document.createElement('button');
    playButton.className = 'play-button';
    playButton.innerHTML = '<i class="ri-play-fill"></i>';
    
    // Create progress container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressContainer.appendChild(progressBar);
    
    // Add event listeners
    playButton.addEventListener('click', () => {
        // Stop any currently playing audio
        if (currentAudioPlayer && currentAudioPlayer !== audio) {
            currentAudioPlayer.pause();
            currentAudioPlayer.currentTime = 0;
            // Reset any other play buttons
            document.querySelectorAll('.play-button').forEach(btn => {
                btn.innerHTML = '<i class="ri-play-fill"></i>';
            });
        }
        
        if (audio.paused) {
            audio.play();
            playButton.innerHTML = '<i class="ri-pause-fill"></i>';
            currentAudioPlayer = audio;
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="ri-play-fill"></i>';
        }
    });
    
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });
    
    audio.addEventListener('ended', () => {
        playButton.innerHTML = '<i class="ri-play-fill"></i>';
        progressBar.style.width = '0%';
        currentAudioPlayer = null;
    });
    
    // Append elements to container
    audioContainer.appendChild(playButton);
    audioContainer.appendChild(progressContainer);
    
    return audioContainer;
}

function addMessage(message) {
    try {
        // Convert timestamp to Date if it's a number
        const messageDate = message.timestamp instanceof Date 
            ? message.timestamp 
            : new Date(message.timestamp * 1000);
            
        const messageDateString = messageDate.toDateString();
        
        // Check if we need to add a new date group
        let messageGroup = document.querySelector(`.message-group[data-date="${messageDateString}"]`);
        
        if (!messageGroup) {
            messageGroup = document.createElement('div');
            messageGroup.classList.add('message-group');
            messageGroup.setAttribute('data-date', messageDateString);
            
            const dateDivider = document.createElement('div');
            dateDivider.classList.add('date-divider');
            dateDivider.innerHTML = `<span class="date-badge">${formatDate(messageDate)}</span>`;
            
            messageGroup.appendChild(dateDivider);
            chatMessages.appendChild(messageGroup);
        }
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role === 'user' ? 'user' : 'ai');
        
        // Format content differently based on role
        const messageContent = message.role === 'assistant' 
            ? formatAIResponse(message.content) 
            : message.content;
        
        // Add visual class for visual learning style
        if (message.role === 'assistant' && currentLearningStyle === 'visual') {
            messageElement.classList.add('visual-style');
        }
        
        let audioPlayerHtml = '';
        
        // Add audio player for auditory learning style
        if (message.role === 'assistant' && message.audio_url) {
            audioPlayerHtml = `<div class="audio-player-placeholder" data-audio-url="${message.audio_url}"></div>`;
        }
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                <div class="message-content">${messageContent}</div>
                ${audioPlayerHtml}
                <div class="message-time">${formatTime(messageDate)}</div>
            </div>
        `;
        
        messageGroup.appendChild(messageElement);
        
        // Initialize audio player if needed
        if (message.role === 'assistant' && message.audio_url) {
            const placeholder = messageElement.querySelector('.audio-player-placeholder');
            if (placeholder) {
                const audioUrl = placeholder.getAttribute('data-audio-url');
                const audioPlayer = createAudioPlayer(audioUrl);
                placeholder.replaceWith(audioPlayer);
                
                // Auto-play if it's the most recent message
                if (message === messages[messages.length - 1]) {
                    // Small delay to ensure audio is loaded
                    setTimeout(() => {
                        const playButton = audioPlayer.querySelector('.play-button');
                        if (playButton) {
                            playButton.click();
                        }
                    }, 500);
                }
            }
        }
        
        scrollToBottom();
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function showTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.classList.add('active');
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.classList.remove('active');
    }
}

// Send message to API
async function sendMessage() {
    const content = chatInput.value.trim();
    
    if (content === '') return;
    
    // User message
    const userMessage = {
        role: 'user',
        content: content,
        timestamp: new Date()
    };
    
    // Add to local messages and display
    messages.push(userMessage);
    addMessage(userMessage);
    chatInput.value = '';
    sendBtn.classList.add('disabled');
    
    // Show typing indicator
    showTypingIndicator();
    scrollToBottom();
    
    try {
        // Call the API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: content
            })
        });
        
        // Parse the response
        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        if (response.ok) {
            // Add AI response
            const aiMessage = {
                role: 'assistant',
                content: data.response,
                timestamp: data.timestamp || new Date(),
                audio_url: data.audio_url || null
            };
            
            messages.push(aiMessage);
            addMessage(aiMessage);
        } else {
            // Show error message
            const errorMessage = {
                role: 'assistant',
                content: data.error || "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            
            messages.push(errorMessage);
            addMessage(errorMessage);
            showToast("Error: " + (data.error || "Failed to get response"), "error");
        }
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        
        // Add error message
        const errorMessage = {
            role: 'assistant',
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date()
        };
        
        messages.push(errorMessage);
        addMessage(errorMessage);
        
        showToast('Failed to send message. Please try again.', 'error');
    }
}

// Upload file to API
async function uploadFile(file) {
    if (isUploading) {
        showToast('A file is already being uploaded. Please wait.', 'info');
        return;
    }
    
    try {
        isUploading = true;
        const formData = new FormData();
        formData.append('file', file);
        
        showToast('Uploading document...', 'info');
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        isUploading = false;
        
        if (response.ok) {
            showToast(`Document "${data.filename}" uploaded successfully!`, 'success');
            
            // The backend adds the system message, so we don't need to add it here
            // Just refresh the chat history to get the new message
            await loadChatHistory();
        } else {
            showToast(`Failed to upload document: ${data.error || 'Unknown error'}`, 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        isUploading = false;
        showToast('Failed to upload document. Please try again.', 'error');
    }
}

// Set learning style
async function setLearningStyle(style) {
    try {
        const response = await fetch('/api/learning-style', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                style: style
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentLearningStyle = style;
            
            // Update UI based on learning style
            document.body.setAttribute('data-learning-style', style);
            
            // Update TTS availability
            if (data.tts_available !== undefined) {
                ttsAvailable = data.tts_available;
            }
            
            // Refresh chat to get the style change message
            await loadChatHistory();
            
            // Special handling for visual/auditory styles
            if (style === 'visual') {
                showToast('Visual learning style activated. Responses will include visual elements.', 'success');
            } else if (style === 'auditory') {
                if (ttsAvailable) {
                    showToast('Auditory learning style activated. Responses will include audio playback.', 'success');
                } else {
                    showToast('Auditory learning style activated, but audio generation is not available on the server.', 'info');
                }
            } else {
                showToast(`Learning style set to "${style}"`, 'success');
            }
        } else {
            showToast(`Failed to set learning style: ${data.error || 'Unknown error'}`, 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to set learning style. Please try again.', 'error');
    }
}

// Load chat history from API
async function loadChatHistory() {
    try {
        const response = await fetch('/api/history');
        
        if (!response.ok) {
            throw new Error('Failed to load chat history');
        }
        
        const data = await response.json();
        
        if (data.history && data.history.length > 0) {
            // Clear existing messages in the UI
            chatMessages.innerHTML = '';
            messages = data.history;
            
            // Add messages to UI
            messages.forEach(message => {
                addMessage(message);
            });
        }
        
    } catch (error) {
        console.error('Error loading chat history:', error);
        // Continue with any messages we have locally
    }
}

// Load documents from API
async function loadDocuments() {
    try {
        const response = await fetch('/api/documents');
        
        if (!response.ok) {
            throw new Error('Failed to load documents');
        }
        
        const data = await response.json();
        
        // If we have documents, additional UI logic could go here
        // (not needed since server sends system messages about documents)
        
    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

// Check health and API status
async function checkApiHealth() {
    try {
        const response = await fetch('/api/healthcheck');
        
        if (!response.ok) {
            throw new Error('API health check failed');
        }
        
        const data = await response.json();
        
        if (!data.gemini_available) {
            showToast('Warning: AI model not available. Some features may be limited.', 'error');
        }
        
        // Check TTS availability for auditory style
        ttsAvailable = data.tts_available || false;
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Warning: Could not connect to server. Please check your connection.', 'error');
    }
}

// Event listeners
if (chatInput) {
    chatInput.addEventListener('input', () => {
        if (chatInput.value.trim() !== '') {
            sendBtn.classList.remove('disabled');
        } else {
            sendBtn.classList.add('disabled');
        }
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && chatInput.value.trim() !== '') {
            e.preventDefault();
            sendMessage();
        }
    });
}

if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        if (!sendBtn.classList.contains('disabled')) {
            sendMessage();
        }
    });
}

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        if (fileUpload) {
            fileUpload.click();
        }
    });
}

if (attachmentBtn) {
    attachmentBtn.addEventListener('click', () => {
        if (fileUpload) {
            fileUpload.click();
        }
    });
}

if (fileUpload) {
    fileUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
            // Clear the input to allow uploading the same file again
            e.target.value = '';
        }
    });
}

if (learningStyleSelect) {
    learningStyleSelect.addEventListener('change', () => {
        setLearningStyle(learningStyleSelect.value);
    });
}

// Initialize the app
async function initApp() {
    try {
        // Check API health
        await checkApiHealth();
        
        // Load chat history
        await loadChatHistory();
        
        // Load documents
        await loadDocuments();
        
        // Set initial learning style from user preferences or quiz results
        if (learningStyleSelect) {
            try {
                // Try to get user preferences from API
                const response = await fetch('/api/user-preferences');
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.preferences && data.preferences.learningStyle) {
                        // Map quiz responses to learning styles
                        const style_mapping = {
                            "Watching videos": "visual",
                            "Reading books": "reading",
                            "Listening to podcasts": "auditory",
                            "Doing it myself": "hands-on"
                        };
                        
                        const preferredStyle = style_mapping[data.preferences.learningStyle] || 'blended';
                        currentLearningStyle = preferredStyle;
                        learningStyleSelect.value = preferredStyle;
                    }
                }
            } catch (error) {
                console.error('Error loading user preferences:', error);
                // If error, keep default style
            }
            
            // Set body attribute for CSS styling
            document.body.setAttribute('data-learning-style', currentLearningStyle);
        }
        
        // Scroll to bottom
        scrollToBottom();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error connecting to server. Basic chat functionality may still work.', 'error');
    }
}

// Enhanced audio player for auditory learning style
function createEnhancedAudioPlayer(audioUrl) {
    // Create audio container
    const audioContainer = document.createElement('div');
    audioContainer.className = 'enhanced-audio-player';
    
    // Create audio element
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.preload = 'auto';
    
    // Create player UI
    audioContainer.innerHTML = `
        <div class="audio-player-controls">
            <button class="audio-play-button">
                <i class="ri-pause-fill"></i>
            </button>
            <div class="audio-progress-container">
                <div class="audio-progress-bar"></div>
            </div>
            <span class="audio-time-display">0:00</span>
        </div>
        <button class="toggle-text-button">
            <i class="ri-eye-line"></i>
            <span>Show Text</span>
        </button>
    `;
    
    // Get UI elements
    const playButton = audioContainer.querySelector('.audio-play-button');
    const progressBar = audioContainer.querySelector('.audio-progress-bar');
    const progressContainer = audioContainer.querySelector('.audio-progress-container');
    const timeDisplay = audioContainer.querySelector('.audio-time-display');
    const toggleTextButton = audioContainer.querySelector('.toggle-text-button');
    
    // Add event listeners
    playButton.addEventListener('click', () => {
        if (audio.paused) {
            // Stop any currently playing audio
            if (currentAudioPlayer && currentAudioPlayer !== audio) {
                currentAudioPlayer.pause();
                document.querySelectorAll('.audio-play-button').forEach(btn => {
                    btn.innerHTML = '<i class="ri-play-fill"></i>';
                });
            }
            
            audio.play();
            playButton.innerHTML = '<i class="ri-pause-fill"></i>';
            currentAudioPlayer = audio;
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="ri-play-fill"></i>';
        }
    });
    
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update time display
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
    
    progressContainer.addEventListener('click', (e) => {
        const clickPosition = (e.offsetX / progressContainer.clientWidth);
        audio.currentTime = clickPosition * audio.duration;
    });
    
    audio.addEventListener('ended', () => {
        playButton.innerHTML = '<i class="ri-play-fill"></i>';
        progressBar.style.width = '0%';
        timeDisplay.textContent = '0:00';
        currentAudioPlayer = null;
    });
    
    toggleTextButton.addEventListener('click', () => {
        const messageContent = audioContainer.parentElement.querySelector('.message-content');
        if (messageContent.style.display === 'none') {
            messageContent.style.display = 'block';
            toggleTextButton.innerHTML = '<i class="ri-eye-off-line"></i><span>Hide Text</span>';
        } else {
            messageContent.style.display = 'none';
            toggleTextButton.innerHTML = '<i class="ri-eye-line"></i><span>Show Text</span>';
        }
    });
    
    // Auto-play for auditory mode
    setTimeout(() => {
        if (currentLearningStyle === 'auditory') {
            playButton.click();
        }
    }, 500);
    
    return audioContainer;
}

// Update the addMessage function to handle auditory learning style
function addMessage(message) {
    try {
        // Convert timestamp to Date if it's a number
        const messageDate = message.timestamp instanceof Date 
            ? message.timestamp 
            : new Date(message.timestamp * 1000);
            
        const messageDateString = messageDate.toDateString();
        // Check if we need to add a new date group
        let messageGroup = document.querySelector(`.message-group[data-date="${messageDateString}"]`);
        
        if (!messageGroup) {
            messageGroup = document.createElement('div');
            messageGroup.classList.add('message-group');
            messageGroup.setAttribute('data-date', messageDateString);
            
            const dateDivider = document.createElement('div');
            dateDivider.classList.add('date-divider');
            dateDivider.innerHTML = `<span class="date-badge">${formatDate(messageDate)}</span>`;
            
            messageGroup.appendChild(dateDivider);
            chatMessages.appendChild(messageGroup);
        }
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role === 'user' ? 'user' : 'ai');
        
        // Format content differently based on role
        const messageContent = message.role === 'assistant' 
            ? formatAIResponse(message.content) 
            : message.content;
        
        // Add visual class for visual learning style
        if (message.role === 'assistant' && currentLearningStyle === 'visual') {
            messageElement.classList.add('visual-style');
        }
        
        // For auditory mode, hide message content initially if audio available
        const contentDisplay = (message.role === 'assistant' && 
                               message.audio_url && 
                               currentLearningStyle === 'auditory') ? 'none' : 'block';
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                <div class="message-content" style="display: ${contentDisplay}">${messageContent}</div>
                <div class="message-time">${formatTime(messageDate)}</div>
            </div>
        `;
        
        messageGroup.appendChild(messageElement);
        
        // Add enhanced audio player for auditory learning style
        if (message.role === 'assistant' && message.audio_url) {
            const messageBubble = messageElement.querySelector('.message-bubble');
            
            if (currentLearningStyle === 'auditory') {
                const audioPlayer = createEnhancedAudioPlayer(message.audio_url);
                messageBubble.appendChild(audioPlayer);
                
                // Auto-play if it's the most recent message
                if (message === messages[messages.length - 1]) {
                    // Audio auto-play is handled inside createEnhancedAudioPlayer
                }
            } else {
                // Regular player for non-auditory mode
                const audioPlayer = createAudioPlayer(message.audio_url);
                messageBubble.appendChild(audioPlayer);
            }
        }
        
        scrollToBottom();
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

// Update the addMessage function for enhanced auditory learning style
function addMessage(message) {
    try {
        // Convert timestamp to Date if it's a number
        const messageDate = message.timestamp instanceof Date 
            ? message.timestamp 
            : new Date(message.timestamp * 1000);
            
        const messageDateString = messageDate.toDateString();
        
        // Check if we need to add a new date group
        let messageGroup = document.querySelector(`.message-group[data-date="${messageDateString}"]`);
        
        if (!messageGroup) {
            messageGroup = document.createElement('div');
            messageGroup.classList.add('message-group');
            messageGroup.setAttribute('data-date', messageDateString);
            
            const dateDivider = document.createElement('div');
            dateDivider.classList.add('date-divider');
            dateDivider.innerHTML = `<span class="date-badge">${formatDate(messageDate)}</span>`;
            
            messageGroup.appendChild(dateDivider);
            chatMessages.appendChild(messageGroup);
        }
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', message.role === 'user' ? 'user' : 'ai');
        
        // Format content differently based on role
        const messageContent = message.role === 'assistant' 
            ? formatAIResponse(message.content) 
            : message.content;
        
        // Add visual class for visual learning style
        if (message.role === 'assistant' && currentLearningStyle === 'visual') {
            messageElement.classList.add('visual-style');
        }
        
        // For auditory mode, hide message content initially if audio available
        const contentDisplay = (message.role === 'assistant' && 
                               message.audio_url && 
                               currentLearningStyle === 'auditory') ? 'none' : 'block';
        
        messageElement.innerHTML = `
            <div class="message-bubble">
                <div class="message-content" style="display: ${contentDisplay}">${messageContent}</div>
                <div class="message-time">${formatTime(messageDate)}</div>
            </div>
        `;
        
        messageGroup.appendChild(messageElement);
        
        // Add enhanced audio player for auditory learning style
        if (message.role === 'assistant' && message.audio_url) {
            const messageBubble = messageElement.querySelector('.message-bubble');
            
            if (currentLearningStyle === 'auditory') {
                const audioPlayer = createEnhancedAudioPlayer(message.audio_url);
                messageBubble.appendChild(audioPlayer);
                
                // Auto-play if it's the most recent message
                if (message === messages[messages.length - 1]) {
                    // Audio auto-play is handled inside createEnhancedAudioPlayer
                }
            } else {
                // Regular player for non-auditory mode
                const audioPlayer = createAudioPlayer(message.audio_url);
                messageBubble.appendChild(audioPlayer);
            }
        }
        
        scrollToBottom();
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

// Add CSS for enhanced audio player to style.css
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Enhanced Audio Player for Auditory Learning */
    .enhanced-audio-player {
        background-color: rgba(162, 89, 255, 0.08);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .audio-player-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .audio-play-button {
        background-color: var(--color-primary);
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .audio-play-button:hover {
        background-color: var(--color-primary-dark);
        transform: scale(1.05);
    }
    
    .audio-play-button i {
        font-size: 20px;
    }
    
    .audio-progress-container {
        flex: 1;
        height: 8px;
        background-color: rgba(162, 89, 255, 0.15);
        border-radius: var(--radius-full);
        overflow: hidden;
        cursor: pointer;
    }
    
    .audio-progress-bar {
        height: 100%;
        background-color: var(--color-primary);
        width: 0%;
        transition: width 0.1s linear;
    }
    
    .audio-time-display {
        font-size: 0.8rem;
        color: var(--color-text-medium);
        min-width: 40px;
        text-align: right;
    }
    
    .toggle-text-button {
        background-color: rgba(162, 89, 255, 0.15);
        color: var(--color-primary);
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all var(--transition-fast);
    }
    
    .toggle-text-button:hover {
        background-color: rgba(162, 89, 255, 0.25);
    }
    
    .toggle-text-button i {
        font-size: 1rem;
    }
    
    /* Visual Learning Style Enhancements */
    body[data-learning-style="visual"] .message.ai .message-content {
        font-size: 1.05rem;
    }
    
    body[data-learning-style="visual"] .message.ai h1,
    body[data-learning-style="visual"] .message.ai h2,
    body[data-learning-style="visual"] .message.ai h3 {
        color: var(--color-primary-dark);
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid rgba(162, 89, 255, 0.2);
        padding-bottom: 0.25rem;
    }
    
    body[data-learning-style="visual"] .message.ai ul,
    body[data-learning-style="visual"] .message.ai ol {
        background-color: rgba(162, 89, 255, 0.05);
        padding: 0.75rem 1.25rem;
        border-radius: var(--radius-md);
        margin: 0.75rem 0;
    }
    
    body[data-learning-style="visual"] .message.ai .message-bubble {
        border-left: 4px solid var(--color-primary-light);
    }
    
    /* Flowchart Styling for Visual Learners */
    .visual-flowchart {
        background-color: white;
        border-radius: var(--radius-md);
        padding: 1rem;
        margin: 1rem 0;
        border: 1px solid var(--color-border);
    }
    
    .flowchart-box {
        border: 2px solid var(--color-primary);
        border-radius: var(--radius-sm);
        padding: 0.75rem;
        margin-bottom: 1rem;
        text-align: center;
        position: relative;
    }
    
    .flowchart-arrow {
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    /* Quiz Module Styles */
    .quiz-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 1rem;
        transition: all var(--transition-fast);
    }
    
    .quiz-button:hover {
        background-color: var(--color-primary-dark);
    }
    
    .quiz-container {
        background-color: white;
        border-radius: var(--radius-md);
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    
    .quiz-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--color-text-dark);
        text-align: center;
    }
    
    .quiz-question {
        margin-bottom: 1.5rem;
    }
    
    .quiz-question-text {
        font-weight: 500;
        margin-bottom: 1rem;
    }
    
    .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .quiz-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .quiz-option:hover {
        background-color: var(--color-bg-main);
    }
    
    .quiz-option.selected {
        border-color: var(--color-primary);
        background-color: rgba(162, 89, 255, 0.05);
    }
    
    .quiz-option.correct {
        border-color: #10b981;
        background-color: rgba(16, 185, 129, 0.05);
    }
    
    .quiz-option.incorrect {
        border-color: #ef4444;
        background-color: rgba(239, 68, 68, 0.05);
    }
    
    .quiz-option-radio {
        width: 18px;
        height: 18px;
        accent-color: var(--color-primary);
    }
    
    .quiz-submit-btn {
        display: block;
        margin: 1.5rem auto 0.5rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .quiz-submit-btn:hover {
        background-color: var(--color-primary-dark);
    }
    
    .quiz-result {
        text-align: center;
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: var(--radius-sm);
    }
    
    .quiz-result.good {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }
    
    .quiz-result.average {
        background-color: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
    }
    
    .quiz-result.bad {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
    }
</style>
`);

// Quiz generation function
function generateQuiz() {
    // Get the most recent document content
    let content = '';
    const recentDoc = document.querySessionData?.documents?.length > 0 
        ? document.querySessionData.documents[document.querySessionData.documents.length - 1] 
        : null;
    
    if (recentDoc && recentDoc.id in document_content) {
        content = document_content[recentDoc.id] || '';
    }
    
    if (!content) {
        showToast('Please upload a document first to generate quiz questions.', 'error');
        return;
    }
    
    // Show loading indicator
    showTypingIndicator();
    
    // Generate quiz questions based on document content
    fetch('/api/generate_quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            document_id: recentDoc.id,
            learning_style: currentLearningStyle,
            question_count: 5  // Number of questions to generate
        })
    })
    .then(response => response.json())
    .then(data => {
        hideTypingIndicator();
        
        if (data.success) {
            displayQuiz(data.questions);
        } else {
            showToast(data.error || 'Failed to generate quiz', 'error');
        }
    })
    .catch(error => {
        hideTypingIndicator();
        console.error('Error generating quiz:', error);
        showToast('Failed to generate quiz. Please try again.', 'error');
    });
}

// Display quiz in chat interface
function displayQuiz(questions) {
    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
    
    // Add title based on learning style
    let quizTitle = 'Test Your Knowledge';
    let quizStyle = '';
    
    switch (currentLearningStyle) {
        case 'visual':
            quizTitle = '📊 Visual Learning Quiz';
            quizStyle = 'visual-quiz';
            break;
        case 'auditory':
            quizTitle = '🎧 Auditory Learning Quiz';
            quizStyle = 'auditory-quiz';
            break;
        case 'hands-on':
            quizTitle = '🛠️ Practical Application Quiz';
            quizStyle = 'handson-quiz';
            break;
        case 'reading':
            quizTitle = '📚 Reading Comprehension Quiz';
            quizStyle = 'reading-quiz';
            break;
    }
    
    quizContainer.classList.add(quizStyle);
    
    // Create quiz HTML
    let quizHTML = `
        <div class="quiz-title">${quizTitle}</div>
    `;
    
    questions.forEach((question, index) => {
        quizHTML += `
            <div class="quiz-question" data-question-id="${index}">
                <div class="quiz-question-text">${index + 1}. ${question.question}</div>
                <div class="quiz-options">
        `;
        
        question.options.forEach((option, optIndex) => {
            quizHTML += `
                <div class="quiz-option" data-option-id="${optIndex}">
                    <input type="radio" name="question_${index}" class="quiz-option-radio" id="q${index}_opt${optIndex}">
                    <label for="q${index}_opt${optIndex}">${option}</label>
                </div>
            `;
        });
        
        quizHTML += `
                </div>
            </div>
        `;
    });
    
    quizHTML += `
        <button class="quiz-submit-btn">Submit Answers</button>
        <div class="quiz-result" style="display: none;"></div>
    `;
    
    quizContainer.innerHTML = quizHTML;
    
    // Add to chat messages
    const messageGroup = document.querySelector('.message-group:last-child');
    
    if (messageGroup) {
        const quizMessage = document.createElement('div');
        quizMessage.className = 'message ai';
        quizMessage.innerHTML = '<div class="message-bubble"></div>';
        quizMessage.querySelector('.message-bubble').appendChild(quizContainer);
        messageGroup.appendChild(quizMessage);
        
        // Setup quiz event handlers
        setupQuizEventHandlers(quizContainer, questions);
        
        // Scroll to quiz
        scrollToBottom();
    }
}

// Setup quiz event handlers
function setupQuizEventHandlers(quizContainer, questions) {
    // Option selection
    quizContainer.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            // Find the radio button inside this option
            const radio = this.querySelector('.quiz-option-radio');
            if (radio) {
                radio.checked = true;
                
                // Mark this option as selected
                const questionContainer = this.closest('.quiz-question');
                questionContainer.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
    
    // Submit button
    const submitBtn = quizContainer.querySelector('.quiz-submit-btn');
    submitBtn.addEventListener('click', function() {
        // Check if all questions are answered
        const unanswered = [];
        
        quizContainer.querySelectorAll('.quiz-question').forEach((question, index) => {
            const answered = Array.from(question.querySelectorAll('.quiz-option-radio')).some(radio => radio.checked);
            
            if (!answered) {
                unanswered.push(index + 1);
            }
        });
        
        if (unanswered.length > 0) {
            showToast(`Please answer question${unanswered.length > 1 ? 's' : ''} ${unanswered.join(', ')}`, 'error');
            return;
        }
        
        // Calculate results
        let correctAnswers = 0;
        
        quizContainer.querySelectorAll('.quiz-question').forEach((question, index) => {
            const selectedOption = Array.from(question.querySelectorAll('.quiz-option')).findIndex(
                option => option.querySelector('.quiz-option-radio').checked
            );
            
            // Mark correct/incorrect
            const correctOption = questions[index].correct_answer;
            const options = question.querySelectorAll('.quiz-option');
            
            options.forEach((option, optIndex) => {
                if (optIndex === correctOption) {
                    option.classList.add('correct');
                } else if (optIndex === selectedOption) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedOption === correctOption) {
                correctAnswers++;
            }
        });
        
        // Show results
        const resultElement = quizContainer.querySelector('.quiz-result');
        const percentage = (correctAnswers / questions.length) * 100;
        let resultClass, resultMessage;
        
        if (percentage >= 80) {
            resultClass = 'good';
            resultMessage = 'Great job! You have a solid understanding of the material.';
        } else if (percentage >= 60) {
            resultClass = 'average';
            resultMessage = 'Good effort! You\'re on the right track, but might need to review some concepts.';
        } else {
            resultClass = 'bad';
            resultMessage = 'Keep practicing! Consider reviewing the material again.';
        }
        
        resultElement.innerHTML = `
            <div class="quiz-score">You scored ${correctAnswers}/${questions.length} (${Math.round(percentage)}%)</div>
            <div class="quiz-feedback">${resultMessage}</div>
        `;
        resultElement.className = `quiz-result ${resultClass}`;
        resultElement.style.display = 'block';
        
        // Disable further changes
        submitBtn.disabled = true;
        quizContainer.querySelectorAll('.quiz-option-radio').forEach(radio => {
            radio.disabled = true;
        });
        
        // Adjust quiz styling based on learning style
        if (currentLearningStyle === 'visual') {
            // Add visual feedback for visual learners
            const visualFeedback = document.createElement('div');
            visualFeedback.className = 'visual-flowchart';
            visualFeedback.innerHTML = `
                <div class="flowchart-box" style="background-color: rgba(16, 185, 129, 0.1); border-color: #10b981;">
                    Correct: ${correctAnswers}
                </div>
                <div class="flowchart-arrow">
                    <i class="ri-arrow-down-s-line"></i>
                </div>
                <div class="flowchart-box" style="background-color: rgba(239, 68, 68, 0.1); border-color: #ef4444;">
                    Incorrect: ${questions.length - correctAnswers}
                </div>
                <div class="flowchart-arrow">
                    <i class="ri-arrow-down-s-line"></i>
                </div>
                <div class="flowchart-box" style="background-color: ${
                    percentage >= 80 ? 'rgba(16, 185, 129, 0.1)' : 
                    percentage >= 60 ? 'rgba(245, 158, 11, 0.1)' : 
                    'rgba(239, 68, 68, 0.1)'
                }; border-color: ${
                    percentage >= 80 ? '#10b981' : 
                    percentage >= 60 ? '#f59e0b' : 
                    '#ef4444'
                };">
                    ${
                        percentage >= 80 ? 'Strong Understanding' : 
                        percentage >= 60 ? 'Good Progress' : 
                        'Needs Review'
                    }
                </div>
            `;
            
            resultElement.appendChild(visualFeedback);
        }
        
        scrollToBottom();
    });
}

// Add quiz button event listener
document.addEventListener('DOMContentLoaded', function() {
    const quizButton = document.getElementById('quiz-button');
    if (quizButton) {
        quizButton.addEventListener('click', generateQuiz);
    }
});
// Start the app
initApp();