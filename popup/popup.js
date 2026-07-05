import { formatDuration, getDateKey, getWeekKey, getFaviconUrl } from '../lib/utils.js';
import { getTodayData, getWeekData } from '../lib/stats.js';

async function loadStats() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  const live = await chrome.runtime.sendMessage({ type: 'GET_LIVE' });
  const data = response.data;

  const todayKey = getDateKey();
  const weekKey = getWeekKey();
  const today = getTodayData(data, todayKey);
  const week = getWeekData(data, weekKey);

  updateLiveStatus(live);
  updateSummary(today, week);
  renderSiteList('today-list', today.domains, today.totalSeconds);
  renderSiteList('week-list', week.topDomains, week.totalSeconds);
  renderCategories(week.categories, week.totalSeconds);
}

function updateLiveStatus(live) {
  const el = document.getElementById('live-status');
  if (live.isTracking && live.activeDomain) {
    el.textContent = `▶ ${live.activeDomain}`;
    el.classList.add('tracking');
  } else if (live.activeDomain) {
    el.textContent = `⏸ ${live.activeDomain}`;
    el.classList.remove('tracking');
  } else {
    el.textContent = 'Nenhuma aba ativa';
    el.classList.remove('tracking');
  }
}

function updateSummary(today, week) {
  document.getElementById('today-time').textContent = formatDuration(today.totalSeconds);
  document.getElementById('week-time').textContent = formatDuration(week.totalSeconds);
  document.getElementById('site-count').textContent = week.uniqueDomains || 0;
}

function renderSiteList(containerId, domains, totalSeconds) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!domains.length) {
    container.innerHTML = '<li class="empty-state">Navegue um pouco — seus dados aparecerão aqui.</li>';
    return;
  }

  domains.slice(0, 8).forEach((site, i) => {
    const pct = totalSeconds > 0 ? (site.seconds / totalSeconds) * 100 : 0;
    const li = document.createElement('li');
    li.className = 'site-item';
    li.innerHTML = `
      <span class="site-rank ${i < 3 ? 'top' : ''}">${i + 1}</span>
      <img class="site-favicon" src="${getFaviconUrl(site.domain)}" alt="" onerror="this.style.display='none'">
      <div class="site-info">
        <div class="site-name">${site.label}</div>
        <div class="site-meta">${site.category.emoji} ${site.category.label}</div>
        <div class="site-bar-wrap"><div class="site-bar" style="width:${pct}%"></div></div>
      </div>
      <span class="site-time">${formatDuration(site.seconds)}</span>
    `;
    container.appendChild(li);
  });
}

function renderCategories(categories, totalSeconds) {
  const container = document.getElementById('category-list');
  container.innerHTML = '';

  if (!categories.length) {
    container.innerHTML = '<li class="empty-state">Categorias aparecerão conforme você navega.</li>';
    return;
  }

  categories.forEach(cat => {
    const pct = totalSeconds > 0 ? (cat.seconds / totalSeconds) * 100 : 0;
    const li = document.createElement('li');
    li.className = 'category-item';
    li.innerHTML = `
      <span class="category-emoji">${cat.emoji}</span>
      <div class="category-info">
        <div class="category-name">${cat.label}</div>
        <div class="category-bar-wrap">
          <div class="category-bar" style="width:${pct}%; background:${cat.color}"></div>
        </div>
      </div>
      <span class="category-time">${formatDuration(cat.seconds)}</span>
    `;
    container.appendChild(li);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
  });
});

document.getElementById('btn-wrapped').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('wrapped/wrapped.html') });
});

document.getElementById('link-options').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

loadStats();
setInterval(loadStats, 5000);
