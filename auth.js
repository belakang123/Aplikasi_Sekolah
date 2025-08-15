// Authentication System for Sekolah Digital Application

// Prevent caching of authenticated pages
function setupCacheControl() {
    if (!window.location.pathname.includes('login.html')) {
        // Add cache-control meta tags if they don't exist
        if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
            const meta1 = document.createElement('meta');
            meta1.httpEquiv = 'Cache-Control';
            meta1.content = 'no-cache, no-store, must-revalidate';
            document.head.appendChild(meta1);
            
            const meta2 = document.createElement('meta');
            meta2.httpEquiv = 'Pragma';
            meta2.content = 'no-cache';
            document.head.appendChild(meta2);
            
            const meta3 = document.createElement('meta');
            meta3.httpEquiv = 'Expires';
            meta3.content = '0';
            document.head.appendChild(meta3);
        }
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user info
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
}

// Login function
function login(username, password) {
    // In a real application, this would be an API call
    const validUsername = 'admin';
    const validPassword = 'sekolah123';
    
    if (username === validUsername && password === validPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            name: 'Guru Ahmad',
            role: 'guru'
        }));
        return true;
    }
    return false;
}

// Logout function
function logout() {
    // Clear all storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    
    // Force reload and redirect
    window.location.replace('login.html');
    
    // Additional security: clear any potential cached data
    if (window.caches && window.caches.keys) {
        window.caches.keys().then(function(names) {
            names.forEach(function(name) {
                window.caches.delete(name);
            });
        });
    }
}

// Redirect to login if not authenticated
function checkAuth() {
    if (!isLoggedIn()) {
        // Clear any cached data before redirect
        sessionStorage.clear();
        window.location.replace('login.html');
        return false;
    }
    return true;
}

// Update user info in UI
function updateUserInfo() {
    const user = getCurrentUser();
    const userNameElements = document.querySelectorAll('.user-name');
    const greetingElements = document.querySelectorAll('.user-greeting');
    
    userNameElements.forEach(el => {
        el.textContent = user.name || 'Guru Ahmad';
    });
    
    greetingElements.forEach(el => {
        const hour = new Date().getHours();
        let greeting = 'Selamat Malam';
        if (hour < 10) greeting = 'Selamat Pagi';
        else if (hour < 15) greeting = 'Selamat Siang';
        else if (hour < 18) greeting = 'Selamat Sore';
        
        el.textContent = `${greeting}, ${user.name || 'Guru Ahmad'}`;
    });
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check for login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    setupCacheControl();
    checkAuth();
    updateUserInfo();
    
    // Add logout functionality to all logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});

// Handle browser back button and page navigation
window.addEventListener('pageshow', function(event) {
    // Skip for login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    // Check authentication when page is shown (including back navigation)
    if (event.persisted || window.performance && window.performance.navigation.type === 2) {
        // Page was loaded from cache (back button)
        if (!isLoggedIn()) {
            window.location.replace('login.html');
        }
    }
});

// Additional security: check auth on visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && !window.location.pathname.includes('login.html')) {
        checkAuth();
    }
});
