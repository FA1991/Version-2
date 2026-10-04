import{describe,it,expect}from'vitest';
import{solveGeometry}from'./geometrySolver';
import{verifyGeometry}from'./geometryVerifier';
import{geometryDiagram}from'../visual/geometryDiagram';
import type{GeometryQuestionAnalysis}from'./geometryQuestionAnalyzer';

const problem=(shape:string,target:string,givens:Record<string,number>,units:Record<string,string>={}):GeometryQuestionAnalysis=>({subject:'geometry',shape,givens,units,target,warnings:[],regularPolygon:false,polygonN:null,raw:''});

describe('geometry engine contract',()=>{
 it('solves and verifies a circle area from structured data',()=>{const a=problem('circle','area',{r:5},{r:'cm'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.value).toBeCloseTo(Math.PI*25,6);expect(verifyGeometry(a,s).valid).toBe(true);expect(geometryDiagram(a)).toBeTruthy()});
 it('solves and verifies a rectangular-prism volume from structured data',()=>{const a=problem('rectangular prism','volume',{l:5,w:3,h:2},{l:'m',w:'m',h:'m'}),s=solveGeometry(a);expect(s.success).toBe(true);expect(s.value).toBe(30);expect(verifyGeometry(a,s).valid).toBe(true);expect(geometryDiagram(a)).toBeTruthy()});
 it('does not invent missing measurements',()=>{const a=problem('triangle','area',{s:5},{s:'cm'});expect(solveGeometry(a).success).toBe(false)});
});
