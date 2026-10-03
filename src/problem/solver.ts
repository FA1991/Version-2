import type{RecognizedVariable}from'./variableRecognizer';
import type{FormulaCandidate}from'./analyzer';

export interface SolutionStep{kind:'formula'|'substitution'|'calculation'|'answer'|'warning';text:string}
export interface SolveResult{success:boolean;target:string|null;value:number|null;unit:string|null;steps:SolutionStep[];formulaId:string|null;verified:boolean;message:string}

const CONSTANTS:Record<string,number>={g:9.81,pi:Math.PI};
const OUTPUT_UNITS:Record<string,string>={a:'m/s²',v:'m/s',u:'m/s',s:'m',F:'N',F_net:'N',m:'kg',t:'s',KE:'J',PE:'J',p:'kg·m/s',V:'V',I:'A',R:'Ω',A:'m²',C:'m',r:'m',M:'mol/L',n:'mol',P:'Pa'};

function values(vars:RecognizedVariable[]){const x:Record<string,number>={...CONSTANTS};for(const v of vars)x[v.symbol]=v.value;return x}
function rad(x:number){return x*Math.PI/180}

/* Deterministic evaluator for approved formula IDs. Complex symbolic work will move to SymPy. */
function evaluate(id:string,x:Record<string,number>):number|null{
 switch(id){
  case'physics.dynamics.incline.acceleration':return(x.F-x.m*x.g*Math.sin(rad(x.theta)))/x.m;
  case'physics.dynamics.newton2':return x.F_net/x.m;
  case'physics.kinematics.velocity':return x.u+x.a*x.t;
  case'physics.kinematics.displacement':return x.u*x.t+.5*x.a*x.t*x.t;
  case'physics.kinematics.no_time':return Math.sqrt(x.u*x.u+2*x.a*x.s);
  case'physics.energy.kinetic':return .5*x.m*x.v*x.v;
  case'physics.energy.gravitational':return x.m*x.g*x.h;
  case'physics.momentum':return x.m*x.v;
  case'physics.waves.speed':return x.f*x.lambda;
  case'physics.circuits.ohm':return x.I*x.R;
  case'math.geometry.circle.area':return Math.PI*x.r*x.r;
  case'math.geometry.circle.circumference':return 2*Math.PI*x.r;
  case'math.geometry.triangle.area':return .5*x.b*x.h;
  case'math.geometry.rectangle.area':return x.l*x.w;
  case'chem.stoich.moles':return x.m/x.M;
  case'chem.solutions.molarity':return x.n/x.V;
  case'chem.acidbase.ph':return-Math.log10(x.H);
  default:return null;
 }
}

export function solveBestCandidate(candidates:FormulaCandidate[],vars:RecognizedVariable[]):SolveResult{
 const candidate=candidates.find(c=>c.missing.length===0&&c.matchScore>=.75);
 if(!candidate)return{success:false,target:null,value:null,unit:null,steps:[{kind:'warning',text:'Not enough verified information to solve yet.'}],formulaId:null,verified:false,message:'No eligible formula has all required variables.'};
 const x=values(vars),answer=evaluate(candidate.id,x);
 const steps:SolutionStep[]=[{kind:'formula',text:`Use: ${candidate.formula}`}];
 if(candidate.rearrangement.rearranged&&candidate.rearrangement.rearranged!==candidate.formula)steps.push({kind:'formula',text:`Rearrange: ${candidate.rearrangement.rearranged}`});
 steps.push({kind:'substitution',text:'Substitute the recognized values and approved constants.'});
 if(answer===null||!Number.isFinite(answer))return{success:false,target:candidate.target,value:null,unit:null,steps:[...steps,{kind:'warning',text:'This formula requires the symbolic solver or additional evaluation support.'}],formulaId:candidate.id,verified:false,message:'Evaluation deferred safely.'};
 const rounded=Number(answer.toFixed(4)),unit=OUTPUT_UNITS[candidate.target]??null;
 steps.push({kind:'calculation',text:`Calculate: ${candidate.target} = ${rounded}${unit?' '+unit:''}`},{kind:'answer',text:`Answer: ${rounded}${unit?' '+unit:''}`});
 return{success:true,target:candidate.target,value:rounded,unit,steps,formulaId:candidate.id,verified:true,message:'Solved with a complete deterministic formula match.'};
}