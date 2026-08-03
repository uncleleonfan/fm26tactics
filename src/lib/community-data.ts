// === FM-Arena Community Tested Tactics (Patch 26.3.0, Aug 2026) ===
// Source: https://fm-arena.com/table/fm26-the-best-plug-and-play-tactics/
// Tested with 2,700 matches (±1.8 PTS accuracy)

export interface TestedTactic {
  rank: number;
  name: string;
  author: string;
  formation: string;
  pts: number;       // out of 114 (38 games)
  gd: number;        // goal difference
  gf: number;        // goals for
  ga: number;        // goals against
  efficiency: string; // pts/114
  style: string;
  notes: string;
}

export const topTestedTactics: TestedTactic[] = [
  {
    rank: 1,
    name: "ZaZ - Autumn 3.39 ST",
    author: "ZaZ",
    formation: "4-2-4",
    pts: 80.0,
    gd: 45,
    gf: 93,
    ga: 48,
    efficiency: "70.2%",
    style: "Gegenpress",
    notes: "Still the benchmark. Elite attacking output, 93 goals/season. Pairs pacey wingers with a strike duo.",
  },
  {
    rank: 2,
    name: "Granny Poison 26.3 v2",
    author: "CBP87",
    formation: "4-5-1",
    pts: 78.6,
    gd: 40,
    gf: 85,
    ga: 45,
    efficiency: "68.9%",
    style: "Control Possession",
    notes: "Best defensive record among top tactics. Only 45 goals conceded. Perfect for underdog saves.",
  },
  {
    rank: 3,
    name: "Granny Poison 451 26.3 AWB",
    author: "CBP87",
    formation: "4-5-1",
    pts: 77.9,
    gd: 39,
    gf: 87,
    ga: 48,
    efficiency: "68.3%",
    style: "Control Possession",
    notes: "More attacking 4-5-1 variant. Uses Advanced Wing-Backs for width. 87 goals scored.",
  },
  {
    rank: 4,
    name: "5-1-2-2 Purge PP v4.0",
    author: "wjechal123",
    formation: "5-1-2-2",
    pts: 77.8,
    gd: 40,
    gf: 85,
    ga: 45,
    efficiency: "68.2%",
    style: "Gegenpress",
    notes: "Five-back system that still scores 85 goals. Perfect blend of defense and attack.",
  },
  {
    rank: 5,
    name: "424 TianXia",
    author: "A Smile",
    formation: "4-2-4",
    pts: 77.7,
    gd: 38,
    gf: 89,
    ga: 51,
    efficiency: "68.2%",
    style: "Gegenpress",
    notes: "Most attacking top-5 tactic. 89 goals for — ideal for elite teams wanting to dominate.",
  },
  {
    rank: 6,
    name: "ZaZ - Summer 1.2 ST",
    author: "ZaZ",
    formation: "4-2-4",
    pts: 77.2,
    gd: 38,
    gf: 91,
    ga: 53,
    efficiency: "67.7%",
    style: "Gegenpress",
    notes: "Earlier ZaZ variant. 91 goals but leakier at the back (53 conceded).",
  },
  {
    rank: 7,
    name: "3331 Bielsa's Dream POS v2",
    author: "E Land Guy",
    formation: "3-3-3-1",
    pts: 76.2,
    gd: 36,
    gf: 77,
    ga: 41,
    efficiency: "66.8%",
    style: "Control Possession",
    notes: "Best defense in the top 10. Only 41 goals conceded. Unique 3-3-3-1 shape inspired by Bielsa.",
  },
  {
    rank: 8,
    name: "424 ShanHai DM URL",
    author: "A Smile",
    formation: "4-2-4",
    pts: 76.2,
    gd: 36,
    gf: 84,
    ga: 48,
    efficiency: "66.8%",
    style: "Gegenpress",
    notes: "Another strong 4-2-4 variant with double DM protection.",
  },
  {
    rank: 9,
    name: "343 Invertide v8.1",
    author: "Abel Asano",
    formation: "3-4-3",
    pts: 76.2,
    gd: 35,
    gf: 79,
    ga: 44,
    efficiency: "66.8%",
    style: "Control Possession",
    notes: "Best 3-4-3 in testing. Inverted wing-backs create midfield overloads.",
  },
  {
    rank: 10,
    name: "4231 fwxm newveggie v2",
    author: "Feiwuxiaomei",
    formation: "4-2-3-1",
    pts: 75.9,
    gd: 36,
    gf: 81,
    ga: 45,
    efficiency: "66.6%",
    style: "Gegenpress",
    notes: "Top 4-2-3-1 in testing. Balanced output with classic #10 role.",
  },
];

