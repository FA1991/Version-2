import type{GeometryModel,GeometryPrimitiveSpec}from'./geometryEngine';
export interface Transform2D{translateX?:number;translateY?:number;rotateDeg?:number;scaleX?:number;scaleY?:number;reflectX?:boolean;reflectY?:boolean}
export interface CoordinateScene{model:GeometryModel;axes:GeometryPrimitiveSpec[];transformLabel?:string}

export function coordinateAxes(min=-10,max=10):GeometryPrimitiveSpec[]{
 const out:GeometryPrimitiveSpec[]=[{type:'line',attrs:{x1:10,y1:50,x2:90,y2:50},semantic:'x-axis'},{type:'line',attrs:{x1:50,y1:90,x2:50,y2:10},semantic:'y-axis'}];
 for(let i=min;i<=max;i+=2){const x=50+(i/(max-min))*80*2;out.push({type:'line',attrs:{x1:x,y1:48.5,x2:x,y2:51.5},semantic:'tick'});}
 return out;
}
export function transformationDescription(t:Transform2D){
 const a:string[]=[];if(t.translateX||t.translateY)a.push(`translate (${t.translateX??0}, ${t.translateY??0})`);if(t.rotateDeg)a.push(`rotate ${t.rotateDeg}°`);if(t.scaleX!==undefined||t.scaleY!==undefined)a.push(`scale (${t.scaleX??1}, ${t.scaleY??1})`);if(t.reflectX)a.push('reflect across x-axis');if(t.reflectY)a.push('reflect across y-axis');return a.join(' → ')||'identity';
}
export function withCoordinatePlane(model:GeometryModel,t?:Transform2D):CoordinateScene{return{model,axes:coordinateAxes(),transformLabel:t?transformationDescription(t):undefined}}
