// Get DOM elements
const registrationModal = document.getElementById('registrationModal');
const registrationForm = document.getElementById('registrationForm');
const closeModalBtn = registrationModal.querySelector('.close-modal');
const cancelBtn = registrationModal.querySelector('.cancel-btn');

// Function to show registration modal
function showRegistrationModal() {
    registrationModal.style.display = 'block';
}

// Function to hide registration modal
function hideRegistrationModal() {
    registrationModal.style.display = 'none';
    registrationForm.reset();
}

// Function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to add new user to localStorage
function addNewUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
        id: generateId(),
        name: userData.name,
        username: userData.username,
        email: userData.email,
        profilePic: userData.profilePic || 'https://via.placeholder.com/40',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
}

// Function to check if username is already taken
function isUsernameTaken(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Event Listeners
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const userData = {
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        profilePic: formData.get('profilePic')
    };

    // Validate username
    if (isUsernameTaken(userData.username)) {
        alert('Username is already taken. Please choose another one.');
        return;
    }

    // Add new user
    const newUser = addNewUser(userData);
    
    // Close modal and show success message
    hideRegistrationModal();
    alert('Account created successfully! You can now search for your profile.');
});

// Close modal when clicking close button or cancel button
closeModalBtn.addEventListener('click', hideRegistrationModal);
cancelBtn.addEventListener('click', hideRegistrationModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === registrationModal) {
        hideRegistrationModal();
    }
});

// Add registration button to navigation
const navRight = document.querySelector('.nav-right');
const registerBtn = document.createElement('button');
registerBtn.className = 'register-btn';
registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
registerBtn.onclick = showRegistrationModal;
navRight.insertBefore(registerBtn, navRight.firstChild); 