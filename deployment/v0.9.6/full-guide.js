/* The full handbook owns theme state; the inline atlas follows it. */
(()=>{
 const atlas=document.getElementById('lds096-color-atlas');
 if(!atlas)return;
 const sync=()=>{atlas.dataset.theme=document.documentElement.dataset.theme==='dark'?'dark':'light';};
 sync();
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
