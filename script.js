// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page-content');
    const menuItems = document.querySelectorAll('.menu-item');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const rightSidebar = document.querySelector('.right-sidebar');

    // Initialize current user if not exists
    initializeCurrentUser();

    // Navigation between pages
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding page
            const pageId = item.getAttribute('data-page');
            pages.forEach(page => {
                if (page.id === `${pageId}-page` || (pageId === 'videos' && page.id === 'video-page')) {
                    page.style.display = 'block';
                    if (pageId === 'videos') {
                        page.classList.add('active');
                    }
                } else {
                    page.style.display = 'none';
                    page.classList.remove('active');
                }
            });

            // Hide right sidebar on specific pages
            if (['notifications', 'messages', 'settings'].includes(pageId)) {
                rightSidebar.style.display = 'none';
            } else {
                rightSidebar.style.display = 'block';
            }

            // Update profile information if on profile page
            if (pageId === 'profile') {
                updateProfileInfo();
            }

            // Load notifications if on notifications page
            if (pageId === 'notifications') {
                loadNotifications();
            }

            // Load messages if on messages page
            if (pageId === 'messages') {
                loadMessages();
            }
        });
    });

    // Notification filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter notifications
            const filterType = button.getAttribute('data-filter');
            notificationItems.forEach(item => {
                if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Messages functionality
    const messageInput = document.querySelector('.message-input input');
    const sendButton = document.querySelector('.send-btn');
    const messagesList = document.querySelector('.messages-list');
    const conversationsList = document.querySelector('.conversations-list');
    const newMessageBtn = document.querySelector('.new-message-btn');
    const messagesSearchInput = document.querySelector('.messages-search input');

    // Initialize with empty conversations
    let conversations = {};

    // Load conversations from localStorage
    function loadConversations() {
        const savedConversations = localStorage.getItem('conversations');
        if (savedConversations) {
            conversations = JSON.parse(savedConversations);
            updateConversationsList();
        }
    }

    // Save conversations to localStorage
    function saveConversations() {
        localStorage.setItem('conversations', JSON.stringify(conversations));
    }

    // Update conversations list
    function updateConversationsList() {
        if (Object.keys(conversations).length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No Messages Yet</h3>
                    <p>Start a conversation to see your messages here</p>
                </div>
            `;
        }
    }

    // Handle conversation selection
    function attachConversationListeners() {
        const conversationItems = document.querySelectorAll('.conversation-item');
        conversationItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active conversation
                conversationItems.forEach(conv => conv.classList.remove('active'));
                item.classList.add('active');

                // Get conversation ID
                const conversationId = item.getAttribute('data-conversation');
                
                // Update chat header with selected user
                const conversation = conversations[conversationId];
                updateChatHeader(conversation.name, conversation.image);
                
                // Render messages for selected conversation
                renderMessages(conversationId);
            });
        });
    }

    // Update chat header
    function updateChatHeader(userName, userImage) {
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.innerHTML = `
            <div class="chat-user-info">
                <img src="${userImage}" alt="Profile" class="profile-pic">
                <div>
                    <h3>${userName}</h3>
                    <span class="status">Online</span>
                </div>
            </div>
            <div class="chat-actions">
                <i class="fas fa-phone"></i>
                <i class="fas fa-video"></i>
            </div>
        `;
    }

    // Handle new message button
    newMessageBtn.addEventListener('click', () => {
        alert('New message functionality coming soon!');
    });

    // Load conversations and initialize messages
    loadConversations();
    renderMessages();

    // Profile tabs navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show corresponding tab content
            const tabId = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Initialize theme
    initializeTheme();

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const searchResultsPage = document.getElementById('search-results-page');
    const searchResultsList = document.querySelector('.search-results-list');
    const searchFilterButtons = document.querySelectorAll('.search-filters .filter-btn');
    let currentSearchQuery = '';
    let currentFilter = 'all';

    // Handle search button click
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            currentSearchQuery = query;
            performSearch(query, currentFilter);
            showSearchResultsPage();
        }
    });

    // Handle Enter key in search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                currentSearchQuery = query;
                performSearch(query, currentFilter);
                showSearchResultsPage();
            }
        }
    });

    // Show search results page
    function showSearchResultsPage() {
        // Hide all other pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        // Show search results page
        searchResultsPage.style.display = 'block';
        // Update search header
        searchResultsPage.querySelector('.search-header h2').textContent = `Search Results for "${currentSearchQuery}"`;
    }

    // Handle filter button clicks
    searchFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            searchFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current filter and perform search
            currentFilter = button.dataset.filter;
            performSearch(currentSearchQuery, currentFilter);
        });
    });

    // Initialize users array from localStorage or with default users
    let users = JSON.parse(localStorage.getItem('users')) || [
        {
            id: 1,
            name: 'John Doe',
            username: '@johndoe',
            profilePic: 'https://source.unsplash.com/random/150x150?portrait'
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: '@janesmith',
            profilePic: 'https://source.unsplash.com/random/150x150?woman'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            username: '@mikejohnson',
            profilePic: 'https://source.unsplash.com/random/150x150?man'
        }
    ];

    // Save users to localStorage
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize notification filters
    initializeNotificationFilters();

    // Initialize message functionality
    initializeMessageFunctionality();
});

// Function to initialize current user
function initializeCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            const name = profileCard.querySelector('h2')?.textContent || 'Anonymous User';
            const username = profileCard.querySelector('p')?.textContent || '@anonymous';
            const avatar = profileCard.querySelector('.profile-pic-large')?.src || 'https://via.placeholder.com/40';
            
            localStorage.setItem('currentUser', JSON.stringify({
                name: name,
                username: username,
                avatar: avatar
            }));
        }
    }
}

// Function to update profile information
function updateProfileInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Update profile card
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.querySelector('h2').textContent = currentUser.name;
            profileCard.querySelector('p').textContent = currentUser.username;
            profileCard.querySelector('.profile-pic-large').src = currentUser.avatar;
        }

        // Update profile header
        const profileHeader = document.querySelector('.profile-info');
        if (profileHeader) {
            profileHeader.querySelector('h1').textContent = currentUser.name;
            profileHeader.querySelector('.username').textContent = currentUser.username;
        }
    }
}

// Function to initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Add event listeners to theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    console.log('Found theme buttons:', themeButtons.length); // Debug log
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Theme button clicked:', this.dataset.theme); // Debug log
            const theme = this.dataset.theme;
            applyTheme(theme);
            
            // Update active states
            themeButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Set initial active state
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
}

// Function to apply theme
function applyTheme(theme) {
    console.log('Applying theme:', theme); // Debug log
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme classes
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
}

// Function to initialize notification filters
function initializeNotificationFilters() {
    const filterButtons = document.querySelectorAll('.notification-filters .filter-btn');
    const notificationsList = document.querySelector('.notifications-list');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter notifications
            const filterType = button.getAttribute('data-filter');
            const notificationItems = notificationsList.querySelectorAll('.notification-item');
            
            notificationItems.forEach(item => {
                if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Function to load notifications
function loadNotifications() {
    const notificationsList = document.querySelector('.notifications-list');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Clear existing notifications
    notificationsList.innerHTML = '';

    // Create notifications from posts
    posts.forEach(post => {
        if (post.author.username !== currentUser.username) {
            const notification = createNotificationElement(post);
            notificationsList.appendChild(notification);
        }
    });

    // Show empty state if no notifications
    if (notificationsList.children.length === 0) {
        notificationsList.innerHTML = `
            <div class="notification-item" data-type="empty">
                <img src="https://via.placeholder.com/40" alt="Profile" class="profile-pic">
                <div class="notification-content">
                    <p>No notifications yet</p>
                    <span class="notification-time">When someone interacts with your posts, you'll see it here</span>
                </div>
            </div>
        `;
    }
}

// Function to create notification element
function createNotificationElement(post) {
    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.setAttribute('data-type', 'post');

    const timestamp = formatTimestamp(new Date(post.timestamp));

    notification.innerHTML = `
        <img src="${post.author.avatar}" alt="Profile" class="profile-pic">
        <div class="notification-content">
            <p><strong>${post.author.name}</strong> created a new post</p>
            <span class="notification-time">${timestamp}</span>
        </div>
    `;

    return notification;
}

// Function to format timestamp
function formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
}

// Function to initialize message functionality
function initializeMessageFunctionality() {
    const messageInput = document.querySelector('.message-input input');
    const sendButton = document.querySelector('.send-btn');
    const messagesList = document.querySelector('.messages-list');
    const conversationsList = document.querySelector('.conversations-list');
    const newMessageBtn = document.querySelector('.new-message-btn');
    const messagesSearchInput = document.querySelector('.messages-search input');

    // Initialize with empty conversations
    let conversations = JSON.parse(localStorage.getItem('conversations') || '{}');

    // Handle messages search
    messagesSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query === '') {
            updateConversationsList();
            return;
        }

        // Get all users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Filter users based on search query
        const filteredUsers = users.filter(user => 
            user.id !== currentUser.id && // Exclude current user
            (user.name.toLowerCase().includes(query) || 
             user.username.toLowerCase().includes(query))
        );

        // Update conversations list with search results
        if (filteredUsers.length > 0) {
            conversationsList.innerHTML = '';
            filteredUsers.forEach(user => {
                const userElement = document.createElement('div');
                userElement.className = 'conversation-item';
                userElement.innerHTML = `
                    <img src="${user.profilePic}" alt="Profile" class="profile-pic">
                    <div class="conversation-info">
                        <h4>${user.name}</h4>
                        <p class="last-message">${user.username}</p>
                    </div>
                `;

                // Add click handler to start conversation
                userElement.addEventListener('click', () => {
                    startNewConversation(user);
                });

                conversationsList.appendChild(userElement);
            });
        } else {
            conversationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Users Found</h3>
                    <p>Try searching with a different name or username</p>
                </div>
            `;
        }
    });

    // Function to start a new conversation
    function startNewConversation(user) {
        const conversationId = `conv_${Date.now()}`;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Create new conversation
        conversations[conversationId] = {
            id: conversationId,
            name: user.name,
            image: user.profilePic,
            participants: [currentUser.id, user.id],
            messages: [],
            lastMessage: 'New conversation',
            lastMessageTime: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('conversations', JSON.stringify(conversations));

        // Update UI
        updateConversationsList();
        
        // Select the new conversation
        const conversationElement = document.querySelector(`[data-conversation-id="${conversationId}"]`);
        if (conversationElement) {
            conversationElement.click();
        }

        // Clear search input
        messagesSearchInput.value = '';
    }

    // Load conversations from localStorage
    function loadConversations() {
        updateConversationsList();
    }

    // Update conversations list
    function updateConversationsList() {
        if (Object.keys(conversations).length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No Messages Yet</h3>
                    <p>Start a conversation to see your messages here</p>
                </div>
            `;
        } else {
            conversationsList.innerHTML = '';
            Object.entries(conversations).forEach(([id, conversation]) => {
                const conversationElement = createConversationElement(id, conversation);
                conversationsList.appendChild(conversationElement);
            });
        }
    }

    // Create conversation element
    function createConversationElement(id, conversation) {
        const element = document.createElement('div');
        element.className = 'conversation-item';
        element.dataset.conversationId = id;
        element.innerHTML = `
            <img src="${conversation.image}" alt="Profile" class="profile-pic">
            <div class="conversation-info">
                <h4>${conversation.name}</h4>
                <p class="last-message">${conversation.lastMessage || 'No messages yet'}</p>
            </div>
            <span class="conversation-time">${formatTimestamp(new Date(conversation.lastMessageTime))}</span>
        `;
        return element;
    }

    // Handle conversation selection
    function attachConversationListeners() {
        const conversationItems = document.querySelectorAll('.conversation-item');
        conversationItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active conversation
                conversationItems.forEach(conv => conv.classList.remove('active'));
                item.classList.add('active');

                // Get conversation ID
                const conversationId = item.getAttribute('data-conversation-id');
                
                // Update chat header with selected user
                const conversation = conversations[conversationId];
                updateChatHeader(conversation.name, conversation.image);
                
                // Render messages for selected conversation
                renderMessages(conversationId);
            });
        });
    }

    // Update chat header
    function updateChatHeader(userName, userImage) {
        const chatHeader = document.querySelector('.chat-header');
        chatHeader.innerHTML = `
            <div class="chat-user-info">
                <img src="${userImage}" alt="Profile" class="profile-pic">
                <div>
                    <h3>${userName}</h3>
                    <span class="status">Online</span>
                </div>
            </div>
            <div class="chat-actions">
                <i class="fas fa-phone"></i>
                <i class="fas fa-video"></i>
            </div>
        `;
    }

    // Render messages for a conversation
    function renderMessages(conversationId) {
        const conversation = conversations[conversationId];
        if (!conversation) return;

        const messagesList = document.querySelector('.messages-list');
        messagesList.innerHTML = '';

        if (conversation.messages && conversation.messages.length > 0) {
            conversation.messages.forEach(message => {
                const messageElement = createMessageElement(message);
                messagesList.appendChild(messageElement);
            });
        } else {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No Messages Yet</h3>
                    <p>Start a conversation to begin messaging</p>
                </div>
            `;
        }
    }

    // Create message element
    function createMessageElement(message) {
        const element = document.createElement('div');
        element.className = `message ${message.senderId === 'currentUser' ? 'sent' : 'received'}`;
        element.innerHTML = `
            <div class="message-content">
                <p>${message.content}</p>
                <span class="message-time">${formatTimestamp(new Date(message.timestamp))}</span>
            </div>
        `;
        return element;
    }

    // Handle new message button
    newMessageBtn.addEventListener('click', () => {
        alert('New message functionality coming soon!');
    });

    // Handle send message
    if (sendButton && messageInput) {
        sendButton.addEventListener('click', () => {
            const content = messageInput.value.trim();
            if (!content) return;

            const activeConversation = document.querySelector('.conversation-item.active');
            if (!activeConversation) {
                alert('Please select a conversation first');
                return;
            }

            const conversationId = activeConversation.dataset.conversationId;
            const conversation = conversations[conversationId];

            // Add new message
            const newMessage = {
                content: content,
                timestamp: new Date().toISOString(),
                senderId: 'currentUser'
            };

            if (!conversation.messages) {
                conversation.messages = [];
            }
            conversation.messages.push(newMessage);
            conversation.lastMessage = content;
            conversation.lastMessageTime = new Date().toISOString();

            // Save to localStorage
            localStorage.setItem('conversations', JSON.stringify(conversations));

            // Update UI
            renderMessages(conversationId);
            updateConversationsList();
            messageInput.value = '';
        });
    }

    // Load conversations and initialize messages
    loadConversations();
    attachConversationListeners();
}

/* Theme-specific styles */
:root[data-theme="light"] {
    --bg-color: #ffffff;
    --text-color: #333333;
    --primary-color: #1a73e8;
    --secondary-bg: #f5f5f5;
    --border-color: #e0e0e0;
}

:root[data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --primary-color: #4a9eff;
    --secondary-bg: #2d2d2d;
    --border-color: #404040;
}

/* Theme button styles */
.theme-btn {
    padding: 10px 20px;
    margin: 5px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--secondary-bg);
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.theme-btn:hover {
    background-color: var(--primary-color);
    color: white;
}

.theme-btn.active {
    background-color: var(--primary-color);
    color: white;
}

/* Apply theme variables */
body {
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
} 