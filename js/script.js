'use strict';
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function nav(){
 const button=qs('[data-nav-toggle]'),links=qs('[data-nav-links]');if(!button||!links)return;
 const close=()=>{links.classList.remove('open');button.setAttribute('aria-expanded','false')};
 button.addEventListener('click',()=>{const open=links.classList.toggle('open');button.setAttribute('aria-expanded',String(open))});
 links.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 document.addEventListener('click',e=>{if(!e.target.closest('.nav'))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&links.classList.contains('open')){close();button.focus()}});
 matchMedia('(min-width: 851px)').addEventListener('change',e=>{if(e.matches)close()});
}
function filters(){
 const buttons=qsa('[data-filter]'),tiles=qsa('[data-categories]');if(!buttons.length)return;
 const note=qs('[data-work-results]');note.className='filter-count';
 const apply=filter=>{let count=0;tiles.forEach(tile=>{tile.hidden=filter!=='all'&&!tile.dataset.categories.split(' ').includes(filter);if(!tile.hidden)count++});buttons.forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});note.textContent=`${count} ${count===1?'project':'projects'}`};
 buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.filter)));apply('all');
}
function carousel(){qsa('[data-carousel]').forEach(car=>{const track=qs('[data-carousel-track]',car);if(!track)return;const move=d=>track.scrollBy({left:d*Math.min(track.clientWidth*.9,380),behavior:motion()});qs('[data-carousel-prev]',car)?.addEventListener('click',()=>move(-1));qs('[data-carousel-next]',car)?.addEventListener('click',()=>move(1))})}
function colorTags(){
 const colors={'entrepreneurship':'green','product strategy':'green','pm':'blue','project management':'blue','program design':'blue','operations':'orange','growth':'pink','strategy':'orange','research':'lav','consulting':'yellow','ux research':'lav','usability':'pink','product':'blue','budgeting':'yellow','evaluation':'pink','e-commerce':'yellow','marketing strategy':'pink','forecasting':'orange','product research':'blue','stakeholders':'green','mixed methods':'lav','synthesis':'green','policy research':'blue','web design':'pink','digital strategy':'orange','brand design':'yellow','social strategy':'lav','content':'pink','community':'blue','on camera':'green'};
 qsa('.tag').forEach(tag=>tag.classList.add('tag--'+(colors[tag.textContent.trim().toLowerCase().replace(/\s+/g,' ')]||'neutral')));
}
function blogControls(){
 const grid=qs('[data-blog-grid]');if(!grid)return;const posts=qsa('[data-blog-post]',grid),buttons=qsa('[data-blog-filter]'),search=qs('input[data-blog-search]'),sort=qs('[data-blog-sort]'),note=qs('[data-blog-results]'),empty=qs('[data-blog-empty]');let category='all';
 note?.setAttribute('aria-live','polite');
 const apply=()=>{const term=(search?.value||'').trim().toLowerCase();let count=0;posts.forEach(post=>{post.hidden=!(category==='all'||post.dataset.blogCategory===category)||!(post.dataset.blogSearch||post.textContent).toLowerCase().includes(term);if(!post.hidden)count++});const mode=sort?.value||'newest';[...posts].sort((a,b)=>mode==='az'?a.dataset.blogTitle.localeCompare(b.dataset.blogTitle):mode==='oldest'?a.dataset.blogDate.localeCompare(b.dataset.blogDate):b.dataset.blogDate.localeCompare(a.dataset.blogDate)).forEach(post=>grid.appendChild(post));if(note)note.textContent=`${count} ${count===1?'post':'posts'} shown`;if(empty){empty.hidden=count!==0;empty.classList.toggle('visible',count===0)}buttons.forEach(b=>{const active=b.dataset.blogFilter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})};
 buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.blogFilter;apply()}));search?.addEventListener('input',apply);sort?.addEventListener('change',apply);apply();
}
function lightbox(){
 const links=qsa('[data-lightbox]');if(!links.length)return;
 const dialog=document.createElement('dialog');dialog.className='lightbox';dialog.setAttribute('aria-label','Design preview');dialog.innerHTML='<button class="lightbox__close" type="button" autofocus>Close ×</button><img alt=""><p></p>';document.body.append(dialog);let trigger;
 links.forEach(link=>link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();trigger=link;qs('img',dialog).src=link.href;qs('img',dialog).alt=link.dataset.caption||qs('img',link).alt;qs('p',dialog).textContent=link.dataset.caption||'';dialog.showModal()}));
 qs('button',dialog).addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>trigger?.focus());
}
document.addEventListener('DOMContentLoaded',()=>{nav();filters();colorTags();blogControls();carousel();lightbox();qsa('video').forEach(video=>video.addEventListener('play',()=>qsa('video').filter(v=>v!==video).forEach(v=>v.pause())))});
function slideDecks(){
 const decks=qsa('[data-deck]');if(!decks.length)return;
 const dialog=document.createElement('dialog');dialog.className='slide-dialog';dialog.setAttribute('aria-label','Enlarged presentation');
 dialog.innerHTML='<div class="slide-dialog__top"><p class="slide-dialog__title"></p><button class="slide-dialog__close" type="button" autofocus>Close ×</button></div><img class="slide-dialog__image" alt=""><div class="slide-controls"><button class="slide-button" data-modal-prev type="button">← Previous</button><span class="slide-count" data-modal-count aria-live="polite" aria-atomic="true"></span><button class="slide-button" data-modal-next type="button">Next →</button></div>';
 document.body.append(dialog);let active=null,returnTo=null;
 const modalUpdate=()=>{if(!active)return;const slide=active.slides[active.index];qs('.slide-dialog__image',dialog).src=slide.dataset.source;qs('.slide-dialog__image',dialog).alt=slide.dataset.title;qs('.slide-dialog__title',dialog).textContent=slide.dataset.title;qs('[data-modal-count]',dialog).textContent=`${active.index+1} / ${active.slides.length}`;qs('[data-modal-prev]',dialog).disabled=active.index===0;qs('[data-modal-next]',dialog).disabled=active.index===active.slides.length-1};
 decks.forEach(deck=>{
  const slides=qsa('[data-deck-slide]',deck),prev=qs('[data-deck-prev]',deck),next=qs('[data-deck-next]',deck),count=qs('[data-deck-count]',deck),thumbs=qsa('[data-deck-goto]',deck),stage=qs('.slide-deck__stage',deck),thumbRail=qs('[data-deck-thumbs]',deck);
  const state={slides,index:0,select:null};
  const select=(index,scrollThumb=true)=>{
   state.index=Math.max(0,Math.min(index,slides.length-1));slides.forEach((slide,i)=>{const current=i===state.index;slide.classList.toggle('is-current',current);slide.hidden=!current;const img=qs('img',slide);if(current)img.loading='eager'});
   prev.disabled=state.index===0;next.disabled=state.index===slides.length-1;count.textContent=`${state.index+1} / ${slides.length}`;
   thumbs.forEach((thumb,i)=>{if(i===state.index)thumb.setAttribute('aria-current','true');else thumb.removeAttribute('aria-current')});
   if(scrollThumb){const t=thumbs[state.index],r=t.getBoundingClientRect(),rail=thumbRail.getBoundingClientRect();if(r.left<rail.left||r.right>rail.right)thumbRail.scrollBy({left:r.left-rail.left-rail.width/2+r.width/2,behavior:motion()})}
   if(dialog.open&&active===state)modalUpdate();
  };
  state.select=select;deck.classList.add('is-ready');qs('[data-deck-controls]',deck).hidden=false;thumbRail.hidden=false;
  prev.addEventListener('click',()=>select(state.index-1));next.addEventListener('click',()=>select(state.index+1));thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>select(i)));
  deck.addEventListener('keydown',e=>{if(e.target.closest('details'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(state.index+(e.key==='ArrowRight'?1:-1))}else if(e.key==='Home'||e.key==='End'){e.preventDefault();select(e.key==='Home'?0:slides.length-1)}});
  let touch=null;stage.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touch={x:t.clientX,y:t.clientY}},{passive:true});stage.addEventListener('touchend',e=>{if(!touch||e.target.closest('details'))return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)select(state.index+(dx<0?1:-1));touch=null},{passive:true});
  slides.forEach((slide,i)=>qs('[data-deck-enlarge]',slide).addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;e.preventDefault();returnTo=stage;active=state;select(i,false);modalUpdate();dialog.showModal()}));
  select(0,false);if('ResizeObserver' in window){const resize=new ResizeObserver(()=>{const t=thumbs[state.index],r=t.getBoundingClientRect(),rail=thumbRail.getBoundingClientRect();if(r.left<rail.left||r.right>rail.right)thumbRail.scrollLeft+=r.left-rail.left-rail.width/2+r.width/2});resize.observe(thumbRail)}
 });
 qs('.slide-dialog__close',dialog).addEventListener('click',()=>dialog.close());
 qs('[data-modal-prev]',dialog).addEventListener('click',()=>active?.select(active.index-1));qs('[data-modal-next]',dialog).addEventListener('click',()=>active?.select(active.index+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();active?.select(active.index+(e.key==='ArrowRight'?1:-1))}else if(e.key==='Home'||e.key==='End'){e.preventDefault();active?.select(e.key==='Home'?0:active.slides.length-1)}});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{returnTo?.focus({preventScroll:true});active=null});
}
function caseContents(){
 const nav=qs('.case-contents');if(!nav||!('IntersectionObserver' in window))return;
 const links=qsa('a',nav);const sections=links.map(a=>qs(a.getAttribute('href'))).filter(Boolean);
 const observer=new IntersectionObserver(entries=>{const current=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!current)return;links.forEach(a=>{if(a.hash==='#'+current.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})},{rootMargin:'-180px 0px -55% 0px',threshold:0});sections.forEach(s=>observer.observe(s));
}
document.addEventListener('DOMContentLoaded',()=>{slideDecks();caseContents()});