// === Formation Insights from FM-Arena Test Data ===
export interface FormationInsight {
  formation: string;
  avgPts: number;
  avgGD: number;
  appearances: number;
  verdict: string;
  tier: "S" | "A" | "B";
}

export const formationInsights: FormationInsight[] = [
  { formation: "4-2-4", avgPts: 77.0, avgGD: 38, appearances: 4, verdict: "Most aggressive meta formation. 90+ goal potential with 2 strikers + 2 wingers.", tier: "S" },
  { formation: "4-5-1 / 4-1-4-1", avgPts: 76.0, avgGD: 37, appearances: 5, verdict: "Best defensive solidity. Low goals conceded, consistent results across all team levels.", tier: "S" },
  { formation: "5-1-2-2", avgPts: 77.8, avgGD: 40, appearances: 1, verdict: "Surprise meta contender. 5-defender systems can be elite with the right setup.", tier: "A" },
  { formation: "3-4-3 / 3-3-3-1", avgPts: 76.2, avgGD: 36, appearances: 2, verdict: "Three-back systems are viable. Need pacey wide CBs and hardworking wing-backs.", tier: "A" },
  { formation: "4-2-3-1", avgPts: 75.9, avgGD: 36, appearances: 1, verdict: "Classic formation still strong. Most familiar setup for transitioning players.", tier: "A" },
];

// === Community OP/Meta Player Roles (Source: Passion4FM, FM Blog) ===
export interface MetaRole {
  name: string;
  category: "in-possession" | "out-of-possession";
  opLevel: "S+" | "S" | "A";
  overview: string;
  whyOp: string[];
  weakness: string;
  keyInstructions: string[];
  keyAttributes: string[];
  bestPartners: string[];
}

