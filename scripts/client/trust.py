"""Geometry contract for the approved split hero trust panels."""
MEASURE=r'''() => {
 const close=(a,b,t=1)=>Math.abs(a-b)<=t,failures=[];
 const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'};
 const groups=[...document.querySelectorAll('#hero .hero__trust-grid')].filter(visible);
 if(groups.length!==1)return {failures:['one responsive trust grid must be visible'],cards:[]};
 const group=groups[0],cards=[...group.querySelectorAll('.hero__trust-card')];
 if(cards.length!==4)failures.push('exactly four trust panels required');
 const luminance=rgb=>rgb.map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[.2126,.7152,.0722][i],0);
 const rgb=s=>{const m=s.match(/rgba?\(([^)]+)\)/);return m?m[1].split(',').slice(0,3).map(Number):null};
 const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const result=cards.map((card,index)=>{
  const r=card.getBoundingClientRect(),cs=getComputedStyle(card),p=card.querySelector('.hero__trust-title'),t=p.getBoundingClientRect(),ps=getComputedStyle(p),i=card.querySelector('.trust-icon'),ir=i.getBoundingClientRect(),is=getComputedStyle(i),svg=i.querySelector('svg'),sr=svg.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(p);const ink=range.getBoundingClientRect();
  const rows=[];for(const rect of range.getClientRects())if(rect.width&&rect.height&&!rows.some(y=>Math.abs(y-rect.y)<2))rows.push(rect.y);
  const border=parseFloat(cs.borderTopWidth),innerWidth=r.width-parseFloat(cs.borderLeftWidth)-parseFloat(cs.borderRightWidth),iconSize=window.innerWidth<=620?19:22;
  const dx=ink.x+ink.width/2-t.x-t.width/2,dy=ink.y+ink.height/2-t.y-t.height/2;
  const stops=[...is.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(x=>rgb(x[0]));const inkRgb=rgb(getComputedStyle(svg).color);const ratios=inkRgb?stops.map(stop=>contrast(inkRgb,stop)):[];
  if(!close(ir.x,r.x+parseFloat(cs.borderLeftWidth))||!close(ir.y,r.y+border)||!close(ir.height,r.height-parseFloat(cs.borderTopWidth)-parseFloat(cs.borderBottomWidth))||!close(ir.width,innerWidth*.22))failures.push('icon strip geometry '+index);
  if(!close(t.x,ir.right)||!close(t.y,ir.y)||!close(t.height,ir.height)||!close(t.right,r.right-parseFloat(cs.borderRightWidth)))failures.push('dedicated text area '+index);
  if(ps.display!=='flex'||ps.textAlign!=='center'||ps.alignItems!=='center'||ps.justifyContent!=='center'||Math.abs(dx)>1||Math.abs(dy)>2)failures.push('centered text '+index);
  if(rows.length<1||rows.length>3||ink.left<t.left+parseFloat(ps.paddingLeft)-1||ink.right>t.right-parseFloat(ps.paddingRight)+1||ink.top<t.top-1||ink.bottom>t.bottom+1)failures.push('trust text lines/fit '+index);
  if(!close(sr.width,iconSize)||!close(sr.height,iconSize)||!close(sr.x+sr.width/2,ir.x+ir.width/2)||!close(sr.y+sr.height/2,ir.y+ir.height/2))failures.push('icon geometry '+index);
  if(!is.backgroundImage.startsWith('linear-gradient')||ratios.length!==2||Math.min(...ratios)<3)failures.push('icon strip contrast '+index);
  return {index,text:p.textContent,lines:rows.length,dx,dy,card:{x:r.x,y:r.y,w:r.width,h:r.height},icon:{x:ir.x,y:ir.y,w:ir.width,h:ir.height},textBox:{x:t.x,y:t.y,w:t.width,h:t.height},font:ps.font,fontSize:ps.fontSize,background:is.backgroundImage,iconColor:getComputedStyle(svg).color,contrasts:ratios};
 });
 if(result.some(c=>!close(c.card.h,result[0].card.h)))failures.push('four equal trust-panel heights');
 return {width:window.innerWidth,failures,cards:result};
}'''
