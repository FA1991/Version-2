import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
import type{GeometrySolveResult}from'./geometrySolver';
import{findGeometryFormula}from'./geometryFormulaRegistry';

export interface GeometryVerification{valid:boolean;checks:string[];errors:string[]}
const near=(a:number,b:number,tol=1e-3)=>Math.abs(a-b)<=tol*Math.max(1,Math.abs(b));

export function verifyGeometry(a:GeometryQuestionAnalysis,s:GeometrySolveResult):GeometryVerification{
 const checks:string[]=[],errors:string[]=[];
 if(!s.success||s.value==null)return{valid:false,checks,errors:['No solved value to verify.']};
 if(!Number.isFinite(s.value))errors.push('Answer is not finite.');else checks.push('Answer is finite.');
 if(s.value<0&&['area','surface-area','lateral-area','sector-area','volume','perimeter','circumference','radius','diameter','hypotenuse','length','width','height','base','side','diagonal','arc-length','slant-height'].includes(a.target??''))errors.push('A geometric measurement cannot be negative.');else checks.push('Answer satisfies geometric sign constraints.');
 const rule=findGeometryFormula(a);
 if(!rule)errors.push('No formula-registry rule exists for verification.');
 else{
  const expected=rule.power;
  if(s.unit&&s.unit!=='°'){
   if(expected===3&&!s.unit.endsWith('³'))errors.push('Volume requires cubic units.');
   else if(expected===2&&!s.unit.endsWith('²'))errors.push('Area requires square units.');
   else if(expected===1&&(s.unit.endsWith('²')||s.unit.endsWith('³')))errors.push('Linear measurement requires linear units.');
   else checks.push('Output unit dimension matches the registered formula.');
  }
  const recomputed=rule.solve(a.givens,a);
  if(recomputed==null||!Number.isFinite(recomputed))errors.push('Registered verification calculation failed.');
  else if(!near(s.value,recomputed))errors.push('Formula-registry substitution check failed.');
  else checks.push('Answer matches the selected formula rule.');
  if(s.ruleId&&s.ruleId!==rule.id)errors.push('Solver and verifier selected different formula rules.');else checks.push('Solver and verifier selected the same formula rule.');
 }
 return{valid:errors.length===0,checks,errors};
}
