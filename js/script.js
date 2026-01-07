// ==================== CAFÉ FOCUS OPTIMIZED SCRIPT ====================
(function immediateAuthCheck() {
    // Danh sách trang không cần đăng nhập
    const publicPages = [
        'login.html',
        'forgot-password.html',
        'register.html',
        'reviews.html',
        'index.html',
        'about.html',
        'services.html',
        '' // trang chủ
    ];
    
    // Lấy tên trang hiện tại
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    let currentPage = segments[segments.length - 1] || 'index.html';
    
    // Xóa query parameters và hash
    currentPage = currentPage.split('?')[0].split('#')[0];
    
    console.log('🔐 AUTH CHECK:');
    console.log('📄 Current page:', currentPage);
    console.log('📍 Full path:', currentPath);
    
    // Kiểm tra đơn giản nếu là trang public
    const isPublicPage = publicPages.some(page => 
        currentPage === page || 
        (page === '' && (currentPage === '' || currentPage === 'index.html'))
    );
    
    // Lấy thông tin user
    const userData = JSON.parse(localStorage.getItem('cafeUser') || 'null');
    const isLoggedIn = !!userData;
    
    console.log('🔐 Logged in:', isLoggedIn);
    console.log('🌐 Public page:', isPublicPage);
    
    // THÊM DÒNG QUAN TRỌNG: Kiểm tra nếu đang trong quá trình redirect
    if (sessionStorage.getItem('redirecting')) {
        console.log('🔄 Currently redirecting, skipping check');
        sessionStorage.removeItem('redirecting');
        return;
    }
    
    // Nếu chưa đăng nhập và không phải trang public -> redirect
    if (!isLoggedIn && !isPublicPage) {
        console.log('🚨 Not logged in, redirecting to login...');
        
        // Đánh dấu đang redirect để tránh loop
        sessionStorage.setItem('redirecting', 'true');
        
        // Thêm timeout nhỏ để đảm bảo sessionStorage được lưu
        setTimeout(() => {
            // Kiểm tra xem code đang chạy từ thư mục nào
            const isInPagesFolder = currentPath.includes('/pages/');
            if (isInPagesFolder) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'pages/login.html';
            }
        }, 10);
        return;
    }
    
    // Nếu đã đăng nhập và đang ở trang login/register -> redirect về trang chủ
    const isAuthPage = currentPage === 'login.html' || 
                       currentPage === 'register.html' || 
                       currentPage === 'forgot-password.html';
    
    if (isLoggedIn && isAuthPage) {
        console.log('✅ Already logged in, redirecting to home...');
        
        // Đánh dấu đang redirect để tránh loop
        sessionStorage.setItem('redirecting', 'true');
        
        setTimeout(() => {
            const isInPagesFolder = currentPath.includes('/pages/');
            if (isInPagesFolder) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 10);
        return;
    }
    
    console.log('✅ Auth check passed');
})();


// ==================== REST OF YOUR CODE ====================
// [Keep all your existing code below...]

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Café Focus loading with optimizations...');
    
    // 1. MOBILE MENU TOGGLE (Essential)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
        
        // Close menu when clicking outside (mobile only)
        if (window.innerWidth <= 768) {
            document.addEventListener('click', function(event) {
                if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }
    
    // 2. SMOOTH SCROLLING (Essential)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu after clicking
                    if (window.innerWidth <= 768 && navMenu) {
                        navMenu.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.classList.remove('active');
                            const icon = menuToggle.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
    
// 3. SET ACTIVE NAV LINK - FIXED VERSION FOR HOME PAGE
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentPage = getCurrentPageName();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    console.log('🔍 Debug Active Link:');
    console.log('Current Path:', currentPath);
    console.log('Current Page:', currentPage);
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let linkPage = getPageNameFromHref(linkHref);
        
        // Debug mỗi link
        console.log(`Link: ${link.textContent.trim()} -> ${linkHref} -> ${linkPage}`);
        
        // Xóa active class cũ
        link.classList.remove('active');
        
        // So sánh trang hiện tại với link
        if (linkPage === currentPage) {
            link.classList.add('active');
            console.log(`✅ Marking as active: ${link.textContent.trim()}`);
        }
    });
}

