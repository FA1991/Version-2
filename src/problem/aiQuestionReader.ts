import type{GeometryQuestionAnalysis}from'../problem/geometryQuestionAnalyzer';
export interface AIReaderResult{analysis:{subject:'geometry';shape:string|null;givens:Record<string,number>;units:Record<string,string>;target:string|null;constraints:string[];keywords:string[];confidence:number};reader:'ai'}
const endpoint=(import.meta.env.VITE_AI_PARSER_URL||'').trim();
export async function readGeometryQuestionWithAI(question:string):Promise<AIReaderResult|null>{
 if(!endpoint)return null;
 const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});
 if(!r.ok)throw new Error('AI reader unavailable');
 return r.json();
}
export function aiToGeometryAnalysis(question:string,x:AIReaderResult['analysis']):GeometryQuestionAnalysis{
 return{originalQuestion:question,shape:x.shape,givens:x.givens,units:x.units,target:x.target,regularPolygon:x.constraints.some(c=>/regular/i.test(c)),confidence:x.confidence,warnings:x.confidence<.75?['AI reader confidence is low; interpretation should be reviewed.']:[]};
}
