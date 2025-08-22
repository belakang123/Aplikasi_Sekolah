// Advanced Security System for Sekolah Digital Application
// This module provides enhanced security features for the login system

class SecurityManager {
    constructor() {
        this.baseLockoutDuration = 2 * 60 * 1000; // 2 minutes base duration
        this.maxLockoutDuration = 30 * 60 * 1000; // 30 minutes maximum
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        this.setupRateLimiting();
        this.setupSessionManagement();
        this.setupCSRFProtection();
        this.setupInputValidation();
    }

    // Rate limiting to prevent brute force attacks
    setupRateLimiting() {
        if (!localStorage.getItem('loginAttempts')) {
            localStorage.setItem('loginAttempts', JSON.stringify({}));
        }
    }

    checkRateLimit(identifier) {
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
        const userAttempts = attempts[identifier] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
        
        const now = Date.now();
        
        // Check if user is locked out
        if (userAttempts.lockedUntil > now) {
            const remainingTime = Math.ceil((userAttempts.lockedUntil - now) / 1000);
            throw new Error(`Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} detik.`);
        }
        
        // Reset attempts after lockout period
        if (now - userAttempts.lastAttempt > this.lockoutDuration) {
            userAttempts.count = 0;
        }
        
        return userAttempts;
    }

    recordAttempt(identifier, success = false) {
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
        const userAttempts = attempts[identifier] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
        
        if (success) {
            // Reset on successful login
            delete attempts[identifier];
        } else {
            userAttempts.count++;
            userAttempts.lastAttempt = Date.now();
            
            if (userAttempts.count >= this.maxAttempts) {
                userAttempts.lockedUntil = Date.now() + this.lockoutDuration;
            }
            
            attempts[identifier] = userAttempts;
        }
        
        localStorage.setItem('loginAttempts', JSON.stringify(attempts));
    }

    // Session management
    setupSessionManagement() {
        // Check for existing session
        this.checkSession();
        
        // Set up session timeout
        this.setupSessionTimeout();
    }

    checkSession() {
        const session = localStorage.getItem('sessionToken');
        if (session) {
            // Validate session with server
            this.validateSession(session);
        }
    }

    setupSessionTimeout() {
        let timeout;
        
        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.logout();
            }, this.sessionTimeout);
        };
        
        // Reset timeout on user activity
        ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimeout);
        });
        
        resetTimeout();
    }

    validateSession(token) {
        // In a real implementation, this would validate with server
        return true;
    }

    // CSRF protection
    setupCSRFProtection() {
        if (!localStorage.getItem('csrfToken')) {
            localStorage.setItem('csrfToken', this.generateCSRFToken());
        }
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    getCSRFToken() {
        return localStorage.getItem('csrfToken');
    }

    validateCSRFToken(token) {
        return token === this.getCSRFToken();
    }

    // Input validation
    setupInputValidation() {
        // Add input sanitization
        this.sanitizeInput = (input) => {
            return input.replace(/[<>]/g, '').trim();
        };
    }

    // Security headers
    setupSecurityHeaders() {
        // Add security headers meta tags
        const metaTags = [
            { name: 'X-Content-Type-Options', content: 'nosniff' },
            { name: 'X-Frame-Options', content: 'DENY' },
            { name: 'X-XSS-Protection', content: '1; mode=block' }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            meta.httpEquiv = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        });
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 0;
        if (password.length >= minLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChar) strength++;

        return strength >= 3 ? 'strong' : strength >= 2 ? 'medium' : 'weak';
    }

    // Logout function
    logout() {
        // Clear all sensitive data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('csrfToken');
        sessionStorage.clear();
        
        // Force reload and redirect
        window.location.replace('login.html');
    }

    // Initialize security on page load
    initialize() {
        this.setupSecurityHeaders();
        this.setupSessionManagement();
        
        // Add event listeners for security
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSecurityHeaders();
            
            // Check for existing session
            if (!window.location.pathname.includes('login.html')) {
                this.checkSession();
            }
        });
    }
}

// Initialize security manager
const securityManager = new SecurityManager();
securityManager.initialize();

// Export for use in other modules
window.SecurityManager = SecurityManager;
