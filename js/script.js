// ==================== CAFÉ FOCUS OPTIMIZED SCRIPT ====================
(function immediateAuthCheck() {
    // Danh sách trang không cần đăng nhập
    const publicPages = [
        'login.html',
        'reviews.html',
        'index.html',
        'about.html',
        'services.html',
        'orders.html',
        '' 
    ];
    
   
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/');
    let currentPage = segments[segments.length - 1] || 'index.html';
    

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
    initStarRating(); 
    // 1. MOBILE MENU TOGGLE (Essential)
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
       if (document.querySelector('.reviews-hero')) {
        initializeReviewsPage();
    }
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
    // Enhanced cart handling: update localStorage, UI and show brief notification
    try {
        const numericPrice = typeof price === 'number' ? price : parsePrice(price || '0');
        const cart = getCart();

        // Try to find existing item by name
        let item = cart.find(i => i.name === name);
        if (item) {
            item.quantity += 1;
        } else {
            item = { id: Date.now() + Math.floor(Math.random()*1000), name, price: numericPrice, quantity: 1 };
            cart.push(item);
        }

        saveCart(cart);
        renderCartPanel();
        updateCartSummary();

        // Small success notification
        const notification = document.createElement('div');
        notification.textContent = `${name} đã được thêm vào giỏ hàng`;
        notification.style.cssText = `position:fixed;right:20px;top:170px;background:linear-gradient(135deg,#2ecc71,#27ae60);color:#fff;padding:12px 16px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.12);z-index:10000;`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2400);
    } catch (err) {
        console.error('Error adding to cart', err);
    }
}

// --------- Cart helpers ---------
function parsePrice(str) {
    if (!str && str !== 0) return 0;
    if (typeof str === 'number') return str;
    // Remove non-digit characters
    const digits = String(str).replace(/[^0-9]/g, '');
    return parseInt(digits || '0', 10);
}

function formatPrice(num) {
    if (!num) num = 0;
    return new Intl.NumberFormat('vi-VN').format(num) + '₫';
}

function getCart() {
    return JSON.parse(localStorage.getItem('cafeCart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cafeCart', JSON.stringify(cart));
}

function renderCartPanel() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    if (!cartItemsContainer || !cartTotalEl) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    let total = 0;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div style="padding:12px;color:#666">Giỏ hàng trống</div>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;

            const row = document.createElement('div');
            row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f1f1;gap:8px;';
            row.innerHTML = `
                <div style="flex:1;">
                    <div style="font-weight:600">${item.name}</div>
                    <div style="color:#888;font-size:0.95rem">${formatPrice(item.price)}</div>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                    <button class="qty-btn" data-id="${item.id}" data-delta="-1" style="width:28px;height:28px;border-radius:6px;border:1px solid #ddd;background:#fff;">-</button>
                    <div style="min-width:26px;text-align:center">${item.quantity}</div>
                    <button class="qty-btn" data-id="${item.id}" data-delta="1" style="width:28px;height:28px;border-radius:6px;border:1px solid #ddd;background:#fff;">+</button>
                </div>
            `;

            cartItemsContainer.appendChild(row);
        });
    }

    cartTotalEl.textContent = formatPrice(total);

    // Attach quantity handlers
    cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = Number(this.getAttribute('data-id'));
            const delta = Number(this.getAttribute('data-delta'));
            changeQuantity(id, delta);
        });
    });
}

function updateCartSummary() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    const total = cart.reduce((s, i) => s + i.quantity * i.price, 0);
    const summary = document.getElementById('cartSummary');
    if (summary) summary.textContent = `${count} món • ${formatPrice(total)}`;
}

function changeQuantity(id, delta) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) cart.splice(idx, 1);
    saveCart(cart);
    renderCartPanel();
    updateCartSummary();
}

function clearCart() {
    localStorage.removeItem('cafeCart');
    renderCartPanel();
    updateCartSummary();
}

