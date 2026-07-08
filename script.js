/* ===================================
   Portfolio - Interactive JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Particle Background ----
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.5 ? 258 : 175; // purple or teal
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }

            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = ((150 - dist) / 150) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });


    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });


    // ---- Mobile Navigation ----
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });


    // ---- Typing Animation ----
    const codeLines = [
        '<span class="code-keyword">class</span> <span class="code-class">TaylorHammond</span>:',
        '    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(<span class="code-param">self</span>):',
        '        <span class="code-param">self</span>.name = <span class="code-string">"Taylor Hammond"</span>',
        '        <span class="code-param">self</span>.a_levels = [<span class="code-string">"CS"</span>, <span class="code-string">"IT"</span>, <span class="code-string">"Business"</span>]',
        '        <span class="code-param">self</span>.focus = <span class="code-string">"Tech &amp; Data Strategy"</span>',
        '',
        '    <span class="code-keyword">def</span> <span class="code-func">get_passion</span>(<span class="code-param">self</span>):',
        '        <span class="code-keyword">return</span> <span class="code-string">"Using code &amp; data for business"</span>',
        '',
        '<span class="code-comment"># Let\'s build something amazing!</span>',
        'me = <span class="code-class">TaylorHammond</span>()',
    ];

    const typedCodeEl = document.getElementById('typed-code');
    let currentLine = 0;
    let currentChar = 0;
    let isTyping = true;

    // Add syntax highlighting styles dynamically
    const syntaxStyles = document.createElement('style');
    syntaxStyles.textContent = `
        .code-keyword { color: #c678dd; }
        .code-class { color: #e5c07b; }
        .code-func { color: #61afef; }
        .code-param { color: #e06c75; }
        .code-string { color: #98c379; }
        .code-comment { color: #5c6370; font-style: italic; }
    `;
    document.head.appendChild(syntaxStyles);

    function getPlainText(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent;
    }

    function typeCode() {
        if (currentLine >= codeLines.length) return;

        const line = codeLines[currentLine];
        const plainText = getPlainText(line);

        if (currentChar <= plainText.length) {
            // Build output up to current line
            let output = '';
            for (let i = 0; i < currentLine; i++) {
                output += codeLines[i] + '\n';
            }
            // Current line: show partial plain text but we need to handle HTML
            // Simple approach: show completed lines as HTML, current line char by char
            const partialPlain = plainText.substring(0, currentChar);
            output += escapeHtml(partialPlain);

            typedCodeEl.innerHTML = output;
            currentChar++;
            setTimeout(typeCode, 35 + Math.random() * 30);
        } else {
            // Line complete, replace with formatted HTML version
            let output = '';
            for (let i = 0; i <= currentLine; i++) {
                output += codeLines[i] + '\n';
            }
            typedCodeEl.innerHTML = output;

            currentLine++;
            currentChar = 0;
            setTimeout(typeCode, 200);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Start typing after a delay
    setTimeout(typeCode, 1000);


    // ---- Scroll Animations (Intersection Observer) ----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars when visible
                if (entry.target.classList.contains('skill-card')) {
                    const fill = entry.target.querySelector('.skill-fill');
                    if (fill) {
                        const level = fill.getAttribute('data-level');
                        setTimeout(() => {
                            fill.style.width = level + '%';
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);

    // Add animation class to elements
    const animateElements = document.querySelectorAll(
        '.about-card, .timeline-item, .skill-card, .project-card, .contact-card, .contact-form, .empty-state, .placeholder-card, .concepts-section'
    );

    animateElements.forEach((el, i) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        observer.observe(el);
    });


    // ---- Counter Animation ----
    function animateCounter(el, target) {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);

        function update() {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
        update();
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    if (target > 0) {
                        animateCounter(num, target);
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);


    // ---- Contact Form ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('form-submit');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }


    // ---- Footer Year ----
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }


    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ---- Tilt effect on glass cards (desktop only) ----
    if (window.matchMedia('(min-width: 768px)').matches) {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

});
