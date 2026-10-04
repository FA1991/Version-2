export interface ProblemQuantity{value:number;unit:string|null;meaning:string}
export interface GeometryProblemJSON{
 subject:'geometry';
 topic:string|null;
 givens:Record<string,ProblemQuantity>;
 find:{symbol:string;meaning:string;unit:string|null}|null;
 constraints:string[];
 constants:Record<string,number>;
 keywords:string[];
 confidence:number;
}
export interface AIReaderResult{problem:GeometryProblemJSON;reader:'ai'}
const endpoint=(import.meta.env.VITE_AI_PARSER_URL||((import.meta.env.PROD&&location.hostname.endsWith('vercel.app'))?'/api/parse-question':'')).trim();
const keys=new Set(['r','d','b','h','l','w','s','a','c','sl','d1','d2','ap','P','B','theta','angle1','angle2','n','A','V','C','SA','LA']);
const targetBySymbol:Record<string,string>={A:'area',P:'perimeter',C:'circumference',V:'volume',r:'radius',d:'diameter',d1:'diagonal',d2:'diagonal',SA:'surface-area',LA:'lateral-area',c:'hypotenuse',a:'leg',h:'height',b:'base',B:'base',l:'length',w:'width',s:'side',theta:'angle'};
function valid(x:any):x is AIReaderResult{if(!x||x.reader!=='ai'||x.problem?.subject!=='geometry'||typeof x.problem.confidence!=='number'||x.problem.confidence<0||x.problem.confidence>1||!Array.isArray(x.problem.constraints)||!Array.isArray(x.problem.keywords)||!x.problem.constants||!x.problem.givens)return false;for(const[k,v]of Object.entries(x.problem.givens) as any){if(!keys.has(k)||typeof v?.value!=='number'||!Number.isFinite(v.value)||typeof v.meaning!=='string')return false}for(const v of Object.values(x.problem.constants) as any){if(typeof v!=='number'||!Number.isFinite(v))return false}return !x.problem.find||(typeof x.problem.find.symbol==='string'&&typeof x.problem.find.meaning==='string')}
export async function readGeometryQuestionWithAI(question:string):Promise<AIReaderResult|null>{if(!endpoint)return null;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question}),signal:controller.signal});if(!r.ok)throw new Error('AI reader unavailable');const x=await r.json();if(!valid(x))throw new Error('Invalid AI reader response');return x}finally{clearTimeout(timer)}}
export function aiProblemToLegacyAnalysis(question:string,p:GeometryProblemJSON){const givens:Record<string,number>={},units:Record<string,string>={};for(const[k,v]of Object.entries(p.givens)){givens[k]=v.value;if(v.unit)units[k]=v.unit}if(p.constants.pi!=null)givens.__pi=p.constants.pi;return{originalQuestion:question,shape:p.topic,givens,units,target:p.find?(targetBySymbol[p.find.symbol]??p.find.meaning):null,regularPolygon:p.constraints.some(c=>/regular/i.test(c)),confidence:p.confidence,warnings:p.confidence<.75?['AI reader confidence is low; interpretation should be reviewed.']:[]}}
