/**
 * Navigation Module
 * Handles navigation functionality including mobile menu toggle and smooth scrolling
 */

/**
 * Initialize navigation functionality
 */
export function initNavigation(): void {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-link');
    const mobileMenuToggle: HTMLElement | null = document.querySelector('.mobile-menu-toggle');
    const navMenu: HTMLElement | null = document.querySelector('.nav-links');
    
    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
            
            const targetId: string | null = link.getAttribute('href');
            if (targetId) {
                const targetSection: HTMLElement | null = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add active class to nav links based on scroll position
    window.addEventListener('scroll', highlightNavOnScroll);
}

/**
 * Highlight navigation links based on scroll position
 */
function highlightNavOnScroll(): void {
    const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section');
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-link');
    
    let currentSection: string = '';
    
    sections.forEach(section => {
        const sectionTop: number = section.offsetTop - 100;
        const sectionHeight: number = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            const sectionId: string | null = section.getAttribute('id');
            if (sectionId) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href: string | null = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}
