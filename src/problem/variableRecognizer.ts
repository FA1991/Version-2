export interface RecognizedVariable{name:string;symbol:string;value:number;unit:string;source:string;confidence:number}

const UNIT_MAP:Record<string,{name:string;symbol:string}[]>={
 kg:[{name:'Mass',symbol:'m'}],
 N:[{name:'Force',symbol:'F'}],
 'm/s':[{name:'Velocity',symbol:'v'}],
 'm/s²':[{name:'Acceleration',symbol:'a'}],
 'm/s^2':[{name:'Acceleration',symbol:'a'}],
 s:[{name:'Time',symbol:'t'}],
 '°':[{name:'Angle',symbol:'theta'}],
 degrees:[{name:'Angle',symbol:'theta'}],
 degree:[{name:'Angle',symbol:'theta'}],
 J:[{name:'Energy',symbol:'E'}],
 W:[{name:'Power',symbol:'P'}],
 Pa:[{name:'Pressure',symbol:'P'}]
};

const CONTEXT_RULES=[
 {words:['mass','weighs','weigh','kilogram'],name:'Mass',symbol:'m'},
 {words:['force','push','pushed','pull','pulled'],name:'Force',symbol:'F'},
 {words:['angle','incline','inclined','ramp'],name:'Angle',symbol:'theta'},
 {words:['initial velocity','initial speed'],name:'Initial velocity',symbol:'u'},
 {words:['final velocity','final speed'],name:'Final velocity',symbol:'v'},
 {words:['velocity','speed'],name:'Velocity',symbol:'v'},
 {words:['acceleration'],name:'Acceleration',symbol:'a'},
 {words:['time','seconds'],name:'Time',symbol:'t'},
 {words:['height'],name:'Height',symbol:'h'},
 {words:['distance','displacement'],name:'Displacement',symbol:'s'},
 {words:['radius'],name:'Radius',symbol:'r'},
 {words:['diameter'],name:'Diameter',symbol:'d'},
 {words:['length'],name:'Length',symbol:'l'},
 {words:['width'],name:'Width',symbol:'w'}
];

export function recognizeVariables(question:string):RecognizedVariable[]{
 const out:RecognizedVariable[]=[];
 const rx=/(-?\d+(?:\.\d+)?)\s*(kg|m\/s²|m\/s\^2|m\/s|cm|mm|km|m|N|J|W|Pa|s|°|degrees?|g)\b?/gi;
 for(const match of question.matchAll(rx)){
  const value=Number(match[1]),rawUnit=match[2],unit=rawUnit.toLowerCase()==='degrees'||rawUnit.toLowerCase()==='degree'?'°':rawUnit;
  const i=match.index??0,context=question.slice(Math.max(0,i-55),Math.min(question.length,i+match[0].length+20)).toLowerCase();
  let picked=CONTEXT_RULES.find(r=>r.words.some(w=>context.includes(w)));
  if(!picked){const unitOptions=UNIT_MAP[unit]??UNIT_MAP[rawUnit];if(unitOptions?.length===1)picked=unitOptions[0] as any;}
  if(picked)out.push({name:picked.name,symbol:picked.symbol,value,unit,source:match[0],confidence:.9});
 }
 return out.filter((v,i,a)=>a.findIndex(x=>x.symbol===v.symbol&&x.value===v.value&&x.unit===v.unit)===i);
}

export function symbolsAvailable(vars:RecognizedVariable[],question:string){
 const set=new Set(vars.map(v=>v.symbol));
 if(/no friction|frictionless/i.test(question))set.add('friction=false');
 if(/gravity|fall|projectile|incline|ramp/i.test(question))set.add('g');
 return set;
}