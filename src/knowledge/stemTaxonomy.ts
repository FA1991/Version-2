export type EducationLevel='Middle School'|'High School'|'University'|'Unknown';
export interface TaxonomyRule{level:EducationLevel;subject:string;area:string;topic:string;subtopic:string;problemType:string;terms:string[];boost?:string[]}

/**
 * Scalable STEM taxonomy seed.
 * Add problem families here instead of adding if/else branches to the parser.
 * Each family can later link to formulas, units, diagram blueprints and teaching rules.
 */
export const STEM_TAXONOMY:TaxonomyRule[]=[
 {level:'Middle School',subject:'Mathematics',area:'Number & Operations',topic:'Arithmetic',subtopic:'Ratios, rates & percentages',problemType:'Ratio/rate/percent',terms:['ratio','rate','percent','percentage'],boost:['proportion','discount','markup']},
 {level:'Middle School',subject:'Mathematics',area:'Pre-Algebra',topic:'Expressions & Equations',subtopic:'Linear relationships',problemType:'One-step/two-step equation',terms:['solve for','equation'],boost:['variable','linear']},
 {level:'Middle School',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',subtopic:'Triangles',problemType:'Triangle measurement',terms:['triangle'],boost:['angle','area','perimeter','side']},
 {level:'Middle School',subject:'Mathematics',area:'Geometry',topic:'Plane Geometry',subtopic:'Circles',problemType:'Circle measurement',terms:['circle','radius','diameter'],boost:['circumference','area']},
 {level:'Middle School',subject:'Mathematics',area:'Statistics',topic:'Data',subtopic:'Descriptive statistics',problemType:'Mean/median/mode/range',terms:['mean','median','mode','range'],boost:['data','average']},

 {level:'High School',subject:'Mathematics',area:'Algebra',topic:'Algebra I/II',subtopic:'Linear equations & systems',problemType:'Linear equation/system',terms:['linear equation','system of equations'],boost:['slope','intercept']},
 {level:'High School',subject:'Mathematics',area:'Algebra',topic:'Algebra I/II',subtopic:'Quadratics',problemType:'Quadratic equation',terms:['quadratic','parabola'],boost:['factor','vertex','roots']},
 {level:'High School',subject:'Mathematics',area:'Geometry',topic:'Euclidean Geometry',subtopic:'Similarity & congruence',problemType:'Geometric proof/measurement',terms:['similar','congruent'],boost:['proof','triangle']},
 {level:'High School',subject:'Mathematics',area:'Trigonometry',topic:'Trigonometric Functions',subtopic:'Right triangles',problemType:'Trig triangle',terms:['sine','cosine','tangent','sin','cos','tan'],boost:['angle','triangle']},
 {level:'High School',subject:'Mathematics',area:'Precalculus',topic:'Functions',subtopic:'Polynomial/exponential/logarithmic',problemType:'Function analysis',terms:['function','logarithm','exponential'],boost:['domain','range','graph']},
 {level:'High School',subject:'Mathematics',area:'Probability & Statistics',topic:'Probability',subtopic:'Events & distributions',problemType:'Probability',terms:['probability','odds'],boost:['event','random']},

 {level:'High School',subject:'Physics',area:'Mechanics',topic:'Kinematics',subtopic:'One-dimensional motion',problemType:'Motion',terms:['velocity','acceleration','displacement'],boost:['time','distance']},
 {level:'High School',subject:'Physics',area:'Mechanics',topic:'Kinematics',subtopic:'Projectile motion',problemType:'Projectile motion',terms:['projectile','launched','thrown'],boost:['angle','range','velocity']},
 {level:'High School',subject:'Physics',area:'Mechanics',topic:'Dynamics',subtopic:'Forces',problemType:'Newton laws',terms:['force','newton'],boost:['mass','acceleration','friction']},
 {level:'High School',subject:'Physics',area:'Mechanics',topic:'Dynamics',subtopic:'Inclined planes',problemType:'Inclined plane',terms:['incline','ramp'],boost:['force','friction','acceleration']},
 {level:'High School',subject:'Physics',area:'Mechanics',topic:'Energy & Momentum',subtopic:'Work/energy/momentum',problemType:'Conservation',terms:['kinetic energy','potential energy','momentum'],boost:['work','collision','conservation']},
 {level:'High School',subject:'Physics',area:'Waves',topic:'Waves & Sound',subtopic:'Wave properties',problemType:'Wave',terms:['frequency','wavelength','wave'],boost:['sound','period']},
 {level:'High School',subject:'Physics',area:'Electricity & Magnetism',topic:'Circuits',subtopic:'DC circuits',problemType:'Circuit',terms:['voltage','current','resistance'],boost:['circuit','ohm','resistor']},
 {level:'High School',subject:'Physics',area:'Optics',topic:'Geometric Optics',subtopic:'Mirrors & lenses',problemType:'Optics',terms:['lens','mirror','refraction'],boost:['focal','image']},

 {level:'High School',subject:'Chemistry',area:'General Chemistry',topic:'Stoichiometry',subtopic:'Moles & reactions',problemType:'Stoichiometry',terms:['mole','stoichiometry'],boost:['molar mass','reaction','grams']},
 {level:'High School',subject:'Chemistry',area:'General Chemistry',topic:'Atomic Structure',subtopic:'Atoms & periodicity',problemType:'Atomic structure',terms:['atom','electron','proton','neutron'],boost:['periodic','orbital']},
 {level:'High School',subject:'Chemistry',area:'General Chemistry',topic:'Solutions',subtopic:'Concentration',problemType:'Solution concentration',terms:['molarity','concentration','solution'],boost:['solute','solvent']},
 {level:'High School',subject:'Chemistry',area:'General Chemistry',topic:'Acids & Bases',subtopic:'pH',problemType:'Acid/base',terms:['ph','acid','base'],boost:['hydrogen ion','neutralization']},

 {level:'High School',subject:'Biology',area:'Cell Biology',topic:'Cells',subtopic:'Cell structure & transport',problemType:'Cell biology',terms:['cell','membrane','organelle'],boost:['diffusion','osmosis']},
 {level:'High School',subject:'Biology',area:'Genetics',topic:'Inheritance',subtopic:'Mendelian genetics',problemType:'Genetics',terms:['gene','allele','genotype','phenotype'],boost:['punnett','inheritance']},
 {level:'High School',subject:'Biology',area:'Ecology',topic:'Populations & Ecosystems',subtopic:'Ecological relationships',problemType:'Ecology',terms:['ecosystem','population','food web'],boost:['carrying capacity','species']},

 {level:'High School',subject:'Computer Science',area:'Programming',topic:'Programming Fundamentals',subtopic:'Control flow & data',problemType:'Programming fundamentals',terms:['algorithm','loop','array','variable'],boost:['code','function','program']},

 {level:'University',subject:'Mathematics',area:'Calculus',topic:'Calculus I',subtopic:'Limits & derivatives',problemType:'Differentiation',terms:['derivative','differentiate','limit'],boost:['tangent','rate of change']},
 {level:'University',subject:'Mathematics',area:'Calculus',topic:'Calculus II',subtopic:'Integration & series',problemType:'Integration/series',terms:['integral','integrate','series'],boost:['area under','convergence']},
 {level:'University',subject:'Mathematics',area:'Calculus',topic:'Multivariable Calculus',subtopic:'Partial derivatives & multiple integrals',problemType:'Multivariable calculus',terms:['partial derivative','double integral','triple integral','gradient'],boost:['multivariable','lagrange']},
 {level:'University',subject:'Mathematics',area:'Linear Algebra',topic:'Matrices & Vector Spaces',subtopic:'Linear systems/eigenvalues',problemType:'Linear algebra',terms:['matrix','eigenvalue','eigenvector'],boost:['determinant','vector space']},
 {level:'University',subject:'Mathematics',area:'Differential Equations',topic:'ODEs',subtopic:'Ordinary differential equations',problemType:'Differential equation',terms:['differential equation','ode'],boost:['initial value','laplace']},
 {level:'University',subject:'Mathematics',area:'Discrete Mathematics',topic:'Discrete Structures',subtopic:'Logic/combinatorics/graphs',problemType:'Discrete math',terms:['combinatorics','graph theory','recurrence'],boost:['logic','permutation','combination']},
 {level:'University',subject:'Mathematics',area:'Statistics',topic:'Inferential Statistics',subtopic:'Estimation & hypothesis testing',problemType:'Statistical inference',terms:['hypothesis test','confidence interval','regression'],boost:['p-value','distribution']},

 {level:'University',subject:'Physics',area:'Mechanics',topic:'Classical Mechanics',subtopic:'Dynamics & oscillations',problemType:'Classical mechanics',terms:['lagrangian','angular momentum','simple harmonic'],boost:['torque','oscillation']},
 {level:'University',subject:'Physics',area:'Electricity & Magnetism',topic:'Electromagnetism',subtopic:'Fields & Maxwell equations',problemType:'Electromagnetism',terms:['electric field','magnetic field','gauss law','maxwell'],boost:['flux','potential']},
 {level:'University',subject:'Physics',area:'Thermal Physics',topic:'Thermodynamics',subtopic:'Heat/work/entropy',problemType:'Thermodynamics',terms:['entropy','thermodynamics','heat engine'],boost:['temperature','work']},
 {level:'University',subject:'Physics',area:'Modern Physics',topic:'Quantum Mechanics',subtopic:'Quantum states',problemType:'Quantum mechanics',terms:['wavefunction','schrodinger','quantum'],boost:['probability density','operator']},

 {level:'University',subject:'Chemistry',area:'Organic Chemistry',topic:'Organic Reactions',subtopic:'Structure & mechanisms',problemType:'Organic chemistry',terms:['organic','alkane','alkene','nucleophile','electrophile'],boost:['mechanism','functional group']},
 {level:'University',subject:'Chemistry',area:'Physical Chemistry',topic:'Thermodynamics & Kinetics',subtopic:'Chemical thermodynamics/kinetics',problemType:'Physical chemistry',terms:['gibbs free energy','rate law','equilibrium constant'],boost:['enthalpy','entropy']},
 {level:'University',subject:'Chemistry',area:'Analytical Chemistry',topic:'Quantitative Analysis',subtopic:'Equilibria & instrumentation',problemType:'Analytical chemistry',terms:['titration','spectroscopy','chromatography'],boost:['analyte','calibration']},

 {level:'University',subject:'Biology',area:'Molecular Biology',topic:'Molecular Genetics',subtopic:'DNA/RNA/protein',problemType:'Molecular biology',terms:['dna','rna','transcription','translation'],boost:['protein','mutation']},
 {level:'University',subject:'Biology',area:'Biochemistry',topic:'Biomolecules & Metabolism',subtopic:'Enzymes/metabolic pathways',problemType:'Biochemistry',terms:['enzyme','metabolism','amino acid'],boost:['protein','atp']},
 {level:'University',subject:'Biology',area:'Population Biology',topic:'Evolution & Ecology',subtopic:'Population genetics/ecology',problemType:'Population biology',terms:['hardy-weinberg','natural selection','population genetics'],boost:['allele frequency','evolution']},

 {level:'University',subject:'Computer Science',area:'Algorithms & Data Structures',topic:'Algorithms',subtopic:'Complexity & structures',problemType:'Algorithm/data structure',terms:['big o','time complexity','binary tree','linked list'],boost:['algorithm','recursion','graph']},
 {level:'University',subject:'Computer Science',area:'Theory',topic:'Discrete/Automata',subtopic:'Computation',problemType:'CS theory',terms:['automaton','turing machine','formal language'],boost:['grammar','computability']},
 {level:'University',subject:'Computer Science',area:'Systems',topic:'Computer Systems',subtopic:'Architecture/OS/networks',problemType:'Computer systems',terms:['operating system','process','thread','network'],boost:['memory','cpu','protocol']}
];