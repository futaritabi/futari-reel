let stays=[];
const cards=document.getElementById('cards');
const tpl=document.getElementById('stayTemplate');
const searchInput=document.getElementById('searchInput');
const regionSelect=document.getElementById('regionSelect');

function render(list){
  cards.innerHTML='';
  list.forEach((stay)=>{
    const node=tpl.content.cloneNode(true);
    const img=node.querySelector('.stay-image');
    img.src=stay.image;
    img.alt=stay.name;
    node.querySelector('.stay-region').textContent=stay.region;
    node.querySelector('.stay-name').textContent=stay.name;
    node.querySelector('.stay-copy').textContent=stay.copy;
    const reel=node.querySelector('.reel-btn');
    reel.href=stay.reel_url||'#';
    const book=node.querySelector('.book-btn');
    book.href=stay.book_url||'#';
    cards.appendChild(node);
  });
}
function filterStays(){
  const q=searchInput.value.trim().toLowerCase();
  const r=regionSelect.value;
  render(stays.filter(s=>{
    const hay=[s.name,s.region,s.copy].join(' ').toLowerCase();
    return (!q||hay.includes(q))&&(!r||s.region===r);
  }));
}
fetch('stays.json').then(r=>r.json()).then(data=>{
  stays=data;
  [...new Set(stays.map(s=>s.region))].forEach(r=>{
    const o=document.createElement('option');o.value=r;o.textContent=r;regionSelect.appendChild(o);
  });
  render(stays);
});
searchInput.addEventListener('input',filterStays);
regionSelect.addEventListener('change',filterStays);
