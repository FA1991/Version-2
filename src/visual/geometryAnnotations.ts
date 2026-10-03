import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';

export type GeometryAnnotation={kind:'length'|'angle'|'radius'|'diameter'|'height'|'parallel'|'perpendicular'|'equal'|'unknown';from?:[number,number];to?:[number,number];at?:[number,number];label:string}

export function annotationPrimitives(items:GeometryAnnotation[]):GeometryPrimitiveSpec[]{
 return items.flatMap(a=>{
  if(a.from&&a.to){const mx=(a.from[0]+a.to[0])/2,my=(a.from[1]+a.to[1])/2;return[{type:'line',attrs:{x1:a.from[0],y1:a.from[1],x2:a.to[0],y2:a.to[1]},semantic:`measure-${a.kind}`},{type:'text',attrs:{x:mx,y:my-2,text:a.label},semantic:'measurement-label'}] as GeometryPrimitiveSpec[]}
  if(a.at)return[{type:'text',attrs:{x:a.at[0],y:a.at[1],text:a.label},semantic:`annotation-${a.kind}`}] as GeometryPrimitiveSpec[];
  return[];
 });
}
export function annotateGeometry(model:GeometryModel,items:GeometryAnnotation[]):GeometryModel{return{...model,primitives:[...model.primitives,...annotationPrimitives(items)]}}
