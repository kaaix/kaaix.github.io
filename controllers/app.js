// controllers/app.js

// Import uniquement les expériences (data.js reste utilisé pour la section Expérience)
import { experiences } from '../models/data.js';

// ————————————————
// 0. Animation Matrix rouge
// ————————————————
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Ajuste la taille du canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Paramètres de l'effet
  const chars = '01アカサタナハマヤラワ';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: columns }, () => 1);

  // Boucle de dessin
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0033';  // Rouge vif
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 33);
}

// Configuration des routes (charge les vues statiques dans views/)
const routes = {
  '':           'about',
  '#about':     'about',
  '#experience':'experience',
  '#projects':  'projects',
  '#contact':   'contact'
};

// Charge le HTML d'une vue
async function loadHTML(path) {
  const res = await fetch(`views/${path}`);
  return res.ok ? await res.text() : '';
}

// Initialise le scroll reveal
function initScrollReveal() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section').forEach(sec => observer.observe(sec));
}

// Rendu dynamique des vues
async function renderPage() {
  document.getElementById('header').innerHTML = await loadHTML('header.html');
  document.getElementById('footer').innerHTML = await loadHTML('footer.html');

  const view = routes[window.location.hash] || 'about';
  document.getElementById('app').innerHTML = await loadHTML(`${view}.html`);

  initScrollReveal();
  if (view === 'experience') renderExperience();
}

// Génère la timeline d'expérience
function renderExperience() {
  const container = document.getElementById('experience-list');
  container.innerHTML = experiences.map(e => `
    <div class="timeline-item">
      <span class="timeline-icon"></span>
      <div class="timeline-content">
        <h3>${e.title}</h3>
        <span class="date">${e.period}</span>
        <p>${e.desc}</p>
      </div>
    </div>
  `).join('');
}

// Écoute les changements de hash
window.addEventListener('hashchange', renderPage);

// Initialisation au chargement du DOM
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Chargement des vues
  await renderPage();

  // 2. Démarrage de l'animation Matrix
  initMatrix();

  // 3. Burger menu mobile
  const burger = document.querySelector('.burger');
  const nav    = document.querySelector('.site-header nav');
  burger.addEventListener('click', () => nav.classList.toggle('open'));

  // 4. Barre de progression du scroll
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
  });

  // 5. Scrollspy (lien actif)
  const links = document.querySelectorAll('.site-header nav a');
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    let idx = sections.length;
    while (--idx && window.scrollY + 100 < sections[idx].offsetTop) {}
    links.forEach(a => a.classList.remove('active'));
    links[idx].classList.add('active');
  });
});