// Helper function to get current page name - FIXED FOR HOME PAGE
function getCurrentPageName() {
    const path = window.location.pathname;
    const segments = path.split('/');
    let page = segments[segments.length - 1];
    
    console.log('📄 Raw page from path:', page);
    
    // Handle index pages - FIXED FOR HOME PAGE
    if (page === '' || page === '/' || page === 'index.html' || page.includes('index')) {
        return 'index.html'; // Đảm bảo trả về đúng tên file
    }
    
    // Remove query parameters if any
    page = page.split('?')[0];
    
    return page;
}
    
    // Helper function to get page name from href
    function getPageNameFromHref(href) {
        if (!href) return '';
        
        // Handle absolute URLs
        try {
            const url = new URL(href, window.location.origin);
            const path = url.pathname;
            const segments = path.split('/');
            let page = segments[segments.length - 1];
            
            if (page === '' || page === '/') {
                return 'index.html';
            }
            
            // Remove query parameters
            page = page.split('?')[0];
            
            return page;
        } catch (e) {
            // Handle relative URLs
            const segments = href.split('/');
            let page = segments[segments.length - 1];
            
            // Handle parent directory (../)
            if (href.startsWith('../')) {
                // This goes to parent directory, usually index.html
                return 'index.html';
            }
            
            if (page === '' || page === '/') {
                return 'index.html';
            }
            
            // Remove query parameters
            page = page.split('?')[0];
            
            return page;
        }
    }
    
    // Set active link on page load
    setTimeout(setActiveNavLink, 100);
    
    // Also set active link when page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(setActiveNavLink, 100);
        }
    });
    
    // Add click handlers for navigation - FIXED
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip anchor links (handled by smooth scrolling)
            if (href.startsWith('#')) return;
            
            // Skip external links
            if (href.startsWith('http')) return;
            
            // Check if it's a page link (not an anchor)
            if (href.includes('.html') || href === '../' || href === '../index.html') {
                // Add loading state for better UX
                this.classList.add('loading');
                
                // If we're not actually navigating (same page), update active state
                const currentPage = getCurrentPageName();
                const linkPage = getPageNameFromHref(href);
                
                if (currentPage !== linkPage) {
                    // Page will reload, active state will be set on load
                } else {
                    // Same page, just update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Re-set active link when navigating
    window.addEventListener('load', function() {
        setTimeout(setActiveNavLink, 300);
    });
    
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            setTimeout(setActiveNavLink, 100);
        }
    });
    
    // 4. MENU PAGE FUNCTIONALITY - THÊM VÀO ĐÂY
    initMenuPageFunctions();
    
    // 5. LAZY LOADING IMAGES (Performance)
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => img.classList.add('loaded'));
        }
    };
    lazyLoadImages();
    
    // 6. BANNER SLIDER HOVER EFFECT (Optional but lightweight)
    const bannerSlider = document.querySelector('.banner-slider');
    if (bannerSlider) {
        bannerSlider.addEventListener('mouseenter', () => {
            bannerSlider.style.animationPlayState = 'paused';
        });
        
        bannerSlider.addEventListener('mouseleave', () => {
            bannerSlider.style.animationPlayState = 'running';
        });
    }
    
    // 7. SCROLL PROGRESS INDICATOR (Lightweight)
    const initScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            z-index: 9999;
            transition: width 0.1s;
        `;
        
        document.body.appendChild(progressBar);
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    progressBar.style.width = scrolled + "%";
                    ticking = false;
                });
                ticking = true;
            }
        });
    };
    
    // Only add scroll progress on desktop
    if (window.innerWidth > 768) {
        initScrollProgress();
    }
    
    // 8. TIME-BASED GREETING (Lightweight)
    const initTimeGreeting = () => {
        const greetingElement = document.querySelector('.time-greeting');
        if (!greetingElement) return;
        
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour < 12) greeting = '🌅 CHÀO BUỔI SÁNG!';
        else if (hour < 18) greeting = '☀️ CHÀO BUỔI CHIỀU!';
        else greeting = '🌙 CHÀO BUỔI TỐI!';
        
        greetingElement.textContent = greeting;
    };
    initTimeGreeting();
    
    // 9. PERFORMANCE OPTIMIZATIONS
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Update scroll progress visibility
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.display = window.innerWidth > 768 ? 'block' : 'none';
            }
        }, 250);
    });
    
    // Reduce motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition', '0s');
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animation || el.style.transition) {
                el.style.animation = 'none';
                el.style.transition = 'none';
            }
        });
        
        // Stop banner slider animation
        if (bannerSlider) {
            bannerSlider.style.animation = 'none';
        }
    }
    
    // 10. CARD HOVER EFFECTS (Lightweight)
    const initCardEffects = () => {
        const cards = document.querySelectorAll('.feature-card, .menu-item, .combo-item, .problem-card, .solution-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion.matches) {
                    card.style.transform = 'translateY(-5px)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!prefersReducedMotion.matches) {
                    card.style.transform = 'translateY(0)';
                }
            });
        });
    };
    initCardEffects();
    
    // 11. CONFETTI EFFECT FOR SUCCESS ACTIONS (Optional)
    const createConfetti = () => {
        // Simple confetti effect
        const colors = ['#2A6BFF', '#00C9A7', '#FF6B6B', '#FFD700'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                top: -10px;
                left: ${Math.random() * 100}%;
                pointer-events: none;
                z-index: 10000;
                opacity: 0.8;
            `;
            
            document.body.appendChild(confetti);
            
            // Simple animation
            const duration = 1000 + Math.random() * 1000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            setTimeout(() => confetti.remove(), duration);
        }
    };
    
    // Add confetti to booking confirmations
    const bookingButtons = document.querySelectorAll('a[href*="contact"], .btn-primary');
    bookingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Only trigger for actual bookings (not just navigation)
            if (button.textContent.includes('ĐẶT BÀN') || 
                button.textContent.includes('Đăng ký')) {
                // Add slight delay to feel natural
                setTimeout(createConfetti, 300);
            }
        });
    });
    
    // 12. ADD CSS FOR NEW ELEMENTS
    const addPerformanceCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Scroll progress bar */
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 2px;
                background: linear-gradient(90deg, var(--primary), var(--secondary));
                z-index: 9999;
                transition: width 0.1s;
            }
            
            /* Lazy load fade-in */
            img[loading="lazy"] {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            img[loading="lazy"].loaded {
                opacity: 1;
            }
            
            /* Loading state for nav links */
            .nav-menu a.loading {
                position: relative;
                overflow: hidden;
            }
            
            .nav-menu a.loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: loading-shimmer 1.5s infinite;
            }
            
            @keyframes loading-shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            /* Active state improvements */
            .nav-menu a.active {
                position: relative;
                animation: pulse-active 2s infinite;
            }
            
            @keyframes pulse-active {
                0%, 100% { box-shadow: 0 4px 12px rgba(42, 107, 255, 0.3); }
                50% { box-shadow: 0 4px 20px rgba(42, 107, 255, 0.5); }
            }
            
            /* Reduce motion */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
            
            /* Performance optimized animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Stagger animations for cards */
            .feature-card,
            .menu-item,
            .combo-item {
                animation: fadeInUp 0.6s ease;
                animation-fill-mode: both;
            }
            
            /* Sequential animation delays */
            .feature-card:nth-child(1) { animation-delay: 0.1s; }
            .feature-card:nth-child(2) { animation-delay: 0.2s; }
            .feature-card:nth-child(3) { animation-delay: 0.3s; }
            .feature-card:nth-child(4) { animation-delay: 0.4s; }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .scroll-progress {
                    display: none;
                }
                
                /* Reduce animations on mobile */
                .feature-card,
                .menu-item,
                .combo-item {
                    animation: none;
                }
                
                /* Improve mobile menu visibility */
                .nav-menu.active {
                    display: flex !important;
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(10px);
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    position: absolute;
                    top: 70px;
                    left: 0;
                    width: 100%;
                    z-index: 999;
                }
                
                .nav-menu:not(.active) {
                    display: none !important;
                }
            }
            
            /* Page loaded animation */
            body.page-loaded .hero-content {
                animation: fadeInUp 0.8s ease;
            }
            
            body.page-loaded .hero-image {
                animation: fadeInUp 0.8s ease 0.2s both;
            }
        `;
        document.head.appendChild(style);
    };
    addPerformanceCSS();
    
    // 13. PRELOAD CRITICAL PAGES
    const preloadImportantPages = () => {
        // Only preload on desktop and good connections
        const connection = navigator.connection;
        const isSlowConnection = connection && 
            (connection.saveData || 
             connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g');
        
        if (!isSlowConnection && window.innerWidth > 768) {
            const importantPages = ['pages/contact.html', 'pages/menu.html', 'pages/about.html', 'pages/services.html', 'pages/reviews.html'];
            
            importantPages.forEach(page => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                link.as = 'document';
                document.head.appendChild(link);
            });
        }
    };
    
    // Preload after initial load
    setTimeout(preloadImportantPages, 2000);
    
    // 14. BANNER SLIDER PERFORMANCE OPTIMIZATION
    if (bannerSlider) {
        // Pause animation when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bannerSlider.style.animationPlayState = 'running';
                } else {
                    bannerSlider.style.animationPlayState = 'paused';
                }
            });
        });
        
        observer.observe(bannerSlider);
    }
    
    // 15. PAGE LOAD ANIMATION (Lightweight)
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
    
    // 16. FIX FOR NAVIGATION ISSUES - ENSURE LINKS WORK
    const fixNavigationLinks = () => {
        const allLinks = document.querySelectorAll('a');
        
        allLinks.forEach(link => {
            // Skip if already has click handler
            if (link.hasAttribute('data-click-handled')) return;
            
            const href = link.getAttribute('href');
            
            // Only fix relative links
            if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                // Mark as handled
                link.setAttribute('data-click-handled', 'true');
                
                // Ensure proper navigation
                link.addEventListener('click', function(e) {
                    // Don't prevent default - let browser navigate
                    
                    // Show loading state for better UX
                    this.classList.add('loading');
                    
                    // Set active link immediately
                    if (this.classList.contains('nav-link')) {
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            }
        });
    };
    
    fixNavigationLinks();
    
    // Re-check for new links added dynamically
    const observer = new MutationObserver(fixNavigationLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 17. CONSOLE LOG FOR DEBUGGING
    console.log('✅ Café Focus optimized successfully!');
    console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
    console.log('🎯 Performance optimizations active');
    
    // Debug: Log all nav links
    console.log('🔗 Navigation links found:', navLinks.length);
    navLinks.forEach((link, index) => {
        console.log(`  ${index + 1}. ${link.textContent.trim()} -> ${link.getAttribute('href')}`);
    });
});

// ==================== MENU PAGE FUNCTIONS ====================
function initMenuPageFunctions() {
    // Check if we're on menu page
    const isMenuPage = window.location.pathname.includes('menu.html') || 
                       document.querySelector('.menu-hero') !== null;
    
    if (!isMenuPage) return;
    
    console.log('📋 Initializing menu page functions...');
    
    // 1. MENU CATEGORY NAVIGATION
    const categoryLinks = document.querySelectorAll('.category-link');
    const menuSections = document.querySelectorAll('.menu-section');
    
    function switchCategory(category) {
        // Remove active class from all links and sections
        categoryLinks.forEach(link => link.classList.remove('active'));
        menuSections.forEach(section => {
            section.classList.remove('active-section');
            section.style.display = 'none';
        });
        
        // Add active class to clicked link
        const clickedLink = document.querySelector(`[data-category="${category}"]`);
        if (clickedLink) {
            clickedLink.classList.add('active');
        }
        
        // Show corresponding section
        const targetSection = document.getElementById(category);
        if (targetSection) {
            targetSection.classList.add('active-section');
            targetSection.style.display = 'block';
            
            // Smooth scroll to section
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // Add click event to all category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            console.log('📌 Switching to category:', category);
            switchCategory(category);
            
            // Update URL hash
            window.location.hash = category;
        });
    });
    
    // 2. HANDLE URL HASH FOR DIRECT NAVIGATION
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        const validCategories = ['coffee', 'tea', 'dessert', 'combo'];
        
        if (hash && validCategories.includes(hash)) {
            console.log('🔗 Hash detected:', hash);
            switchCategory(hash);
        } else {
            // Default to coffee section
            console.log('🔗 No valid hash, defaulting to coffee');
            switchCategory('coffee');
        }
    }
    
    // Run on page load
    handleHashNavigation();
    
    // Also run when hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    
    // 3. COMBO BUTTON FUNCTIONALITY
    const comboButtons = document.querySelectorAll('.combo-button');
    comboButtons.forEach(button => {
        button.addEventListener('click', function() {
            const comboContent = this.closest('.combo-content');
            if (!comboContent) return;
            
            const comboName = comboContent.querySelector('.combo-name')?.textContent || 'Combo';
            const comboPrice = comboContent.querySelector('.current-price')?.textContent || '0₫';
            
            console.log(`🛒 Combo selected: ${comboName} - ${comboPrice}`);
            
            // Show confirmation message
            showComboConfirmation(comboName, comboPrice);
        });
    });
    
    // 4. FEATURED ITEM HIGHLIGHT
    const featuredItems = document.querySelectorAll('.menu-item.featured, .combo-item.featured');
    featuredItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 5. ADD TO CART FUNCTIONALITY FOR REGULAR ITEMS
    const menuItems = document.querySelectorAll('.menu-item:not(.combo-item)');
    menuItems.forEach(item => {
        const buyBtn = item.querySelector('.buy-now-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const itemName = item.querySelector('.menu-item-name')?.textContent || 'Sản phẩm';
                const itemPrice = item.querySelector('.menu-item-price')?.textContent || '0₫';
                addToCart(itemName, itemPrice);
            });
        }
    });
    
    // 6. KEYBOARD NAVIGATION FOR MENU
    document.addEventListener('keydown', function(e) {
        // Number keys 1-4 for categories
        if (e.key >= '1' && e.key <= '4') {
            const categories = ['coffee', 'tea', 'dessert', 'combo'];
            const index = parseInt(e.key) - 1;
            if (categories[index]) {
                e.preventDefault();
                switchCategory(categories[index]);
            }
        }
        
        // Left/Right arrow keys
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const currentActive = document.querySelector('.category-link.active');
            if (currentActive) {
                const currentIndex = Array.from(categoryLinks).indexOf(currentActive);
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : categoryLinks.length - 1;
                } else {
                    newIndex = currentIndex < categoryLinks.length - 1 ? currentIndex + 1 : 0;
                }
                
                const category = categoryLinks[newIndex].getAttribute('data-category');
                switchCategory(category);
            }
        }
    });
    
    // 8. TOUCH SWIPE SUPPORT FOR MOBILE
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const currentActive = document.querySelector('.category-link.active');
            if (currentActive) {
                const currentIndex = Array.from(categoryLinks).indexOf(currentActive);
                let newIndex;
                
                if (diff > 0) {
                    // Swipe right -> previous category
                    newIndex = currentIndex > 0 ? currentIndex - 1 : categoryLinks.length - 1;
                } else {
                    // Swipe left -> next category
                    newIndex = currentIndex < categoryLinks.length - 1 ? currentIndex + 1 : 0;
                }
                
                const category = categoryLinks[newIndex].getAttribute('data-category');
                switchCategory(category);
            }
        }
    }
    
    // 9. ADD CSS FOR MENU PAGE
    const menuCSS = document.createElement('style');
    menuCSS.textContent = `
        /* Menu page animations */
        .menu-section {
            display: none;
        }
        
        .menu-section.active-section {
            display: block;
            animation: fadeInUp 0.6s ease;
        }
        
        /* Add to cart button animations */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* Print styles for menu */
        @media print {
            .navbar,
            .menu-categories,
            .footer,
            .combo-button,
            button,
            .scroll-progress {
                display: none !important;
            }
            
            .menu-section {
                display: block !important;
                page-break-inside: avoid;
            }
            
            .menu-item,
            .combo-item {
                break-inside: avoid;
            }
            
            body {
                font-size: 12pt;
                color: black;
            }
        }
        
        /* Category navigation styles */
        .category-link {
            cursor: pointer;
        }
        
        .category-link.active {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white !important;
        }
    `;
    document.head.appendChild(menuCSS);
    
    console.log('✅ Menu page functions initialized!');
}

// ==================== HELPER FUNCTIONS ====================

function showComboConfirmation(comboName, comboPrice) {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        ">
            <h3 style="color: var(--primary); margin-bottom: 15px;">🎉 Đã thêm vào giỏ hàng!</h3>
            <p><strong>${comboName}</strong></p>
            <p style="color: var(--primary); font-size: 1.5rem; font-weight: bold; margin: 10px 0;">${comboPrice}</p>
            <p style="color: #666; margin-bottom: 20px;">Chuyển đến trang Đặt Bàn để hoàn tất đơn hàng?</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button class="btn-primary" id="goToBooking" style="padding: 10px 20px;">ĐẶT BÀN NGAY</button>
                <button class="btn-secondary" id="continueShopping" style="padding: 10px 20px;">TIẾP TỤC MUA</button>
            </div>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        "></div>
    `;
    
    document.body.appendChild(message);
    
    // Add event listeners to buttons
    document.getElementById('goToBooking').addEventListener('click', function() {
        window.location.href = 'contact.html';
    });
    
    document.getElementById('continueShopping').addEventListener('click', function() {
        message.remove();
    });
    
    // Also remove on overlay click
    message.querySelector('div:last-child').addEventListener('click', function() {
        message.remove();
    });
}

