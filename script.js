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
        
        // Filter out forks, profile README, and datastruct-leetcode repo, get top 6
        const filteredRepos = repos
            .filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME && repo.name !== 'datastruct-leetcode')
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

// Constellation Animation
const canvas = document.getElementById('constellation');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    
    // Config
    const config = {
        particleCount: 120, // max count
        particleRadius: 1.5,
        lineDistance: 130,
        particleSpeed: 0.3,
        color: 'rgba(0, 242, 254, 0.6)' // accent blue
    };
    
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // density based on area
        let count = Math.floor((width * height) / 12000);
        if (count > config.particleCount) count = config.particleCount;
        initParticles(count);
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, config.particleRadius, 0, Math.PI * 2);
            ctx.fillStyle = config.color;
            ctx.fill();
        }
    }

    function initParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.lineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (distance / config.lineDistance);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            if (mouse.x != null && mouse.y != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.lineDistance * 1.5) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    const opacity = 1 - (distance / (config.lineDistance * 1.5));
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.6})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// Contact Form AJAX Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default redirection
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Mensagem enviada com sucesso!');
                contactForm.reset();
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Houve um erro ao enviar a mensagem. Tente novamente mais tarde.');
        } finally {
        }
    });
}

// Rockets Parallax Animation in Sobre Mim Section
const rocketsCanvas = document.getElementById('rockets-canvas');
if (rocketsCanvas) {
    const rctx = rocketsCanvas.getContext('2d');
    let rwidth, rheight;
    let shootingStars = [];

    function initStars() {
        const sobreSection = document.getElementById('sobre');
        if (!sobreSection) return;
        
        rwidth = rocketsCanvas.width = sobreSection.offsetWidth;
        rheight = rocketsCanvas.height = sobreSection.offsetHeight;

        shootingStars = [];
    }

    function drawShootingStar(ctx, star) {
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.angle);
        
        const gradient = ctx.createLinearGradient(0, 0, -star.length, 0);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-star.length, 0);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.thickness;
        ctx.stroke();
        
        // Draw star head
        ctx.beginPath();
        ctx.arc(0, 0, star.thickness * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        ctx.restore();
    }

    window.addEventListener('resize', initStars);

    function animateStars() {
        requestAnimationFrame(animateStars);
        
        const rect = rocketsCanvas.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return; // Only animate when visible

        rctx.clearRect(0, 0, rwidth, rheight);

        // Randomly spawn shooting stars with high intensity
        if (Math.random() < 0.15 && shootingStars.length < 25) {
            // Spawn from top or left edge to go diagonally down-right
            let startX, startY;
            if (Math.random() > 0.5) {
                startX = Math.random() * rwidth;
                startY = -50;
            } else {
                startX = -50;
                startY = Math.random() * rheight;
            }

            shootingStars.push({
                x: startX,
                y: startY,
                length: Math.random() * 100 + 50,
                speed: Math.random() * 15 + 15, // Fast!
                angle: Math.PI / 4 + (Math.random() * 0.1 - 0.05), // roughly diagonal down-right
                thickness: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }

        // Move and draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            let star = shootingStars[i];
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
            drawShootingStar(rctx, star);

            // Remove if off screen
            if (star.x > rwidth + star.length || star.y > rheight + star.length) {
                shootingStars.splice(i, 1);
            }
        }
    }

    initStars();
    animateStars();
}