// Initialize cart widget listeners
document.addEventListener('DOMContentLoaded', function() {
    // Render initial state
    renderCartPanel();
    updateCartSummary();

    const cartToggle = document.getElementById('cartToggle');
    const cartPanel = document.getElementById('cartPanel');
    const closeCartPanel = document.getElementById('closeCartPanel');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    if (cartToggle && cartPanel) {
        cartToggle.addEventListener('click', function() {
            cartPanel.style.display = cartPanel.style.display === 'block' ? 'none' : 'block';
            renderCartPanel();
        });
    }

    if (closeCartPanel) closeCartPanel.addEventListener('click', () => { document.getElementById('cartPanel').style.display = 'none'; });
    if (clearCartBtn) clearCartBtn.addEventListener('click', () => { if (confirm('Xóa toàn bộ giỏ hàng?')) clearCart(); });

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            const cart = getCart();
            if (!cart || cart.length === 0) {
                alert('Giỏ hàng trống');
                return;
            }
            openPaymentModal();
        });
    }

    // Payment modal handlers
    const paymentModal = document.getElementById('paymentModal');
    const paymentClose = document.getElementById('paymentClose');
    const paymentCancelBtn = document.getElementById('paymentCancelBtn');
    const paymentConfirmBtn = document.getElementById('paymentConfirmBtn');

    function closePaymentModal() {
        if (paymentModal) paymentModal.style.display = 'none';
    }

    if (paymentClose) paymentClose.addEventListener('click', closePaymentModal);
    if (paymentCancelBtn) paymentCancelBtn.addEventListener('click', closePaymentModal);

    if (paymentConfirmBtn) {
        paymentConfirmBtn.addEventListener('click', function() {
            // Confirm order: collect data and save to localStorage
            const cart = getCart();
            if (!cart || cart.length === 0) {
                alert('Giỏ hàng trống');
                return;
            }

            const customer = {
                name: document.getElementById('customerName')?.value || '',
                email: document.getElementById('customerEmail')?.value || '',
                phone: document.getElementById('customerPhone')?.value || '',
                notes: document.getElementById('orderNotes')?.value || '',
                method: document.getElementById('paymentMethod')?.value || 'cash'
            };

            const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

            // Get current user role
            const userData = JSON.parse(localStorage.getItem('cafeUser') || 'null');
            const userRole = userData?.role || 'user';
            
            // Set initial order status based on user role
            let orderStatus = 'Processing'; // Default for normal users
            if (userRole === 'admin') {
                // For admin, check if they selected a specific status in the payment modal
                const statusSelect = document.getElementById('orderStatusSelect');
                if (statusSelect) {
                    orderStatus = statusSelect.value || 'Processing';
                }
            }

            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: cart,
                total,
                customer,
                status: orderStatus,
                userRole: userRole,
                // attach user identifiers when available to associate orders with users
                userId: userData?.id || null,
                userEmail: userData?.email || (customer.email || null)
            };

            const orders = JSON.parse(localStorage.getItem('cafeOrders') || '[]');
            orders.unshift(order);
            localStorage.setItem('cafeOrders', JSON.stringify(orders));

            // Clear cart and UI
            clearCart();
            closePaymentModal();
            document.getElementById('cartPanel').style.display = 'none';

            // Celebration and notification
            try { createConfetti(); } catch (e) {}
            alert('Đặt hàng thành công! Cảm ơn bạn.');
        });
    }
});

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) return;
    
    // Check user role and show/hide status field
    const userData = JSON.parse(localStorage.getItem('cafeUser') || 'null');
    const userRole = userData?.role || 'user';
    const adminStatusField = document.getElementById('adminStatusField');
    if (adminStatusField) {
        adminStatusField.style.display = userRole === 'admin' ? 'block' : 'none';
    }
    
    // Populate order items
    const orderItems = document.getElementById('orderItems');
    const orderTotalPrice = document.getElementById('orderTotalPrice');
    const cart = getCart();
    orderItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:8px;';
        div.innerHTML = `<div>${item.name} x ${item.quantity}</div><div style="font-weight:700">${formatPrice(item.price*item.quantity)}</div>`;
        orderItems.appendChild(div);
    });
    orderTotalPrice.textContent = formatPrice(total);
    paymentModal.style.display = 'block';
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

