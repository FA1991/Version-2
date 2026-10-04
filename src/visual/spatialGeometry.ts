import type{GeometryPrimitiveSpec}from'./geometryEngine';
const L=(x1:number,y1:number,x2:number,y2:number,s:string):GeometryPrimitiveSpec=>({type:'line',attrs:{x1,y1,x2,y2},semantic:s});
const P=(points:string,s:string):GeometryPrimitiveSpec=>({type:'polygon',attrs:{points},semantic:s});

export function solidNet(id:string,opts:{width?:number;height?:number;depth?:number;radius?:number}={}):GeometryPrimitiveSpec[]{
 if(id==='cube')return[P('35,35 50,35 50,50 35,50','net-face'),P('20,50 35,50 35,65 20,65','net-face'),P('35,50 50,50 50,65 35,65','net-face'),P('50,50 65,50 65,65 50,65','net-face'),P('65,50 80,50 80,65 65,65','net-face'),P('35,65 50,65 50,80 35,80','net-face')];
 if(id==='rectangular-prism'){const w=Math.max(12,Math.min(28,opts.width??24)),h=Math.max(12,Math.min(28,opts.height??23)),d=Math.max(8,Math.min(18,opts.depth??14)),x=34,y=45;return[P(`${x},${y-h} ${x+w},${y-h} ${x+w},${y} ${x},${y}`,'net-face'),P(`${x-d},${y} ${x},${y} ${x},${y+h} ${x-d},${y+h}`,'net-face'),P(`${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`,'net-face'),P(`${x+w},${y} ${x+w+d},${y} ${x+w+d},${y+h} ${x+w},${y+h}`,'net-face'),P(`${x+w+d},${y} ${x+2*w+d},${y} ${x+2*w+d},${y+h} ${x+w+d},${y+h}`,'net-face'),P(`${x},${y+h} ${x+w},${y+h} ${x+w},${y+h+d} ${x},${y+h+d}`,'net-face')]};
 if(id==='cylinder'){const r=Math.max(6,Math.min(14,opts.radius??12)),h=Math.max(20,Math.min(42,opts.height??36)),w=Math.min(48,2*Math.PI*r);return[{type:'circle',attrs:{cx:16,cy:50,r},semantic:'net-base'},P(`${28},${50-h/2} ${28+w},${50-h/2} ${28+w},${50+h/2} ${28},${50+h/2}`,'net-lateral'),{type:'circle',attrs:{cx:Math.min(91,32+w+r),cy:50,r},semantic:'net-base'}]};
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
