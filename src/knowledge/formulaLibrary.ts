import{GEOMETRY_FORMULAS}from'./geometryFormulaRegistry';
export interface FormulaRule{
 id:string;subject:string;area:string;topic:string;problemTypes:string[];
 target:string;formula:string;requires:string[];optional?:string[];
 conditions?:Record<string,string|number|boolean>;units?:Record<string,string>;
 notes?:string;
}

/**
 * Formula/rule knowledge is data, not solver code.
 * The matcher can search this library by classification, target and available variables.
 * More curriculum formulas are added as records without changing the solver.
 */
export const FORMULA_LIBRARY:FormulaRule[]=[
 ...GEOMETRY_FORMULAS,
 {id:'math.geometry.rectangle.area',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',problemTypes:['Rectangle'],target:'A',formula:'A = l*w',requires:['l','w'],units:{l:'length',w:'length',A:'length^2'}},
 {id:'math.geometry.triangle.area',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',problemTypes:['Triangle measurement','Trig triangle'],target:'A',formula:'A = (1/2)*b*h',requires:['b','h'],units:{b:'length',h:'length',A:'length^2'}},
 {id:'math.geometry.circle.area',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',problemTypes:['Circle measurement'],target:'A',formula:'A = pi*r^2',requires:['r'],units:{r:'length',A:'length^2'}},
 {id:'math.geometry.circle.circumference',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',problemTypes:['Circle measurement'],target:'C',formula:'C = 2*pi*r',requires:['r'],units:{r:'length',C:'length'}},
 {id:'math.algebra.slope',subject:'Mathematics',area:'Algebra',topic:'Linear equations',problemTypes:['Linear equation/system'],target:'m',formula:'m = (y2-y1)/(x2-x1)',requires:['x1','y1','x2','y2']},
 {id:'math.quadratic.formula',subject:'Mathematics',area:'Algebra',topic:'Quadratics',problemTypes:['Quadratic equation'],target:'x',formula:'x = (-b ± sqrt(b^2-4*a*c))/(2*a)',requires:['a','b','c']},
 {id:'math.trig.pythagorean',subject:'Mathematics',area:'Geometry',topic:'Right triangles',problemTypes:['Trig triangle','Triangle measurement'],target:'c',formula:'c^2 = a^2+b^2',requires:['a','b']},

 {id:'physics.kinematics.velocity',subject:'Physics',area:'Mechanics',topic:'Kinematics',problemTypes:['Motion'],target:'v',formula:'v = u+a*t',requires:['u','a','t'],units:{u:'m/s',a:'m/s^2',t:'s',v:'m/s'}},
 {id:'physics.kinematics.displacement',subject:'Physics',area:'Mechanics',topic:'Kinematics',problemTypes:['Motion','Projectile motion'],target:'s',formula:'s = u*t+(1/2)*a*t^2',requires:['u','a','t'],units:{u:'m/s',a:'m/s^2',t:'s',s:'m'}},
 {id:'physics.kinematics.no_time',subject:'Physics',area:'Mechanics',topic:'Kinematics',problemTypes:['Motion'],target:'v',formula:'v^2 = u^2+2*a*s',requires:['u','a','s']},
 {id:'physics.dynamics.newton2',subject:'Physics',area:'Mechanics',topic:'Dynamics',problemTypes:['Newton laws'],target:'a',formula:'F_net = m*a',requires:['F_net','m'],units:{F_net:'N',m:'kg',a:'m/s^2'}},
 {id:'physics.dynamics.incline.acceleration',subject:'Physics',area:'Mechanics',topic:'Dynamics',problemTypes:['Inclined plane'],target:'a',formula:'F - m*g*sin(theta) = m*a',requires:['F','m','theta'],optional:['g'],conditions:{friction:false},units:{F:'N',m:'kg',theta:'rad|deg',g:'m/s^2',a:'m/s^2'}},
 {id:'physics.energy.kinetic',subject:'Physics',area:'Mechanics',topic:'Energy',problemTypes:['Conservation'],target:'KE',formula:'KE = (1/2)*m*v^2',requires:['m','v']},
 {id:'physics.energy.gravitational',subject:'Physics',area:'Mechanics',topic:'Energy',problemTypes:['Conservation'],target:'PE',formula:'PE = m*g*h',requires:['m','h'],optional:['g']},
 {id:'physics.momentum',subject:'Physics',area:'Mechanics',topic:'Momentum',problemTypes:['Conservation'],target:'p',formula:'p = m*v',requires:['m','v']},
 {id:'physics.waves.speed',subject:'Physics',area:'Waves',topic:'Waves & Sound',problemTypes:['Wave'],target:'v',formula:'v = f*lambda',requires:['f','lambda']},
 {id:'physics.circuits.ohm',subject:'Physics',area:'Electricity & Magnetism',topic:'Circuits',problemTypes:['Circuit'],target:'V',formula:'V = I*R',requires:['I','R']},
 {id:'physics.optics.lens',subject:'Physics',area:'Optics',topic:'Geometric Optics',problemTypes:['Optics'],target:'f',formula:'1/f = 1/do + 1/di',requires:['do','di']},

 {id:'chem.stoich.moles',subject:'Chemistry',area:'General Chemistry',topic:'Stoichiometry',problemTypes:['Stoichiometry'],target:'n',formula:'n = m/M',requires:['m','M']},
 {id:'chem.solutions.molarity',subject:'Chemistry',area:'General Chemistry',topic:'Solutions',problemTypes:['Solution concentration'],target:'M',formula:'M = n/V',requires:['n','V']},
 {id:'chem.acidbase.ph',subject:'Chemistry',area:'General Chemistry',topic:'Acids & Bases',problemTypes:['Acid/base'],target:'pH',formula:'pH = -log10(H)',requires:['H']},
 {id:'chem.gas.ideal',subject:'Chemistry',area:'General Chemistry',topic:'Gases',problemTypes:['Gas law'],target:'P',formula:'P*V = n*R*T',requires:['V','n','T'],optional:['R']},

 {id:'bio.population.exponential',subject:'Biology',area:'Population Biology',topic:'Population Growth',problemTypes:['Population biology'],target:'N',formula:'N(t) = N0*e^(r*t)',requires:['N0','r','t']},
 {id:'bio.genetics.hardyweinberg',subject:'Biology',area:'Population Biology',topic:'Population Genetics',problemTypes:['Population biology'],target:'frequency',formula:'p^2+2*p*q+q^2 = 1',requires:['p','q']},

 {id:'math.calculus.derivative.power',subject:'Mathematics',area:'Calculus',topic:'Calculus I',problemTypes:['Differentiation'],target:'derivative',formula:'d/dx(x^n) = n*x^(n-1)',requires:['n']},
 {id:'math.calculus.integral.power',subject:'Mathematics',area:'Calculus',topic:'Calculus II',problemTypes:['Integration/series'],target:'integral',formula:'integral(x^n dx) = x^(n+1)/(n+1)+C',requires:['n'],conditions:{n:'n != -1'}},
 {id:'math.stats.zscore',subject:'Mathematics',area:'Statistics',topic:'Descriptive/Inferential Statistics',problemTypes:['Statistical inference'],target:'z',formula:'z = (x-mu)/sigma',requires:['x','mu','sigma']}
];

export function formulasFor(problemType:string,target?:string){
 return FORMULA_LIBRARY.filter(f=>f.problemTypes.includes(problemType)&&(!target||f.target.toLowerCase()===target.toLowerCase()));
}