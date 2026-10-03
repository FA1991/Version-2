import type{DiagramPlan,DiagramElement}from'../diagram/diagramPlanner';

export interface SvgRenderOptions{width?:number;height?:number;showGrid?:boolean;pencil?:boolean}
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const n=(v:unknown,d=0)=>typeof v==='number'?v:d;

function element(e:DiagramElement){
 const p=e.props,x=n(e.x),y=n(e.y);
 switch(e.type){
  case'ground':return `<line x1="${n(p.x1)}%" y1="${n(p.y1)}%" x2="${n(p.x2)}%" y2="${n(p.y2)}%" class="stem-line"/>`;
  case'ramp':return `<line x1="${n(p.x1)}%" y1="${n(p.y1)}%" x2="${n(p.x2)}%" y2="${n(p.y2)}%" class="stem-line heavy"/>`;
  case'box':return `<g><rect x="${x-7}%" y="${y-6}%" width="14%" height="12%" rx="2" class="stem-shape"/><text x="${x}%" y="${y+1}%" text-anchor="middle">${esc(p.label)}</text></g>`;
  case'ball':return `<circle cx="${x}%" cy="${y}%" r="${n(p.radius,3)}%" class="stem-shape ${p.state==='ghost'?'ghost':''}"/>`;
  case'arrow':return `<g><line x1="${n(p.fromX)}%" y1="${n(p.fromY)}%" x2="${n(p.toX)}%" y2="${n(p.toY)}%" class="stem-arrow ${esc(p.semantic)}" marker-end="url(#arrow)"/><text x="${(n(p.fromX)+n(p.toX))/2}%" y="${(n(p.fromY)+n(p.toY))/2-2}%" text-anchor="middle">${esc(p.label)}</text></g>`;
  case'angle':return `<text x="${n(p.x)}%" y="${n(p.y)}%">∠ ${esc(p.value)}${esc(p.unit)}</text>`;
  case'triangle':return `<polygon points="${n(p.ax)},${n(p.ay)} ${n(p.bx)},${n(p.by)} ${n(p.cx)},${n(p.cy)}" class="stem-shape normalized"/>`;
  case'circle':return `<circle cx="${x}%" cy="${y}%" r="${n(p.radius,20)}%" class="stem-shape"/>`;
  case'line':return p.kind==='parabolic-path'?`<path d="M ${n(p.x1)} ${n(p.y1)} Q 50 ${n(p.peakY)} ${n(p.x2)} ${n(p.y2)}" class="stem-line normalized ${p.dashed?'dashed':''}"/>`:`<line x1="${n(p.x1)}%" y1="${n(p.y1)}%" x2="${n(p.x2)}%" y2="${n(p.y2)}%" class="stem-line"/>`;
  case'label':return `<text x="${x}%" y="${y}%">${esc(p.text)}</text>`;
  default:return'';
 }
}

export function renderDiagramSvg(plan:DiagramPlan,options:SvgRenderOptions={}){
 const w=options.width??720,h=options.height??440;
 return `<svg viewBox="0 0 100 100" width="${w}" height="${h}" role="img" aria-label="${esc(plan.title)}" class="stem-svg">
 <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker><filter id="pencil"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".28"/></filter></defs>
 <style>.stem-svg{overflow:visible}.stem-svg text{font-family:"Patrick Hand","Comic Sans MS",cursive;font-size:4px;fill:#14264c}.stem-line,.stem-shape,.stem-arrow{fill:none;stroke:#14264c;stroke-width:.65;stroke-linecap:round;stroke-linejoin:round;${options.pencil!==false?'filter:url(#pencil);':''}}.heavy{stroke-width:1.2}.ghost{opacity:.3;stroke-dasharray:2 2}.dashed{stroke-dasharray:2 2}.normalized{vector-effect:non-scaling-stroke}.stem-arrow.applied-force{stroke:#26804a}.stem-arrow.gravity{stroke:#b33a3a}</style>
 ${plan.elements.map(element).join('')}</svg>`;
}