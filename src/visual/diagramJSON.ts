import type{GeometryQuestionAnalysis}from'../problem/geometryQuestionAnalyzer';
import type{GeometryModel}from'./geometryEngine';
import{geometryDiagram}from'./geometryDiagram';

export interface DiagramJSON{
 shape:string;
 highlight:string|null;
 labels:Record<string,string>;
 model:GeometryModel;
}
export function toDiagramJSON(a:GeometryQuestionAnalysis):DiagramJSON|null{
 const model=geometryDiagram(a);if(!model||!a.shape)return null;
 const labels:Record<string,string>={};for(const[k,v]of Object.entries(a.givens)){if(k==='__pi'||k==='n')continue;const unit=a.units[k]??'';labels[k]=`${v}${unit?' '+unit:''}`}
 return{shape:a.shape,highlight:a.target,labels,model};
}
