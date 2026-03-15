import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ─── FONTS ─── */
const G = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const GM = "'Geist Mono', monospace";
const LINK_SANS = "https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.css";
const LINK_MONO = "https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-mono/style.css";

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

/* ─── PRODUCT CATALOG ─── */
const PRODUCTS = [
  // === SOCIETY'S PLANT GUMMIES ===
  {
    id: "sp-passion", brand: "Society's Plant", name: "Passion Seggs", cat: "gummy",
    purpose: "Intimacy & Relaxation", icon: "\u{1F49C}", color: "#a855f7",
    compounds: [
      { abbr: "CBD", mg: 50, role: "Primary" },
      { abbr: "THC", mg: 1.5, role: "Trace" },
      { abbr: "CBC", mg: 1.5, role: "Support" },
    ],
    totalMg: 53, psychoactive: false, drugTestRisk: "Low",
    price: { unit: "$1.87", pack: "$37.44 (20ct sale)", sub: "$22.46/mo" },
    fx: { euphoria: 0, relaxation: 5, focus: 2, energy: 1, social: 2, clarity: 3, sleep: 3, pain: 4, fog: 0, appetite: 0 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "high",
    medNote: "50mg CBD strongly inhibits CYP2B6 (bupropion) and CYP2C19 (sertraline). Highest interaction risk on your shelf.",
    coreyNote: "You've taken this. Dropped shoulders, quiet mind, slightly sluggish speech. No high. Good for physical tension days.",
    tags: ["CBD-dominant", "Non-psychoactive", "Intimacy"],
  },
  {
    id: "sp-goodday", brand: "Society's Plant", name: "Good Day CBG Focus", cat: "gummy",
    purpose: "Focus & Daytime Clarity", icon: "\u2600\uFE0F", color: "#16a34a",
    compounds: [
      { abbr: "CBD", mg: 40, role: "Primary" },
      { abbr: "CBG", mg: 20, role: "Secondary" },
      { abbr: "THC", mg: 1.5, role: "Trace" },
    ],
    totalMg: 61.5, psychoactive: false, drugTestRisk: "Very Low",
    price: { unit: "$2.11", pack: "$42.12 (20ct sale)", sub: "$25.27/mo" },
    fx: { euphoria: 0, relaxation: 4, focus: 5, energy: 3, social: 3, clarity: 5, sleep: 1, pain: 3, fog: 0, appetite: 0 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "high",
    medNote: "40mg CBD inhibits CYP2B6 (bupropion) and CYP2C19 (sertraline). Second highest interaction risk. CBG adds CYP2C9 load (naproxen).",
    coreyNote: "You took this before rehearsal. No high noticed. Felt 'not in my head, not worried about what people think.' Best rehearsal data point so far, but hard to isolate from first-day bupropion effects.",
    tags: ["CBD+CBG", "Non-psychoactive", "Focus", "Lion's Mane"],
  },
  {
    id: "sp-highspirits", brand: "Society's Plant", name: "High Spirits Microdose", cat: "gummy",
    purpose: "Social & Mood Elevation", icon: "\u2728", color: "#f59e0b",
    compounds: [
      { abbr: "CBG", mg: 20, role: "Primary" },
      { abbr: "THC", mg: 5, role: "Secondary" },
      { abbr: "THCv", mg: 5, role: "Secondary" },
    ],
    totalMg: 30, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$2.18", pack: "$43.68 (20ct sale)", sub: "$26.21/mo" },
    fx: { euphoria: 3, relaxation: 2, focus: 4, energy: 4, social: 5, clarity: 4, sleep: 0, pain: 1, fog: 1, appetite: -2 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "low",
    medNote: "No CBD, so minimal CYP2B6/2C19 inhibition. THC + sertraline serotonin overlap exists but low risk at 5mg. Cleanest psychoactive option for your med profile.",
    coreyNote: "This is the one you loved at rehearsal. Loose, playful, articulate, present. The clear-headed social gummy. Same as the 'High Energy Microdose' from your sampler.",
    tags: ["CBG+THC+THCv", "Psychoactive", "Social", "Your Favorite"],
  },
  {
    id: "sp-focused", brand: "Society's Plant", name: "Focused Microdose", cat: "gummy",
    purpose: "Deep Focus & ADHD Support", icon: "\u{1F3AF}", color: "#6366f1",
    compounds: [
      { abbr: "THC", mg: 2, role: "Micro" },
      { abbr: "CBG", mg: "?", role: "Support" },
      { abbr: "THCv", mg: "?", role: "Support" },
      { abbr: "Lion's Mane", mg: "?", role: "Nootropic" },
      { abbr: "L-Theanine", mg: "?", role: "Amino Acid" },
    ],
    totalMg: null, psychoactive: true, drugTestRisk: "Yes (low dose)",
    price: { unit: "$2.11", pack: "$42.12 (20ct sale)", sub: "$25.27/mo" },
    fx: { euphoria: 1, relaxation: 2, focus: 5, energy: 3, social: 2, clarity: 5, sleep: 0, pain: 1, fog: 0, appetite: -1 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "low",
    medNote: "Only 2mg THC and no CBD. Very low enzyme interaction risk. L-Theanine is generally safe with SSRIs. Lion's Mane has no known CYP conflicts.",
    coreyNote: "You haven't tried this. Given your ADHD screener results, this one is worth exploring. 2mg THC is sub-perceptual for most people. The Lion's Mane and L-Theanine are nootropic ingredients that support focus without cannabinoid load.",
    tags: ["Nootropic", "Ultra-low THC", "Focus", "ADHD-relevant"],
  },
  {
    id: "sp-miracle", brand: "Society's Plant", name: "F*cking Miracle", cat: "gummy",
    purpose: "Energy & Appetite Control", icon: "\u26A1", color: "#0891b2",
    compounds: [
      { abbr: "THCv", mg: 10, role: "Solo" },
    ],
    totalMg: 10, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$2.11", pack: "$42.12 (20ct sale)", sub: "$25.27/mo" },
    fx: { euphoria: 2, relaxation: 1, focus: 4, energy: 5, social: 2, clarity: 4, sleep: 0, pain: 1, fog: 0, appetite: -4 },
    onset: "20-45 min", duration: "1.5-2.5 hrs",
    medFlag: "low",
    medNote: "No CBD, no THC. Cleanest option for your med profile. THCv enzyme interactions are understudied but no documented CYP2B6/2C19 issues.",
    coreyNote: "You tried this. Barely noticed anything. Maybe a subtle something around 30 min that faded fast. Not worth the price as a standalone. THCv works better as a team player inside the High Spirits formula.",
    tags: ["Pure THCv", "Energy", "Appetite Suppression"],
  },
  {
    id: "sp-adult", brand: "Society's Plant", name: "1:1 Adult Gummies", cat: "gummy",
    purpose: "Full High / Recreation", icon: "\u{1F353}", color: "#ef4444",
    compounds: [
      { abbr: "THC", mg: 12, role: "Primary" },
      { abbr: "CBD", mg: 12, role: "Primary" },
    ],
    totalMg: 24, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$2.70", pack: "$54.00 (20ct)", sub: "$32.40/mo" },
    fx: { euphoria: 5, relaxation: 4, focus: 1, energy: 1, social: 3, clarity: 1, sleep: 3, pain: 4, fog: 4, appetite: 3 },
    onset: "30-90 min", duration: "4-6 hrs",
    medFlag: "medium",
    medNote: "12mg CBD moderately inhibits CYP2B6/2C19. 12mg THC is a real dose. The THC + sertraline serotonin risk is slightly elevated at this level. Not recommended without tolerance.",
    coreyNote: "You haven't tried this. At 12mg THC, this is more than double your usual dose. Based on your 10mg Surge experience (word scrambling, dizzy, sounding drunk), this would be too much. Even half a gummy (6mg THC) is above your comfortable range.",
    tags: ["Full Strength", "1:1 Ratio", "High THC"],
  },
  {
    id: "sp-hhc", brand: "Society's Plant", name: "HHC & D9 Mood", cat: "gummy",
    purpose: "Euphoria & Creativity", icon: "\u{1F308}", color: "#ec4899",
    compounds: [
      { abbr: "HHC", mg: 25, role: "Primary" },
      { abbr: "THC", mg: 10, role: "Secondary" },
    ],
    totalMg: 35, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$2.18", pack: "$43.68 (20ct sale)", sub: "$26.21/mo" },
    fx: { euphoria: 5, relaxation: 3, focus: 2, energy: 3, social: 4, clarity: 2, sleep: 2, pain: 3, fog: 3, appetite: 3 },
    onset: "30-90 min", duration: "4-6 hrs",
    medFlag: "medium",
    medNote: "HHC enzyme interactions are poorly studied. 10mg THC adds CYP2B6/2C19 load. Combined 35mg psychoactive cannabinoids is a heavy dose for your tolerance. Use extreme caution.",
    coreyNote: "You haven't tried this. HHC is a hydrogenated cannabinoid that sits between Delta-8 and Delta-9 in strength. At 25mg HHC + 10mg THC, this is the strongest psychoactive gummy in the Society's Plant lineup. Far beyond your tested comfort zone.",
    tags: ["HHC", "Strong", "Euphoria", "Advanced Users"],
  },
  {
    id: "sp-rr", brand: "Society's Plant", name: "R&R Delta-8", cat: "gummy",
    purpose: "Relaxation & Rest", icon: "\u{1F7E3}", color: "#7c3aed",
    compounds: [
      { abbr: "D8-THC", mg: 50, role: "Solo" },
    ],
    totalMg: 50, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$2.18", pack: "$43.68 (20ct sale)", sub: null },
    fx: { euphoria: 3, relaxation: 5, focus: 1, energy: 0, social: 2, clarity: 2, sleep: 4, pain: 4, fog: 3, appetite: 2 },
    onset: "45-90 min", duration: "4-6 hrs",
    medFlag: "medium",
    medNote: "Delta-8 THC metabolizes through CYP enzymes similarly to Delta-9. At 50mg per gummy, even a quarter would be a significant dose. Drug interaction profile is poorly characterized.",
    coreyNote: "You haven't tried this. Delta-8 is generally considered milder than Delta-9, but at 50mg per gummy this is extremely potent. You'd need to cut this into eighths to approach your usual dose range. Not practical.",
    tags: ["Delta-8", "High Dose", "Sedating"],
  },
  {
    id: "sp-goodnight", brand: "Society's Plant", name: "Good Night CBN Sleep", cat: "gummy",
    purpose: "Sleep", icon: "\u{1F319}", color: "#1e40af",
    compounds: [
      { abbr: "CBN", mg: "?", role: "Primary" },
    ],
    totalMg: null, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$1.72", pack: "$34.32 (20ct sale)", sub: null },
    fx: { euphoria: 1, relaxation: 5, focus: 0, energy: 0, social: 0, clarity: 0, sleep: 5, pain: 3, fog: 2, appetite: 1 },
    onset: "30-60 min", duration: "4-6 hrs",
    medFlag: "low",
    medNote: "CBN inhibits CYP2B6 to some degree but exact dose unknown. Sedation stacks with sertraline drowsiness. Bedtime only.",
    coreyNote: "You haven't tried this. Similar concept to Five's Indica Chill but without the THC/CBD base. Pure sleep aid. Never before driving or social events.",
    tags: ["CBN", "Sleep", "Evening Only"],
  },
  {
    id: "sp-snooze", brand: "Society's Plant", name: "Snoozeberry CBN Sleep", cat: "gummy",
    purpose: "Sleep (Berry Flavor)", icon: "\u{1F353}\u{1F319}", color: "#4338ca",
    compounds: [
      { abbr: "CBN", mg: "?", role: "Primary" },
    ],
    totalMg: null, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$1.87", pack: "$37.44 (20ct sale)", sub: null },
    fx: { euphoria: 1, relaxation: 5, focus: 0, energy: 0, social: 0, clarity: 0, sleep: 5, pain: 3, fog: 2, appetite: 1 },
    onset: "30-60 min", duration: "4-6 hrs",
    medFlag: "low",
    medNote: "Same profile as Good Night. CBN inhibits CYP2B6 mildly. Sedation stacks with sertraline.",
    coreyNote: "Same as Good Night but berry flavored. Different flavor, same function.",
    tags: ["CBN", "Sleep", "Evening Only"],
  },
  // === FIVE GUMMIES ===
  {
    id: "five-surge", brand: "Five", name: "Sativa Surge", cat: "gummy",
    purpose: "Social & Daytime Energy", icon: "\u{1F7E2}", color: "#22c55e",
    compounds: [
      { abbr: "THC", mg: 10, role: "Primary" },
      { abbr: "CBD", mg: 10, role: "Primary" },
      { abbr: "CBC", mg: 2, role: "Support" },
    ],
    totalMg: 22, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$1.33", pack: "$19.99 (15ct)", sub: null },
    fx: { euphoria: 3, relaxation: 3, focus: 2, energy: 3, social: 4, clarity: 2, sleep: 1, pain: 3, fog: 2, appetite: 2 },
    fxHalf: { euphoria: 2, relaxation: 3, focus: 3, energy: 2, social: 4, clarity: 3, sleep: 1, pain: 2, fog: 1, appetite: 1 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "low",
    medNote: "At half dose: 5mg CBD is minimal CYP inhibition. 5mg THC + sertraline serotonin overlap is low risk. Your safest psychoactive daily driver with medications.",
    coreyNote: "Your baseline. Half gummy = loose, playful, social, occasional mild fog or tongue-tied feeling. Full gummy = word scrambling, dizzy, sounding drunk. Always take half.",
    tags: ["Your Daily Driver", "THC+CBD", "Social"],
    hasHalfDose: true,
  },
  {
    id: "five-hybrid", brand: "Five", name: "Hybrid Vibes", cat: "gummy",
    purpose: "Social with Clarity", icon: "\u{1F535}", color: "#3b82f6",
    compounds: [
      { abbr: "THC", mg: 10, role: "Primary" },
      { abbr: "CBD", mg: 10, role: "Primary" },
      { abbr: "CBG", mg: 2, role: "Support" },
    ],
    totalMg: 22, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$1.33", pack: "$19.99 (15ct)", sub: null },
    fx: { euphoria: 3, relaxation: 3, focus: 3, energy: 3, social: 4, clarity: 3, sleep: 1, pain: 3, fog: 1, appetite: 1 },
    fxHalf: { euphoria: 2, relaxation: 3, focus: 3, energy: 2, social: 4, clarity: 3, sleep: 1, pain: 2, fog: 1, appetite: 1 },
    onset: "30-60 min", duration: "3-5 hrs",
    medFlag: "low",
    medNote: "Same low interaction profile as Surge at half dose. 1mg CBG is negligible for enzyme activity.",
    coreyNote: "You haven't done a clean test of this yet. Same as Surge but CBG replaces CBC. The question: does even 1mg CBG add noticeable clarity vs Surge? Probably not, based on what you learned about dose-dependent CBG effects.",
    tags: ["THC+CBD+CBG", "Social", "Clarity Test"],
    hasHalfDose: true,
  },
  {
    id: "five-chill", brand: "Five", name: "Indica Chill", cat: "gummy",
    purpose: "Evening & Sleep", icon: "\u{1F7E3}", color: "#6366f1",
    compounds: [
      { abbr: "THC", mg: 10, role: "Primary" },
      { abbr: "CBD", mg: 10, role: "Primary" },
      { abbr: "CBN", mg: 2, role: "Support" },
    ],
    totalMg: 22, psychoactive: true, drugTestRisk: "Yes",
    price: { unit: "$1.33", pack: "$19.99 (15ct)", sub: null },
    fx: { euphoria: 2, relaxation: 5, focus: 0, energy: 0, social: 1, clarity: 1, sleep: 4, pain: 4, fog: 3, appetite: 2 },
    fxHalf: { euphoria: 1, relaxation: 4, focus: 1, energy: 0, social: 1, clarity: 1, sleep: 3, pain: 3, fog: 2, appetite: 1 },
    onset: "30-60 min", duration: "4-6 hrs",
    medFlag: "low",
    medNote: "At half dose: same low CYP load as Surge. CBN adds sedation that stacks with sertraline drowsiness. Evening only.",
    coreyNote: "You haven't tried this yet. Evening wind-down product. Never before rehearsal, social events, or driving.",
    tags: ["THC+CBD+CBN", "Sleep", "Evening Only"],
    hasHalfDose: true,
  },
];

const TINCTURES = [
  {
    id: "sp-cbda", brand: "Society's Plant", name: "CBDA + CBD Pain Relief", cat: "tincture",
    purpose: "Pain & Inflammation", icon: "\u{1FA79}", color: "#059669",
    perMl: "32mg CBD + 12mg CBDA", totalBottle: "1000mg", size: "30ml",
    price: "$53.04 (sale)", pricePerDose: "~$1.77/ml",
    medFlag: "high",
    medNote: "32mg CBD per dose strongly inhibits CYP2B6 (bupropion) and CYP2C19 (sertraline). CBDA interactions less studied but likely similar. Use smaller doses and separate from medication timing.",
    coreyNote: "You haven't tried this. Relevant for your back pain and EMG soreness. Could be a daily anti-inflammatory option, but the high CBD means bupropion interaction concerns. Start with half a dropper (16mg CBD) and see how it goes.",
    tags: ["CBDA", "Pain", "Anti-inflammatory"],
  },
  {
    id: "sp-thrive", brand: "Society's Plant", name: "Thrive Mushroom + CBD", cat: "tincture",
    purpose: "Overall Wellness", icon: "\u{1F33F}", color: "#10b981",
    perMl: "~33mg CBD + 12 mushroom extracts", totalBottle: "1000mg CBD", size: "30ml",
    price: "$60.84 (sale)", pricePerDose: "~$2.03/ml",
    medFlag: "high",
    medNote: "33mg CBD per dose inhibits CYP2B6/2C19. Mushroom extracts (Lion's Mane, Reishi, etc.) are generally safe with your medications. CBD is the concern, not the mushrooms.",
    coreyNote: "You haven't tried this. The 12-mushroom blend is interesting from a general wellness standpoint, but the CBD dose creates the same bupropion interaction issue as the gummies.",
    tags: ["CBD", "Mushrooms", "Wellness"],
  },
];

const FX_META = {
  euphoria:  { l: "Euphoria",       i: "\u2728" },
  relaxation:{ l: "Relaxation",     i: "\u{1F9D8}" },
  focus:     { l: "Focus",          i: "\u{1F3AF}" },
  energy:    { l: "Energy",         i: "\u26A1" },
  social:    { l: "Social Ease",    i: "\u{1F4AC}" },
  clarity:   { l: "Clarity",        i: "\u{1F48E}" },
  sleep:     { l: "Sleep",          i: "\u{1F319}" },
  pain:      { l: "Pain Relief",    i: "\u{1FA79}" },
  fog:       { l: "Fog Risk",       i: "\u{1F32B}\uFE0F" },
  appetite:  { l: "Appetite",       i: "\u{1F37D}\uFE0F" },
};
const FX_KEYS = Object.keys(FX_META);

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
const Bar = ({v,col="#3B82F6",h=4}) => <div style={{display:"flex",gap:3}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:22,height:h,borderRadius:h,background:i<v?col:"#e8e8e8",transition:"all .35s ease"}}/>)}</div>;
const Pill = ({children,bg="#f0f0f0",c="#525252",style:sx={}}) => <span style={{fontFamily:GM,fontSize:10,fontWeight:600,display:"inline-flex",padding:"3px 9px",borderRadius:99,background:bg,color:c,letterSpacing:.3,...sx}}>{children}</span>;
const Card = ({children,s={}}) => <div style={{background:"#fff",borderRadius:12,padding:"1.5rem",border:"1px solid #e8e8e8",boxShadow:"0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)",marginBottom:"0.75rem",...s}}>{children}</div>;
const Info = ({children,t="info"}) => {const s={info:{bg:"#f9f9fa",bc:"#e8e8e8",c:"#414141"},safe:{bg:"#d6ffcd",bc:"#1a6b2d30",c:"#1a6b2d"},warn:{bg:"#fff4de",bc:"#9a4e0030",c:"#9a4e00"}}[t]; return <div style={{background:s.bg,border:`1px solid ${s.bc}`,borderRadius:12,padding:"1.5rem",marginBottom:"0.75rem",fontFamily:G,fontSize:"0.9375rem",lineHeight:1.6,color:s.c}}>{children}</div>;};

/* ─── PRODUCT COMPONENTS ─── */
const MedBadge = ({ level }) => {
  const m = { low: { bg: "#f0fdf4", c: "#166534", t: "Low Med Risk" }, medium: { bg: "#fefce8", c: "#854d0e", t: "Med Risk" }, high: { bg: "#fef2f2", c: "#991b1b", t: "High Med Risk" } }[level];
  return <Pill bg={m.bg} c={m.c} style={{fontSize:9,fontWeight:700,textTransform:"uppercase",whiteSpace:"nowrap"}}>{m.t}</Pill>;
};
const PBar = ({ v, col }) => {
  const abs = Math.abs(v);
  const neg = v < 0;
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ width: 16, height: 5, borderRadius: 3, background: i < abs ? (neg ? "#ef4444" : col) : "#e8e8e8" }} />
      ))}
      {neg && <span style={{ fontFamily: GM, fontSize: 8, color: "#ef4444", fontWeight: 700, marginLeft: 1 }}>{"\u2193"}</span>}
    </div>
  );
};
const scaleFx = (p, dose) => {
  if (dose === 0.5 && p.fxHalf) return p.fxHalf;
  if (dose === 1) return p.fx;
  const result = {};
  FX_KEYS.forEach(k => {
    const v = p.fx[k] || 0;
    if (v === 0) { result[k] = 0; return; }
    const isNeg = k === "fog" || v < 0;
    const factor = dose < 1
      ? (isNeg ? dose : Math.pow(dose, 0.6))
      : (isNeg ? Math.pow(dose, 0.85) : Math.pow(dose, 0.5));
    result[k] = Math.sign(v) * Math.min(5, Math.round(Math.abs(v) * factor));
  });
  return result;
};
const doseWarnings = (p, dose) => {
  const sumMg = (abbrs) => dose * p.compounds.filter(c => abbrs.includes(c.abbr)).reduce((s, c) => s + (typeof c.mg === "number" ? c.mg : 0), 0);
  const totalThc = sumMg(["THC", "D8-THC", "HHC"]);
  const totalCbd = sumMg(["CBD"]);
  const w = [];
  if (totalThc >= 10 && dose > 1) w.push(`${totalThc}mg THC total \u2014 above your comfortable range.`);
  else if (totalThc >= 15) w.push(`${totalThc}mg THC \u2014 well beyond your tested tolerance.`);
  if (totalCbd >= 30 && dose > 1) w.push(`${totalCbd}mg CBD \u2014 increases bupropion/sertraline interaction risk.`);
  if (dose >= 3) w.push("Not recommended at your tolerance level.");
  return w;
};
const durationExtra = (dose) => dose <= 1 ? null : dose <= 1.5 ? "+30-60 min" : dose <= 2 ? "+1-2 hrs" : "+2-3 hrs";
const DosePicker = ({ dose, setDose, color, hasHalfDose, compact }) => (
  <div style={{ display:"flex", gap:compact?3:4, flexWrap:compact?"wrap":"nowrap", justifyContent:compact?"center":"flex-start" }}>
    {[0.5, 1, 1.5, 2, 3].map(d => (
      <button key={d} onClick={(e) => { e.stopPropagation(); setDose(d); }} style={{
        padding: compact ? "3px 7px" : "5px 10px", borderRadius: compact ? 4 : 6, border: "1px solid #e5e7eb", cursor: "pointer",
        fontFamily: GM, fontSize: compact ? 9 : 11, fontWeight: 600,
        background: d === dose ? (d >= 2 ? "#991b1b" : color) : "#fff",
        color: d === dose ? "#fff" : (d >= 2 ? "#991b1b" : "#525252"),
        borderColor: d >= 2 ? "#fecaca" : "#e5e7eb",
      }}>{d === 0.5 ? "\u00BD" : d === 1.5 ? "1\u00BD" : d}{d === 0.5 && hasHalfDose ? "*" : ""}</button>
    ))}
  </div>
);

