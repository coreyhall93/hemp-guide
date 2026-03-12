import { useState, useMemo } from "react";
const G = "'Geist', system-ui, sans-serif";
const GM = "'Geist Mono', monospace";
// ─── DATA ────────────────────────────────────────────────────
const PRODUCTS = [
  // === SOCIETY'S PLANT GUMMIES ===
  {
    id: "sp-passion", brand: "Society's Plant", name: "Passion Seggs", cat: "gummy",
    purpose: "Intimacy & Relaxation", icon: "\ud83d\udc9c", color: "#a855f7",
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
    purpose: "Focus & Daytime Clarity", icon: "\u2600\ufe0f", color: "#16a34a",
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
    purpose: "Deep Focus & ADHD Support", icon: "\ud83c\udfaf", color: "#6366f1",
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
    purpose: "Energy & Appetite Control", icon: "\u26a1", color: "#0891b2",
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
    purpose: "Full High / Recreation", icon: "\ud83c\udf53", color: "#ef4444",
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
    purpose: "Euphoria & Creativity", icon: "\ud83c\udf08", color: "#ec4899",
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
    purpose: "Relaxation & Rest", icon: "\ud83d\udfe3", color: "#7c3aed",
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
    purpose: "Sleep", icon: "\ud83c\udf19", color: "#1e40af",
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
    purpose: "Sleep (Berry Flavor)", icon: "\ud83c\udf53\ud83c\udf19", color: "#4338ca",
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
    purpose: "Social & Daytime Energy", icon: "\ud83d\udfe2", color: "#22c55e",
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
    purpose: "Social with Clarity", icon: "\ud83d\udd35", color: "#3b82f6",
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
    purpose: "Evening & Sleep", icon: "\ud83d\udfe3", color: "#6366f1",
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
    purpose: "Pain & Inflammation", icon: "\ud83e\ude79", color: "#059669",
    perMl: "32mg CBD + 12mg CBDA", totalBottle: "1000mg", size: "30ml",
    price: "$53.04 (sale)", pricePerDose: "~$1.77/ml",
    medFlag: "high",
    medNote: "32mg CBD per dose strongly inhibits CYP2B6 (bupropion) and CYP2C19 (sertraline). CBDA interactions less studied but likely similar. Use smaller doses and separate from medication timing.",
    coreyNote: "You haven't tried this. Relevant for your back pain and EMG soreness. Could be a daily anti-inflammatory option, but the high CBD means bupropion interaction concerns. Start with half a dropper (16mg CBD) and see how it goes.",
    tags: ["CBDA", "Pain", "Anti-inflammatory"],
  },
  {
    id: "sp-thrive", brand: "Society's Plant", name: "Thrive Mushroom + CBD", cat: "tincture",
    purpose: "Overall Wellness", icon: "\ud83c\udf3f", color: "#10b981",
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
  relaxation:{ l: "Relaxation",     i: "\ud83e\uddd8" },
  focus:     { l: "Focus",          i: "\ud83c\udfaf" },
  energy:    { l: "Energy",         i: "\u26a1" },
  social:    { l: "Social Ease",    i: "\ud83d\udcac" },
  clarity:   { l: "Clarity",        i: "\ud83d\udc8e" },
  sleep:     { l: "Sleep",          i: "\ud83c\udf19" },
  pain:      { l: "Pain Relief",    i: "\ud83e\ude79" },
  fog:       { l: "Fog Risk",       i: "\ud83c\udf2b\ufe0f" },
  appetite:  { l: "Appetite",       i: "\ud83c\udf7d\ufe0f" },
};
const FX_KEYS = Object.keys(FX_META);
// ─── COMPONENTS ──────────────────────────────────────────────
const Pill = ({ children, bg = "#f4f4f5", c = "#71717a", style = {} }) => (
  <span style={{ fontFamily: GM, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: bg, color: c, letterSpacing: .3, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{children}</span>
);
const MedBadge = ({ level }) => {
  const m = { low: { bg: "#f0fdf4", c: "#166534", t: "Low Med Risk" }, medium: { bg: "#fefce8", c: "#854d0e", t: "Med Risk" }, high: { bg: "#fef2f2", c: "#991b1b", t: "High Med Risk" } }[level];
  return <Pill bg={m.bg} c={m.c}>{m.t}</Pill>;
};
const Bar = ({ v, col }) => {
  const abs = Math.abs(v);
  const neg = v < 0;
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ width: 16, height: 5, borderRadius: 3, background: i < abs ? (neg ? "#ef4444" : col) : "#e5e7eb" }} />
      ))}
      {neg && <span style={{ fontFamily: GM, fontSize: 8, color: "#ef4444", fontWeight: 700, marginLeft: 1 }}>{"\u2193"}</span>}
    </div>
  );
};
const ProductCard = ({ p, isOpen, onToggle, showHalf, setShowHalf }) => {
  const fx = (showHalf && p.fxHalf) ? p.fxHalf : p.fx;
  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: `1.5px solid ${isOpen ? p.color : "#e5e7eb"}`,
      transition: "all .2s", marginBottom: 10,
      boxShadow: isOpen ? `0 6px 24px ${p.color}10` : "0 1px 2px rgba(0,0,0,.03)",
    }}>
      <div onClick={onToggle} style={{ padding: "14px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: G, fontSize: 15, fontWeight: 700, color: "#09090b" }}>{p.name}</span>
              <span style={{ fontFamily: GM, fontSize: 10, color: "#a1a1aa" }}>{p.brand}</span>
            </div>
            <div style={{ fontFamily: GM, fontSize: 11, color: p.color, fontWeight: 600, marginTop: 2 }}>{p.purpose}</div>
          </div>
          <MedBadge level={p.medFlag} />
          <span style={{ fontSize: 18, color: "#d4d4d8", marginLeft: 4 }}>{isOpen ? "\u2212" : "+"}</span>
        </div>
        {/* Compact compound list */}
        <div style={{ fontFamily: GM, fontSize: 11, color: "#71717a", marginTop: 8, padding: "6px 10px", background: "#fafafa", borderRadius: 6 }}>
          {p.compounds.map((c, i) => (
            <span key={i}>{i > 0 && " \u00b7 "}<strong style={{ color: "#52525b" }}>{c.mg}{typeof c.mg === "number" ? "mg" : ""}</strong> {c.abbr}</span>
          ))}
        </div>
      </div>
      {isOpen && (
        <div style={{ padding: "0 16px 18px", borderTop: "1px solid #f4f4f5" }}>
          {/* Half dose toggle */}
          {p.hasHalfDose && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 4 }}>
              {["Full", "Half (your dose)"].map((label, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setShowHalf(i === 1); }} style={{
                  padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer",
                  fontFamily: GM, fontSize: 10, fontWeight: 600,
                  background: (i === 1) === showHalf ? p.color : "#fff",
                  color: (i === 1) === showHalf ? "#fff" : "#71717a",
                }}>{label}</button>
              ))}
            </div>
          )}
          {/* Effect bars */}
          <div style={{ marginTop: 12 }}>
            {FX_KEYS.map(k => {
              const v = fx[k];
              if (v === 0 || v === undefined) return null;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, width: 18, textAlign: "center" }}>{FX_META[k].i}</span>
                  <span style={{ fontFamily: G, fontSize: 11, color: "#71717a", minWidth: 80 }}>{FX_META[k].l}</span>
                  <Bar v={v} col={k === "fog" ? "#ef4444" : p.color} />
                </div>
              );
            })}
          </div>
          {/* Details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 3 }}>Onset</div>
              <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#09090b" }}>{p.onset}</div>
            </div>
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 3 }}>Duration</div>
              <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#09090b" }}>{p.duration}</div>
            </div>
          </div>
          {/* Pricing */}
          {p.price && (
            <div style={{ background: "#fafafa", borderRadius: 8, padding: 10, marginTop: 8 }}>
              <div style={{ fontFamily: GM, fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 4 }}>Pricing</div>
              <div style={{ fontFamily: GM, fontSize: 12, color: "#52525b" }}>
                {p.price.unit && <span><strong>{p.price.unit}</strong>/gummy</span>}
                {p.price.pack && <span> {"\u00b7"} {p.price.pack}</span>}
                {p.price.sub && <span> {"\u00b7"} Sub: {p.price.sub}</span>}
              </div>
            </div>
          )}
          {/* Med interaction */}
          <div style={{
            background: p.medFlag === "high" ? "#fef2f2" : p.medFlag === "medium" ? "#fefce8" : "#f0fdf4",
            border: `1px solid ${p.medFlag === "high" ? "#fecaca" : p.medFlag === "medium" ? "#fde68a" : "#bbf7d0"}`,
            borderRadius: 8, padding: 10, marginTop: 8,
          }}>
            <div style={{ fontFamily: GM, fontSize: 9, color: p.medFlag === "high" ? "#991b1b" : p.medFlag === "medium" ? "#854d0e" : "#166534", textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>
              {"\ud83d\udc8a"} Medication Interaction ({p.medFlag})
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: "#3f3f46" }}>{p.medNote}</div>
          </div>
          {/* Corey's notes */}
          <div style={{ background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 8, padding: 10, marginTop: 8 }}>
            <div style={{ fontFamily: GM, fontSize: 9, color: p.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>Your Experience</div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: "#3f3f46" }}>{p.coreyNote}</div>
          </div>
          {/* Tags */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
            <Pill bg={p.psychoactive ? "#fef3c7" : "#f0fdf4"} c={p.psychoactive ? "#92400e" : "#166534"}>
              {p.psychoactive ? "Psychoactive" : "Non-psychoactive"}
            </Pill>
            <Pill bg={p.drugTestRisk === "Yes" ? "#fef2f2" : p.drugTestRisk === "Very Low" ? "#f0fdf4" : "#fefce8"} c={p.drugTestRisk === "Yes" ? "#991b1b" : p.drugTestRisk === "Very Low" ? "#166534" : "#854d0e"}>
              Drug Test: {p.drugTestRisk}
            </Pill>
            {p.tags.map((t, i) => <Pill key={i}>{t}</Pill>)}
          </div>
        </div>
      )}
    </div>
  );
};
// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [openId, setOpenId] = useState(null);
  const [halfStates, setHalfStates] = useState({});
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("products");
  const filters = [
    { id: "all", label: "All Products" },
    { id: "society", label: "Society's Plant" },
    { id: "five", label: "Five" },
    { id: "social", label: "Social Use" },
    { id: "focus", label: "Focus" },
    { id: "sleep", label: "Sleep" },
    { id: "lowrisk", label: "Low Med Risk" },
  ];
  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      if (filter === "all") return true;
      if (filter === "society") return p.brand === "Society's Plant";
      if (filter === "five") return p.brand === "Five";
      if (filter === "social") return p.fx.social >= 3;
      if (filter === "focus") return p.fx.focus >= 4;
      if (filter === "sleep") return p.fx.sleep >= 3;
      if (filter === "lowrisk") return p.medFlag === "low";
      return true;
    });
  }, [filter]);
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: G }}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 14px 40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: GM, fontSize: 10, fontWeight: 700, color: "#a1a1aa", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
            Corey's Gummy Reference
          </div>
          <h1 style={{ fontFamily: G, fontSize: 22, fontWeight: 800, color: "#09090b", margin: 0, letterSpacing: "-.03em", lineHeight: 1.2 }}>
            Society's Plant + Five
          </h1>
          <p style={{ fontFamily: G, fontSize: 12, color: "#71717a", marginTop: 4 }}>
            Every product, every compound, every interaction flag.
          </p>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 8 }}>
            <Pill bg="#fef2f2" c="#991b1b">Sertraline 50mg</Pill>
            <Pill bg="#fef2f2" c="#991b1b">Bupropion 150mg</Pill>
            <Pill bg="#f4f4f5" c="#71717a">Cetirizine</Pill>
          </div>
        </div>
        {/* Tab toggle */}
        <div style={{ display: "flex", gap: 4, background: "#f4f4f5", borderRadius: 10, padding: 3, marginBottom: 16 }}>
          {[{ id: "products", label: "Gummies" }, { id: "tinctures", label: "Tinctures" }, { id: "quickpick", label: "Quick Pick" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#09090b" : "#a1a1aa",
              fontFamily: GM, fontSize: 11, fontWeight: 600, cursor: "pointer",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            }}>{t.label}</button>
          ))}
        </div>
        {/* GUMMIES TAB */}
        {tab === "products" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
              {filters.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer",
                  fontFamily: GM, fontSize: 10, fontWeight: 600,
                  background: filter === f.id ? "#18181b" : "#fff",
                  color: filter === f.id ? "#fff" : "#71717a",
                }}>{f.label}</button>
              ))}
            </div>
            <div style={{ fontFamily: GM, fontSize: 10, color: "#a1a1aa", marginBottom: 8 }}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </div>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                isOpen={openId === p.id}
                onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                showHalf={halfStates[p.id] ?? true}
                setShowHalf={(v) => setHalfStates(s => ({...s, [p.id]: v}))}
              />
            ))}
          </>
        )}
        {/* TINCTURES TAB */}
        {tab === "tinctures" && (
          <>
            <div style={{ fontFamily: GM, fontSize: 10, color: "#a1a1aa", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              Society's Plant Tinctures
            </div>
            {TINCTURES.map(t => (
              <div key={t.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 18, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: G, fontSize: 16, fontWeight: 700, color: "#09090b" }}>{t.name}</div>
                    <div style={{ fontFamily: GM, fontSize: 11, color: t.color, fontWeight: 600 }}>{t.purpose}</div>
                  </div>
                  <MedBadge level={t.medFlag} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontFamily: GM, fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 3 }}>Per 1ml Dose</div>
                    <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#09090b" }}>{t.perMl}</div>
                  </div>
                  <div style={{ background: "#fafafa", borderRadius: 8, padding: 10 }}>
                    <div style={{ fontFamily: GM, fontSize: 9, color: "#a1a1aa", textTransform: "uppercase", marginBottom: 3 }}>Price</div>
                    <div style={{ fontFamily: GM, fontSize: 12, fontWeight: 700, color: "#09090b" }}>{t.price}</div>
                  </div>
                </div>
                <div style={{
                  background: t.medFlag === "high" ? "#fef2f2" : "#f0fdf4",
                  border: `1px solid ${t.medFlag === "high" ? "#fecaca" : "#bbf7d0"}`,
                  borderRadius: 8, padding: 10, marginBottom: 8,
                }}>
                  <div style={{ fontFamily: GM, fontSize: 9, color: t.medFlag === "high" ? "#991b1b" : "#166534", textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>
                    {"\ud83d\udc8a"} Medication Interaction
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "#3f3f46" }}>{t.medNote}</div>
                </div>
                <div style={{ background: `${t.color}08`, border: `1px solid ${t.color}20`, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontFamily: GM, fontSize: 9, color: t.color, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>Notes</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: "#3f3f46" }}>{t.coreyNote}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                  {t.tags.map((tag, i) => <Pill key={i}>{tag}</Pill>)}
                </div>
              </div>
            ))}
            <div style={{ background: "#fafafa", borderRadius: 12, padding: 14, border: "1px solid #e5e7eb", marginTop: 8, fontSize: 12, color: "#71717a", lineHeight: 1.7 }}>
              <strong style={{ color: "#52525b" }}>Note on mushroom tinctures:</strong> Society's Plant also sells Chill, Dream, and Flow mushroom + CBD tinctures ($57-$61 each). All three contain ~33mg CBD per dose, which creates the same bupropion interaction concern. The mushroom ingredients (Reishi, Lion's Mane, Cordyceps, etc.) are generally safe with your medications. If you're interested in mushroom supplementation, a standalone mushroom product without CBD would avoid the drug interaction issue entirely.
            </div>
          </>
        )}
        {/* QUICK PICK TAB */}
        {tab === "quickpick" && (
          <>
            <div style={{ fontFamily: GM, fontSize: 10, color: "#a1a1aa", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Best picks for your situation
            </div>
            {[
              {
                scenario: "Rehearsal (social, need to perform)",
                best: "Half Five Surge",
                alt: "Society's Plant High Spirits (if budget allows)",
                why: "Surge at half dose is your tested baseline. Low med interaction risk, proven social effect. High Spirits gave you the best rehearsal experience but costs 64% more per session.",
                icon: "\ud83c\udfad",
              },
              {
                scenario: "Focus & clarity (work, ADHD days)",
                best: "Society's Plant Good Day",
                alt: "Society's Plant Focused Microdose (if you want to try the nootropic stack)",
                why: "Good Day gave you calm presence without fog. The Focused Microdose adds Lion's Mane and L-Theanine at only 2mg THC, which is interesting given your positive ADHD screener. But Good Day has higher CBD = higher bupropion interaction.",
                icon: "\ud83c\udfaf",
              },
              {
                scenario: "Pain relief (back, EMG soreness)",
                best: "Society's Plant Passion (last one) or CBDA Tincture",
                alt: "Half Surge + naproxen (separate timing)",
                why: "50mg CBD is the strongest anti-inflammatory option. The CBDA tincture at half-dose (16mg CBD) is a lower-interaction alternative. Half Surge provides THC-based pain perception reduction at lower CBD load.",
                icon: "\ud83e\ude79",
              },
              {
                scenario: "Sleep / evening wind-down",
                best: "Five Indica Chill (half)",
                alt: "Society's Plant Good Night CBN",
                why: "Half Indica Chill gives you THC relaxation + CBN sedation at low CBD dose, which is better for your med profile than a high-CBD option. Good Night is CBN-only if you want zero THC.",
                icon: "\ud83c\udf19",
              },
              {
                scenario: "Lowest medication interaction risk",
                best: "Society's Plant F*cking Miracle",
                alt: "Society's Plant High Spirits",
                why: "F*cking Miracle has zero CBD and zero THC. High Spirits has zero CBD and 5mg THC. Both avoid the CYP2B6/2C19 inhibition that matters most for your bupropion and sertraline.",
                icon: "\ud83d\udc8a",
              },
              {
                scenario: "Best value (cheapest per session)",
                best: "Half Five Surge ($0.67/session)",
                alt: "Half Five Hybrid Vibes ($0.67/session)",
                why: "Five gummies at half dose are the cheapest effective option. Society's Plant runs $1.87-$2.70 per gummy. The Five products are about a third of the cost.",
                icon: "\ud83d\udcb0",
              },
            ].map((pick, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{pick.icon}</span>
                  <div style={{ fontFamily: G, fontSize: 14, fontWeight: 700, color: "#09090b" }}>{pick.scenario}</div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: GM, fontSize: 9, fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>Best: </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#09090b" }}>{pick.best}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: GM, fontSize: 9, fontWeight: 700, color: "#71717a", textTransform: "uppercase" }}>Alt: </span>
                  <span style={{ fontSize: 12, color: "#52525b" }}>{pick.alt}</span>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.6, color: "#71717a" }}>{pick.why}</div>
              </div>
            ))}
            <div style={{ background: "#18181b", borderRadius: 12, padding: 16, marginTop: 12, color: "#d4d4d8" }}>
              <div style={{ fontFamily: GM, fontSize: 10, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                The bupropion factor
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                You're less than two weeks into bupropion. Over the next month, your baseline anxiety and focus will shift as the medication reaches steady state. The gummy that feels essential now may feel unnecessary in six weeks. Let the bupropion settle before committing to a regular gummy routine. Use gummies situationally, not daily, until you know what your new medicated baseline feels like.
              </div>
            </div>
          </>
        )}
        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 10, color: "#d4d4d8", lineHeight: 1.5 }}>
          Not medical advice. Discuss cannabinoid use with your prescribing doctor.<br />
          Medication interactions are based on published research as of March 2026.<br />
          Prices reflect Society's Plant spring sale pricing. Five prices are standard retail.
        </div>
      </div>
    </div>
  );
}
