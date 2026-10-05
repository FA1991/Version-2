import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
import{polygonSideCount}from'./geometryQuestionAnalyzer';
import{findGeometryFormula,ruleEquation,ruleTargetSymbol}from'./geometryFormulaRegistry';

export interface GeometrySolveResult{success:boolean;formula:string|null;value:number|null;unit:string|null;steps:string[];message:string;exact?:string;symbols?:string[];ruleId?:string;targetSymbol?:string;equation?:string}

const round=(x:number)=>Number(x.toFixed(4));
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const piExact=(co:number)=>{if(!Number.isFinite(co))return undefined;const scale=1000000,n=Math.round(co*scale),d=gcd(Math.abs(n),scale),nn=n/d,dd=scale/d;return dd===1?String(nn)+'π':String(nn)+'π/'+String(dd)};
const linearUnit=(u:string)=>u.replace(/[²³]$/,'');
const base=(a:GeometryQuestionAnalysis)=>{const preferred=Object.entries(a.units).find(([k,v])=>v!=='°'&&!['A','V','SA','LA','B'].includes(k)&&k!=='__pi')?.[1]??Object.values(a.units).find(v=>v&&v!=='°')??'';return linearUnit(preferred)};
const outputUnit=(a:GeometryQuestionAnalysis,p:0|1|2|3)=>{if(p===0)return'°';const u=base(a);return u?u+(p===2?'²':p===3?'³':''):null};
const names:Record<string,string>={V:'volume',r:'radius',d:'diameter',h:'height',A:'area',P:'perimeter',C:'circumference',L:'arc length',SA:'surface area',LA:'lateral area',l:'length',w:'width',b:'base',B:'base area',s:'side length',sl:'slant height',theta:'central angle',angle1:'angle 1',angle2:'angle 2',d1:'diagonal 1',d2:'diagonal 2',ap:'apothem',a:'side a',c:'hypotenuse',m:'midsegment',n:'number of sides'};
function givenRows(a:GeometryQuestionAnalysis){const n=polygonSideCount(a.shape,a.givens),rows=Object.entries(a.givens).filter(([k])=>k!=='__pi'&&k!=='n').map(([k,v])=>k+'='+v);if(n!=null&&a.regularPolygon)rows.push('n='+n);if(a.givens.__pi!=null)rows.push('π='+a.givens.__pi);return rows}
function substituteEquation(eq:string,a:GeometryQuestionAnalysis){const g=a.givens,n=polygonSideCount(a.shape,g);if(eq.includes('sum(sides)'))return'P = '+Object.entries(g).filter(([k])=>/^side\\d+$/.test(k)).map(([,v])=>v).join(' + ');const i=eq.indexOf('=');if(i<0)return eq;const left=eq.slice(0,i+1),rhs=eq.slice(i+1).replace(/\\b(?:theta|angle1|angle2|d1|d2|SA|LA|ap|[A-Za-z])\\b/g,t=>{if(t==='pi')return g.__pi!=null?String(g.__pi):'π';if(t==='n'&&n!=null)return String(n);if(['sqrt','cbrt','sum'].includes(t))return t;const v=g[t];return v!=null?'('+v+')':t});return(left+' '+rhs.trim()).replaceAll('*',' × ').replaceAll('^2','²').replaceAll('^3','³').replaceAll('sqrt','√').replaceAll('cbrt','∛')}
export function solveGeometry(a:GeometryQuestionAnalysis):GeometrySolveResult{
 if(a.warnings.some(w=>w.startsWith('Mixed measurement')))return{success:false,formula:null,value:null,unit:null,steps:[],message:'Convert all measurements to the same unit before solving.'};
 const rule=findGeometryFormula(a);
 if(!rule)return{success:false,formula:null,value:null,unit:null,steps:[],message:'No registered formula matches '+(a.shape??'this shape')+' → '+(a.target??'unknown target')+' with the available givens.'};
 const raw=rule.solve(a.givens,a);
 if(raw==null||!Number.isFinite(raw))return{success:false,formula:rule.formula,value:null,unit:null,steps:[],message:'The registered formula '+rule.id+' could not produce a valid value.',ruleId:rule.id};
 const value=round(raw),symbol=ruleTargetSymbol(rule,a),equation=ruleEquation(rule,a),unit=outputUnit(a,rule.power);
 const exactCoefficient=rule.exactPiCoefficient?.(a.givens,a),exact=exactCoefficient!=null?piExact(exactCoefficient):undefined;
 const direct=rule.formula.trim().startsWith(symbol+' =');
 const formulaStep=direct?'Use the full formula: '+rule.formula+'.':'Start with the full formula: '+rule.formula+'. Then isolate '+symbol+': '+equation.replaceAll('pi','π')+'.';
 const substitution=substituteEquation(equation,a),resultText=exact??String(value)+(unit?' '+unit:'');
 const steps=['Find '+a.target+' ('+symbol+').',formulaStep,'Given: '+givenRows(a).join(', ')+'.','Substitute: '+substitution+'.','Simplify: '+symbol+' = '+resultText+'.',exact?'Approximate: '+symbol+' = '+value+(unit?' '+unit:'')+'.':'Answer: '+symbol+' = '+value+(unit?' '+unit:'')+'.'];
 const symbols=Object.keys(a.givens).filter(k=>k!=='n'&&k!=='__pi').map(k=>k+' = '+(names[k]??k));if(a.regularPolygon&&polygonSideCount(a.shape,a.givens)!=null)symbols.push('n = number of sides');
 return{success:true,formula:rule.formula,value,unit,exact,symbols,steps,message:'Solved with formula registry rule '+rule.id+'.',ruleId:rule.id,targetSymbol:symbol,equation};
}
