const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnExport = document.getElementById('btn-export');
const statusBar = document.getElementById('status-bar');
const progressBar = document.getElementById('progress-bar');
const statFollowing = document.getElementById('stat-following');
const statNonFollowers = document.getElementById('stat-nonfollowers');
const userList = document.getElementById('user-list');
const notOnIg = document.getElementById('not-on-ig');
const btnLangEs = document.getElementById('btn-lang-es');
const btnLangEn = document.getElementById('btn-lang-en');

const i18n = {
  en: {
    ready: 'Ready to start.',
    labelFollowing: 'Following',
    labelNonFollowers: "Don't follow back",
    btnStart: 'Analyze',
    btnStop: 'Stop',
    btnExport: 'Export',
    analyzing: 'Analyzing...',
    starting: 'Starting analysis...',
    progress: (f, t, p) => `Analyzing... ${f}/${t} (${p}%)`,
    sleeping: 'Pausing 10s to avoid temporary block...',
    done: (n) => `Done! ${n} user(s) don't follow you back.`,
    stopped: 'Stopped by user.',
    errorReload: 'Error: reload the Instagram page and try again.',
    error: (m) => `Error: ${m}`,
    emptyScanning: 'Scanning...',
    emptyInitial: 'Press "Analyze" on Instagram.com',
    unfollowDone: 'Done',
    unfollowError: 'Error',
    notOnIg: `To use this extension, open <a href="https://www.instagram.com" target="_blank">instagram.com</a> and click here again.`,
    exportFilename: 'non_followers.json',
  },
  es: {
    ready: 'Listo para comenzar.',
    labelFollowing: 'Siguiendo',
    labelNonFollowers: 'No te siguen',
    btnStart: 'Analizar',
    btnStop: 'Detener',
    btnExport: 'Exportar',
    analyzing: 'Analizando...',
    starting: 'Iniciando análisis...',
    progress: (f, t, p) => `Analizando... ${f}/${t} (${p}%)`,
    sleeping: 'Pausando 10s para evitar bloqueo temporal...',
    done: (n) => `¡Listo! ${n} usuario(s) no te siguen de vuelta.`,
    stopped: 'Detenido por el usuario.',
    errorReload: 'Error: recarga la página de Instagram e intenta de nuevo.',
    error: (m) => `Error: ${m}`,
    emptyScanning: 'Analizando...',
    emptyInitial: 'Presiona "Analizar" en Instagram.com',
    unfollowDone: 'Hecho',
    unfollowError: 'Error',
    notOnIg: `Para usar esta extensión, abre <a href="https://www.instagram.com" target="_blank">instagram.com</a> y vuelve a hacer clic aquí.`,
    exportFilename: 'no_te_siguen.json',
  },
};

let lang = localStorage.getItem('ifc_lang') || 'en';
let nonFollowersData = [];

function t() { return i18n[lang]; }

function applyLang() {
  document.getElementById('label-following').textContent = t().labelFollowing;
  document.getElementById('label-nonfollowers').textContent = t().labelNonFollowers;
  btnStart.textContent = t().btnStart;
  btnStop.textContent = t().btnStop;
  btnExport.textContent = t().btnExport;
  btnLangEs.classList.toggle('active', lang === 'es');
  btnLangEn.classList.toggle('active', lang === 'en');

  if (!statusBar.dataset.key) {
    statusBar.textContent = t().ready;
  }

  if (notOnIg.style.display !== 'none') {
    notOnIg.innerHTML = t().notOnIg;
  }

  const emptyState = userList.querySelector('.empty-state');
  if (emptyState) {
    const key = emptyState.dataset.key;
    if (key) emptyState.textContent = t()[key];
  }
}

function setStatus(text, key = null) {
  statusBar.textContent = text;
  statusBar.dataset.key = key || '';
}

function setEmptyState(key) {
  userList.innerHTML = `<div class="empty-state" data-key="${key}">${t()[key]}</div>`;
}

btnLangEn.addEventListener('click', () => {
  lang = 'en';
  localStorage.setItem('ifc_lang', lang);
  applyLang();
});

