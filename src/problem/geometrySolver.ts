import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
export interface GeometrySolveResult{success:boolean;formula:string|null;value:number|null;unit:string|null;steps:string[];message:string}
const round=(x:number)=>Number(x.toFixed(4));
const u=(a:GeometryQuestionAnalysis,power=1)=>{const base=Object.values(a.units)[0]??'';return base?base+(power===2?'²':power===3?'³':''):null};
export function solveGeometry(a:GeometryQuestionAnalysis):GeometrySolveResult{
 const g=a.givens,s=a.shape,t=a.target;let formula:string|null=null,v:number|null=null,power=1;
 if(s==='circle'&&t==='area'&&g.r!=null){formula='A = πr²';v=Math.PI*g.r*g.r;power=2}
 else if(s==='circle'&&t==='circumference'&&g.r!=null){formula='C = 2πr';v=2*Math.PI*g.r}
 else if(s==='circle'&&t==='diameter'&&g.r!=null){formula='d = 2r';v=2*g.r}
 else if(s==='circle'&&t==='radius'&&g.d!=null){formula='r = d/2';v=g.d/2}
 else if(s==='rectangle'&&t==='area'&&g.l!=null&&g.w!=null){formula='A = lw';v=g.l*g.w;power=2}
 else if(s==='rectangle'&&t==='perimeter'&&g.l!=null&&g.w!=null){formula='P = 2(l+w)';v=2*(g.l+g.w)}
 else if(s==='square'&&t==='area'&&g.s!=null){formula='A = s²';v=g.s*g.s;power=2}
 else if(s==='square'&&t==='perimeter'&&g.s!=null){formula='P = 4s';v=4*g.s}
 else if(s?.includes('triangle')&&t==='area'&&g.b!=null&&g.h!=null){formula='A = ½bh';v=.5*g.b*g.h;power=2}
 else if(s==='cylinder'&&t==='volume'&&g.r!=null&&g.h!=null){formula='V = πr²h';v=Math.PI*g.r*g.r*g.h;power=3}
 else if(s==='sphere'&&t==='volume'&&g.r!=null){formula='V = 4πr³/3';v=4*Math.PI*g.r**3/3;power=3}
 else if(s==='sphere'&&t==='surface-area'&&g.r!=null){formula='SA = 4πr²';v=4*Math.PI*g.r*g.r;power=2}
 else if(s==='cube'&&t==='volume'&&g.s!=null){formula='V = s³';v=g.s**3;power=3}
 else if(s==='rectangular prism'&&t==='volume'&&g.l!=null&&g.w!=null&&g.h!=null){formula='V = lwh';v=g.l*g.w*g.h;power=3}
 if(v==null)return{success:false,formula:null,value:null,unit:null,steps:[],message:'This geometry case is not supported by the deterministic solver yet.'};
 const value=round(v);return{success:true,formula,value,unit:u(a,power),steps:[`Identify the target: ${t}.`,`Use ${formula}.`,'Substitute the given measurements.',`Calculate: ${value}${u(a,power)?' '+u(a,power):''}.`],message:'Solved deterministically.'};
}