const ProductCard = ({ p, isOpen, onToggle, dose, setDose }) => {
  const fx = scaleFx(p, dose);

  const warnings = doseWarnings(p, dose);
  const durExtra = durationExtra(dose);

  return (
    <div style={{
      background: "#fff", borderRadius: 12, overflow: "hidden",
      border: `1.5px solid ${isOpen ? p.color : "#e8e8e8"}`,
      transition: "all .2s", marginBottom: 10,
      boxShadow: isOpen ? `0 6px 24px ${p.color}10` : "0 1px 2px rgba(0,0,0,.03)",
    }}>
      <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: G, fontSize: 15, fontWeight: 700, color: "#161616" }}>{p.name}</span>
              <span style={{ fontFamily: GM, fontSize: 10, color: "#737373" }}>{p.brand}</span>
            </div>
            <div style={{ fontFamily: GM, fontSize: 11, color: p.color, fontWeight: 600, marginTop: 2 }}>{p.purpose}</div>
          </div>
          <MedBadge level={p.medFlag} />
          <span style={{ fontSize: 18, color: "#d4d4d4", marginLeft: 4 }}>{isOpen ? "\u2212" : "+"}</span>
        </div>
        <div style={{ fontFamily: GM, fontSize: 11, color: "#525252", marginTop: 8, padding: "6px 10px", background: "#fafafa", borderRadius: 6 }}>
          {p.compounds.map((c, i) => (
            <span key={i}>{i > 0 && " \u00B7 "}<strong style={{ color: "#525252" }}>{c.mg}{typeof c.mg === "number" ? "mg" : ""}</strong> {c.abbr}</span>
          ))}
        </div>
      </div>
      {isOpen && (
        <div style={{ padding: "0 16px 18px", borderTop: "1px solid #f4f4f5" }}>
          {/* Dose selector */}
          <div style={{ marginTop: 12, marginBottom: 4 }}>
            <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Dose</div>
            <DosePicker dose={dose} setDose={setDose} color={p.color} hasHalfDose={p.hasHalfDose} />
            {dose === 0.5 && p.hasHalfDose && <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", marginTop: 4 }}>* Your usual dose</div>}
          </div>

          {/* Scaled compound totals when not 1 */}
          {dose !== 1 && (
            <div style={{ fontFamily: GM, fontSize: 11, color: "#525252", marginTop: 8, padding: "6px 10px", background: dose >= 2 ? "#fef2f2" : "#f0f9ff", borderRadius: 6, border: `1px solid ${dose >= 2 ? "#fecaca" : "#bae6fd"}` }}>
              <span style={{ fontSize: 9, color: "#737373", textTransform: "uppercase", fontWeight: 700 }}>At {dose === 0.5 ? "\u00BD" : dose === 1.5 ? "1\u00BD" : dose} gummies: </span>
              {p.compounds.map((c, i) => {
                const mg = typeof c.mg === "number" ? Math.round(c.mg * dose * 10) / 10 : c.mg;
                return <span key={i}>{i > 0 && " \u00B7 "}<strong>{typeof mg === "number" ? mg + "mg" : mg}</strong> {c.abbr}</span>;
              })}
            </div>
          )}

          {/* Warnings */}
          {warnings.map((w, i) => (
            <div key={i} style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 10, marginTop: 8 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#991b1b", textTransform: "uppercase", fontWeight: 700, marginBottom: 2 }}>{"\u26A0\uFE0F"} Warning</div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: "#991b1b" }}>{w}</div>
            </div>
          ))}

          <div style={{ marginTop: 12 }}>
            {FX_KEYS.map(k => {
              const v = fx[k];
              if (v === 0 || v === undefined) return null;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, width: 18, textAlign: "center" }}>{FX_META[k].i}</span>
                  <span style={{ fontFamily: G, fontSize: 11, color: "#525252", minWidth: 80 }}>{FX_META[k].l}</span>
                  <PBar v={v} col={k === "fog" ? "#ef4444" : p.color} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", marginBottom: 3 }}>Onset</div>
              <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#161616" }}>{p.onset}</div>
            </div>
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", marginBottom: 3 }}>Duration</div>
              <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#161616" }}>{p.duration}{durExtra && <span style={{ color: "#ef4444", fontWeight: 700 }}> {durExtra}</span>}</div>
            </div>
          </div>
          {p.price && (
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10, marginTop: 8 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", marginBottom: 4 }}>Pricing</div>
              <div style={{ fontFamily: GM, fontSize: 12, color: "#525252" }}>
                {p.price.unit && <span><strong>{p.price.unit}</strong>/gummy</span>}
                {p.price.pack && <span> {"\u00B7"} {p.price.pack}</span>}
                {p.price.sub && <span> {"\u00B7"} Sub: {p.price.sub}</span>}
              </div>
            </div>
          )}
          <div style={{
            background: p.medFlag === "high" ? "#fef2f2" : p.medFlag === "medium" ? "#fefce8" : "#f0fdf4",
            border: `1px solid ${p.medFlag === "high" ? "#fecaca" : p.medFlag === "medium" ? "#fde68a" : "#bbf7d0"}`,
            borderRadius: 8, padding: 10, marginTop: 8,
          }}>
            <div style={{ fontFamily: GM, fontSize: 9, color: p.medFlag === "high" ? "#991b1b" : p.medFlag === "medium" ? "#854d0e" : "#166534", textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>
              {"\u{1F48A}"} Medication Interaction ({p.medFlag})
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: "#414141" }}>{p.medNote}</div>
          </div>
          <div style={{ background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 8, padding: 10, marginTop: 8 }}>
            <div style={{ fontFamily: GM, fontSize: 9, color: p.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>Your Experience</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: "#414141" }}>{p.coreyNote}</div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
            <Pill bg={p.psychoactive ? "#fef3c7" : "#f0fdf4"} c={p.psychoactive ? "#92400e" : "#166534"} style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>
              {p.psychoactive ? "Psychoactive" : "Non-psychoactive"}
            </Pill>
            <Pill bg={p.drugTestRisk === "Yes" ? "#fef2f2" : p.drugTestRisk === "Very Low" ? "#f0fdf4" : "#fefce8"} c={p.drugTestRisk === "Yes" ? "#991b1b" : p.drugTestRisk === "Very Low" ? "#166534" : "#854d0e"} style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>
              Drug Test: {p.drugTestRisk}
            </Pill>
            {p.tags.map((t, i) => <Pill key={i} style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{t}</Pill>)}
          </div>
        </div>
      )}
    </div>
  );
};

