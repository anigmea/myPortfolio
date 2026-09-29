"use client";

import { useEffect, useMemo, useState } from "react";
import { getExperience } from "@/lib/experience";
import { getProjects } from "@/lib/projects";

type Regime = "steady" | "volatile" | "drawdown";
const scenarios: Record<Regime, { name: string; drift: number; amplitude: number; shock: number; note: string }> = {
  steady: { name: "Steady", drift: 0.47, amplitude: 2.4, shock: 0, note: "A smooth trend, not a forecast." },
  volatile: { name: "Volatile", drift: 0.34, amplitude: 7.4, shock: 2.5, note: "More dispersion, same starting point." },
  drawdown: { name: "Drawdown", drift: 0.31, amplitude: 4.2, shock: 19, note: "A shock, then a partial recovery." },
};
function makeSeries(regime: Regime, risk: number) {
  const s = scenarios[regime];
  return Array.from({ length: 65 }, (_, i) => {
    const wave = Math.sin(i * .71) * .58 + Math.sin(i * 1.89 + 1.4) * .28 + Math.sin(i * .17) * .8;
    const draw = regime === "drawdown" && i >= 30 ? s.shock * Math.exp(-(i - 30) / 24) : 0;
    return 100 + i * s.drift * risk + wave * s.amplitude * risk - draw * risk + (regime === "volatile" ? Math.sin(i * 2.5) * s.shock * risk : 0);
  });
}
const work = [
  { index: "01", title: "BASIS Terminal", category: "Quant research / Python", description: "A local research environment for market data, strategy signals, equity and options backtests, analytics and paper-trading records.", status: "PRIVATE RESEARCH SOFTWARE", link: null },
  { index: "02", title: "Monte Carlo Optimization", category: "Portfolio risk / Python", description: "A dashboard exploring value at risk and conditional value at risk through Monte Carlo portfolio simulations.", status: "PUBLIC REPOSITORY", link: "https://github.com/anigmea/monte_carlo" },
  { index: "03", title: "Fleet Attack", category: "Multi-agent learning / Research", description: "A research paper on agents learning to communicate in an adversarial grid world, combining actor–critic and other learning methods.", status: "PUBLIC PAPER", link: "/research/DSC190_Reinforcement_Learning.pdf" },
  { index: "04", title: "Offensive Gravity", category: "Sports analytics / Machine learning", description: "A basketball research project that models how shot profile and rim pressure affect floor spacing.", status: "PUBLIC PAPER", link: "/research/Eclipse%20Basketball.pdf" },
];
const archiveOrder = ["Cyclopath", "Rate My Recipe", "Frozen Lake Solver", "Tic Tac Toe Bot", "Ecommerce Platform - Clothing Brand", "Casino"];
const archive = archiveOrder.map(name => getProjects().find((p: { title: string }) => p.title === name)).filter(Boolean) as {title:string;description:string;link:string;subject:string}[];
const experience = getExperience() as { year:string;title:string;company:string;description:string }[];

const opening = [
  { from: "d2", to: "d4", label: "01 / d4" }, { from: "d7", to: "d5", label: "01 ... d5" },
  { from: "c2", to: "c4", label: "02 / c4" }, { from: "e7", to: "e6", label: "02 ... e6" },
  { from: "g1", to: "f3", label: "03 / Nf3" }, { from: "g8", to: "f6", label: "03 ... Nf6" },
  { from: "b1", to: "c3", label: "04 / Nc3" }, { from: "f8", to: "e7", label: "04 ... Be7" },
];
const pieceGlyph: Record<string,string> = { K:"♔",Q:"♕",R:"♖",B:"♗",N:"♘",P:"♙",k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟" };
function boardAt(moveCount: number) {
  const ranks = ["rnbqkbnr","pppppppp","........","........","........","........","PPPPPPPP","RNBQKBNR"];
  const board: Record<string,string> = {};
  ranks.forEach((rank, row) => [...rank].forEach((piece,col) => { if(piece !== ".") board[`${"abcdefgh"[col]}${8-row}`] = piece; }));
  opening.slice(0,moveCount).forEach(({from,to}) => { board[to]=board[from]; delete board[from]; });
  return board;
}
function StrategyStudy() {
  const [move, setMove] = useState(0);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer=window.setInterval(() => setMove(prev => (prev+1) % (opening.length+1)), 1900); return () => clearInterval(timer); }, []);
  const board = useMemo(() => boardAt(move), [move]);
  return <div className="strategy-study"><div className="strategy-copy"><span className="eyebrow">EXHIBIT 03 / CHESS</span><h3>Think in moves.<br/><em>Build in systems.</em></h3><p>A scripted opening, replayed step by step. Chess is a long-standing part of my life: I played at the Zonal level in India and in AICF competitions.</p><span className="study-foot">SCRIPTED SEQUENCE · NO ENGINE · NOT A LIVE GAME</span></div><div className="board-wrap"><div className="board-head"><span>POSITION / {String(move).padStart(2,"0")}</span><strong>{move===0 ? "Start position" : opening[move-1].label}</strong></div><div className="chessboard" role="img" aria-label={`Scripted chess opening, ${move === 0 ? "start position" : opening[move-1].label}`}>
    {Array.from({length:64},(_,i) => { const row=Math.floor(i/8),col=i%8,square=`${"abcdefgh"[col]}${8-row}`; return <span className={`square ${(row+col)%2===0?"light":"dark"} ${move>0 && opening[move-1].to===square?"last-move":""}`} key={square} aria-hidden="true">{board[square] && <span className={board[square]===board[square].toUpperCase()?"white-piece":"black-piece"}>{pieceGlyph[board[square]]}</span>}</span>; })}
  </div><div className="board-caption"><span>DETERMINISTIC / REPLAY</span><span>08 HALF-MOVES</span></div></div></div>;
}

