// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-slide-up');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    // Basic toggle logic for mobile menu, could be enhanced with actual class toggle
    // For now we'll just alert as a placeholder since we haven't built the full mobile sidebar CSS
    alert('Menu mobile click');
});

// GitHub API Integration
const GITHUB_USERNAME = 'felpmrts';
const projectsGrid = document.getElementById('projects-grid');
const loadingState = document.getElementById('projects-loading');

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
        
        if (!response.ok) {
            throw new Error('Falha ao carregar repositórios');
        }
        
        const repos = await response.json();
        
        // Filter out forks and profile README, get top 6
        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME)
            .slice(0, 6);
            
        renderProjects(filteredRepos);
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        loadingState.innerHTML = `<p>Não foi possível carregar os projetos. Visite meu <a href="https://github.com/${GITHUB_USERNAME}" style="color: var(--accent-blue)">GitHub</a>.</p>`;
    }
}

function renderProjects(repos) {
    loadingState.style.display = 'none';
    
    if (repos.length === 0) {
        projectsGrid.innerHTML = '<p>Nenhum projeto público encontrado no momento.</p>';
        return;
    }
    
    const projectsHTML = repos.map((repo, index) => {
        // Formata as tags/linguagens
        const language = repo.language ? `<span class="project-tag">${repo.language}</span>` : '';
        // Uma tag extra pra manter o estilo visual rico
        const dataTag = (repo.name.toLowerCase().includes('data') || repo.name.toLowerCase().includes('etl') || repo.description?.toLowerCase().includes('dados')) 
            ? `<span class="project-tag">Data Engineering</span>` 
            : '';
            
        const iaTag = (repo.name.toLowerCase().includes('ai') || repo.name.toLowerCase().includes('ml') || repo.description?.toLowerCase().includes('machine')) 
            ? `<span class="project-tag">Artificial Intelligence</span>` 
            : '';
            
        const description = repo.description || 'Um projeto exploratório focado em desenvolvimento e resolução de problemas.';
        
        // Add animation delay based on index
        const delay = index * 100;

        return `
            <div class="project-card reveal-slide-up" style="animation-delay: ${delay}ms; opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms;">
                <div class="project-title">
                    <h3>${repo.name}</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="project-tags">
                    ${language}
                    ${dataTag}
                    ${iaTag}
                </div>
                <p class="project-desc">${description}</p>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    Ver Repositório 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
        `;
    }).join('');
    
    projectsGrid.innerHTML = projectsHTML;
    
    // Trigger intersection observer for newly added elements
    setTimeout(() => {
        const newCards = document.querySelectorAll('.project-card');
        newCards.forEach(card => {
            // Force reflow
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
    
});
