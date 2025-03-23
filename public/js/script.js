// Handle page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        
        // If showing profile page, check if we're viewing another user's profile
        if (pageId === 'profile-page') {
            const viewedProfile = JSON.parse(localStorage.getItem('viewedProfile'));
            if (viewedProfile) {
                // Update profile UI with viewed user's data
                updateProfileUI(viewedProfile);
                
                // Hide edit profile button when viewing another user's profile
                const editProfileBtn = document.getElementById('editProfileBtn');
                if (editProfileBtn) {
                    editProfileBtn.style.display = 'none';
                }
            } else {
                // Show current user's profile
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    updateProfileUI(currentUser);
                    
                    // Show edit profile button for own profile
                    const editProfileBtn = document.getElementById('editProfileBtn');
                    if (editProfileBtn) {
                        editProfileBtn.style.display = 'block';
                    }
                }
            }
        }
    }
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i.fa-search');
    
    // Add click event to search icon
    searchIcon.addEventListener('click', () => {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            showPage('search-results-page');
            // Here you would typically make an API call to fetch search results
            // For now, we'll just show the page
        }
    });

    // Add enter key event to search input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                showPage('search-results-page');
                // Here you would typically make an API call to fetch search results
                // For now, we'll just show the page
            }
        }
    });
}

// Handle menu item clicks
function handleMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            // Add active class to clicked menu item
            item.classList.add('active');
            
            // Hide all page content
            document.querySelectorAll('.page-content').forEach(page => {
                page.style.display = 'none';
            });

            // Show selected page
            const pageId = item.getAttribute('data-page');
            const selectedPage = document.getElementById(`${pageId}-page`);
            if (selectedPage) {
                selectedPage.style.display = 'block';
            }
        });
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleSearch();
    handleMenuItems();
    // Show home page by default
    showPage('home-page');
}); 