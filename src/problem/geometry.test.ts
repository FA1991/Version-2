import{describe,it,expect}from'vitest';import{analyzeGeometryQuestion}from'./geometryQuestionAnalyzer';import{solveGeometry}from'./geometrySolver';import{geometryDiagram}from'../visual/geometryDiagram';
const cases:[string,number][]=[
 ['A circle has radius 5 cm. Find the area.',78.5398],
 ['A rectangle has length 8 m and width 3 m. Find the area.',24],
 ['A square has side 7 cm. Find the perimeter.',28],
 ['A triangle has base 10 cm and height 6 cm. Find the area.',30],
 ['A cylinder has radius 4 cm and height 10 cm. Find the volume.',502.6548],
 ['A cone has radius 3 cm and height 12 cm. Find the volume.',113.0973],
 ['A sphere has radius 3 cm. Find the volume.',113.0973],
 ['A cube has side 4 cm. Find the surface area.',96],
 ['A rectangular prism has length 4 cm width 3 cm and height 2 cm. Find the volume.',24]
];
describe('geometry end-to-end',()=>{for(const [q,want]of cases)it(q,()=>{const a=analyzeGeometryQuestion(q),s=solveGeometry(a),d=geometryDiagram(a);expect(a.shape).toBeTruthy();expect(s.success).toBe(true);expect(s.value).toBeCloseTo(want,3);expect(d).toBeTruthy()})});
describe('safe failure',()=>{it('does not guess unsupported data',()=>{const a=analyzeGeometryQuestion('A triangle has one side 5 cm. Find its area.');expect(solveGeometry(a).success).toBe(false)})});