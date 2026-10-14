// === FM-Arena Community Tested Tactics (Patch 26.3.0, Oct 2026) ===
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
  arenaUrl: string; // fm-arena.com thread page — source of truth, always available
}

export const topTestedTactics: TestedTactic[] = [
  {
    rank: 1,
    name: "ZaZ - Autumn 5.57 ST",
    author: "ZaZ",
    formation: "5-2-3",
    pts: 81.7,
    gd: 43,
    gf: 89,
    ga: 46,
    efficiency: "71.7%",
    style: "Gegenpress",
    notes: "New #1 (uploaded Sep 14) — best xG differential on the board (+36.5 for / 43.1 against). Strikerless 5-2-3: OCB/BCB/OCB back three, AWB×2, CHM×2 in the DM slots, IF×2 + CHF up top (no true ST). In possession the AWBs push on into a 3-4-3; out of possession they drop to a 5-2-3 block.",
    arenaUrl: "https://fm-arena.com/thread/20646-zaz-autumn-5-57-st/",
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
    arenaUrl: "https://fm-arena.com/thread/19999-granny-poison-26-3-v2/",
  },
  {
    rank: 3,
    name: "Orange 5122 v1",
    author: "CBP87",
    formation: "5-1-2-2",
    pts: 78.5,
    gd: 39,
    gf: 83,
    ga: 44,
    efficiency: "68.9%",
    style: "Control Possession",
    notes: "New entry (uploaded Sep 18) — CBP87's five-back jumps straight to #3 with the best defensive record in the top 5 (44 GA).",
    arenaUrl: "https://fm-arena.com/thread/20687-orange-5122-v1/",
  },
  {
    rank: 4,
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
    arenaUrl: "https://fm-arena.com/thread/20090-granny-poison-451-26-3-awb/",
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
    arenaUrl: "https://fm-arena.com/thread/18844-424-tianxia/",
  },
  {
    rank: 6,
    name: "The Raptor 3421",
    author: "CBP87",
    formation: "3-4-2-1",
    pts: 77.7,
    gd: 38,
    gf: 81,
    ga: 43,
    efficiency: "68.2%",
    style: "Gegenpress",
    notes: "New entry — 3-4-2-1 with the best defensive numbers outside the top 3 (43 GA). CBP87's third top-10 tactic this patch.",
    arenaUrl: "https://fm-arena.com/thread/20407-the-raptor-3421/",
  },
  {
    rank: 7,
    name: "ZaZ - Summer 1.2 ST",
    author: "ZaZ",
    formation: "5-1-2-2",
    pts: 77.2,
    gd: 38,
    gf: 91,
    ga: 53,
    efficiency: "67.7%",
    style: "Gegenpress",
    notes: "Highest scorer in the top 10 (91 goals) but leakier at the back (53 conceded). Strikerless 5-1-2-2: OCB/BCB/OCB back three, AWB×2, lone CHM in the DM slot, IF×2 + CHF×2 up top; drops to a 5-1-4 block out of possession.",
    arenaUrl: "https://fm-arena.com/thread/16891-zaz-summer-1-2-st/",
  },
  {
    rank: 8,
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
    arenaUrl: "https://fm-arena.com/thread/17839-3331-bielsa-s-dream-pos-v2/",
  },
  {
    rank: 9,
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
    arenaUrl: "https://fm-arena.com/thread/18652-424-shanhai-dm-url/",
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
    notes: "Top 4-2-3-1 in testing (tied with Gerrard's HIGHWAY STAR on 75.9 PTS). Balanced output with classic #10 role.",
    arenaUrl: "https://fm-arena.com/thread/17930-4231-fwxm-newveggie-v2/",
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
  { formation: "5-2-3", avgPts: 81.7, avgGD: 43, appearances: 1, verdict: "New meta king — ZaZ's strikerless 5-2-3 (Autumn 5.57 ST) took #1 with 81.7 PTS and the best xG differential on the board. In possession it morphs into a 3-4-3 with attacking wing-backs.", tier: "S" },
  { formation: "4-5-1 / 4-1-4-1", avgPts: 78.3, avgGD: 40, appearances: 2, verdict: "Strongest group on the board. CBP87's Granny Poison series dominates the shape — low goals conceded, consistent at every club level.", tier: "S" },
  { formation: "4-2-4", avgPts: 77.0, avgGD: 37, appearances: 2, verdict: "Most aggressive meta formation. 90+ goal potential with 2 strikers + 2 wingers, still two entries in the top 10.", tier: "S" },
  { formation: "5-1-2-2", avgPts: 77.9, avgGD: 39, appearances: 2, verdict: "Two elite entries — Orange 5122 v1 (#3, only 44 GA) and ZaZ's strikerless Summer 1.2 ST (#7, 91 goals). Five-defender systems can dominate with the right setup.", tier: "S" },
  { formation: "3-4-3 / 3-4-2-1 / 3-3-3-1", avgPts: 77.0, avgGD: 37, appearances: 2, verdict: "Lost its #1 — Atonement dropped off the table (v4 retesting). The Raptor 3421 still holds elite defensive numbers (43 GA).", tier: "A" },
  { formation: "4-2-3-1", avgPts: 75.9, avgGD: 36, appearances: 1, verdict: "Classic formation still strong. Most familiar setup for transitioning players (tied with HIGHWAY STAR on 75.9 PTS).", tier: "A" },
];

// === Community OP/Meta Player Roles (Source: Passion4FM, FM Blog) ===
export interface MetaRole {
  name: string;
  /** Links the card title to the /roles/{id} deep guide when this role exists in our library. */
  roleId?: string;
  category: "in-possession" | "out-of-possession";
  opLevel: "S+" | "S" | "A";
  overview: string;
  whyOp: string[];
  weakness: string;
  keyInstructions: string[];
  keyAttributes: string[];
  bestPartners: { name: string; roleId?: string }[];
}

export const metaRoles: MetaRole[] = [
  {
    name: "Advanced Wing-Back (AWB)",
    roleId: "advanced-wing-back",
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
    bestPartners: [
      { name: "Inside Forward (IF)", roleId: "inside-forward" },
      { name: "Centre Forward (CF)", roleId: "centre-forward" },
      { name: "Deep-Lying Playmaker (DLP)", roleId: "deep-lying-playmaker" },
      { name: "Centre-Back", roleId: "central-defender" },
    ],
  },
  {
    name: "Channel Midfielder (CHM)",
    roleId: "channel-midfielder",
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
    bestPartners: [
      { name: "Inside Forward (IF)", roleId: "inside-forward" },
      { name: "Deep-Lying Playmaker (DLP)", roleId: "deep-lying-playmaker" },
      { name: "Centre Forward (CF)", roleId: "centre-forward" },
    ],
  },
  {
    name: "Overlapping Centre-Back (OCB)",
    roleId: "overlapping-centre-back",
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
    bestPartners: [
      { name: "Playmaking Wing-Back (PWB)", roleId: "playmaking-wing-back" },
      { name: "Deep-Lying Playmaker (DLP)", roleId: "deep-lying-playmaker" },
      { name: "Centre-Back", roleId: "central-defender" },
    ],
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
    inPossession: "4-2-3-1 or 4-3-3",
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
