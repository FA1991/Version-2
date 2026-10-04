import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';

export interface LearnedKeyword{keyword:string;shape:string|null;target:string|null;uses:number;confidence:number}
const KEY='geometry-keywords-v1';
const STOP=new Set(['the','a','an','has','have','with','and','or','of','to','is','are','what','find','calculate','determine','its','it','in','for','given','length']);
const words=(s:string)=>[...new Set(s.toLowerCase().replace(/[^a-z0-9-]+/g,' ').split(/\s+/).filter(x=>x.length>=3&&!STOP.has(x)&&!/^\d/.test(x)))];

export function learnVerifiedKeywords(question:string,shape:string|null,target:string|null,confidence:number){
 if(typeof localStorage==='undefined'||confidence<.8||(!shape&&!target))return;
 try{const rows=JSON.parse(localStorage.getItem(KEY)||'[]') as LearnedKeyword[];for(const keyword of words(question)){const row=rows.find(x=>x.keyword===keyword&&x.shape===shape&&x.target===target);if(row){row.uses++;row.confidence=Math.min(.99,(row.confidence+confidence)/2)}else rows.push({keyword,shape,target,uses:1,confidence})}localStorage.setItem(KEY,JSON.stringify(rows.sort((a,b)=>b.uses-a.uses).slice(0,300)))}catch{}
}
export function learnedKeywords():LearnedKeyword[]{if(typeof localStorage==='undefined')return[];try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function applyLearnedKeywordHints(question:string,base:GeometryQuestionAnalysis):GeometryQuestionAnalysis{
 const q=new Set(words(question)),rows=learnedKeywords().filter(x=>q.has(x.keyword)&&x.uses>=2&&x.confidence>=.85);
 if(!rows.length)return base;
 const score=(field:'shape'|'target')=>{const m=new Map<string,number>();for(const r of rows){const v=r[field];if(v)m.set(v,(m.get(v)||0)+r.uses*r.confidence)}return[...m].sort((a,b)=>b[1]-a[1])[0]?.[0]??null};
 return{...base,shape:base.shape??score('shape'),target:base.target??score('target')};
}