function addToCart(name, price) {
    console.log(`🛒 Added to cart: ${name} - ${price}`);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
        ">
            <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
            <div>
                <strong>Đã thêm vào giỏ hàng</strong>
                <div style="font-size: 0.9rem;">${name}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ADDITIONAL PERFORMANCE HELPERS ====================

// Request Animation Frame helper
const raf = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame ||
            function(callback) { return setTimeout(callback, 1000/60); };

// Cancel Animation Frame helper
const caf = window.cancelAnimationFrame || 
            window.webkitCancelAnimationFrame || 
            window.mozCancelAnimationFrame ||
            function(id) { clearTimeout(id); };

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle helper function  
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== OFFLINE DETECTION ====================
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
    // Show connection restored notification
    const notification = document.createElement('div');
    notification.textContent = '📶 Kết nối đã được khôi phục';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 10px 20px;
        border-radius: var(--radius);
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
});

window.addEventListener('offline', () => {
    console.log('⚠️ You are offline');
    // Show offline notification
    const notification = document.createElement('div');
    notification.textContent = '⚠️ Bạn đang offline';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--warning);
        color: white;
        padding: 10px 20px;
        border-radius: var(--radius);
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(notification);
});

// ==================== SERVICE WORKER REGISTRATION ====================
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    });
}