const QUICK_PICKS = [
  { scenario: "Rehearsal (social, need to perform)", best: "Half Five Surge", alt: "Society's Plant High Spirits (if budget allows)", why: "Surge at half dose is your tested baseline. Low med interaction risk, proven social effect. High Spirits gave you the best rehearsal experience but costs 64% more per session.", icon: "\u{1F3AD}" },
  { scenario: "Focus & clarity (work, ADHD days)", best: "Society's Plant Good Day", alt: "Society's Plant Focused Microdose (if you want to try the nootropic stack)", why: "Good Day gave you calm presence without fog. The Focused Microdose adds Lion's Mane and L-Theanine at only 2mg THC, which is interesting given your positive ADHD screener. But Good Day has higher CBD = higher bupropion interaction.", icon: "\u{1F3AF}" },
  { scenario: "Pain relief (back, EMG soreness)", best: "Society's Plant Passion (last one) or CBDA Tincture", alt: "Half Surge + naproxen (separate timing)", why: "50mg CBD is the strongest anti-inflammatory option. The CBDA tincture at half-dose (16mg CBD) is a lower-interaction alternative. Half Surge provides THC-based pain perception reduction at lower CBD load.", icon: "\u{1FA79}" },
  { scenario: "Sleep / evening wind-down", best: "Five Indica Chill (half)", alt: "Society's Plant Good Night CBN", why: "Half Indica Chill gives you THC relaxation + CBN sedation at low CBD dose, which is better for your med profile than a high-CBD option. Good Night is CBN-only if you want zero THC.", icon: "\u{1F319}" },
  { scenario: "Lowest medication interaction risk", best: "Society's Plant F*cking Miracle", alt: "Society's Plant High Spirits", why: "F*cking Miracle has zero CBD and zero THC. High Spirits has zero CBD and 5mg THC. Both avoid the CYP2B6/2C19 inhibition that matters most for your bupropion and sertraline.", icon: "\u{1F48A}" },
  { scenario: "Best value (cheapest per session)", best: "Half Five Surge ($0.67/session)", alt: "Half Five Hybrid Vibes ($0.67/session)", why: "Five gummies at half dose are the cheapest effective option. Society's Plant runs $1.87-$2.70 per gummy. The Five products are about a third of the cost.", icon: "\u{1F4B0}" },
];

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
const MOBILE_BP = 768;
const SIDE_W_MOBILE = 280;
const EDGE_ZONE = 24;
const SWIPE_THRESHOLD = 0.35;
const SPRING = "cubic-bezier(.32,.72,0,1)";

