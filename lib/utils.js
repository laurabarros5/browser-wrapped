export function extractDomain(url) {
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
      url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('devtools://')) {
    return null;
  }
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname || null;
  } catch {
    return null;
  }
}

export function formatDuration(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (remainMins === 0) return `${hours}h`;
  return `${hours}h ${remainMins}min`;
}

export function formatDurationLong(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const parts = [];
  if (h > 0) parts.push(`${h} hora${h !== 1 ? 's' : ''}`);
  if (m > 0) parts.push(`${m} minuto${m !== 1 ? 's' : ''}`);
  if (h === 0 && m === 0) parts.push(`${s} segundo${s !== 1 ? 's' : ''}`);
  return parts.join(' e ');
}

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeekBounds(weekKey) {
  const [yearStr, weekPart] = weekKey.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekPart, 10);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { start: monday, end: sunday };
}

export function getPreviousWeekKey(date = new Date()) {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 7);
  return getWeekKey(prev);
}

export function getHourBucket(date = new Date()) {
  return date.getHours();
}

export function getDayName(date = new Date()) {
  return ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][date.getDay()];
}

export function getDomainLabel(domain) {
  const parts = domain.split('.');
  if (parts.length >= 2) {
    const name = parts[parts.length - 2];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return domain;
}

export function getFaviconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