// ==================== FIX FOR NAVIGATION RELOAD ISSUE ====================
// Sometimes browser doesn't properly reload page when clicking same link
(function() {
    // Store last clicked link
    let lastClickedLink = null;
    
    document.addEventListener('click', function(e) {
        let target = e.target;
        
        // Find the closest anchor tag
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            
            // Only handle same-page navigation
            if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                
                // Check if it's the same link clicked twice
                if (lastClickedLink === href && performance.now() - (lastClickedTime || 0) < 1000) {
                    e.preventDefault();
                    window.location.reload();
                    return;
                }
                
                lastClickedLink = href;
                lastClickedTime = performance.now();
            }
        }
    });
    
    let lastClickedTime = 0;
})();

// ==================== FORCE NAVIGATION FIX ====================
// Add this as a last resort if navigation still doesn't work
window.addEventListener('load', function() {
    // Fix for any navigation links that might be broken
    const allNavLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])');
    
    allNavLinks.forEach(link => {
        // Remove any existing click handlers that might interfere
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Add fresh click handler
        newLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Let the browser handle the navigation naturally
            // But ensure active state is updated
            document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
            if (this.classList.contains('nav-menu a')) {
                this.classList.add('active');
            }
        });
    });
});

// ==================== REVIEWS SYSTEM ====================
// Calculate and update rating statistics
function updateRatingStatistics() {
    const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
    
    if (reviews.length === 0) {
        // Show default if no reviews
        updateRatingDisplay(0, 0, {});
        return;
    }
    
    // Calculate total and average rating
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating || 0), 0);
    const averageRating = (totalRating / totalReviews).toFixed(1);
    
    // Count reviews by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        const rating = parseInt(review.rating || 0);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
        }
    });
    
    updateRatingDisplay(averageRating, totalReviews, ratingCounts);
}

function updateRatingDisplay(averageRating, totalReviews, ratingCounts) {
    // Update overall rating
    const ratingNumber = document.querySelector('.overall-rating .rating-number');
    const ratingCount = document.querySelector('.overall-rating .rating-count');
    const starsContainer = document.querySelector('.overall-rating .stars');
    
    if (ratingNumber) {
        ratingNumber.textContent = averageRating;
    }
    
    if (ratingCount) {
        ratingCount.textContent = `Dựa trên ${totalReviews} đánh giá`;
    }
    
    // Update stars (full and half stars based on average)
    if (starsContainer) {
        starsContainer.innerHTML = '';
        const rating = parseFloat(averageRating);
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= Math.floor(rating)) {
                star.className = 'fas fa-star';
            } else if (i - rating < 1 && i - rating > 0) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            starsContainer.appendChild(star);
        }
    }
    
    // Update rating bars
    const ratingBars = document.querySelectorAll('.rating-bar');
    ratingBars.forEach(bar => {
        const ratingType = bar.querySelector('span').textContent.trim();
        const starCount = parseInt(ratingType.charAt(0));
        const count = ratingCounts[starCount] || 0;
        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
        
        const fill = bar.querySelector('.fill');
        const percentageSpan = bar.querySelectorAll('span')[2];
        
        if (fill) {
            fill.style.width = percentage + '%';
        }
        if (percentageSpan) {
            percentageSpan.textContent = percentage + '%';
        }
    });
}

// Review form handling - Initialize on reviews page
if (document.querySelector('.review-form') || document.getElementById('qrcode')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Update rating statistics on page load
        updateRatingStatistics();
        
        // Generate QR Code
        const baseURL = window.location.origin + window.location.pathname;
        const reviewFormURL = baseURL + '#review-form';
        const qrcodeContainer = document.getElementById('qrcode');
        
        if (qrcodeContainer && typeof QRCode !== 'undefined') {
            new QRCode(qrcodeContainer, {
                text: reviewFormURL,
                width: 200,
                height: 200,
                colorDark: "#2c3e50",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        
        // Auto scroll to review form when accessing via QR code
        if (window.location.hash === '#review-form') {
            setTimeout(() => {
                const reviewSection = document.getElementById('review-form');
                if (reviewSection) {
                    reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Highlight the form briefly
                    reviewSection.style.animation = 'highlightForm 2s ease';
                }
            }, 500);
        }

        // Handle star rating clicks
        const starRating = document.getElementById('starRating');
        const ratingValue = document.getElementById('ratingValue');
        const ratingText = document.getElementById('ratingText');
        
        if (starRating) {
            const stars = starRating.querySelectorAll('i');
            
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = this.getAttribute('data-rating');
                    ratingValue.value = rating;
                    
                    // Update star display
                    stars.forEach(s => {
                        const r = s.getAttribute('data-rating');
                        if (r <= rating) {
                            s.classList.remove('far');
                            s.classList.add('fas');
                            s.style.color = '#f39c12';
                        } else {
                            s.classList.remove('fas');
                            s.classList.add('far');
                            s.style.color = '#ddd';
                        }
                    });
                    
                    // Update rating text
                    const texts = {
                        '1': '⭐ Tồi',
                        '2': '⭐⭐ Dở',
                        '3': '⭐⭐⭐ Bình thường',
                        '4': '⭐⭐⭐⭐ Tốt',
                        '5': '⭐⭐⭐⭐⭐ Tuyệt vời!'
                    };
                    ratingText.textContent = texts[rating];
                    ratingText.style.color = '#f39c12';
                });
                
                // Hover effect
                star.addEventListener('mouseenter', function() {
                    const rating = this.getAttribute('data-rating');
                    stars.forEach(s => {
                        const r = s.getAttribute('data-rating');
                        if (r <= rating) {
                            s.style.transform = 'scale(1.2)';
                            s.style.color = '#f39c12';
                        } else {
                            s.style.transform = 'scale(1)';
                            s.style.color = '#ddd';
                        }
                    });
                });
            });
            
            starRating.addEventListener('mouseleave', function() {
                const currentRating = ratingValue.value;
                stars.forEach(s => {
                    const r = s.getAttribute('data-rating');
                    s.style.transform = 'scale(1)';
                    if (currentRating && r <= currentRating) {
                        s.style.color = '#f39c12';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        }

        // Handle review form submission
        const reviewForm = document.querySelector('.review-form');
        const reviewSuccess = document.getElementById('reviewSuccess');
        
        if (reviewForm) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    name: document.getElementById('reviewerName').value,
                    email: document.getElementById('reviewerEmail').value,
                    rating: document.getElementById('ratingValue').value || 0,
                    title: document.getElementById('reviewTitle').value,
                    content: document.getElementById('reviewContent').value,
                    date: new Date().toISOString(),
                    id: Date.now()
                };
                
                if (!formData.rating) {
                    alert('Vui lòng chọn số sao!');
                    return;
                }
                
                // Save to localStorage
                let reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
                reviews.unshift(formData);
                localStorage.setItem('cafeReviews', JSON.stringify(reviews));
                
                // Update rating statistics
                updateRatingStatistics();
                
                // Show success message
                reviewForm.style.display = 'none';
                reviewSuccess.style.display = 'block';
                
                // Add to reviews display
                displayNewReview(formData);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    reviewForm.reset();
                    document.querySelectorAll('#starRating i').forEach(s => {
                        s.classList.remove('fas');
                        s.classList.add('far');
                        s.style.color = '#ddd';
                    });
                    document.getElementById('ratingText').textContent = '';
                    reviewForm.style.display = 'block';
                    reviewSuccess.style.display = 'none';
                }, 3000);
            });
        }
        
        // Load and display existing reviews
        loadReviews();
        
        // Setup filters
        setupFilterListeners();
    });
}

