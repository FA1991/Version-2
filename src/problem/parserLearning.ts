export interface ParserLearningExample{question:string;shape:string|null;target:string|null;keywords:string[];constraints:string[];confidence:number;capturedAt:string}
const KEY='geometry-parser-learning-v1';
export function rememberParserExample(x:Omit<ParserLearningExample,'capturedAt'>){
 if(typeof localStorage==='undefined'||x.confidence<.8)return;
 try{const old=JSON.parse(localStorage.getItem(KEY)||'[]') as ParserLearningExample[];if(old.some(e=>e.question===x.question))return;old.push({...x,capturedAt:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(old.slice(-500)))}catch{}
}
export function parserLearningExamples():ParserLearningExample[]{if(typeof localStorage==='undefined')return[];try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