function ResearchArtifact() {
  const [regime, setRegime] = useState<Regime>("steady");
  const [risk, setRisk] = useState(1);
  const values = useMemo(() => makeSeries(regime, risk), [regime, risk]);
  const plot = values.map((v, i) => `${(i / 64 * 600).toFixed(1)},${(190 - (v - 90) * 2).toFixed(1)}`).join(" ");
  const fill = `0,215 ${plot} 600,215`;
  const finish = values[values.length - 1];
  return <section className="artifact" aria-labelledby="artifact-title">
    <div className="artifact-top"><div><span className="eyebrow">EXHIBIT 01 / SCENARIO STUDY</span><h2 id="artifact-title">What changes when risk changes?</h2></div><span className="artifact-badge">MODELLED · NOT LIVE</span></div>
    <div className="artifact-plot"><div className="plot-head"><div><span className="plot-label">ILLUSTRATIVE INDEX</span><strong>{finish.toFixed(1)}</strong><small>starts at 100 · arbitrary units</small></div><span className="plot-trace">SIMULATION / 65 STEPS</span></div>
      <svg viewBox="0 0 600 230" role="img" aria-label={`Illustrative ${scenarios[regime].name.toLowerCase()} path from 100 to ${finish.toFixed(1)}. Not market data or an investment result.`} preserveAspectRatio="none">
        <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#256a65" stopOpacity=".22"/><stop offset="100%" stopColor="#256a65" stopOpacity="0"/></linearGradient></defs>
        {[35,90,145,200].map(y => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#dce5e2" strokeWidth="1" />)}
        <polygon points={fill} fill="url(#chart-fill)"/><polyline points={plot} fill="none" stroke="#185f5b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      </svg>
      <div className="plot-axis"><span>START / 100</span><span>SCENARIO END / {finish.toFixed(1)}</span></div>
    </div>
    <div className="artifact-controls"><div className="scenario-picker" aria-label="Scenario"><span className="control-label">MARKET REGIME</span><div className="scenario-buttons">{(Object.keys(scenarios) as Regime[]).map(key => <button type="button" key={key} aria-pressed={regime===key} onClick={() => setRegime(key)}>{scenarios[key].name}</button>)}</div></div><label className="risk-control"><span className="control-label">SENSITIVITY <b>{risk.toFixed(1)}×</b></span><input type="range" min="0.5" max="1.5" step="0.1" value={risk} onChange={e => setRisk(Number(e.target.value))} /></label></div>
    <p className="artifact-note">{scenarios[regime].note} Deterministic, invented data for interaction only. No market feed, backtest, return, or performance claim.</p>
  </section>;
}

export default function Home() {
  return <main>
    <div className="site-shell"><header className="nav"><a className="mark" href="#top" aria-label="Divyansh Kanodia, top of page">DK<span>.</span></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><a className="nav-link" href="/resume.pdf">Résumé <span aria-hidden="true">↗</span></a></header>
      <section className="hero" id="top"><div className="hero-copy"><span className="eyebrow"><span className="signal-dot"/> FINANCE × DATA SCIENCE</span><h1>Ideas become<br/><em>instruments.</em></h1><p className="positioning">I&apos;m Divyansh Kanodia. I build quantitative research tools and decision systems that make uncertain information easier to test.</p><div className="hero-actions"><a className="primary-button" href="#work">Explore the work <span>↗</span></a><a className="quiet-link" href="#about">Meet the person ↓</a></div><div className="hero-caption"><span>UC SAN DIEGO</span><span>DATA SCIENCE + BUSINESS ECONOMICS</span></div></div><ResearchArtifact /></section>
      <section className="data-tape" aria-label="Illustrative data processes, not live market quotes"><div className="tape-label">MODELLED SIGNALS <span>NOT MARKET QUOTES</span></div><div className="tape-window"><div className="tape-track">{[0,1].map(copy => <div className="tape-set" aria-hidden={copy === 1} key={copy}><span>VOLATILITY SCENARIO <b>+7.4</b></span><span>RESEARCH WINDOW <b>65 STEPS</b></span><span>BASE INDEX <b>100.0</b></span><span>SHOCK RECOVERY <b>24 STEPS</b></span><span>DATA SOURCE <b>SYNTHETIC</b></span><span>DK-01 <b>▲</b></span></div>)}</div></div></section>
      <section className="selected section-pad" id="work"><div className="section-intro"><div><span className="eyebrow">EXHIBIT 02 / SELECTED WORK</span><h2>Built to be used.<br/><em>Not just described.</em></h2></div><p>Research software, decision systems and experiments at the intersection of markets and models.</p></div><div className="project-grid">{work.map(p => <article className="project-card" key={p.title}><div className="project-meta"><span>{p.index} / {p.category}</span><span className="status">{p.status}</span></div><h3>{p.title}</h3><p>{p.description}</p>{p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer">Explore project ↗</a> : <span className="unavailable">Private project · details on request</span>}</article>)}</div>
      <details className="archive"><summary>Earlier work <span>Six projects ↗</span></summary><div className="archive-grid">{archive.map(p => <a href={p.link} key={p.title} target="_blank" rel="noopener noreferrer"><span>{p.subject}</span><strong>{p.title}</strong><small>View source or paper ↗</small></a>)}</div></details></section>
      <StrategyStudy />
      <aside className="poem-beat" aria-label="A line from my notebook"><span className="eyebrow">FROM MY NOTEBOOK / हिन्दी</span><blockquote lang="hi">टूटा हूँ पर झुका नहीं<br/>जला हूँ पर बुझा नहीं</blockquote><p>Broken but not bowed, burnt but not extinguished.</p></aside>
      <section className="about section-pad" id="about"><div className="about-lead"><span className="eyebrow">EXHIBIT 04 / ABOUT</span><h2>The person behind<br/><em>the systems.</em></h2><p>I study data science and business economics at UC San Diego. My work spans financial modeling, applied machine learning and systems that turn analysis into a decision someone can inspect. More ideas than time, but I like getting them into working form.</p><div className="human-notes"><p><span>DATA HACKS 2026</span>Second place in the AI/ML track and second place in the Solana track. The AI/ML track was the most competitive.</p><p><span>OTHER HONORS</span>Second place, ICG × UCI fraternity stock pitch competition. Provost honors at UC San Diego; 3.83 GPA. Best Speaker, IIT Delhi debutant parliamentary debate competition, April 2022.</p><p><span>CHESS & ARGUMENT</span>Zonal-level chess in India and AICF competitions. Parliamentary debate and Model UN at national and international levels.</p><p><span>OFF THE CLOCK</span>Poetry for fun. Long stretches alone in nature, then meeting new people and hearing their stories. Travel when the budget allows and a serious interest in good food.</p><p><span>LANGUAGES</span>English and Hindi.</p><p><span>ON REPEAT</span>Bollywood, house, pop and metal. Learning a DJ controller. Always a film or series in the queue. My reading has ranged from Geronimo Stilton to Feynman. I collect stray facts about history and physics along the way.</p></div><a className="quiet-link" href="/resume.pdf">Read the résumé ↗</a></div><div className="experience"><span className="eyebrow">SELECTED EXPERIENCE</span>{experience.slice(0,5).map(e => <div className="experience-row" key={e.company}><div><strong>{e.title}</strong><span>{e.company}</span></div><small>{e.year}</small></div>)}</div></section>
      <footer id="contact"><div><span className="eyebrow">CONTACT</span><h2>Let&apos;s make the<br/><em>numbers useful.</em></h2></div><div className="footer-links"><a href="https://github.com/anigmea" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/divyansh-kanodia/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="/resume.pdf">Résumé ↗</a></div><div className="footer-base"><span>DIVYANSH KANODIA</span><span>FINANCE / DATA SCIENCE / SYSTEMS · NOT INVESTMENT ADVICE.</span></div></footer>
    </div>
  </main>;
}
