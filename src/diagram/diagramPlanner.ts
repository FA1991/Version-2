import type{ProblemAnalysis}from'../problem/analyzer';

export type DiagramElementType='ramp'|'box'|'ball'|'arrow'|'angle'|'label'|'axis'|'triangle'|'circle'|'line'|'point'|'spring'|'pulley'|'ground';
export interface DiagramElement{id:string;type:DiagramElementType;x?:number;y?:number;props:Record<string,string|number|boolean>}
export interface DiagramPlan{schemaVersion:'1.0';blueprint:string;title:string;elements:DiagramElement[];labels:Record<string,string>;confidence:number;warnings:string[]}

function value(a:ProblemAnalysis,symbol:string){return a.variables.find(v=>v.symbol===symbol)}
function label(v:ReturnType<typeof value>,fallback:string){return v?`${v.name}: ${v.value} ${v.unit}`:fallback}

export function planDiagram(a:ProblemAnalysis):DiagramPlan{
 const type=a.classification.problemType;const elements:DiagramElement[]=[],labels:Record<string,string>={},warnings:string[]=[];
 let blueprint='generic-stem',title=a.classification.topic||'STEM Diagram',confidence=.55;
 if(type==='Inclined plane'){
  blueprint='inclined-plane';title='Inclined Plane';confidence=.95;
  const m=value(a,'m'),F=value(a,'F'),theta=value(a,'theta');
  elements.push(
   {id:'ground',type:'ground',props:{x1:8,y1:82,x2:92,y2:82}},
   {id:'ramp',type:'ramp',props:{x1:16,y1:78,x2:78,y2:34,angle:theta?.value??30}},
   {id:'box',type:'box',x:49,y:49,props:{width:15,height:12,label:m?`${m.value} ${m.unit}`:'box'}},
   {id:'force',type:'arrow',props:{fromX:55,fromY:47,toX:76,toY:32,direction:'up-ramp',semantic:'applied-force',label:F?`${F.value} ${F.unit}`:'F'}},
   {id:'gravity',type:'arrow',props:{fromX:55,fromY:54,toX:55,toY:75,direction:'down',semantic:'gravity',label:'mg'}},
   {id:'angle',type:'angle',props:{x:17,y:77,value:theta?.value??30,unit:'°'}}
  );
  labels.mass=label(m,'mass');labels.force=label(F,'applied force');labels.angle=label(theta,'incline angle');
 }else if(type==='Projectile motion'){
  blueprint='projectile-motion';title='Projectile Motion';confidence=.9;
  const v=value(a,'v')??value(a,'u'),theta=value(a,'theta');
  elements.push({id:'ground',type:'ground',props:{x1:8,y1:82,x2:92,y2:82}},{id:'ball-start',type:'ball',x:18,y:75,props:{radius:3,state:'initial'}},{id:'velocity',type:'arrow',props:{fromX:20,fromY:72,toX:39,toY:55,semantic:'velocity',label:v?`${v.value} ${v.unit}`:'v₀'}},{id:'gravity',type:'arrow',props:{fromX:54,fromY:35,toX:54,toY:54,semantic:'gravity',label:'g'}},{id:'trajectory',type:'line',props:{kind:'parabolic-path',x1:18,y1:75,x2:82,y2:75,peakY:27,dashed:true}},{id:'ball-ghost',type:'ball',x:82,y:75,props:{radius:3,state:'ghost'}});
  if(theta)elements.push({id:'launch-angle',type:'angle',props:{x:19,y:74,value:theta.value,unit:'°'}});
 }else if(type==='Triangle measurement'||type==='Trig triangle'){
  blueprint='triangle';title='Triangle';confidence=.9;
  elements.push({id:'triangle',type:'triangle',props:{ax:18,ay:78,bx:80,by:78,cx:62,cy:25}},{id:'unknown',type:'label',props:{text:a.find[0]??'?',semantic:'target'}});
 }else if(type==='Circle measurement'){
  blueprint='circle';title='Circle';confidence=.9;
  const r=value(a,'r');elements.push({id:'circle',type:'circle',x:50,y:52,props:{radius:27}},{id:'radius',type:'line',props:{x1:50,y1:52,x2:77,y2:52,label:r?`${r.value} ${r.unit}`:'r'}});
 }else{
  warnings.push('No specialized blueprint yet; use generic semantic objects.');
  a.objects.forEach((o,i)=>elements.push({id:`object-${i}`,type:o.toLowerCase().includes('ball')?'ball':'label',x:20+i*18,y:50,props:{text:o}}));
 }
 return{schemaVersion:'1.0',blueprint,title,elements,labels,confidence,warnings};
}