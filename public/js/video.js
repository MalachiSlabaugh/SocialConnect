// Video sharing functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const videoGrid = document.getElementById('videoGrid');
    const uploadVideoBtn = document.getElementById('uploadVideoBtn');
    const uploadVideoModal = document.getElementById('uploadVideoModal');
    const uploadVideoForm = document.getElementById('uploadVideoForm');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoInput = document.getElementById('videoInput');
    const videoPreview = document.getElementById('videoPreview');
    const filterBtns = document.querySelectorAll('.video-filters .filter-btn');
    const tabBtns = document.querySelectorAll('.video-tabs .tab-btn');
    const uploadFromEmptyBtn = document.getElementById('uploadFromEmptyBtn');

    // Sample video data (replace with actual data from backend)
    let videos = {
        all: [
            {
                id: 1,
                title: 'Welcome to SocialConnect',
                thumbnail: 'https://source.unsplash.com/random/800x450?technology',
                duration: '2:30',
                views: 1234,
                uploadDate: '2024-03-20',
                author: {
                    name: 'SocialConnect Team',
                    avatar: 'https://via.placeholder.com/40'
                }
            }
        ],
        my: [],
        following: []
    };

    // Initialize video tabs
    function initializeVideoTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked tab
                btn.classList.add('active');

                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Show selected tab content
                const tabId = btn.getAttribute('data-tab');
                const selectedContent = document.getElementById(tabId);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }

                // Update video grid based on selected tab
                updateVideoGrid(tabId);
            });
        });
    }

    // Update video grid based on selected tab
    function updateVideoGrid(tabId) {
        const gridId = `${tabId}Grid`;
        const grid = document.getElementById(gridId);
        const emptyStateId = `${tabId}Empty`;
        const emptyState = document.getElementById(emptyStateId);
        
        if (!grid) return;

        // Clear existing content
        grid.innerHTML = '';

        // Get videos for the selected tab
        const videoType = tabId.split('-')[0]; // 'all', 'my', or 'following'
        const videosToShow = videos[videoType];

        if (videosToShow.length === 0) {
            // Show empty state
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            if (grid) {
                grid.style.display = 'none';
            }
        } else {
            // Hide empty state
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            if (grid) {
                grid.style.display = 'grid';
            }
            // Render videos
            videosToShow.forEach(video => {
                const videoElement = createVideoElement(video);
                grid.appendChild(videoElement);
            });
        }
    }

    // Initialize video grid
    function initializeVideoGrid() {
        // Initialize all tabs
        updateVideoGrid('all-videos');
        updateVideoGrid('my-videos');
        updateVideoGrid('following-videos');
    }

    // Create video element
    function createVideoElement(video) {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-meta">
                    <span>${video.views} views</span>
                    <span>•</span>
                    <span>${formatDate(video.uploadDate)}</span>
                </div>
            </div>
        `;
        div.addEventListener('click', () => openVideoPlayer(video));
        return div;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Open video player modal
    function openVideoPlayer(video) {
        const modal = document.getElementById('videoPlayerModal');
        const title = document.getElementById('videoPlayerTitle');
        const player = document.getElementById('videoPlayer');
        const views = modal.querySelector('.views');
        const uploadDate = modal.querySelector('.upload-date');
        const description = modal.querySelector('.video-description');

        title.textContent = video.title;
        player.src = video.thumbnail; // Replace with actual video URL
        views.textContent = `${video.views} views`;
        uploadDate.textContent = formatDate(video.uploadDate);
        description.textContent = video.description || 'No description available';

        modal.style.display = 'block';
    }

    // Handle video upload
    uploadVideoBtn.addEventListener('click', () => {
        uploadVideoModal.style.display = 'block';
    });

    // Handle upload from empty state
    uploadFromEmptyBtn.addEventListener('click', () => {
        uploadVideoModal.style.display = 'block';
    });

    // Preview video before upload
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            videoPreview.innerHTML = '';
            videoPreview.appendChild(video);
        }
    });

    // Handle video upload form submission
    uploadVideoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically handle the video upload to your backend
        // For now, we'll just add it to the sample data
        const newVideo = {
            id: videos.my.length + 1,
            title: document.getElementById('videoTitle').value,
            thumbnail: URL.createObjectURL(videoInput.files[0]),
            duration: '0:00', // You would calculate this from the actual video
            views: 0,
            uploadDate: new Date().toISOString(),
            author: {
                name: 'Your Name',
                avatar: 'https://via.placeholder.com/40'
            }
        };
        
        videos.my.push(newVideo);
        videos.all.push(newVideo);
        
        // Update the video grids
        updateVideoGrid('my-videos');
        updateVideoGrid('all-videos');
        
        // Close modal and reset form
        uploadVideoModal.style.display = 'none';
        uploadVideoForm.reset();
        videoPreview.innerHTML = '';
    });

    // Handle video filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const activeTab = document.querySelector('.video-tabs .tab-btn.active');
            const tabId = activeTab.getAttribute('data-tab');
            
            // Here you would typically filter the videos based on the selected filter
            // For now, we'll just update the display
            updateVideoGrid(tabId);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === uploadVideoModal) {
            uploadVideoModal.style.display = 'none';
        }
        if (e.target === videoPlayerModal) {
            videoPlayerModal.style.display = 'none';
        }
    });

    // Close modals when clicking close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            uploadVideoModal.style.display = 'none';
            videoPlayerModal.style.display = 'none';
        });
    });

    // Initialize everything
    initializeVideoTabs();
    initializeVideoGrid();
}); 