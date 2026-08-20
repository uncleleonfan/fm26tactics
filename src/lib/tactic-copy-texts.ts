// Complete setup cards for every tactic in the library.
// Used by the "Copy Full Setup" button on tactic detail pages.
export const tacticCopyTexts: Record<string, string> = {
  "3-4-3-control-possession": `FM26 3-4-3 Control Possession — Full Setup

FORMATION: 3-4-3
STYLE: Control Possession | Mentality: Positive

PLAYER ROLES
GK: Sweeper Keeper (Su)
DEF: Wide Centre-Back (De) | Ball-Playing Defender (Co) | Wide Centre-Back (De)
MID: Defensive Winger (Su) | Deep-Lying Playmaker (Su) | Advanced Playmaker (At) | Defensive Winger (Su)
ATT: Inside Forward (At) | Complete Forward (Su) | Inside Forward (At)

IN POSSESSION
Width: Fairly Wide | Passing: Shorter | Tempo: Lower
Play Out of Defence: ON | Work Ball Into Box: ON

IN TRANSITION
Counter: OFF | Counter-Press: ON | GK Distribution: Roll It Out

OUT OF POSSESSION
Line of Engagement: Much Higher | Defensive Line: Higher
Trigger Press: Much More Often | Prevent Short GK Distribution: ON
Offside Trap: ON | Defensive Width: Fairly Narrow

KEY PLAYERS: Wide CBs must be comfortable on the ball AND defend 1v1. DLP 15+ Passing.`,
  "3-5-2-catenaccio": `FM26 3-5-2 Catenaccio — Full Setup

FORMATION: 3-5-2
STYLE: Catenaccio | Mentality: Defensive

PLAYER ROLES
GK: Goalkeeper (De)
DEF: Centre-Back (St) | Centre-Back (Co) | Centre-Back (St)
MID: Wing-Back (Su) | Ball-Winning Midfielder (De) | Deep-Lying Playmaker (Su) | Ball-Winning Midfielder (De) | Wing-Back (Su)
ATT: Advanced Forward (At) | Target Forward (At)

IN POSSESSION
Width: Narrow | Passing: More Direct | Tempo: Higher
Play Out of Defence: OFF | Pass Into Space: ON | Run At Defence: ON | Hit Early Crosses: ON

IN TRANSITION
Counter: ON | Counter-Press: OFF
GK Distribution: Distribute to Target Forward | Long Kick | Distribute Quickly: ON

OUT OF POSSESSION
Defensive Line: Much Lower | Line of Engagement: Low Block
Trigger Press: Much Less Often | Defensive Width: Force Opposition Outside
Get Stuck In: ON | Offside Trap: OFF

KEY: Transition from 5-3-2 (defend) to 3-5-2 (attack) via the wing-backs.`,
  "3-5-2-counter-attack": `FM26 3-5-2 Counter-Attack — Full Setup

FORMATION: 3-5-2
STYLE: Counter-Attack | Mentality: Balanced

PLAYER ROLES
GK: Goalkeeper (De)
DEF: Central Defender (De) x3
MID: Wing-Back (Su) x2 | Deep-Lying Playmaker (Su) | Box-to-Box Midfielder (Su) | Central Midfielder (Su)
ATT: Advanced Forward (At) | Target Forward (Su)

IN POSSESSION
Passing: More Direct | Tempo: Higher | Pass Into Space: ON | Hit Early Crosses: ON

IN TRANSITION
Counter: ON | Counter-Press: OFF
GK Distribution: Distribute to Target Forward

OUT OF POSSESSION
Defensive Line: Lower | Line of Engagement: Mid Block
Trigger Press: Standard | Defensive Width: Fairly Narrow

KEY: The Target Forward is the outlet — hold up, then wing-backs bomb forward.`,
  "4-1-2-1-2-diamond": `FM26 4-1-2-1-2 Diamond — Full Setup

FORMATION: 4-1-2-1-2 (Diamond)
STYLE: Control Possession | Mentality: Positive

PLAYER ROLES
GK: Sweeper Keeper (De)
DEF: Full-Back (At) | Ball-Playing Defender (De) | Central Defender (De) | Full-Back (At)
MID: Defensive Midfielder (De) | Box-to-Box Midfielder (Su) | Carrilero (Su)
AM: Attacking Midfielder (At)
ATT: Advanced Forward (At) | Deep-Lying Forward (Su)

IN POSSESSION
Width: Fairly Narrow | Passing: Shorter | Tempo: Standard
Play Out of Defence: ON | Work Ball Into Box: ON

IN TRANSITION
Counter: ON | Counter-Press: ON | GK Distribution: Roll It Out

OUT OF POSSESSION
Line of Engagement: Higher | Defensive Line: Higher
Trigger Press: More Often | Prevent Short GK Distribution: ON
Offside Trap: ON | Defensive Width: Force Opposition Inside

KEY: Full-backs are your ONLY width — need Stamina 16+. The AM(At) is the crown jewel.`,
  "4-2-3-1-gegenpress": `FM26 4-2-3-1 Gegenpress — Full Setup

FORMATION: 4-2-3-1
STYLE: Gegenpress | Mentality: Positive

PLAYER ROLES
GK: Sweeper Keeper (Su)
DEF: Full-Back (Su) | Ball-Playing Defender (De) | Central Defender (De) | Full-Back (At)
MID: Deep-Lying Playmaker (De) | Box-to-Box Midfielder (Su)
AM: Inside Forward (At) | Attacking Midfielder (At) | Winger (Su)
ATT: Pressing Forward (At)

IN POSSESSION
Width: Fairly Wide | Passing: Shorter | Tempo: Higher
Play Out of Defence: ON | Work Ball Into Box: ON

IN TRANSITION
Counter: ON | Counter-Press: ON | GK Distribution: Roll It Out

OUT OF POSSESSION
Line of Engagement: Much Higher | Defensive Line: Higher
Trigger Press: Much More Often | Prevent Short GK Distribution: ON
Offside Trap: ON | Defensive Width: Fairly Narrow

KEY: The 4-4-2 pressing shape — PF and AM lead the press, wingers tuck in.`,
  "4-3-3-fluid-counter": `FM26 4-3-3 Fluid Counter — Full Setup

FORMATION: 4-3-3
STYLE: Fluid Counter-Attack | Mentality: Balanced

PLAYER ROLES
GK: Sweeper Keeper (Su)
DEF: Full-Back (De) | Ball-Playing Defender (De) | Central Defender (De) | Full-Back (Su)
MID: Deep-Lying Playmaker (De) | Box-to-Box Midfielder (Su) | Mezzala (At)
ATT: Inside Forward (At) | Pressing Forward (At) | Winger (Su)

IN POSSESSION
Passing: More Direct | Tempo: Higher | Pass Into Space: ON | Run At Defence: ON

IN TRANSITION
Counter: ON | Counter-Press: OFF
GK Distribution: Distribute to Centre-Backs (quick)

OUT OF POSSESSION
Line of Engagement: Mid Block | Defensive Line: Standard
Trigger Press: More Often | Prevent Short GK Distribution: ON
Defensive Width: Fairly Narrow

KEY: Mezzala drifts into the half-space unmarked. Full-backs stay home on counters.`,
  "4-3-3-tiki-taka": `FM26 4-3-3 Tiki-Taka — Full Setup

FORMATION: 4-3-3
STYLE: Tiki-Taka | Mentality: Positive

PLAYER ROLES
GK: Sweeper Keeper (Su)
DEF: Full-Back (Su) | Ball-Playing Defender (De) | Central Defender (De) | Full-Back (Su)
MID: Deep-Lying Playmaker (Su) | Advanced Playmaker (Su) | Mezzala (Su)
ATT: Inside Forward (Su) | Pressing Forward (At) | Inside Forward (At)

IN POSSESSION
Width: Fairly Narrow | Passing: Much Shorter | Tempo: Much Lower
Play Out of Defence: ON | Work Ball Into Box: ON | Dribble Less: ON | Play for Set Pieces: ON
Overlap Left: ON | Overlap Right: OFF

IN TRANSITION
Counter: OFF | Counter-Press: ON
GK Distribution: Roll It Out to Centre-Backs

OUT OF POSSESSION
Line of Engagement: Higher | Defensive Line: Much Higher
Trigger Press: Much More Often | Prevent Short GK Distribution: ON
Offside Trap: ON | Defensive Width: Force Inside

KEY: 6-second rule. Counter-Press ON, Counter OFF. Patience beats panic.`,
  "4-4-2-wing-play": `FM26 4-4-2 Wing Play — Full Setup

FORMATION: 4-4-2
STYLE: Wing Play | Mentality: Positive

PLAYER ROLES
GK: Goalkeeper (De)
DEF: Full-Back (Su) | Central Defender (De) | Central Defender (De) | Full-Back (Su)
MID: Winger (At) | Central Midfielder (De) | Box-to-Box Midfielder (Su) | Winger (At)
ATT: Target Forward (Su) | Advanced Forward (At)

IN POSSESSION
Width: Fairly Wide | Passing: Slightly More Direct | Tempo: Higher
Hit Early Crosses: ON | Overlap Left: ON | Overlap Right: ON | Run At Defence: ON

IN TRANSITION
Counter: ON | Counter-Press: OFF
GK Distribution: Distribute to Target Forward

OUT OF POSSESSION
Defensive Line: Standard | Line of Engagement: Mid Block
Trigger Press: Standard | Defensive Width: Fairly Narrow

KEY: Two banks of four. Cross types — low vs slow CBs, whipped vs high lines,
floated only when your TF has a big aerial mismatch.`,
};
