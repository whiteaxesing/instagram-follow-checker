const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnExport = document.getElementById('btn-export');
const statusBar = document.getElementById('status-bar');
const progressBar = document.getElementById('progress-bar');
const statFollowing = document.getElementById('stat-following');
const statNonFollowers = document.getElementById('stat-nonfollowers');
const userList = document.getElementById('user-list');
const notOnIg = document.getElementById('not-on-ig');

let nonFollowersData = [];

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
    userList.innerHTML = '<div class="empty-state">No se encontraron usuarios aún...</div>';
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
  const username = btn.dataset.username;

  btn.classList.add('loading');
  btn.disabled = true;
  btn.textContent = '...';

  const tab = await getActiveInstagramTab();
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, { type: 'UNFOLLOW', userId }, (response) => {
    if (response?.ok) {
      btn.textContent = 'Hecho';
      btn.classList.remove('loading');
      btn.classList.add('done');
      nonFollowersData = nonFollowersData.filter(u => u.id !== userId);
      statNonFollowers.textContent = nonFollowersData.length;
    } else {
      btn.textContent = 'Error';
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
    return;
  }

  notOnIg.style.display = 'none';
  userList.style.display = 'flex';

  nonFollowersData = [];
  userList.innerHTML = '<div class="empty-state">Analizando...</div>';
  statFollowing.textContent = '—';
  statNonFollowers.textContent = '—';
  progressBar.style.width = '0%';
  btnExport.disabled = true;

  setRunning(true);
  statusBar.textContent = 'Iniciando análisis...';

  chrome.tabs.sendMessage(tab.id, { type: 'START' }, (response) => {
    if (chrome.runtime.lastError) {
      statusBar.textContent = 'Error: recarga la página de Instagram e intenta de nuevo.';
      setRunning(false);
    }
  });
});

btnStop.addEventListener('click', async () => {
  const tab = await getActiveInstagramTab();
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, { type: 'STOP' });
  setRunning(false);
  statusBar.textContent = 'Detenido por el usuario.';
});

btnExport.addEventListener('click', () => {
  if (!nonFollowersData.length) return;
  const blob = new Blob([JSON.stringify(nonFollowersData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'no_te_siguen.json';
  a.click();
  URL.revokeObjectURL(url);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.source !== 'content') return;

  if (message.type === 'progress') {
    const pct = message.total ? Math.round((message.fetched / message.total) * 100) : 0;
    progressBar.style.width = `${pct}%`;
    statusBar.textContent = `Analizando... ${message.fetched}/${message.total} (${pct}%)`;
    statFollowing.textContent = message.total;
    nonFollowersData = message.nonFollowers;
    statNonFollowers.textContent = nonFollowersData.length;
    renderUsers(nonFollowersData);
  }

  if (message.type === 'sleeping') {
    statusBar.textContent = message.message;
  }

  if (message.type === 'done') {
    nonFollowersData = message.nonFollowers;
    statNonFollowers.textContent = nonFollowersData.length;
    progressBar.style.width = '100%';
    statusBar.textContent = `¡Listo! ${nonFollowersData.length} usuario(s) no te siguen de vuelta.`;
    setRunning(false);
    btnExport.disabled = nonFollowersData.length === 0;
    renderUsers(nonFollowersData);
  }

  if (message.type === 'error') {
    statusBar.textContent = `Error: ${message.message}`;
    setRunning(false);
  }
});
