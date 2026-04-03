// Content data for all tradeoff analysis scenarios
// Source: PRD Section 2.4

export const AXIS_DATA = {
  money: {
    name: 'Money',
    annotation: 'Budget, capital, runway',
    shadowName: 'Optionality',
    shadowAnnotation: 'Freedom to pivot and survive being wrong',
    color: '#F59E0B',
    colorLight: '#FBBF24',
  },
  time: {
    name: 'Time',
    annotation: 'Speed, deadlines, iteration',
    shadowName: 'Learning',
    shadowAnnotation: 'Build → measure → learn loops',
    color: '#3B82F6',
    colorLight: '#60A5FA',
  },
  quality: {
    name: 'Quality',
    annotation: 'Polish, reliability, craft',
    shadowName: 'Craft',
    shadowAnnotation: 'Pursuit of quality transforms the team',
    color: '#14B8A6',
    colorLight: '#2DD4BF',
  },
  eq: {
    name: 'EQ',
    annotation: 'Team intent and care',
    shadowName: 'Resilience',
    shadowAnnotation: 'Teams that care survive harder',
    color: '#8B5CF6',
    colorLight: '#A78BFA',
  },
};

export const TRADEOFF_CONTENT = {
  money: {
    title: 'Sacrificing Money',
    visible: 'Smaller budget, fewer resources, tighter constraints across the board.',
    hidden: 'You lose optionality. You can\'t pivot. You can\'t run two experiments simultaneously. You can\'t afford to be wrong. Every single bet becomes all-in. The margin for error disappears.',
    hiddenCapability: 'Optionality',
    eq: 'High-EQ teams can operate lean because intrinsic motivation replaces what money would buy. They find creative workarounds, they hustle, they build with less. Low-EQ teams under resource pressure fragment and disengage. The best people leave first.',
    works: 'Early-stage startups with a clear thesis and a team that believes deeply in the mission. You\'re trading optionality for focus, and that can be powerful if you\'re pointed in the right direction.',
    kills: 'When you\'re still searching for product-market fit. Without optionality, you can\'t course-correct. You\'ll run out of runway before you find the answer.',
  },
  time: {
    title: 'Sacrificing Time',
    visible: 'Rushed launches, compressed timelines, fewer iteration cycles, less room for reflection.',
    hidden: 'You lose learning. Fewer build-measure-learn cycles means you\'re shipping assumptions, not validated solutions. You\'re moving fast but possibly in the wrong direction. Speed without learning is just velocity: impressive but directionless.',
    hiddenCapability: 'Learning',
    eq: 'High-EQ teams maintain learning even at speed. They notice signals others miss, they run lightweight experiments in the margins, they stay curious under pressure. They debrief even when exhausted. Low-EQ teams just ship and forget. They move fast but learn nothing from each cycle.',
    works: 'Almost never in a startup context. Founders must move fast. Time is the one axis most founders instinctively protect because competitive pressure demands it.',
    kills: 'When you need to find product-market fit. Ironically, taking more time often gets you there faster because each iteration cycle teaches you something.',
  },
  quality: {
    title: 'Sacrificing Quality',
    visible: 'Rougher product, more bugs, lower polish, technical debt accumulation, user experience compromises.',
    hidden: 'You lose craft. Teams that ship garbage for two years don\'t magically become craftspeople when you finally have budget. The rot is cultural. Standards degrade. Taste atrophies. People who care about craft leave. What remains is a team that doesn\'t know the difference between good and bad work, and that\'s almost impossible to reverse.',
    hiddenCapability: 'Craft',
    eq: 'This is where EQ matters most. A high-EQ team can ship imperfect work and it bothers them. That discomfort is productive. They keep an internal standard even when the output doesn\'t reflect it yet. They come back and fix things. A low-EQ team cuts quality and doesn\'t even notice. They normalize mediocrity. That\'s where permanent cultural damage happens.',
    works: 'When your team has high EQ and you\'re racing to validate a hypothesis. Ship the MVP, learn from it, come back and fix it, but only if the team genuinely carries the internal standard.',
    kills: 'When your team has low EQ. The sacrifice becomes permanent. Quality never recovers because no one remembers what good looked like.',
  },
};

