import { extractDomain, getDateKey, getHourBucket, getWeekKey, getPreviousWeekKey } from '../lib/utils.js';
import { addTime, recordVisit, getData, getSettings, updateSettings } from '../lib/storage.js';

let activeTabId = null;
let activeDomain = null;
let activeStartTime = null;
let isWindowFocused = true;
let isUserIdle = false;
let lastVisitDomain = null;

const TICK_INTERVAL_MS = 1000;
const FLUSH_INTERVAL_MS = 15000;

async function init() {
  const settings = await getSettings();
  chrome.idle.setDetectionInterval((settings.idleThresholdMinutes || 5) * 60);

  if (settings.trackingEnabled) {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (activeTab) await startTracking(activeTab);
  }

  setInterval(tick, TICK_INTERVAL_MS);
  setInterval(flushTime, FLUSH_INTERVAL_MS);

  chrome.alarms.create('weeklyWrappedCheck', { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener(handleAlarm);
}

async function handleAlarm(alarm) {
  if (alarm.name === 'weeklyWrappedCheck') {
    await checkWeeklyWrapped();
  }
}

async function checkWeeklyWrapped() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  if (day === 0 && hour >= 18) {
    const prevWeek = getPreviousWeekKey(now);
    const settings = await getSettings();
    if (!settings.wrappedSeenWeeks.includes(prevWeek)) {
      chrome.notifications?.create?.('weekly-wrapped', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'Seu Browser Wrapped está pronto! 🎉',
        message: 'Veja suas estatísticas de navegação da semana passada.',
        buttons: [{ title: 'Ver Wrapped' }]
      });
    }
  }
}

function shouldTrack() {
  return activeDomain && isWindowFocused && !isUserIdle;
}

async function startTracking(tab) {
  if (!tab?.id || !tab.url) return;
  const domain = extractDomain(tab.url);
  if (!domain) {
    await stopTracking();
    return;
  }

  if (activeDomain && activeDomain !== domain) {
    await flushTime();
  }

  activeTabId = tab.id;
  activeDomain = domain;
  activeStartTime = Date.now();

  if (lastVisitDomain !== domain) {
    lastVisitDomain = domain;
    await recordVisit(domain, getDateKey());
  }
}

async function stopTracking() {
  await flushTime();
  activeTabId = null;
  activeDomain = null;
  activeStartTime = null;
}

async function flushTime() {
  if (!activeDomain || !activeStartTime) return;
  const elapsed = (Date.now() - activeStartTime) / 1000;
  if (elapsed > 0 && shouldTrack()) {
    await addTime(activeDomain, elapsed, getDateKey(), getHourBucket());
  }
  activeStartTime = Date.now();
}

function tick() {
  if (!shouldTrack()) return;
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const settings = await getSettings();
  if (!settings.trackingEnabled) return;
  try {
    const tab = await chrome.tabs.get(tabId);
    await startTracking(tab);
  } catch { /* tab closed */ }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const settings = await getSettings();
  if (!settings.trackingEnabled) return;
  if (tab.active && (changeInfo.url || changeInfo.status === 'complete')) {
    await startTracking(tab);
  }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  const settings = await getSettings();
  if (!settings.trackingEnabled) return;

  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    await flushTime();
    isWindowFocused = false;
  } else {
    isWindowFocused = true;
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) await startTracking(tab);
  }
});

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state === 'idle' || state === 'locked') {
    await flushTime();
    isUserIdle = true;
  } else {
    isUserIdle = false;
    activeStartTime = Date.now();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    getData().then(data => sendResponse({ data }));
    return true;
  }
  if (message.type === 'GET_LIVE') {
    sendResponse({
      activeDomain,
      isTracking: shouldTrack(),
      sessionSeconds: activeStartTime ? Math.floor((Date.now() - activeStartTime) / 1000) : 0
    });
    return true;
  }
  if (message.type === 'UPDATE_SETTINGS') {
    updateSettings(message.settings).then(s => sendResponse({ settings: s }));
    return true;
  }
  if (message.type === 'CLEAR_DATA') {
    import('../lib/storage.js').then(({ clearAllData }) => {
      clearAllData().then(() => sendResponse({ ok: true }));
    });
    return true;
  }
});

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('wrapped/wrapped.html') });
});

chrome.notifications.onButtonClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('wrapped/wrapped.html') });
});

init();
