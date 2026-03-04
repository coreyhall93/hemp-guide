import { useState, useRef, useEffect } from "react";

/* ─── FONTS ─── */
const G = "'Geist', sans-serif";
const GM = "'Geist Mono', monospace";
const LINK = "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap";

/* ─── SECTIONS ─── */
const SECS = [
  { id: "home", l: "Home" }, { id: "basics", l: "Basics" }, { id: "compounds", l: "Compounds" },
  { id: "builder", l: "Builder" }, { id: "products", l: "Products" }, { id: "safety", l: "Safety" },
  { id: "compare", l: "Comparison" }, { id: "legal", l: "Legal" }, { id: "faq", l: "FAQ" }, { id: "glossary", l: "Glossary" },
];

/* ─── COMPOUNDS ─── */
const CMP = [
  { id:"thc", ab:"THC", full:"Delta-9 Tetrahydrocannabinol", tag:"The psychoactive one.", icon:"\u{1F300}", col:"#22C55E", bg:"#F0FDF4", psy:true, dt:true, add:"Very low at 5mg",
    one:"Creates euphoria, relaxation, and altered perception. The only compound here that produces a traditional \"high.\"",
    feel:{ low:"2\u20135mg: Gentle social ease. Less inhibition, mild warmth. Still fully yourself, just with the volume on anxiety turned down.", med:"5\u201310mg: Noticeable shift. Time may feel slower. Heightened senses. Playfulness. Some mental fog or difficulty finding words.", hi:"10\u201325mg: Strong effects. Couch-lock, significant appetite increase, impaired short-term memory, potential anxiety." },
    body:"Binds directly to CB1 receptors in the brain. Creates dopamine release. Affects hippocampus (memory), amygdala (fear/anxiety), and prefrontal cortex (decision-making).",
    risk:"Mild psychological habituation possible at high daily doses (20mg+). No physical withdrawal. No recorded fatal overdose in human history. Side effects at low doses: dry mouth, mild appetite increase, occasional mental fog.",
    cmp:"5mg THC is to a marijuana joint what a sip of wine is to a bottle. Same compound, completely different experience.",
    fx:{euphoria:4,relaxation:4,focus:2,energy:2,sleep:3,pain:3,social:4,clarity:2},
    stack:"The foundation for social ease. Other compounds modify how this one feels." },
  { id:"cbd", ab:"CBD", full:"Cannabidiol", tag:"The calming one. No high.", icon:"\u{1F9CA}", col:"#3B82F6", bg:"#EFF6FF", psy:false, dt:false, add:"None",
    one:"Reduces tension, quiets the mind, relaxes muscles. Sold at every pharmacy in America. Does not alter perception or thinking.",
    feel:{ low:"10\u201325mg: Subtle. Slightly less tension than usual. Easy to miss if not paying attention.", med:"25\u201350mg: Noticeable calm. Physical tension releasing. Mind quieter. Like a long exhale that continues.", hi:"50\u2013100mg: Significant muscle relaxation. Speech may slow slightly. Strong physical ease. Some drowsiness." },
    body:"Works indirectly on the endocannabinoid system. Activates serotonin receptors (mood), TRPV1 receptors (pain/inflammation). Does not bind to CB1 receptors (why it doesn't get you high).",
    risk:"No addiction potential. No psychoactive effects. Can cause drowsiness at higher doses. Interacts with some medications via liver enzymes (CYP450), similar to grapefruit.",
    cmp:"Taking CBD is like taking melatonin or drinking chamomile tea. A plant compound that promotes relaxation from a plant that carries more stigma than chamomile.",
    fx:{euphoria:0,relaxation:5,focus:2,energy:1,sleep:3,pain:4,social:1,clarity:3},
    stack:"Softens THC's edges. Prevents paranoia, smooths the experience. More CBD relative to THC means gentler, more body-focused." },
  { id:"cbg", ab:"CBG", full:"Cannabigerol", tag:"The focus one. No high.", icon:"\u{1F3AF}", col:"#A855F7", bg:"#FAF5FF", psy:false, dt:false, add:"None",
    one:"Promotes calm alertness and mental clarity. CBD's sharper cousin. Called the \"mother cannabinoid\" because all others derive from it.",
    feel:{ low:"1\u20135mg: Very subtle. Minimal standalone effect.", med:"10\u201320mg: Calm focus. Alert but not wired. Like the headspace after a good workout.", hi:"20\u201340mg: Pronounced clarity. Stress reduction without sedation. Often compared to L-theanine." },
    body:"Interacts with both CB1 and CB2 receptors without activating them like THC. Affects GABA uptake. Being studied for neuroprotective properties.",
    risk:"No addiction potential. No psychoactive effects. Research early, no significant side effects identified. Does not trigger drug tests.",
    cmp:"CBG is to CBD what espresso is to chamomile. Both calming, but CBG keeps you sharp where CBD might make you drowsy.",
    fx:{euphoria:0,relaxation:3,focus:5,energy:3,sleep:1,pain:2,social:2,clarity:5},
    stack:"Paired with THC, CBG reduces mental fog while preserving social ease. Higher CBG = clearer thinking." },
  { id:"cbc", ab:"CBC", full:"Cannabichromene", tag:"The mood lift. No high.", icon:"\u2600\uFE0F", col:"#F97316", bg:"#FFF7ED", psy:false, dt:false, add:"None",
    one:"Subtle mood elevation that works in the background. Helps other cannabinoids function better. Like salt in a recipe.",
    feel:{ low:"1\u20132mg: Not individually noticeable. Contributes to overall formula character.", med:"5\u201310mg: May add a brighter baseline. Research limited on standalone effects.", hi:"10mg+: Limited consumer data. Mostly a supporting ingredient." },
    body:"Activates TRPV1 and TRPA1 receptors (pain). May increase natural endocannabinoids by blocking their breakdown.",
    risk:"No addiction potential. No psychoactive effects. No significant side effects. Does not trigger drug tests.",
    cmp:"Like B-vitamins in a multivitamin. Small amounts supporting overall function, not producing a standalone sensation.",
    fx:{euphoria:1,relaxation:2,focus:2,energy:3,sleep:1,pain:2,social:2,clarity:2},
    stack:"Nudges THC slightly warmer and more upbeat. Adds a subtle sunny quality." },
  { id:"cbn", ab:"CBN", full:"Cannabinol", tag:"The sleepy one. Mildly psychoactive.", icon:"\u{1F319}", col:"#6366F1", bg:"#EEF2FF", psy:true, dt:true, add:"Very low",
    one:"What happens when THC ages. Primarily promotes drowsiness and sleep. A natural sleep aid from the cannabis plant.",
    feel:{ low:"1\u20132mg: Mild drowsiness layered on other compounds.", med:"5mg: Noticeable sedation. Heavy eyelids. Similar to melatonin or Benadryl.", hi:"10mg+: Strong sedation. Falling asleep very likely. Strictly for sleep." },
    body:"Binds weakly to CB1 receptors (mildly psychoactive). Strong CB2 affinity (immune/inflammation). Promotes muscle relaxation and sedation.",
    risk:"Mildly psychoactive. Causes drowsiness (intended). Can trigger drug tests. No significant addiction risk. Do not drive.",
    cmp:"Functionally similar to melatonin or Benadryl. Promotes sleep without being a traditional sedative.",
    fx:{euphoria:1,relaxation:5,focus:0,energy:0,sleep:5,pain:3,social:0,clarity:0},
    stack:"Pushes any formula toward sedation. Counterproductive for social situations or anything requiring alertness." },
  { id:"thcv", ab:"THCv", full:"Tetrahydrocannabivarin", tag:"The energizer. Mildly psychoactive.", icon:"\u26A1", col:"#06B6D4", bg:"#ECFEFF", psy:true, dt:true, add:"Very low",
    one:"THC's lighter, energizing relative. Brief, clear-headed uplift. Suppresses appetite instead of increasing it.",
    feel:{ low:"2\u20135mg: Subtle sharpening. Moderates THC's effects rather than adding its own. Reduces fog.", med:"5\u201310mg: Mild clear-headed energy. Appetite suppression. Light espresso buzz without jitters.", hi:"10mg+: Pronounced energy. Brief euphoria. Noticeable appetite suppression." },
    body:"At low doses, blocks CB1 receptors (opposing THC). At higher doses, activates them differently. Shorter duration. Affects energy metabolism.",
    risk:"Can trigger drug tests. Shorter-lasting (~half THC duration). Research early. No significant addiction risk.",
    cmp:"If THC is a beer, THCv is an espresso with a tiny splash of something extra. Energizing, brief, clarity-promoting.",
    fx:{euphoria:2,relaxation:1,focus:4,energy:5,sleep:0,pain:1,social:3,clarity:4},
    stack:"Counteracts THC's sedating and fog-producing tendencies. Adds energy and appetite suppression." },
];

