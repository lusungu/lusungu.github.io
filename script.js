// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setTheme(theme) {
    if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', theme);
}

// Initialize theme
setTheme(getPreferredTheme());

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(current === 'light' ? 'dark' : 'light');
});

// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'light' : 'dark');
    }
});

// Interactive Background - Mouse Glow
const bgGlow = document.querySelector('.bg-glow');
let glowTimeout;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return; // Disable on mobile

    bgGlow.style.left = e.clientX + 'px';
    bgGlow.style.top = e.clientY + 'px';
    bgGlow.classList.add('active');

    clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => {
        bgGlow.classList.remove('active');
    }, 1000);
});

document.addEventListener('mouseleave', () => {
    bgGlow.classList.remove('active');
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--nav-bg-scroll)';
    } else {
        navbar.style.background = 'var(--nav-bg)';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '-50px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add a small delay based on element position for stagger effect
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// Observe all animatable elements with stagger delays
const animatableElements = document.querySelectorAll('.skill-category, .timeline-item, .achievement-card, .education-card, .stat-card, .project-card, .recognition-card');

animatableElements.forEach((el, index) => {
    el.classList.add('fade-in');
    // Stagger within viewport groups
    el.dataset.delay = (index % 4) * 80;
    observer.observe(el);
});

// Add CSS for smooth fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translate3d(0, 25px, 0);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
    }

    .fade-in.visible {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }

    .timeline-item.fade-in {
        transition-delay: calc(var(--index, 0) * 0.08s);
    }

    .stat-card.fade-in,
    .skill-category.fade-in,
    .achievement-card.fade-in,
    .education-card.fade-in,
    .project-card.fade-in,
    .recognition-card.fade-in {
        transform: translate3d(0, 25px, 0) scale(0.98);
    }

    .stat-card.fade-in.visible,
    .skill-category.fade-in.visible,
    .achievement-card.fade-in.visible,
    .education-card.fade-in.visible,
    .project-card.fade-in.visible,
    .recognition-card.fade-in.visible {
        transform: translate3d(0, 0, 0) scale(1);
    }
`;
document.head.appendChild(style);

// Add staggered delay to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.setProperty('--index', index);
});

// Typing effect for terminal line
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            // Slightly variable timing for natural feel
            const delay = 80 + Math.random() * 40;
            setTimeout(typeWriter, delay);
        } else {
            // Add blinking cursor after typing completes
            typingText.innerHTML += '<span class="cursor">_</span>';

            // Add smooth cursor blink animation
            const cursorStyle = document.createElement('style');
            cursorStyle.textContent = `
                .cursor {
                    animation: smoothBlink 1.2s ease-in-out infinite;
                }
                @keyframes smoothBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(cursorStyle);
        }
    }

    // Start typing after hero animation begins
    setTimeout(typeWriter, 600);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active state styling
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-menu a.active {
        color: var(--text-primary);
    }
    .nav-menu a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);

// Back to top button
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Console Easter egg
console.log('%cHey there, curious developer!', 'font-size: 20px; font-weight: bold;');
console.log('%cLusungu E. Chihana - Innovation & Systems Leader', 'font-size: 14px; color: #0f766e;');
console.log('%cConnect on LinkedIn: linkedin.com/in/lusungu-chihana', 'font-size: 12px; color: #94a3b8;');