export const metaRoles: MetaRole[] = [
  {
    name: "Advanced Wing-Back (AWB)",
    category: "in-possession",
    opLevel: "S+",
    overview: "Extremely attacking wide role. Positions like a winger in possession — effectively your 5th or 6th attacker. Think Dani Alves, Nuno Mendes. Tested and validated on Match Engine 26.1.",
    whyOp: [
      "Automatically creates 2-3-5 or 3-2-5 overload structures in the final third",
      "Forms inside-outside mismatch with inverted wingers (IW/IF)",
      "Build-up positioning near the halfway line acts like an extra midfielder, creating 2v1",
      "Frequently the player with the most forward passes in the team"
    ],
    weakness: "Massive space left behind. Defensive position is completely vacated on counters. Must have a DM covering, or use a back-three system to cover the half-space.",
    keyInstructions: ["Stay Wider — hug the touchline as an always-available passing option", "Cross from Byline — exploit the engine's crossing bias", "Team instruction: Focus play down their flank + Overlap"],
    keyAttributes: ["Crossing", "Stamina", "Off the Ball", "Acceleration", "Pace", "Technique", "Decisions"],
    bestPartners: ["Inverted Winger (IW)", "Inside Forward (IF)", "Defensive Midfielder (DM)", "Stopper Centre-Back (SCB)"],
  },
  {
    name: "Channel Midfielder (CHM)",
    category: "in-possession",
    opLevel: "S",
    overview: "Half-space midfielder. Makes diagonal runs between full-back and centre-back, precisely targeting the seams in the opponent's defensive line.",
    whyOp: [
      "Specially attacks the weakest area of any defensive shape — the 'half-space'",
      "Combines with a Winger (W) staying wide for devastating diagonal through-balls",
      "Opposing defenders lose their marking assignments — no one knows who to track",
      "Creates tons of cut-backs and edge-of-box shooting opportunities"
    ],
    weakness: "Requires precise service. If midfield passing quality is poor, CHM runs are wasted. High physical demand.",
    keyInstructions: ["Get Further Forward", "Move Into Channels", "Roam From Position"],
    keyAttributes: ["Off the Ball", "Decisions", "Anticipation", "Stamina", "Finishing", "First Touch", "Passing"],
    bestPartners: ["Winger (W)", "Deep-Lying Playmaker (DLP)", "False Nine (F9)"],
  },
  {
    name: "Overlapping Centre-Back (OCB)",
    category: "in-possession",
    opLevel: "S",
    overview: "Centre-back who overlaps into wide areas in possession, attacking like a full-back from the defensive line.",
    whyOp: [
      "Creates attacking threat from the most unexpected position on the pitch",
      "Opposing wingers rarely track back — free crossing opportunities",
      "Forms asymmetric attacking structures within back-three systems",
      "Completely nullifies opponent's defensive plan — no default marking assignment exists"
    ],
    weakness: "Gaps left behind require DM or adjacent CB to cover. Slow OCBs can't recover in time. Only viable in back-three systems.",
    keyInstructions: ["Stay Wider", "Run Wide With Ball", "Cross More Often"],
    keyAttributes: ["Crossing", "Pace", "Stamina", "Dribbling", "Tackling", "Positioning"],
    bestPartners: ["Defensive Drop Midfielder (DDM)", "Cover Centre-Back (CCB)", "Inverted Wing-Back (IWB)"],
  },
];

// === Role Synergy Best Combos (Source: FM Blog Role Synergy Guide) ===
export interface RoleCombo {
  combo: string;
  phase: "possession" | "defense";
  description: string;
  effect: string;
}

export const bestRoleCombos: RoleCombo[] = [
  { combo: "ACB + IFB", phase: "possession", description: "Advanced CB + Inverted Full-Back", effect: "ACB steps into DM to create midfield superiority, IFB tucks in to form a back three" },
  { combo: "HB + IWB", phase: "possession", description: "Half-Back + Inverted Wing-Back", effect: "Builds a 3-2 rest-defence structure that easily beats high presses" },
  { combo: "BBM + IWB", phase: "possession", description: "Box-to-Box Mid + Inverted Wing-Back", effect: "BBM pushes forward to score, IWB tucks in to cover — perfect rotation" },
  { combo: "IWB + W", phase: "possession", description: "Inverted Wing-Back + Winger", effect: "IWB inverts to draw midfielders, Winger stays wide for 1v1 isolation" },
  { combo: "WB + IF/IW", phase: "possession", description: "Wing-Back + Inside Forward / Inverted Winger", effect: "IF cuts inside dragging the full-back, WB overlaps for crosses — classic overlap" },
  { combo: "DLP + DM", phase: "possession", description: "Deep-Lying Playmaker + Defensive Midfielder", effect: "Perfect balance. DLP is freed to create, DM provides a protective shield" },
  { combo: "DLF + IF", phase: "possession", description: "Deep-Lying Forward + Inside Forward", effect: "DLF drops deep pulling a CB out, IF storms into the vacated space behind" },
  { combo: "DLF + SS", phase: "possession", description: "Deep-Lying Forward + Shadow Striker", effect: "Asymmetric movement is harder to mark — one drops, one bursts in vertical rotation" },
  { combo: "F9 + P", phase: "possession", description: "False Nine + Poacher", effect: "Creator-finisher split stretches the entire defensive line vertically" },
  { combo: "AP + P", phase: "possession", description: "Advanced Playmaker + Poacher", effect: "Classic passer-runner combo — any gap becomes a 1-on-1 with the keeper" },
  { combo: "DDM + PFB", phase: "defense", description: "Defensive Drop Midfielder + Pressing Full-Back", effect: "DDM drops to form a back three, PFB is free to press aggressively high" },
  { combo: "SCB + CCB", phase: "defense", description: "Stopper CB + Cover CB", effect: "Layered defence — SCB steps out to break up play, CCB sweeps behind" },
];

