console.log('post.js loaded successfully');

// Post functionality with localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Force reset if localStorage is corrupted
    try {
        const testUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!testUser || !testUser.name || !testUser.username) {
            localStorage.clear();
        }
    } catch (e) {
        localStorage.clear();
    }
    
    // Initialize default user if not exists
    initializeDefaultUser();
    
    // Load existing posts when page loads
    loadPosts();
    
    // Load saved profile data
    loadProfileData();
    
    // Initialize Edit Profile functionality
    initializeEditProfile();
    
    // Initialize Report functionality
    initializeReportFunctionality();
    
    // Get all post buttons
    const postButtons = document.querySelectorAll('.post-btn');
    
    postButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the input and container
            const container = this.closest('.post-input-container');
            const input = container.querySelector('input[type="text"]');
            const content = input.value.trim();
            
            if (content) {
                // Get current user data for the post
                const currentUser = getCurrentUser();
                
                // Create post data
                const postData = {
                    id: Date.now(),
                    content: content,
                    timestamp: new Date().toISOString(),
                    author: {
                        name: currentUser.name,
                        username: currentUser.username,
                        avatar: currentUser.avatar
                    }
                };
                
                // Save to localStorage
                savePost(postData);
                
                // Create and add the post element
                const post = createPostElement(postData);
                
                // Find where to add the post
                const feed = this.closest('.page-content').querySelector('.main-feed');
                if (feed) {
                    // Add the post after the create-post div
                    const createPostDiv = feed.querySelector('.create-post');
                    feed.insertBefore(post, createPostDiv.nextSibling);
                    
                    // Clear the input
                    input.value = '';
                }
            }
        });
    });
});

// Function to get current user with validation
function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || !user.name || !user.username) {
            throw new Error('Invalid user data');
        }
        // Ensure avatar exists and is a valid data URL
        if (!user.avatar || !user.avatar.startsWith('data:image')) {
            user.avatar = 'https://via.placeholder.com/40';
        }
        return user;
    } catch (e) {
        // Reset to default if invalid
        const defaultUser = {
            name: 'Your Name',
            username: '@username',
            bio: 'Software Developer | Coffee Lover | Tech Enthusiast',
            avatar: 'https://via.placeholder.com/40'
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        return defaultUser;
    }
}

// Function to initialize default user
function initializeDefaultUser() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.name || !currentUser.username) {
            throw new Error('Invalid user data');
        }
    } catch (e) {
        const defaultUser = {
            name: 'Your Name',
            username: '@username',
            bio: 'Software Developer | Coffee Lover | Tech Enthusiast',
            avatar: 'https://via.placeholder.com/40'
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }
}

// Function to load saved profile data
function loadProfileData() {
    const savedUser = getCurrentUser();
    
    // Update profile card picture
    const profileCardPic = document.querySelector('.profile-card .profile-pic-large');
    if (profileCardPic && savedUser.avatar) {
        profileCardPic.src = savedUser.avatar;
    }
    
    // Update nav profile picture
    const navProfilePic = document.querySelector('.nav-right .profile-pic');
    if (navProfilePic && savedUser.avatar) {
        navProfilePic.src = savedUser.avatar;
    }
    
    // Update profile header picture
    const profileHeaderPic = document.querySelector('.profile-picture-large img');
    if (profileHeaderPic && savedUser.avatar) {
        profileHeaderPic.src = savedUser.avatar;
    }
    
    // Update profile card
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        const nameElement = profileCard.querySelector('h2');
        const usernameElement = profileCard.querySelector('p');
        if (nameElement) nameElement.textContent = savedUser.name;
        if (usernameElement) usernameElement.textContent = savedUser.username;
    }
    
    // Update profile header
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
        const nameElement = profileHeader.querySelector('h1');
        const usernameElement = profileHeader.querySelector('.username');
        const bioElement = profileHeader.querySelector('.bio');
        const coverPhotoElement = profileHeader.querySelector('.profile-cover img');
        
        if (nameElement) nameElement.textContent = savedUser.name;
        if (usernameElement) usernameElement.textContent = savedUser.username;
        if (bioElement) bioElement.textContent = savedUser.bio || '';
        if (coverPhotoElement && savedUser.coverPhoto) {
            coverPhotoElement.src = savedUser.coverPhoto;
        }
    }
}