const EFX = {
  euphoria:{l:"Euphoria",i:"\u2728"}, relaxation:{l:"Relaxation",i:"\u{1F9D8}"}, focus:{l:"Focus",i:"\u{1F3AF}"},
  energy:{l:"Energy",i:"\u26A1"}, sleep:{l:"Sleep",i:"\u{1F319}"}, pain:{l:"Pain Relief",i:"\u{1F486}"},
  social:{l:"Social Ease",i:"\u{1F4AC}"}, clarity:{l:"Clarity",i:"\u{1F48E}"},
};

const PRODS = [
  { b:"Five", n:"Sativa Surge", ic:"\u{1F7E2}", f:"10mg THC \u00B7 10mg CBD \u00B7 2mg CBC", h:"5mg THC \u00B7 5mg CBD \u00B7 1mg CBC", p:"Social ease with subtle mood lift", best:"Social events, rehearsals, group hangouts", not:"Sleep, focus work", cc:["thc","cbd","cbc"] },
  { b:"Five", n:"Hybrid Vibes", ic:"\u{1F535}", f:"10mg THC \u00B7 10mg CBD \u00B7 2mg CBG", h:"5mg THC \u00B7 5mg CBD \u00B7 1mg CBG", p:"Social ease with mental clarity", best:"Situations needing both relaxation and clear thinking", not:"Sleep, deep physical relaxation", cc:["thc","cbd","cbg"] },
  { b:"Five", n:"Indica Chill", ic:"\u{1F7E3}", f:"10mg THC \u00B7 10mg CBD \u00B7 2mg CBN", h:"5mg THC \u00B7 5mg CBD \u00B7 1mg CBN", p:"Deep relaxation and sleep", best:"Evening wind-down, sleep, recovery", not:"Social events, driving, alertness", cc:["thc","cbd","cbn"] },
  { b:"Society's Plant", n:"High Energy Microdose", ic:"\u26A1", f:"5mg THC \u00B7 20mg CBG \u00B7 5mg THCv", h:"Already at 5mg THC (no cutting)", p:"Social ease with energy and sharp clarity", best:"Performances, events requiring verbal sharpness", not:"Sleep, relaxation", cc:["thc","cbg","thcv"] },
  { b:"Society's Plant", n:"Passion CBD", ic:"\u{1FA75}", f:"50mg CBD \u00B7 1.5mg THC \u00B7 1.5mg CBC", h:"Full gummy (sub-threshold THC, no high)", p:"Deep physical relaxation, zero intoxication", best:"Muscle tension, stress, evenings", not:"Social disinhibition", cc:["cbd","cbc"] },
  { b:"Society's Plant", n:"Good Day Focus", ic:"\u{1F3AF}", f:"40mg CBD \u00B7 20mg CBG \u00B7 1mg THC", h:"Full gummy (sub-threshold THC, no high)", p:"Calm clarity, zero intoxication", best:"Work focus, daytime calm, meetings", not:"Social disinhibition, sleep", cc:["cbd","cbg"] },
];