// Filter reviews function
function filterReviews(filter, reviewCards) {
    reviewCards.forEach(card => {
        const rating = card.getAttribute('data-rating');
        let show = false;
        
        if (filter === 'all') {
            show = true;
        } else if (filter === 'latest') {
            show = true;
        } else if (filter === rating) {
            show = true;
        }
        
        if (show) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
    
    // Sort by latest if filter is latest
    if (filter === 'latest') {
        sortByLatest();
    }
}

// Sort reviews by latest
function sortByLatest() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    const cards = Array.from(reviewsGrid.querySelectorAll('.review-card'));
    cards.sort((a, b) => {
        const indexA = parseInt(a.getAttribute('data-index') || '0');
        const indexB = parseInt(b.getAttribute('data-index') || '0');
        return indexB - indexA;
    });
    
    cards.forEach(card => reviewsGrid.appendChild(card));
}

// Display new review
function displayNewReview(review) {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    const reviewCard = createReviewCard(review);
    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);
    
    // Re-setup filters after adding new review
    setupFilterListeners();
}

// Create review card HTML
function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.setAttribute('data-rating', review.rating);
    card.setAttribute('data-index', review.id);
    
    const stars = '⭐'.repeat(parseInt(review.rating));
    const date = new Date(review.date).toLocaleDateString('vi-VN');
    
    card.innerHTML = `
        <div class="review-header">
            <div class="reviewer-avatar">
                ${review.name.charAt(0).toUpperCase()}
            </div>
            <div class="reviewer-info">
                <h3>${review.name}</h3>
                <div class="review-rating">${stars}</div>
            </div>
        </div>
        <h3 class="review-title">${review.title || 'Không có tiêu đề'}</h3>
        <p class="review-content">${review.content}</p>
        <span class="review-date">${date}</span>
    `;
    
    card.style.transition = 'opacity 0.3s ease';
    return card;
}

// Load reviews from localStorage
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
    const reviewsGrid = document.querySelector('.reviews-grid');
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    
    if (!reviewsGrid) return;
    
    if (reviews.length === 0) {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    // Show only first 6 reviews initially
    const initialCount = 6;
    reviews.forEach((review, index) => {
        if (review && review.name && review.content) {
            const card = createReviewCard(review);
            if (index >= initialCount) {
                card.style.display = 'none';
                card.setAttribute('data-hidden', 'true');
            }
            reviewsGrid.appendChild(card);
        }
    });
    
    // Show/hide load more button
    if (loadMoreBtn) {
        if (reviews.length <= initialCount) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loadMoreReviewsHandler();
            });
        }
    }
    
    // Setup filters
    setupFilterListeners();
}

// Load more reviews handler
function loadMoreReviewsHandler() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const hiddenCards = reviewsGrid.querySelectorAll('[data-hidden="true"]');
    
    if (hiddenCards.length === 0) return;
    
    // Show next 6 reviews
    let shown = 0;
    hiddenCards.forEach(card => {
        if (shown < 6) {
            card.style.opacity = '0';
            card.style.display = 'block';
            card.removeAttribute('data-hidden');
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease-in-out';
                card.style.opacity = '1';
            }, 10);
            shown++;
        }
    });
    
    setupFilterListeners();
}

// Setup filter listeners for dynamically loaded reviews
function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ratingBars = document.querySelectorAll('.rating-bar');
    const reviewCards = document.querySelectorAll('.review-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            ratingBars.forEach(bar => bar.classList.remove('active'));
            
            filterReviews(filter, reviewCards);
        });
    });
    
    ratingBars.forEach(bar => {
        bar.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            
            filterButtons.forEach(b => b.classList.remove('active'));
            ratingBars.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            filterReviews(rating, reviewCards);
        });
    });
}

// Admin functions
function viewAllReviews() {
    const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
    console.log('=== TẤT CẢ ĐÁNH GIÁ ===');
    console.table(reviews);
    return reviews;
}

function clearAllReviews() {
    if (confirm('Bạn có chắc muốn xóa tất cả đánh giá?')) {
        localStorage.removeItem('cafeReviews');
        console.log('Đã xóa tất cả đánh giá!');
        location.reload();
    }
}

function exportReviews() {
    const reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
    const dataStr = JSON.stringify(reviews, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cafe-reviews-' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

console.log('📝 Review System Loaded!');
console.log('💡 Commands: viewAllReviews(), clearAllReviews(), exportReviews()');

// ==================== MENU MANAGEMENT SYSTEM ====================
// Quản lý Menu - Chỉnh sửa, Xóa, và In

document.addEventListener('DOMContentLoaded', function() {
    const printMenuBtn = document.getElementById('printMenuBtn');
    const editPrintBtn = document.getElementById('editPrintBtn');
    const deletePrintBtn = document.getElementById('deletePrintBtn');
    
    // Print Menu functionality
    if (printMenuBtn) {
        printMenuBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Edit print menu item
    if (editPrintBtn) {
        editPrintBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const printCard = this.closest('.print-menu-card');
            if (printCard) {
                editMenuItem(printCard);
            }
        });
    }
    
    // Delete print menu item
    if (deletePrintBtn) {
        deletePrintBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const printCard = this.closest('.print-menu-card');
            if (printCard) {
                deleteMenuItem(printCard);
            }
        });
    }
    
    // Add event listeners to individual edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = btn.closest('.menu-item, .combo-item');
            if (menuItem) {
                editMenuItem(menuItem);
            }
        });
    });
    
    // Add event listeners to individual delete buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = btn.closest('.menu-item, .combo-item');
            if (menuItem) {
                deleteMenuItem(menuItem);
            }
        });
    });
});

// Enable edit mode for all items
function enableEditMode() {
    const menuItems = document.querySelectorAll('.menu-item, .combo-item');
    menuItems.forEach(item => {
        item.style.border = '2px dashed #FFB800';
        item.style.padding = '10px';
    });
}

// Disable edit mode
function disableEditMode() {
    const menuItems = document.querySelectorAll('.menu-item, .combo-item');
    menuItems.forEach(item => {
        item.style.border = 'none';
        item.style.padding = '0';
    });
}

