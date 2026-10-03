import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const a=(p:GeometryPrimitiveSpec,k:string,d=0)=>typeof p.attrs[k]==='number'?p.attrs[k] as number:d;
function primitive(p:GeometryPrimitiveSpec){
 const sem=esc(p.semantic??'geometry');
 switch(p.type){
  case'line':return <line x1={a(p,'x1')} y1={a(p,'y1')} x2={a(p,'x2')} y2={a(p,'y2')} className={`geo ${sem}`}/>;
  case'polyline':return <polyline points={String(p.attrs.points??'')} className={`geo ${sem}`}/>;
  case'polygon':return <polygon points={String(p.attrs.points??'')} className={`geo ${sem}`}/>;
  case'circle':return <circle cx={a(p,'cx')} cy={a(p,'cy')} r={a(p,'r')} className={`geo ${sem}`}/>;
  case'ellipse':return <ellipse cx={a(p,'cx')} cy={a(p,'cy')} rx={a(p,'rx')} ry={a(p,'ry')} className={`geo ${sem}`}/>;
  case'path':return <path d={String(p.attrs.d??'')} className={`geo ${sem}`}/>;
  case'point':return <circle cx={a(p,'cx')} cy={a(p,'cy')} r="1.3" className={`geo point ${sem}`}/>;
  case'text':return <text x={a(p,'x')} y={a(p,'y')} className={`geoText ${sem}`}>{String(p.attrs.text??'')}</text>;
 }
}
export function GeometrySvg({model}:{model:GeometryModel}){return <svg className="geometrySvg" viewBox="0 0 100 100" role="img" aria-label={model.id}><defs><filter id="geoPencil"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale=".22"/></filter></defs>{model.primitives.map((p,i)=><g key={i}>{primitive(p)}</g>)}</svg>}
