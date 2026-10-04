import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
type P=[number,number];
const poly=(pts:P[],s:string):GeometryPrimitiveSpec=>({type:'polyline',attrs:{points:pts.map(p=>p.join(',')).join(' ')},semantic:s});
const line=(a:P,b:P,s:string):GeometryPrimitiveSpec=>({type:'line',attrs:{x1:a[0],y1:a[1],x2:b[0],y2:b[1]},semantic:s});

export function sierpinskiTriangle(depth=4):GeometryModel{
 const ps:GeometryPrimitiveSpec[]=[];const rec=(a:P,b:P,c:P,d:number)=>{if(d<=0){ps.push({type:'polygon',attrs:{points:[a,b,c].map(x=>x.join(',')).join(' ')},semantic:'fractal-cell'});return}const ab:P=[(a[0]+b[0])/2,(a[1]+b[1])/2],bc:P=[(b[0]+c[0])/2,(b[1]+c[1])/2],ca:P=[(c[0]+a[0])/2,(c[1]+a[1])/2];rec(a,ab,ca,d-1);rec(ab,b,bc,d-1);rec(ca,bc,c,d-1)};rec([50,10],[10,86],[90,86],Math.min(7,Math.max(0,depth)));return{id:'sierpinski-triangle',dimension:'2D',primitives:ps,anchors:{center:[50,58]}};
}
export function kochSnowflake(depth=3):GeometryModel{
 let pts:P[]=[[50,12],[86,75],[14,75],[50,12]];for(let d=0;d<Math.min(5,depth);d++){const out:P[]=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=(b[0]-a[0])/3,dy=(b[1]-a[1])/3,p1:P=[a[0]+dx,a[1]+dy],p3:P=[a[0]+2*dx,a[1]+2*dy],p2:P=[p1[0]+dx*.5+dy*Math.sqrt(3)/2,p1[1]+dy*.5-dx*Math.sqrt(3)/2];out.push(a,p1,p2,p3)}out.push(out[0]);pts=out}return{id:'koch-snowflake',dimension:'2D',primitives:[poly(pts,'fractal-curve')],anchors:{center:[50,55]}};
}
export function cantorSet(depth=6):GeometryModel{
 const ps:GeometryPrimitiveSpec[]=[];const rec=(x:number,y:number,w:number,d:number)=>{ps.push(line([x,y],[x+w,y],'cantor-segment'));if(d>0){rec(x,y+9,w/3,d-1);rec(x+2*w/3,y+9,w/3,d-1)}};rec(8,15,84,Math.min(7,depth));return{id:'cantor-set',dimension:'2D',primitives:ps,anchors:{center:[50,50]}};
}

export function regularTiling(kind:'triangular'|'square'|'hexagonal',rows=7,cols=9):GeometryModel{
 const ps:GeometryPrimitiveSpec[]=[];
 if(kind==='square'){for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)ps.push({type:'polygon',attrs:{points:`${8+c*10},${10+r*10} ${18+c*10},${10+r*10} ${18+c*10},${20+r*10} ${8+c*10},${20+r*10}`},semantic:'tile'})}
 else if(kind==='triangular'){for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=8+c*10,y=10+r*9;ps.push({type:'polygon',attrs:{points:`${x},${y+9} ${x+5},${y} ${x+10},${y+9}`},semantic:'tile'},{type:'polygon',attrs:{points:`${x+5},${y} ${x+15},${y} ${x+10},${y+9}`},semantic:'tile'})}}
 else {const rr=6,h=Math.sqrt(3)*rr;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cx=10+c*rr*1.5,cy=12+r*h+(c%2)*h/2;const pts=Array.from({length:6},(_,i)=>[cx+rr*Math.cos(i*Math.PI/3),cy+rr*Math.sin(i*Math.PI/3)] as P);ps.push({type:'polygon',attrs:{points:pts.map(p=>p.join(',')).join(' ')},semantic:'tile'})}}
 return{id:`${kind}-tiling`,dimension:'2D',primitives:ps,anchors:{center:[50,50]}};
}

export function sierpinskiCarpet(depth=3):GeometryModel{const ps:GeometryPrimitiveSpec[]=[];const rec=(x:number,y:number,w:number,d:number)=>{if(d<=0){ps.push({type:'polygon',attrs:{points:`${x},${y} ${x+w},${y} ${x+w},${y+w} ${x},${y+w}`},semantic:'fractal-cell'});return}const s=w/3;for(let j=0;j<3;j++)for(let i=0;i<3;i++)if(i!==1||j!==1)rec(x+i*s,y+j*s,s,d-1)};rec(12,12,76,Math.min(4,Math.max(0,depth)));return{id:'sierpinski-carpet',dimension:'2D',primitives:ps,anchors:{center:[50,50]}}}
export function dragonCurve(depth=12):GeometryModel{let turns:number[]=[];for(let d=0;d<Math.min(15,Math.max(0,depth));d++)turns=[...turns,1,...turns.slice().reverse().map(x=>-x)];let dir=0,x=0,y=0;const raw:P[]=[[0,0]];for(const t of turns){x+=Math.cos(dir);y+=Math.sin(dir);raw.push([x,y]);dir+=t*Math.PI/2}const xs=raw.map(p=>p[0]),ys=raw.map(p=>p[1]),minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys),scale=80/Math.max(1,maxx-minx,maxy-miny),pts=raw.map(([a,b])=>[10+(a-minx)*scale,10+(b-miny)*scale] as P);return{id:'dragon-curve',dimension:'2D',primitives:[poly(pts,'fractal-curve')],anchors:{center:[50,50]}}}
export function hilbertCurve(depth=4):GeometryModel{const n=1<<Math.min(6,Math.max(1,depth)),pts:P[]=[];const rot=(n:number,x:number,y:number,rx:number,ry:number)=>{if(ry===0){if(rx===1){x=n-1-x;y=n-1-y}return[y,x] as P}return[x,y] as P};for(let d=0;d<n*n;d++){let t=d,x=0,y=0;for(let s=1;s<n;s*=2){const rx=1&(t>>1),ry=1&(t^rx),p=rot(s,x,y,rx,ry);x=p[0]+s*rx;y=p[1]+s*ry;t>>=2}pts.push([10+80*x/(n-1),10+80*y/(n-1)])}return{id:'hilbert-curve',dimension:'2D',primitives:[poly(pts,'fractal-curve')],anchors:{center:[50,50]}}}
