import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
const path=(d:string,s:string):GeometryPrimitiveSpec=>({type:'path',attrs:{d},semantic:s});
const ellipse=(cx:number,cy:number,rx:number,ry:number,s:string):GeometryPrimitiveSpec=>({type:'ellipse',attrs:{cx,cy,rx,ry},semantic:s});

export function buildQuadric(id:string):GeometryModel|null{
 const axes:GeometryPrimitiveSpec[]=[
  {type:'line',attrs:{x1:10,y1:68,x2:90,y2:38},semantic:'x-axis'},
  {type:'line',attrs:{x1:50,y1:88,x2:50,y2:12},semantic:'z-axis'},
  {type:'line',attrs:{x1:18,y1:28,x2:82,y2:76},semantic:'y-axis'}];
 let p:GeometryPrimitiveSpec[]=[];
 if(['ellipsoid','spheroid','oblate-spheroid','prolate-spheroid'].includes(id)){const rx=id==='prolate-spheroid'?22:id==='oblate-spheroid'?34:29,ry=id==='prolate-spheroid'?35:id==='oblate-spheroid'?22:30;p=[ellipse(50,50,rx,ry,'surface'),ellipse(50,50,rx,7,'equator')]}
 else if(id==='elliptic-paraboloid')p=[path('M 28 20 Q 50 92 72 20','surface-edge'),ellipse(50,30,18,5,'section'),ellipse(50,48,12,4,'section')];
 else if(id==='hyperbolic-paraboloid')p=[path('M 15 30 Q 50 75 85 30','saddle-u'),path('M 20 75 Q 50 25 80 75','saddle-v')];
 else if(id==='one-sheet-hyperboloid')p=[path('M 24 15 C 42 34 42 66 24 85 M 76 15 C 58 34 58 66 76 85','surface-edge'),ellipse(50,50,10,4,'waist')];
 else if(id==='two-sheet-hyperboloid')p=[path('M 32 12 Q 50 38 68 12 M 32 88 Q 50 62 68 88','surface-edge')];
 else if(id==='elliptic-cone'||id==='circular-cone')p=[path('M 22 18 L 50 50 L 78 18 M 22 82 L 50 50 L 78 82','double-cone'),ellipse(50,25,20,6,'section'),ellipse(50,75,20,6,'section')];
 else if(['elliptic-cylinder','parabolic-cylinder','hyperbolic-cylinder'].includes(id)){p=id==='elliptic-cylinder'?[ellipse(35,50,13,25,'surface'),ellipse(65,50,13,25,'surface')]:[path(id==='parabolic-cylinder'?'M 20 20 Q 50 75 80 20':'M 18 20 C 38 32 38 68 18 80 M 82 20 C 62 32 62 68 82 80','surface-edge')]}
 else return null;
 return{id,dimension:'2.5D',primitives:[...axes,...p],anchors:{center:[50,50]}};
}

export function buildTorus(kind:'ring-torus'|'horn-torus'|'spindle-torus'|'torus'='torus'):GeometryModel{
 const inner=kind==='horn-torus'?1:kind==='spindle-torus'?0:13;
 const ps:GeometryPrimitiveSpec[]=[ellipse(50,50,34,18,'outer-silhouette'),ellipse(50,50,inner,7,'inner-silhouette')];
 return{id:kind,dimension:'2.5D',primitives:ps,anchors:{center:[50,50],outer:[84,50],inner:[50+inner,50]}};
}

export function buildSurfaceOfRevolution(profile:'catenoid'|'generic'='generic'):GeometryModel{
 const ps=profile==='catenoid'?[path('M 24 15 C 44 34 44 66 24 85 M 76 15 C 56 34 56 66 76 85','profile'),ellipse(50,15,26,7,'section'),ellipse(50,50,8,3,'section'),ellipse(50,85,26,7,'section')]:[path('M 30 15 C 58 30 36 70 70 85','profile')];
 return{id:profile,dimension:'2.5D',primitives:ps,anchors:{center:[50,50]}};
}