// Edit individual menu item
function editMenuItem(menuItem) {
    const itemName = menuItem.querySelector('.menu-item-name, .combo-name');
    const itemDesc = menuItem.querySelector('.menu-item-description');
    const itemPrice = menuItem.querySelector('.menu-item-price, .current-price');
    
    if (!itemName) return;
    
    const currentName = itemName.textContent;
    const currentDesc = itemDesc ? itemDesc.textContent : '';
    const currentPrice = itemPrice ? itemPrice.textContent : '';
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'edit-form-modal';
    editForm.innerHTML = `
        <div class="edit-form-content">
            <h3>Chỉnh sửa Mục Menu</h3>
            <div class="form-group">
                <label>Tên Mục:</label>
                <input type="text" id="editItemName" value="${currentName}" class="form-input">
            </div>
            <div class="form-group">
                <label>Mô Tả:</label>
                <input type="text" id="editItemDesc" value="${currentDesc}" class="form-input">
            </div>
            <div class="form-group">
                <label>Giá:</label>
                <input type="text" id="editItemPrice" value="${currentPrice}" class="form-input">
            </div>
            <div class="form-actions">
                <button class="form-btn cancel-btn">Hủy</button>
                <button class="form-btn save-btn">Lưu</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(editForm);
    
    // Handle form actions
    const cancelBtn = editForm.querySelector('.cancel-btn');
    const saveBtn = editForm.querySelector('.save-btn');
    
    cancelBtn.addEventListener('click', function() {
        editForm.remove();
    });
    
    saveBtn.addEventListener('click', function() {
        const newName = document.getElementById('editItemName').value;
        const newDesc = document.getElementById('editItemDesc').value;
        const newPrice = document.getElementById('editItemPrice').value;
        
        itemName.textContent = newName;
        if (itemDesc) itemDesc.textContent = newDesc;
        if (itemPrice) itemPrice.textContent = newPrice;
        
        editForm.remove();
        showSuccessMessage('Cập nhật thành công!');
    });
}

// Delete menu item
function deleteMenuItem(menuItem) {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
        menuItem.style.opacity = '0';
        menuItem.style.transform = 'scale(0.95)';
        setTimeout(function() {
            menuItem.remove();
            showSuccessMessage('Mục đã được xóa!');
        }, 300);
    }
}

// Show notifications
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 2000);
}

function showEditModeNotification() {
    showSuccessMessage('Chế độ chỉnh sửa đã được kích hoạt. Nhấp vào các nút chỉnh sửa để sửa đổi từng mục!');
}

function showDeleteConfirmation() {
    const selectedItems = document.querySelectorAll('.menu-item[data-selected], .combo-item[data-selected]');
    if (selectedItems.length === 0) {
        alert('Vui lòng chọn các mục để xóa!');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.length} mục?`)) {
        selectedItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(function() {
                item.remove();
            }, 300);
        });
        showSuccessMessage(`Đã xóa ${selectedItems.length} mục!`);
    }
}

console.log('📋 Menu Management System Loaded!');
console.log('💡 Features: Edit items, Delete items, Print menu');

// ==================== SHOPPING CART SYSTEM ====================
// Quản lý Giỏ Hàng - Thêm, Xóa, Thanh Toán

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        this.initializeCartUI();
    }
    
    addItem(name, price, quantity = 1, image = '') {
        console.log('Adding item:', name, price, quantity, image);
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log('Updated existing item:', existingItem);
        } else {
            const newItem = {
                id: Date.now(),
                name: name,
                price: parseInt(price),
                quantity: quantity,
                image: image
            };
            this.items.push(newItem);
            console.log('Added new item:', newItem);
        }
        
        console.log('Cart items:', this.items);
        this.saveCart();
        this.updateCartUI();
        this.showAddedNotification(name);
    }
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }
    
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(itemId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }
    
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }
    
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    initializeCartUI() {
        // In-page cart doesn't need modal toggle
        // Just update the cart display
        this.updateCartUI();
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartBody = document.getElementById('cartBody');
        const cartSummary = document.getElementById('cartSummary');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        const itemCount = this.getTotalItems();
        const totalPrice = this.getTotalPrice();
        
        // Update floating cart badge
        if (cartCount) {
            cartCount.textContent = itemCount;
        }
        
        // Only update in-page cart if elements exist
        if (!cartBody) {
            // If there's a floating cart update function, call it
            if (typeof window.updateFloatingCart === 'function') {
                window.updateFloatingCart();
            }
            return;
        }
        
        if (this.items.length === 0) {
            cartBody.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fas fa-inbox"></i>
                    <p>Chưa có sản phẩm nào</p>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            cartBody.innerHTML = this.items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">${this.formatPrice(item.price)}</p>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus-btn" data-item-id="${item.id}">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" data-item-id="${item.id}">
                        <button class="qty-btn plus-btn" data-item-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">${this.formatPrice(item.price * item.quantity)}</div>
                    <button class="cart-item-remove" data-item-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
            
            if (cartSummary) cartSummary.style.display = 'block';
            if (cartTotal) cartTotal.textContent = this.formatPrice(totalPrice);
            
            // Add event listeners for cart items
            cartBody.querySelectorAll('.minus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId);
                    const item = this.items.find(i => i.id === itemId);
                    if (item) this.updateQuantity(itemId, item.quantity - 1);
                });
            });
            
            cartBody.querySelectorAll('.plus-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId);
                    const item = this.items.find(i => i.id === itemId);
                    if (item) this.updateQuantity(itemId, item.quantity + 1);
                });
            });
            
            cartBody.querySelectorAll('.qty-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const itemId = parseInt(e.target.dataset.itemId);
                    const quantity = parseInt(e.target.value) || 1;
                    this.updateQuantity(itemId, quantity);
                });
            });
            
            cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const itemId = parseInt(e.currentTarget.dataset.itemId);
                    this.removeItem(itemId);
                });
            });
        }
        
        // Always update floating cart if function exists
        if (typeof window.updateFloatingCart === 'function') {
            window.updateFloatingCart();
        }
    }
    
    formatPrice(price) {
        return price.toLocaleString('vi-VN') + '₫';
    }
    
    showAddedNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'cart-added-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${itemName} đã được thêm vào giỏ hàng!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }
}

