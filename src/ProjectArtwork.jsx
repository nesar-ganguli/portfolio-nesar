import React from "react";

const route = "M52 144L120 110L172 124L220 62L286 92L338 40L390 66L456 32";

export function ProjectArtwork({ title }) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (title === "ClipDial") {
    return <div className="clip-art artwork">
      <div className="clip-window"><div className="clip-title"><span className="window-dots"><i /><i /><i /></span><span>ClipDial</span><span>0–9</span></div>
        <div className="clip-slots">{["GitHub", "LinkedIn", "Portfolio", "Email"].map((label, i) => <div className={`clip-slot slot-${i}`} key={label}><span className="slot-number">0{i}</span><span>{label}</span><span className="slot-shortcut">⌘ {i}</span></div>)}</div>
        <div className="clip-footer"><span>Saved once.</span><span>Always ready.</span></div>
      </div><div className="floating-key">⌘ <span>2</span></div>
    </div>;
  }
  if (title === "BugSignal AI") {
    return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
      <path d="M172 72L270 120L165 172M270 120L382 56M270 120L398 173" className="art-line" />
      {[{x:140,y:70},{x:155,y:175},{x:390,y:58},{x:404,y:174}].map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="37" className="cluster-boundary" />{Array.from({length:7},(_,j)=><circle key={j} cx={p.x+Math.cos(j*2.4)* (12+j)} cy={p.y+Math.sin(j*2.4)*(12+j)} r="3" className="cluster-point" style={{animationDelay:`${j*0.16}s`}} />)}</g>)}
      <rect x="222" y="100" width="96" height="40" rx="6" className="art-node" /><text x="270" y="125" textAnchor="middle" className="art-text">Root cause</text>
      <text x="260" y="226" textAnchor="middle" className="art-label">SIGNALS → CLUSTERS → EVIDENCE</text>
    </svg>;
  }
  if (title === "Bloomington Transit") {
    return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
      {Array.from({length:7},(_,i)=><path key={i} d={`M${50+i*70} 12L${20+i*70} 208M25 ${20+i*30}H495`} className="map-street" />)}
      <path d={route} className="transit-route" />
      {[{x:52,y:144},{x:172,y:124},{x:286,y:92},{x:390,y:66}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="5" className="route-stop" />)}
      <circle cx={reduceMotion ? 52 : 0} cy={reduceMotion ? 144 : 0} r="8" className="route-bus">{!reduceMotion && <animateMotion dur="9s" repeatCount="indefinite" path={route} />}</circle>
      <text x="40" y="228" className="art-label">BLOOMINGTON / LIVE POSITIONS</text>
    </svg>;
  }
  if (title.includes("Formula 1")) {
    return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
      <path d="M125 148C85 132 95 80 145 60L232 40C288 26 339 35 369 65L408 90C433 114 388 129 347 129L274 129L246 176C223 211 188 196 172 179Z" className="circuit-track" />
      <path d="M125 148C85 132 95 80 145 60L232 40C288 26 339 35 369 65L408 90C433 114 388 129 347 129L274 129L246 176C223 211 188 196 172 179Z" className="circuit-car" />
      <text x="270" y="95" textAnchor="middle" className="art-label">LAP / SEASON / CIRCUIT</text><text x="270" y="119" textAnchor="middle" className="art-text">Formula 1</text>
    </svg>;
  }
  if (title === "ClinSight AI") {
    return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
      <path d="M50 120H468" className="art-line" />
      {["Patient", "Observation", "Medication", "Evidence"].map((label,i)=><g key={label} className="clinical-event" style={{animationDelay:`${i*0.4}s`}}><circle cx={80+i*120} cy="120" r="7" className="route-stop" /><path d={`M${80+i*120} 120V${i%2?166:74}`} className="art-line" /><rect x={30+i*120} y={i%2?162:38} width="100" height="36" rx="5" className="art-node" /><text x={80+i*120} y={i%2?185:61} textAnchor="middle" className="art-text">{label}</text></g>)}
      <text x="260" y="226" textAnchor="middle" className="art-label">A LONGITUDINAL, SOURCE-CITED CHART</text>
    </svg>;
  }
  if (title === "CampusHub") {
    return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
      {[0,1,2].map(i=><g key={i} className="resource-sheet" style={{animationDelay:`${i*0.25}s`}}><rect x={70+i*130} y={36+i*12} width="108" height="132" rx="6" className="art-node" /><path d={`M${86+i*130} ${72+i*12}h70m-70 18h52m-52 18h62m-62 18h36`} className="art-line" /><rect x={86+i*130} y={144+i*12} width="42" height="4" rx="2" className="cluster-point" /></g>)}
      <text x="260" y="226" textAnchor="middle" className="art-label">KNOWLEDGE / SUMMARIES / ANSWERS</text>
    </svg>;
  }
  return <svg className="artwork" viewBox="0 0 520 240" aria-hidden="true">
    {[0,1,2,3].map(i=><path key={i} d={`M40 ${45+i*40}H480`} className="map-street" />)}
    {[46,70,56,102,82,128,96,150,122,172,154,184].map((height,i)=><rect key={i} x={48+i*36} y={205-height} width="16" height={height} rx="3" className="chart-bar" style={{animationDelay:`${i*0.09}s`}} />)}
    <path d="M54 170L95 156L126 164L166 112L204 129L241 76L277 98L314 52L350 79L388 38L422 56L459 23" className="chart-line" />
    <text x="40" y="230" className="art-label">{title.includes("Ecommerce")?"EVENTS → WINDOWS → ANALYTICS":"RIDERSHIP / ROUTES / REPORTING"}</text>
  </svg>;
}