async function saveReviewToFirebase(review) {
    try {
        const { collection, addDoc } = window.firebaseModules;
        const db = window.firebaseDB;
        
        // Thêm timestamp
        review.createdAt = new Date().toISOString();
        review.timestamp = Date.now();
        
        // XỬ LÝ ẢNH: CHUYỂN THÀNH BASE64 VÀ LƯU TRỰC TIẾP VÀO FIRESTORE
        const files = document.getElementById('reviewImages').files;
        if (files && files.length > 0) {
            review.images = await convertImagesToBase64(files);
            console.log(`✅ Đã chuyển ${review.images.length} ảnh thành Base64`);
        } else {
            review.images = [];
        }
        
        // FIRESTORE CÓ THỂ LƯU ẢNH BASE64 TRỰC TIẾP!
        const docRef = await addDoc(collection(db, "reviews"), review);
        console.log("✅ Review saved with images to Firestore:", docRef.id);
        
        // Cache vào localStorage
        saveReviewToLocalStorage(review);
        
        return docRef.id;
    } catch (error) {
        console.error("❌ Error saving review to Firestore:", error);
        // Fallback
        saveReviewToLocalStorage(review);
        return null;
    }
}

// Hàm chuyển ảnh thành Base64
async function convertImagesToBase64(files) {
    const base64Images = [];
    
    for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        
        // Kiểm tra kích thước (giới hạn 1MB cho Firestore)
        if (file.size > 1 * 1024 * 1024) {
            alert(`Ảnh ${file.name} quá lớn (>1MB). Vui lòng chọn ảnh nhỏ hơn.`);
            continue;
        }
        
        try {
            const base64 = await fileToBase64(file);
            base64Images.push({
                data: base64,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error(`Lỗi chuyển ảnh ${file.name}:`, error);
        }
    }
    
    return base64Images;
}

// Helper: File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Hàm upload hình ảnh riêng biệt
async function uploadReviewImages(files) {
    const uploadedImages = [];
    const { storageRef, uploadBytes, getDownloadURL } = window.firebaseModules;
    
    for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
            console.warn(`Ảnh ${file.name} vượt quá 5MB, bỏ qua`);
            continue;
        }
        
        try {
            // Tạo tên file unique
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const path = `reviews/${fileName}`;
            
            // Tạo storage reference
            const storage = window.firebaseStorage;
            const imageRef = storageRef(storage, path);
            
            // Upload file
            await uploadBytes(imageRef, file);
            
            // Lấy URL
            const downloadURL = await getDownloadURL(imageRef);
            uploadedImages.push(downloadURL);
            
            console.log(`✅ Uploaded image ${i + 1}: ${downloadURL.substring(0, 50)}...`);
        } catch (error) {
            console.error(`❌ Error uploading image ${file.name}:`, error);
        }
    }
    
    return uploadedImages;
}

