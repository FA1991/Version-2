import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
export interface LearnedKeyword{keyword:string;role:'shape'|'target';value:string;uses:number;confidence:number}
const KEY='geometry-keywords-v2';
const clean=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9 -]/g,'').replace(/\s+/g,' ');
export function learnVerifiedSemanticKeywords(keywords:string[],shape:string|null,target:string|null,confidence:number){
 if(typeof localStorage==='undefined'||confidence<.8)return;
 try{const rows=JSON.parse(localStorage.getItem(KEY)||'[]') as LearnedKeyword[];const pairs:[string,'shape'|'target',string|null][]=[];for(const k of keywords){const keyword=clean(k);if(!keyword||keyword.length<3)continue;if(shape&&keyword.includes(clean(shape)))pairs.push([keyword,'shape',shape]);if(target&&keyword.includes(clean(target)))pairs.push([keyword,'target',target])}if(shape)pairs.push([clean(shape),'shape',shape]);if(target)pairs.push([clean(target),'target',target]);for(const[keyword,role,value]of pairs){if(!value)continue;const row=rows.find(x=>x.keyword===keyword&&x.role===role&&x.value===value);if(row){row.uses++;row.confidence=Math.min(.99,(row.confidence+confidence)/2)}else rows.push({keyword,role,value,uses:1,confidence})}localStorage.setItem(KEY,JSON.stringify(rows.sort((a,b)=>b.uses-a.uses).slice(0,300)))}catch{}
}
export function learnedKeywords():LearnedKeyword[]{if(typeof localStorage==='undefined')return[];try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
export function applyLearnedKeywordHints(question:string,base:GeometryQuestionAnalysis):GeometryQuestionAnalysis{
 const q=clean(question),rows=learnedKeywords().filter(x=>q.includes(x.keyword)&&x.uses>=2&&x.confidence>=.85);if(!rows.length)return base;
 const score=(role:'shape'|'target')=>{const m=new Map<string,number>();for(const r of rows.filter(x=>x.role===role))m.set(r.value,(m.get(r.value)||0)+r.uses*r.confidence);return[...m].sort((a,b)=>b[1]-a[1])[0]?.[0]??null};
 return{...base,shape:base.shape??score('shape'),target:base.target??score('target')};
}
