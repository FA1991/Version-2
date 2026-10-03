export type VisualDimension='2D'|'2.5D'|'diagram'|'plot';
export interface VisualObjectDefinition{
 id:string;family:string;dimension:VisualDimension;
 aliases:string[];parameters:string[];anchors:string[];
 capabilities:string[];levels:('middle'|'high'|'university')[];
}

/**
 * Universal STEM visual registry.
 * Definitions describe semantic objects; renderers decide how they look.
 * New curriculum objects are added as data instead of renderer-specific branches.
 */
export const VISUAL_OBJECTS:VisualObjectDefinition[]=[
 // Geometry — 2D
 ['point','geometry','2D',['point','vertex'],['x','y'],['center'],['label'],['middle','high','university']],
 ['line','geometry','2D',['line','segment'],['x1','y1','x2','y2'],['start','end','midpoint'],['label','measure','extend'],['middle','high','university']],
 ['angle','geometry','2D',['angle'],['value'],['vertex','ray1','ray2'],['arc','label','measure'],['middle','high','university']],
 ['triangle','geometry','2D',['triangle'],['a','b','c','A','B','C'],['vertices','sides','center'],['measure','highlight','altitude','median','bisector','incircle','circumcircle'],['middle','high','university']],
 ['quadrilateral','geometry','2D',['quadrilateral'],['vertices'],['vertices','sides','center'],['measure','diagonal'],['middle','high','university']],
 ['rectangle','geometry','2D',['rectangle'],['length','width'],['vertices','sides','center'],['measure','diagonal'],['middle','high','university']],
 ['square','geometry','2D',['square'],['side'],['vertices','sides','center'],['measure','diagonal'],['middle','high','university']],
 ['parallelogram','geometry','2D',['parallelogram'],['base','height','angle'],['vertices','sides','center'],['measure','diagonal'],['middle','high','university']],
 ['rhombus','geometry','2D',['rhombus'],['side','d1','d2'],['vertices','sides','center'],['measure','diagonal'],['middle','high','university']],
 ['trapezoid','geometry','2D',['trapezoid','trapezium'],['base1','base2','height'],['vertices','sides','center'],['measure','midsegment'],['middle','high','university']],
 ['polygon','geometry','2D',['polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','dodecagon','n-gon'],['n','side','vertices'],['vertices','sides','center'],['regular','measure','diagonal'],['middle','high','university']],
 ['circle','geometry','2D',['circle'],['radius','diameter'],['center','circumference'],['radius','diameter','chord','secant','tangent','arc','sector','segment','angle'],['middle','high','university']],
 ['ellipse','geometry','2D',['ellipse'],['a','b','c'],['center','focus1','focus2'],['axes','foci','tangent'],['high','university']],
 ['parabola','geometry','plot',['parabola'],['a','h','k'],['vertex','focus'],['axis','directrix','tangent'],['high','university']],
 ['hyperbola','geometry','plot',['hyperbola'],['a','b','c'],['center','foci'],['axes','asymptotes'],['high','university']],

 // Geometry — projected 3D
 ['cube','geometry-3d','2.5D',['cube'],['side'],['vertices','edges','faces','center'],['measure','net','section','hidden-edges'],['middle','high','university']],
 ['rectangular-prism','geometry-3d','2.5D',['rectangular prism','cuboid'],['length','width','height'],['vertices','edges','faces','center'],['measure','net','section','hidden-edges'],['middle','high','university']],
 ['prism','geometry-3d','2.5D',['prism','triangular prism','pentagonal prism','hexagonal prism'],['base','height','n'],['vertices','edges','faces','center'],['measure','net','section'],['middle','high','university']],
 ['pyramid','geometry-3d','2.5D',['pyramid','square pyramid','triangular pyramid','tetrahedron'],['base','height','slantHeight'],['apex','base','edges','faces'],['measure','net','section'],['middle','high','university']],
 ['cylinder','geometry-3d','2.5D',['cylinder'],['radius','height'],['axis','top','bottom','center'],['measure','net','section'],['middle','high','university']],
 ['cone','geometry-3d','2.5D',['cone'],['radius','height','slantHeight'],['apex','base','axis'],['measure','net','section'],['middle','high','university']],
 ['sphere','geometry-3d','2.5D',['sphere'],['radius'],['center','surface'],['radius','great-circle','section'],['middle','high','university']],
 ['hemisphere','geometry-3d','2.5D',['hemisphere'],['radius'],['center','base','surface'],['radius','section'],['middle','high','university']],
 ['frustum','geometry-3d','2.5D',['frustum'],['r1','r2','height','slantHeight'],['top','bottom','axis'],['measure','section'],['high','university']],
 ['polyhedron','geometry-3d','2.5D',['polyhedron','octahedron','dodecahedron','icosahedron'],['vertices','faces'],['vertices','edges','faces'],['measure','net','section'],['high','university']],

 // Algebra / calculus / statistics / discrete math
 ['coordinate-plane','math','plot',['coordinate plane','cartesian plane'],['xmin','xmax','ymin','ymax'],['origin','axes'],['grid','ticks','labels'],['middle','high','university']],
 ['function-plot','math','plot',['function','graph'],['expression','domain'],['axes'],['plot','intercepts','extrema','asymptote'],['middle','high','university']],
 ['vector','math','2D',['vector'],['components'],['tail','head'],['label','components','projection'],['high','university']],
 ['tangent-line','calculus','plot',['tangent','derivative'],['x','slope'],['point'],['slope','label'],['high','university']],
 ['riemann-area','calculus','plot',['integral','area under curve','riemann sum'],['a','b','n'],['axes'],['shade','rectangles','bounds'],['high','university']],
 ['multivariable-surface','calculus','2.5D',['surface','z=f(x,y)'],['expression','domain'],['axes'],['mesh','contours','gradient'],['university']],
 ['vector-field','calculus','plot',['vector field','gradient field'],['field','domain'],['axes'],['arrows','streamlines'],['university']],
 ['slope-field','calculus','plot',['slope field','direction field'],['ode','domain'],['axes'],['segments','solution-curve'],['university']],
 ['matrix-grid','math','diagram',['matrix'],['rows','cols','values'],['cells'],['highlight','transform'],['high','university']],
 ['statistics-plot','statistics','plot',['histogram','box plot','scatter plot','normal distribution','bar chart'],['data'],['axes'],['mean','median','spread','regression'],['middle','high','university']],
 ['graph-network','discrete','diagram',['graph','network'],['nodes','edges'],['nodes','edges'],['directed','weighted','path','cycle'],['high','university']],

 // Physics / engineering
 ['body','physics','diagram',['box','block','object','mass'],['mass'],['center','faces'],['force-anchor','velocity-anchor','ghost'],['middle','high','university']],
 ['ramp','physics','diagram',['ramp','incline'],['angle','length'],['start','end','surface'],['measure','normal-anchor'],['middle','high','university']],
 ['force-arrow','physics','diagram',['force','weight','normal force','friction','tension'],['magnitude','direction'],['tail','head'],['vector','label','components'],['middle','high','university']],
 ['spring','physics','diagram',['spring'],['k','length'],['ends'],['force','extension'],['high','university']],
 ['pulley','physics','diagram',['pulley'],['radius'],['center','rim'],['rope','tension'],['middle','high','university']],
 ['wave','physics','plot',['wave','sound wave'],['amplitude','frequency','wavelength','phase'],['axis'],['measure','animate'],['middle','high','university']],
 ['ray-optics','physics','diagram',['lens','mirror','ray'],['focalLength'],['center','focus'],['rays','image','object'],['high','university']],
 ['circuit','physics','diagram',['circuit'],['components'],['terminals'],['wire','current','voltage'],['middle','high','university']],
 ['field','physics','diagram',['electric field','magnetic field'],['sources'],['sources'],['field-lines','vectors','equipotential'],['high','university']],

 // Chemistry
 ['atom','chemistry','diagram',['atom'],['element','protons','neutrons','electrons'],['nucleus','shells'],['electron-shells','labels'],['middle','high','university']],
 ['lewis-structure','chemistry','diagram',['lewis structure'],['atoms','bonds','lonePairs'],['atoms','bonds'],['formal-charge','resonance'],['high','university']],
 ['molecule','chemistry','diagram',['molecule'],['atoms','bonds'],['atoms','bonds'],['2d-structure','labels'],['middle','high','university']],
 ['molecular-geometry','chemistry','2.5D',['molecular geometry','vsepr'],['atoms','bonds','angles'],['centralAtom','atoms'],['wedge-dash','bond-angle'],['high','university']],
 ['organic-structure','chemistry','diagram',['skeletal formula','organic structure'],['atoms','bonds'],['atoms','bonds'],['rings','functional-groups','mechanism-arrows'],['high','university']],
 ['reaction','chemistry','diagram',['reaction','chemical equation'],['reactants','products'],['reactants','products'],['arrow','conditions','stoichiometry'],['middle','high','university']],
 ['energy-profile','chemistry','plot',['reaction coordinate','energy diagram'],['states','energies'],['axes'],['activation-energy','deltaH'],['high','university']],
 ['lab-apparatus','chemistry','diagram',['beaker','flask','burette','test tube','graduated cylinder'],['type','volume'],['container'],['liquid','scale','label'],['middle','high','university']],

 // Biology
 ['cell','biology','diagram',['cell','animal cell','plant cell','bacterial cell'],['type'],['membrane','center'],['organelles','labels','zoom'],['middle','high','university']],
 ['organelle','biology','diagram',['nucleus','mitochondrion','chloroplast','ribosome'],['type'],['center'],['labels','internal-structure'],['middle','high','university']],
 ['membrane','biology','diagram',['cell membrane','phospholipid bilayer'],['layers'],['sides'],['proteins','transport','gradient'],['high','university']],
 ['dna','biology','diagram',['dna','double helix'],['sequence'],['strands'],['bases','replication','labels'],['middle','high','university']],
 ['chromosome','biology','diagram',['chromosome'],['genes'],['centromere','arms'],['genes','alleles'],['middle','high','university']],
 ['punnett-square','biology','diagram',['punnett square'],['alleles'],['cells'],['genotypes','phenotypes'],['middle','high','university']],
 ['phylogenetic-tree','biology','diagram',['phylogenetic tree','cladogram'],['taxa','branches'],['root','nodes','leaves'],['labels','traits'],['high','university']],
 ['food-web','biology','diagram',['food web','food chain'],['organisms','relations'],['nodes'],['energy-arrows','trophic-levels'],['middle','high','university']],
 ['biochemical-pathway','biology','diagram',['metabolic pathway','signaling pathway'],['molecules','reactions'],['nodes'],['enzymes','arrows','inhibition'],['high','university']]
].map(([id,family,dimension,aliases,parameters,anchors,capabilities,levels])=>({id,family,dimension,aliases,parameters,anchors,capabilities,levels})) as VisualObjectDefinition[];

export function findVisualObject(text:string){
 const q=text.toLowerCase();
 return VISUAL_OBJECTS.filter(o=>o.aliases.some(a=>q.includes(a)));
}
