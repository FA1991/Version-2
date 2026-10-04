export interface RearrangementResult{original:string;target:string;rearranged:string|null;method:'direct'|'algebraic-template'|'solver-required';explanation:string}

/**
 * Safe deterministic rearrangement layer.
 * Common STEM equation families are rearranged locally.
 * Complex/nonlinear equations are marked for the symbolic solver (SymPy backend)
 * rather than guessed.
 */
const templates:Record<string,Record<string,string>>={
 'F_net = m*a':{F_net:'F_net = m*a',m:'m = F_net/a',a:'a = F_net/m'},
 'V = I*R':{V:'V = I*R',I:'I = V/R',R:'R = V/I'},
 'p = m*v':{p:'p = m*v',m:'m = p/v',v:'v = p/m'},
 'v = f*lambda':{v:'v = f*lambda',f:'f = v/lambda',lambda:'lambda = v/f'},
 'M = n/V':{M:'M = n/V',n:'n = M*V',V:'V = n/M'},
 'n = m/M':{n:'n = m/M',m:'m = n*M',M:'M = m/n'},
 'A = l*w':{A:'A = l*w',l:'l = A/w',w:'w = A/l'},
 'A = pi*r^2':{A:'A = pi*r^2',r:'r = sqrt(A/pi)'},
 'C = 2*pi*r':{C:'C = 2*pi*r',r:'r = C/(2*pi)'},
 'V = pi*r^2*h':{V:'V = pi*r^2*h',r:'r = sqrt(V/(pi*h))',h:'h = V/(pi*r^2)'},
 'V = l*w*h':{V:'V = l*w*h',l:'l = V/(w*h)',w:'w = V/(l*h)',h:'h = V/(l*w)'},
 'V = s^3':{V:'V = s^3',s:'s = cbrt(V)'},
 'A = (1/2)*b*h':{A:'A = (1/2)*b*h',b:'b = 2*A/h',h:'h = 2*A/b'},
 'KE = (1/2)*m*v^2':{KE:'KE = (1/2)*m*v^2',m:'m = 2*KE/v^2',v:'v = sqrt(2*KE/m)'},
 'PE = m*g*h':{PE:'PE = m*g*h',m:'m = PE/(g*h)',g:'g = PE/(m*h)',h:'h = PE/(m*g)'},
 'P*V = n*R*T':{P:'P = n*R*T/V',V:'V = n*R*T/P',n:'n = P*V/(R*T)',T:'T = P*V/(n*R)'}
};

export function rearrangeFormula(formula:string,target:string):RearrangementResult{
 const known=templates[formula]?.[target];
 if(known)return{original:formula,target,rearranged:known,method:known===formula?'direct':'algebraic-template',explanation:known===formula?'The formula already isolates the requested variable.':`Rearranged the equation to isolate ${target}.`};
 const left=formula.split('=')[0]?.trim();
 if(left===target)return{original:formula,target,rearranged:formula,method:'direct',explanation:'The formula already isolates the requested variable.'};
 return{original:formula,target,rearranged:null,method:'solver-required',explanation:`This equation requires the symbolic solver to isolate ${target}; no rearrangement is guessed.`};
}