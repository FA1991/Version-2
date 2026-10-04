import{useEffect,useRef}from'react';import rough from'roughjs/bin/rough';import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
const n=(p:GeometryPrimitiveSpec,k:string,d=0)=>typeof p.attrs[k]==='number'?p.attrs[k] as number:d;
const pts=(s:string)=>s.trim().split(/\s+/).map(v=>v.split(',').map(Number) as [number,number]);
export function GeometrySvg({model}:{model:GeometryModel}){const ref=useRef<SVGSVGElement>(null);useEffect(()=>{const svg=ref.current;if(!svg)return;svg.replaceChildren();const rc=rough.svg(svg);const opt={stroke:'#14264c',strokeWidth:.75,roughness:1.15,bowing:1.1,seed:17,fill:'none'} as const;
 for(const p of model.primitives){if(p.type==='text'){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',String(n(p,'x')));t.setAttribute('y',String(n(p,'y')));t.setAttribute('class','geoText '+(p.semantic??''));t.textContent=String(p.attrs.text??'');svg.appendChild(t);continue}let node:SVGGElement|null=null;
  if(p.type==='line')node=rc.line(n(p,'x1'),n(p,'y1'),n(p,'x2'),n(p,'y2'),{...opt,strokeLineDash:p.semantic==='hidden-edge'?[2,2]:undefined});
  else if(p.type==='circle')node=rc.circle(n(p,'cx'),n(p,'cy'),2*n(p,'r'),opt);
  else if(p.type==='ellipse')node=rc.ellipse(n(p,'cx'),n(p,'cy'),2*n(p,'rx'),2*n(p,'ry'),opt);
  else if(p.type==='polygon')node=rc.polygon(pts(String(p.attrs.points??'')),opt);
  else if(p.type==='polyline')node=rc.linearPath(pts(String(p.attrs.points??'')),opt);
  else if(p.type==='path')node=rc.path(String(p.attrs.d??''),opt);
  else if(p.type==='point')node=rc.circle(n(p,'cx'),n(p,'cy'),2.6,{...opt,fill:'#14264c'});
  if(node){node.setAttribute('class','geo '+(p.semantic??''));svg.appendChild(node)}
 }},[model]);return <svg ref={ref} className="geometrySvg" viewBox="0 0 100 100" role="img" aria-label={model.id}/>}