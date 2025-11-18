async function api(path, opts = {}){
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(path, { ...opts, headers });
  if (res.status === 401) { alert('Sesión expirada. Vuelve a iniciar sesión.'); window.location = '/'; }
  return res;
}

document.getElementById('logout').addEventListener('click', () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location = '/'; });

const form = document.getElementById('videoForm');
const list = document.getElementById('videos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const body = { title: fd.get('title'), url: fd.get('url') };
  const res = await api('/api/videos', { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) { const j = await res.json(); alert(j.error || 'Error'); return; }
  form.reset();
  load();
});

async function load(){
  const res = await fetch('/api/videos');
  const arr = await res.json();
  list.innerHTML = '';
  for(const v of arr){
    const li = document.createElement('li');
    li.textContent = `${v.title} — ${v.url} (${v.uploaded_by || 'anon'})`;
    list.appendChild(li);
  }
}

load();
