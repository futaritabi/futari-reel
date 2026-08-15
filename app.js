let stays = [];
const cards = document.getElementById('cards');
const tpl = document.getElementById('card-template');
const search = document.getElementById('search');
const region = document.getElementById('region');
const count = document.getElementById('count');

function setLink(el, url, disabledText){
  if(url){ el.href = url; }
  else{ el.href = '#'; el.textContent = disabledText; el.classList.add('is-disabled'); }
}
function render(items){
  cards.innerHTML = '';
  count.textContent = `${items.length}件`;
  items.forEach((stay, index) => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.thumb');
    img.src = stay.image;
    img.alt = `${stay.name}の紹介画像`;
    node.querySelector('.region-badge').textContent = stay.region;
    node.querySelector('.number-badge').textContent = String(index + 1).padStart(2, '0');
    node.querySelector('.hook').textContent = stay.hook;
    node.querySelector('.name').textContent = stay.name;
    node.querySelector('.features').textContent = stay.features.join(' / ');
    node.querySelector('.price').textContent = stay.price_note || '';
    node.querySelector('.recommend').textContent = stay.recommend_for || '';
    const imageLink = node.querySelector('.image-link');
    setLink(imageLink, stay.reel_url, 'リール準備中');
    setLink(node.querySelector('.reel-link'), stay.reel_url, 'リール準備中');
    setLink(node.querySelector('.rakuten-link'), stay.rakuten_url, '楽天 準備中');
    setLink(node.querySelector('.jalan-link'), stay.jalan_url, 'じゃらん 準備中');
    cards.appendChild(node);
  });
}
function applyFilters(){
  const q = search.value.trim().toLowerCase();
  const r = region.value;
  const filtered = stays.filter(s => {
    const hay = [s.name,s.region,s.hook,s.price_note,s.recommend_for,...(s.features||[])].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!r || s.region === r);
  });
  render(filtered);
}
fetch('stays.json').then(r => r.json()).then(data => {
  stays = data;
  [...new Set(stays.map(s => s.region))].sort().forEach(r => {
    const opt = document.createElement('option'); opt.value = r; opt.textContent = r; region.appendChild(opt);
  });
  render(stays);
}).catch(() => { cards.innerHTML = '<p>宿データを読み込めませんでした。</p>'; });
search.addEventListener('input', applyFilters);
region.addEventListener('change', applyFilters);
