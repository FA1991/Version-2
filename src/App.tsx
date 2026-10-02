import{useState}from'react';import{analyzeQuestion,ProblemAnalysis}from'./problem/analyzer';

const sample='A 5 kg box is pushed up a 30° incline with a force of 80 N. Find the acceleration of the box. Assume no friction.';

function Section({title,tone,children}:{title:string;tone:string;children:React.ReactNode}){return <section><h2 className={'marker '+tone}>{title}</h2>{children}</section>}

export default function App(){
 const[q,setQ]=useState(sample);const[result,setResult]=useState<ProblemAnalysis|null>(null);
 const run=()=>setResult(analyzeQuestion(q));
 return <main className="paper">
   <div className="questionRow"><span className="marker yellow">Question:</span><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Type your STEM question here…"/></div>
   <button className="analyze" onClick={run}>Analyze Question</button>
   <div className="work">
    <div className="left">
      <Section title="Given:" tone="blue">{result?<ul>{result.givens.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">The values stated in the question will appear here.</p>}</Section>
      <Section title="Find:" tone="green">{result?<ul>{result.find.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">What the student needs to find will appear here.</p>}</Section>
    </div>
    <div className="right">
      <Section title="Conditions:" tone="purple">{result?<ul>{result.conditions.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">Conditions such as “no friction” will appear here.</p>}</Section>
      <Section title="Objects:" tone="orange">{result?<ul>{result.objects.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">Objects mentioned in the problem will appear here.</p>}</Section>
    </div>
   </div>
   <div className="status">{result&&<span>Step 1 complete — question structured. No solving yet.</span>}</div>
 </main>
}