async function loadSettings() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_STATS' });
  const settings = response.data.settings;
  document.getElementById('tracking-enabled').checked = settings.trackingEnabled;
  document.getElementById('idle-threshold').value = settings.idleThresholdMinutes || 5;
}

async function saveSettings() {
  const settings = {
    trackingEnabled: document.getElementById('tracking-enabled').checked,
    idleThresholdMinutes: parseInt(document.getElementById('idle-threshold').value, 10) || 5
  };
  await chrome.runtime.sendMessage({ type: 'UPDATE_SETTINGS', settings });
  const msg = document.getElementById('saved-msg');
  msg.textContent = '✓ Configurações salvas';
  setTimeout(() => { msg.textContent = ''; }, 2000);
}

document.getElementById('tracking-enabled').addEventListener('change', saveSettings);
document.getElementById('idle-threshold').addEventListener('change', saveSettings);

document.getElementById('btn-clear').addEventListener('click', async () => {
  if (confirm('Tem certeza? Todos os dados de navegação serão apagados permanentemente.')) {
    await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
    alert('Dados apagados com sucesso.');
  }
});

document.getElementById('btn-wrapped').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('wrapped/wrapped.html') });
});

loadSettings();
