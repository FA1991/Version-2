import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';
import{polygonSideCount}from'./geometryQuestionAnalyzer';

export type GeometryGivens=Record<string,number>;
export type UnitPower=0|1|2|3;
export interface GeometryFormulaRule{
 id:string;
 shapes:string[];
 target:string;
 formula:string;
 equation:string|((g:GeometryGivens,a:GeometryQuestionAnalysis)=>string);
 targetSymbol:string|((g:GeometryGivens,a:GeometryQuestionAnalysis)=>string);
 power:UnitPower;
 requires:(g:GeometryGivens,a:GeometryQuestionAnalysis)=>boolean;
 solve:(g:GeometryGivens,a:GeometryQuestionAnalysis)=>number|null;
 exactPiCoefficient?:(g:GeometryGivens,a:GeometryQuestionAnalysis)=>number|null;
}
const has=(g:GeometryGivens,...k:string[])=>k.every(x=>g[x]!=null&&Number.isFinite(g[x]));
const pi=(g:GeometryGivens)=>g.__pi??Math.PI;
const rules:GeometryFormulaRule[]=[
 {id:'regular-polygon-perimeter',shapes:['regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon'],target:'perimeter',formula:'P = ns',equation:'P = n*s',targetSymbol:'P',power:1,requires:(g,a)=>a.regularPolygon&&polygonSideCount(a.shape,g)!=null&&has(g,'s'),solve:(g,a)=>polygonSideCount(a.shape,g)!*g.s},
 {id:'regular-polygon-area',shapes:['regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon'],target:'area',formula:'A = ½aP, P = ns',equation:'A = (1/2)*ap*n*s',targetSymbol:'A',power:2,requires:(g,a)=>a.regularPolygon&&polygonSideCount(a.shape,g)!=null&&has(g,'ap','s'),solve:(g,a)=>.5*g.ap*polygonSideCount(a.shape,g)!*g.s},
 {id:'polygon-interior-sum',shapes:['regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon'],target:'interior-angle-sum',formula:'S = (n−2)180°',equation:'S = (n-2)*180',targetSymbol:'S',power:0,requires:(g,a)=>(polygonSideCount(a.shape,g)??0)>=3,solve:(g,a)=>(polygonSideCount(a.shape,g)!-2)*180},
 {id:'polygon-interior-angle',shapes:['regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon'],target:'interior-angle',formula:'θ = (n−2)180°/n',equation:'theta = (n-2)*180/n',targetSymbol:'theta',power:0,requires:(g,a)=>a.regularPolygon&&(polygonSideCount(a.shape,g)??0)>=3,solve:(g,a)=>(polygonSideCount(a.shape,g)!-2)*180/polygonSideCount(a.shape,g)!},
 {id:'polygon-exterior-angle',shapes:['regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon'],target:'exterior-angle',formula:'θ = 360°/n',equation:'theta = 360/n',targetSymbol:'theta',power:0,requires:(g,a)=>a.regularPolygon&&(polygonSideCount(a.shape,g)??0)>=3,solve:(g,a)=>360/polygonSideCount(a.shape,g)!},

 {id:'circle-area-r',shapes:['circle'],target:'area',formula:'A = πr²',equation:'A = pi*r^2',targetSymbol:'A',power:2,requires:g=>has(g,'r'),solve:g=>pi(g)*g.r*g.r,exactPiCoefficient:g=>g.r*g.r},
 {id:'circle-area-d',shapes:['circle'],target:'area',formula:'A = πr², r = d/2',equation:'A = pi*(d/2)^2',targetSymbol:'A',power:2,requires:g=>has(g,'d'),solve:g=>pi(g)*(g.d/2)**2,exactPiCoefficient:g=>(g.d/2)**2},
 {id:'circle-radius-area',shapes:['circle'],target:'radius',formula:'A = πr²',equation:'r = sqrt(A/pi)',targetSymbol:'r',power:1,requires:g=>has(g,'A'),solve:g=>Math.sqrt(g.A/pi(g))},
 {id:'circle-circumference-r',shapes:['circle'],target:'circumference',formula:'C = 2πr',equation:'C = 2*pi*r',targetSymbol:'C',power:1,requires:g=>has(g,'r'),solve:g=>2*pi(g)*g.r,exactPiCoefficient:g=>2*g.r},
 {id:'circle-circumference-d',shapes:['circle'],target:'circumference',formula:'C = πd',equation:'C = pi*d',targetSymbol:'C',power:1,requires:g=>has(g,'d'),solve:g=>pi(g)*g.d,exactPiCoefficient:g=>g.d},
 {id:'circle-radius-circumference',shapes:['circle'],target:'radius',formula:'C = 2πr',equation:'r = C/(2*pi)',targetSymbol:'r',power:1,requires:g=>has(g,'C'),solve:g=>g.C/(2*pi(g))},
 {id:'circle-diameter-radius',shapes:['circle'],target:'diameter',formula:'d = 2r',equation:'d = 2*r',targetSymbol:'d',power:1,requires:g=>has(g,'r'),solve:g=>2*g.r},
 {id:'circle-radius-diameter',shapes:['circle'],target:'radius',formula:'d = 2r',equation:'r = d/2',targetSymbol:'r',power:1,requires:g=>has(g,'d'),solve:g=>g.d/2},
 {id:'circle-arc-length',shapes:['circle'],target:'arc-length',formula:'L = (θ/360°)2πr',equation:'L = (theta/360)*2*pi*r',targetSymbol:'L',power:1,requires:g=>has(g,'theta','r'),solve:g=>g.theta/360*2*pi(g)*g.r,exactPiCoefficient:g=>g.theta/360*2*g.r},
 {id:'circle-sector-area',shapes:['circle'],target:'sector-area',formula:'A = (θ/360°)πr²',equation:'A = (theta/360)*pi*r^2',targetSymbol:'A',power:2,requires:g=>has(g,'theta','r'),solve:g=>g.theta/360*pi(g)*g.r*g.r,exactPiCoefficient:g=>g.theta/360*g.r*g.r},

 {id:'semicircle-area',shapes:['semicircle'],target:'area',formula:'A = ½πr²',equation:'A = (1/2)*pi*r^2',targetSymbol:'A',power:2,requires:g=>has(g,'r')||has(g,'d'),solve:g=>{const r=g.r??g.d/2;return .5*pi(g)*r*r},exactPiCoefficient:g=>{const r=g.r??g.d/2;return .5*r*r}},
 {id:'semicircle-radius-area',shapes:['semicircle'],target:'radius',formula:'A = ½πr²',equation:'r = sqrt(2*A/pi)',targetSymbol:'r',power:1,requires:g=>has(g,'A'),solve:g=>Math.sqrt(2*g.A/pi(g))},
 {id:'semicircle-perimeter',shapes:['semicircle'],target:'perimeter',formula:'P = πr + 2r',equation:'P = pi*r+2*r',targetSymbol:'P',power:1,requires:g=>has(g,'r')||has(g,'d'),solve:g=>{const r=g.r??g.d/2;return pi(g)*r+2*r}},

 {id:'rectangle-area',shapes:['rectangle'],target:'area',formula:'A = lw',equation:'A = l*w',targetSymbol:'A',power:2,requires:g=>has(g,'l','w'),solve:g=>g.l*g.w},
 {id:'rectangle-length-area',shapes:['rectangle'],target:'length',formula:'A = lw',equation:'l = A/w',targetSymbol:'l',power:1,requires:g=>has(g,'A','w'),solve:g=>g.A/g.w},
 {id:'rectangle-width-area',shapes:['rectangle'],target:'width',formula:'A = lw',equation:'w = A/l',targetSymbol:'w',power:1,requires:g=>has(g,'A','l'),solve:g=>g.A/g.l},
 {id:'rectangle-perimeter',shapes:['rectangle'],target:'perimeter',formula:'P = 2(l+w)',equation:'P = 2*(l+w)',targetSymbol:'P',power:1,requires:g=>has(g,'l','w'),solve:g=>2*(g.l+g.w)},
 {id:'rectangle-length-perimeter',shapes:['rectangle'],target:'length',formula:'P = 2(l+w)',equation:'l = P/2-w',targetSymbol:'l',power:1,requires:g=>has(g,'P','w'),solve:g=>g.P/2-g.w},
 {id:'rectangle-width-perimeter',shapes:['rectangle'],target:'width',formula:'P = 2(l+w)',equation:'w = P/2-l',targetSymbol:'w',power:1,requires:g=>has(g,'P','l'),solve:g=>g.P/2-g.l},
 {id:'rectangle-diagonal',shapes:['rectangle'],target:'diagonal',formula:'d = √(l²+w²)',equation:'d = sqrt(l^2+w^2)',targetSymbol:'d',power:1,requires:g=>has(g,'l','w'),solve:g=>Math.hypot(g.l,g.w)},

 {id:'square-area',shapes:['square'],target:'area',formula:'A = s²',equation:'A = s^2',targetSymbol:'A',power:2,requires:g=>has(g,'s'),solve:g=>g.s**2},
 {id:'square-side-area',shapes:['square'],target:'side',formula:'A = s²',equation:'s = sqrt(A)',targetSymbol:'s',power:1,requires:g=>has(g,'A'),solve:g=>Math.sqrt(g.A)},
 {id:'square-perimeter',shapes:['square'],target:'perimeter',formula:'P = 4s',equation:'P = 4*s',targetSymbol:'P',power:1,requires:g=>has(g,'s'),solve:g=>4*g.s},
 {id:'square-side-perimeter',shapes:['square'],target:'side',formula:'P = 4s',equation:'s = P/4',targetSymbol:'s',power:1,requires:g=>has(g,'P'),solve:g=>g.P/4},
 {id:'square-diagonal',shapes:['square'],target:'diagonal',formula:'d = s√2',equation:'d = s*sqrt(2)',targetSymbol:'d',power:1,requires:g=>has(g,'s'),solve:g=>g.s*Math.sqrt(2)},
 {id:'square-perimeter-area',shapes:['square'],target:'perimeter',formula:'A = s², P = 4s',equation:'P = 4*sqrt(A)',targetSymbol:'P',power:1,requires:g=>has(g,'A'),solve:g=>4*Math.sqrt(g.A)},

 {id:'parallelogram-area',shapes:['parallelogram'],target:'area',formula:'A = bh',equation:'A = b*h',targetSymbol:'A',power:2,requires:g=>has(g,'b','h'),solve:g=>g.b*g.h},
 {id:'parallelogram-base',shapes:['parallelogram'],target:'base',formula:'A = bh',equation:'b = A/h',targetSymbol:'b',power:1,requires:g=>has(g,'A','h'),solve:g=>g.A/g.h},
 {id:'parallelogram-height',shapes:['parallelogram'],target:'height',formula:'A = bh',equation:'h = A/b',targetSymbol:'h',power:1,requires:g=>has(g,'A','b'),solve:g=>g.A/g.b},

 {id:'rhombus-kite-area',shapes:['rhombus','kite'],target:'area',formula:'A = ½d₁d₂',equation:'A = (1/2)*d1*d2',targetSymbol:'A',power:2,requires:g=>has(g,'d1','d2'),solve:g=>.5*g.d1*g.d2},
 {id:'rhombus-kite-diagonal',shapes:['rhombus','kite'],target:'diagonal',formula:'A = ½d₁d₂',equation:g=>g.d1!=null?'d2 = 2*A/d1':'d1 = 2*A/d2',targetSymbol:g=>g.d1!=null?'d2':'d1',power:1,requires:g=>has(g,'A')&&(has(g,'d1')||has(g,'d2')),solve:g=>2*g.A/(g.d1??g.d2)},
 {id:'rhombus-perimeter',shapes:['rhombus'],target:'perimeter',formula:'P = 4s',equation:'P = 4*s',targetSymbol:'P',power:1,requires:g=>has(g,'s'),solve:g=>4*g.s},
 {id:'rhombus-side',shapes:['rhombus'],target:'side',formula:'P = 4s',equation:'s = P/4',targetSymbol:'s',power:1,requires:g=>has(g,'P'),solve:g=>g.P/4},

 {id:'trapezoid-area-bases',shapes:['trapezoid'],target:'area',formula:'A = ½(a+b)h',equation:'A = (1/2)*(a+b)*h',targetSymbol:'A',power:2,requires:g=>has(g,'a','b','h'),solve:g=>.5*(g.a+g.b)*g.h},
 {id:'trapezoid-height-bases',shapes:['trapezoid'],target:'height',formula:'A = ½(a+b)h',equation:'h = 2*A/(a+b)',targetSymbol:'h',power:1,requires:g=>has(g,'A','a','b'),solve:g=>2*g.A/(g.a+g.b)},
 {id:'trapezoid-missing-base',shapes:['trapezoid'],target:'base',formula:'A = ½(a+b)h',equation:g=>g.a!=null?'b = 2*A/h-a':'a = 2*A/h-b',targetSymbol:g=>g.a!=null?'b':'a',power:1,requires:g=>has(g,'A','h')&&(has(g,'a')||has(g,'b')),solve:g=>2*g.A/g.h-(g.a??g.b)},
 {id:'trapezoid-area-midsegment',shapes:['trapezoid'],target:'area',formula:'A = mh',equation:'A = m*h',targetSymbol:'A',power:2,requires:g=>has(g,'m','h'),solve:g=>g.m*g.h},
 {id:'trapezoid-height-midsegment',shapes:['trapezoid'],target:'height',formula:'A = mh',equation:'h = A/m',targetSymbol:'h',power:1,requires:g=>has(g,'A','m'),solve:g=>g.A/g.m},

 {id:'triangle-area',shapes:['triangle','right triangle','isosceles triangle','equilateral triangle'],target:'area',formula:'A = ½bh',equation:'A = (1/2)*b*h',targetSymbol:'A',power:2,requires:g=>has(g,'b','h'),solve:g=>.5*g.b*g.h},
 {id:'triangle-base',shapes:['triangle','right triangle','isosceles triangle'],target:'base',formula:'A = ½bh',equation:'b = 2*A/h',targetSymbol:'b',power:1,requires:g=>has(g,'A','h'),solve:g=>2*g.A/g.h},
 {id:'triangle-height',shapes:['triangle','right triangle','isosceles triangle'],target:'height',formula:'A = ½bh',equation:'h = 2*A/b',targetSymbol:'h',power:1,requires:g=>has(g,'A','b'),solve:g=>2*g.A/g.b},
 {id:'triangle-perimeter',shapes:['triangle','right triangle','isosceles triangle'],target:'perimeter',formula:'P = a+b+c',equation:'P = a+b+c',targetSymbol:'P',power:1,requires:g=>has(g,'a','b','c'),solve:g=>g.a+g.b+g.c},
 {id:'triangle-missing-angle',shapes:['triangle','right triangle','isosceles triangle'],target:'missing-angle',formula:'A + B + C = 180°',equation:'C = 180-angle1-angle2',targetSymbol:'C',power:0,requires:g=>has(g,'angle1','angle2'),solve:g=>180-g.angle1-g.angle2},
 {id:'equilateral-area',shapes:['equilateral triangle'],target:'area',formula:'A = (√3/4)s²',equation:'A = (sqrt(3)/4)*s^2',targetSymbol:'A',power:2,requires:g=>has(g,'s'),solve:g=>Math.sqrt(3)*g.s**2/4},
 {id:'equilateral-side-area',shapes:['equilateral triangle'],target:'side',formula:'A = (√3/4)s²',equation:'s = sqrt(4*A/sqrt(3))',targetSymbol:'s',power:1,requires:g=>has(g,'A'),solve:g=>Math.sqrt(4*g.A/Math.sqrt(3))},
 {id:'equilateral-perimeter',shapes:['equilateral triangle'],target:'perimeter',formula:'P = 3s',equation:'P = 3*s',targetSymbol:'P',power:1,requires:g=>has(g,'s'),solve:g=>3*g.s},
 {id:'equilateral-side-perimeter',shapes:['equilateral triangle'],target:'side',formula:'P = 3s',equation:'s = P/3',targetSymbol:'s',power:1,requires:g=>has(g,'P'),solve:g=>g.P/3},
 {id:'right-hypotenuse',shapes:['right triangle'],target:'hypotenuse',formula:'c² = a²+b²',equation:'c = sqrt(a^2+b^2)',targetSymbol:'c',power:1,requires:g=>has(g,'a','b'),solve:g=>Math.hypot(g.a,g.b)},
 {id:'right-leg',shapes:['right triangle'],target:'leg',formula:'c² = a²+b²',equation:g=>g.a!=null?'b = sqrt(c^2-a^2)':'a = sqrt(c^2-b^2)',targetSymbol:g=>g.a!=null?'b':'a',power:1,requires:g=>has(g,'c')&&(has(g,'a')||has(g,'b')),solve:g=>{const k=g.a??g.b;return g.c>k?Math.sqrt(g.c*g.c-k*k):null}},
 {id:'triangle-30-60-90-short-leg',shapes:['triangle','right triangle'],target:'shortest-side',formula:'short leg = hypotenuse ÷ 2',equation:'a = c/2',targetSymbol:'a',power:1,requires:(g,a)=>/30\s*[-–]\s*60\s*[-–]\s*90/.test(a.originalQuestion)&&has(g,'c'),solve:g=>g.c/2},

 {id:'cube-volume',shapes:['cube'],target:'volume',formula:'V = s³',equation:'V = s^3',targetSymbol:'V',power:3,requires:g=>has(g,'s'),solve:g=>g.s**3},
 {id:'cube-side-volume',shapes:['cube'],target:'side',formula:'V = s³',equation:'s = cbrt(V)',targetSymbol:'s',power:1,requires:g=>has(g,'V'),solve:g=>Math.cbrt(g.V)},
 {id:'cube-surface-area',shapes:['cube'],target:'surface-area',formula:'SA = 6s²',equation:'SA = 6*s^2',targetSymbol:'SA',power:2,requires:g=>has(g,'s'),solve:g=>6*g.s**2},
 {id:'cube-side-surface-area',shapes:['cube'],target:'side',formula:'SA = 6s²',equation:'s = sqrt(SA/6)',targetSymbol:'s',power:1,requires:g=>has(g,'SA'),solve:g=>Math.sqrt(g.SA/6)},

 {id:'rect-prism-volume',shapes:['rectangular prism'],target:'volume',formula:'V = lwh',equation:'V = l*w*h',targetSymbol:'V',power:3,requires:g=>has(g,'l','w','h'),solve:g=>g.l*g.w*g.h},
 {id:'rect-prism-length-volume',shapes:['rectangular prism'],target:'length',formula:'V = lwh',equation:'l = V/(w*h)',targetSymbol:'l',power:1,requires:g=>has(g,'V','w','h'),solve:g=>g.V/(g.w*g.h)},
 {id:'rect-prism-width-volume',shapes:['rectangular prism'],target:'width',formula:'V = lwh',equation:'w = V/(l*h)',targetSymbol:'w',power:1,requires:g=>has(g,'V','l','h'),solve:g=>g.V/(g.l*g.h)},
 {id:'rect-prism-height-volume',shapes:['rectangular prism'],target:'height',formula:'V = lwh',equation:'h = V/(l*w)',targetSymbol:'h',power:1,requires:g=>has(g,'V','l','w'),solve:g=>g.V/(g.l*g.w)},
 {id:'rect-prism-surface-area',shapes:['rectangular prism'],target:'surface-area',formula:'SA = 2(lw+lh+wh)',equation:'SA = 2*(l*w+l*h+w*h)',targetSymbol:'SA',power:2,requires:g=>has(g,'l','w','h'),solve:g=>2*(g.l*g.w+g.l*g.h+g.w*g.h)},
 {id:'rect-prism-length-sa',shapes:['rectangular prism'],target:'length',formula:'SA = 2(lw+lh+wh)',equation:'l = (SA/2-w*h)/(w+h)',targetSymbol:'l',power:1,requires:g=>has(g,'SA','w','h'),solve:g=>(g.SA/2-g.w*g.h)/(g.w+g.h)},
 {id:'rect-prism-width-sa',shapes:['rectangular prism'],target:'width',formula:'SA = 2(lw+lh+wh)',equation:'w = (SA/2-l*h)/(l+h)',targetSymbol:'w',power:1,requires:g=>has(g,'SA','l','h'),solve:g=>(g.SA/2-g.l*g.h)/(g.l+g.h)},
 {id:'rect-prism-height-sa',shapes:['rectangular prism'],target:'height',formula:'SA = 2(lw+lh+wh)',equation:'h = (SA/2-l*w)/(l+w)',targetSymbol:'h',power:1,requires:g=>has(g,'SA','l','w'),solve:g=>(g.SA/2-g.l*g.w)/(g.l+g.w)},

 {id:'tri-prism-volume',shapes:['triangular prism'],target:'volume',formula:'V = (½bh)L',equation:'V = (1/2)*b*h*l',targetSymbol:'V',power:3,requires:g=>has(g,'b','h','l'),solve:g=>.5*g.b*g.h*g.l},
 {id:'tri-prism-surface-area',shapes:['triangular prism'],target:'surface-area',formula:'SA = 2B+PL, B = ½bh',equation:'SA = b*h+P*l',targetSymbol:'SA',power:2,requires:g=>has(g,'b','h','l','P'),solve:g=>g.b*g.h+g.P*g.l},

 {id:'pyramid-volume',shapes:['pyramid'],target:'volume',formula:'V = ⅓Bh',equation:'V = (1/3)*B*h',targetSymbol:'V',power:3,requires:g=>has(g,'B','h'),solve:g=>g.B*g.h/3},
 {id:'pyramid-height',shapes:['pyramid'],target:'height',formula:'V = ⅓Bh',equation:'h = 3*V/B',targetSymbol:'h',power:1,requires:g=>has(g,'V','B'),solve:g=>3*g.V/g.B},
 {id:'pyramid-base-area',shapes:['pyramid'],target:'base',formula:'V = ⅓Bh',equation:'B = 3*V/h',targetSymbol:'B',power:2,requires:g=>has(g,'V','h'),solve:g=>3*g.V/g.h},

 {id:'cylinder-volume',shapes:['cylinder'],target:'volume',formula:'V = πr²h',equation:'V = pi*r^2*h',targetSymbol:'V',power:3,requires:g=>(has(g,'r')||has(g,'d'))&&has(g,'h'),solve:g=>{const r=g.r??g.d/2;return pi(g)*r*r*g.h},exactPiCoefficient:g=>{const r=g.r??g.d/2;return r*r*g.h}},
 {id:'cylinder-radius-volume',shapes:['cylinder'],target:'radius',formula:'V = πr²h',equation:'r = sqrt(V/(pi*h))',targetSymbol:'r',power:1,requires:g=>has(g,'V','h'),solve:g=>Math.sqrt(g.V/(pi(g)*g.h))},
 {id:'cylinder-height-volume',shapes:['cylinder'],target:'height',formula:'V = πr²h',equation:'h = V/(pi*r^2)',targetSymbol:'h',power:1,requires:g=>has(g,'V','r'),solve:g=>g.V/(pi(g)*g.r*g.r)},
 {id:'cylinder-lateral-area',shapes:['cylinder'],target:'lateral-area',formula:'LA = 2πrh',equation:'LA = 2*pi*r*h',targetSymbol:'LA',power:2,requires:g=>has(g,'r','h'),solve:g=>2*pi(g)*g.r*g.h},
 {id:'cylinder-radius-la',shapes:['cylinder'],target:'radius',formula:'LA = 2πrh',equation:'r = LA/(2*pi*h)',targetSymbol:'r',power:1,requires:g=>has(g,'LA','h'),solve:g=>g.LA/(2*pi(g)*g.h)},
 {id:'cylinder-height-la',shapes:['cylinder'],target:'height',formula:'LA = 2πrh',equation:'h = LA/(2*pi*r)',targetSymbol:'h',power:1,requires:g=>has(g,'LA','r'),solve:g=>g.LA/(2*pi(g)*g.r)},
 {id:'cylinder-surface-area',shapes:['cylinder'],target:'surface-area',formula:'SA = 2πr(r+h)',equation:'SA = 2*pi*r*(r+h)',targetSymbol:'SA',power:2,requires:g=>has(g,'r','h'),solve:g=>2*pi(g)*g.r*(g.r+g.h)},
 {id:'cylinder-height-sa',shapes:['cylinder'],target:'height',formula:'SA = 2πr(r+h)',equation:'h = SA/(2*pi*r)-r',targetSymbol:'h',power:1,requires:g=>has(g,'SA','r'),solve:g=>g.SA/(2*pi(g)*g.r)-g.r},

 {id:'cone-volume',shapes:['cone'],target:'volume',formula:'V = ⅓πr²h',equation:'V = (1/3)*pi*r^2*h',targetSymbol:'V',power:3,requires:g=>has(g,'r','h'),solve:g=>pi(g)*g.r*g.r*g.h/3},
 {id:'cone-radius-volume',shapes:['cone'],target:'radius',formula:'V = ⅓πr²h',equation:'r = sqrt(3*V/(pi*h))',targetSymbol:'r',power:1,requires:g=>has(g,'V','h'),solve:g=>Math.sqrt(3*g.V/(pi(g)*g.h))},
 {id:'cone-height-volume',shapes:['cone'],target:'height',formula:'V = ⅓πr²h',equation:'h = 3*V/(pi*r^2)',targetSymbol:'h',power:1,requires:g=>has(g,'V','r'),solve:g=>3*g.V/(pi(g)*g.r*g.r)},
 {id:'cone-lateral-area',shapes:['cone'],target:'lateral-area',formula:'LA = πrℓ',equation:'LA = pi*r*sl',targetSymbol:'LA',power:2,requires:g=>has(g,'r')&&(has(g,'sl')||has(g,'h')),solve:g=>pi(g)*g.r*(g.sl??Math.hypot(g.r,g.h))},
 {id:'cone-slant-la',shapes:['cone'],target:'slant-height',formula:'LA = πrℓ',equation:'sl = LA/(pi*r)',targetSymbol:'sl',power:1,requires:g=>has(g,'LA','r'),solve:g=>g.LA/(pi(g)*g.r)},
 {id:'cone-surface-area',shapes:['cone'],target:'surface-area',formula:'SA = πr(r+ℓ)',equation:'SA = pi*r*(r+sl)',targetSymbol:'SA',power:2,requires:g=>has(g,'r')&&(has(g,'sl')||has(g,'h')),solve:g=>{const sl=g.sl??Math.hypot(g.r,g.h);return pi(g)*g.r*(g.r+sl)}},
 {id:'cone-slant-sa',shapes:['cone'],target:'slant-height',formula:'SA = πr(r+ℓ)',equation:'sl = SA/(pi*r)-r',targetSymbol:'sl',power:1,requires:g=>has(g,'SA','r'),solve:g=>g.SA/(pi(g)*g.r)-g.r},

 {id:'sphere-volume',shapes:['sphere'],target:'volume',formula:'V = 4πr³/3',equation:'V = 4*pi*r^3/3',targetSymbol:'V',power:3,requires:g=>has(g,'r'),solve:g=>4*pi(g)*g.r**3/3},
 {id:'sphere-radius-volume',shapes:['sphere'],target:'radius',formula:'V = 4πr³/3',equation:'r = cbrt(3*V/(4*pi))',targetSymbol:'r',power:1,requires:g=>has(g,'V'),solve:g=>Math.cbrt(3*g.V/(4*pi(g)))},
 {id:'sphere-surface-area',shapes:['sphere'],target:'surface-area',formula:'SA = 4πr²',equation:'SA = 4*pi*r^2',targetSymbol:'SA',power:2,requires:g=>has(g,'r'),solve:g=>4*pi(g)*g.r*g.r},
 {id:'sphere-radius-sa',shapes:['sphere'],target:'radius',formula:'SA = 4πr²',equation:'r = sqrt(SA/(4*pi))',targetSymbol:'r',power:1,requires:g=>has(g,'SA')||has(g,'A'),solve:g=>Math.sqrt((g.SA??g.A)/(4*pi(g)))},

 {id:'rectilinear-perimeter',shapes:['rectilinear figure'],target:'perimeter',formula:'P = sum of all outside side lengths',equation:'P = sum(sides)',targetSymbol:'P',power:1,requires:g=>Object.keys(g).filter(k=>/^side\d+$/.test(k)).length>=3,solve:g=>Object.entries(g).filter(([k])=>/^side\d+$/.test(k)).reduce((s,[,v])=>s+v,0)}
];

export const geometryFormulaRegistry=rules;
export function findGeometryFormula(a:GeometryQuestionAnalysis):GeometryFormulaRule|null{
 if(!a.shape||!a.target)return null;
 return rules.find(r=>r.shapes.includes(a.shape!)&&r.target===a.target&&r.requires(a.givens,a))??null;
}
export function ruleEquation(rule:GeometryFormulaRule,a:GeometryQuestionAnalysis){return typeof rule.equation==='function'?rule.equation(a.givens,a):rule.equation}
export function ruleTargetSymbol(rule:GeometryFormulaRule,a:GeometryQuestionAnalysis){return typeof rule.targetSymbol==='function'?rule.targetSymbol(a.givens,a):rule.targetSymbol}
