import type{GeometryQuestionAnalysis}from'../problem/geometryQuestionAnalyzer';
import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
import{buildGeometry}from'./geometryEngine';import{buildExtendedGeometry}from'./geometryExtended';import{Polygon,Prism,Pyramid}from'./familyGenerators';
const text=(x:number,y:number,value:string):GeometryPrimitiveSpec=>({type:'text',attrs:{x,y,text:value},semantic:'measurement-label'});
export function geometryDiagram(a:GeometryQuestionAnalysis):GeometryModel|null{
 let id=a.shape;if(!id)return null;let m:GeometryModel|null=null;
 const aliases:Record<string,string>={'right triangle':'triangle','equilateral triangle':'triangle','isosceles triangle':'triangle','semicircle':'semicircle','triangular prism':'triangular-prism'};
 id=aliases[id]??id;m=buildGeometry(id,a.givens as Record<string,number|string>)??buildExtendedGeometry(id,a.givens as Record<string,number|string>);
 if(!m&&id==='triangular-prism')m=Prism(3);if(!m&&id==='pyramid')m=Pyramid(4);if(!m&&/gon$/.test(id))m=Polygon(6);if(!m)return null;
 const u=Object.values(a.units).find(Boolean)??'',g=a.givens,labels:GeometryPrimitiveSpec[]=[];
 if(g.r!=null)labels.push(text(61,48,`r = ${g.r} ${u}`));if(g.d!=null)labels.push(text(48,47,`d = ${g.d} ${u}`));
 if(g.l!=null)labels.push(text(43,88,`l = ${g.l} ${u}`));if(g.w!=null)labels.push(text(80,56,`w = ${g.w} ${u}`));if(g.h!=null)labels.push(text(82,48,`h = ${g.h} ${u}`));if(g.b!=null)labels.push(text(45,87,`b = ${g.b} ${u}`));if(g.s!=null)labels.push(text(42,88,`s = ${g.s} ${u}`));
 labels.push(text(8,10,`Find: ${a.target??'?'}`));return{...m,primitives:[...m.primitives,...labels]};
}