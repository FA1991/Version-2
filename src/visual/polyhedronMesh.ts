import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
export type Vec3=[number,number,number];
export interface PolyhedronMesh{id:string;vertices:Vec3[];faces:number[][];edgeMode?:'all'|'silhouette'}
type P=[number,number];
const project=([x,y,z]:Vec3):P=>[50+x*22+z*10,52-y*22-z*7];
const line=(a:P,b:P,s='polyhedron-edge'):GeometryPrimitiveSpec=>({type:'line',attrs:{x1:a[0],y1:a[1],x2:b[0],y2:b[1]},semantic:s});

export function meshToGeometry(mesh:PolyhedronMesh):GeometryModel{
 const pts=mesh.vertices.map(project),edges=new Set<string>(),primitives:GeometryPrimitiveSpec[]=[];
 for(const face of mesh.faces)for(let i=0;i<face.length;i++){const a=face[i],b=face[(i+1)%face.length],key=a<b?`${a}-${b}`:`${b}-${a}`;if(!edges.has(key)){edges.add(key);primitives.push(line(pts[a],pts[b]))}}
 return{id:mesh.id,dimension:'2.5D',primitives,anchors:{...Object.fromEntries(pts.map((p,i)=>[`v${i}`,p])),center:[50,50]}};
}

const phi=(1+Math.sqrt(5))/2;
export const POLYHEDRON_MESHES:Record<string,PolyhedronMesh>={
 tetrahedron:{id:'tetrahedron',vertices:[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],faces:[[0,1,2],[0,3,1],[0,2,3],[1,3,2]]},
 cube:{id:'cube',vertices:[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],faces:[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]]},
 octahedron:{id:'octahedron',vertices:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],faces:[[0,2,4],[2,1,4],[1,3,4],[3,0,4],[2,0,5],[1,2,5],[3,1,5],[0,3,5]]},
 icosahedron:{id:'icosahedron',vertices:[[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]],faces:[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]]}
};

export function buildPolyhedron(id:string){const mesh=POLYHEDRON_MESHES[id];return mesh?meshToGeometry(mesh):null}
