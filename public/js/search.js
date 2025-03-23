// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { id: 1, name: 'John Doe', username: '@johndoe', profilePic: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Jane Smith', username: '@janesmith', profilePic: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Mike Johnson', username: '@mikej', profilePic: 'https://via.placeholder.com/40' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Get DOM elements
const searchInput = document.querySelector('.search-box input');
const searchResults = document.querySelector('.search-results');
const searchButton = document.querySelector('.search-button');

// Function to create a user result element
function createUserResult(user) {
    return `
        <div class="search-result-item">
            <img src="${user.profilePic}" alt="${user.name}" class="profile-pic">
            <div class="user-info">
                <h4>${user.name}</h4>
                <span>${user.username}</span>
            </div>
        </div>
    `;
}

// Function to filter users based on search query
function filterUsers(query) {
    const users = JSON.parse(localStorage.getItem('users'));
    return users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
}

// Function to display search results
function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No users found</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(user => createUserResult(user)).join('');
    }
    searchResults.style.display = 'block';
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        const results = filterUsers(query);
        displaySearchResults(results);
    } else {
        searchResults.style.display = 'none';
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        const results = filterUsers(query);
        displaySearchResults(results);
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchButton.contains(e.target)) {
        searchResults.style.display = 'none';
    }
}); 