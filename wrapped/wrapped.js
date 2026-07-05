import { formatDuration, formatDurationLong, getWeekKey, getPreviousWeekKey, getFaviconUrl, getDomainLabel } from '../lib/utils.js';
import { getWeekData, generateFunFacts } from '../lib/stats.js';
import { markWrappedSeen } from '../lib/storage.js';

const BG_CLASSES = ['slide-bg-green', 'slide-bg-purple', 'slide-bg-orange', 'slide-bg-blue', 'slide-bg-pink', 'slide-bg-dark'];
const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

let currentSlide = 0;
let slides = [];
let weekData = null;
let selectedWeekKey = null;

async function init() {
  const params = new URLSearchParams(location.search);
  selectedWeekKey = params.get('week') || getPreviousWeekKey();

  const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  weekData = getWeekData(response.data, selectedWeekKey);

  if (weekData.totalSeconds < 60) {
    showEmptyState();
    return;
  }

  await markWrappedSeen(selectedWeekKey);
  buildSlides();
  renderSlides();
  setupNavigation();
  addWeekSelector();
}

function showEmptyState() {
  document.getElementById('app').innerHTML = `
    <div class="empty-wrapped">
      <h1>🌐 Browser Wrapped</h1>
      <p>Ainda não há dados suficientes para esta semana. Navegue normalmente e volte no domingo para ver seu Wrapped!</p>
      <button class="btn-start" onclick="window.close()">Entendido</button>
    </div>
  `;
}

function formatWeekRange(start, end) {
  const opts = { day: 'numeric', month: 'short' };
  const s = start.toLocaleDateString('pt-BR', opts);
  const e = end.toLocaleDateString('pt-BR', opts);
  return `${s} — ${e}`;
}

function buildSlides() {
  const w = weekData;
  const top = w.topDomains[0];
  const facts = generateFunFacts(w);
  const weekRange = formatWeekRange(w.start, w.end);

  slides = [
    {
      bg: 'slide-bg-green',
      html: `
        <div class="slide-label">Browser Wrapped</div>
        <div class="slide-title">Sua semana na web</div>
        <div class="slide-subtitle">${weekRange}</div>
        <div class="slide-big-number" style="margin-top:40px">🎉</div>
        <div class="slide-subtitle">Preparado? Vamos ver como você navegou.</div>
      `
    },
    {
      bg: 'slide-bg-purple',
      html: `
        <div class="slide-label">Tempo total</div>
        <div class="slide-title">Você passou</div>
        <div class="slide-big-number">${formatDuration(w.totalSeconds)}</div>
        <div class="slide-subtitle">${formatDurationLong(w.totalSeconds)} navegando esta semana</div>
      `
    },
    {
      bg: 'slide-bg-orange',
      html: `
        <div class="slide-label">Seu #1</div>
        <div class="slide-hero-site">
          <img class="hero-favicon" src="${getFaviconUrl(top.domain)}" alt="">
          <div class="hero-domain">${top.label}</div>
          <div class="hero-time">${formatDuration(top.seconds)}</div>
          <div class="slide-subtitle">${Math.round((top.seconds / w.totalSeconds) * 100)}% do seu tempo online</div>
        </div>
      `
    },
    {
      bg: 'slide-bg-blue',
      html: `
        <div class="slide-label">Top 5 sites</div>
        <div class="slide-title">Seus favoritos</div>
        <div class="top-list">${buildTopList(w.topDomains.slice(0, 5), w.totalSeconds)}</div>
      `
    },
    {
      bg: 'slide-bg-pink',
      html: `
        <div class="slide-label">Por dia</div>
        <div class="slide-title">Sua rotina semanal</div>
        <div class="chart-bars">${buildDailyChart(w.dailyBreakdown)}</div>
        ${w.busiestDay ? `<div class="slide-subtitle" style="margin-top:16px">${w.busiestDay.dayName} foi seu dia mais ativo</div>` : ''}
      `
    },
    {
      bg: 'slide-bg-dark',
      html: `
        <div class="slide-label">Horários</div>
        <div class="slide-title">Quando você navega</div>
        <div class="hour-chart">${buildHourChart(w.hourlyBreakdown, w.peakHour?.hour)}</div>
        ${w.peakHour ? `<div class="slide-subtitle" style="margin-top:16px">Pico às ${w.peakHour.hour}h</div>` : ''}
      `
    },
    {
      bg: 'slide-bg-purple',
      html: `
        <div class="slide-label">Categorias</div>
        <div class="slide-title">O que você mais usa</div>
        <div class="category-grid">${buildCategoryGrid(w.categories, w.totalSeconds)}</div>
      `
    },
    {
      bg: 'slide-bg-green',
      html: `
        <div class="slide-label">Seu perfil</div>
        <div class="personality-badge">${w.browsingPersonality.title.split(' ').pop()}</div>
        <div class="slide-title">${w.browsingPersonality.title.replace(/[^\w\sáéíóúãõâêôçÁÉÍÓÚÃÕÂÊÔÇ]/gi, '').trim()}</div>
        <div class="slide-subtitle">${w.browsingPersonality.description}</div>
      `
    },
    {
      bg: 'slide-bg-orange',
      html: `
        <div class="slide-label">Curiosidades</div>
        <div class="slide-title">Você sabia?</div>
        <ul class="facts-list">${facts.map(f => `<li>✦ ${f}</li>`).join('')}</ul>
      `
    },
    {
      bg: 'slide-bg-green',
      html: `
        <div class="slide-label">Fim</div>
        <div class="slide-title">Até a próxima semana!</div>
        <div class="slide-subtitle">${w.uniqueDomains} sites · ${formatDuration(w.totalSeconds)} · ${w.topDomains.length} favoritos</div>
        <div class="slide-big-number" style="font-size:64px;margin-top:32px">🌐</div>
        <div class="slide-subtitle">Browser Wrapped · ${weekRange}</div>
      `
    }
  ];
}

