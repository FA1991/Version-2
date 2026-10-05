import OpenAI from 'openai';

const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const schema={
 type:'object',additionalProperties:false,
 properties:{
  subject:{type:'string',enum:['geometry']},
  topic:{anyOf:[{type:'null'},{type:'string',enum:['circle','semicircle','rectangle','square','parallelogram','trapezoid','rhombus','kite','triangle','right triangle','equilateral triangle','isosceles triangle','regular polygon','pentagon','hexagon','heptagon','octagon','nonagon','decagon','undecagon','dodecagon','tridecagon','tetradecagon','pentadecagon','hexadecagon','heptadecagon','octadecagon','enneadecagon','icosagon','cube','rectangular prism','triangular prism','pyramid','cylinder','cone','sphere','rectilinear figure']}]},
  givens:{type:'array',items:{type:'object',additionalProperties:false,properties:{symbol:{type:'string',enum:['r','d','b','h','l','w','s','a','c','sl','d1','d2','ap','P','B','m','theta','angle1','angle2','n','A','V','C','SA','LA']},value:{type:'number'},unit:{type:['string','null']},meaning:{type:'string'}},required:['symbol','value','unit','meaning']}},
  find:{anyOf:[{type:'null'},{type:'object',additionalProperties:false,properties:{symbol:{type:'string',enum:['A','P','C','V','r','d','d1','d2','SA','LA','L','c','a','b','B','h','l','w','s','sl','theta','S']},meaning:{type:'string'},unit:{type:['string','null']}},required:['symbol','meaning','unit']}]},
  constraints:{type:'array',items:{type:'string'}},
  constants:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},value:{type:'number'}},required:['name','value']}},
  keywords:{type:'array',items:{type:'string'}},
  confidence:{type:'number',minimum:0,maximum:1}
 },
 required:['subject','topic','givens','find','constraints','constants','keywords','confidence']
};

export default async function handler(req,res){
 const configured=process.env.ALLOWED_ORIGIN?.trim();const origin=String(req.headers?.origin||'');const sameHost=origin&&req.headers?.host&&new URL(origin).host===req.headers.host;const allowed=configured||origin;if(origin&&!sameHost&&configured&&origin!==configured)return res.status(403).json({error:'Origin not allowed'});if(allowed)res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const question=String(req.body?.question||'').trim();
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'AI reader is not configured.'});
 if(!question||question.length>2000)return res.status(400).json({error:'A geometry question is required.'});
 try{
  const response=await client.responses.create({
   model:process.env.OPENAI_PARSER_MODEL||'gpt-6-luna',
   instructions:`You are the input reader for a deterministic geometry tutor. READ ONLY. Never solve, calculate, choose a numeric answer, or invent a missing measurement. Convert the student's wording into semantic geometry data. Use only canonical topic names from the schema. Givens keys should use canonical symbols: r radius, d diameter, b base, B base area, h height, l length, w width, s side, a side/leg a, c hypotenuse, sl slant height, d1/d2 diagonals, ap apothem, m midsegment, P perimeter/base perimeter, A area, V volume, C circumference, SA surface area, LA lateral area, theta central/known angle, n polygon side count, angle1/angle2 for multiple triangle angles. The find object is the most important field: identify exactly what the student is asked to find, with canonical symbol, plain-English meaning, and requested unit if stated. Preserve explicitly supplied constants or approximations such as pi=22/7 in constants; never invent constants. Preserve explicit constraints such as regular, right, tangent, parallel, perpendicular, 30-60-90. If the question explicitly supplies a constant or approximation such as pi = 22/7 or pi = 3.14, record it in constants. Never invent constants. keywords should contain useful wording/aliases from the question that a future deterministic parser can learn. Confidence reflects interpretation confidence, not answer confidence.`,
   input:question,
   text:{format:{type:'json_schema',name:'geometry_question',strict:true,schema}}
  });
  const parsed=JSON.parse(response.output_text);const givens={};for(const item of parsed.givens)givens[item.symbol]={value:item.value,unit:item.unit||null,meaning:item.meaning};parsed.givens=givens;parsed.constants=Object.fromEntries(parsed.constants.map(x=>[x.name,x.value]));
  return res.status(200).json({problem:parsed,reader:'ai'});
 }catch(error){
  console.error(error);
  return res.status(500).json({error:'AI question reader failed.'});
 }
}