// Hàm lấy đánh giá từ Firebase
async function loadReviewsFromFirebase() {
    try {
        const { collection, getDocs, query, orderBy, limit } = window.firebaseModules;
        const db = window.firebaseDB;
        
        // Query reviews từ Firebase, sắp xếp mới nhất trước
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${reviews.length} reviews from Firebase`);
        
        // Cache vào localStorage
        localStorage.setItem('cafeReviews', JSON.stringify(reviews));
        
        return reviews;
    } catch (error) {
        console.error("❌ Error loading reviews from Firebase:", error);
        // Fallback: dùng localStorage
        return loadReviewsFromLocalStorage();
    }
}

// Hàm hỗ trợ localStorage (fallback)
function saveReviewToLocalStorage(review) {
    let reviews = JSON.parse(localStorage.getItem('cafeReviews') || '[]');
    reviews.unshift(review);
    localStorage.setItem('cafeReviews', JSON.stringify(reviews));
}

function loadReviewsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cafeReviews') || '[]');
}
// Calculate and update rating statistics
async function updateRatingStatistics() {
    const reviews = await loadReviewsFromFirebase();
    
    if (reviews.length === 0) {
        updateRatingDisplay(0, 0, {});
        return;
    }
    
    // Tính toán rating
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating || 0), 0);
    const averageRating = (totalRating / totalReviews).toFixed(1);
    
    // Đếm theo sao
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
        const rating = parseInt(review.rating || 0);
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
        }
    });
    
    updateRatingDisplay(averageRating, totalReviews, ratingCounts);
}

// ==================== STAR RATING HANDLER ====================
function initStarRating() {
    const starRating = document.getElementById('starRating');
    const ratingValue = document.getElementById('ratingValue');
    const ratingText = document.getElementById('ratingText');
    
    if (!starRating || !ratingValue) return;
    
    const stars = starRating.querySelectorAll('i');
    let currentRating = 0;
    
    // Reset stars
    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.color = '#ddd';
        });
    }
    
    // Update stars display
    function updateStars(rating) {
        resetStars();
        
        for (let i = 0; i < rating; i++) {
            stars[i].classList.remove('far');
            stars[i].classList.add('fas');
            stars[i].style.color = '#f39c12';
        }
        
        // Update hidden input
        ratingValue.value = rating;
        
        // Update text
        if (ratingText) {
            const texts = ['', 'Rất tệ', 'Không hài lòng', 'Bình thường', 'Tốt', 'Xuất sắc'];
            ratingText.textContent = texts[rating] || '';
        }
    }
    
    // Add click event to each star
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            updateStars(rating);
        });
        
        // Hover effect
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            
            resetStars();
            for (let i = 0; i < hoverRating; i++) {
                stars[i].classList.remove('far');
                stars[i].classList.add('fas');
                stars[i].style.color = '#f8d04d'; // Lighter color for hover
            }
        });
        
        star.addEventListener('mouseleave', function() {
            updateStars(currentRating);
        });
    });
    
    // Reset stars when form is submitted
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('reset', function() {
            currentRating = 0;
            resetStars();
            ratingValue.value = 0;
            if (ratingText) ratingText.textContent = '';
        });
    }
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
if (document.querySelector('.review-form')) {
    document.addEventListener('DOMContentLoaded', async function() {
        // Update rating statistics
        await updateRatingStatistics();
        
        // Handle review form submission - SỬA LẠI
        const reviewForm = document.querySelector('.review-form');
        const reviewSuccess = document.getElementById('reviewSuccess');
        
// Handle review form submission - VERSION với popup
// Handle review form submission - VERSION với popup
if (reviewForm) {
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Kiểm tra rating đã chọn chưa
        const ratingValue = parseInt(document.getElementById('ratingValue').value || '0');
        if (ratingValue < 1) {
            alert('Vui lòng chọn số sao đánh giá!');
            return;
        }
        
        // Kiểm tra các trường bắt buộc
        const reviewerName = document.getElementById('reviewerName').value.trim();
        const reviewTitle = document.getElementById('reviewTitle').value.trim();
        const reviewContent = document.getElementById('reviewContent').value.trim();
        
        if (!reviewerName || !reviewTitle || !reviewContent) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        
        // Tắt nút submit để tránh double submit
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            name: reviewerName,
            email: document.getElementById('reviewerEmail').value.trim(),
            rating: ratingValue,
            title: reviewTitle,
            content: reviewContent,
            date: new Date().toISOString(),
            timestamp: Date.now(),
            id: 'review_' + Date.now()
            // Images sẽ được thêm trong saveReviewToFirebase
        };
        
        try {
            // Save to Firebase (hàm này sẽ tự động upload ảnh)
            const reviewId = await saveReviewToFirebase(formData);
            
            if (reviewId) {
                // HIỂN THỊ POPUP THÔNG BÁO
                const successPopup = document.getElementById('reviewSuccessPopup');
                if (successPopup) {
                    successPopup.style.display = 'flex';
                    
                    // Tự động đóng sau 3 giây
                    const autoClose = setTimeout(() => {
                        closeSuccessPopup();
                    }, 3000);
                    
                    // Thêm sự kiện cho nút đóng
                    const closeBtn = successPopup.querySelector('.close-popup-btn');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', function() {
                            clearTimeout(autoClose);
                            closeSuccessPopup();
                        });
                    }
                    
                    // Đóng khi click ra ngoài
                    successPopup.addEventListener('click', function(e) {
                        if (e.target === successPopup) {
                            clearTimeout(autoClose);
                            closeSuccessPopup();
                        }
                    });
                }
                
                // Update rating statistics
                await updateRatingStatistics();
                
                // Add to reviews display
                displayNewReview(formData);
                
                // Reset form
                reviewForm.reset();
                document.querySelectorAll('#starRating i').forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                    s.style.color = '#ddd';
                });
                document.getElementById('ratingText').textContent = '';
                document.getElementById('ratingValue').value = '0';
                
            }
        } catch (error) {
            console.error('❌ Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
        } finally {
            // Khôi phục nút submit
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Hàm đóng popup
function closeSuccessPopup() {
    const successPopup = document.getElementById('reviewSuccessPopup');
    if (successPopup) {
        successPopup.style.opacity = '0';
        setTimeout(() => {
            successPopup.style.display = 'none';
            successPopup.style.opacity = '1';
            
            // Cuộn lên phần hiển thị reviews mới
            const reviewsSection = document.getElementById('reviews');
            if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }
}
        
        // Load và hiển thị reviews
        await loadAndDisplayReviews();
    });
}

// Sửa hàm load reviews
async function loadAndDisplayReviews() {
    const reviews = await loadReviewsFromFirebase();
    const reviewsGrid = document.querySelector('.reviews-grid');
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    
    if (!reviewsGrid) return;
    
    if (reviews.length === 0) {
        reviewsGrid.innerHTML = `
            <div class="empty-reviews">
                <i class="fas fa-comments"></i>
                <h3>Chưa có đánh giá nào</h3>
                <p>Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    // Hiển thị 6 reviews đầu tiên
    const initialCount = 6;
    let displayedCount = 0;
    
    reviews.forEach((review, index) => {
        if (review && review.name && review.content) {
            const card = createReviewCard(review, index);
            if (index >= initialCount) {
                card.style.display = 'none';
                card.setAttribute('data-hidden', 'true');
            } else {
                displayedCount++;
            }
            reviewsGrid.appendChild(card);
        }
    });
    
    // Nút "Xem thêm"
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

// Tạo card review - HIỂN THỊ ẢNH LỚN TRỰC TIẾP
// Tạo card review - HIỂN THỊ ẢNH LỚN TRỰC TIẾP
function createReviewCard(review, index) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.setAttribute('data-rating', review.rating);
    card.setAttribute('data-index', index);
    
    const stars = '⭐'.repeat(parseInt(review.rating));
    const date = new Date(review.createdAt || review.date).toLocaleDateString('vi-VN');
    
    // Tạo HTML cơ bản cho card
    let html = `
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
    `;
    
    // HIỂN THỊ ẢNH LỚN TRỰC TIẾP - KHÔNG CẦN CLICK
    if (review.images && Array.isArray(review.images) && review.images.length > 0) {
        html += '<div class="review-images-direct">';
        
        review.images.forEach((img, idx) => {
            let imgSrc = '';
            
            if (typeof img === 'object') {
                imgSrc = img.data || img.url || '';
            } else if (typeof img === 'string') {
                imgSrc = img;
            }
            
            if (imgSrc) {
                html += `
                    <div class="review-image-item">
                        <img src="${imgSrc}" 
                             alt="Ảnh từ ${review.name}" 
                             class="review-direct-image"
                             >
                        <div class="image-info">Ảnh ${idx + 1}</div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
    }
        setTimeout(() => {
        const reviewCard = document.querySelector(`.review-card[data-index="${index}"]`);
        if (reviewCard) {
            const imageContainer = reviewCard.querySelector('.review-images-direct');
            if (imageContainer) {
                const imageCount = imageContainer.querySelectorAll('.review-image-item').length;
                
                // Xóa class cũ
                imageContainer.classList.remove('single-image', 'two-images', 'multiple-images');
                
                // Thêm class mới dựa trên số lượng ảnh
                if (imageCount === 1) {
                    imageContainer.classList.add('single-image');
                } else if (imageCount === 2) {
                    imageContainer.classList.add('two-images');
                } else {
                    imageContainer.classList.add('multiple-images');
                }
                
                // Thêm badge số lượng ảnh
                const imageItems = imageContainer.querySelectorAll('.review-image-item');
                imageItems.forEach((item, idx) => {
                    const badge = document.createElement('div');
                    badge.className = 'image-count-badge';
                    badge.textContent = idx + 1;
                    item.appendChild(badge);
                });
                
                // Thêm class has-images cho review card
                reviewCard.classList.add('has-images');
            }
        }
    }, 100);
    // Thêm footer
    html += `
        <div class="review-footer">
            <span class="review-date">${date}</span>
            ${review.id ? `<small class="review-id">#${review.id.substring(0, 8)}</small>` : ''}
            ${review.images && review.images.length > 0 ? 
                `<span class="photo-count"><i class="fas fa-camera"></i> ${review.images.length} ảnh</span>` : 
                ''}
        </div>
    `;
    
    card.innerHTML = html;
    return card;
}

// Hàm hiển thị ảnh lớn (cải tiến)
function showImageModal(imageSrc, reviewerName = 'Khách', imageNumber = 1) {
    // Xóa modal cũ nếu có
    const oldModal = document.querySelector('.image-modal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="position: relative; max-width: 90%; max-height: 90%;">
            <div style="position: absolute; top: -60px; right: 0; display: flex; gap: 10px; align-items: center;">
                <span style="color: white; font-size: 14px; background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 20px;">
                    Ảnh ${imageNumber} từ ${reviewerName}
                </span>
                <button class="close-modal" style="background: none; border: none; color: white; font-size: 30px; cursor: pointer; transition: transform 0.3s ease; padding: 5px 10px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <img src="${imageSrc}" alt="Ảnh từ ${reviewerName}" 
                 style="max-width: 100%; max-height: 90vh; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            
            <div style="position: absolute; bottom: -50px; left: 0; right: 0; text-align: center;">
                <button class="download-btn" style="background: #2A6BFF; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-download"></i> Tải xuống
                </button>
                <button class="close-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">
                    <i class="fas fa-times"></i> Đóng
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Thêm CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .close-modal:hover {
            transform: scale(1.2);
        }
        .download-btn:hover, .close-btn:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Xử lý sự kiện
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            style.remove();
        }, 300);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    
    // Tải ảnh
    modal.querySelector('.download-btn').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `cafe-focus-review-${reviewerName}-${imageNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Đóng khi click ra ngoài
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Đóng bằng phím ESC
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Thêm CSS vào head
const reviewImagesCSS = `
    .review-images {
        display: flex;
        gap: 10px;
        margin: 15px 0;
        overflow-x: auto;
        padding: 10px 0;
    }
    
    .review-images img {
        flex-shrink: 0;
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .review-images img:hover {
        transform: scale(1.05);
        border-color: #2A6BFF;
        box-shadow: 0 5px 15px rgba(42, 107, 255, 0.2);
    }
    
    .photo-count {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #f8f9fa;
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 0.85rem;
        color: #666;
    }
    
    .photo-count i {
        color: #2A6BFF;
    }
`;

// Thêm CSS vào head nếu chưa có
if (!document.querySelector('#review-images-css')) {
    const style = document.createElement('style');
    style.id = 'review-images-css';
    style.textContent = reviewImagesCSS;
    document.head.appendChild(style);
}

// Hàm hiển thị ảnh lớn
function showImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <img src="${imageSrc}" alt="Ảnh xem trước">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
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


// ==================== REVIEWS PAGE INITIALIZATION ====================
function initializeReviewsPage() {
    if (!document.querySelector('.reviews-hero')) return;
    
    console.log('📝 Initializing Reviews Page...');
    
    // Khởi tạo star rating
    initStarRating();
    
    // Cập nhật thống kê rating từ Firebase
    updateRatingStatistics();
    
    // Tải và hiển thị reviews từ Firebase
    loadAndDisplayReviews();
    
    // Thiết lập bộ lọc
    setTimeout(() => {
        setupFilterListeners();
    }, 1000);
}

// Sửa hàm loadAndDisplayReviews để tối ưu
async function loadAndDisplayReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    
    if (!reviewsGrid) return;
    
    console.log('🔄 Loading reviews from Firebase...');
    
    // Hiển thị trạng thái loading
    reviewsGrid.innerHTML = `
        <div class="loading-reviews">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Đang tải đánh giá...</p>
        </div>
    `;
    
    try {
        // Load reviews từ Firebase
        const reviews = await loadReviewsFromFirebase();
        console.log(`✅ Loaded ${reviews.length} reviews from Firebase`);
        
        if (reviews.length === 0) {
            reviewsGrid.innerHTML = `
                <div class="empty-reviews">
                    <i class="fas fa-comments"></i>
                    <h3>Chưa có đánh giá nào</h3>
                    <p>Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
                </div>
            `;
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Xóa loading state
        reviewsGrid.innerHTML = '';
        
        // Hiển thị 6 reviews đầu tiên
        const initialCount = 6;
        let displayedCount = 0;
        
        reviews.forEach((review, index) => {
            if (review && review.name && review.content) {
                const card = createReviewCard(review, index);
                if (index >= initialCount) {
                    card.style.display = 'none';
                    card.setAttribute('data-hidden', 'true');
                } else {
                    displayedCount++;
                }
                reviewsGrid.appendChild(card);
            }
        });
        
        // Nút "Xem thêm"
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
        
    } catch (error) {
        console.error('❌ Error loading reviews:', error);
        reviewsGrid.innerHTML = `
            <div class="error-reviews">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Không thể tải đánh giá</h3>
                <p>Vui lòng kiểm tra kết nối internet và thử lại</p>
                <button onclick="loadAndDisplayReviews()" class="btn btn-secondary">
                    <i class="fas fa-redo"></i> Thử lại
                </button>
            </div>
        `;
    }
}

// Thêm CSS cho loading và error states
const reviewsCSS = document.createElement('style');
reviewsCSS.textContent = `
    .loading-reviews,
    .empty-reviews,
    .error-reviews {
        text-align: center;
        padding: 3rem;
        grid-column: 1 / -1;
    }
    
    .loading-reviews i {
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }
    
    .empty-reviews i {
        font-size: 3rem;
        color: #ddd;
        margin-bottom: 1rem;
    }
    
    .error-reviews i {
        font-size: 3rem;
        color: #ff6b6b;
        margin-bottom: 1rem;
    }
    
    .loading-reviews p,
    .empty-reviews p,
    .error-reviews p {
        color: #666;
        margin-bottom: 1rem;
    }
    
    .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .review-card {
        background: white;
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
        animation: fadeInUp 0.6s ease;
    }
    
    .review-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .review-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .reviewer-avatar {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
        margin-right: 1rem;
    }
    
    .reviewer-info h3 {
        margin: 0 0 0.3rem 0;
        font-size: 1.1rem;
    }
    
    .review-rating {
        color: #f8c120;
        font-size: 1rem;
    }
    
    .review-title {
        font-size: 1.2rem;
        margin: 0 0 1rem 0;
        color: #333;
    }
    
    .review-content {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .review-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
        font-size: 0.9rem;
        color: #888;
    }
    
    .review-images {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
    
    .review-images img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .review-images img:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(reviewsCSS);





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
async function viewAllFirebaseReviews() {
    try {
        const reviews = await loadReviewsFromFirebase();
        console.log('=== TẤT CẢ ĐÁNH GIÁ TỪ FIREBASE ===');
        console.table(reviews);
        return reviews;
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function exportFirebaseReviews() {
    const reviews = await loadReviewsFromFirebase();
    const dataStr = JSON.stringify(reviews, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cafe-reviews-firebase-' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

console.log('🔥 Firebase Reviews System Loaded!');
console.log('💡 Commands: viewAllFirebaseReviews(), exportFirebaseReviews()');
// Load user info on page load
loadUserInfo();
// Debug Firebase initialization
function checkFirebaseSetup() {
    console.log('=== FIREBASE DEBUG ===');
    console.log('Firebase DB available:', !!window.firebaseDB);
    console.log('Firebase Storage available:', !!window.firebaseStorage);
    console.log('Firebase Modules:', Object.keys(window.firebaseModules || {}));
    
    if (!window.firebaseDB || !window.firebaseModules) {
        console.error('❌ Firebase chưa được khởi tạo!');
        return false;
    }
    
    const requiredModules = ['collection', 'addDoc', 'storageRef', 'uploadBytes', 'getDownloadURL'];
    const missingModules = requiredModules.filter(mod => !window.firebaseModules[mod]);
    
    if (missingModules.length > 0) {
        console.error('❌ Thiếu Firebase modules:', missingModules);
        return false;
    }
    
    console.log('✅ Firebase setup OK');
    return true;
}
// Thêm vào cuối script.js
const imageStyles = document.createElement('style');
imageStyles.textContent = `
    /* Base64 image styles */
    .review-images {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        overflow-x: auto;
        padding: 10px 0;
    }
    
    .review-images img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 10px;
        border: 2px solid #e9ecef;
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .review-images img:hover {
        transform: scale(1.05);
        border-color: #2A6BFF;
        box-shadow: 0 5px 15px rgba(42, 107, 255, 0.2);
    }
    
    /* Image modal */
    .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .modal-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    
    .close-modal {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 30px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .close-modal:hover {
        transform: scale(1.2);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(imageStyles);
