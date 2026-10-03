import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
const L=(x1:number,y1:number,x2:number,y2:number,s='edge'):GeometryPrimitiveSpec=>({type:'line',attrs:{x1,y1,x2,y2},semantic:s});
const P=(pts:[number,number][],s='face'):GeometryPrimitiveSpec=>({type:'polygon',attrs:{points:pts.map(v=>v.join(',')).join(' ')},semantic:s});
const T=(x:number,y:number,t:string,s='label'):GeometryPrimitiveSpec=>({type:'text',attrs:{x,y,text:t},semantic:s});
const regular=(n:number,cx=50,cy=50,r=30,rotation=-Math.PI/2):[number,number][]=>Array.from({length:n},(_,i)=>[cx+r*Math.cos(rotation+i*2*Math.PI/n),cy+r*Math.sin(rotation+i*2*Math.PI/n)]);

export function buildExtendedGeometry(id:string,p:Record<string,number|string>={}):GeometryModel|null{
 const names:Record<string,number>={pentagon:5,hexagon:6,heptagon:7,octagon:8,nonagon:9,decagon:10,dodecagon:12};
 if(names[id]||id==='polygon'){const n=names[id]??Math.max(3,Number(p.n??6)),pts=regular(n);const anchors:Object=Object.fromEntries(pts.map((v,i)=>[`v${i+1}`,v]));return{id,dimension:'2D',primitives:[P(pts)],anchors:{...(anchors as Record<string,[number,number]>),center:[50,50]}}}
 if(['parallelogram','rhombus','trapezoid','kite'].includes(id)){
  let pts:[number,number][]=[[20,70],[72,70],[82,30],[30,30]];
  if(id==='trapezoid')pts=[[18,72],[82,72],[68,30],[34,30]];
  if(id==='rhombus')pts=[[50,18],[82,50],[50,82],[18,50]];
  if(id==='kite')pts=[[50,15],[76,48],[50,84],[30,48]];
  return{id,dimension:'2D',primitives:[P(pts)],anchors:{A:pts[0],B:pts[1],C:pts[2],D:pts[3],center:[50,50]}};
 }
 if(id==='semicircle'||id==='sector'||id==='annulus'){
  const ps:GeometryPrimitiveSpec[]=[];
  if(id==='semicircle')ps.push({type:'path',attrs:{d:'M 20 60 A 30 30 0 0 1 80 60 L 20 60 Z'},semantic:'face'});
  if(id==='sector')ps.push({type:'path',attrs:{d:'M 50 50 L 80 50 A 30 30 0 0 0 65 24 Z'},semantic:'face'});
  if(id==='annulus')ps.push({type:'circle',attrs:{cx:50,cy:50,r:31},semantic:'outer-circle'},{type:'circle',attrs:{cx:50,cy:50,r:18},semantic:'inner-circle'});
  return{id,dimension:'2D',primitives:ps,anchors:{center:[50,50]}};
 }
 if(id==='parabola')return{id,dimension:'2D',primitives:[{type:'path',attrs:{d:'M 18 18 Q 50 92 82 18'},semantic:'curve'},L(50,12,50,88,'axis'),T(53,82,'V','vertex')],anchors:{vertex:[50,82],focus:[50,70]}};
 if(id==='hyperbola')return{id,dimension:'2D',primitives:[{type:'path',attrs:{d:'M 10 15 C 28 30 30 70 10 85 M 90 15 C 72 30 70 70 90 85'},semantic:'curve'},L(15,85,85,15,'asymptote'),L(15,15,85,85,'asymptote')],anchors:{center:[50,50]}};
 if(id==='triangular-prism'||id==='prism'){
  const a:[number,number]=[18,70],b:[number,number]=[48,70],c:[number,number]=[32,35],d:[number,number]=[48,58],e:[number,number]=[78,58],f:[number,number]=[62,23];
  return{id,dimension:'2.5D',primitives:[L(...a,...b),L(...b,...c),L(...c,...a),L(...d,...e),L(...e,...f),L(...f,...d),L(...a,...d),L(...b,...e),L(...c,...f)],anchors:{a,b,c,d,e,f,center:[48,48]}};
 }
 if(id==='hemisphere')return{id,dimension:'2.5D',primitives:[{type:'path',attrs:{d:'M 18 55 A 32 32 0 0 1 82 55'},semantic:'surface'},{type:'ellipse',attrs:{cx:50,cy:55,rx:32,ry:9},semantic:'base'}],anchors:{center:[50,55],top:[50,23]}};
 if(id==='frustum')return{id,dimension:'2.5D',primitives:[{type:'ellipse',attrs:{cx:50,cy:27,rx:17,ry:6},semantic:'top-base'},{type:'ellipse',attrs:{cx:50,cy:73,rx:30,ry:9},semantic:'bottom-base'},L(33,27,20,73),L(67,27,80,73),L(50,27,50,73,'axis')],anchors:{top:[50,27],bottom:[50,73],center:[50,50]}};
 if(['tetrahedron','octahedron'].includes(id)){
  if(id==='tetrahedron'){const a:[number,number]=[50,15],b:[number,number]=[18,72],c:[number,number]=[80,72],d:[number,number]=[55,52];return{id,dimension:'2.5D',primitives:[L(...a,...b),L(...a,...c),L(...a,...d),L(...b,...c),L(...b,...d,'hidden-edge'),L(...c,...d)],anchors:{a,b,c,d,center:[51,53]}}}
  const top:[number,number]=[50,12],bottom:[number,number]=[50,88],l:[number,number]=[18,50],r:[number,number]=[82,50],back:[number,number]=[55,40];return{id,dimension:'2.5D',primitives:[L(...top,...l),L(...top,...r),L(...top,...back),L(...bottom,...l),L(...bottom,...r),L(...bottom,...back),L(...l,...r),L(...l,...back,'hidden-edge'),L(...r,...back,'hidden-edge')],anchors:{top,bottom,l,r,back,center:[50,50]}};
 }
 return null;
}