// Function to initialize Edit Profile functionality
function initializeEditProfile() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = editProfileModal.querySelector('.close-modal');
    const cancelBtn = editProfileModal.querySelector('.cancel-btn');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Load current profile data
    const currentUser = getCurrentUser();
    
    // Populate form with current data
    editProfileForm.querySelector('#profileName').value = currentUser.name;
    editProfileForm.querySelector('#profileUsername').value = currentUser.username;
    editProfileForm.querySelector('#profileBio').value = currentUser.bio || '';
    
    // Open modal
    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'block';
    });
    
    // Close modal functions
    function closeModal() {
        editProfileModal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            closeModal();
        }
    });
    
    // Handle form submission
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const newName = editProfileForm.querySelector('#profileName').value;
        const newUsername = editProfileForm.querySelector('#profileUsername').value;
        const newBio = editProfileForm.querySelector('#profileBio').value;
        
        // Handle profile picture upload
        const profilePictureInput = editProfileForm.querySelector('#profilePicture');
        const coverPhotoInput = editProfileForm.querySelector('#coverPhoto');
        
        // Update profile data
        const updatedUser = {
            ...currentUser,
            name: newName,
            username: newUsername,
            bio: newBio
        };
        
        // Handle profile picture
        if (profilePictureInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatedUser.avatar = e.target.result;
                // Save to localStorage immediately after reading the file
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                updateProfileUI(updatedUser);
            };
            reader.readAsDataURL(profilePictureInput.files[0]);
        } else {
            // If no new profile picture, keep the existing one
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            updateProfileUI(updatedUser);
        }
        
        // Handle cover photo
        if (coverPhotoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatedUser.coverPhoto = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                updateProfileUI(updatedUser);
            };
            reader.readAsDataURL(coverPhotoInput.files[0]);
        }
        
        // Close modal
        closeModal();
    });
}

// Function to update profile UI
function updateProfileUI(userData) {
    // Update profile card picture
    const profileCardPic = document.querySelector('.profile-card .profile-pic-large');
    if (profileCardPic) {
        profileCardPic.src = userData.avatar;
    }
    
    // Update nav profile picture
    const navProfilePic = document.querySelector('.nav-right .profile-pic');
    if (navProfilePic) {
        navProfilePic.src = userData.avatar;
    }
    
    // Update profile header picture
    const profileHeaderPic = document.querySelector('.profile-picture-large img');
    if (profileHeaderPic) {
        profileHeaderPic.src = userData.avatar;
    }
    
    // Update profile card
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        const nameElement = profileCard.querySelector('h2');
        const usernameElement = profileCard.querySelector('p');
        if (nameElement) nameElement.textContent = userData.name;
        if (usernameElement) usernameElement.textContent = userData.username;
    }
    
    // Update profile header
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
        const nameElement = profileHeader.querySelector('h1');
        const usernameElement = profileHeader.querySelector('.username');
        const bioElement = profileHeader.querySelector('.bio');
        const coverPhotoElement = profileHeader.querySelector('.profile-cover img');
        
        if (nameElement) nameElement.textContent = userData.name;
        if (usernameElement) usernameElement.textContent = userData.username;
        if (bioElement) bioElement.textContent = userData.bio || '';
        if (coverPhotoElement && userData.coverPhoto) {
            coverPhotoElement.src = userData.coverPhoto;
        }
    }
}