const FAQS = [
  { q:"Is this the same as smoking weed?", a:"No. Smoking marijuana delivers 50\u2013100mg+ of THC through combustion. These gummies contain 5\u201310mg in edible form. No smoke, no combustion, no lung exposure. It's like comparing chewing a coffee bean to drinking ten shots of espresso." },
  { q:"Can someone become addicted?", a:"Cannabis does not create physical dependence the way alcohol, opioids, or nicotine do. No physical withdrawal. At high daily doses (20mg+), some develop mild psychological habituation. At 5mg a few times per week, addiction is not a medically realistic concern. Caffeine creates stronger dependence." },
  { q:"Will this change someone's personality?", a:"No. At 5mg, THC reduces social anxiety and increases playfulness. It lowers a barrier. Some people are funnier after morning coffee. The coffee didn't change their personality. It reduced fatigue that was in the way." },
  { q:"Could something bad happen?", a:"The risk at 5mg is extremely low. Zero recorded fatal THC overdoses in human history. Worst realistic outcome: feeling foggy or anxious for 2\u20134 hours. Comparable to the side effect risk of two Advil. Alcohol kills ~178,000 Americans per year. Cannabis deaths from the compound itself: zero." },
  { q:"Is this a gateway to harder drugs?", a:"The \"gateway\" theory is not supported by modern research. The National Institute on Drug Abuse notes most cannabis users do not progress to harder substances. A precisely dosed legal supplement is not the same as adolescent recreational experimentation." },
  { q:"What if someone takes too much?", a:"A full gummy (10mg) instead of a half (5mg) would mean more fog, possible anxiety, and heavy relaxation for 3\u20136 hours. Uncomfortable, not dangerous. Someone might fall asleep. No dose of consumer gummies would cause a medical emergency." },
  { q:"Is this legal?", a:"Yes. Hemp-derived, under 0.3% THC by weight, meeting the 2018 Farm Bill threshold signed by President Trump. Federally legal in all 50 states. Legal in South Carolina. Sold openly. Not controlled substances." },
  { q:"Will it show on a drug test?", a:"Products with THC (even 5mg) will trigger a positive test. Tests detect metabolites, not impairment. CBD-only and CBG-only products with zero THC will not." },
  { q:"Is it safe to drive?", a:"No one should drive while feeling THC effects (~3\u20134 hours). Plan ahead, same as after a glass of wine. CBD-only products do not impair driving." },
  { q:"How is this different from street drugs?", a:"Manufactured in licensed FDA-registered facilities. Third-party lab tested. Sold legally with Certificates of Analysis for every batch. Packaged and dosed like any supplement. Fundamentally different from unregulated substances." },
  { q:"What if I wanted to try something?", a:"Gentlest entry: a CBD-only gummy (25\u201350mg CBD, zero THC). No psychoactive effect. Physical tension releasing, quieter mind, relaxation. No high, no impairment. Same thing sold at wellness stores for stress and sleep. Zero pressure to try anything, ever." },
  { q:"Does CBD interact with medications?", a:"CBD can interact with some medications through liver enzymes (CYP450), the same pathway affected by grapefruit. Anyone on prescriptions should mention CBD to their doctor. Standard drug interaction concern, not unique to cannabis." },
];

const GLOS = [
  { t:"Cannabis", d:"The plant genus. Includes hemp and marijuana." },
  { t:"Hemp", d:"Cannabis under 0.3% THC. Federally legal since 2018." },
  { t:"Marijuana", d:"Cannabis over 0.3% THC. Federally illegal." },
  { t:"Cannabinoid", d:"A compound from the cannabis plant that interacts with the body's endocannabinoid system." },
  { t:"Endocannabinoid System", d:"Biological system in every human body regulating mood, sleep, appetite, pain, immunity. Your body produces its own cannabinoids." },
  { t:"Psychoactive", d:"Alters brain function. Coffee, alcohol, and THC are all psychoactive." },
  { t:"Full Spectrum", d:"Contains all naturally occurring plant compounds, including trace THC." },
  { t:"Isolate", d:"A single purified compound. CBD isolate = pure CBD." },
  { t:"Entourage Effect", d:"Cannabinoids working better together than alone." },
  { t:"Milligram (mg)", d:"Dosing unit. 5mg = low. 10mg = standard. 25mg+ = high." },
  { t:"COA", d:"Certificate of Analysis. Independent lab report verifying contents and purity." },
  { t:"Edible", d:"Cannabis product consumed by eating. Takes 45\u201390 min to work." },
  { t:"Onset", d:"Time until effects begin. Edibles: 45\u201390 minutes." },
  { t:"Duration", d:"How long effects last. Edibles: 3\u20136 hours." },
  { t:"Tolerance", d:"Needing more over time. THC builds mild tolerance. CBD generally doesn't." },
  { t:"Farm Bill (2018)", d:"Federal law legalizing hemp under 0.3% THC. Signed by President Trump." },
  { t:"CB1 / CB2", d:"Endocannabinoid receptors. CB1 = brain. CB2 = immune system and body." },
];

