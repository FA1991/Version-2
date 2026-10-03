import{STEM_TAXONOMY}from'../knowledge/stemTaxonomy';
import{formulasFor}from'../knowledge/formulaLibrary';
import{recognizeVariables,symbolsAvailable,RecognizedVariable}from'./variableRecognizer';
import{rearrangeFormula,RearrangementResult}from'./formulaManipulator';
export interface Classification{subject:string;topic:string;problemType:string;confidence:number;evidence:string[]}\nexport interface FormulaCandidate{id:string;formula:string;target:string;requires:string[];missing:string[];matchScore:number;rearrangement:RearrangementResult}\nexport interface ProblemAnalysis{originalQuestion:string;givens:string[];find:string[];conditions:string[];objects:string[];variables:RecognizedVariable[];classification:Classification;formulaCandidates:FormulaCandidate[]}

const objectWords=['box','ball','car','block','person','stone','projectile','incline','ramp','circle','triangle','spring','pulley'];

function classify(q:string):Classification{
 const s=q.toLowerCase();let best:any=null;
 for(const rule of STEM_TAXONOMY){const primary=rule.terms.filter(t=>s.includes(t));const secondary=(rule.boost??[]).filter(t=>s.includes(t));const score=primary.length*3+secondary.length;if(score>0&&(!best||score>best.score))best={rule,score,evidence:[...primary,...secondary]};}
 return best?{subject:best.rule.subject,topic:[best.rule.area,best.rule.topic,best.rule.subtopic].filter(Boolean).join(' → '),problemType:best.rule.problemType,confidence:Math.min(.98,.5+best.score*.06),evidence:best.evidence}:{subject:'Unknown',topic:'Unknown',problemType:'Unknown',confidence:0,evidence:[]};
}

export function analyzeQuestion(question:string):ProblemAnalysis{
 const q=question.trim();const givens:string[]=[];const conditions:string[]=[];const objects:string[]=[];
 const measurements=[...q.matchAll(/(-?\d+(?:\.\d+)?)\s*(kg|g|m\/s²|m\/s\^2|m\/s|m|cm|mm|km|N|J|W|Pa|s|°|degrees?)/gi)];
 for(const m of measurements){const value=m[1],unit=m[2];let label='Value';const before=q.slice(Math.max(0,(m.index??0)-45),m.index??0).toLowerCase();
  if(/mass|weigh|\b[a-z]*\s*$/.test(before)&&/kg|\bg\b/i.test(unit))label='Mass';
  if(/angle|incline|ramp/.test(before)&&/°|degree/i.test(unit))label='Angle';
  if(/force|push|pull/.test(before)&&/^n$/i.test(unit))label='Force';
  if(/velocity|speed/.test(before)&&/m\/s/i.test(unit))label='Velocity';
  givens.push(label+' = '+value+' '+unit.replace(/degrees?/i,'°'));
 }
 if(/no friction|frictionless/i.test(q))conditions.push('No friction');
 if(/at rest|starts? from rest/i.test(q))conditions.push('Starts from rest');
 for(const word of objectWords)if(new RegExp('\\b'+word+'\\b','i').test(q))objects.push(word[0].toUpperCase()+word.slice(1));
 const findMatch=q.match(/(?:find|calculate|determine|what is)\s+(?:the\s+)?([^?.]+)/i);
 const find=findMatch?[findMatch[1].trim().replace(/\s+of\s+the.*$/i,'')]:[];
 const classification=classify(q);
 const targetText=find.join(' ').toLowerCase();const targetAliases:Record<string,string>={
  acceleration:'a',velocity:'v',speed:'v',displacement:'s',distance:'s',area:'A',circumference:'C',
  momentum:'p','kinetic energy':'KE','potential energy':'PE',molarity:'M','ph':'pH'
 };
 const target=Object.entries(targetAliases).find(([name])=>targetText.includes(name))?.[1];
 const variables=recognizeVariables(q);const available=symbolsAvailable(variables,q);
 const formulaCandidates=formulasFor(classification.problemType,target).map(f=>{
  const missing=f.requires.filter(symbol=>!available.has(symbol));
  const coverage=(f.requires.length-missing.length)/Math.max(1,f.requires.length);
  const requestedTarget=target??f.target;return{id:f.id,formula:f.formula,target:requestedTarget,requires:f.requires,missing,matchScore:Number(((target?0.35:0.15)+coverage*0.65).toFixed(2)),rearrangement:rearrangeFormula(f.formula,requestedTarget)};
 }).sort((a,b)=>b.matchScore-a.matchScore);
 return{originalQuestion:q,givens:[...new Set(givens)],find,conditions:[...new Set(conditions)],objects:[...new Set(objects)],variables,classification,formulaCandidates};
}