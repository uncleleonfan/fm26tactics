/**
 * Short plain-English explanations for every player attribute referenced by
 * roles (keyAttributes + per-duty attribute lists). Keyed by the exact
 * attribute string used in tactics-data.ts / role-depth.ts.
 */
export const attributeDescriptions: Record<string, string> = {
  // Goalkeeping
  "Rushing Out": "How quickly the goalkeeper comes off the line to smother through balls and one-on-ones.",
  "Aerial Reach": "How high the goalkeeper can reach to claim or punch aerial balls.",
  "Command of Area": "The keeper's authority in the box — claiming crosses and organising the area.",
  Handling: "How cleanly the keeper catches and holds shots rather than spilling rebounds.",
  Reflexes: "Instinctive reaction saves at close range.",
  "Kicking": "The accuracy and distance of the goalkeeper's kicks.",

  // Technical
  "First Touch": "Controlling the ball cleanly when receiving under pressure.",
  Passing: "The accuracy of passes over both short and long range.",
  Crossing: "The accuracy of crosses delivered from wide areas.",
  Dribbling: "Keeping the ball under control while running with it.",
  Finishing: "Converting chances into goals — placement and composure in front of goal.",
  "Long Shots": "The accuracy of strikes from outside the box.",
  Heading: "The quality of headers, both attacking and defending.",
  Tackling: "Winning the ball cleanly in challenges without fouling.",
  Technique: "The ability to pull off difficult technical actions — volleys, curlers, weighted passes.",

  // Mental
  Decisions: "Choosing the right option quickly in possession and out of it.",
  Composure: "Keeping technical quality while under pressure or in key moments.",
  Vision: "Spotting passing lanes and opportunities others don't see.",
  "Off the Ball": "Intelligent movement to find space and create chances.",
  Anticipation: "Reading how play will develop and reacting first.",
  Positioning: "Being in the right place at the right moment, defensively.",
  Flair: "The willingness and ability to try the unexpected.",
  "Work Rate": "How much ground the player covers — effort without the ball.",
  Aggression: "How strongly the player commits to duels and second balls.",
  Bravery: "Willingness to put the body on the line — blocks, diving headers, fifty-fifties.",
  Teamwork: "Following instructions and playing for teammates within the system.",

  // Physical
  Acceleration: "How quickly the player reaches top speed from a standstill.",
  Pace: "The player's flat-out maximum running speed.",
  Stamina: "Maintaining physical output for the full 90 minutes.",
  Strength: "Winning physical battles — holding off opponents and shielding the ball.",
  "Jumping Reach": "How high the player can rise for aerial duels.",
  Balance: "Staying steady on the ball and in challenges after contact.",
};
