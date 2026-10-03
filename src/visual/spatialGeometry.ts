import type{GeometryPrimitiveSpec}from'./geometryEngine';
const L=(x1:number,y1:number,x2:number,y2:number,s:string):GeometryPrimitiveSpec=>({type:'line',attrs:{x1,y1,x2,y2},semantic:s});
const P=(points:string,s:string):GeometryPrimitiveSpec=>({type:'polygon',attrs:{points},semantic:s});

export function solidNet(id:string):GeometryPrimitiveSpec[]{
 if(id==='cube')return[P('35,35 50,35 50,50 35,50','net-face'),P('20,50 35,50 35,65 20,65','net-face'),P('35,50 50,50 50,65 35,65','net-face'),P('50,50 65,50 65,65 50,65','net-face'),P('65,50 80,50 80,65 65,65','net-face'),P('35,65 50,65 50,80 35,80','net-face')];
 if(id==='rectangular-prism')return[P('34,32 58,32 58,45 34,45','net-face'),P('20,45 34,45 34,68 20,68','net-face'),P('34,45 58,45 58,68 34,68','net-face'),P('58,45 72,45 72,68 58,68','net-face'),P('72,45 96,45 96,68 72,68','net-face'),P('34,68 58,68 58,81 34,81','net-face')];
 if(id==='cylinder')return[{type:'ellipse',attrs:{cx:24,cy:50,rx:12,ry:12},semantic:'net-base'},P('36,32 76,32 76,68 36,68','net-lateral'),{type:'ellipse',attrs:{cx:88,cy:50,rx:12,ry:12},semantic:'net-base'}];
 if(id==='cone')return[{type:'path',attrs:{d:'M 50 50 L 82 50 A 32 32 0 0 1 32 76 Z'},semantic:'net-sector'},{type:'circle',attrs:{cx:22,cy:28,r:11},semantic:'net-base'}];
 return[];
}

export function crossSection(id:string,kind:'horizontal'|'vertical'|'diagonal'='horizontal'):GeometryPrimitiveSpec[]{
 if(id==='cylinder')return kind==='horizontal'?[{type:'ellipse',attrs:{cx:50,cy:50,rx:24,ry:7},semantic:'cross-section'}]:[P('27,25 73,25 73,75 27,75','cross-section')];
 if(id==='cone')return kind==='horizontal'?[{type:'ellipse',attrs:{cx:50,cy:55,rx:17,ry:5},semantic:'cross-section'}]:[P('50,18 75,75 25,75','cross-section')];
 if(id==='sphere')return[{type:'ellipse',attrs:{cx:50,cy:50,rx:kind==='horizontal'?28:18,ry:kind==='horizontal'?8:28},semantic:'great-circle-section'}];
 if(id==='cube'||id==='rectangular-prism')return kind==='diagonal'?[P('24,35 67,25 78,65 35,75','diagonal-section')]:[P('22,48 70,38 82,50 34,60','cross-section')];
 if(id==='pyramid')return kind==='horizontal'?[P('35,55 63,60 73,53 46,48','cross-section')]:[P('52,16 64,76 22,66','cross-section')];
 return[];
}

export function dimensionLines(kind:'length'|'width'|'height'|'radius'|'diameter'|'slant-height',value:string):GeometryPrimitiveSpec[]{
 const configs:Record<string,[number,number,number,number]>={length:[20,88,78,88],width:[82,72,92,60],height:[88,25,88,75],radius:[50,50,76,50],diameter:[22,50,78,50],'slant-height':[52,18,79,74]};
 const c=configs[kind];return[L(...c,`dimension-${kind}`),{type:'text',attrs:{x:(c[0]+c[2])/2,y:(c[1]+c[3])/2-2,text:value},semantic:'dimension-label'}];
}
