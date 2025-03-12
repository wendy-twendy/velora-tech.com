/**
 * Cursor Module
 * Handles custom cursor effects and interactions
 */

export function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);
    
    let cursorVisible = false;
    let cursorEnlarged = false;
    
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursor.style.opacity = '1';
            cursorVisible = true;
        }
        
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Mouse leave
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });
    
    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Link hover effect
    const links = document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn');
    
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(0, 195, 255, 0.5) 0%, rgba(110, 0, 255, 0.3) 70%, transparent 100%)';
            cursorEnlarged = true;
        });
        
        link.addEventListener('mouseout', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(110, 0, 255, 0.5) 0%, rgba(0, 195, 255, 0.3) 70%, transparent 100%)';
            cursorEnlarged = false;
        });
    });
}
