const STORAGE_KEY = 'browserWrappedData';

export async function getData() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || createEmptyData();
}

export async function saveData(data) {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

function createEmptyData() {
  return {
    domains: {},
    dailyTotals: {},
    hourlyTotals: {},
    settings: {
      trackingEnabled: true,
      idleThresholdMinutes: 5,
      lastWrappedWeek: null,
      wrappedSeenWeeks: []
    },
    meta: {
      installDate: Date.now(),
      lastActive: Date.now()
    }
  };
}

export function ensureDomainRecord(data, domain) {
  if (!data.domains[domain]) {
    data.domains[domain] = {
      totalSeconds: 0,
      visits: 0,
      firstVisit: Date.now(),
      lastVisit: Date.now(),
      daily: {},
      hourly: {},
      dailyHourly: {}
    };
  }
  return data.domains[domain];
}

export async function addTime(domain, seconds, dateKey, hour) {
  if (seconds <= 0) return;
  const data = await getData();
  const record = ensureDomainRecord(data, domain);
  record.totalSeconds += seconds;
  record.lastVisit = Date.now();
  record.daily[dateKey] = (record.daily[dateKey] || 0) + seconds;
  record.hourly[hour] = (record.hourly[hour] || 0) + seconds;
  if (!record.dailyHourly[dateKey]) record.dailyHourly[dateKey] = {};
  record.dailyHourly[dateKey][hour] = (record.dailyHourly[dateKey][hour] || 0) + seconds;

  data.dailyTotals[dateKey] = (data.dailyTotals[dateKey] || 0) + seconds;
  data.hourlyTotals[hour] = (data.hourlyTotals[hour] || 0) + seconds;
  data.meta.lastActive = Date.now();

  await saveData(data);
}

export async function recordVisit(domain, dateKey) {
  const data = await getData();
  const record = ensureDomainRecord(data, domain);
  record.visits += 1;
  record.lastVisit = Date.now();
  if (!record.firstVisit) record.firstVisit = Date.now();
  data.meta.lastActive = Date.now();
  await saveData(data);
}

export async function getSettings() {
  const data = await getData();
  return data.settings;
}

export async function updateSettings(partial) {
  const data = await getData();
  data.settings = { ...data.settings, ...partial };
  await saveData(data);
  return data.settings;
}

export async function markWrappedSeen(weekKey) {
  const data = await getData();
  if (!data.settings.wrappedSeenWeeks.includes(weekKey)) {
    data.settings.wrappedSeenWeeks.push(weekKey);
  }
  data.settings.lastWrappedWeek = weekKey;
  await saveData(data);
}

export async function clearAllData() {
  await saveData(createEmptyData());
}
