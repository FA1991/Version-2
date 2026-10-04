import type{GeometrySolveResult}from'./geometrySolver';
import type{GeometryVerification}from'./geometryVerifier';

export interface GeometrySolutionJSON{
 formula:{original:string;name:string};
 symbols:Record<string,string>;
 find:{symbol:string;meaning:string};
 manipulation:string[];
 substitution:string|null;
 steps:string[];
 exact:string|null;
 answer:{symbol:string;value:number;unit:string|null};
 verified:boolean;
}
const meaning:Record<string,string>={A:'area',P:'perimeter',C:'circumference',V:'volume',r:'radius',d:'diameter',SA:'surface area',LA:'lateral area',L:'arc length',c:'hypotenuse',a:'leg',h:'height',b:'base',l:'length',w:'width',s:'side length'};
const symbolFor:Record<string,string>={area:'A',perimeter:'P',circumference:'C',volume:'V',radius:'r',diameter:'d','surface-area':'SA','lateral-area':'LA','arc-length':'L','sector-area':'A',hypotenuse:'c',leg:'a',height:'h',base:'b',length:'l',width:'w',side:'s'};
export function toSolutionJSON(target:string|null,s:GeometrySolveResult,v:GeometryVerification):GeometrySolutionJSON|null{
 if(!s.success||!s.formula||s.value==null)return null;
 const symbol=symbolFor[target??'']??target??'?';
 const manipulation=s.steps.filter(x=>/full formula|isolate/i.test(x));
 const substitution=s.steps.find(x=>x.startsWith('Substitute:'))?.replace(/^Substitute:\s*/,'').replace(/\.$/,'')??null;
 const symbols:Record<string,string>={};for(const row of s.symbols??[]){const i=row.indexOf(' = ');if(i>0)symbols[row.slice(0,i)]=row.slice(i+3)}
 return{formula:{original:s.formula,name:`${meaning[symbol]??target??'geometry'} formula`},symbols,find:{symbol,meaning:meaning[symbol]??target??'unknown'},manipulation,substitution,steps:s.steps,exact:s.exact??null,answer:{symbol,value:s.value,unit:s.unit},verified:v.valid};
}
