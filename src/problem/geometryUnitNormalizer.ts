import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
export interface NormalizedGeometry{analysis:GeometryQuestionAnalysis;converted:boolean;notes:string[]}
const lengthToMeters:Record<string,number>={mm:.001,cm:.01,m:1,km:1000,in:.0254,ft:.3048,yd:.9144};
const parseUnit=(u:string)=>{const m=u.match(/^(mm|cm|m|km|in|ft|yd)(?:\^?([23])|([²³]))?$/);if(!m)return null;const power=m[2]?Number(m[2]):m[3]==='²'?2:m[3]==='³'?3:1;return{base:m[1],power}};
export function normalizeGeometryUnits(a:GeometryQuestionAnalysis):NormalizedGeometry{
 const present=Object.entries(a.units).map(([sym,u])=>[sym,u,parseUnit(u)] as const).filter((x):x is readonly [string,string,{base:string;power:number}]=>x[2]!=null);const linear=present.filter(([, ,p])=>p.power===1),targetBase=linear[0]?.[2].base??present[0]?.[2].base;if(!targetBase)return{analysis:a,converted:false,notes:[]};const needs=present.some(([, ,p])=>p.base!==targetBase);if(!needs)return{analysis:a,converted:false,notes:[]};
 const targetFactor=lengthToMeters[targetBase];const givens={...a.givens},units={...a.units};
 for(const[sym,,p]of present){givens[sym]=givens[sym]*(lengthToMeters[p.base]/targetFactor)**p.power;units[sym]=targetBase+(p.power===2?'²':p.power===3?'³':'')}
 const warnings=a.warnings.filter(w=>!w.startsWith('Mixed measurement'));return{analysis:{...a,givens,units,warnings},converted:true,notes:[`Converted measurements to compatible ${targetBase} units before solving.`]};
}