// Initialize shopping cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
    
    // Add event listeners to all add-to-cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            if (name && price) {
                // Get product image
                const menuItem = btn.closest('.menu-item');
                let image = '';
                if (menuItem) {
                    const imgElement = menuItem.querySelector('.menu-item-image img');
                    if (imgElement) {
                        image = imgElement.src;
                    }
                }
                cart.addItem(name, price, 1, image);
                // Update floating cart if it's loaded
                setTimeout(() => {
                    const updateFloatingCartFunc = window.updateFloatingCart;
                    if (typeof updateFloatingCartFunc === 'function') {
                        updateFloatingCartFunc();
                    }
                }, 100);
            }
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length > 0) {
                alert(`Tổng tiền: ${cart.formatPrice(cart.getTotalPrice())}\n\nCảm ơn bạn đã đặt hàng! Vui lòng liên hệ chúng tôi để hoàn tất đơn hàng.`);
                cart.items = [];
                cart.saveCart();
                cart.updateCartUI();
            }
        });
    }

    // ==================== FLOATING CART FUNCTIONALITY ====================
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartClose = document.getElementById('cartClose');
    const cartCount = document.getElementById('cartCount');
    const cartDropdownBody = document.getElementById('cartDropdownBody');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (floatingCartBtn) {
        // Toggle cart dropdown
        floatingCartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
        });

        // Close cart
        if (cartClose) {
            cartClose.addEventListener('click', function() {
                cartDropdown.classList.remove('active');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.cart-dropdown') && !e.target.closest('.floating-cart-btn')) {
                cartDropdown.classList.remove('active');
            }
        });

        // Update cart display
        function updateCartDisplay() {
            console.log('🛒 Updating floating cart display');
            console.log('Cart exists:', !!cart);
            console.log('Cart items:', cart ? cart.items : 'N/A');
            
            if (!cart || !cart.items) {
                console.warn('Cart not ready yet');
                return;
            }

            // Update count
            const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            console.log('Total items:', totalItems);

            // Update body
            if (cart.items.length === 0) {
                cartDropdownBody.innerHTML = '<p class="cart-empty">Giỏ hàng trống</p>';
            } else {
                let html = '';
                cart.items.forEach((item) => {
                    html += `
                        <div class="cart-item">
                            <img src="${item.image || '../images/placeholder.png'}" alt="${item.name}" class="cart-item-img">
                            <div class="cart-item-info">
                                <p class="cart-item-name">${item.name}</p>
                                <p class="cart-item-price">${item.price.toLocaleString('vi-VN')}₫</p>
                                <div class="cart-item-controls">
                                    <button class="cart-qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                                    <span class="cart-item-qty">${item.quantity}</span>
                                    <button class="cart-qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                                </div>
                            </div>
                            <button class="cart-item-remove" onclick="removeItem(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                });
                cartDropdownBody.innerHTML = html;
                console.log('Cart HTML updated with', cart.items.length, 'items');
            }

            // Update total
            const total = cart.getTotalPrice ? cart.getTotalPrice() : 0;
            cartTotalPrice.textContent = total.toLocaleString('vi-VN') + '₫';
            console.log('Total price:', total);
        }

        // Global functions for cart
        window.changeQty = function(itemId, change) {
            const item = cart.items.find(i => i.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart.items = cart.items.filter(i => i.id !== itemId);
                }
                cart.saveCart();
                updateCartDisplay();
            }
        };

        window.removeItem = function(itemId) {
            cart.items = cart.items.filter(i => i.id !== itemId);
            cart.saveCart();
            updateCartDisplay();
        };

        let historyVisibleCount = 6;
        const historyIncrement = 3;
        const historyMoreBtn = document.querySelector('.history-more-btn');
// Thay thế hàm checkoutCart hiện tại với phiên bản này
window.checkoutCart = function() {
    if (!cart || cart.items.length === 0) {
        alert('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng trước.');
        return;
    }

    const total = cart.getTotalPrice();
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Lấy thông tin user hiện tại
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = currentUser.name || 'Khách hàng';
    
    // Tạo giao dịch mới
    const transaction = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        total: total,
        items: cart.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        status: 'Đã thanh toán',
        userName: userName,
        userEmail: currentUser.email || '',
        itemCount: totalItems,
        displayDate: new Date().toLocaleDateString('vi-VN'),
        displayTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Lấy và lưu lịch sử thanh toán
    let paymentHistory = getPaymentHistory();
    
    // Thêm giao dịch mới vào đầu mảng
    paymentHistory.unshift(transaction);
    
    // Giới hạn lịch sử (giữ 50 giao dịch gần nhất)
    if (paymentHistory.length > 50) {
        paymentHistory = paymentHistory.slice(0, 50);
    }
    
    // Lưu vào localStorage
    savePaymentHistory(paymentHistory);
    
    // Hiển thị thông báo thành công
    showPaymentSuccess(transaction);
    
    // Xóa giỏ hàng
    cart.items = [];
    cart.saveCart();
    updateCartDisplay();
    
    // Cập nhật điểm thưởng nếu có user
    if (currentUser.id) {
        updateUserPoints(currentUser.id, total);
    }
    
    // Cập nhật UI
    renderPaymentHistory();
    cartDropdown.classList.remove('active');
    
    // Cuộn đến phần lịch sử thanh toán
    setTimeout(() => {
        const historySection = document.getElementById('payment-history');
        if (historySection) {
            historySection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 500);
};

// Hàm cập nhật điểm thưởng cho user
function updateUserPoints(userId, amount) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            // Mỗi 50.000đ = 1 điểm
            const pointsEarned = Math.floor(amount / 50000);
            users[userIndex].points = (users[userIndex].points || 0) + pointsEarned;
            
            // Cập nhật thời gian hoạt động cuối
            users[userIndex].lastActivity = new Date().toISOString();
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Cập nhật currentUser
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser.id === userId) {
                currentUser.points = users[userIndex].points;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            console.log(`🎉 User ${users[userIndex].name} earned ${pointsEarned} points!`);
        }
    } catch (error) {
        console.error('Error updating user points:', error);
    }
}

// Hàm hiển thị thông báo thanh toán thành công
function showPaymentSuccess(transaction) {
    const successModal = document.createElement('div');
    successModal.className = 'payment-success-modal';
    successModal.innerHTML = `
        <div class="payment-success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Thanh toán thành công!</h2>
            <div class="payment-details">
                <div class="detail-row">
                    <span>Mã giao dịch:</span>
                    <strong>#${transaction.id}</strong>
                </div>
                <div class="detail-row">
                    <span>Thời gian:</span>
                    <span>${transaction.displayTime} - ${transaction.displayDate}</span>
                </div>
                <div class="detail-row">
                    <span>Tổng số món:</span>
                    <span>${transaction.itemCount} món</span>
                </div>
                <div class="detail-row">
                    <span>Tổng tiền:</span>
                    <strong class="total-amount">${transaction.total.toLocaleString('vi-VN')}₫</strong>
                </div>
                <div class="detail-row">
                    <span>Trạng thái:</span>
                    <span class="status-badge">${transaction.status}</span>
                </div>
            </div>
            <p class="success-message">Cảm ơn bạn đã mua hàng tại Café Focus!</p>
            <div class="success-actions">
                <button class="btn-primary" id="viewHistoryBtn">
                    <i class="fas fa-history"></i> Xem lịch sử
                </button>
                <button class="btn-secondary" id="continueShoppingBtn">
                    <i class="fas fa-shopping-cart"></i> Tiếp tục mua sắm
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Thêm CSS cho modal
    const style = document.createElement('style');
    style.textContent = `
        .payment-success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .payment-success-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.4s ease;
        }
        
        .success-icon {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        
        .payment-success-content h2 {
            color: #2A6BFF;
            margin-bottom: 20px;
        }
        
        .payment-details {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .total-amount {
            color: #FF6B6B;
            font-size: 1.2em;
        }
        
        .status-badge {
            background: #4CAF50;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        
        .success-message {
            color: #666;
            margin: 20px 0;
            font-style: italic;
        }
        
        .success-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }
        
        .success-actions button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .success-actions .btn-primary {
            background: linear-gradient(135deg, #2A6BFF, #00C9A7);
            color: white;
        }
        
        .success-actions .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 2px solid #e9ecef;
        }
        
        .success-actions button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Xử lý sự kiện các nút
    document.getElementById('viewHistoryBtn').addEventListener('click', () => {
        successModal.remove();
        style.remove();
        const historySection = document.getElementById('payment-history');
        if (historySection) {
            historySection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        successModal.remove();
        style.remove();
    });
    
    // Tự động đóng sau 8 giây
    setTimeout(() => {
        if (document.body.contains(successModal)) {
            successModal.remove();
            style.remove();
        }
    }, 8000);
}
        const getPaymentHistory = () => {
            try {
                const history = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
                // Sắp xếp theo thời gian mới nhất trước
                return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } catch (e) {
                console.error('Failed to parse payment history:', e);
                return [];
            }
        };

        // Cập nhật hàm savePaymentHistory
        const savePaymentHistory = (list) => {
            try {
                localStorage.setItem('paymentHistory', JSON.stringify(list));
                console.log('Payment history saved successfully:', list.length, 'transactions');
            } catch (e) {
                console.error('Failed to save payment history:', e);
            }
        };

const renderPaymentHistory = () => {
    const container = document.getElementById('paymentHistory');
    if (!container) return;

    const history = getPaymentHistory();
    
    if (!history.length) {
        container.innerHTML = `
            <div class="empty-history-state">
                <i class="fas fa-receipt"></i>
                <h3>Chưa có giao dịch nào</h3>
                <p>Thanh toán đơn hàng đầu tiên để xem lịch sử tại đây!</p>
                <button class="btn-primary" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
                    <i class="fas fa-shopping-cart"></i> Mua sắm ngay
                </button>
            </div>
        `;
        if (historyMoreBtn) historyMoreBtn.style.display = 'none';
        return;
    }

    // Hiển thị số lượng lịch sử tùy theo nút "Xem thêm"
    const visibleHistory = historyVisibleCount > 0 ? 
        history.slice(0, historyVisibleCount) : 
        history.slice(0, 6);

    const html = visibleHistory.map(item => {
        const time = new Date(item.createdAt).toLocaleString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const date = new Date(item.createdAt).toLocaleDateString('vi-VN');
        
        // Tạo danh sách items
        const itemsList = (item.items || []).map(i => 
            `<div class="history-item">
                <span>${i.quantity}x ${i.name}</span>
                <span>${(i.price * i.quantity).toLocaleString('vi-VN')}₫</span>
            </div>`
        ).join('');
        
        return `
            <div class="history-card">
                <div class="history-card-header">
                    <div class="history-id">
                        <i class="fas fa-receipt"></i>
                        <span>#${item.id}</span>
                    </div>
                    <div class="history-status ${item.status === 'Đã thanh toán' ? 'status-success' : 'status-pending'}">
                        ${item.status}
                    </div>
                </div>
                
                <div class="history-card-body">
                    <div class="history-info">
                        <div class="info-row">
                            <i class="far fa-calendar"></i>
                            <span>${date} ${time}</span>
                        </div>
                        ${item.userName ? `
                        <div class="info-row">
                            <i class="far fa-user"></i>
                            <span>${item.userName}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="history-items">
                        <h4>Chi tiết đơn hàng:</h4>
                        <div class="items-list">
                            ${itemsList}
                        </div>
                    </div>
                </div>
                
                <div class="history-card-footer">
                    <div class="history-total">
                        <span>Tổng cộng:</span>
                        <strong>${item.total.toLocaleString('vi-VN')}₫</strong>
                    </div>
                    <button class="history-reorder-btn" onclick="reorderFromHistory(${item.id})">
                        <i class="fas fa-redo"></i> Đặt lại
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;

    // Cập nhật nút "Xem thêm"
    if (historyMoreBtn) {
        const remaining = Math.max(0, history.length - historyVisibleCount);
        historyMoreBtn.style.display = history.length > 6 ? 'inline-flex' : 'none';
        historyMoreBtn.disabled = remaining === 0;
        historyMoreBtn.innerHTML = remaining === 0 ? 
            '<i class="fas fa-check"></i> Đã hiển thị tất cả' : 
            `<i class="fas fa-plus"></i> Xem thêm ${remaining} giao dịch`;
        
        // Xử lý sự kiện cho nút
        historyMoreBtn.onclick = () => {
            if (remaining > 0) {
                historyVisibleCount += historyIncrement;
                renderPaymentHistory();
            }
        };
    }
};

// Hàm đặt lại từ lịch sử
window.reorderFromHistory = function(historyId) {
    const history = getPaymentHistory();
    const transaction = history.find(t => t.id === historyId);
    
    if (!transaction) {
        alert('Không tìm thấy giao dịch này!');
        return;
    }
    
    if (confirm(`Bạn muốn đặt lại đơn hàng #${historyId}?`)) {
        // Xóa giỏ hàng hiện tại
        cart.items = [];
        
        // Thêm các items từ lịch sử vào giỏ hàng
        transaction.items.forEach(item => {
            cart.addItem(item.name, item.price, item.quantity);
        });
        
        // Hiển thị thông báo
        alert(`Đã thêm ${transaction.items.length} món vào giỏ hàng!`);
        
        // Cập nhật giao diện giỏ hàng
        updateCartDisplay();
        
        // Hiển thị giỏ hàng
        cartDropdown.classList.add('active');
        
        // Cuộn lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

        if (historyMoreBtn) {
            historyMoreBtn.addEventListener('click', () => {
                historyVisibleCount += historyIncrement;
                renderPaymentHistory();
            });
        }

        window.checkoutCart = function() {
            if (cart.items.length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }

            const total = cart.getTotalPrice();
            const history = getPaymentHistory();
            history.unshift({
                id: Date.now(),
                createdAt: new Date().toISOString(),
                total,
                items: cart.items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
                status: 'Đang xử lý'
            });
            savePaymentHistory(history);

            alert(`Tổng tiền: ${total.toLocaleString('vi-VN')}₫\n\nĐã lưu vào lịch sử thanh toán. Cảm ơn bạn!`);

            cart.items = [];
            cart.saveCart();
            updateCartDisplay();
            renderPaymentHistory();
            cartDropdown.classList.remove('active');
        };

        // Update on cart changes
        window.updateFloatingCart = updateCartDisplay;

        // Initial update
        setTimeout(() => {
            updateCartDisplay();
            renderPaymentHistory();
        }, 100);
    }
});

console.log('🛒 Shopping Cart System Loaded!');
// ==================== USER MENU ====================
const userMenu = document.getElementById('userMenu');
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const userName = document.getElementById('userName');
const dropdownUserName = document.getElementById('dropdownUserName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');

// Load user info
function loadUserInfo() {
    const userData = JSON.parse(localStorage.getItem('cafeUser') || 'null');
    
    if (userData) {
        // Set user info
        const displayName = userData.name || 'Người dùng';
        if (userName) userName.textContent = displayName;
        if (dropdownUserName) dropdownUserName.textContent = displayName;
        if (userEmail) userEmail.textContent = userData.email || '';
        if (userAvatar) userAvatar.textContent = userData.avatar || displayName.charAt(0).toUpperCase();
        
        // Show user menu
        if (userMenu) userMenu.style.display = 'flex';
    } else {
        // Hide user menu if not logged in
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Toggle user dropdown
if (userBtn && userDropdown) {
    userBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
        userBtn.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
            userBtn.classList.remove('active');
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Clear user data
            localStorage.removeItem('cafeUser');
            localStorage.removeItem('lastLogin');
            
            // Redirect to login page
            window.location.href = '../pages/login.html';
        }
    });
}

// Load user info on page load
loadUserInfo();