// --- Stage Configurations ---
export const STAGE_CONFIGS = {
  idea: {
    label: 'Idea',
    values: { iq: 70, eq: 85, money: 25, time: 90, quality: 40 },
    description: 'In the idea stage, time and EQ are your most valuable assets. You have little money and quality is deliberately low because you are validating assumptions, not building final products. Learning (time\'s shadow) is everything. Give yourself room to iterate, fail, and discover what the market actually wants.',
    sacrifice: 'Quality',
    shadowToProtect: 'Learning',
    tooltip: 'Pre-product-market fit. Validating assumptions. Time and EQ are highest leverage.',
  },
  build: {
    label: 'Build',
    values: { iq: 80, eq: 80, money: 50, time: 70, quality: 65 },
    description: 'In the build stage, you have validated your hypothesis and now need to construct something real. Quality starts to matter because early users are forming opinions. Money is moderate. Time is still protected but not as aggressively as the idea stage. The balance shifts toward craft.',
    sacrifice: 'Money (stay lean, don\'t over-hire)',
    shadowToProtect: 'Craft (start building taste now, it compounds)',
    tooltip: 'Post-validation. Constructing the real product. Quality begins to compound.',
  },
  growth: {
    label: 'Growth',
    values: { iq: 85, eq: 75, money: 80, time: 50, quality: 80 },
    description: 'In the growth stage, you are scaling what works. Money is higher (funding, revenue, or both). Quality must be high because your reputation is being established at scale. Time pressure increases as competitors emerge. EQ starts to erode naturally because the team is larger and the original intensity dilutes. Actively invest in maintaining EQ through hiring, culture rituals, and psychological safety.',
    sacrifice: 'Time (move fast, but watch for learning loss)',
    shadowToProtect: 'Resilience (culture gets tested at scale)',
    tooltip: 'Scaling what works. Money is available but EQ starts to dilute.',
  },
  scale: {
    label: 'Scale',
    values: { iq: 90, eq: 65, money: 90, time: 60, quality: 90 },
    description: 'At scale, you have resources but EQ is your biggest risk. Jeff Bezos called this Day 2: stasis, followed by irrelevance, followed by death. Large organizations naturally lose emotional investment. Meetings replace building. Process replaces judgment. The leader\'s primary job is protecting EQ against institutional entropy. If EQ drops too low here, no amount of money or quality standards will save the product.',
    sacrifice: 'None (at scale, you should optimize all three, which is only possible if EQ stays high)',
    shadowToProtect: 'All of them (this is where the leader\'s thesis of optimizing all 3 becomes critical)',
    tooltip: 'Optimizing the machine. EQ is the biggest risk. Protect it or decay sets in.',
  },
};

// --- Case Studies ---
export const CASE_STUDIES = [
  {
    id: 'apple-mac',
    name: 'Apple Macintosh (1984)',
    accent: '#8B5CF6',
    accentName: 'purple',
    values: { money: 35, time: 55, quality: 90, eq: 95 },
    oneLiner: 'Small pirate crew outshipped Apple\'s own larger Lisa division',
    lesson: 'Jobs hired for love of the mission, not credentials. Fewer resources than the Lisa team, yet produced the product that changed personal computing.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp (2009-2014)',
    accent: '#3B82F6',
    accentName: 'blue',
    values: { money: 20, time: 80, quality: 85, eq: 90 },
    oneLiner: '50 engineers. 1 billion users. $19B acquisition.',
    lesson: 'Teams of 1-3 engineers with complete autonomy. No ads, no feature creep. By doing less, they moved faster. Radical simplicity as strategy.',
  },
  {
    id: 'zerodha',
    name: 'Zerodha (2010-present)',
    accent: '#14B8A6',
    accentName: 'teal',
    values: { money: 20, time: 85, quality: 90, eq: 90 },
    oneLiner: 'Zero external funding. 12M+ users. India\'s largest broker.',
    lesson: 'Nithin Kamath bootstrapped Zerodha with personal savings. ~1,200 employees serving 12 million clients. No sales targets, no aggressive marketing. Business grew 10x while team size barely changed. Nithin: \'I hated the obligation that money brought on the table.\' Trust compounded faster than any ad spend could.',
  },
  {
    id: 'zoho',
    name: 'Zoho (1996-present)',
    accent: '#F59E0B',
    accentName: 'amber',
    values: { money: 30, time: 90, quality: 85, eq: 85 },
    oneLiner: 'Bootstrapped. 100M+ users. 55+ products. Zero VC money.',
    lesson: 'Sridhar Vembu built Zoho from Chennai without a single rupee of venture capital. Over 15,000 employees, 100 million users across 55+ products. Rejected Silicon Valley growth-at-all-costs playbook. Invested in rural hiring and long-term R&D instead of marketing. Proof that patience and craft compound into empires.',
  },
];