// Function to save a post to localStorage
function savePost(post) {
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift(post); // Add new post to the beginning
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Function to load posts from localStorage
function loadPosts() {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const currentUser = getCurrentUser();
        
        // Validate and clean posts data
        const validPosts = posts.filter(post => {
            return post && post.id && post.content && post.timestamp;
        });
        
        // Load posts into home feed
        const homeFeed = document.querySelector('#home-page .main-feed');
        if (homeFeed) {
            const createPostDiv = homeFeed.querySelector('.create-post');
            // Clear existing posts first
            const existingPosts = homeFeed.querySelectorAll('.post');
            existingPosts.forEach(post => post.remove());
            
            // Add all posts from localStorage
            validPosts.forEach(post => {
                // Ensure post has valid author data
                if (!post.author || !post.author.name || !post.author.username) {
                    post.author = {
                        name: currentUser.name,
                        username: currentUser.username,
                        avatar: currentUser.avatar
                    };
                }
                const postElement = createPostElement(post);
                homeFeed.insertBefore(postElement, createPostDiv.nextSibling);
            });
        }
    } catch (e) {
        console.error('Error loading posts:', e);
        localStorage.removeItem('posts');
    }
}

// Function to create a post element
function createPostElement(postData) {
    const post = document.createElement('div');
    post.className = 'post';
    post.dataset.postId = postData.id;
    
    const timestamp = formatTimestamp(new Date(postData.timestamp));
    
    // Ensure we have valid author data
    const author = postData.author || getCurrentUser();
    
    post.innerHTML = `
        <div class="post-header">
            <img src="${author.avatar}" alt="Profile" class="profile-pic" style="cursor: pointer;">
            <div class="post-info">
                <h3>${author.name || 'Anonymous User'}</h3>
                <span class="username">${author.username || '@anonymous'}</span>
                <span class="post-time">${timestamp}</span>
            </div>
        </div>
        <div class="post-content">${postData.content}</div>
        <div class="post-actions">
            <button class="action-btn">
                <i class="fas fa-thumbs-up"></i>
                <span>Like</span>
            </button>
            <button class="action-btn">
                <i class="fas fa-comment"></i>
                <span>Comment</span>
            </button>
            <button class="action-btn">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </button>
            <button class="action-btn report-btn" data-post-id="${postData.id}">
                <i class="fas fa-flag"></i>
                <span>Report</span>
            </button>
        </div>
    `;
    
    // Add click event listener to profile picture
    const profilePic = post.querySelector('.profile-pic');
    profilePic.addEventListener('click', () => {
        // Store the clicked user's data in localStorage
        localStorage.setItem('viewedProfile', JSON.stringify(author));
        // Show the profile page
        showPage('profile-page');
    });
    
    return post;
}

// Function to format timestamp
function formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    }
    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}d ago`;
    }
    // Otherwise, show the date
    return date.toLocaleDateString();
}

// Function to initialize report functionality
function initializeReportFunctionality() {
    const reportModal = document.getElementById('reportModal');
    const reportForm = document.getElementById('reportForm');
    
    // Handle report button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.report-btn')) {
            const reportBtn = e.target.closest('.report-btn');
            const postId = reportBtn.dataset.postId;
            reportModal.style.display = 'block';
            reportForm.dataset.postId = postId;
        }
    });
    
    // Handle modal close
    const closeBtn = reportModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        reportModal.style.display = 'none';
    });
    
    // Handle cancel button
    const cancelBtn = reportModal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        reportModal.style.display = 'none';
    });
    
    // Handle form submission
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postId = this.dataset.postId;
        const reason = document.getElementById('reportReason').value;
        const details = document.getElementById('reportDetails').value;
        
        // Get current user
        const currentUser = getCurrentUser();
        
        // Create report data
        const reportData = {
            postId: postId,
            reason: reason,
            details: details,
            reporter: {
                name: currentUser.name,
                username: currentUser.username
            },
            timestamp: new Date().toISOString()
        };
        
        // Save report to localStorage
        saveReport(reportData);
        
        // Show success message
        alert('Thank you for your report. We will review it shortly.');
        
        // Close modal and reset form
        reportModal.style.display = 'none';
        reportForm.reset();
    });
}

// Function to save a report to localStorage
function saveReport(report) {
    let reports = JSON.parse(localStorage.getItem('reports') || '[]');
    reports.push(report);
    localStorage.setItem('reports', JSON.stringify(reports));
} 