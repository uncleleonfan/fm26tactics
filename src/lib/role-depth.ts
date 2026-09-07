import type { PlayerDuty } from "@/types/tactic";

// Deep editorial content for the 17 player-role guide pages.
// Pure static data — zero runtime cost, fully server-rendered.

export interface RoleDutyGuide {
  behavior: string;
  bestWhen: string;
}

export interface RoleDepth {
  overview: string[];
  dutyGuide: Partial<Record<PlayerDuty, RoleDutyGuide>>;
  ppms: Array<{ name: string; reason: string }>;
  starPlayers: Array<{ name: string; club: string; why: string }>;
  partnerships: Array<{ partner: string; partnerId: string; note: string }>;
  whenToUse: { whenToUse: string[]; whenToAvoid: string[] };
  radar: Array<{ attribute: string; rating: number }>;
}

export const roleDepth: Record<string, RoleDepth> = {
  "sweeper-keeper": {
    overview: [
      "The Sweeper Keeper is the eleventh outfield player in disguise. Operating as the last line of a high defensive line, he reads danger before it develops, rushing off his line to clear through balls, sweeping behind centre-backs pushed up the pitch, and acting as the first phase of build-up play. In modern possession systems his starting position can sit 30-40 metres from goal, effectively turning a back four into a 3-2 base in possession.",
      "What separates a great Sweeper Keeper from a mere shot-stopper is decision-making under time pressure: when to intercept, when to stay, when to dribble past an onrushing presser and when to break lines with a raking 60-yard pass. Deploy him behind a high line alongside ball-playing defenders and the role becomes the engine of gegenpress and tiki-taka systems alike — but behind a deep block it becomes a liability, since his greatest strength, aggressive positioning, is neutered.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Sweeps conservatively: only leaves the box for clear through-ball situations and distributes short to nearby defenders.",
        bestWhen: "You keep a high line but face direct opponents who target the space behind it.",
      },
      support: {
        behavior: "Positions at the edge of the penalty area, offers an angle for back-passes and starts attacks with quick, positive distribution.",
        bestWhen: "The standard choice for possession sides — balance between sweeping risk and shot-stopping.",
      },
      attack: {
        behavior: "Pushes well beyond the box almost like a libero, aggressively intercepts loose balls far from goal and plays line-breaking passes immediately.",
        bestWhen: "Full gegenpress systems with a very high line against teams that sit deep and lump balls forward.",
      },
    },
    ppms: [
      { name: "Looks To Pass Rather Than Clear", reason: "Turns saves into attacks — the defining habit of a build-up goalkeeper." },
      { name: "Tries To Play Out Of Trouble", reason: "Composure personified: beats the press to keep your team moving forward." },
      { name: "Throws Ball Long", reason: "Instant verticality — releases your forwards before the opposition reorganizes." },
    ],
    starPlayers: [
      { name: "Manuel Neuer", club: "Bayern München", why: "The prototype. Redefined the position at the 2014 World Cup, sweeping 30 metres from goal with total composure." },
      { name: "Giorgi Mamardashvili", club: "Liverpool", why: "Elite shot-stopper who also thrives sweeping behind a high line and launching counters with his throwing range." },
      { name: "Bart Verbruggen", club: "Brighton", why: "The new generation: press-resistant on the ball and distributes with either foot." },
    ],
    partnerships: [
      { partner: "Ball-Playing Defender", partnerId: "ball-playing-defender", note: "SK sweeps behind the BPD's aggressive stepping — together they compress the space in behind a high line" },
      { partner: "Overlapping Centre-Back", partnerId: "overlapping-centre-back", note: "In a back three the OCB roams forward while the SK covers the vacated lane — total-football rotation from the back" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "Double release valve in build-up: opponents pressing one outlet always leave the other free" },
    ],
    whenToUse: {
      whenToUse: [
        "You play with a high defensive line",
        "Your GK is good at rushing out and distribution",
        "You want your keeper to act as a sweeper behind the defense",
        "Your tactic uses gegenpress or control-possession styles",
      ],
      whenToAvoid: [
        "Your GK has poor Rushing Out or One-on-Ones",
        "You play with a deep defensive line",
        "Your defenders lack the pace to recover against balls over the top",
      ],
    },
    radar: [
      { attribute: "Rushing Out", rating: 95 },
      { attribute: "Passing", rating: 80 },
      { attribute: "First Touch", rating: 75 },
      { attribute: "Composure", rating: 85 },
      { attribute: "Acceleration", rating: 70 },
      { attribute: "Decisions", rating: 90 },
    ],
  },

  "goalkeeper": {
    overview: [
      "The classic Goalkeeper role remains the safest pair of hands in football management. He stays rooted to his line, organises the defensive unit from the back, commands his six-yard box and wins matches with reflex saves rather than reconnaissance missions 40 metres from goal. For balanced tactics that do not demand build-up heroics from their number one, this is the reliable choice.",
      "While less glamorous than the Sweeper Keeper, the standard Goalkeeper excels in defensive and counter-attacking systems where clean sheets win points. His shot-stopping, aerial command and positioning decide tight games — pair him with disciplined centre-backs and let your creativity come from further up the pitch.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Stays on his line, focuses purely on shot-stopping, claiming crosses and commanding the box.",
        bestWhen: "Any system that keeps defenders between him and the game — the universal default.",
      },
    },
    ppms: [
      { name: "Tends To Punch", reason: "Under heavy aerial pressure, punching to the edge of the box beats risky catches." },
      { name: "Avoids Using Weaker Foot", reason: "Minimises sloppy clearances — safety first for a line-holding number one." },
      { name: "Throws Ball Long", reason: "Quick counter-release when you want to bypass a pressed midfield." },
    ],
    starPlayers: [
      { name: "Gianluigi Donnarumma", club: "Manchester City", why: "A wall in one-on-ones and a serial penalty hero for club and country." },
      { name: "Unai Simón", club: "Athletic Club", why: "Elite reflexes and command of area behind Athletic's disciplined defensive blocks." },
    ],
    partnerships: [
      { partner: "Central Defender", partnerId: "central-defender", note: "The traditional axis — aerial dominance in his box doubled by duel dominance in front of it" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "DLP drops to collect his simple lay-offs, letting the keeper do what he does best: save" },
      { partner: "Target Forward", partnerId: "target-forward", note: "Long clearances become assets — the TF swallows them up and brings runners into play" },
    ],
    whenToUse: {
      whenToUse: [
        "You want maximum shot-stopping reliability with zero risk",
        "Your tactic uses a standard or deeper defensive line",
        "Your GK has elite Handling, Reflexes and Aerial Reach but limited passing",
      ],
      whenToAvoid: [
        "You build up from the back with a high line — use a Sweeper Keeper instead",
        "Your GK is uncomfortable with the ball at his feet under pressure",
      ],
    },
    radar: [
      { attribute: "Aerial Reach", rating: 90 },
      { attribute: "Reflexes", rating: 95 },
      { attribute: "Handling", rating: 88 },
      { attribute: "Positioning", rating: 85 },
      { attribute: "Command of Area", rating: 85 },
      { attribute: "Decisions", rating: 78 },
    ],
  },

  "line-holding-keeper": {
    overview: [
      "New in FM26, the Line-Holding Keeper is the counter-revolution to a decade of sweeper-keeper orthodoxy. He deliberately stays deep, refuses to be drawn into races behind his defence and dominates the goal area itself — claiming crosses, smothering near-post efforts and giving low-block teams a reassuring last line that never takes unnecessary risks.",
      "This role shines in Park-the-Bus and counter-attacking setups where space behind the defence is conceded on purpose rather than defended with pace. Opponents who flood the box find a keeper rooted exactly where crosses land; opponents who run in behind find a defence that never leaves its shape. In an FM26 match engine that rewards role-scheme fit, he is the missing piece for defensive football.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Holds his line rigidly, stays inside the six-yard zone, prioritises claiming crosses and blocking near-post shots over any sweeping.",
        bestWhen: "Deep-block systems that concede space in behind and instead defend the box with numbers.",
      },
    },
    ppms: [
      { name: "Tends To Punch", reason: "Boxes flooded with bodies — strong punches clear danger when catching is unsafe." },
      { name: "Looks To Pass Rather Than Clear", reason: "Even a deep keeper should pick out a target forward to relieve pressure intelligently." },
      { name: "Avoids Using Weaker Foot", reason: "Risk aversion is the whole identity — no cheap turnovers from clearances." },
    ],
    starPlayers: [
      { name: "Yann Sommer", club: "Inter", why: "Positional intelligence in a box-defending champion side — always in the right place, never rushed." },
      { name: "Jan Oblak", club: "Atlético Madrid", why: "The definitive low-block keeper: reflex saves, claimed crosses, zero panic across a decade in Madrid." },
    ],
    partnerships: [
      { partner: "Central Defender", partnerId: "central-defender", note: "A defensive bunker — deep line, duel-winning CBs and a keeper who owns the box behind them" },
      { partner: "Target Forward", partnerId: "target-forward", note: "Every claim and punch releases the TF, turning defence into instant counter-attacks" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "Controls tempo when you finally win the ball, ensuring counters are chosen rather than forced" },
    ],
    whenToUse: {
      whenToUse: [
        "You play Park-the-Bus or deep counter-attacking football",
        "Your GK excels at Aerial Reach, Handling and Command of Area",
        "Your centre-backs are slow and need protection from balls in behind",
        "You face constant crosses and set-piece pressure",
      ],
      whenToAvoid: [
        "Any high-line system — his refusal to sweep is fatal behind aggressive defenders",
        "Possession build-up tactics that need the keeper as an extra passer",
      ],
    },
    radar: [
      { attribute: "Aerial Reach", rating: 90 },
      { attribute: "Reflexes", rating: 90 },
      { attribute: "Handling", rating: 85 },
      { attribute: "Positioning", rating: 85 },
      { attribute: "Command of Area", rating: 80 },
      { attribute: "Decisions", rating: 80 },
    ],
  },

  "ball-playing-defender": {
    overview: [
      "The Ball-Playing Defender is a quarterback in shin pads. Where others clear, he passes; where others panic, he pauses, lifts his head and slides a diagonal through the lines. His job description has two halves — defend his box with traditional rigour, then transform defence into attack with line-breaking distribution that no opposing press can smother.",
      "In possession systems he is the ignition point: your whole tempo flows through his boots. Give him a Sweeper Keeper behind and aggressive full-backs ahead, and the BPD becomes the axis of a team that refuses to ever kick it long. The trade-off is real, though — a stray pass from the deepest defender is a gift-wrapped chance, so Composure and Decisions are non-negotiable.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Focuses on defensive duties but still looks for progressive passes when safe angles appear.",
        bestWhen: "You want build-up quality without over-committing the last line.",
      },
      support: {
        behavior: "Steps into midfield with the ball at every opportunity, effectively becoming an extra midfielder in possession.",
        bestWhen: "Possession-dominant systems against sides that press man-for-man — his stepping breaks their structure.",
      },
    },
    ppms: [
      { name: "Brings Ball Out Of Defence", reason: "Carries the ball past the first press line himself instead of forcing a risky early pass." },
      { name: "Tries Long Range Passes", reason: "His raking diagonals to wide forwards are a legitimate weapon, not a clearance." },
      { name: "Switches Ball To Opposite Flank", reason: "Instantly punishes teams that press only one side of the pitch." },
    ],
    starPlayers: [
      { name: "Virgil van Dijk", club: "Liverpool", why: "The complete modern CB — imperious defending plus 70-yard diagonals off either foot." },
      { name: "Alessandro Bastoni", club: "Inter", why: "The purest BPD in world football: left-footed line-breaker who steps into midfield like a libero." },
      { name: "Gabriel Magalhães", club: "Arsenal", why: "Progressive passing machine whose out-balls drive Arsenal's build-up from the left channel." },
    ],
    partnerships: [
      { partner: "Central Defender", partnerId: "central-defender", note: "BPD plays, CD defends — the perfect complementary centre-back pairing" },
      { partner: "Sweeper Keeper", partnerId: "sweeper-keeper", note: "SK sweeps behind the BPD, allowing the BPD to push into a high line" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "Two-line build-up: BPD breaks the first line, DLP threads the second" },
    ],
    whenToUse: {
      whenToUse: [
        "You want to build attacks from the back",
        "Your CB has excellent Passing, Vision and Composure",
        "You play with a high defensive line",
        "Your tactic uses gegenpress or possession styles",
      ],
      whenToAvoid: [
        "Your CB has poor Passing or Technique",
        "You play a low block / defensive style",
        "Your CB has low Decisions — risk of costly turnovers",
      ],
    },
    radar: [
      { attribute: "Passing", rating: 85 },
      { attribute: "Composure", rating: 90 },
      { attribute: "Vision", rating: 80 },
      { attribute: "First Touch", rating: 75 },
      { attribute: "Technique", rating: 70 },
      { attribute: "Decisions", rating: 85 },
    ],
  },

  "central-defender": {
    overview: [
      "The Central Defender is football stripped to its essentials: win the duel, clear the ball, protect the goal. He marks tightly, tackles cleanly, dominates both boxes in the air and positions himself with the boring excellence that champions are built on. In an era of playing out from the back, his refusal to overplay is a feature — the ball goes forward, the danger dies, the shape survives.",
      "This role anchors defensive and counter-attacking tactics where structure beats stardust. Pair him with a Ball-Playing Defender and the division of labour is perfect: one creates, one destroys. In a back five he is the immovable middle of a fortress — exactly the sort of defender who wins relegation battles and title races alike with a header off a corner in the 89th minute.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Manages the line, wins his duels, clears his lines — zero risk, total reliability.",
        bestWhen: "Any defensive setup where conceding nothing is the game plan.",
      },
      support: {
        behavior: "Holds position but plays simple progressive passes when the safe option is on.",
        bestWhen: "Balanced tactics that still want an outlet ball from the back four.",
      },
    },
    ppms: [
      { name: "Marks Opponent Tightly", reason: "Duels are his currency — tight marking removes forwards from the game entirely." },
      { name: "Plays No Through Balls", reason: "Sounds negative, is gold: the deepest defender choosing safety every single time." },
      { name: "Stays Back At All Times", reason: "Never caught upfield on a counter — the last line is always home." },
    ],
    starPlayers: [
      { name: "Rúben Dias", club: "Manchester City", why: "Duel-proof defending and flawless positional sense — the defensive brain of a dynasty." },
      { name: "William Saliba", club: "Arsenal", why: "Modern recovery pace fused with old-school commitment to the simple things." },
    ],
    partnerships: [
      { partner: "Ball-Playing Defender", partnerId: "ball-playing-defender", note: "The classic split: CD destroys, BPD creates — complementary skillsets in one back four" },
      { partner: "Line-Holding Keeper", partnerId: "line-holding-keeper", note: "A genuine low-block fortress — box defended by numbers, keeper owns his six yards" },
      { partner: "Target Forward", partnerId: "target-forward", note: "His clearances find the TF every time — instant outlet, pressure released" },
    ],
    whenToUse: {
      whenToUse: [
        "You value clean sheets over build-up elegance",
        "Your CB is a duel monster (Tackling, Marking, Heading) but limited in possession",
        "You defend deep or counter-attack",
        "You face target-man heavy opponents",
      ],
      whenToAvoid: [
        "Possession systems that demand progressive passing from the back",
        "High lines where his limited passing gets pressed into errors",
      ],
    },
    radar: [
      { attribute: "Tackling", rating: 92 },
      { attribute: "Marking", rating: 90 },
      { attribute: "Heading", rating: 88 },
      { attribute: "Positioning", rating: 85 },
      { attribute: "Strength", rating: 85 },
      { attribute: "Jumping Reach", rating: 82 },
    ],
  },

  "full-back": {
    overview: [
      "The Full-Back is football's most honest role: defend your flank, then attack it, then sprint back and defend it again. Neither a pure winger nor a pure defender, he balances both disciplines — overlapping to deliver crosses, underlapping to create passing angles, then recovering 60 metres to kill a counter. His stamina and decision-making decide whether your back four is actually a back four.",
      "In a back four he is the tactical swing-man: on defend duty he locks the touchline, on attack duty he becomes a wide midfielder with defensive homework. That flexibility makes the role the perfect training ground for understanding FM's duty system — and the perfect test of whether your tactic genuinely supports one player doing two jobs or simply demands it.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Holds the defensive line, denies crosses, plays simple possession when the ball comes his way.",
        bestWhen: "Facing elite wide threats or protecting a narrow lead.",
      },
      support: {
        behavior: "Advances to the halfway line, offers width in the midfield phase, recovers quickly behind his winger.",
        bestWhen: "The balanced default — a presence in both phases without exposing the flank.",
      },
      attack: {
        behavior: "Overlaps aggressively, hugs the touchline in the final third and delivers early crosses.",
        bestWhen: "You have an Inside Forward ahead of him — one stays wide, one goes inside, the flank is yours.",
      },
    },
    ppms: [
      { name: "Runs Down Left/Right Flank", reason: "Channels his energy down the touchline where his crossing does damage." },
      { name: "Plays One-Twos", reason: "Keeps overlap moves alive with quick give-and-gos around the winger." },
      { name: "Switches Ball To Opposite Flank", reason: "His crossing position makes far-post diagonals a genuine chance-creation tool." },
    ],
    starPlayers: [
      { name: "Achraf Hakimi", club: "Paris Saint-Germain", why: "The modern gold standard — sprint-duel defending married to elite end product." },
      { name: "Pedro Porro", club: "Tottenham Hotspur", why: "Inverted and overlapping both: constant final-third presence from the right flank." },
    ],
    partnerships: [
      { partner: "Inside Forward", partnerId: "inside-forward", note: "The classic flank marriage: IF cuts inside, FB owns the vacated outside lane" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "DLP's diagonals release the FB into acres as the opposition shifts across" },
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "FB's early crosses find the AF attacking the six-yard box at full sprint" },
    ],
    whenToUse: {
      whenToUse: [
        "You want a balanced wide defender in a back four",
        "Your wide player cuts inside and needs someone holding the width",
        "Your defender has strong Stamina and Work Rate with useful Crossing",
      ],
      whenToAvoid: [
        "Your player lacks the engine to recover after attacking",
        "You already have flying wingers providing width — a Wing-Back would crowd the flank",
      ],
    },
    radar: [
      { attribute: "Tackling", rating: 82 },
      { attribute: "Stamina", rating: 90 },
      { attribute: "Acceleration", rating: 85 },
      { attribute: "Crossing", rating: 80 },
      { attribute: "Work Rate", rating: 88 },
      { attribute: "Positioning", rating: 78 },
    ],
  },

  "wing-back": {
    overview: [
      "The Wing-Back is a marathon disguised as a footballer. In a back three or back five he is simultaneously your last defender on the flank and your main source of width in attack — 90 minutes of touchline-to-touchline running that turns a defensive formation into an attacking one. No forwards out wide? The Wing-Back is your winger.",
      "His value is geometric: three centre-backs hold the fort while he pushes 20 metres beyond the halfway line, stretching opposition back lines and creating the half-space corridors your inside forwards and channel runners exploit. The catch is symmetrical — when he is caught upfield, your back three becomes a back two. Choose Wing-Backs with genuine pace and you have the most attack-per-metre role in football.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Sits deeper, forms a temporary back five out of possession, supports rather than leads attacks.",
        bestWhen: "Protecting leads or facing opponents who themselves attack down your flanks.",
      },
      support: {
        behavior: "Holds an advanced wide position at midfield height, provides an outlet ball and recycles possession.",
        bestWhen: "The standard for 3-5-2 systems — width in possession, compactness without it.",
      },
      attack: {
        behavior: "Plays as an out-and-out wide attacker, overlapping to the byline and delivering crosses at every opportunity.",
        bestWhen: "Formations with no wingers — 3-5-2 and 3-4-3 — where he IS the wide threat.",
      },
    },
    ppms: [
      { name: "Runs Down Left/Right Flank", reason: "Pure touchline play — stretch the pitch, then deliver from the byline." },
      { name: "Runs With Ball Often", reason: "In open space out wide his carrying turns defence into attack in three touches." },
      { name: "Knocks Ball Past Opponent", reason: "Raw pace in one-v-ones on the flank — beat the man, cross on the run." },
    ],
    starPlayers: [
      { name: "Alphonso Davies", club: "Bayern München", why: "Olympic sprinter pace welded to relentless two-way volume — the role's modern icon." },
      { name: "Nuno Mendes", club: "Paris Saint-Germain", why: "Champions League-winning flank dominance: recovery speed plus genuine end product." },
    ],
    partnerships: [
      { partner: "Inside Forward", partnerId: "inside-forward", note: "One stays wide, one cuts in — the flank is defended and attacked in perfect tandem" },
      { partner: "Overlapping Centre-Back", partnerId: "overlapping-centre-back", note: "In a back five the OCB covers the flank when the WB bombs on — rotation without chaos" },
      { partner: "Target Forward", partnerId: "target-forward", note: "WB's byline crosses are meat and drink for an aerially dominant striker" },
    ],
    whenToUse: {
      whenToUse: [
        "You play 3-5-2, 3-4-3 or 5-3-2 without traditional wingers",
        "Your wide defender has elite Stamina, Pace and Crossing",
        "You want width without sacrificing a back-three defensive base",
      ],
      whenToAvoid: [
        "Your player cannot run for 90 minutes — the role collapses in the last 20",
        "Your centre-backs lack pace to cover when he is caught upfield",
        "You already have traditional wingers — width would be duplicated",
      ],
    },
    radar: [
      { attribute: "Stamina", rating: 95 },
      { attribute: "Crossing", rating: 85 },
      { attribute: "Dribbling", rating: 78 },
      { attribute: "Acceleration", rating: 88 },
      { attribute: "Work Rate", rating: 92 },
      { attribute: "Off the Ball", rating: 80 },
    ],
  },

  "overlapping-centre-back": {
    overview: [
      "New in FM26, the Overlapping Centre-Back turns a back three into a rotating organism. His defining movement is the unexpected one: as the wing-back attracts pressure, the OCB charges around the outside into the vacated channel, arriving in the final third as an unmarked runner no full-back has been assigned to track. Attackers who defend — and defenders who decide games.",
      "He is a specialist for three-at-the-back systems that want overloads without losing balance: when the move breaks down, he is already the widest defender on the recovery run. His profile blends a sprinter's Pace with a defender's reading of the game — plus enough technique to contribute in the final third rather than just arrive in it.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Steps out only on clear triggers, otherwise maintains the back-three structure and defends his channel.",
        bestWhen: "Cautious variants of 3-5-2 where his forays are bonuses, not the plan.",
      },
      support: {
        behavior: "Carries the ball into midfield regularly and overlaps when the wing-back is double-marked.",
        bestWhen: "The default — controlled aggression from a three-man base that always keeps two covering.",
      },
    },
    ppms: [
      { name: "Runs Down Left/Right Flank", reason: "Directs his bursts to the flank where the overlap lanes live." },
      { name: "Brings Ball Out Of Defence", reason: "Step-outs with the ball drag opponents out before the overlap even starts." },
      { name: "Arrives Late In Opposition Area", reason: "His trademark: ghosting into the box unmarked as the far-post runner." },
    ],
    starPlayers: [
      { name: "Joško Gvardiol", club: "Manchester City", why: "Centre-back by trade, flank-destroyer by deployment — pace and composure in the final third." },
      { name: "Riccardo Calafiori", club: "Arsenal", why: "The step-out merchant: carries through midfield and attacks channels with defender's timing." },
    ],
    partnerships: [
      { partner: "Wing-Back", partnerId: "wing-back", note: "The double-flank threat: WB attracts two men, OCB overlaps into the space they abandoned" },
      { partner: "Playmaking Wing-Back", partnerId: "playmaking-wing-back", note: "PWB drifts inside on one flank while the OCB overlaps on the other — a back three that attacks everywhere" },
      { partner: "Sweeper Keeper", partnerId: "sweeper-keeper", note: "SK sweeps the lane behind his charges, licence to attack guaranteed by cover" },
    ],
    whenToUse: {
      whenToUse: [
        "You play a back three and want an extra attacker without substituting",
        "Your CB has genuine Pace and Off the Ball movement",
        "Opponents double up on your wing-backs and leave outside lanes free",
      ],
      whenToAvoid: [
        "A back four — the role is designed for three-at-the-back cover",
        "Your CB is positionally naive and gets caught upfield",
        "You already concede regularly to counters down the flanks",
      ],
    },
    radar: [
      { attribute: "Pace", rating: 85 },
      { attribute: "Off the Ball", rating: 85 },
      { attribute: "Passing", rating: 75 },
      { attribute: "Work Rate", rating: 80 },
      { attribute: "Acceleration", rating: 85 },
      { attribute: "Positioning", rating: 80 },
    ],
  },

  "playmaking-wing-back": {
    overview: [
      "The headline FM26 wide role: a wing-back who plays like a deep-lying playmaker in a full-back's postcode. Instead of racing to the byline, he drifts inside with the ball into the half-spaces, scans like a quarterback and threads passes that no defender associates with his position. The wide forward stretches the pitch; the Playmaking Wing-Back dictates from it.",
      "His genius is geometrical confusion. Opposition wingers don't know whether to follow him inside (abandoning their outlet) or pass him on (gifting your side a free creator). In possession your shape becomes a 3-2-4-1 with the PWB as the second pivot — a midfield metronome who can still sprint 70 metres back to cover his flank when the ball is lost.",
    ],
    dutyGuide: {
      support: {
        behavior: "Inverts into midfield in possession, becomes an extra passing hub while still tracking his flank diligently.",
        bestWhen: "Possession systems wanting a double pivot without sacrificing a back three.",
      },
      attack: {
        behavior: "Commits fully to the inverted role, arriving in the final third between the lines as a genuine No. 10 from deep.",
        bestWhen: "Against low blocks that man-mark your creators — an unmarkable extra playmaker.",
      },
    },
    ppms: [
      { name: "Cuts Inside From Both Wings", reason: "The role's signature — infield drags that turn defence into midfield creation." },
      { name: "Tries Long Range Passes", reason: "From the half-space his switches and diagonals unlock packed defences." },
      { name: "Plays One-Twos", reason: "Keeps inverted combinations alive with your inside forwards and eights." },
    ],
    starPlayers: [
      { name: "Joško Gvardiol", club: "Manchester City", why: "Pep's inverted experiment perfected: defends the flank, then runs the game from the half-space." },
      { name: "Nuno Mendes", club: "Paris Saint-Germain", why: "Combines byline aggression with growing interior play — the two-way prototype." },
    ],
    partnerships: [
      { partner: "Inside Forward", partnerId: "inside-forward", note: "The FM26 flank blueprint: IF holds the width, PWB inverts — opponents pick their poison" },
      { partner: "Channel Midfielder", partnerId: "channel-midfielder", note: "PWB's infield passes release the CM's half-space bursts in perfect sync" },
      { partner: "Overlapping Centre-Back", partnerId: "overlapping-centre-back", note: "OCB holds the width he abandons — your formation morphs, never breaks" },
    ],
    whenToUse: {
      whenToUse: [
        "You play a back three with an inside forward ahead of him",
        "Your wide defender is genuinely technical (Passing, Vision, First Touch)",
        "You face low blocks that smudge your central creators' space",
        "You want overloads in central midfield without extra bodies",
      ],
      whenToAvoid: [
        "Your player is a traditional crossing machine — his talent dies inverted",
        "Your centre-backs can't cover the flank he vacates",
        "Quick counters down your right/left — his recovery runs start 40 metres away",
      ],
    },
    radar: [
      { attribute: "Passing", rating: 90 },
      { attribute: "Crossing", rating: 85 },
      { attribute: "Vision", rating: 85 },
      { attribute: "Dribbling", rating: 80 },
      { attribute: "Work Rate", rating: 85 },
      { attribute: "Stamina", rating: 85 },
    ],
  },

  "deep-lying-playmaker": {
    overview: [
      "The Deep-Lying Playmaker is metronome and assassin in one: he sits at the base of midfield, untangles the press with one touch, then stabs a pass through three opposition shirts. His radar is the tactic's operating system — tempo accelerates and decelerates at his command, and every attack you score begins, more often than not, at his feet.",
      "Defensively modest but positionally intelligent, the DLP wins his duels through anticipation rather than aggression, offering your ball-playing defenders a pressure-relief valve and your forwards a supply line that bypasses entire lines of the opposition's shape. Mark him with a destroyer and he drops between the centre-backs; leave him free and he will pass you to death.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Holds the base of midfield, screens the back line and plays with maximum safety — tempo control without risk.",
        bestWhen: "Alongside aggressive eights, or when protecting leads in control-possession systems.",
      },
      support: {
        behavior: "Roams between the lines to receive, turns and plays vertical passes at every opportunity.",
        bestWhen: "The default — full creative license from the pivot in a two-man midfield.",
      },
    },
    ppms: [
      { name: "Tries Long Range Passes", reason: "His 50-yard switches are the mechanism that turns patient possession into sudden overloads." },
      { name: "Comes Deep To Get Ball", reason: "Never hides — drops to the last line to guarantee your build-up always has an outlet." },
      { name: "Switches Ball To Opposite Flank", reason: "The pressure-valve: one diagonal and the entire opposition press is bypassed." },
    ],
    starPlayers: [
      { name: "Rodri", club: "Manchester City", why: "The role's ultimate expression: Ballon d'Or tempo control with line-breaking verticality." },
      { name: "Joshua Kimmich", club: "Bayern München", why: "Pivot-brain and piggy press-resistance — dictates every phase from the base." },
    ],
    partnerships: [
      { partner: "Box-to-Box Midfielder", partnerId: "box-to-box-midfielder", note: "BBM covers the ground DLP can't, creating the perfect defensive shield while DLP orchestrates" },
      { partner: "Advanced Playmaker", partnerId: "advanced-playmaker", note: "DLP from deep, AP between the lines — two-tier creation that suffocates any block" },
      { partner: "Ball-Playing Defender", partnerId: "ball-playing-defender", note: "Double deep distributors: press one and the other splits your lines anyway" },
    ],
    whenToUse: {
      whenToUse: [
        "You want to control possession and tempo",
        "You have a technically gifted passer in the DM/CM position",
        "Your tactic uses a patient build-up from the back",
        "You play with a deeper defensive line",
      ],
      whenToAvoid: [
        "Your team is slow and gets pressed high — DLP needs time on the ball",
        "You play a fast counter-attacking style",
        "Your player has low Composure and Decisions attributes",
      ],
    },
    radar: [
      { attribute: "Passing", rating: 95 },
      { attribute: "Vision", rating: 90 },
      { attribute: "Technique", rating: 85 },
      { attribute: "Decisions", rating: 90 },
      { attribute: "Composure", rating: 80 },
      { attribute: "First Touch", rating: 85 },
    ],
  },

  "box-to-box-midfielder": {
    overview: [
      "The Box-to-Box Midfielder is football's diesel engine: he arrives in your penalty area to clear the corner, then 20 seconds later he's crashing the opposition six-yard box demanding the cutback. Neither destroyer nor creator, he is the relentless connective tissue that makes a three-man midfield outwork, outrun and eventually outlast every opponent.",
      "His value hides in the stats sheet's shadows — second balls recovered, channels covered, late runs arriving untracked at the far post. In transition-heavy tactics he is the first man forward and the last man back; in possession systems his carrying gives your playmakers someone to bounce off. Choose him for engine and intelligence over silk, and he'll repay you with the least glamorous, most decisive performances of your season.",
    ],
    dutyGuide: {
      support: {
        behavior: "Shuttles end-to-end at full intensity: screens the back line out of possession, arrives in the box in it.",
        bestWhen: "The universal midfield glue — pairs with any pivot and any style that runs.",
      },
    },
    ppms: [
      { name: "Gets Into Opposition Area", reason: "His trademark late arrivals turn your spells of pressure into goals from midfield." },
      { name: "Arrives Late In Opposition Area", reason: "Unmarked by design — defenders track runners, not men starting 40 yards back." },
      { name: "Runs With Ball Through Centre", reason: "Turns recoveries into immediate attacks with powerful vertical carrying." },
    ],
    starPlayers: [
      { name: "Federico Valverde", club: "Real Madrid", why: "The modern benchmark: lung-busting shuttles plus a hammer of a shot from distance." },
      { name: "Bruno Guimarães", club: "Newcastle United", why: "Two-way brutality with silk — recovers, carries and finishes like an extra striker." },
    ],
    partnerships: [
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "DLP provides the creativity, BBM provides the engine — the most balanced midfield duo" },
      { partner: "Advanced Playmaker", partnerId: "advanced-playmaker", note: "AP creates while BBM carries the ball forward — vertical tiki-taka setup" },
      { partner: "Ball-Playing Defender", partnerId: "ball-playing-defender", note: "BPD steps out, BBM covers the lane — your build-up advances without losing its shield" },
    ],
    whenToUse: {
      whenToUse: [
        "You want an all-action midfielder who contributes at both ends",
        "Your tactic requires runners covering large distances",
        "You have an athletic midfielder with high Stamina and Work Rate",
        "You play a pressing or high-tempo style",
      ],
      whenToAvoid: [
        "Your player has low Stamina or Natural Fitness",
        "You already have two attack-minded midfielders",
        "You need a specialist defensive midfielder instead",
      ],
    },
    radar: [
      { attribute: "Stamina", rating: 95 },
      { attribute: "Work Rate", rating: 90 },
      { attribute: "Passing", rating: 75 },
      { attribute: "Tackling", rating: 70 },
      { attribute: "Long Shots", rating: 65 },
      { attribute: "Off the Ball", rating: 75 },
    ],
  },

  "advanced-playmaker": {
    overview: [
      "The Advanced Playmaker lives in the most contested 20 square metres on the pitch: the zone between the opposition's midfield and defence. There he receives with a man on his back, rolls away with half a touch, and lifts his head to a world where three passing lanes just opened. Assists, through balls and defence-splitting moments — this is the role that buys tickets.",
      "His weakness is the mirror of his strength: defensively he offers little, and in midfield battles his presence effectively makes you a man light. Compensate with ball-carriers and destroyers around him, and the AP becomes the difference between possession and penetration. In FM26's match engine, a double-marked AP is also your best distraction — the space he attracts is the space your inside forwards feast on.",
    ],
    dutyGuide: {
      support: {
        behavior: "Drifts across the final third finding pockets, creating for others before shooting himself.",
        bestWhen: "Possession-heavy systems — he keeps the ball moving until a lane opens.",
      },
      attack: {
        behavior: "Plays in the last line only, ignores defensive duties entirely and focuses purely on creation and arriving in the box.",
        bestWhen: "Home games against deep blocks where his creativity outweighs the structural risk.",
      },
    },
    ppms: [
      { name: "Tries Killer Balls Often", reason: "Why else is he there — through balls are his entire value proposition." },
      { name: "Comes Deep To Get Ball", reason: "Drops off the last line to escape man-marking and dictate from deeper pockets." },
      { name: "Likes To Try To Beat Man Repeatedly", reason: "Flair in tight spaces — one beaten marker collapses an entire low block." },
    ],
    starPlayers: [
      { name: "Martin Ødegaard", club: "Arsenal", why: "Right-half-space surgeon: chance creation by volume and by masterpiece." },
      { name: "Pedri", club: "Barcelona", why: "Press-evading feet with last-line vision — the total creative midfielder." },
    ],
    partnerships: [
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "The classic supply line: AP's through balls, AF's diagonal runs — defences pick a poison" },
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "Two floors of creation: DLP from the base, AP between the lines" },
      { partner: "Box-to-Box Midfielder", partnerId: "box-to-box-midfielder", note: "BBM does the defending for both — the AP's freedom is purchased with his legs" },
    ],
    whenToUse: {
      whenToUse: [
        "You need a primary creator between the lines",
        "You face deep blocks that need unlocking with vision and flair",
        "Your midfield has destroyers to compensate defensively",
        "You have forwards who attack space and finish clinically",
      ],
      whenToAvoid: [
        "Your player has low Flair, Vision or Technique",
        "You need midfield defensive solidity — he is a passenger there",
        "Fast counter-attacking systems that bypass his zone entirely",
      ],
    },
    radar: [
      { attribute: "Vision", rating: 93 },
      { attribute: "Passing", rating: 90 },
      { attribute: "Technique", rating: 88 },
      { attribute: "Decisions", rating: 82 },
      { attribute: "Flair", rating: 90 },
      { attribute: "First Touch", rating: 87 },
    ],
  },

  "channel-midfielder": {
    overview: [
      "New in FM26, the Channel Midfielder attacks the seams of modern defences: the half-space corridors between full-back and centre-back, between the lines and beyond them. He is a timing-based runner — invisible while your playmakers probe, then suddenly sprinting through a channel that only opened for a second, arriving in the box as your striker's decoy run drags defenders away.",
      "He is the role that punishes every zonal marking scheme ever designed, because channels belong to no one. In a 4-3-3 he is the free eight; in a 3-4-3 he partners the striker from the second wave. Give him a DLP's passing behind and an inside forward's width beside, and his late arrivals become your most repeatable scoring pattern — the goal that arrives from nowhere, every single week.",
    ],
    dutyGuide: {
      support: {
        behavior: "Times channel runs from midfield, combines in half-spaces and balances his box arrivals with defensive work.",
        bestWhen: "The default — a scoring eight in a midfield three without sacrificing structure.",
      },
      attack: {
        behavior: "Plays almost as a second striker, permanently hunting channels and arriving in the six-yard box.",
        bestWhen: "Chasing games or against man-marking defences that can't assign him an owner.",
      },
    },
    ppms: [
      { name: "Moves Into Channels", reason: "The role's heart — permanent positioning in the seams defenders refuse to cover." },
      { name: "Gets Into Opposition Area", reason: "Late box arrivals are his entire goal threat." },
      { name: "Plays One-Twos", reason: "Half-space combinations with your striker are how channels get exploited at pace." },
    ],
    starPlayers: [
      { name: "Jude Bellingham", club: "Real Madrid", why: "The definitive channel scorer: ghosting half-space arrivals converted into 20+ goal seasons." },
      { name: "Dani Olmo", club: "Barcelona", why: "A half-space surgeon — finds seams between lines that shouldn't exist." },
    ],
    partnerships: [
      { partner: "Deep-Lying Playmaker", partnerId: "deep-lying-playmaker", note: "DLP's disguised through balls into channels are tailor-made for his timed runs" },
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "AF occupies both centre-backs, CM attacks the vacated channel — defender's nightmare geometry" },
      { partner: "Playmaking Wing-Back", partnerId: "playmaking-wing-back", note: "PWB inverting draws markers out, opening the exact half-space lane the CM attacks" },
    ],
    whenToUse: {
      whenToUse: [
        "You play 4-3-3 / 4-2-3-1 / 3-4-3 and want goals from midfield",
        "Your midfielder has Off the Ball, Acceleration and clever decision-making",
        "You face zonal defences with exploitable half-space seams",
      ],
      whenToAvoid: [
        "Your player is a stationary passer — the role lives on movement",
        "Your midfield already lacks defensive cover — he attacks, he doesn't shield",
        "Deep-block opponents that leave no channels to run into",
      ],
    },
    radar: [
      { attribute: "Off the Ball", rating: 90 },
      { attribute: "Acceleration", rating: 85 },
      { attribute: "Passing", rating: 80 },
      { attribute: "First Touch", rating: 80 },
      { attribute: "Decisions", rating: 85 },
      { attribute: "Teamwork", rating: 85 },
    ],
  },

  "inside-forward": {
    overview: [
      "The Inside Forward is a goal threat wearing a winger's shirt. He starts wide to stretch the pitch, then attacks the one direction defenders hate — inside, towards goal, onto his stronger foot. Every touch from the moment he cuts is a shot, a slipped pass or a defence pinned backwards. Traditional wingers create from the byline; the IF is created to finish.",
      "His rise defined a generation of football: entire tactics are engineered around inverting wide threats onto their favoured feet, with overlapping full-backs holding the width he abandons. In FM26 he remains the most goal-productive wide role in the game — pair him with a Full-Back who hugs the touchline and a striker who occupies centre-backs, and the half-space corridor he attacks becomes the most valuable real estate on the pitch.",
    ],
    dutyGuide: {
      support: {
        behavior: "Cuts inside to link play, creates for others and shoots when the lane opens — balanced threat.",
        bestWhen: "With a strike partner or when your full-back overlaps — he plays as an extra creator inside.",
      },
      attack: {
        behavior: "Beelines for goal at every opportunity: cut inside, shoot, or dribble through the heart of the defence.",
        bestWhen: "The classic wide scorer in a front three — your second-highest shot-taker by design.",
      },
    },
    ppms: [
      { name: "Cuts Inside From Left/Right Wing", reason: "The entire role in one habit — infield onto the stronger foot, towards goal." },
      { name: "Places Shots", reason: "His curled far-post finish after cutting is the most repeatable wide goal in football." },
      { name: "Runs With Ball Often", reason: "One-v-one terror: defenders must show him inside and outside with no good answer." },
    ],
    starPlayers: [
      { name: "Mohamed Salah", club: "Liverpool", why: "A decade of cut-inside-and-curl it — the most productive right-flank scorer in history." },
      { name: "Lamine Yamal", club: "Barcelona", why: "Left-footed right-winger of infinite trickery — the role's next decade, already here." },
    ],
    partnerships: [
      { partner: "Full-Back", partnerId: "full-back", note: "IF cuts inside, FB holds the width — the classic flank exchange that makes both better" },
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "IF and AF attack the box from different angles — one target, two untrackable runs" },
      { partner: "Playmaking Wing-Back", partnerId: "playmaking-wing-back", note: "PWB holds width while IF inverts — perfect modern flank geometry" },
    ],
    whenToUse: {
      whenToUse: [
        "You have a pacy, skillful winger who can cut inside",
        "You want goals from wide positions",
        "Your striker benefits from wide players creating central overloads",
        "Your full-backs or wing-backs provide the width",
      ],
      whenToAvoid: [
        "Your wide player has poor Dribbling or Finishing",
        "You want traditional crossing wingers — use Winger role instead",
        "No one holds width behind him — your attack collapses into a narrow clump",
      ],
    },
    radar: [
      { attribute: "Dribbling", rating: 90 },
      { attribute: "Finishing", rating: 85 },
      { attribute: "Acceleration", rating: 85 },
      { attribute: "Off the Ball", rating: 80 },
      { attribute: "Composure", rating: 75 },
      { attribute: "Technique", rating: 85 },
    ],
  },

  "advanced-forward": {
    overview: [
      "The Advanced Forward is pure intent: he lives on the shoulder of the last defender, occupies both centre-backs by himself, and converts every through ball, cross and half-chance into a shot on target. No dropping deep, no wide wandering — his 30-metre zone is the most valuable strip of grass in football, and he defends it like a striker should: with goals.",
      "In FM26 he remains the centrepiece role of every elite attack — the reference point your inside forwards cut inside for, the target your playmakers aim at, the man defenders plan their entire week around. Give him service and he wins you the league; starve him and he'll still poach a goal from nothing. His only flaw is structural: on his bad days, he offers nothing but the constant threat of everything.",
    ],
    dutyGuide: {
      attack: {
        behavior: "Plays on the last line permanently, attacks the six-yard box, presses defenders when possession is lost.",
        bestWhen: "Any tactic with a single striker and creators behind him — the universal goalscorer.",
      },
    },
    ppms: [
      { name: "Moves Into Channels", reason: "Darts between full-back and centre-back — the run defenders fear most." },
      { name: "Places Shots", reason: "One-on-one ice-cold: passed finishes, not blasted hopes." },
      { name: "Likes To Round Keeper", reason: "Composure in the biggest moment of every match." },
    ],
    starPlayers: [
      { name: "Erling Haaland", club: "Manchester City", why: "The role's final form: channel runs, box occupation and ruthless volume finishing." },
      { name: "Kylian Mbappé", club: "Real Madrid", why: "Left-shoulder terror with acceleration no line can hold — goals in every colour." },
      { name: "Alexander Isak", club: "Liverpool", why: "Silk plus sprint: runs the channels and finishes like a No. 10 in a No. 9's body." },
    ],
    partnerships: [
      { partner: "Deep-Lying Forward", partnerId: "target-forward", note: "TF drops and holds, AF stretches and finishes — classic strike-pairing geometry" },
      { partner: "Pressing Forward", partnerId: "pressing-forward", note: "PF creates chaos pressing CBs, AF capitalizes on the space" },
      { partner: "Inside Forward", partnerId: "inside-forward", note: "IF cuts inside and links with AF in the box — devastating combination" },
    ],
    whenToUse: {
      whenToUse: [
        "You need a pure goalscorer who stays high and finishes chances",
        "Your striker has elite Finishing, Composure and Off the Ball",
        "You play with creative midfielders who can feed the AF",
        "You want a focal point for crosses and through balls",
      ],
      whenToAvoid: [
        "Your striker has poor Finishing or Composure",
        "You want a forward who drops deep and creates — use a deeper role instead",
        "Your team struggles to create chances — AF won't help in buildup",
      ],
    },
    radar: [
      { attribute: "Finishing", rating: 95 },
      { attribute: "Acceleration", rating: 88 },
      { attribute: "Off the Ball", rating: 92 },
      { attribute: "Composure", rating: 85 },
      { attribute: "Anticipation", rating: 88 },
      { attribute: "Dribbling", rating: 75 },
    ],
  },

  "pressing-forward": {
    overview: [
      "The Pressing Forward is your first defender and loudest agitator. From the opening whistle he harasses centre-backs, blocks passing lanes and forces errors that more glamorous teammates convert. His map of the pitch is simple: wherever the ball is, one opponent is about to have a very bad time. Goals are his bonus; chaos is his contract.",
      "Modern elite football is unthinkable without him — gegenpress systems begin with the PF's relentless funnel, and counter-attacks begin with his interceptions high up the pitch. In FM26 he is the tactical catalyst that turns possession won into positions advanced. Pair him with a poacher who feeds on the wreckage, and watch defences unravel under 90 minutes of industrial pressure.",
    ],
    dutyGuide: {
      defend: {
        behavior: "Man-marking intensity on the opposition's deepest defender, cutting off build-up at the source.",
        bestWhen: "Aggressive high presses where triggering the press is his primary job.",
      },
      support: {
        behavior: "Presses in triggers rather than constantly, then links play when possession is won high.",
        bestWhen: "The balanced default — chaos with a bit of craft.",
      },
      attack: {
        behavior: "Full-intensity harassment plus genuine penalty-box presence when attacks develop.",
        bestWhen: "Front twos where the partner poaches the chances the PF's pressure creates.",
      },
    },
    ppms: [
      { name: "Marks Opponent Tightly", reason: "Suffocating the deepest defender turns their build-up into long balls — your plan, executed." },
      { name: "Runs With Ball Through Centre", reason: "Wins it high and carries straight at a disorganised defence — instant chaos." },
      { name: "Argues With Officials", reason: "The dark arts: constant agitation keeps referees alert and defenders rattled." },
    ],
    starPlayers: [
      { name: "Luis Díaz", club: "Bayern München", why: "Counter-pressing fury with direct carrying — defends from the front by default." },
      { name: "Ollie Watkins", club: "Aston Villa", why: "Channel-running volume striker whose defensive work never stops at either end." },
    ],
    partnerships: [
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "PF creates chaos pressing CBs, AF capitalizes on the space — the classic high-press strike pair" },
      { partner: "Advanced Playmaker", partnerId: "advanced-playmaker", note: "PF's turnovers land at the AP's feet in the final third — creation from destruction" },
      { partner: "Box-to-Box Midfielder", partnerId: "box-to-box-midfielder", note: "BBM joins the press from midfield — pressure in numbers, errors guaranteed" },
    ],
    whenToUse: {
      whenToUse: [
        "You play gegenpress or any high-tempo pressing system",
        "You want defensive work from your forward line",
        "Your striker has elite Work Rate, Stamina and Aggression",
        "You face teams that build up short from the back",
      ],
      whenToAvoid: [
        "Your striker has low Work Rate or Stamina — the role exposes laziness brutally",
        "You need a poacher who conserves energy for chances",
        "Possession-recycling systems where pressing triggers rarely fire",
      ],
    },
    radar: [
      { attribute: "Work Rate", rating: 95 },
      { attribute: "Aggression", rating: 88 },
      { attribute: "Stamina", rating: 90 },
      { attribute: "Bravery", rating: 82 },
      { attribute: "Tackling", rating: 72 },
      { attribute: "Acceleration", rating: 80 },
    ],
  },

  "target-forward": {
    overview: [
      "The Target Forward is gravity with a shirt number. Long balls, crosses and clearances orbit towards him; defenders bounce off; teammates feed on his knock-downs. He is the reference point that makes route-one football a plan rather than a panic — hold it, lay it, bring the runners into play, then attack the six-yard box himself.",
      "In FM26 his value transcends style: gegenpress teams use him as the out-ball under pressure, counter-attackers use him as the release valve, and set-piece-heavy sides use him as a cheating-sized advantage at both ends. Pair him with a fast second striker or inside forwards who time their runs off his flicks, and the most old-fashioned role in football becomes the hinge of a thoroughly modern attack.",
    ],
    dutyGuide: {
      support: {
        behavior: "Holds up the ball and brings others into play — knock-downs, layoffs and link-up are the priority.",
        bestWhen: "With fast runners around him; as the out-ball in high-pressing systems.",
      },
      attack: {
        behavior: "Leads the line into the box, attacks every cross and contests every aerial ball in the final third.",
        bestWhen: "Cross-heavy tactics and wing-play systems — the box is his kingdom.",
      },
    },
    ppms: [
      { name: "Holds Up Ball", reason: "The role's foundation — buys time for your entire team to advance." },
      { name: "Knocks Ball To Team-Mate", reason: "One-touch layoffs release runners at the exact moment defenders commit." },
      { name: "Plays With Back To Goal", reason: "Shields possession under contact, then turns the game's tempo in one pivot." },
    ],
    starPlayers: [
      { name: "Olivier Giroud", club: "Los Angeles FC", why: "The genre's masterpiece: a career of knock-downs, flicks and clutch headers at every level." },
      { name: "Erling Haaland", club: "Manchester City", why: "Elite target skills welded to elite finishing — the complete modern No. 9." },
      { name: "Jonathan David", club: "Juventus", why: "Link-play elegance with penalty-box timing — the silky modern take on the target role." },
    ],
    partnerships: [
      { partner: "Inside Forward", partnerId: "inside-forward", note: "TF wins the first ball, IF attacks the second — the classic big-man/quick-man axis" },
      { partner: "Wing-Back", partnerId: "wing-back", note: "WB's byline crosses are custom-built for his aerial dominance" },
      { partner: "Advanced Forward", partnerId: "advanced-forward", note: "TF holds and lays off, AF runs the channels — strike-pairing yin and yang" },
    ],
    whenToUse: {
      whenToUse: [
        "You play direct, counter-attacking or cross-heavy football",
        "Your striker is physically dominant (Strength, Heading, Jumping Reach)",
        "You need an out-ball against aggressive high presses",
        "Your tactic generates wide service from wing-backs or wingers",
      ],
      whenToAvoid: [
        "Possession systems with short passing through the lines",
        "Your striker is lightweight or reluctant in aerial duels",
        "No runners around him — knock-downs to nobody win nothing",
      ],
    },
    radar: [
      { attribute: "Strength", rating: 93 },
      { attribute: "Heading", rating: 90 },
      { attribute: "Jumping Reach", rating: 90 },
      { attribute: "First Touch", rating: 80 },
      { attribute: "Bravery", rating: 85 },
      { attribute: "Balance", rating: 78 },
    ],
  },
};
