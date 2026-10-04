import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
export interface ParserLearningExample{question:string;shape:string|null;target:string|null;keywords:string[];constraints:string[];confidence:number;capturedAt:string}
const KEY='geometry-parser-learning-v2';
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9°-]+/g,' ').trim();
export function rememberParserExample(x:Omit<ParserLearningExample,'capturedAt'>){
 if(typeof localStorage==='undefined'||x.confidence<.8)return;
 try{const old=JSON.parse(localStorage.getItem(KEY)||'[]') as ParserLearningExample[];if(old.some(e=>norm(e.question)===norm(x.question)))return;old.push({...x,capturedAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(old.slice(-500)))}catch{}
}
export function parserLearningExamples():ParserLearningExample[]{if(typeof localStorage==='undefined')return[];try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function applyLearnedParserHints(question:string,base:GeometryQuestionAnalysis):GeometryQuestionAnalysis{
 const q=norm(question),examples=parserLearningExamples();let best:ParserLearningExample|null=null,score=0;
 for(const e of examples){const terms=e.keywords.map(norm).filter(k=>k.length>=3);const hits=terms.filter(k=>q.includes(k)).length;const s=terms.length?hits/Math.max(2,terms.length):0;if(hits>=1&&s>score){score=s;best=e}}
 if(!best||score<.34)return base;
 return{...base,shape:base.shape??best.shape,target:base.target??best.target,regularPolygon:base.regularPolygon||best.constraints.some(c=>/regular/i.test(c)),warnings:[...base.warnings,`Learned parser hint reused from a previously verified question (match ${Math.round(score*100)}%).`]};
}
