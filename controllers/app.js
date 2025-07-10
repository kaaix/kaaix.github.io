import { projects, experiences } from '../models/data.js';

const routes = {
  '': 'about',
  '#about': 'about',
  '#experience': 'experience',
  '#projects': 'projects',
  '#contact': 'contact'
};

async function loadHTML(path) {
  const res = await fetch(path);
  return await res.text();
}

async function renderPage() {
  document.getElementById('header').innerHTML  = await loadHTML('views/header.html');
  document.getElementById('footer').innerHTML  = await loadHTML('views/footer.html');
  const view = routes[window.location.hash] || 'about';
  document.getElementById('app').innerHTML     = await loadHTML(`views/${view}.html`);
  if (view === 'projects')   renderProjects();
  if (view === 'experience') renderExperience();
}

window.addEventListener('hashchange', renderPage);
window.addEventListener('DOMContentLoaded', renderPage);

function renderProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = projects.map(p => `
    <div class="card">
      <div class="card-content">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <a href="${p.link}"
           target="_blank"
           class="button">
          Voir sur GitHub
        </a>
      </div>
    </div>
  `).join('');
}

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

document.addEventListener('DOMContentLoaded', () => {
  // 1. Burger menu mobile
  const burger = document.querySelector('.burger');
  const nav    = document.querySelector('.site-header nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // 2. Scroll-reveal des sections
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  document.querySelectorAll('.section').forEach(sec => {
    observer.observe(sec);
  });

  // 3. Barre de progression du scroll
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent      = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = percent + '%';
  });

  // 4. Scrollspy (section active dans le menu)
  const sections = document.querySelectorAll('.section');
  const links    = document.querySelectorAll('.site-header nav a');
  window.addEventListener('scroll', () => {
    let idx = sections.length;
    while (--idx && window.scrollY + 100 < sections[idx].offsetTop) {}
    links.forEach(a => a.classList.remove('active'));
    links[idx].classList.add('active');
  });
});
