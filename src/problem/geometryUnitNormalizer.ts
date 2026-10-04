import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
export interface NormalizedGeometry{analysis:GeometryQuestionAnalysis;converted:boolean;notes:string[]}
const lengthToMeters:Record<string,number>={mm:.001,cm:.01,m:1,km:1000,in:.0254,ft:.3048,yd:.9144};
export function normalizeGeometryUnits(a:GeometryQuestionAnalysis):NormalizedGeometry{
 const present=Object.entries(a.units).filter(([,u])=>u&&lengthToMeters[u]!=null);const unique=[...new Set(present.map(([,u])=>u))];if(unique.length<=1)return{analysis:a,converted:false,notes:[]};
 const target=present[0]?.[1]??unique[0],targetFactor=lengthToMeters[target];const givens={...a.givens},units={...a.units};
 for(const[sym,u]of present){givens[sym]=givens[sym]*lengthToMeters[u]/targetFactor;units[sym]=target}
 const warnings=a.warnings.filter(w=>!w.startsWith('Mixed measurement'));return{analysis:{...a,givens,units,warnings},converted:true,notes:[`Converted measurements to ${target} before solving.`]};
}