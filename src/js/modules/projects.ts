/**
 * Projects Module
 * Handles project filtering and interactions
 */

import { Project } from '../../types/index';

/**
 * Initialize project filters
 */
export function initProjectFilters(): void {
    const filterButtons: NodeListOf<Element> = document.querySelectorAll('.filter-btn');
    const projectCards: NodeListOf<Element> = document.querySelectorAll('.project-card');
    
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
            const filterValue: string | null = button.getAttribute('data-filter');
            
            // Filter projects
            if (filterValue) {
                filterProjects(filterValue);
            }
        });
    });
    
    function filterProjects(category: string): void {
        projectCards.forEach(card => {
            const projectCategory: string | null = card.getAttribute('data-category');
            const cardElement = card as HTMLElement;
            
            // Hide all projects first
            cardElement.style.display = 'none';
            
            // Show projects based on filter
            if (category === 'all' || projectCategory === category) {
                cardElement.style.display = 'block';
                
                // Add animation
                setTimeout(() => {
                    cardElement.style.opacity = '1';
                    cardElement.style.transform = 'translateY(0)';
                }, 100);
            } else {
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'translateY(20px)';
            }
        });
    }
    
    // Add hover effect to project cards
    projectCards.forEach(card => {
        const cardElement = card as HTMLElement;
        const overlay = cardElement.querySelector('.project-overlay') as HTMLElement;
        const projectInfo = cardElement.querySelector('.project-info') as HTMLElement;
        
        if (overlay && projectInfo) {
            cardElement.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                projectInfo.style.transform = 'translateY(0)';
            });
            
            cardElement.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                projectInfo.style.transform = 'translateY(20px)';
            });
        }
    });
}