// === Community Consensus: What Works in FM26 (Aggregated from Reddit, Sortitoutsi, FM Scout, Passion4FM) ===
export const communityConsensus = {
  engineRewards: [
    "High press + Counter-press is the strongest instruction combo (community consensus)",
    "Pace / Acceleration / Stamina are heavily weighted in the FM26 match engine",
    "4-2-4 formation produces the most extreme results in community testing (90+ goals/season)",
    "Inverted Wingers (IW/IF) + overlapping full-backs create wing overloads — the meta answer",
    "Near-post corner routines are extremely effective (10-15 goals/season return)",
    "Three-man midfields outperform two-man midfields in virtually all tests"
  ],
  enginePunishes: [
    "Slow defenders + High defensive line = fatal through-balls behind",
    "Pure possession without penetration is extremely inefficient",
    "Two-man midfields get overrun by three-man midfields (the classic 4-4-2 problem)",
    "Very Attacking mentality leaves massive gaps in behind",
    "Isolated lone strikers with no support produce zero output"
  ],
  topCreators: ["ZaZ", "CBP87", "A Smile", "wjechal123", "Feiwuxiaomei", "Gerrard"],
  keySources: [
    "FM-Arena (fm-arena.com) — The most authoritative tactic testing data",
    "FM Scout (fmscout.com) — Largest tactic download library",
    "Sortitoutsi — Plug-and-play tactic sharing community",
    "Passion4FM — In-depth role & tactic analysis",
    "FM Blog — Tactic breakdowns and tutorials",
    "Josh Daly — Meta tactic videos and downloads"
  ]
};

// === Dual Formation System Essentials (Source: allthings.how, Ingenuity Fantasy) ===
export const dualFormationTips = [
  {
    style: "Gegenpress / High Press",
    inPossession: "4-2-3-1 或 4-3-3",
    outOfPossession: "4-4-2 Compact Block",
    tip: "In possession, link play through the #10. Out of possession, wide players tuck in to form a compact 4-4-2 defensive block"
  },
  {
    style: "Control Possession",
    inPossession: "4-3-3 (Attacking Spread)",
    outOfPossession: "5-2-3 (Defensive Compact)",
    tip: "In possession, full-backs push high to stretch width. Out of possession, they drop to form a back five"
  },
  {
    style: "Counter Attack",
    inPossession: "3-4-3 (Quick Launch)",
    outOfPossession: "5-4-1 (Deep Block)",
    tip: "In possession, both wing-backs fly forward. Out of possession, they drop into a back five + double pivot shield"
  },
];

// === Common Mistakes from FM Scout Guide ===
export const commonMistakes = [
  { mistake: "Leaving all instructions on 'Balanced'", fix: "Your team lacks a tactical identity. Decide on a core philosophy first, then select matching instructions." },
  { mistake: "Copying a tactic without checking player attributes", fix: "Check key attributes first. High-press tactics need team-wide Stamina of 13-15+." },
  { mistake: "High press + Deep defensive line mixed together", fix: "High press must pair with a high line. Deep line must pair with a low block. Otherwise massive midfield gaps appear." },
  { mistake: "Slow defenders in a high-press system", fix: "Defenders need 12+ Pace. Getting torn apart by fast strikers is inevitable otherwise." },
  { mistake: "Scrapping everything after one loss", fix: "Change 1-2 instructions at a time. Give a tactic 5-10 matches to settle." },
  { mistake: "Neglecting stamina management", fix: "High-intensity tactics need 3-4 player rotations per match. No subs after 60 minutes = guaranteed collapse." },
];
