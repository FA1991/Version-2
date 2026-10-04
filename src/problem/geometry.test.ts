import{describe,it,expect}from'vitest';
import{solveGeometry}from'./geometrySolver';
import{verifyGeometry}from'./geometryVerifier';
import{geometryDiagram}from'../visual/geometryDiagram';
import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';

const problem=(shape:string,target:string,givens:Record<string,number>,units:Record<string,string>={}):GeometryQuestionAnalysis=>({subject:'geometry',shape,givens,units,target,warnings:[],regularPolygon:false,polygonN:null,raw:''});

describe('geometry engine contract',()=>{
 it('solves and verifies a circle area from structured data',()=>{const a=problem('circle','area',{r:5},{r:'cm'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.value).toBeCloseTo(Math.PI*25,3);expect(verifyGeometry(a,s).valid).toBe(true);expect(geometryDiagram(a)).toBeTruthy()});
 it('solves and verifies a rectangular-prism volume from structured data',()=>{const a=problem('rectangular prism','volume',{l:5,w:3,h:2},{l:'m',w:'m',h:'m'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.value).toBe(30);expect(verifyGeometry(a,s).valid).toBe(true);expect(geometryDiagram(a)).toBeTruthy()});
 it('shows formula manipulation for an inverse cylinder target',()=>{const a=problem('cylinder','radius',{V:500,h:10},{V:'cm³',h:'cm'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.formula).toBe('V = πr²h');expect(s.steps.join(' ')).toContain('r = sqrt(V/(π*h))');expect(verifyGeometry(a,s).valid).toBe(true)});
 it('shows formula manipulation for an inverse cone target',()=>{const a=problem('cone','height',{V:300,r:5},{V:'cm³',r:'cm'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.formula).toBe('V = ⅓πr²h');expect(s.steps.join(' ')).toContain('h = 3*V/(π*r^2)')});
 it('honors an explicit pi approximation',()=>{const a=problem('circle','area',{r:7,__pi:22/7},{r:'cm'}),s=solveGeometry(a);expect(s.value).toBe(154)});
 it('verifies core inverse Geometry families from structured data',()=>{const cases=[problem('circle','radius',{A:314.1593},{A:'cm²'}),problem('triangle','height',{A:30,b:10},{A:'cm²',b:'cm'}),problem('triangle','base',{A:30,h:6},{A:'cm²',h:'cm'}),problem('rectangular prism','height',{V:120,l:5,w:4},{V:'cm³',l:'cm',w:'cm'}),problem('cube','side',{V:125},{V:'cm³'}),problem('cone','radius',{V:300,h:10},{V:'cm³',h:'cm'}),problem('sphere','radius',{V:523.5988},{V:'cm³'})];for(const a of cases){const s=solveGeometry(a);expect(s.success).toBe(true);expect(verifyGeometry(a,s).valid).toBe(true)}});
 it('does not invent missing measurements',()=>{const a=problem('triangle','area',{s:5},{s:'cm'});expect(solveGeometry(a).success).toBe(false)});
});
