export interface GeometryQuestionAnalysis{originalQuestion:string;shape:string|null;givens:Record<string,number>;units:Record<string,string>;target:string|null;confidence:number;warnings:string[]}
const num=(s:string)=>Number(s.replace(/,/g,''));const U='(?:mm|cm|km|m|in|ft|yd)';
const capture=(q:string,names:string[])=>{for(const name of names){const rx=new RegExp('(?:'+name+')\\s*(?:=|is|of|measures?|has)?\\s*([\\d,.]+)\\s*('+U+')?\\b','i'),m=q.match(rx);if(m)return{value:num(m[1]),unit:m[2]??''}}return null};
export function analyzeGeometryQuestion(q:string):GeometryQuestionAnalysis{
 const t=q.toLowerCase(),g:Record<string,number>={},units:Record<string,string>={},warnings:string[]=[];
 const fields:[string,string[]][]=[['r',['radius','r']],['d',['diameter','d']],['l',['length','l']],['w',['width','w']],['h',['height','altitude','h']],['b',['base','b']],['s',['side length','side','s']],['a',['side a','leg a']],['c',['side c','leg c']],['sl',['slant height']]];
 for(const[sym,names]of fields){const x=capture(q,names);if(x){g[sym]=x.value;if(x.unit)units[sym]=x.unit}}
 const pair=new RegExp('(?:legs?|sides?)\\s*(?:are|=)?\\s*([\\d.]+)\\s*('+U+')?\\s*(?:and|,)\\s*([\\d.]+)\\s*('+U+')?','i').exec(q);if(pair){g.a=num(pair[1]);g.b=num(pair[3]);if(pair[2])units.a=pair[2];if(pair[4])units.b=pair[4]}
 let shape:string|null=null;for(const s of ['rectangular prism','triangular prism','right triangle','equilateral triangle','isosceles triangle','parallelogram','trapezoid','rhombus','rectangle','square','triangle','circle','cylinder','cone','sphere','cube','semicircle'])if(t.includes(s)){shape=s;break}
 let target:string|null=null;if(/lateral (?:surface )?area/.test(t))target='lateral-area';else if(/surface area/.test(t))target='surface-area';else if(/circumference/.test(t))target='circumference';else if(/perimeter/.test(t))target='perimeter';else if(/volume/.test(t))target='volume';else if(/hypotenuse/.test(t))target='hypotenuse';else if(/diameter/.test(t)&&g.d===undefined)target='diameter';else if(/radius/.test(t)&&g.r===undefined)target='radius';else if(/\barea\b/.test(t))target='area';
 if(!shape)warnings.push('Geometry shape was not recognized.');if(!target)warnings.push('Requested measurement was not recognized.');
 const seenUnits=[...new Set(Object.values(units).filter(Boolean))];if(seenUnits.length>1)warnings.push('Mixed measurement units must be converted before solving.');
 return{originalQuestion:q,shape,givens:g,units,target,confidence:(shape?0.45:0)+(target?0.3:0)+(Object.keys(g).length?0.25:0),warnings};
}