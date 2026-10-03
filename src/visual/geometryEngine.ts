export type GeometryPrimitive='point'|'line'|'polyline'|'polygon'|'circle'|'ellipse'|'path'|'text';
export interface GeometryPrimitiveSpec{type:GeometryPrimitive;attrs:Record<string,string|number>;semantic?:string}
export interface GeometryModel{id:string;dimension:'2D'|'2.5D';primitives:GeometryPrimitiveSpec[];anchors:Record<string,[number,number]>}

const line=(x1:number,y1:number,x2:number,y2:number,semantic='edge'):GeometryPrimitiveSpec=>({type:'line',attrs:{x1,y1,x2,y2},semantic});
const text=(x:number,y:number,value:string):GeometryPrimitiveSpec=>({type:'text',attrs:{x,y,text:value},semantic:'label'});

export function buildGeometry(id:string,p:Record<string,number|string>= {}):GeometryModel|null{
 switch(id){
  case'triangle':{const A:[number,number]=[15,78],B:[number,number]=[82,78],C:[number,number]=[58,22];return{id,dimension:'2D',primitives:[{type:'polygon',attrs:{points:`${A[0]},${A[1]} ${B[0]},${B[1]} ${C[0]},${C[1]}`},semantic:'face'},text(A[0]-4,A[1]+5,'A'),text(B[0]+2,B[1]+5,'B'),text(C[0],C[1]-3,'C')],anchors:{A,B,C,center:[52,59]}}}
  case'rectangle':case'square':{const x=18,y=25,w=id==='square'?52:Number(p.width??62),h=id==='square'?52:Number(p.height??45);return{id,dimension:'2D',primitives:[{type:'polygon',attrs:{points:`${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`},semantic:'face'}],anchors:{topLeft:[x,y],topRight:[x+w,y],bottomRight:[x+w,y+h],bottomLeft:[x,y+h],center:[x+w/2,y+h/2]}}}
  case'circle':{const cx=50,cy=50,r=Number(p.radius??28);return{id,dimension:'2D',primitives:[{type:'circle',attrs:{cx,cy,r},semantic:'circumference'},line(cx,cy,cx+r,cy,'radius'),text(cx+r/2,cy-3,'r')],anchors:{center:[cx,cy],right:[cx+r,cy],left:[cx-r,cy],top:[cx,cy-r],bottom:[cx,cy+r]}}}
  case'ellipse':{const cx=50,cy=50,rx=Number(p.a??32),ry=Number(p.b??20);return{id,dimension:'2D',primitives:[{type:'ellipse',attrs:{cx,cy,rx,ry},semantic:'curve'},line(cx-rx,cy,cx+rx,cy,'major-axis'),line(cx,cy-ry,cx,cy+ry,'minor-axis')],anchors:{center:[cx,cy],focus1:[cx-Math.sqrt(Math.max(0,rx*rx-ry*ry)),cy],focus2:[cx+Math.sqrt(Math.max(0,rx*rx-ry*ry)),cy]}}}
  case'cube':case'rectangular-prism':{const x=20,y=34,w=48,h=38,dx=15,dy=-13;const ps:GeometryPrimitiveSpec[]=[line(x,y,x+w,y),line(x+w,y,x+w,y+h),line(x+w,y+h,x,y+h),line(x,y+h,x,y),line(x+dx,y+dy,x+w+dx,y+dy),line(x+w+dx,y+dy,x+w+dx,y+h+dy),line(x+w+dx,y+h+dy,x+dx,y+h+dy),line(x+dx,y+h+dy,x+dx,y+dy),line(x,y,x+dx,y+dy),line(x+w,y,x+w+dx,y+dy),line(x+w,y+h,x+w+dx,y+h+dy),line(x,y+h,x+dx,y+h+dy,'hidden-edge')];return{id,dimension:'2.5D',primitives:ps,anchors:{center:[x+w/2+dx/2,y+h/2+dy/2],front:[x+w/2,y+h/2],back:[x+w/2+dx,y+h/2+dy]}}}
  case'cylinder':{const cx=50,top=25,bottom=75,rx=25,ry=8;return{id,dimension:'2.5D',primitives:[{type:'ellipse',attrs:{cx,cy:top,rx,ry},semantic:'top-base'},line(cx-rx,top,cx-rx,bottom),line(cx+rx,top,cx+rx,bottom),{type:'ellipse',attrs:{cx,cy:bottom,rx,ry},semantic:'bottom-base'},line(cx,top,cx,bottom,'axis')],anchors:{top:[cx,top],bottom:[cx,bottom],center:[cx,50]}}}
  case'cone':{const cx=50,apex=18,base=75,rx=27,ry=8;return{id,dimension:'2.5D',primitives:[line(cx,apex,cx-rx,base),line(cx,apex,cx+rx,base),{type:'ellipse',attrs:{cx,cy:base,rx,ry},semantic:'base'},line(cx,apex,cx,base,'axis')],anchors:{apex:[cx,apex],base:[cx,base],center:[cx,50]}}}
  case'sphere':{const cx=50,cy=50,r=30;return{id,dimension:'2.5D',primitives:[{type:'circle',attrs:{cx,cy,r},semantic:'surface'},{type:'ellipse',attrs:{cx,cy,rx:r,ry:8},semantic:'great-circle'},line(cx,cy,cx+r,cy,'radius')],anchors:{center:[cx,cy],surface:[cx+r,cy]}}}
  case'pyramid':{const apex:[number,number]=[52,16],a:[number,number]=[22,66],b:[number,number]=[64,76],c:[number,number]=[82,60],d:[number,number]=[42,53];return{id,dimension:'2.5D',primitives:[line(...apex,...a),line(...apex,...b),line(...apex,...c),line(...apex,...d),line(...a,...b),line(...b,...c),line(...c,...d),line(...d,...a,'hidden-edge')],anchors:{apex,a,b,c,d,center:[52,54]}}}
  default:return null;
 }
}
