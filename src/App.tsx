import{useState}from'react';import{analyzeQuestion,ProblemAnalysis}from'./problem/analyzer';

const sample='A 5 kg box is pushed up a 30° incline with a force of 80 N. Find the acceleration of the box. Assume no friction.';
function Section({title,tone,children}:{title:string;tone:string;children:React.ReactNode}){return <section><h2 className={'marker '+tone}>{title}</h2>{children}</section>}
export default function App(){
 const[q,setQ]=useState(sample);const[result,setResult]=useState<ProblemAnalysis|null>(null);
 const run=()=>setResult(analyzeQuestion(q));
 return <div className="appShell">
   <header className="questionComposer">
    <div className="composerTop"><div><span className="eyebrow">STEM TUTOR</span><h1>What are you working on?</h1></div><span className="stepPill">Step 1 · Understand</span></div>
    <div className="inputCard"><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Type or paste your STEM question…"/><div className="inputFooter"><span>We’ll organize the question before solving it.</span><button className="analyze" onClick={run}>Analyze <span>→</span></button></div></div>
   </header>
   <main className="paper">
    <div className="paperQuestion"><span className="marker yellow">Question:</span><p>{q||'Your question will appear here.'}</p></div>
    <div className="work">
     <div className="left">
      <Section title="Given:" tone="blue">{result?<ul>{result.givens.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">Values from the question appear here.</p>}</Section>
      <Section title="Find:" tone="green">{result?<ul>{result.find.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">What needs to be found appears here.</p>}</Section>
     </div>
     <div className="right">
      <Section title="Conditions:" tone="purple">{result?<ul>{result.conditions.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">Important conditions appear here.</p>}</Section>
      <Section title="Objects:" tone="orange">{result?<ul>{result.objects.map((x,i)=><li key={i}>{x}</li>)}</ul>:<p className="hint">Objects in the problem appear here.</p>}</Section>
     </div>
    </div>
    <div className="status">{result&&<span>Question understood · ready for the next step</span>}</div>
   </main>
 </div>
}