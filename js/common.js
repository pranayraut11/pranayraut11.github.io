// Common JavaScript functions for all pages

// Helper functions
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function getElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.error(`Required element not found: ${id}`);
    }
    return element;
}

// Dark mode toggle
function setupDarkMode() {
    const themeToggle = getElement('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Check for saved theme preference or respect OS theme settings
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Apply theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    // Theme toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.className = 'fas fa-sun';
            } else {
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.className = 'fas fa-moon';
            }
        });
    }
}

// Copy to clipboard functionality
function setupCopy(buttonId, textSelector, notificationId) {
    const copyBtn = getElement(buttonId);
    const notification = getElement(notificationId);
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textElement = document.querySelector(textSelector);
            if (!textElement) return;
            
            const content = textElement.textContent;
            
            if (content && content !== 'Formatted JSON will appear here' && 
                content !== 'Converted date will appear here' &&
                content !== 'Generated UUID will appear here') {
                
                navigator.clipboard.writeText(content)
                    .then(() => {
                        // Show notification
                        if (notification) {
                            notification.classList.add('show');
                            
                            // Hide notification after 2 seconds
                            setTimeout(() => {
                                notification.classList.remove('show');
                            }, 2000);
                        }
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        alert('Failed to copy to clipboard');
                    });
            }
        });
    }
}

// Navigation setup
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === 'index.html' && !href) || 
            (currentPage === '' && !href)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Initialize all common functionality
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    setupNavigation();
    
    // Set up copy notification if it exists
    if (document.getElementById('copy-notification')) {
        // General copy functionality will be set up in each page as needed
    }
});
