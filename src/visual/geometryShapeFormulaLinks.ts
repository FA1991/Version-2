import type{FormulaRule}from'../knowledge/formulaLibrary';import{GEOMETRY_FORMULAS}from'../knowledge/geometryFormulaRegistry';import{VISUAL_OBJECTS,type VisualObjectDefinition}from'./visualObjectRegistry';import{GEOMETRY_COVERAGE,type GeometryCoverageItem}from'./geometryCoverageRegistry';
export interface GeometryShapeFormulaLink{shapeId:string;shapeName:string;visualId:string|null;formulaIds:string[];status:'connected'|'visual-only'|'formula-only'|'planned'}
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const words=(s:string)=>new Set(norm(s).split(' ').filter(Boolean));
function score(a:string,b:string){const A=words(a),B=words(b);let n=0;for(const w of A)if(B.has(w))n++;return n}
function visualFor(item:GeometryCoverageItem):VisualObjectDefinition|null{const candidates=VISUAL_OBJECTS.filter(v=>v.family.startsWith('geometry'));return candidates.sort((a,b)=>Math.max(score(b.id,item.name),...b.aliases.map(x=>score(x,item.name)))-Math.max(score(a.id,item.name),...a.aliases.map(x=>score(x,item.name))))[0]??null}
function formulasFor(item:GeometryCoverageItem):FormulaRule[]{return GEOMETRY_FORMULAS.filter(f=>f.problemTypes.some(t=>score(t,item.name)>0)||score(f.topic,item.category)>0||score(f.id,item.name)>=1)}
export const GEOMETRY_SHAPE_FORMULA_LINKS:GeometryShapeFormulaLink[]=GEOMETRY_COVERAGE.map(item=>{const v=visualFor(item),fs=formulasFor(item),implemented=item.status!=='planned';return{shapeId:item.id,shapeName:item.name,visualId:v?.id??null,formulaIds:fs.map(f=>f.id),status:v&&fs.length&&implemented?'connected':v&&implemented?'visual-only':fs.length?'formula-only':'planned'}});
export function geometryLinkForShape(text:string){const q=norm(text);return GEOMETRY_SHAPE_FORMULA_LINKS.filter(x=>q.includes(norm(x.shapeName))||norm(x.shapeName).includes(q))}
export function geometryFormulaIdsForShape(shapeId:string){return GEOMETRY_SHAPE_FORMULA_LINKS.find(x=>x.shapeId===shapeId)?.formulaIds??[]}
export function geometryConnectionSummary(){return GEOMETRY_SHAPE_FORMULA_LINKS.reduce((a,x)=>(a[x.status]=(a[x.status]??0)+1,a),{} as Record<string,number>)}