// --- Self-Assessment Questions ---
export const ASSESSMENT_QUESTIONS = {
  money: {
    color: '#F59E0B',
    label: 'Money',
    questions: [
      {
        text: 'Can you afford to run two experiments at the same time?',
        options: [
          { label: 'No, every bet is all-in', value: 20 },
          { label: 'Sometimes, if we plan carefully', value: 55 },
          { label: 'Yes, we have room to explore', value: 85 },
        ],
      },
      {
        text: 'If your current approach fails completely, do you have runway to start over?',
        options: [
          { label: 'We are out of options', value: 15 },
          { label: 'We could pivot once, maybe twice', value: 50 },
          { label: 'We have significant runway remaining', value: 85 },
        ],
      },
      {
        text: 'Can you hire the people you actually need right now?',
        options: [
          { label: 'We are making do with who we have', value: 25 },
          { label: 'We can fill critical gaps', value: 55 },
          { label: 'We can hire ahead of need', value: 80 },
        ],
      },
    ],
  },
  time: {
    color: '#3B82F6',
    label: 'Time',
    questions: [
      {
        text: 'How many full build-measure-learn cycles have you completed in the last 3 months?',
        options: [
          { label: 'Zero or one', value: 20 },
          { label: 'Two to four', value: 55 },
          { label: 'Five or more', value: 85 },
        ],
      },
      {
        text: 'After a launch, does your team have time to debrief and extract learnings?',
        options: [
          { label: 'No, we immediately move to the next thing', value: 20 },
          { label: 'Sometimes, when things calm down', value: 50 },
          { label: 'Yes, retros are built into our process', value: 85 },
        ],
      },
      {
        text: 'Are your deadlines set by market reality or by arbitrary pressure?',
        options: [
          { label: 'Mostly arbitrary or inherited', value: 30 },
          { label: 'Mix of both', value: 55 },
          { label: 'Mostly tied to real market signals', value: 80 },
        ],
      },
    ],
  },
  quality: {
    color: '#14B8A6',
    label: 'Quality',
    questions: [
      {
        text: 'Does your team have written quality standards that people actually follow?',
        options: [
          { label: 'No, quality is subjective and inconsistent', value: 20 },
          { label: 'Informally, we know what good looks like', value: 50 },
          { label: 'Yes, and we hold each other to them', value: 85 },
        ],
      },
      {
        text: 'When was the last time someone pushed back on shipping because quality was not good enough?',
        options: [
          { label: 'I cannot remember that happening', value: 15 },
          { label: 'It happens occasionally', value: 50 },
          { label: 'It happens regularly and is respected', value: 85 },
        ],
      },
      {
        text: 'Is your technical debt visible and tracked?',
        options: [
          { label: 'We do not track it', value: 20 },
          { label: 'We know it exists but do not measure it', value: 50 },
          { label: 'We track it and allocate time to pay it down', value: 85 },
        ],
      },
    ],
  },
  eq: {
    color: '#8B5CF6',
    label: 'EQ',
    questions: [
      {
        text: 'Would your team members pull an all-nighter voluntarily (not under mandate) for this product?',
        options: [
          { label: 'Unlikely', value: 20 },
          { label: 'Some would, for certain problems', value: 55 },
          { label: 'Most would, because they genuinely care', value: 85 },
        ],
      },
      {
        text: 'Do people speak up in meetings when they disagree with the lead or the direction?',
        options: [
          { label: 'Rarely, people stay quiet', value: 15 },
          { label: 'Sometimes, depends on the topic', value: 50 },
          { label: 'Yes, disagreement is expected and safe', value: 90 },
        ],
      },
      {
        text: 'Has anyone on your team referred a friend to join in the last 6 months?',
        options: [
          { label: 'No', value: 20 },
          { label: 'One or two', value: 55 },
          { label: 'Several, people actively recruit for us', value: 85 },
        ],
      },
    ],
  },
};

