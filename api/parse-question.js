import OpenAI from 'openai';

const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const schema={
 type:'object',additionalProperties:false,
 properties:{
  subject:{type:'string',enum:['geometry']},
  shape:{type:['string','null']},
  givens:{type:'object',additionalProperties:{type:'number'}},
  units:{type:'object',additionalProperties:{type:'string'}},
  target:{type:['string','null']},
  constraints:{type:'array',items:{type:'string'}},
  keywords:{type:'array',items:{type:'string'}},
  confidence:{type:'number',minimum:0,maximum:1}
 },
 required:['subject','shape','givens','units','target','constraints','keywords','confidence']
};

export default async function handler(req,res){
 const allowed=process.env.ALLOWED_ORIGIN||'https://fa1991.github.io';const origin=String(req.headers?.origin||'');if(origin&&origin!==allowed)return res.status(403).json({error:'Origin not allowed'});res.setHeader('Access-Control-Allow-Origin',allowed);res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 const question=String(req.body?.question||'').trim();
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'AI reader is not configured.'});
 if(!question||question.length>2000)return res.status(400).json({error:'A geometry question is required.'});
 try{
  const response=await client.responses.create({
   model:process.env.OPENAI_PARSER_MODEL||'gpt-6-luna',
   instructions:`You are the input reader for a deterministic geometry tutor. READ ONLY. Never solve, calculate, choose a numeric answer, or invent a missing measurement. Convert the student's wording into semantic geometry data. Givens keys should use canonical symbols when clear: r radius, d diameter, b base, h height, l length, w width, s side, c hypotenuse, theta central/known angle, n polygon side count, angle1/angle2 for multiple triangle angles. Target should be canonical, e.g. area, perimeter, circumference, volume, arc-length, sector-area, missing-angle, shortest-side, surface-area. Preserve explicit constraints such as regular, right, tangent, parallel, perpendicular, 30-60-90. keywords should contain useful wording/aliases from the question that a future deterministic parser can learn. Confidence reflects interpretation confidence, not answer confidence.`,
   input:question,
   text:{format:{type:'json_schema',name:'geometry_question',strict:true,schema}}
  });
  const parsed=JSON.parse(response.output_text);
  return res.status(200).json({analysis:parsed,reader:'ai'});
 }catch(error){
  console.error(error);
  return res.status(500).json({error:'AI question reader failed.'});
 }
}
