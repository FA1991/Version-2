export interface GeometryQuestionAnalysis{
 originalQuestion:string;
 shape:string|null;
 givens:Record<string,number>;
 units:Record<string,string>;
 target:string|null;
 confidence:number;
 warnings:string[];
}
const number=(s:string)=>Number(s.replace(/,/g,''));
export function analyzeGeometryQuestion(q:string):GeometryQuestionAnalysis{
 const t=q.toLowerCase(),givens:Record<string,number>={},units:Record<string,string>={},warnings:string[]=[];
 const patterns:[string,RegExp,string][]=[
  ['radius',/(?:radius|r)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'r'],
  ['diameter',/(?:diameter|d)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'d'],
  ['length',/(?:length|l)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'l'],
  ['width',/(?:width|w)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'w'],
  ['height',/(?:height|h)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'h'],
  ['base',/(?:base|b)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'b'],
  ['side',/(?:side|s)\s*(?:=|is|of)?\s*([\d.]+)\s*(cm|mm|m|in|ft)?\b/i,'s']
 ];
 for(const [,rx,sym] of patterns){const m=q.match(rx);if(m){givens[sym]=number(m[1]);if(m[2])units[sym]=m[2]}}
 let shape:string|null=null;
 const shapes=['rectangular prism','right triangle','equilateral triangle','isosceles triangle','triangle','rectangle','square','circle','cylinder','cone','sphere','cube','parallelogram','trapezoid','rhombus','kite'];
 for(const s of shapes)if(t.includes(s)){shape=s;break}
 let target:string|null=null;
 if(/surface area/.test(t))target='surface-area';else if(/circumference/.test(t))target='circumference';else if(/perimeter/.test(t))target='perimeter';else if(/volume/.test(t))target='volume';else if(/diameter/.test(t)&&givens.d===undefined)target='diameter';else if(/radius/.test(t)&&givens.r===undefined)target='radius';else if(/\barea\b/.test(t))target='area';else if(/hypotenuse/.test(t))target='hypotenuse';
 if(!shape)warnings.push('Geometry shape was not recognized.');if(!target)warnings.push('Requested measurement was not recognized.');
 return{originalQuestion:q,shape,givens,units,target,confidence:(shape?0.5:0)+(target?0.3:0)+(Object.keys(givens).length?0.2:0),warnings};
}
