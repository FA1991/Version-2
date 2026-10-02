export interface ProblemAnalysis{originalQuestion:string;givens:string[];find:string[];conditions:string[];objects:string[]}

const objectWords=['box','ball','car','block','person','stone','projectile','incline','ramp','circle','triangle','spring','pulley'];

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
 return{originalQuestion:q,givens:[...new Set(givens)],find,conditions:[...new Set(conditions)],objects:[...new Set(objects)]};
}