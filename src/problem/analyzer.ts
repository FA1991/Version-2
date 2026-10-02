export interface Classification{subject:string;topic:string;problemType:string;confidence:number;evidence:string[]}\nexport interface ProblemAnalysis{originalQuestion:string;givens:string[];find:string[];conditions:string[];objects:string[];classification:Classification}

const objectWords=['box','ball','car','block','person','stone','projectile','incline','ramp','circle','triangle','spring','pulley'];

function classify(q:string):Classification{const s=q.toLowerCase();const rules=[['Physics','Forces & Motion','Inclined plane',['incline','ramp','friction']],['Physics','Kinematics','Projectile motion',['projectile','launched','thrown']],['Physics','Kinematics','Free fall',['free fall','dropped','falls']],['Math','Geometry','Triangle',['triangle']],['Math','Geometry','Circle',['circle','radius','diameter']],['Math','Algebra','Equation',['solve for','equation']],['Chemistry','General Chemistry','Chemistry problem',['mole','molar','reaction']],['Biology','Biology','Biology problem',['cell','dna','gene']]] as const;let best:any=null;for(const r of rules){const evidence=r[3].filter(t=>s.includes(t));if(!best||evidence.length>best.evidence.length)if(evidence.length)best={r,evidence};}return best?{subject:best.r[0],topic:best.r[1],problemType:best.r[2],confidence:Math.min(.95,.6+best.evidence.length*.1),evidence:best.evidence}:{subject:'Unknown',topic:'Unknown',problemType:'Unknown',confidence:0,evidence:[]};}\n\nexport function analyzeQuestion(question:string):ProblemAnalysis{
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
 return{originalQuestion:q,givens:[...new Set(givens)],find,conditions:[...new Set(conditions)],objects:[...new Set(objects)],classification:classify(q)};
}