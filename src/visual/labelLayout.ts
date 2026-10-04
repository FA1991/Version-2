import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
type Box={x:number;y:number;w:number;h:number};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const overlap=(a:Box,b:Box,pad=1.5)=>!(a.x+a.w+pad<b.x||b.x+b.w+pad<a.x||a.y+a.h+pad<b.y||b.y+b.h+pad<a.y);
const points=(s:string)=>s.trim().split(/\s+/).map(p=>p.split(',').map(Number)).filter(p=>p.length===2&&p.every(Number.isFinite)) as [number,number][];
function bounds(p:GeometryPrimitiveSpec):Box|null{const a=p.attrs;
 if(p.type==='circle')return{x:Number(a.cx)-Number(a.r),y:Number(a.cy)-Number(a.r),w:2*Number(a.r),h:2*Number(a.r)};
 if(p.type==='ellipse')return{x:Number(a.cx)-Number(a.rx),y:Number(a.cy)-Number(a.ry),w:2*Number(a.rx),h:2*Number(a.ry)};
 if(p.type==='line'){const xs=[Number(a.x1),Number(a.x2)],ys=[Number(a.y1),Number(a.y2)];return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
 if(p.type==='polygon'||p.type==='polyline'){const q=points(String(a.points??''));if(!q.length)return null;const xs=q.map(v=>v[0]),ys=q.map(v=>v[1]);return{x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)}}
 if(p.type==='point')return{x:Number(a.cx)-2,y:Number(a.cy)-2,w:4,h:4};return null}
const labelBox=(x:number,y:number,s:string):Box=>({x,y:y-4,w:Math.max(7,s.length*2.15),h:5});
export function layoutGeometryLabels(model:GeometryModel):GeometryModel{const shapes=model.primitives.filter(p=>p.type!=='text').map(bounds).filter(Boolean) as Box[],placed:Box[]=[],leaders:GeometryPrimitiveSpec[]=[];
 const primitives=model.primitives.map(p=>{if(p.type!=='text')return p;const value=String(p.attrs.text??''),ox=Number(p.attrs.x??50),oy=Number(p.attrs.y??50);
  const pos:[number,number][]=[[ox,oy],[ox+5,oy-7],[ox+5,oy+8],[ox-12,oy-7],[ox-12,oy+8],[8,14+placed.length*7],[70,14+placed.length*7]];
  let chosen=pos[0],best=Infinity;
  for(const q of pos){const x=clamp(q[0],3,94),y=clamp(q[1],7,96),b=labelBox(x,y,value),shapeHits=shapes.filter(s=>overlap(b,s,.5)).length,labelHits=placed.filter(s=>overlap(b,s,1)).length,score=shapeHits*20+labelHits*100+Math.hypot(x-ox,y-oy)*.05;if(score<best){best=score;chosen=[x,y]}}
  const b=labelBox(chosen[0],chosen[1],value);placed.push(b);const moved=Math.hypot(chosen[0]-ox,chosen[1]-oy);if(moved>10)leaders.push({type:'line',attrs:{x1:ox,y1:oy,x2:chosen[0]-1,y2:chosen[1]-2},semantic:'label-leader'});return{...p,attrs:{...p.attrs,x:chosen[0],y:chosen[1]},semantic:(p.semantic??'')+' collision-placed'}});
 return{...model,primitives:[...primitives.filter(p=>p.type!=='text'),...leaders,...primitives.filter(p=>p.type==='text')]}}
