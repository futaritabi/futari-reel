let stays = [];

const cards = document.getElementById('cards');
const tpl = document.getElementById('card-template');
const search = document.getElementById('search');
const region = document.getElementById('region');
const count = document.getElementById('count');

function render(items){
  cards.innerHTML = '';
  count.textContent = `${items.length}件`;
  for(const stay of items){
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.thumb');
    img.src = stay.image;
    img.alt = `${stay.name}のイメージ`;
    node.querySelector('.region-badge').textContent = stay.region;
    node.querySelector('.hook').textContent = stay.hook;
    node.querySelector('.name').textContent = stay.name;
    node.querySelector('.features').textContent = stay.features.join(' ・ ');
    const reel = node.querySelector('.reel-link');
    reel.href = stay.reel_url || '#';
    if(!stay.reel_url) reel.style.display = 'none';
    const book = node.querySelector('.book-link');
    book.href = stay.affiliate_url || '#';
    if(!stay.affiliate_url) book.textContent = '予約リンク準備中';
    cards.appendChild(node);
  }
}

function applyFilters(){
  const q = search.value.trim().toLowerCase();
  const r = region.value;
  const filtered = stays.filter(s => {
    const hay = [s.name,s.region,s.hook,...s.features].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!r || s.region === r);
  });
  render(filtered);
}

fetch('stays.json')
  .then(r => r.json())
  .then(data => {
    stays = data;
    [...new Set(stays.map(s => s.region))].sort().forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      region.appendChild(opt);
    });
    render(stays);
  })
  .catch(() => {
    cards.innerHTML = '<p>宿データを読み込めませんでした。</p>';
  });

search.addEventListener('input', applyFilters);
region.addEventListener('change', applyFilters);