function buildTopList(domains, total) {
  const rankClass = ['gold', 'silver', 'bronze', '', ''];
  return domains.map((d, i) => {
    const pct = Math.round((d.seconds / total) * 100);
    return `
      <div class="top-item">
        <span class="top-rank ${rankClass[i]}">${i + 1}</span>
        <img class="top-favicon" src="${getFaviconUrl(d.domain)}" alt="">
        <div class="top-info">
          <div class="top-name">${d.label}</div>
          <div class="top-pct">${pct}% do total · ${d.category.emoji} ${d.category.label}</div>
        </div>
        <span class="top-time">${formatDuration(d.seconds)}</span>
      </div>
    `;
  }).join('');
}

function buildDailyChart(dailyBreakdown) {
  const entries = Object.entries(dailyBreakdown).sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) return '<div class="slide-subtitle">Sem dados diários</div>';
  const max = Math.max(...entries.map(([, s]) => s));
  return entries.map(([date, seconds]) => {
    const day = new Date(date + 'T12:00:00').getDay();
    const h = max > 0 ? (seconds / max) * 100 : 0;
    return `
      <div class="chart-bar-col">
        <div class="chart-bar" style="height:${h}%"></div>
        <span class="chart-label">${DAY_LABELS[day]}</span>
      </div>
    `;
  }).join('');
}

function buildHourChart(hourlyBreakdown, peakHour) {
  const max = Math.max(...hourlyBreakdown, 1);
  return hourlyBreakdown.map((seconds, hour) => {
    const h = (seconds / max) * 100;
    const isPeak = hour === peakHour;
    return `<div class="hour-bar ${isPeak ? 'peak' : ''}" style="height:${h}%" title="${hour}h"></div>`;
  }).join('');
}

function buildCategoryGrid(categories, total) {
  return categories.slice(0, 4).map(cat => {
    const pct = Math.round((cat.seconds / total) * 100);
    return `
      <div class="category-card">
        <div class="category-card-emoji">${cat.emoji}</div>
        <div class="category-card-name">${cat.label}</div>
        <div class="category-card-time">${formatDuration(cat.seconds)}</div>
        <div class="category-card-pct">${pct}%</div>
      </div>
    `;
  }).join('');
}

function renderSlides() {
  const container = document.getElementById('slides');
  const dotsContainer = document.getElementById('dots');

  container.innerHTML = slides.map((slide, i) =>
    `<div class="slide ${slide.bg} ${i === 0 ? 'active' : ''}" data-index="${i}">${slide.html}</div>`
  ).join('');

  dotsContainer.innerHTML = slides.map((_, i) =>
    `<div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
  ).join('');

  updateProgress();
}

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;
  currentSlide = index;

  document.querySelectorAll('.slide').forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
  updateProgress();
}

function updateProgress() {
  const pct = ((currentSlide + 1) / slides.length) * 100;
  document.getElementById('progress').style.width = `${pct}%`;
}

function setupNavigation() {
  document.getElementById('btn-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('btn-next').addEventListener('click', () => goToSlide(currentSlide + 1));

  document.getElementById('dots').addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    if (dot) goToSlide(parseInt(dot.dataset.index, 10));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goToSlide(currentSlide + 1); }
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
  });
}

function addWeekSelector() {
  const select = document.createElement('select');
  select.className = 'week-selector';
  select.title = 'Selecionar semana';

  const currentWeek = getWeekKey();
  const options = [getPreviousWeekKey(), currentWeek];
  const unique = [...new Set(options)];

  unique.forEach(wk => {
    const opt = document.createElement('option');
    opt.value = wk;
    opt.textContent = `Semana ${wk.split('-W')[1]}`;
    opt.selected = wk === selectedWeekKey;
    select.appendChild(opt);
  });

  select.addEventListener('change', () => {
    location.search = `?week=${select.value}`;
    location.reload();
  });

  document.getElementById('app').prepend(select);
}

init();