/* ─── PRIMITIVES ─── */
const Bar = ({v,col="#3B82F6",h=4}) => <div style={{display:"flex",gap:3}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:22,height:h,borderRadius:h,background:i<v?col:"#E5E7EB",transition:"all .35s ease"}}/>)}</div>;
const Pill = ({children,bg="#F4F4F5",c="#71717A"}) => <span style={{fontFamily:GM,fontSize:10,fontWeight:600,display:"inline-flex",padding:"3px 9px",borderRadius:99,background:bg,color:c,letterSpacing:.3}}>{children}</span>;
const Card = ({children,s={}}) => <div style={{background:"#fff",borderRadius:16,padding:22,border:"1px solid #F4F4F5",boxShadow:"0 1px 2px rgba(0,0,0,.03)",marginBottom:12,...s}}>{children}</div>;
const Info = ({children,t="info"}) => {const s={info:{bg:"#FAFAFA",bc:"#E4E4E7",c:"#3F3F46"},safe:{bg:"#F0FDF4",bc:"#BBF7D0",c:"#166534"},warn:{bg:"#FFFBEB",bc:"#FDE68A",c:"#92400E"}}[t]; return <div style={{background:s.bg,border:`1px solid ${s.bc}`,borderRadius:14,padding:18,marginBottom:12,fontFamily:G,fontSize:14,lineHeight:1.65,color:s.c}}>{children}</div>;};

/* ─── PRESETS ─── */
const PRESETS = [
  { l:"Social + Warm", c:["thc","cbd","cbc"], d:"Relaxed, playful, slightly upbeat" },
  { l:"Social + Clear", c:["thc","cbd","cbg"], d:"Relaxed and present with mental sharpness" },
  { l:"Social + Energized", c:["thc","cbg","thcv"], d:"Confident, articulate, energized" },
  { l:"Deep Sleep", c:["thc","cbd","cbn"], d:"Heavy relaxation, drowsiness, sleep" },
  { l:"Body Calm (no high)", c:["cbd","cbg"], d:"Physical relaxation + mental clarity" },
  { l:"Full Relaxation (no high)", c:["cbd","cbc"], d:"Tension release, gentle mood lift" },
];