// --- Action Cards ---
export const ACTION_CARDS = {
  money: {
    heading: 'How to operate with limited money',
    icon: '#F59E0B',
    actions: [
      'Use constraint as a focusing function. You cannot do everything. Pick one bet and go deep.',
      'Invest in EQ to compensate. Intrinsic motivation replaces what money would buy. Hire believers, not mercenaries.',
      'Extend your time axis. If you cannot buy optionality with money, buy it with patience. Give yourself more iteration cycles.',
      'Study WhatsApp: 50 engineers, 1B users. Radical simplicity is a strategy, not a limitation.',
    ],
    shadowReminder: 'You are losing Optionality. Every decision becomes harder to reverse. Make fewer, better decisions.',
    tooltip: 'WhatsApp case: 50 engineers serving 1B+ users. Jan Koum\'s philosophy of radical simplicity created massive leverage from minimal resources.',
  },
  time: {
    heading: 'How to operate under time pressure',
    icon: '#3B82F6',
    actions: [
      'Shorten your iteration cycles, not your ambition. Ship smaller increments more frequently.',
      'Build learning into speed. A 10-minute retro after every deploy costs nothing and compounds fast.',
      'Protect EQ fiercely. Time pressure destroys morale faster than any other constraint. Acknowledge the pressure openly.',
      'Cut scope before cutting corners. Reduce what you build, not how well you build it.',
    ],
    shadowReminder: 'You are losing Learning. Speed without reflection is just velocity. Impressive but directionless.',
    tooltip: 'Toyota\'s kaizen philosophy: small continuous improvements compound into transformative results. One improvement saved 35.1 seconds per car, scaling to nearly 10 years of conserved work globally.',
  },
  quality: {
    heading: 'How to operate with quality sacrificed',
    icon: '#14B8A6',
    actions: [
      'Make the sacrifice conscious and visible. Track quality debt explicitly. Name what you are skipping and why.',
      'Set a recovery date. Before you cut quality, write down when you will pay it back. Put it on the calendar.',
      'Only do this if your team\'s EQ is high. A high-EQ team cuts quality and it bothers them. That discomfort is what brings standards back. A low-EQ team cuts quality and normalizes it.',
      'Watch for cultural drift. The moment "good enough" becomes the standard instead of the exception, you have a problem.',
    ],
    shadowReminder: 'You are losing Craft. This is a compounding shadow. It builds slowly and collapses instantly. The longer you sacrifice quality, the harder it is to recover.',
    tooltip: 'Compounding shadow research: teams that pursued quality developed taste and standards that accelerated all future work. Teams that abandoned quality for 2+ years showed permanent cultural degradation.',
  },
  eq: {
    heading: 'How to rebuild team EQ',
    icon: '#8B5CF6',
    actions: [
      'This is your highest-leverage investment. Everything else gets easier when EQ rises.',
      'Start small. Create psychological safety in one meeting. Ask your team: what is one thing that bothers you that you have not said out loud?',
      'Hire one true believer and give them visible influence. Passion is contagious. One missionary in a mercenary team changes the energy.',
      'Remove one toxic high-performer. Simon Sinek\'s SEAL research: high performance with low trust is more damaging than low performance with high trust.',
      'Tell the story. Remind the team why this product matters. Not the metrics. The human impact.',
    ],
    shadowReminder: 'You are losing Resilience. Without EQ, the next hard period (and there will be one) may break the team permanently.',
    tooltip: 'Google Project Aristotle: studied 180+ teams. Psychological safety was the #1 predictor of team effectiveness, above talent, tenure, seniority, and resources. Amy Edmondson found 85% of employees have withheld important information from managers due to fear.',
  },
};

