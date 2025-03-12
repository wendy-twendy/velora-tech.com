/**
 * Projects Module
 * Handles project filtering and interactions
 */

export function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Initialize with "All" filter active
    filterProjects('all');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            filterProjects(filterValue);
        });
    });
    
    function filterProjects(category) {
        projectCards.forEach(card => {
            const projectCategory = card.getAttribute('data-category');
            
            // Hide all projects first
            card.style.display = 'none';
            
            // Show projects based on filter
            if (category === 'all' || projectCategory === category) {
                card.style.display = 'block';
                
                // Add animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
    }
    
    // Add hover effect to project cards
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.project-overlay').style.opacity = '1';
            card.querySelector('.project-info').style.transform = 'translateY(0)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-overlay').style.opacity = '0';
            card.querySelector('.project-info').style.transform = 'translateY(20px)';
        });
    });
}
