function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let isRunning = false;
let shouldStop = false;

async function toDataUrl(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function fetchNonFollowers(sendProgress) {
  const csrftoken = getCookie('csrftoken');
  const ds_user_id = getCookie('ds_user_id');

  if (!ds_user_id || !csrftoken) {
    sendProgress({ type: 'error', message: 'No se encontraron cookies de Instagram. Asegúrate de estar logueado.' });
    return;
  }

  const buildUrl = (after) => {
    const vars = after
      ? `{"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"${after}"}`
      : `{"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}`;
    return `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=${vars}`;
  };

  let url = buildUrl(null);
  let doNext = true;
  let total = null;
  let fetched = 0;
  let nonFollowers = [];
  let scrollCycle = 0;

  while (doNext && !shouldStop) {
    let data;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      sendProgress({ type: 'error', message: `Error al obtener datos: ${err.message}` });
      return;
    }

    const followData = data?.data?.user?.edge_follow;
    if (!followData) {
      sendProgress({ type: 'error', message: 'Respuesta inesperada de Instagram. Intenta de nuevo.' });
      return;
    }

    if (total === null) total = followData.count;

    doNext = followData.page_info.has_next_page;
    url = buildUrl(followData.page_info.end_cursor);
    fetched += followData.edges.length;

    for (const edge of followData.edges) {
      if (!edge.node.follows_viewer) {
        const dataUrl = await toDataUrl(edge.node.profile_pic_url);
        nonFollowers.push({
          id: edge.node.id,
          username: edge.node.username,
          full_name: edge.node.full_name,
          profile_pic_url: dataUrl || edge.node.profile_pic_url,
        });
      }
    }

    sendProgress({
      type: 'progress',
      fetched,
      total,
      nonFollowers: [...nonFollowers],
    });

    await sleep(Math.floor(Math.random() * 400) + 1000);
    scrollCycle++;
    if (scrollCycle > 6) {
      scrollCycle = 0;
      sendProgress({ type: 'sleeping', message: 'Pausando 10s para evitar bloqueo temporal...' });
      await sleep(10000);
    }
  }

  sendProgress({ type: 'done', nonFollowers });
}

async function unfollowUser(userId) {
  const csrftoken = getCookie('csrftoken');
  try {
    const res = await fetch(`https://www.instagram.com/web/friendships/${userId}/unfollow/`, {
      method: 'POST',
      headers: {
        'x-csrftoken': csrftoken,
        'x-instagram-ajax': '1',
        'x-requested-with': 'XMLHttpRequest',
        'content-type': 'application/x-www-form-urlencoded',
        referer: 'https://www.instagram.com/',
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'START') {
    if (isRunning) return;
    isRunning = true;
    shouldStop = false;

    fetchNonFollowers((progress) => {
      chrome.runtime.sendMessage({ ...progress, source: 'content' }).catch(() => {});
    }).finally(() => {
      isRunning = false;
    });

    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'STOP') {
    shouldStop = true;
    isRunning = false;
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'UNFOLLOW') {
    unfollowUser(message.userId).then((ok) => sendResponse({ ok }));
    return true;
  }
});