// --- Tooltip Content ---
export const TOOLTIPS = {
  iq: 'Team capability (IQ) acts as a ceiling on EQ effectiveness. Formula: effective_EQ = EQ × (IQ / 100). A team with EQ of 90 but capability of 50 gets effective EQ of 45. High passion without adequate skill limits how much the multiplier can expand the frontier. Research shows IQ and EQ are weakly correlated. The combination of both is rare and disproportionately powerful.',
  eq: 'EQ (Emotional Quotient) represents the team\'s care, intent, and emotional investment. It acts as a multiplier on all other axes. Formula: eq_multiplier = 0.4 + (effective_EQ / 100) × 1.2. At EQ=0, multiplier is 0.4x (harsh penalty). At EQ=100, multiplier is 1.6x (expanded frontier).',
  optionality: 'Optionality follows a diminishing returns curve. Early money gives massive freedom to pivot. After a threshold, more money barely moves optionality. Formula: optionality = 100 × (1 - e^(-0.03 × effective_money)). Going from 0 to 30 gives ~60 optionality. Going from 70 to 100 gives ~10 more.',
  learning: 'Learning follows the same diminishing returns curve as Optionality. Your first iteration cycles teach enormously more than your 50th. Formula: learning = 100 × (1 - e^(-0.03 × effective_time)). This is why early-stage time investment has disproportionate returns.',
  craft: 'Craft follows a compounding / superlinear curve, unlike Money and Time shadows. Early quality pursuit builds craft slowly, but sustained pursuit accelerates. Formula: craft = 100 × (effective_quality / 160)^1.8. This is why losing craft is catastrophic: it took exponential effort to build and collapses instantly.',
  resilience: 'Resilience compounds like Craft. A team that has survived one crisis together is disproportionately stronger than one that has not been tested. Formula: resilience = 100 × (eq_slider / 100)^1.5. Each survival builds trust, which builds resilience, which enables the next survival.',
  overAllocation: 'The iron triangle budget represents the maximum sustainable allocation across Money, Time, and Quality for your current EQ level. Formula: budget = 200 × eq_multiplier. At default EQ (50), budget = 200. Three sliders at 70 each = 210, which is slightly over budget. Increasing EQ expands the budget, making higher allocations sustainable.',
  volume: 'The pink volume represents your team\'s total product capability space. It is formed by connecting the tips of all four axes into a tetrahedron. Larger volume = more capability. When EQ is high, the shape blooms outward because the multiplier expands all axes simultaneously. When one axis is sacrificed, the shape collapses on that side.',
  stageSelector: 'Product stages represent common tradeoff configurations at different points in the lifecycle. These are recommended starting positions, not rules. Your specific context may require different tradeoffs. The key insight: the axis you protect and the axis you sacrifice should shift as your product matures.',
  selfAssessment: 'This diagnostic uses 12 operational questions (3 per axis) to estimate your team\'s current position. Scores are averaged per axis. Use this to surface blind spots and start team conversations, not as a precise measurement tool.',
  eqDiminishing: 'Beyond EQ of 85, returns diminish sharply. Formula: eq_adjusted = 85 + (eq - 85) × 0.3. This models the inverted U-curve where excessive emotional investment crosses from productive (harmonious passion) to destructive (obsessive passion). Pushing this slider to max does not produce max results.',
  eqObsessive: 'Research by Robert Vallerand distinguishes harmonious passion (voluntary, flexible, sustainable) from obsessive passion (rigid, compulsive, burnout-inducing). Harmonious passion predicts satisfaction and performance. Obsessive passion predicts burnout and work-family conflict. The framework\'s EQ concept targets harmonious passion only.',
  caseStudyHeading: 'These are approximate positions based on historical analysis. Real organizations are more complex than four numbers. Use these as mental models, not precise measurements.',
};