/* ─── APP ─── */
export default function App() {
  const [sec, setSec] = useState("home");
  const [oc, setOc] = useState(null);
  const [oq, setOq] = useState(null);
  const [sel, setSel] = useState([]);
  const [q, setQ] = useState("");
  const [nav, setNav] = useState(false);
  const ref = useRef(null);
  const go = id => { setSec(id); setQ(""); setOc(null); setOq(null); setTimeout(()=>ref.current?.scrollTo({top:0,behavior:"smooth"}),50); };
  const tog = id => setSel(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const blend = {};
  Object.keys(EFX).forEach(k => {
    if(!sel.length){blend[k]=0;return;}
    const v=sel.map(id=>CMP.find(c=>c.id===id).fx[k]);
    blend[k]=Math.round(Math.min(5,v.reduce((a,b)=>a+b,0)/v.length+(v.length>1?.5:0)));
  });
  const anyP=sel.some(id=>CMP.find(c=>c.id===id).psy);
  const anyD=sel.some(id=>CMP.find(c=>c.id===id).dt);
  const fF=q?FAQS.filter(f=>f.q.toLowerCase().includes(q.toLowerCase())||f.a.toLowerCase().includes(q.toLowerCase())):FAQS;
  const fG=q?GLOS.filter(g=>g.t.toLowerCase().includes(q.toLowerCase())||g.d.toLowerCase().includes(q.toLowerCase())):GLOS;

  const S = { // style tokens
    hero:{fontFamily:G,fontSize:36,fontWeight:800,letterSpacing:"-.03em",lineHeight:1.08,color:"#09090B"},
    h1:{fontFamily:G,fontSize:28,fontWeight:700,letterSpacing:"-.02em",lineHeight:1.12,color:"#09090B"},
    h2:{fontFamily:G,fontSize:20,fontWeight:600,letterSpacing:"-.01em",lineHeight:1.25,color:"#09090B"},
    h3:{fontFamily:G,fontSize:15,fontWeight:600,color:"#09090B"},
    body:{fontFamily:G,fontSize:15,fontWeight:400,lineHeight:1.65,color:"#3F3F46"},
    cap:{fontFamily:G,fontSize:12,fontWeight:500,color:"#A1A1AA"},
    mono:{fontFamily:GM,fontSize:11,fontWeight:500,letterSpacing:".02em"},
  };

  const R = () => { switch(sec){
    case "home": return <>
      <div style={{textAlign:"center",padding:"40px 0 28px"}}>
        <div style={{fontSize:52,marginBottom:18}}>{"\u{1F33F}"}</div>
        <h1 style={{...S.hero,margin:"0 0 14px"}}>Hemp Gummies,<br/>Explained.</h1>
        <p style={{...S.body,color:"#A1A1AA",maxWidth:360,margin:"0 auto",fontSize:16,lineHeight:1.55}}>A straightforward guide to what they are, what each compound does, and what the research says about safety.</p>
      </div>
      <Card s={{background:"#FAFAFA",border:"none"}}>
        <p style={{...S.body,fontSize:14,margin:"0 0 12px"}}>The cannabis plant produces over 100 compounds. THC is just one, and the only one that creates a "high." The rest do different things: calm the body, sharpen focus, promote sleep.</p>
        <p style={{...S.body,fontSize:14,margin:0}}>Modern hemp gummies isolate specific compounds and combine them at precise doses. This guide covers each one, how they interact, and what the safety data says.</p>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
        {[
          {id:"basics",i:"\u{1F33F}",l:"The Basics",s:"Plant, hemp, weed"},
          {id:"compounds",i:"\u{1F9EA}",l:"Compounds",s:"What each one does"},
          {id:"builder",i:"\u{1F9F1}",l:"Builder",s:"Interactive combos"},
          {id:"products",i:"\u{1F48A}",l:"Products",s:"Specific gummies"},
          {id:"safety",i:"\u{1F6E1}\uFE0F",l:"Safety",s:"Risks and addiction"},
          {id:"compare",i:"\u{1F4CA}",l:"vs. Alcohol",s:"Side-by-side data"},
          {id:"faq",i:"\u2753",l:"FAQ",s:"Common concerns"},
          {id:"glossary",i:"\u{1F4D6}",l:"Glossary",s:"Every term defined"},
        ].map(x=><div key={x.id} onClick={()=>go(x.id)} style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #F4F4F5",cursor:"pointer",transition:"all .15s"}}>
          <div style={{fontSize:24,marginBottom:8}}>{x.i}</div>
          <div style={{...S.h3,fontSize:14,marginBottom:2}}>{x.l}</div>
          <div style={{...S.cap,fontSize:11}}>{x.s}</div>
        </div>)}
      </div>
    </>;

    case "basics": return <>
      <h1 style={{...S.h1,marginBottom:8}}>The Basics</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Cannabis, hemp, marijuana, and weed. What the words mean.</p>
      <Card><div style={{...S.body,fontSize:14}}>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#09090B"}}>Cannabis</strong> is the plant. A genus with many varieties, like "citrus" includes oranges and lemons.</p>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#09090B"}}>Hemp</strong> is cannabis with less than 0.3% THC by weight. Federally legal since the 2018 Farm Bill. Used for clothing, food, building materials, and wellness supplements.</p>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#09090B"}}>Marijuana</strong> is cannabis with more than 0.3% THC. What people smoke to get high. Still federally illegal.</p>
        <p style={{margin:0}}><strong style={{color:"#09090B"}}>"Weed"</strong> is slang that usually means marijuana. That's why it triggers concern. Hemp gummies are not marijuana.</p>
      </div></Card>
      <Info><strong>Analogy:</strong> Poppy seeds come from the same plant as opium. A poppy seed bagel doesn't mean you're using opioids. Same plant, completely different product. Hemp gummies relate to marijuana the same way.</Info>
      <Card><h3 style={{...S.h3,marginBottom:8}}>The plant makes many compounds</h3><p style={{...S.body,fontSize:14,margin:0}}>Cannabis produces 100+ compounds called cannabinoids. THC is the only one primarily responsible for a "high." The others each do something different, and most are non-psychoactive. Manufacturers extract specific compounds at precise doses for targeted effects.</p></Card>
      <Card s={{background:"#FAFAFA",border:"none"}}><h3 style={{...S.h3,marginBottom:8}}>Your body already makes cannabinoids</h3><p style={{...S.body,fontSize:14,margin:0}}>Every human body has an endocannabinoid system producing its own cannabinoid-like compounds. It regulates mood, sleep, appetite, pain, and immune response. Plant cannabinoids supplement this existing system. They're not introducing something foreign.</p></Card>
    </>;

    case "compounds": return <>
      <h1 style={{...S.h1,marginBottom:8}}>The Compounds</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Six cannabinoids. What each does, how it feels at different doses, and what to know.</p>
      <Card s={{background:"#FAFAFA",border:"none",padding:16}}>
        <div style={{...S.mono,color:"#A1A1AA",marginBottom:10,textTransform:"uppercase"}}>Quick Reference</div>
        {CMP.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #F4F4F5"}}>
          <span style={{fontSize:16,width:24,textAlign:"center"}}>{c.icon}</span>
          <span style={{...S.mono,color:c.col,fontWeight:700,fontSize:12,minWidth:38}}>{c.ab}</span>
          <span style={{...S.cap,flex:1,fontSize:12}}>{c.tag}</span>
          {c.psy?<Pill bg="#FEF3C7" c="#92400E">High</Pill>:<Pill bg="#F0FDF4" c="#166534">No high</Pill>}
        </div>)}
      </Card>
      {CMP.map(c=>{const open=oc===c.id; return <div key={c.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:`1.5px solid ${open?c.col+"40":"#F4F4F5"}`,marginBottom:12,transition:"all .25s",boxShadow:open?`0 4px 20px ${c.col}10`:"none"}}>
        <div onClick={()=>setOc(open?null:c.id)} style={{padding:"16px 18px",cursor:"pointer"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{...S.mono,color:c.col,fontWeight:700,fontSize:15}}>{c.ab}</span>
                <span style={{...S.cap,fontSize:12}}>{c.tag}</span>
              </div>
              <p style={{...S.body,fontSize:13,margin:"4px 0 0",color:"#A1A1AA"}}>{c.one}</p>
            </div>
            <span style={{fontSize:20,color:"#D4D4D8",transition:"transform .2s",transform:open?"rotate(45deg)":"none"}}>+</span>
          </div>
        </div>
        {open&&<div style={{padding:"0 18px 20px"}}>
          <div style={{height:1,background:"#F4F4F5",marginBottom:16}}/>
          <div style={{...S.mono,color:"#A1A1AA",marginBottom:16}}>{c.full}</div>
          <div style={{marginBottom:18}}>{Object.entries(c.fx).map(([k,v])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:12,width:20,textAlign:"center"}}>{EFX[k].i}</span>
            <span style={{...S.cap,minWidth:80,fontSize:11}}>{EFX[k].l}</span>
            <Bar v={v} col={c.col}/>
          </div>)}</div>
          <div style={{marginBottom:16}}>
            <div style={{...S.mono,color:c.col,textTransform:"uppercase",marginBottom:8}}>How it feels by dose</div>
            {Object.entries(c.feel).map(([tier,text])=><div key={tier} style={{marginBottom:10,paddingLeft:12,borderLeft:`2px solid ${c.col}30`}}>
              <div style={{fontFamily:G,fontSize:11,fontWeight:600,color:c.col,textTransform:"uppercase",marginBottom:2}}>{tier==="low"?"Low dose":tier==="med"?"Medium dose":"Higher dose"}</div>
              <p style={{...S.body,fontSize:13,margin:0}}>{text}</p>
            </div>)}
          </div>
          {[{l:"In the body",t:c.body},{l:"Risks",t:c.risk},{l:"Everyday comparison",t:c.cmp},{l:"In combinations",t:c.stack}].map((s,i)=><div key={i} style={{marginBottom:14}}>
            <div style={{...S.mono,color:c.col,textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
            <p style={{...S.body,fontSize:13,margin:0}}>{s.t}</p>
          </div>)}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Pill bg={c.psy?"#FEF3C7":"#F0FDF4"} c={c.psy?"#92400E":"#166534"}>{c.psy?"Psychoactive":"Non-psychoactive"}</Pill>
            <Pill bg={c.dt?"#FFF1F2":"#F0FDF4"} c={c.dt?"#9F1239":"#166534"}>{c.dt?"Triggers drug test":"Drug test safe"}</Pill>
            <Pill>Addiction: {c.add}</Pill>
          </div>
        </div>}
      </div>;})}
    </>;

    case "builder": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Effect Builder</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Toggle compounds to see the combined profile change in real time.</p>
      <Card>
        <div style={{...S.mono,color:"#A1A1AA",textTransform:"uppercase",marginBottom:12}}>Select compounds</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {CMP.map(c=>{const on=sel.includes(c.id); return <button key={c.id} onClick={()=>tog(c.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,border:`1.5px solid ${on?c.col:"#E4E4E7"}`,background:on?c.bg:"#fff",cursor:"pointer",transition:"all .2s",fontFamily:G}}>
            <span style={{fontSize:16}}>{c.icon}</span>
            <span style={{fontSize:13,fontWeight:on?700:500,color:on?c.col:"#A1A1AA"}}>{c.ab}</span>
          </button>;})}
        </div>
      </Card>
      <Card s={{background:sel.length?"#FAFAFA":"#F4F4F5",border:"none"}}>
        <div style={{...S.mono,color:"#A1A1AA",textTransform:"uppercase",marginBottom:14}}>{sel.length?"Combined Effect Profile":"Select compounds above"}</div>
        {sel.length>0&&<>
          {Object.entries(EFX).map(([k,m])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:14,width:22,textAlign:"center"}}>{m.i}</span>
            <span style={{...S.body,fontSize:13,minWidth:90}}>{m.l}</span>
            <Bar v={blend[k]} col="#3B82F6" h={6}/>
            <span style={{...S.mono,color:"#A1A1AA",minWidth:16,textAlign:"right"}}>{blend[k]}</span>
          </div>)}
          <div style={{height:1,background:"#E4E4E7",margin:"16px 0"}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {anyP?<Pill bg="#FEF3C7" c="#92400E">Psychoactive</Pill>:<Pill bg="#F0FDF4" c="#166534">Non-psychoactive</Pill>}
            {anyD?<Pill bg="#FFF1F2" c="#9F1239">May trigger drug test</Pill>:<Pill bg="#F0FDF4" c="#166534">Drug test safe</Pill>}
          </div>
          <div style={{...S.mono,color:"#A1A1AA",textTransform:"uppercase",marginBottom:8}}>How these interact</div>
          {sel.map(id=>{const c=CMP.find(x=>x.id===id); return <div key={id} style={{display:"flex",gap:8,marginBottom:8}}>
            <span style={{...S.mono,color:c.col,fontWeight:700,minWidth:36}}>{c.ab}</span>
            <span style={{...S.body,fontSize:12,color:"#A1A1AA"}}>{c.stack}</span>
          </div>;})}
        </>}
      </Card>
      <div style={{...S.mono,color:"#A1A1AA",textTransform:"uppercase",marginBottom:10}}>Common combinations</div>
      {PRESETS.map((p,i)=><div key={i} onClick={()=>setSel(p.c)} style={{padding:"12px 16px",background:"#fff",borderRadius:12,border:"1px solid #F4F4F5",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
        <div style={{flex:1}}>
          <div style={{...S.h3,fontSize:14}}>{p.l}</div>
          <div style={{...S.cap,fontSize:11}}>{p.d}</div>
        </div>
        <div style={{display:"flex",gap:4}}>{p.c.map(id=>{const co=CMP.find(x=>x.id===id); return <span key={id} style={{...S.mono,color:co.col,fontWeight:700,fontSize:10}}>{co.ab}</span>;})}</div>
      </div>)}
    </>;

    case "products": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Products</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Specific gummies referenced in this guide.</p>
      <Info>Most THC gummies are 10mg. A half gummy (5mg) is the lowest common dose and a standard starting point.</Info>
      {PRODS.map((p,i)=><Card key={i}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{fontSize:24}}>{p.ic}</span>
          <div><div style={S.h3}>{p.b} {p.n}</div><div style={{...S.mono,color:"#A1A1AA",fontSize:10}}>{p.f}</div></div>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
          {p.cc.map(id=>{const c=CMP.find(x=>x.id===id); return <Pill key={id} bg={c.bg} c={c.col}>{c.icon} {c.ab}</Pill>;})}
        </div>
        {[{l:"Half dose",v:p.h},{l:"Profile",v:p.p},{l:"Best for",v:p.best},{l:"Not for",v:p.not}].map((r,j)=><div key={j} style={{display:"flex",gap:8,marginBottom:6}}>
          <span style={{...S.mono,color:"#A1A1AA",minWidth:80,flexShrink:0,textTransform:"uppercase",fontSize:10,paddingTop:2}}>{r.l}</span>
          <span style={{...S.body,fontSize:13}}>{r.v}</span>
        </div>)}
      </Card>)}
    </>;

    case "safety": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Safety</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Honest information about risks, side effects, and addiction.</p>
      <Info t="safe"><strong>There has never been a recorded fatal overdose from cannabis in human history.</strong> At 5mg THC, the worst realistic outcome is feeling foggy for 2{"\u2013"}4 hours.</Info>
      <Card><h3 style={{...S.h2,marginBottom:10}}>Addiction</h3>
        <p style={{...S.body,fontSize:14,margin:"0 0 10px"}}>Cannabis does not create physical dependence. No physical withdrawal syndrome. Fundamentally different from alcohol, opioids, benzodiazepines, and nicotine.</p>
        <p style={{...S.body,fontSize:14,margin:"0 0 10px"}}>At high daily doses (20mg+), some develop mild psychological habituation: they prefer having it, but stopping has no physical consequences. Like missing morning coffee.</p>
        <p style={{...S.body,fontSize:14,margin:0}}>At 5mg a few times per week, dependence is not a realistic concern by any medical standard.</p>
      </Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>Side effects at 5mg THC</h3>
        {[{e:"Dry mouth",s:"Common",v:"Mild"},{e:"Slight appetite increase",s:"Common",v:"Mild"},{e:"Mild mental fog",s:"Sometimes",v:"Mild"},{e:"Feeling tongue-tied",s:"Sometimes",v:"Mild"},{e:"Drowsiness (with CBD/CBN)",s:"Expected",v:"Mild"},{e:"Anxiety increase",s:"Rare at 5mg",v:"Moderate"}].map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:i<5?"1px solid #F4F4F5":"none",gap:8}}>
          <span style={{...S.body,fontSize:13,flex:1}}>{r.e}</span><Pill>{r.s}</Pill><Pill bg={r.v==="Moderate"?"#FEF3C7":"#F4F4F5"} c={r.v==="Moderate"?"#92400E":"#71717A"}>{r.v}</Pill>
        </div>)}
      </Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>What these products are not</h3><p style={{...S.body,fontSize:14,margin:0}}>Not smoked or vaped (no lung exposure). Not street drugs (licensed facilities, lab tested). Not unregulated (every batch has a COA). Not illegal. Not marijuana.</p></Card>
      <Info t="warn">Do not drive while feeling THC effects (~3{"\u2013"}4 hours). CBD-only products do not impair driving.</Info>
    </>;

    case "compare": return <>
      <h1 style={{...S.h1,marginBottom:8}}>vs. Alcohol</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Not a judgment on drinking. Data for context.</p>
      {[
        {c:"Annual US deaths",a:"~178,000",g:"0 recorded fatal overdoses ever"},
        {c:"Physical addiction",a:"Yes. Withdrawal can be fatal.",g:"No. No withdrawal syndrome."},
        {c:"Organ damage",a:"Liver, brain, heart, cancer",g:"None documented from edibles"},
        {c:"Impairment",a:"Aggression, blackouts, loss of coordination",g:"Mild at 5mg. No aggression. No blackouts."},
        {c:"Calories",a:"~150 per drink",g:"~10\u201315 per gummy"},
        {c:"Next day",a:"Hangover, dehydration, nausea",g:"None at 5mg"},
        {c:"DV correlation",a:"Strong, documented",g:"None documented"},
        {c:"Cost",a:"$8\u201315 per drink (out)",g:"~$0.66 per session"},
      ].map((r,i)=><div key={i} style={{background:i%2===0?"#FAFAFA":"#fff",padding:16,borderRadius:i===0?"14px 14px 0 0":i===7?"0 0 14px 14px":0,border:"1px solid #F4F4F5",borderBottom:i<7?"none":undefined}}>
        <div style={{...S.mono,color:"#A1A1AA",textTransform:"uppercase",marginBottom:8}}>{r.c}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><div style={{fontFamily:G,fontSize:11,fontWeight:600,color:"#EF4444",marginBottom:3}}>{"\u{1F377}"} Alcohol</div><div style={{...S.body,fontSize:12}}>{r.a}</div></div>
          <div><div style={{fontFamily:G,fontSize:11,fontWeight:600,color:"#22C55E",marginBottom:3}}>{"\u{1F33F}"} 5mg THC</div><div style={{...S.body,fontSize:12}}>{r.g}</div></div>
        </div>
      </div>)}
      <Info>Both are psychoactive. The point: cannabis at 5mg carries dramatically less measurable risk than a substance treated as completely normal. If a glass of wine at dinner is acceptable, a 5mg gummy operates in the same territory with a substantially better safety profile.</Info>
    </>;

    case "legal": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Legal Status</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>How and why hemp gummies are legal.</p>
      <Info t="safe"><strong>Federally legal in all 50 states.</strong> The 2018 Farm Bill, signed by President Trump, legalized hemp and all products under 0.3% THC by dry weight.</Info>
      <Card><h3 style={{...S.h2,marginBottom:10}}>South Carolina</h3><p style={{...S.body,fontSize:14,margin:0}}>SC legalized hemp products in alignment with the federal Farm Bill. Hemp-derived Delta-9 THC products are legal for purchase and consumption. Sold openly in retail stores. No prescription or medical card required.</p></Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>How gummies stay under the limit</h3><p style={{...S.body,fontSize:14,margin:0}}>The 0.3% limit is by dry weight. A 4{"\u2013"}5 gram gummy can legally contain up to ~12{"\u2013"}15mg THC. The gummy is mostly sugar, pectin, and flavoring. THC is a tiny fraction of total weight.</p></Card>
      <Info t="warn">Drug tests don't distinguish legal hemp THC from marijuana THC. A positive from a legal 5mg gummy looks identical to one from marijuana.</Info>
    </>;

    case "faq": return <>
      <h1 style={{...S.h1,marginBottom:8}}>FAQ</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Direct answers to common concerns.</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search questions..." style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #E4E4E7",background:"#FAFAFA",fontSize:15,fontFamily:G,outline:"none",boxSizing:"border-box",color:"#09090B",marginBottom:14}}/>
      {fF.map((f,i)=>{const open=oq===i; return <div key={i} style={{background:"#fff",borderRadius:14,overflow:"hidden",border:`1px solid ${open?"#3B82F640":"#F4F4F5"}`,marginBottom:8,transition:"all .2s"}}>
        <div onClick={()=>setOq(open?null:i)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontFamily:G,fontSize:13,fontWeight:700,color:"#3B82F6",flexShrink:0,marginTop:1}}>Q</span>
          <span style={{...S.h3,fontSize:14,flex:1,lineHeight:1.4}}>{f.q}</span>
          <span style={{fontSize:18,color:"#D4D4D8",transition:"transform .2s",transform:open?"rotate(45deg)":"none"}}>+</span>
        </div>
        {open&&<div style={{padding:"0 18px 16px 42px",borderTop:"1px solid #F4F4F5"}}>
          <p style={{...S.body,fontSize:14,margin:"14px 0 0",lineHeight:1.75}}>{f.a}</p>
        </div>}
      </div>;})}
      {!fF.length&&<Card s={{textAlign:"center"}}><p style={{...S.cap,margin:0}}>No matching questions.</p></Card>}
    </>;

    case "glossary": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Glossary</h1>
      <p style={{...S.body,color:"#A1A1AA",marginBottom:20}}>Every term defined simply.</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms..." style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #E4E4E7",background:"#FAFAFA",fontSize:15,fontFamily:G,outline:"none",boxSizing:"border-box",color:"#09090B",marginBottom:14}}/>
      <Card>{fG.map((g,i)=><div key={i} style={{padding:"10px 0",borderBottom:i<fG.length-1?"1px solid #F4F4F5":"none"}}>
        <div style={{...S.h3,fontSize:14,marginBottom:2}}>{g.t}</div>
        <div style={{...S.body,fontSize:13,color:"#A1A1AA"}}>{g.d}</div>
      </div>)}</Card>
    </>;

    default: return null;
  }};

  const sideW = 220;

  return <div style={{minHeight:"100vh",background:"#FFFFFF",fontFamily:G,display:"flex",flexDirection:"column"}}>
    <link href={LINK} rel="stylesheet"/>

    {/* Top bar */}
    <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,.88)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid rgba(0,0,0,.06)",padding:"0 20px",height:48,display:"flex",alignItems:"center",gap:14}}>
      <button onClick={()=>setNav(!nav)} aria-label="Toggle sidebar" style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:4,color:nav?"#09090B":"#71717A",transition:"color .2s",fontFamily:G,display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:6}}>{nav?"\u2715":"\u2630"}</button>
      <div style={{height:16,width:1,background:"#E4E4E7"}}/>
      <div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1}}>
        <span style={{fontSize:16}}>🌿</span>
        <span style={{...S.h3,fontSize:14,letterSpacing:"-.01em"}}>Hemp Gummies, Explained</span>
      </div>
      {sec!=="home"&&<span style={{...S.mono,fontSize:10,color:"#A1A1AA",textTransform:"uppercase",letterSpacing:".05em"}}>{SECS.find(s=>s.id===sec)?.l}</span>}
    </div>

    {/* Layout: sidebar + content */}
    <div style={{display:"flex",flex:1,minHeight:0}}>

      {/* Persistent sidebar */}
      <div style={{width:nav?sideW:0,overflow:"hidden",transition:"width .28s cubic-bezier(.4,0,.2,1)",flexShrink:0,borderRight:nav?"1px solid rgba(0,0,0,.06)":"none",background:"#FAFAFA"}}>
        <div style={{width:sideW,padding:"20px 0 24px",height:"100%",boxSizing:"border-box",overflowY:"auto"}}>
          <div style={{padding:"0 16px 16px"}}><span style={{...S.mono,fontSize:10,color:"#A1A1AA",textTransform:"uppercase",letterSpacing:".06em"}}>Sections</span></div>
          {SECS.map(s=>{const active=sec===s.id; return <div key={s.id} onClick={()=>{setSec(s.id);setQ("");setOc(null);setOq(null);setTimeout(()=>ref.current?.scrollTo({top:0,behavior:"smooth"}),50);}} style={{padding:"9px 16px 9px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:active?"#fff":"transparent",borderRight:active?"2px solid #09090B":"2px solid transparent",transition:"all .18s ease",marginBottom:1}}>
            <span style={{...S.body,fontSize:14,color:active?"#09090B":"#71717A",fontWeight:active?600:400,transition:"all .18s"}}>{s.l}</span>
          </div>;})}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,minWidth:0,display:"flex",justifyContent:"center"}}>
        <div ref={ref} style={{flex:1,maxWidth:540,width:"100%",padding:"28px 20px 60px",overflowY:"auto"}}>{R()}</div>
      </div>
    </div>
  </div>;
}
