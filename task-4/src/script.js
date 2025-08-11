// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Real-time screen width and breakpoint detection
    function updateScreenInfo() {
        const width = window.innerWidth;
        const screenWidthElement = document.getElementById('screen-width');
        const currentBreakpointElement = document.getElementById('current-breakpoint');
        const breakpointBars = document.querySelectorAll('.breakpoint-bar');
        
        if (screenWidthElement) {
            screenWidthElement.textContent = width;
        }
        
        // Remove active class from all bars
        breakpointBars.forEach(bar => bar.classList.remove('active'));
        
        // Determine current breakpoint
        let breakpoint = 'Desktop';
        let activeBar = null;
        
        if (width <= 320) {
            breakpoint = 'Extra Small Mobile';
            activeBar = document.querySelector('.breakpoint-bar.mobile');
        } else if (width <= 480) {
            breakpoint = 'Mobile';
            activeBar = document.querySelector('.breakpoint-bar.mobile');
        } else if (width <= 768) {
            breakpoint = 'Tablet';
            activeBar = document.querySelector('.breakpoint-bar.tablet');
        } else if (width <= 1024) {
            breakpoint = 'Laptop';
            activeBar = document.querySelector('.breakpoint-bar.laptop');
        } else {
            breakpoint = 'Desktop';
            activeBar = document.querySelector('.breakpoint-bar.desktop');
        }
        
        if (currentBreakpointElement) {
            currentBreakpointElement.textContent = breakpoint;
        }
        
        if (activeBar) {
            activeBar.classList.add('active');
        }
    }
    
    // Update screen info on load and resize
    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Form submission handling
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '#e5e7eb';
                }
            });
            
            if (isValid) {
                alert('Thank you for your message! We\'ll get back to you soon.');
                form.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    document.querySelectorAll('.feature-card, .portfolio-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Responsive image loading
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Handle image load errors
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.log('Image failed to load:', this.src);
        });
    });
}

// Call image optimization when DOM is loaded
document.addEventListener('DOMContentLoaded', optimizeImages);

// Viewport meta tag adjustment for iOS
function adjustViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        // Prevent zoom on input focus on iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
    }
}

adjustViewport();

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    // Close mobile menu on orientation change
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    
    // Recalculate viewport height for better mobile experience
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Performance optimization: Debounced resize handler
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle any resize-specific logic here
        console.log('Resize completed');
    }, 250);
});