export default function App() {
  const [sec, setSec] = useState("home");
  const [oc, setOc] = useState(null);
  const [oq, setOq] = useState(null);
  const [sel, setSel] = useState([]);
  const [q, setQ] = useState("");
  const [nav, setNav] = useState(false);
  const [mob, setMob] = useState(typeof window!=="undefined"&&window.innerWidth<MOBILE_BP);
  const [swipeX, setSwipeX] = useState(null); // null = no active gesture, 0-1 = progress
  const [openId, setOpenId] = useState(null);
  const [doseStates, setDoseStates] = useState({});
  const [prodFilter, setProdFilter] = useState("all");
  const [prodTab, setProdTab] = useState("gummies");
  const [cmpSlots, setCmpSlots] = useState([null, null, null]);
  const [cmpDoses, setCmpDoses] = useState([1, 1, 1]);
  const ref = useRef(null);

  // Touch gesture refs (no re-renders during drag)
  const touchRef = useRef({startX:0,startY:0,startT:0,tracking:false,fromEdge:false,wasOpen:false,lastX:0,lastT:0,vx:0});

  // Responsive breakpoint
  useEffect(()=>{
    const mq = window.matchMedia(`(max-width:${MOBILE_BP-1}px)`);
    const h = e => { setMob(e.matches); if(!e.matches) setSwipeX(null); };
    mq.addEventListener("change",h);
    return ()=>mq.removeEventListener("change",h);
  },[]);

  // Touch gesture handler
  useEffect(()=>{
    if(!mob) return;
    const t = touchRef.current;
    const sW = SIDE_W_MOBILE;

    const onStart = e => {
      const touch = e.touches[0];
      t.startX = touch.clientX;
      t.startY = touch.clientY;
      t.startT = Date.now();
      t.lastX = touch.clientX;
      t.lastT = t.startT;
      t.vx = 0;
      t.tracking = false;
      t.fromEdge = touch.clientX < EDGE_ZONE && !nav;
      t.wasOpen = nav;
    };

    const onMove = e => {
      const touch = e.touches[0];
      const dx = touch.clientX - t.startX;
      const dy = touch.clientY - t.startY;

      // Decide if we're tracking horizontally
      if(!t.tracking) {
        if(Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        // Only track if: edge swipe to open, or horizontal swipe-left to close when open
        const horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
        if(!horizontal) { t.fromEdge = false; return; }
        if(t.fromEdge && dx > 0) { t.tracking = true; }
        else if(t.wasOpen && dx < 0) { t.tracking = true; }
        else return;
      }

      // Calculate velocity
      const now = Date.now();
      const dt = now - t.lastT;
      if(dt > 0) { t.vx = (touch.clientX - t.lastX) / dt; }
      t.lastX = touch.clientX;
      t.lastT = now;

      // Calculate progress 0-1
      let progress;
      if(t.wasOpen) {
        progress = Math.max(0, Math.min(1, 1 + dx / sW));
      } else {
        progress = Math.max(0, Math.min(1, dx / sW));
      }
      setSwipeX(progress);
      e.preventDefault();
    };

    const onEnd = () => {
      if(!t.tracking) { t.fromEdge = false; return; }
      t.tracking = false;
      t.fromEdge = false;

      // Use velocity + position to decide
      const progress = swipeXRef.current;
      if(progress === null) return;

      const flick = Math.abs(t.vx) > 0.4;
      let shouldOpen;
      if(flick) {
        shouldOpen = t.vx > 0;
      } else {
        shouldOpen = progress > SWIPE_THRESHOLD;
      }

      setNav(shouldOpen);
      setSwipeX(null);
    };

    document.addEventListener("touchstart", onStart, {passive:true});
    document.addEventListener("touchmove", onMove, {passive:false});
    document.addEventListener("touchend", onEnd, {passive:true});
    document.addEventListener("touchcancel", onEnd, {passive:true});
    return ()=>{
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  },[mob, nav]);

  // Keep a ref of swipeX for the end handler
  const swipeXRef = useRef(swipeX);
  useEffect(()=>{ swipeXRef.current = swipeX; },[swipeX]);

  const go = useCallback(id => {
    setSec(id); setQ(""); setOc(null); setOq(null);
    if(mob) setNav(false);
    setTimeout(()=>ref.current?.scrollTo({top:0,behavior:"smooth"}),50);
  },[mob]);
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

  const prodFilters = [
    { id: "all", label: "All Products" },
    { id: "society", label: "Society's Plant" },
    { id: "five", label: "Five" },
    { id: "social", label: "Social Use" },
    { id: "focus", label: "Focus" },
    { id: "sleep", label: "Sleep" },
    { id: "lowrisk", label: "Low Med Risk" },
  ];
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (prodFilter === "all") return true;
      if (prodFilter === "society") return p.brand === "Society's Plant";
      if (prodFilter === "five") return p.brand === "Five";
      if (prodFilter === "social") return p.fx.social >= 3;
      if (prodFilter === "focus") return p.fx.focus >= 4;
      if (prodFilter === "sleep") return p.fx.sleep >= 3;
      if (prodFilter === "lowrisk") return p.medFlag === "low";
      return true;
    });
  }, [prodFilter]);

  // Sidebar visual progress: gesture overrides state
  const sideProgress = swipeX !== null ? swipeX : (nav ? 1 : 0);
  const isAnimating = swipeX === null; // spring animate when not gesturing

  const S = { // style tokens — per design-guidelines.md
    hero:{fontFamily:G,fontSize:"2.25rem",fontWeight:900,letterSpacing:"-.03em",lineHeight:1.1,color:"#161616"},
    h1:{fontFamily:G,fontSize:"1.25rem",fontWeight:700,letterSpacing:"-.01em",lineHeight:1.3,color:"#161616"},
    h2:{fontFamily:G,fontSize:"1.25rem",fontWeight:700,letterSpacing:"-.01em",lineHeight:1.3,color:"#161616"},
    h3:{fontFamily:G,fontSize:15,fontWeight:600,color:"#161616"},
    body:{fontFamily:G,fontSize:"0.9375rem",fontWeight:400,lineHeight:1.6,color:"#414141"},
    cap:{fontFamily:G,fontSize:"0.6875rem",fontWeight:600,color:"#737373",letterSpacing:"0.5px",textTransform:"uppercase"},
    mono:{fontFamily:GM,fontSize:"0.625rem",fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase"},
  };

  const R = () => { switch(sec){
    case "home": return <>
      <div style={{textAlign:"center",padding:"40px 0 28px"}}>
        <div style={{fontSize:52,marginBottom:18}}>{"\u{1F33F}"}</div>
        <h1 style={{...S.hero,margin:"0 0 14px"}}>Hemp Gummies,<br/>Explained.</h1>
        <p style={{...S.body,color:"#737373",maxWidth:360,margin:"0 auto",fontSize:16,lineHeight:1.55}}>A straightforward guide to what they are, what each compound does, and what the research says about safety.</p>
      </div>
      <Card s={{background:"#f9f9fa",border:"none"}}>
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
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Cannabis, hemp, marijuana, and weed. What the words mean.</p>
      <Card><div style={{...S.body,fontSize:14}}>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#161616"}}>Cannabis</strong> is the plant. A genus with many varieties, like "citrus" includes oranges and lemons.</p>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#161616"}}>Hemp</strong> is cannabis with less than 0.3% THC by weight. Federally legal since the 2018 Farm Bill. Used for clothing, food, building materials, and wellness supplements.</p>
        <p style={{margin:"0 0 14px"}}><strong style={{color:"#161616"}}>Marijuana</strong> is cannabis with more than 0.3% THC. What people smoke to get high. Still federally illegal.</p>
        <p style={{margin:0}}><strong style={{color:"#161616"}}>"Weed"</strong> is slang that usually means marijuana. That's why it triggers concern. Hemp gummies are not marijuana.</p>
      </div></Card>
      <Info><strong>Analogy:</strong> Poppy seeds come from the same plant as opium. A poppy seed bagel doesn't mean you're using opioids. Same plant, completely different product. Hemp gummies relate to marijuana the same way.</Info>
      <Card><h3 style={{...S.h3,marginBottom:8}}>The plant makes many compounds</h3><p style={{...S.body,fontSize:14,margin:0}}>Cannabis produces 100+ compounds called cannabinoids. THC is the only one primarily responsible for a "high." The others each do something different, and most are non-psychoactive. Manufacturers extract specific compounds at precise doses for targeted effects.</p></Card>
      <Card s={{background:"#f9f9fa",border:"none"}}><h3 style={{...S.h3,marginBottom:8}}>Your body already makes cannabinoids</h3><p style={{...S.body,fontSize:14,margin:0}}>Every human body has an endocannabinoid system producing its own cannabinoid-like compounds. It regulates mood, sleep, appetite, pain, and immune response. Plant cannabinoids supplement this existing system. They're not introducing something foreign.</p></Card>
    </>;

    case "compounds": return <>
      <h1 style={{...S.h1,marginBottom:8}}>The Compounds</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Six cannabinoids. What each does, how it feels at different doses, and what to know.</p>
      <Card s={{background:"#f9f9fa",border:"none",padding:16}}>
        <div style={{...S.mono,color:"#737373",marginBottom:10,textTransform:"uppercase"}}>Quick Reference</div>
        {CMP.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #F4F4F5"}}>
          <span style={{fontSize:16,width:24,textAlign:"center"}}>{c.icon}</span>
          <span style={{...S.mono,color:c.col,fontWeight:700,fontSize:12,minWidth:38}}>{c.ab}</span>
          <span style={{...S.cap,flex:1,fontSize:12}}>{c.tag}</span>
          {c.psy?<Pill bg="#FEF3C7" c="#92400E">High</Pill>:<Pill bg="#F0FDF4" c="#166534">No high</Pill>}
        </div>)}
      </Card>
      {CMP.map(c=>{const open=oc===c.id; return <div key={c.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:`1.5px solid ${open?c.col+"40":"#f0f0f0"}`,marginBottom:12,transition:"all .25s",boxShadow:open?`0 4px 20px ${c.col}10`:"none"}}>
        <div onClick={()=>setOc(open?null:c.id)} style={{padding:"16px 18px",cursor:"pointer"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{...S.mono,color:c.col,fontWeight:700,fontSize:15}}>{c.ab}</span>
                <span style={{...S.cap,fontSize:12}}>{c.tag}</span>
              </div>
              <p style={{...S.body,fontSize:13,margin:"4px 0 0",color:"#737373"}}>{c.one}</p>
            </div>
            <span style={{fontSize:20,color:"#d4d4d4",transition:"transform .2s",transform:open?"rotate(45deg)":"none"}}>+</span>
          </div>
        </div>
        {open&&<div style={{padding:"0 18px 20px"}}>
          <div style={{height:1,background:"#f0f0f0",marginBottom:16}}/>
          <div style={{...S.mono,color:"#737373",marginBottom:16}}>{c.full}</div>
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
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Toggle compounds to see the combined profile change in real time.</p>
      <Card>
        <div style={{...S.mono,color:"#737373",textTransform:"uppercase",marginBottom:12}}>Select compounds</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {CMP.map(c=>{const on=sel.includes(c.id); return <button key={c.id} onClick={()=>tog(c.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,border:`1.5px solid ${on?c.col:"#e8e8e8"}`,background:on?c.bg:"#fff",cursor:"pointer",transition:"all .2s",fontFamily:G}}>
            <span style={{fontSize:16}}>{c.icon}</span>
            <span style={{fontSize:13,fontWeight:on?700:500,color:on?c.col:"#737373"}}>{c.ab}</span>
          </button>;})}
        </div>
      </Card>
      <Card s={{background:sel.length?"#FAFAFA":"#f0f0f0",border:"none"}}>
        <div style={{...S.mono,color:"#737373",textTransform:"uppercase",marginBottom:14}}>{sel.length?"Combined Effect Profile":"Select compounds above"}</div>
        {sel.length>0&&<>
          {Object.entries(EFX).map(([k,m])=><div key={k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:14,width:22,textAlign:"center"}}>{m.i}</span>
            <span style={{...S.body,fontSize:13,minWidth:90}}>{m.l}</span>
            <Bar v={blend[k]} col="#3B82F6" h={6}/>
            <span style={{...S.mono,color:"#737373",minWidth:16,textAlign:"right"}}>{blend[k]}</span>
          </div>)}
          <div style={{height:1,background:"#e8e8e8",margin:"16px 0"}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {anyP?<Pill bg="#FEF3C7" c="#92400E">Psychoactive</Pill>:<Pill bg="#F0FDF4" c="#166534">Non-psychoactive</Pill>}
            {anyD?<Pill bg="#FFF1F2" c="#9F1239">May trigger drug test</Pill>:<Pill bg="#F0FDF4" c="#166534">Drug test safe</Pill>}
          </div>
          <div style={{...S.mono,color:"#737373",textTransform:"uppercase",marginBottom:8}}>How these interact</div>
          {sel.map(id=>{const c=CMP.find(x=>x.id===id); return <div key={id} style={{display:"flex",gap:8,marginBottom:8}}>
            <span style={{...S.mono,color:c.col,fontWeight:700,minWidth:36}}>{c.ab}</span>
            <span style={{...S.body,fontSize:12,color:"#737373"}}>{c.stack}</span>
          </div>;})}
        </>}
      </Card>
      <div style={{...S.mono,color:"#737373",textTransform:"uppercase",marginBottom:10}}>Common combinations</div>
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
      <p style={{...S.body,color:"#737373",marginBottom:12}}>Every product, every compound, every interaction flag.</p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
        <Pill bg="#fef2f2" c="#991b1b" style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>Sertraline 50mg</Pill>
        <Pill bg="#fef2f2" c="#991b1b" style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>Bupropion 150mg</Pill>
        <Pill bg="#f0f0f0" c="#525252" style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>Cetirizine</Pill>
      </div>
      <div style={{ display: "flex", gap: 4, background: "#f0f0f0", borderRadius: 10, padding: 3, marginBottom: 16 }}>
        {[{ id: "gummies", label: "Gummies" }, { id: "tinctures", label: "Tinctures" }, { id: "quickpick", label: "Picks" }, { id: "compare", label: "vs" }, { id: "grid", label: "Grid" }].map(t => (
          <button key={t.id} onClick={() => setProdTab(t.id)} style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
            background: prodTab === t.id ? "#fff" : "transparent",
            color: prodTab === t.id ? "#161616" : "#737373",
            fontFamily: GM, fontSize: 11, fontWeight: 600, cursor: "pointer",
            boxShadow: prodTab === t.id ? "0 1px 3px rgba(0,0,0,.08)" : "none",
          }}>{t.label}</button>
        ))}
      </div>
      {prodTab === "gummies" && (<>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
          {prodFilters.map(f => (
            <button key={f.id} onClick={() => setProdFilter(f.id)} style={{
              padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer",
              fontFamily: GM, fontSize: 10, fontWeight: 600,
              background: prodFilter === f.id ? "#18181b" : "#fff",
              color: prodFilter === f.id ? "#fff" : "#525252",
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ fontFamily: GM, fontSize: 10, color: "#737373", marginBottom: 8 }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </div>
        {filteredProducts.map(p => (
          <ProductCard
            key={p.id} p={p}
            isOpen={openId === p.id}
            onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            dose={doseStates[p.id] ?? (p.hasHalfDose ? 0.5 : 1)}
            setDose={(v) => setDoseStates(s => ({...s, [p.id]: v}))}
          />
        ))}
      </>)}
      {prodTab === "tinctures" && (<>
        <div style={{ fontFamily: GM, fontSize: 10, color: "#737373", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
          Society's Plant Tinctures
        </div>
        {TINCTURES.map(t => (
          <Card key={t.id} s={{padding:18}}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: G, fontSize: 16, fontWeight: 700, color: "#161616" }}>{t.name}</div>
                <div style={{ fontFamily: GM, fontSize: 11, color: t.color, fontWeight: 600 }}>{t.purpose}</div>
              </div>
              <MedBadge level={t.medFlag} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
                <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", marginBottom: 3 }}>Per 1ml Dose</div>
                <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#161616" }}>{t.perMl}</div>
              </div>
              <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
                <div style={{ fontFamily: GM, fontSize: 9, color: "#737373", textTransform: "uppercase", marginBottom: 3 }}>Price</div>
                <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#161616" }}>{t.price}</div>
              </div>
            </div>
            <div style={{
              background: t.medFlag === "high" ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${t.medFlag === "high" ? "#fecaca" : "#bbf7d0"}`,
              borderRadius: 8, padding: 10, marginBottom: 8,
            }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: t.medFlag === "high" ? "#991b1b" : "#166534", textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>
                {"\u{1F48A}"} Medication Interaction
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6, color: "#414141" }}>{t.medNote}</div>
            </div>
            <div style={{ background: `${t.color}08`, border: `1px solid ${t.color}20`, borderRadius: 8, padding: 10 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: t.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>Notes</div>
              <div style={{ fontSize: 12, lineHeight: 1.6, color: "#414141" }}>{t.coreyNote}</div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
              {t.tags.map((tag, i) => <Pill key={i} style={{fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{tag}</Pill>)}
            </div>
          </Card>
        ))}
        <Info>
          <strong style={{ color: "#525252" }}>Note on mushroom tinctures:</strong> Society's Plant also sells Chill, Dream, and Flow mushroom + CBD tinctures ($57-$61 each). All three contain ~33mg CBD per dose, which creates the same bupropion interaction concern. The mushroom ingredients (Reishi, Lion's Mane, Cordyceps, etc.) are generally safe with your medications. If you're interested in mushroom supplementation, a standalone mushroom product without CBD would avoid the drug interaction issue entirely.
        </Info>
      </>)}
      {prodTab === "quickpick" && (<>
        <div style={{ fontFamily: GM, fontSize: 10, color: "#737373", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          Best picks for your situation
        </div>
        {QUICK_PICKS.map((pick, i) => (
          <Card key={i} s={{padding:16}}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{pick.icon}</span>
              <div style={{ fontFamily: G, fontSize: 14, fontWeight: 700, color: "#161616" }}>{pick.scenario}</div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: GM, fontSize: 9, fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>Best: </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#161616" }}>{pick.best}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: GM, fontSize: 9, fontWeight: 700, color: "#525252", textTransform: "uppercase" }}>Alt: </span>
              <span style={{ fontSize: 12, color: "#525252" }}>{pick.alt}</span>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: "#525252" }}>{pick.why}</div>
          </Card>
        ))}
        <div style={{ background: "#18181b", borderRadius: 12, padding: 16, marginTop: 12, color: "#d4d4d4" }}>
          <div style={{ fontFamily: GM, fontSize: 10, fontWeight: 700, color: "#525252", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            The bupropion factor
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>
            You're less than two weeks into bupropion. Over the next month, your baseline anxiety and focus will shift as the medication reaches steady state. The gummy that feels essential now may feel unnecessary in six weeks. Let the bupropion settle before committing to a regular gummy routine. Use gummies situationally, not daily, until you know what your new medicated baseline feels like.
          </div>
        </div>
      </>)}
      {prodTab === "compare" && (() => {
        const slots = cmpSlots.map((id, idx) => {
          const p = id ? PRODUCTS.find(x => x.id === id) : null;
          const d = p ? cmpDoses[idx] : 1;
          return { id, p, d, fx: p ? scaleFx(p, d) : null, w: p ? doseWarnings(p, d) : [], idx };
        });
        const active = slots.filter(s => s.p);
        const usedIds = cmpSlots.filter(Boolean);
        const allWarns = active.flatMap(s => s.w.map(w => ({ w, p: s.p })));
        const setSlot = (i, val) => {
          setCmpSlots(prev => { const n = [...prev]; n[i] = val || null; return n; });
          const prod = PRODUCTS.find(p => p.id === val);
          setCmpDoses(prev => { const n = [...prev]; n[i] = prod?.hasHalfDose ? 0.5 : 1; return n; });
        };
        const setDose = (i, val) => setCmpDoses(prev => { const n = [...prev]; n[i] = val; return n; });
        const selSt = { width:"100%", padding:"10px 8px", borderRadius:8, border:"1px solid #e5e7eb", fontFamily:G, fontSize:13, fontWeight:600, background:"#fff", color:"#161616" };
        return <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:16 }}>
            {[0,1,2].map(i => (
              <div key={i}>
                <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Product {["A","B","C"][i]}</div>
                <select value={cmpSlots[i]||""} onChange={e => setSlot(i, e.target.value)} style={selSt}>
                  <option value="">Choose...</option>
                  {PRODUCTS.filter(p => !usedIds.includes(p.id) || p.id === cmpSlots[i]).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            ))}
          </div>
          {active.length >= 2 ? <>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${active.length}, 1fr)`, gap:10, marginBottom:14 }}>
              {active.map(s => (
                <div key={s.p.id} style={{ background:`${s.p.color}0a`, border:`1.5px solid ${s.p.color}25`, borderRadius:12, padding:12, textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{s.p.icon}</div>
                  <div style={{ fontFamily:G, fontSize:12, fontWeight:700, color:"#161616", lineHeight:1.2 }}>{s.p.name}</div>
                  <div style={{ fontFamily:GM, fontSize:9, color:s.p.color, fontWeight:600, marginTop:2 }}>{s.p.brand}</div>
                  <div style={{ marginTop:6 }}><MedBadge level={s.p.medFlag}/></div>
                  <div style={{ marginTop:8, display:"flex", justifyContent:"center" }}>
                    <DosePicker dose={s.d} setDose={v => setDose(s.idx, v)} color={s.p.color} hasHalfDose={s.p.hasHalfDose} compact />
                  </div>
                  {s.d !== 1 && (
                    <div style={{ fontFamily:GM, fontSize:8, color:"#525252", marginTop:6, padding:"4px 5px", background:"#f4f4f5", borderRadius:4, textAlign:"left" }}>
                      {s.p.compounds.map((c, ci) => {
                        const mg = typeof c.mg === "number" ? Math.round(c.mg * s.d * 10) / 10 : c.mg;
                        return <span key={ci}>{ci > 0 && " \u00B7 "}<strong>{typeof mg === "number" ? mg + "mg" : mg}</strong> {c.abbr}</span>;
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {allWarns.length > 0 && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:10, marginBottom:10 }}>
                <div style={{ fontFamily:GM, fontSize:9, color:"#991b1b", textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>{"\u26A0\uFE0F"} Warnings</div>
                {allWarns.map((w, i) => <div key={i} style={{ fontSize:11, lineHeight:1.5, color:"#991b1b" }}><strong>{w.p.name}:</strong> {w.w}</div>)}
              </div>
            )}
            <Card>
              <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Effects</div>
              <div style={{ display:"flex", gap:12, marginBottom:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
                {active.map(s => <div key={s.p.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:s.p.color }}/>
                  <span style={{ fontFamily:GM, fontSize:9, color:"#737373" }}>{s.p.name}</span>
                </div>)}
              </div>
              {FX_KEYS.map(k => {
                const vals = active.map(s => s.fx[k] || 0);
                if (vals.every(v => v === 0)) return null;
                const isNeg = k === "fog";
                return <div key={k} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                  <span style={{ fontSize:11, width:16, textAlign:"center" }}>{FX_META[k].i}</span>
                  <span style={{ fontFamily:G, fontSize:11, color:"#525252", minWidth:70, flex:"0 0 70px" }}>{FX_META[k].l}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {active.map((s, si) => {
                      const v = s.fx[k] || 0;
                      return <div key={s.p.id} style={{ display:"flex", alignItems:"center", gap:0 }}>
                        {si > 0 && <div style={{ width:1, height:8, background:"#e0e0e0", marginRight:6 }}/>}
                        <div style={{ display:"flex", gap:2 }}>
                          {[0,1,2,3,4].map(i => <div key={i} style={{ width:11, height:5, borderRadius:3, background: i < Math.abs(v) ? ((v < 0 || isNeg) ? "#ef4444" : s.p.color) : "#e8e8e8" }}/>)}
                        </div>
                      </div>;
                    })}
                  </div>
                </div>;
              })}
            </Card>
            <Card>
              <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Details</div>
              {[
                { l:"Onset", fn: s => s.p.onset },
                { l:"Duration", fn: s => s.p.duration + (durationExtra(s.d) ? " " + durationExtra(s.d) : "") },
                { l:"Price", fn: s => s.p.price.unit + "/ea" },
                { l:"Drug Test", fn: s => s.p.drugTestRisk },
              ].map((r, i) => <div key={i} style={{ display:"grid", gridTemplateColumns:`72px repeat(${active.length}, 1fr)`, gap:8, padding:"7px 0", borderBottom: i < 3 ? "1px solid #f4f4f5" : "none" }}>
                <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase" }}>{r.l}</div>
                {active.map(s => <div key={s.p.id} style={{ fontFamily:GM, fontSize:11, color:"#161616", fontWeight:600 }}>{r.fn(s)}</div>)}
              </div>)}
            </Card>
            <Card>
              <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Med Interaction</div>
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${active.length}, 1fr)`, gap:10 }}>
                {active.map(s => <div key={s.p.id} style={{ background: s.p.medFlag === "high" ? "#fef2f2" : s.p.medFlag === "medium" ? "#fefce8" : "#f0fdf4", borderRadius:8, padding:10 }}>
                  <div style={{ fontFamily:GM, fontSize:10, color:s.p.color, fontWeight:600, marginBottom:4 }}>{s.p.name}</div>
                  <div style={{ fontSize:11, lineHeight:1.5, color:"#414141" }}>{s.p.medNote}</div>
                </div>)}
              </div>
            </Card>
          </> : <Card s={{ background:"#f9f9fa", border:"none", textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>{"\u2696\uFE0F"}</div>
            <div style={{ fontFamily:G, fontSize:14, color:"#737373" }}>Select at least two products to compare</div>
          </Card>}
        </>;
      })()}
      {prodTab === "grid" && (() => {
        const allP = PRODUCTS;
        const rows = [
          { type:"header" },
          { type:"section", l:"Effects" },
          ...FX_KEYS.map(k=>({ type:"fx", k })),
          { type:"section", l:"Details" },
          { type:"row", l:"Onset", fn:p=>p.onset },
          { type:"row", l:"Duration", fn:p=>p.duration },
          { type:"row", l:"Price", fn:p=>p.price.unit },
          { type:"row", l:"Med Risk", fn:p=>p.medFlag },
          { type:"row", l:"Drug Test", fn:p=>p.drugTestRisk },
          { type:"row", l:"Psychoactive", fn:p=>p.psychoactive?"Yes":"No" },
        ];
        const colW = 72;
        const labelW = 80;
        return <>
          <div style={{ fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>All products at a glance</div>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", marginLeft:-8, marginRight:-8, paddingLeft:8, paddingRight:8, paddingBottom:8 }}>
            <div style={{ display:"inline-flex", flexDirection:"column", minWidth:"100%" }}>
              {rows.map((row,ri)=>{
                if(row.type==="header") return (
                  <div key="hdr" style={{ display:"flex", position:"sticky", top:0, zIndex:2, background:"#f9f9fa" }}>
                    <div style={{ width:labelW, flexShrink:0 }}/>
                    {allP.map(p=>(
                      <div key={p.id} style={{ width:colW, flexShrink:0, textAlign:"center", padding:"6px 2px" }}>
                        <div style={{ fontSize:16, marginBottom:2 }}>{p.icon}</div>
                        <div style={{ fontFamily:GM, fontSize:8, fontWeight:700, color:"#161616", lineHeight:1.2, wordBreak:"break-word" }}>{p.name}</div>
                        <div style={{ fontFamily:GM, fontSize:7, color:p.color, fontWeight:600 }}>{p.brand==="Society's Plant"?"SP":"Five"}</div>
                      </div>
                    ))}
                  </div>
                );
                if(row.type==="section") return (
                  <div key={row.l} style={{ display:"flex", padding:"8px 0 4px", borderBottom:"1px solid #e8e8e8" }}>
                    <div style={{ width:labelW, flexShrink:0, fontFamily:GM, fontSize:9, fontWeight:700, color:"#161616", textTransform:"uppercase", letterSpacing:1 }}>{row.l}</div>
                  </div>
                );
                if(row.type==="fx") {
                  const k = row.k;
                  const isNeg = k==="fog";
                  return (
                    <div key={k} style={{ display:"flex", alignItems:"center", padding:"3px 0", borderBottom:"1px solid #f4f4f5" }}>
                      <div style={{ width:labelW, flexShrink:0, display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ fontSize:10 }}>{FX_META[k].i}</span>
                        <span style={{ fontFamily:G, fontSize:10, color:"#525252" }}>{FX_META[k].l}</span>
                      </div>
                      {allP.map(p=>{
                        const v = p.fx[k]||0;
                        return (
                          <div key={p.id} style={{ width:colW, flexShrink:0, display:"flex", justifyContent:"center", alignItems:"center", padding:"2px 0" }}>
                            {v===0 ? <span style={{ fontFamily:GM, fontSize:9, color:"#d4d4d4" }}>{"\u2014"}</span> : (
                              <div style={{ display:"flex", gap:1 }}>
                                {[0,1,2,3,4].map(i=><div key={i} style={{ width:10, height:4, borderRadius:2, background:i<Math.abs(v)?((v<0||isNeg)?"#ef4444":p.color):"#e8e8e8" }}/>)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                if(row.type==="row") {
                  const medColors = { low:{bg:"#f0fdf4",c:"#166534"}, medium:{bg:"#fefce8",c:"#854d0e"}, high:{bg:"#fef2f2",c:"#991b1b"} };
                  return (
                    <div key={row.l} style={{ display:"flex", alignItems:"center", padding:"4px 0", borderBottom:"1px solid #f4f4f5" }}>
                      <div style={{ width:labelW, flexShrink:0, fontFamily:GM, fontSize:9, color:"#737373", textTransform:"uppercase" }}>{row.l}</div>
                      {allP.map(p=>{
                        const val = row.fn(p);
                        const isMed = row.l==="Med Risk";
                        const mc = isMed ? medColors[val] : null;
                        return (
                          <div key={p.id} style={{ width:colW, flexShrink:0, textAlign:"center", fontFamily:GM, fontSize:9, fontWeight:600, color:mc?mc.c:"#525252", padding:"2px 1px" }}>
                            {isMed ? <span style={{ background:mc.bg, padding:"1px 5px", borderRadius:4 }}>{val}</span> : val}
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div style={{ fontFamily:GM, fontSize:9, color:"#b0b0b0", marginTop:8 }}>Scroll horizontally to see all products {"\u2192"}</div>
        </>;
      })()}
      <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "#d4d4d4", lineHeight: 1.5 }}>
        Not medical advice. Discuss cannabinoid use with your prescribing doctor.<br />
        Medication interactions are based on published research as of March 2026.<br />
        Prices reflect Society's Plant spring sale pricing. Five prices are standard retail.
      </div>
    </>;

    case "safety": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Safety</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Honest information about risks, side effects, and addiction.</p>
      <Info t="safe"><strong>There has never been a recorded fatal overdose from cannabis in human history.</strong> At 5mg THC, the worst realistic outcome is feeling foggy for 2{"\u2013"}4 hours.</Info>
      <Card><h3 style={{...S.h2,marginBottom:10}}>Addiction</h3>
        <p style={{...S.body,fontSize:14,margin:"0 0 10px"}}>Cannabis does not create physical dependence. No physical withdrawal syndrome. Fundamentally different from alcohol, opioids, benzodiazepines, and nicotine.</p>
        <p style={{...S.body,fontSize:14,margin:"0 0 10px"}}>At high daily doses (20mg+), some develop mild psychological habituation: they prefer having it, but stopping has no physical consequences. Like missing morning coffee.</p>
        <p style={{...S.body,fontSize:14,margin:0}}>At 5mg a few times per week, dependence is not a realistic concern by any medical standard.</p>
      </Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>Side effects at 5mg THC</h3>
        {[{e:"Dry mouth",s:"Common",v:"Mild"},{e:"Slight appetite increase",s:"Common",v:"Mild"},{e:"Mild mental fog",s:"Sometimes",v:"Mild"},{e:"Feeling tongue-tied",s:"Sometimes",v:"Mild"},{e:"Drowsiness (with CBD/CBN)",s:"Expected",v:"Mild"},{e:"Anxiety increase",s:"Rare at 5mg",v:"Moderate"}].map((r,i)=><div key={i} style={{display:"flex",alignItems:"center",padding:"8px 0",borderBottom:i<5?"1px solid #F4F4F5":"none",gap:8}}>
          <span style={{...S.body,fontSize:13,flex:1}}>{r.e}</span><Pill>{r.s}</Pill><Pill bg={r.v==="Moderate"?"#FEF3C7":"#f0f0f0"} c={r.v==="Moderate"?"#92400E":"#525252"}>{r.v}</Pill>
        </div>)}
      </Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>What these products are not</h3><p style={{...S.body,fontSize:14,margin:0}}>Not smoked or vaped (no lung exposure). Not street drugs (licensed facilities, lab tested). Not unregulated (every batch has a COA). Not illegal. Not marijuana.</p></Card>
      <Info t="warn">Do not drive while feeling THC effects (~3{"\u2013"}4 hours). CBD-only products do not impair driving.</Info>
    </>;

    case "compare": return <>
      <h1 style={{...S.h1,marginBottom:8}}>vs. Alcohol</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Not a judgment on drinking. Data for context.</p>
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
        <div style={{...S.mono,color:"#737373",textTransform:"uppercase",marginBottom:8}}>{r.c}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><div style={{fontFamily:G,fontSize:11,fontWeight:600,color:"#EF4444",marginBottom:3}}>{"\u{1F377}"} Alcohol</div><div style={{...S.body,fontSize:12}}>{r.a}</div></div>
          <div><div style={{fontFamily:G,fontSize:11,fontWeight:600,color:"#22C55E",marginBottom:3}}>{"\u{1F33F}"} 5mg THC</div><div style={{...S.body,fontSize:12}}>{r.g}</div></div>
        </div>
      </div>)}
      <Info>Both are psychoactive. The point: cannabis at 5mg carries dramatically less measurable risk than a substance treated as completely normal. If a glass of wine at dinner is acceptable, a 5mg gummy operates in the same territory with a substantially better safety profile.</Info>
    </>;

    case "legal": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Legal Status</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>How and why hemp gummies are legal.</p>
      <Info t="safe"><strong>Federally legal in all 50 states.</strong> The 2018 Farm Bill, signed by President Trump, legalized hemp and all products under 0.3% THC by dry weight.</Info>
      <Card><h3 style={{...S.h2,marginBottom:10}}>South Carolina</h3><p style={{...S.body,fontSize:14,margin:0}}>SC legalized hemp products in alignment with the federal Farm Bill. Hemp-derived Delta-9 THC products are legal for purchase and consumption. Sold openly in retail stores. No prescription or medical card required.</p></Card>
      <Card><h3 style={{...S.h2,marginBottom:10}}>How gummies stay under the limit</h3><p style={{...S.body,fontSize:14,margin:0}}>The 0.3% limit is by dry weight. A 4{"\u2013"}5 gram gummy can legally contain up to ~12{"\u2013"}15mg THC. The gummy is mostly sugar, pectin, and flavoring. THC is a tiny fraction of total weight.</p></Card>
      <Info t="warn">Drug tests don't distinguish legal hemp THC from marijuana THC. A positive from a legal 5mg gummy looks identical to one from marijuana.</Info>
    </>;

    case "faq": return <>
      <h1 style={{...S.h1,marginBottom:8}}>FAQ</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Direct answers to common concerns.</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search questions..." style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #E4E4E7",background:"#f9f9fa",fontSize:15,fontFamily:G,outline:"none",boxSizing:"border-box",color:"#161616",marginBottom:14}}/>
      {fF.map((f,i)=>{const open=oq===i; return <div key={i} style={{background:"#fff",borderRadius:14,overflow:"hidden",border:`1px solid ${open?"#3B82F640":"#f0f0f0"}`,marginBottom:8,transition:"all .2s"}}>
        <div onClick={()=>setOq(open?null:i)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontFamily:G,fontSize:13,fontWeight:700,color:"#3B82F6",flexShrink:0,marginTop:1}}>Q</span>
          <span style={{...S.h3,fontSize:14,flex:1,lineHeight:1.4}}>{f.q}</span>
          <span style={{fontSize:18,color:"#d4d4d4",transition:"transform .2s",transform:open?"rotate(45deg)":"none"}}>+</span>
        </div>
        {open&&<div style={{padding:"0 18px 16px 42px",borderTop:"1px solid #F4F4F5"}}>
          <p style={{...S.body,fontSize:14,margin:"14px 0 0",lineHeight:1.75}}>{f.a}</p>
        </div>}
      </div>;})}
      {!fF.length&&<Card s={{textAlign:"center"}}><p style={{...S.cap,margin:0}}>No matching questions.</p></Card>}
    </>;

    case "glossary": return <>
      <h1 style={{...S.h1,marginBottom:8}}>Glossary</h1>
      <p style={{...S.body,color:"#737373",marginBottom:20}}>Every term defined simply.</p>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search terms..." style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #E4E4E7",background:"#f9f9fa",fontSize:15,fontFamily:G,outline:"none",boxSizing:"border-box",color:"#161616",marginBottom:14}}/>
      <Card>{fG.map((g,i)=><div key={i} style={{padding:"10px 0",borderBottom:i<fG.length-1?"1px solid #F4F4F5":"none"}}>
        <div style={{...S.h3,fontSize:14,marginBottom:2}}>{g.t}</div>
        <div style={{...S.body,fontSize:13,color:"#737373"}}>{g.d}</div>
      </div>)}</Card>
    </>;

    default: return null;
  }};

  const sideW = mob ? SIDE_W_MOBILE : 220;

  // Sidebar content (shared between mobile and desktop)
  const sidebarContent = <div style={{width:sideW,padding:"20px 0 24px",height:"100%",boxSizing:"border-box",overflowY:"auto"}}>
    <div style={{padding:"0 16px 16px"}}><span style={{...S.mono,fontSize:10,color:"#737373",textTransform:"uppercase",letterSpacing:".06em"}}>Sections</span></div>
    {SECS.map(s=>{const active=sec===s.id; return <div key={s.id} onClick={()=>go(s.id)} style={{padding:"9px 16px 9px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:active?"#fff":"transparent",borderRight:active?"2px solid #09090B":"2px solid transparent",transition:"all .18s ease",marginBottom:1}}>
      <span style={{...S.body,fontSize:14,color:active?"#161616":"#525252",fontWeight:active?600:400,transition:"all .18s"}}>{s.l}</span>
    </div>;})}
  </div>;

  return <div style={{minHeight:"100vh",background:"#f9f9fa",fontFamily:G,WebkitFontSmoothing:"antialiased",WebkitTapHighlightColor:"transparent",WebkitTextSizeAdjust:"100%",overscrollBehavior:"none",display:"flex",flexDirection:"column",overflow:mob?"hidden":"visible",height:mob?"100vh":"auto"}}>
    <link href={LINK_SANS} rel="stylesheet"/>
    <link href={LINK_MONO} rel="stylesheet"/>
    <style>{`
      html { scroll-behavior: smooth; }
      button { transition: transform 150ms ease; -webkit-tap-highlight-color: transparent; }
      button:active { transform: scale(0.97) !important; }
      select { transition: border-color 200ms ease; -webkit-tap-highlight-color: transparent; }
      select:focus { border-color: #161616 !important; outline: none; }
    `}</style>

    {/* Top bar */}
    <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,.88)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid rgba(0,0,0,.06)",padding:"0 20px",height:48,display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
      <button onClick={()=>{setNav(!nav);setSwipeX(null);}} aria-label="Toggle sidebar" style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:4,color:nav?"#161616":"#525252",transition:"color .2s",fontFamily:G,display:"flex",alignItems:"center",justifyContent:"center",width:28,height:28,borderRadius:6}}>{nav?"\u2715":"\u2630"}</button>
      <div style={{height:16,width:1,background:"#e8e8e8"}}/>
      <div onClick={()=>go("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flex:1}}>
        <span style={{fontSize:16}}>{"\u{1F33F}"}</span>
        <span style={{...S.h3,fontSize:14,letterSpacing:"-.01em"}}>Hemp Gummies, Explained</span>
      </div>
      {sec!=="home"&&<span style={{...S.mono,fontSize:10,color:"#737373",textTransform:"uppercase",letterSpacing:".05em"}}>{SECS.find(s=>s.id===sec)?.l}</span>}
    </div>

    {/* Layout */}
    <div style={{display:"flex",flex:1,minHeight:0,position:"relative",overflow:"hidden"}}>

      {mob ? <>
        {/* ── MOBILE: overlay sidebar with gesture ── */}

        {/* Backdrop */}
        {(sideProgress > 0) && <div
          onClick={()=>{setNav(false);setSwipeX(null);}}
          style={{
            position:"absolute",inset:0,zIndex:50,
            background:`rgba(0,0,0,${sideProgress * 0.4})`,
            transition:isAnimating?`background .38s ${SPRING}`:"none",
            willChange:"background",
          }}
        />}

        {/* Sidebar drawer */}
        <div style={{
          position:"absolute",top:0,bottom:0,left:0,zIndex:60,
          width:sideW,
          transform:`translate3d(${(sideProgress - 1) * sideW}px,0,0)`,
          transition:isAnimating?`transform .38s ${SPRING}`:"none",
          background:"#f9f9fa",
          boxShadow:sideProgress > 0 ? `4px 0 24px rgba(0,0,0,${sideProgress * 0.08})` : "none",
          willChange:"transform",
          borderRight:"1px solid rgba(0,0,0,.06)",
        }}>
          {sidebarContent}
        </div>

        {/* Content with subtle scale/translate */}
        <div style={{
          flex:1,minWidth:0,display:"flex",justifyContent:"center",
          transform:`translate3d(${sideProgress * sideW * 0.15}px,0,0) scale(${1 - sideProgress * 0.03})`,
          transition:isAnimating?`transform .38s ${SPRING}`:"none",
          transformOrigin:"left center",
          willChange:"transform",
          borderRadius:sideProgress > 0 ? 12 : 0,
          overflow:"hidden",
        }}>
          <div ref={ref} style={{flex:1,maxWidth:960,width:"100%",padding:"0.5rem 1.5rem 5rem",overflowY:"auto"}}>{R()}</div>
        </div>
      </> : <>
        {/* ── DESKTOP: push sidebar ── */}
        <div style={{width:nav?sideW:0,overflow:"hidden",transition:"width .28s cubic-bezier(.4,0,.2,1)",flexShrink:0,borderRight:nav?"1px solid rgba(0,0,0,.06)":"none",background:"#f9f9fa"}}>
          {sidebarContent}
        </div>
        <div style={{flex:1,minWidth:0,display:"flex",justifyContent:"center"}}>
          <div ref={ref} style={{flex:1,maxWidth:960,width:"100%",padding:"0.5rem 1.5rem 5rem",overflowY:"auto"}}>{R()}</div>
        </div>
      </>}
    </div>
  </div>;
}
