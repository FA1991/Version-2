import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
type P=[number,number];
const path=(d:string,s:string):GeometryPrimitiveSpec=>({type:'path',attrs:{d},semantic:s});
const line=(a:P,b:P,s='curve-guide'):GeometryPrimitiveSpec=>({type:'line',attrs:{x1:a[0],y1:a[1],x2:b[0],y2:b[1]},semantic:s});
const poly=(pts:P[],s:string):GeometryPrimitiveSpec=>({type:'polyline',attrs:{points:pts.map(p=>p.join(',')).join(' ')},semantic:s});
const sample=(fn:(t:number)=>P,a:number,b:number,n=180)=>Array.from({length:n+1},(_,i)=>fn(a+(b-a)*i/n));

export function buildParametricCurve(id:string,p:Record<string,number>={}):GeometryModel|null{
 let pts:P[]=[];
 if(id==='cardioid')pts=sample(t=>{const r=18*(1-Math.cos(t));return[50+r*Math.cos(t),50-r*Math.sin(t)]},0,Math.PI*2);
 else if(id==='limacon')pts=sample(t=>{const r=(p.a??20)+(p.b??12)*Math.cos(t);return[50+r*Math.cos(t),50-r*Math.sin(t)]},0,Math.PI*2);
 else if(id==='lemniscate')pts=sample(t=>{const d=1+Math.sin(t)**2;return[50+30*Math.cos(t)/d,50-30*Math.sin(t)*Math.cos(t)/d]},0,Math.PI*2);
 else if(id==='astroid')pts=sample(t=>[50+30*Math.cos(t)**3,50-30*Math.sin(t)**3],0,Math.PI*2);
 else if(id==='cycloid')pts=sample(t=>[12+6*(t-Math.sin(t)),72-6*(1-Math.cos(t))],0,Math.PI*4);
 else if(id==='archimedean-spiral')pts=sample(t=>{const r=2+1.25*t;return[50+r*Math.cos(t),50-r*Math.sin(t)]},0,Math.PI*6);
 else if(id==='logarithmic-spiral')pts=sample(t=>{const r=2*Math.exp(.13*t);return[50+r*Math.cos(t),50-r*Math.sin(t)]},0,Math.PI*6);
 else if(id==='fermat-spiral')pts=sample(t=>{const r=5*Math.sqrt(t);return[50+r*Math.cos(t),50-r*Math.sin(t)]},0,Math.PI*8);
 else if(id==='hyperbolic-spiral')pts=sample(t=>{const u=.4+t;const r=30/u;return[50+r*Math.cos(u),50-r*Math.sin(u)]},0,Math.PI*7);
 else if(id==='catenary')pts=sample(t=>[50+t*6,68-7*(Math.cosh(t/2)-1)],-5,5,120);
 else return null;
 return{id,dimension:'2D',primitives:[poly(pts,id)],anchors:{center:[50,50],start:pts[0],end:pts[pts.length-1]}};
}

export function buildBezier(control:P[]):GeometryModel{
 if(control.length<4)throw new Error('Bezier requires at least four control points');
 const [a,b,c,d]=control,curve=path(`M ${a[0]} ${a[1]} C ${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`,'bezier');
 return{id:'bezier-curve',dimension:'2D',primitives:[curve,line(a,b,'control'),line(c,d,'control')],anchors:{p0:a,p1:b,p2:c,p3:d}};
}