btnLangEs.addEventListener('click', () => {
  lang = 'es';
  localStorage.setItem('ifc_lang', lang);
  applyLang();
});

async function getActiveInstagramTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  if (tab && tab.url && tab.url.startsWith('https://www.instagram.com')) {
    return tab;
  }
  return null;
}

function renderUsers(users) {
  userList.innerHTML = '';

  if (users.length === 0) {
    setEmptyState('emptyScanning');
    return;
  }

  for (const user of users) {
    const row = document.createElement('div');
    row.className = 'user-row';
    row.dataset.userId = user.id;

    row.innerHTML = `
      <img src="${user.profile_pic_url}" alt="${user.username}" onerror="this.src='icons/icon48.png'" />
      <div class="user-info">
        <div class="username">
          <a href="https://www.instagram.com/${user.username}/" target="_blank">@${user.username}</a>
        </div>
        <div class="fullname">${user.full_name || ''}</div>
      </div>
      <button class="btn-unfollow" data-id="${user.id}" data-username="${user.username}">Unfollow</button>
    `;

    userList.appendChild(row);
  }

  userList.querySelectorAll('.btn-unfollow').forEach(btn => {
    btn.addEventListener('click', handleUnfollow);
  });
}

async function handleUnfollow(e) {
  const btn = e.currentTarget;
  const userId = btn.dataset.id;

  btn.classList.add('loading');
  btn.disabled = true;
  btn.textContent = '...';

  const tab = await getActiveInstagramTab();
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, { type: 'UNFOLLOW', userId }, (response) => {
    if (response?.ok) {
      btn.textContent = t().unfollowDone;
      btn.classList.remove('loading');
      btn.classList.add('done');
      nonFollowersData = nonFollowersData.filter(u => u.id !== userId);
      statNonFollowers.textContent = nonFollowersData.length;
    } else {
      btn.textContent = t().unfollowError;
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });
}

function setRunning(running) {
  btnStart.disabled = running;
  btnStop.disabled = !running;
}

btnStart.addEventListener('click', async () => {
  const tab = await getActiveInstagramTab();

  if (!tab) {
    userList.style.display = 'none';
    notOnIg.style.display = 'block';
    notOnIg.innerHTML = t().notOnIg;
    return;
  }

  notOnIg.style.display = 'none';
  userList.style.display = 'flex';

  nonFollowersData = [];
  setEmptyState('emptyScanning');
  statFollowing.textContent = '—';
  statNonFollowers.textContent = '—';
  progressBar.style.width = '0%';
  btnExport.disabled = true;

  setRunning(true);
  setStatus(t().starting);

  chrome.tabs.sendMessage(tab.id, { type: 'START' }, () => {
    if (chrome.runtime.lastError) {
      setStatus(t().errorReload);
      setRunning(false);
    }
  });
});

btnStop.addEventListener('click', async () => {
  const tab = await getActiveInstagramTab();
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { type: 'STOP' });
  setRunning(false);
  setStatus(t().stopped);
});

btnExport.addEventListener('click', () => {
  if (!nonFollowersData.length) return;
  const blob = new Blob([JSON.stringify(nonFollowersData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = t().exportFilename;
  a.click();
  URL.revokeObjectURL(url);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.source !== 'content') return;

  if (message.type === 'progress') {
    const pct = message.total ? Math.round((message.fetched / message.total) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    setStatus(t().progress(message.fetched, message.total, pct));
    statFollowing.textContent = message.total;
    nonFollowersData = message.nonFollowers;
    statNonFollowers.textContent = nonFollowersData.length;
    renderUsers(nonFollowersData);
  }

  if (message.type === 'sleeping') {
    setStatus(t().sleeping);
  }

  if (message.type === 'done') {
    nonFollowersData = message.nonFollowers;
    statNonFollowers.textContent = nonFollowersData.length;
    progressBar.style.width = '100%';
    setStatus(t().done(nonFollowersData.length));
    setRunning(false);
    btnExport.disabled = nonFollowersData.length === 0;
    renderUsers(nonFollowersData);
  }

  if (message.type === 'error') {
    setStatus(t().error(message.message));
    setRunning(false);
  }
});

applyLang();
