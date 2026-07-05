import { categorizeDomain, getAllCategories } from './categories.js';
import { getWeekBounds, getDomainLabel, getDayName } from './utils.js';

export function getWeekData(data, weekKey) {
  const { start, end } = getWeekBounds(weekKey);
  const domainStats = {};
  let totalSeconds = 0;
  let totalVisits = 0;
  const dailyBreakdown = {};
  const hourlyBreakdown = Array(24).fill(0);
  const categoryBreakdown = {};

  for (const [domain, record] of Object.entries(data.domains)) {
    let weekSeconds = 0;
    let weekVisits = 0;

    for (const [dateKey, seconds] of Object.entries(record.daily || {})) {
      const date = new Date(dateKey + 'T12:00:00');
      if (date >= start && date <= end) {
        weekSeconds += seconds;
        dailyBreakdown[dateKey] = (dailyBreakdown[dateKey] || 0) + seconds;
      }
    }

    if (weekSeconds > 0) {
      const cat = categorizeDomain(domain);
      categoryBreakdown[cat.id] = categoryBreakdown[cat.id] || { ...cat, seconds: 0, domains: [] };
      categoryBreakdown[cat.id].seconds += weekSeconds;
      if (!categoryBreakdown[cat.id].domains.includes(domain)) {
        categoryBreakdown[cat.id].domains.push(domain);
      }

      domainStats[domain] = {
        domain,
        label: getDomainLabel(domain),
        seconds: weekSeconds,
        visits: record.visits,
        category: cat
      };
      totalSeconds += weekSeconds;
    }
  }

  for (const [, record] of Object.entries(data.domains)) {
    for (const [dateKey, hours] of Object.entries(record.dailyHourly || {})) {
      const date = new Date(dateKey + 'T12:00:00');
      if (date < start || date > end) continue;
      for (const [hourStr, seconds] of Object.entries(hours)) {
        hourlyBreakdown[parseInt(hourStr, 10)] += seconds;
      }
    }
  }

  const topDomains = Object.values(domainStats)
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 10);

  const topByVisits = Object.values(domainStats)
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  const categories = Object.values(categoryBreakdown)
    .sort((a, b) => b.seconds - a.seconds);

  const busiestDay = Object.entries(dailyBreakdown)
    .sort((a, b) => b[1] - a[1])[0];

  const peakHour = hourlyBreakdown
    .map((seconds, hour) => ({ hour, seconds }))
    .sort((a, b) => b.seconds - a.seconds)[0];

  const uniqueDomains = Object.keys(domainStats).length;

  return {
    weekKey,
    start,
    end,
    totalSeconds,
    totalVisits,
    uniqueDomains,
    topDomains,
    topByVisits,
    categories,
    dailyBreakdown,
    hourlyBreakdown,
    busiestDay: busiestDay ? { date: busiestDay[0], seconds: busiestDay[1], dayName: getDayName(new Date(busiestDay[0] + 'T12:00:00')) } : null,
    peakHour,
    browsingPersonality: getBrowsingPersonality(peakHour, categories, totalSeconds)
  };
}


function getBrowsingPersonality(peakHour, categories, totalSeconds) {
  if (!peakHour || totalSeconds === 0) {
    return { title: 'Explorador', description: 'Você ainda está começando sua jornada de descobertas online.' };
  }

  const hour = peakHour.hour;
  const topCat = categories[0];

  if (hour >= 22 || hour < 5) {
    return {
      title: 'Coruja Noturna 🦉',
      description: 'Seu pico de navegação acontece tarde da noite. A internet é seu refúgio depois do pôr do sol.'
    };
  }
  if (hour >= 5 && hour < 9) {
    return {
      title: 'Madrugador ☀️',
      description: 'Você começa o dia navegando antes da maioria acordar. Produtividade matinal é seu forte.'
    };
  }
  if (topCat?.id === 'dev') {
    return {
      title: 'Builder 💻',
      description: 'Ferramentas de desenvolvimento dominam seu tempo. Você vive construindo coisas.'
    };
  }
  if (topCat?.id === 'entertainment') {
    return {
      title: 'Entretenido 🎬',
      description: 'Streaming e diversão online são seus companheiros favoritos da semana.'
    };
  }
  if (topCat?.id === 'social') {
    return {
      title: 'Conectado 💬',
      description: 'Redes sociais são seu hub principal. Você adora estar por dentro de tudo.'
    };
  }
  if (topCat?.id === 'learning') {
    return {
      title: 'Estudioso 📚',
      description: 'Plataformas de aprendizado ocupam seu tempo. Conhecimento é sua prioridade.'
    };
  }
  return {
    title: 'Navegador Versátil 🌐',
    description: 'Seus interesses online são diversos. Você equilibra várias áreas da web.'
  };
}

export function getTodayData(data, dateKey) {
  const domainStats = [];
  let totalSeconds = 0;

  for (const [domain, record] of Object.entries(data.domains)) {
    const seconds = record.daily?.[dateKey] || 0;
    if (seconds > 0) {
      domainStats.push({
        domain,
        label: getDomainLabel(domain),
        seconds,
        visits: record.visits,
        category: categorizeDomain(domain)
      });
      totalSeconds += seconds;
    }
  }

  return {
    totalSeconds,
    domains: domainStats.sort((a, b) => b.seconds - a.seconds)
  };
}

export function getAllTimeStats(data) {
  const domains = Object.entries(data.domains)
    .map(([domain, record]) => ({
      domain,
      label: getDomainLabel(domain),
      seconds: record.totalSeconds,
      visits: record.visits,
      category: categorizeDomain(domain)
    }))
    .sort((a, b) => b.seconds - a.seconds);

  const totalSeconds = domains.reduce((sum, d) => sum + d.seconds, 0);
  const categoryTotals = {};

  for (const d of domains) {
    const cat = d.category;
    categoryTotals[cat.id] = categoryTotals[cat.id] || { ...cat, seconds: 0, count: 0 };
    categoryTotals[cat.id].seconds += d.seconds;
    categoryTotals[cat.id].count += 1;
  }

  return {
    totalSeconds,
    domains,
    categories: Object.values(categoryTotals).sort((a, b) => b.seconds - a.seconds),
    uniqueDomains: domains.length,
    totalVisits: domains.reduce((sum, d) => sum + d.visits, 0)
  };
}

export function generateFunFacts(weekData) {
  const facts = [];
  const { topDomains, totalSeconds, uniqueDomains, busiestDay, peakHour } = weekData;

  if (topDomains.length > 0) {
    const top = topDomains[0];
    const pct = Math.round((top.seconds / totalSeconds) * 100);
    facts.push(`${pct}% do seu tempo online foi em ${top.label}`);
  }

  if (uniqueDomains > 0) {
    facts.push(`Você visitou ${uniqueDomains} sites diferentes esta semana`);
  }

  if (busiestDay) {
    facts.push(`${busiestDay.dayName} foi seu dia mais ativo`);
  }

  if (peakHour) {
    const period = peakHour.hour >= 12 ? 'tarde/noite' : 'manhã';
    facts.push(`Seu horário de pico é por volta das ${peakHour.hour}h (${period})`);
  }

  if (topDomains.length >= 3) {
    const top3Seconds = topDomains.slice(0, 3).reduce((s, d) => s + d.seconds, 0);
    const top3Pct = Math.round((top3Seconds / totalSeconds) * 100);
    facts.push(`Seus 3 sites favoritos representam ${top3Pct}% do tempo total`);
  }

  return facts;
}

export { getAllCategories };
