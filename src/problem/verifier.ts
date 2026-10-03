import type{RecognizedVariable}from'./variableRecognizer';
import type{SolveResult}from'./solver';

export interface VerificationCheck{name:string;passed:boolean;message:string}
export interface VerificationResult{passed:boolean;confidence:number;checks:VerificationCheck[];warnings:string[]}

const NON_NEGATIVE=new Set(['m','t','r','A','KE','PE','M','n']);
const EXPECTED_UNITS:Record<string,string[]>={a:['m/s²','m/s^2'],v:['m/s'],s:['m'],F:['N'],F_net:['N'],m:['kg'],t:['s'],KE:['J'],PE:['J'],V:['V'],I:['A'],R:['Ω'],A:['m²'],C:['m'],r:['m'],M:['mol/L'],n:['mol'],P:['Pa']};

export function verifySolution(solution:SolveResult,vars:RecognizedVariable[]):VerificationResult{
 const checks:VerificationCheck[]=[],warnings:string[]=[];
 checks.push({name:'solver-success',passed:solution.success,message:solution.success?'Solver produced a finite result.':'Solver did not produce a result.'});
 if(solution.target&&solution.value!==null){
  const finite=Number.isFinite(solution.value);checks.push({name:'finite-number',passed:finite,message:finite?'Result is finite.':'Result is not finite.'});
  if(NON_NEGATIVE.has(solution.target)){const ok=solution.value>=0;checks.push({name:'physical-domain',passed:ok,message:ok?'Result is inside the expected non-negative domain.':'Result violates an expected non-negative domain.'});}
  const expected=EXPECTED_UNITS[solution.target];if(expected){const ok=!!solution.unit&&expected.includes(solution.unit);checks.push({name:'output-unit',passed:ok,message:ok?`Output unit ${solution.unit} matches the target.`:`Expected unit compatible with ${expected.join(' or ')}.`});}
 }
 for(const v of vars){if(!Number.isFinite(v.value))checks.push({name:`input-${v.symbol}`,passed:false,message:`${v.symbol} is not a finite number.`});if(v.symbol==='m'&&v.value<=0)warnings.push('Mass should normally be greater than zero.');if(v.symbol==='theta'&&(v.value<-360||v.value>360))warnings.push('Angle is outside the normal ±360° range; verify the input.');}
 const passed=checks.length>0&&checks.every(c=>c.passed);const confidence=checks.length?Number((checks.filter(c=>c.passed).length/checks.length).toFixed(2)):0;
 return{passed,confidence,checks,warnings};
}