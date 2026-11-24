"""Check actual glyph pairs, without padding every line for unrelated accents."""
MEASURE=r'''() => {
 const failures=[],ctx=document.createElement('canvas').getContext('2d');
 const headings=[...document.querySelectorAll('h1,h2,h3')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'}).map(e=>{
  const s=getComputedStyle(e),fs=parseFloat(s.fontSize),lh=parseFloat(s.lineHeight),r=e.getBoundingClientRect(),rows=[];
  const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
  while(n=walker.nextNode()){
   const ps=getComputedStyle(n.parentElement);if(ps.display==='none')continue;
   ctx.font=`${ps.fontStyle} ${ps.fontWeight} ${ps.fontSize} ${ps.fontFamily}`;
   for(let i=0;i<n.textContent.length;i++){
    const range=document.createRange();range.setStart(n,i);range.setEnd(n,i+1);const box=range.getBoundingClientRect();if(!box.width||!box.height)continue;
    let row=rows.find(row=>Math.abs(row.y-box.y)<2);if(!row){row={y:box.y,text:'',glyphs:[]};rows.push(row);}
    const char=ps.textTransform==='uppercase'?n.textContent[i].toUpperCase():n.textContent[i],m=ctx.measureText(char);row.text+=char;
    if(m.actualBoundingBoxLeft+m.actualBoundingBoxRight>0)row.glyphs.push({char,left:box.x-m.actualBoundingBoxLeft,right:box.x+m.actualBoundingBoxRight,ascent:m.actualBoundingBoxAscent,descent:m.actualBoundingBoxDescent});
   }
  }
  rows.sort((a,b)=>a.y-b.y);const gaps=[],pairs=[];
  for(let i=1;i<rows.length;i++){
   let minimum=Infinity,pair=null;
   for(const a of rows[i-1].glyphs)for(const b of rows[i].glyphs)if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>-.5){const gap=rows[i].y-rows[i-1].y-a.descent-b.ascent;if(gap<minimum){minimum=gap;pair=a.char+'/'+b.char;}}
   gaps.push(Number.isFinite(minimum)?minimum:null);pairs.push(pair);
  }
  const target=e.tagName==='H3'&&e.id!=='google-review-title'?1.05:.97;
  if(Math.abs(lh/fs-target)>.003)failures.push('heading leading '+e.id);
  if(gaps.some(g=>g!==null&&g<.65))failures.push('heading accent clearance '+e.id+' '+e.textContent.trim()+' gaps '+gaps+' pairs '+pairs);
  if(e.scrollWidth>e.clientWidth+1)failures.push('heading clipping '+e.id);
  const next=e.nextElementSibling;
  if(next){const nr=next.getBoundingClientRect(),ns=getComputedStyle(next);if(nr.width&&nr.height&&['static','relative'].includes(ns.position)&&Math.min(r.right,nr.right)-Math.max(r.left,nr.left)>1&&Math.min(r.bottom,nr.bottom)-Math.max(r.top,nr.top)>1)failures.push('heading neighbor overlap '+e.id);}
  return {tag:e.tagName,id:e.id,text:e.textContent.trim(),fontSize:fs,lineHeight:lh,lines:rows.length,gaps,pairs,rows:rows.map(({y,text})=>({y,text}))};
 });
 if(!headings.length)failures.push('missing headings');
 return {width:innerWidth,failures,headings};
}'''
CITY_PROBES=r'''() => {
 const ctx=document.createElement('canvas').getContext('2d'),seen=new Set(),samples=[],failures=[];
 const cities=['SÃO JOSÉ','ÂNGULO','TRÊS CORAÇÕES','ÓBIDOS','SÃO LUÍS','AÇAILÂNDIA','Á À Â Ã É Ê Í Ó Ô Õ Ú Ü Ç'];
 for(const heading of document.querySelectorAll('h1,h2,h3')){
  if(!heading.getBoundingClientRect().width)continue;
  const s=getComputedStyle(heading),key=[s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight].join('|');if(seen.has(key))continue;seen.add(key);
  for(const city of cities){
   const box=document.createElement('div');Object.assign(box.style,{position:'fixed',left:'0',top:'0',visibility:'hidden',width:'max-content',fontFamily:s.fontFamily,fontWeight:s.fontWeight,fontSize:s.fontSize,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,textTransform:'uppercase'});
   const a=document.createElement('span'),b=document.createElement('span');a.style.display=b.style.display='block';a.textContent=heading.tagName==='H1'?'ELETRICISTA EM':'ATENDIMENTO EM';b.textContent=city;box.append(a,b);document.body.append(box);
   const glyphs=e=>{const result=[];ctx.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;for(let i=0;i<e.firstChild.length;i++){const range=document.createRange();range.setStart(e.firstChild,i);range.setEnd(e.firstChild,i+1);const r=range.getBoundingClientRect(),char=e.textContent[i],m=ctx.measureText(char);if(m.actualBoundingBoxLeft+m.actualBoundingBoxRight>0)result.push({left:r.x-m.actualBoundingBoxLeft,right:r.x+m.actualBoundingBoxRight,y:r.y,ascent:m.actualBoundingBoxAscent,descent:m.actualBoundingBoxDescent});}return result;};
   let gap=Infinity;for(const x of glyphs(a))for(const y of glyphs(b))if(Math.min(x.right,y.right)-Math.max(x.left,y.left)>-.5)gap=Math.min(gap,y.y-x.y-x.descent-y.ascent);
   const sample={text:city,fontSize:s.fontSize,lineHeight:s.lineHeight,gap};samples.push(sample);if(gap<.65)failures.push(sample);box.remove();
  }
 }
 return {samples,failures};
}'''
