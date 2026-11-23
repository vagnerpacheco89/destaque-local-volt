"""Reject unsafe heading leading, including accented capitals and cedilla."""
MEASURE=r'''() => {
 const failures=[],canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
 const headings=[...document.querySelectorAll('h1,h2,h3')].filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height).map(e=>{
  const cs=getComputedStyle(e),fs=parseFloat(cs.fontSize),lh=parseFloat(cs.lineHeight),er=e.getBoundingClientRect();
  ctx.font=`${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  const alphabet='ÁÀÂÃÉÊÍÓÔÕÚÜÇgjpqy',metrics=ctx.measureText(cs.textTransform==='uppercase'?alphabet.toUpperCase():alphabet);
  const inkHeight=metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent,clearance=lh-inkHeight,minimum=Math.max(2,fs*.08),rows=[];
  const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
  while(n=walker.nextNode()){
   if(!n.textContent.trim())continue;const parent=n.parentElement,ps=getComputedStyle(parent);
   if(ps.display==='none')continue;
   if(Math.abs(parseFloat(ps.fontSize)-fs)>.1||Math.abs(parseFloat(ps.lineHeight)-lh)>.5)failures.push('heading descendant typography '+e.id+' '+parent.tagName+' '+ps.fontSize+'/'+ps.lineHeight+' expected '+fs+'/'+lh);
   const range=document.createRange();range.selectNodeContents(n);
   for(const rect of range.getClientRects())if(rect.width&&rect.height&&!rows.some(y=>Math.abs(y-rect.y)<2))rows.push(rect.y);
  }
  rows.sort((a,b)=>a-b);
  if(Math.abs(lh/fs-1.3)>.002)failures.push('heading leading '+e.id);
  if(clearance<minimum-.5)failures.push('heading accent clearance '+e.id);
  for(let i=1;i<rows.length;i++)if(rows[i]-rows[i-1]<lh-.5)failures.push('heading row spacing '+e.id);
  if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)failures.push('heading clipping '+e.id);
  const next=e.nextElementSibling;
  if(next){const r=next.getBoundingClientRect(),s=getComputedStyle(next);if(r.width&&r.height&&['static','relative'].includes(s.position)&&Math.min(er.right,r.right)-Math.max(er.left,r.left)>1&&Math.min(er.bottom,r.bottom)-Math.max(er.top,r.top)>1)failures.push('heading neighbor overlap '+e.id);}
  return {tag:e.tagName,id:e.id,text:e.textContent.trim(),font:ctx.font,fontSize:fs,lineHeight:lh,lines:rows.length,clearance,minimum,rows};
 });
 if(!headings.length)failures.push('missing headings');
 return {width:innerWidth,failures,headings};
}'''
