let stays = [];
const cards = document.getElementById('cards');
const tpl = document.getElementById('stayTemplate');
const searchInput = document.getElementById('searchInput');
const regionSelect = document.getElementById('regionSelect');

function setActionState(el, label, url, enabled = true) {
  el.textContent = label;
  if (enabled && url) {
    el.href = url;
    el.classList.remove('is-disabled');
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'sponsored noopener');
  } else {
    el.href = '#';
    el.classList.add('is-disabled');
    el.removeAttribute('target');
    el.removeAttribute('rel');
    el.addEventListener('click', (e) => e.preventDefault());
  }
}

function render(list) {
  cards.innerHTML = '';
  list.forEach((stay) => {
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.stay-card');
    const img = node.querySelector('.stay-image');
    const imageWrap = node.querySelector('.stay-image-wrap');
    if (stay.image) {
      img.src = stay.image;
      img.alt = stay.name;
    } else {
      img.remove();
      imageWrap.classList.add('image-pending');
      const pending = document.createElement('div');
      pending.className = 'image-pending-label';
      pending.textContent = 'リール画像 準備中';
      imageWrap.appendChild(pending);
    }
    node.querySelector('.stay-region').textContent = stay.region;
    node.querySelector('.stay-name').textContent = stay.name;
    node.querySelector('.stay-copy').textContent = stay.copy;
    const badge = node.querySelector('.recommend-badge');
    const badgeText = stay.recommend_label || (stay.featured ? '今週のおすすめ' : '');
    badge.textContent = badgeText;
    if (!badgeText) badge.style.display = 'none';

    const note = node.querySelector('.image-note');
    note.textContent = stay.image_note || '';
    if (!stay.image_note) note.style.display = 'none';

    const tagsWrap = node.querySelector('.stay-tags');
    (stay.tags || []).forEach((tag) => {
      const span = document.createElement('span');
      span.textContent = tag;
      tagsWrap.appendChild(span);
    });

    const reel = node.querySelector('.reel-btn');
    setActionState(reel, stay.reel_enabled === false ? 'リール 準備中' : 'リールを見る', stay.reel_url, stay.reel_enabled !== false && !!stay.reel_url);

    const rakuten = node.querySelector('.rakuten-btn');
    setActionState(rakuten, stay.rakuten_enabled ? '楽天で見る' : '楽天 準備中', stay.rakuten_url, stay.rakuten_enabled);

    const jalan = node.querySelector('.jalan-btn');
    setActionState(jalan, stay.jalan_enabled ? 'じゃらんで見る' : 'じゃらん 準備中', stay.jalan_url, stay.jalan_enabled);

    const jalanTracker = node.querySelector('.jalan-tracker');
    if (jalanTracker) {
      if (stay.jalan_enabled && stay.jalan_tracking_pixel) {
        jalanTracker.src = stay.jalan_tracking_pixel;
      } else {
        jalanTracker.remove();
      }
    }

    if (!stay.rakuten_enabled && !stay.jalan_enabled) {
      card.classList.add('no-booking-links');
    }

    cards.appendChild(node);
  });
}

function filterStays() {
  const q = searchInput.value.trim().toLowerCase();
  const r = regionSelect.value;
  render(stays.filter((s) => {
    const hay = [s.name, s.region, s.copy, ...(s.tags || [])].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!r || s.region === r);
  }));
}

fetch('stays.json?v=15-booking-gate')
  .then((r) => r.json())
  .then((data) => {
    stays = data.filter((s) => s.rakuten_available === true || s.jalan_available === true);
    [...new Set(stays.map((s) => s.region))].forEach((r) => {
      const o = document.createElement('option');
      o.value = r;
      o.textContent = r;
      regionSelect.appendChild(o);
    });
    render(stays);
  });

searchInput.addEventListener('input', filterStays);
regionSelect.addEventListener('change', filterStays);
