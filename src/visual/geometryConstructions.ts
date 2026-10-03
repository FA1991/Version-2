import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
const L=(a:[number,number],b:[number,number],s:string):GeometryPrimitiveSpec=>({type:'line',attrs:{x1:a[0],y1:a[1],x2:b[0],y2:b[1]},semantic:s});
const T=(p:[number,number],value:string,s='label'):GeometryPrimitiveSpec=>({type:'text',attrs:{x:p[0],y:p[1],text:value},semantic:s});
export type ConstructionKind='median'|'altitude'|'angle-bisector'|'perpendicular-bisector'|'incircle'|'circumcircle'|'centroid'|'orthocenter'|'incenter'|'circumcenter';

export function triangleConstructions(model:GeometryModel,kinds:ConstructionKind[]):GeometryPrimitiveSpec[]{
 const A=model.anchors.A,B=model.anchors.B,C=model.anchors.C;if(!A||!B||!C)return[];
 const mid=(a:[number,number],b:[number,number]):[number,number]=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
 const centroid:[number,number]=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3],out:GeometryPrimitiveSpec[]=[];
 if(kinds.includes('median'))out.push(L(A,mid(B,C),'median'),L(B,mid(A,C),'median'),L(C,mid(A,B),'median'));
 if(kinds.includes('altitude'))out.push(L(C,[C[0],A[1]],'altitude'));
 if(kinds.includes('angle-bisector'))out.push(L(C,mid(A,B),'angle-bisector'));
 if(kinds.includes('perpendicular-bisector')){const m=mid(A,B);out.push(L([m[0],m[1]-28],[m[0],m[1]+8],'perpendicular-bisector'))}
 if(kinds.includes('centroid'))out.push({type:'point',attrs:{cx:centroid[0],cy:centroid[1]},semantic:'centroid'},T([centroid[0]+2,centroid[1]-2],'G','center-label'));
 if(kinds.includes('incircle'))out.push({type:'circle',attrs:{cx:centroid[0],cy:centroid[1]+5,r:15},semantic:'incircle'});
 if(kinds.includes('circumcircle'))out.push({type:'circle',attrs:{cx:50,cy:51,r:36},semantic:'circumcircle'});
 return out;
}

export function circleRelations(cx=50,cy=50,r=28):GeometryPrimitiveSpec[]{
 return[
  L([cx,cy],[cx+r,cy],'radius'),L([cx-r,cy],[cx+r,cy],'diameter'),
  L([cx-r*.75,cy-18],[cx+r*.75,cy-18],'chord'),
  L([cx-r-10,cy+13],[cx+r+10,cy-9],'secant'),
  L([cx+r,cy-30],[cx+r,cy+30],'tangent'),
  T([cx+r+2,cy-2],'T','tangent-point')
 ];
}

export function relationMarks(kind:'parallel'|'perpendicular'|'equal-side'|'equal-angle',at:[number,number]):GeometryPrimitiveSpec[]{
 if(kind==='parallel')return[T(at,'≫','parallel-mark')];
 if(kind==='perpendicular')return[{type:'path',attrs:{d:`M ${at[0]} ${at[1]} l 5 0 l 0 -5`},semantic:'right-angle-mark'}];
 if(kind==='equal-side')return[L([at[0]-2,at[1]-3],[at[0]+2,at[1]+3],'equal-side-mark')];
 return[{type:'path',attrs:{d:`M ${at[0]-5} ${at[1]} A 6 6 0 0 1 ${at[0]+5} ${at[1]}`},semantic:'equal-angle-mark'}];
}
