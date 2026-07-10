import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// VIOLET CROWN — settle-in guide + resource navigator
// Mode 1 "Settle in": curated Austin orgs → 30-day plan
// Mode 2 "Get help":  state → city → needs → Claude follow-ups
//                     → matched resources w/ eligibility → plan
//                     → email / print summary
// ─────────────────────────────────────────────────────────────

const C = {
  ink: "#241E33",
  paper: "#FBFAF7",
  violet: "#5A4A9C",
  violetDeep: "#2A2140",
  dusk: "#8D7BD4",
  amber: "#D98E32",
  green: "#3E7C59",
  line: "#E4E0D6",
  muted: "#6E6880",
};
const DISPLAY = "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif";
const BODY = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif";

// ══════════════════════════════════════════════════════════════
// DATA — settle-in database (Austin)
// ══════════════════════════════════════════════════════════════
const ORGS = [
  { name: "Austin Newcomers Club", url: "https://www.austinnewcomers.com", cat: "social", tags: ["friends"], vibe: "Long-running club built exactly for this — interest groups, lunches, and a soft landing. Skews a bit older, very welcoming.", cost: "paid", cadence: "monthly" },
  { name: "Meetup — 'New to Austin' groups", url: "https://www.meetup.com/find/?location=Austin%2C+TX&keywords=new%20to%20austin", cat: "social", tags: ["friends"], vibe: "Several active transplant groups; quality varies, so try two or three and keep the one that actually meets.", cost: "free", cadence: "weekly" },
  { name: "Bumble For Friends", url: "https://bumble.com/bff", cat: "social", tags: ["friends"], vibe: "Bumble is headquartered here, so the BFF pool in Austin is unusually deep. Low-stakes coffee meetups.", cost: "free", cadence: "ongoing" },
  { name: "r/Austin", url: "https://www.reddit.com/r/Austin/", cat: "media", tags: ["friends", "info"], vibe: "The city's group chat. Search before asking — every newcomer question has a thread already.", cost: "free", cadence: "ongoing" },
  { name: "Nextdoor (your neighborhood)", url: "https://nextdoor.com", cat: "social", tags: ["info", "friends"], vibe: "Hit or miss, but good for garage sales, lost dogs, and learning your street's actual personality.", cost: "free", cadence: "ongoing" },
  { name: "Built In Austin", url: "https://builtin.com/austin", cat: "jobs", tags: ["jobs", "tech"], vibe: "The default tech job board for Austin — startups through big names, plus company culture pages.", cost: "free", cadence: "ongoing" },
  { name: "Capital Factory", url: "https://www.capitalfactory.com", cat: "jobs", tags: ["jobs", "tech", "friends"], vibe: "Downtown startup hub with a constant calendar of open events, demo days, and mixers. Show up to two events and you'll start seeing familiar faces.", cost: "mixed", cadence: "weekly" },
  { name: "Workforce Solutions Capital Area", url: "https://www.wfscapitalarea.com", cat: "jobs", tags: ["jobs", "support"], vibe: "The public workforce board: free career coaching, training funds, and job fairs. Underused and genuinely helpful.", cost: "free", cadence: "ongoing" },
  { name: "Austin Chamber of Commerce events", url: "https://www.austinchamber.com", cat: "jobs", tags: ["jobs"], vibe: "More corporate-flavored networking; useful if your field isn't startup-shaped.", cost: "mixed", cadence: "monthly" },
  { name: "Austin Startup Week", url: "https://www.austinstartupweek.com", cat: "jobs", tags: ["jobs", "tech", "friends"], vibe: "A free week of talks and mixers every fall — the single densest networking window of the year.", cost: "free", cadence: "annual" },
  { name: "LinkedIn Events — Austin", url: "https://www.linkedin.com/events/", cat: "jobs", tags: ["jobs"], vibe: "Filter by Austin; industry happy hours and panels post here first for non-tech fields.", cost: "free", cadence: "weekly" },
  { name: "F.I.E.S.T.A. (Founders, Entrepreneurs & ATX Newcomers)", url: "https://www.fiesta.community", cat: "jobs", tags: ["jobs", "tech", "friends"], vibe: "Networking events built literally for newcomers — founders, job-seekers, and the ATX-curious. One of the friendliest rooms in Austin tech.", cost: "free", cadence: "monthly" },
  { name: "Austin Women in Technology", url: "https://awtaustin.org", cat: "jobs", tags: ["jobs", "tech", "women", "friends"], vibe: "Running since the '90s: networking events, mentorship, and a members' Slack for women in and around tech. Membership open to all who support the mission.", cost: "mixed", cadence: "monthly" },
  { name: "Dress for Success Austin", url: "https://www.dressforsuccessaustin.org", cat: "support", tags: ["jobs", "support", "women", "volunteering"], vibe: "Free career coaching, mentorship courses, and professional attire for women — no income or referral requirements. Also great volunteer shifts.", cost: "free", cadence: "ongoing" },
  { name: "Barton Springs Pool", url: "https://www.austintexas.gov/department/barton-springs-pool", cat: "outdoors", tags: ["outdoors", "fitness"], vibe: "68°F spring-fed pool, the spiritual center of the city. Go once and you'll understand Austin.", cost: "paid", cadence: "ongoing" },
  { name: "Ann & Roy Butler Trail (Lady Bird Lake)", url: "https://thetrailconservancy.org", cat: "outdoors", tags: ["outdoors", "fitness"], vibe: "10-mile downtown loop where the whole city runs, walks, and people-watches. Free and always on.", cost: "free", cadence: "ongoing" },
  { name: "Austin Bouldering Project", url: "https://austinboulderingproject.com", cat: "outdoors", tags: ["fitness", "friends"], vibe: "Huge east-side climbing gym that doubles as a social scene — one of the easiest places in town to make friends in your 20s–30s.", cost: "paid", cadence: "ongoing" },
  { name: "Crux Climbing Center", url: "https://www.cruxcc.com", cat: "outdoors", tags: ["fitness", "friends"], vibe: "The other beloved climbing gym; smaller and rope-focused. Community nights are the move.", cost: "paid", cadence: "ongoing" },
  { name: "Austin Runners Club", url: "https://www.austinrunners.org", cat: "outdoors", tags: ["fitness", "friends"], vibe: "Group runs at every pace. Showing up to the same weekly run is the cheapest friendship hack in this list.", cost: "free", cadence: "weekly" },
  { name: "Greenbelt (Barton Creek)", url: "https://austinparks.org", cat: "outdoors", tags: ["outdoors"], vibe: "Miles of trail and swimming holes hiding inside the city. Check water levels — it's seasonal.", cost: "free", cadence: "ongoing" },
  { name: "Do512", url: "https://do512.com", cat: "media", tags: ["music", "info", "food"], vibe: "The event calendar locals actually use. Sign up for the newsletter and your weekends fill themselves.", cost: "free", cadence: "ongoing" },
  { name: "The Austin Chronicle", url: "https://www.austinchronicle.com", cat: "media", tags: ["music", "info"], vibe: "Free alt-weekly with the definitive events listings and a strong opinion about everything.", cost: "free", cadence: "weekly" },
  { name: "KUTX 98.9", url: "https://kutx.org", cat: "music", tags: ["music"], vibe: "The Austin music station — free live tapings and pop-up shows around town.", cost: "free", cadence: "weekly" },
  { name: "Blues on the Green", url: "https://www.austincityparksfoundation.org", cat: "music", tags: ["music", "friends"], vibe: "Free summer concert series at Zilker Park. Bring a blanket; the whole city shows up.", cost: "free", cadence: "annual" },
  { name: "First Thursday on South Congress", url: "https://www.southcongressavenue.com", cat: "music", tags: ["music", "food", "friends"], vibe: "Monthly open-late street night on SoCo — an easy, no-commitment thing to invite a new acquaintance to.", cost: "free", cadence: "monthly" },
  { name: "Austin Film Society", url: "https://www.austinfilm.org", cat: "creative", tags: ["art", "friends"], vibe: "Repertory screenings and a film community founded by Richard Linklater. Membership pays for itself fast.", cost: "mixed", cadence: "weekly" },
  { name: "Blanton Museum of Art", url: "https://blantonmuseum.org", cat: "creative", tags: ["art"], vibe: "UT's serious art museum; free Tuesdays are a standing cheap-date / solo-afternoon option.", cost: "mixed", cadence: "ongoing" },
  { name: "Austin Public Library", url: "https://library.austintexas.gov", cat: "support", tags: ["info", "art", "family", "support"], vibe: "The Central Library is one of the best buildings in Texas: free events, classes, coworking-quality space, and a rooftop garden.", cost: "free", cadence: "ongoing" },
  { name: "BookPeople events", url: "https://www.bookpeople.com", cat: "creative", tags: ["books", "friends"], vibe: "Texas's biggest indie bookstore, with author events most weeks and multiple book clubs.", cost: "free", cadence: "weekly" },
  { name: "Austin Creative Reuse", url: "https://austincreativereuse.org", cat: "creative", tags: ["art"], vibe: "A thrift store for craft supplies with workshops and volunteer shifts — creative people, low prices.", cost: "free", cadence: "ongoing" },
  { name: "Austin Bat Cave", url: "https://www.austinbatcave.org", cat: "volunteer", tags: ["books", "volunteering"], vibe: "Youth writing nonprofit; volunteering as a tutor is a fast way into the literary crowd.", cost: "free", cadence: "weekly" },
  { name: "Emerald Tavern Games & Cafe", url: "https://emeraldtavern.com", cat: "social", tags: ["games", "friends"], vibe: "Board game cafe with open game nights — built for showing up alone and leaving with people.", cost: "mixed", cadence: "weekly" },
  { name: "Pinballz", url: "https://pinballz.com", cat: "social", tags: ["games"], vibe: "Sprawling arcade; good group outing once you have a group.", cost: "paid", cadence: "ongoing" },
  { name: "Texas Farmers' Market at Mueller", url: "https://texasfarmersmarket.org", cat: "food", tags: ["food", "friends"], vibe: "Sunday market that doubles as a neighborhood hang. Regulars get recognized within a month.", cost: "free", cadence: "weekly" },
  { name: "SFC Farmers' Market", url: "https://sustainablefoodcenter.org", cat: "food", tags: ["food", "volunteering"], vibe: "Downtown Saturday market run by the Sustainable Food Center, which also offers cooking classes and volunteer shifts.", cost: "free", cadence: "weekly" },
  { name: "Central Texas Food Bank", url: "https://www.centraltexasfoodbank.org", cat: "volunteer", tags: ["volunteering", "friends", "support"], vibe: "Big, well-run volunteer shifts you can book solo — the classic 'meet good people while doing good' option.", cost: "free", cadence: "weekly" },
  { name: "Austin Pets Alive!", url: "https://www.austinpetsalive.org", cat: "volunteer", tags: ["volunteering", "dogs", "friends"], vibe: "The famous no-kill shelter. Dog-walking shifts get you exercise, dogs, and people, in one move.", cost: "free", cadence: "weekly" },
  { name: "Meals on Wheels Central Texas", url: "https://www.mealsonwheelscentraltexas.org", cat: "volunteer", tags: ["volunteering"], vibe: "Flexible delivery routes; a good fit if your schedule is unpredictable.", cost: "free", cadence: "weekly" },
  { name: "Austin Parks Foundation volunteer days", url: "https://austinparks.org/volunteer", cat: "volunteer", tags: ["volunteering", "outdoors"], vibe: "Park workdays around the city — outdoors, hands in the dirt, neighbors you'd never otherwise meet.", cost: "free", cadence: "monthly" },
  { name: "Foundation Communities", url: "https://foundcom.org", cat: "support", tags: ["support", "volunteering"], vibe: "Affordable housing nonprofit with free tax help, financial coaching, and adult education — for getting help or giving it.", cost: "free", cadence: "ongoing" },
  { name: "Casa Marianella", url: "https://www.casamarianella.org", cat: "volunteer", tags: ["volunteering", "support"], vibe: "East Austin shelter for immigrants and asylum seekers; English tutoring and meal shifts.", cost: "free", cadence: "weekly" },
  { name: "2-1-1 Texas", url: "https://www.211texas.org", cat: "support", tags: ["support"], vibe: "One phone number / site for finding rent help, food, healthcare, and crisis services across Central Texas.", cost: "free", cadence: "ongoing" },
  { name: "Do512 Family", url: "https://family.do512.com", cat: "family", tags: ["family", "info"], vibe: "The family edition of the events calendar — free weekend roundups that make kid planning easy.", cost: "free", cadence: "weekly" },
  { name: "Austin Public Library — kids programs", url: "https://library.austintexas.gov/events", cat: "family", tags: ["family"], vibe: "Storytimes and free kids programming at every branch, which is also where parents meet parents.", cost: "free", cadence: "weekly" },
  { name: "Thinkery", url: "https://thinkeryaustin.org", cat: "family", tags: ["family"], vibe: "Children's museum at Mueller; a membership is the standard first purchase of Austin parents.", cost: "paid", cadence: "ongoing" },
];

// ══════════════════════════════════════════════════════════════
// DATA — support/services database (Austin) for the navigator
// Starter data — verify links & program details before launch.
// ══════════════════════════════════════════════════════════════
const SUPPORT_DB = {
  Housing: [
    { name: "Foundation Communities", url: "https://foundcom.org", what: "Affordable apartments plus free financial coaching and tax help.", eligibility: "Income limits vary by property; waitlists common — apply to several." },
    { name: "2-1-1 Texas", url: "https://www.211texas.org", what: "Referrals for rent assistance, shelters, and utility help. Dial 2-1-1.", eligibility: "Open to everyone; the operator screens for programs you qualify for." },
    { name: "Austin Tenants Council", url: "https://www.housing-rights.org", what: "Tenant rights counseling, repair disputes, and eviction help.", eligibility: "Counseling generally free to Travis County renters." },
  ],
  Food: [
    { name: "Central Texas Food Bank", url: "https://www.centraltexasfoodbank.org", what: "Food pantry locator, mobile pantries, and SNAP application help.", eligibility: "Pantries are low-barrier; SNAP has income limits — their staff will screen you for free." },
    { name: "YourTexasBenefits (SNAP)", url: "https://www.yourtexasbenefits.com", what: "The state portal to apply for SNAP food benefits, Medicaid, and TANF.", eligibility: "Based on household income and size; citizenship/immigration rules apply to some programs." },
  ],
  Employment: [
    { name: "Workforce Solutions Capital Area", url: "https://www.wfscapitalarea.com", what: "Free career coaching, resume help, job fairs, and paid training programs.", eligibility: "Core services free to all; training funds have eligibility screens." },
    { name: "Goodwill Central Texas career services", url: "https://www.goodwillcentraltexas.org", what: "Job placement, career centers, and training certificates.", eligibility: "Open to the public; some programs prioritize specific barriers to work." },
    { name: "Dress for Success Austin", url: "https://www.dressforsuccessaustin.org", what: "Career coaching, six-week mentorship course, and professional attire for women.", eligibility: "Serves all women job-seekers — no income or referral requirement." },
  ],
  Healthcare: [
    { name: "CommUnityCare Health Centers", url: "https://communitycaretx.org", what: "Sliding-scale clinics across Travis County: primary care, dental, behavioral health.", eligibility: "Everyone accepted; fees slide with income, insured or not." },
    { name: "Central Health MAP", url: "https://www.centralhealth.net", what: "Travis County's Medical Access Program — coverage for low-income residents.", eligibility: "Travis County residents under income limits; immigration status not a barrier for MAP." },
    { name: "Integral Care", url: "https://integralcare.org", what: "Mental health and substance use services; 24/7 helpline 512-472-4357.", eligibility: "Serves Travis County; sliding scale, crisis line open to all." },
  ],
  Legal: [
    { name: "Texas RioGrande Legal Aid", url: "https://www.trla.org", what: "Free civil legal help: housing, family, employment, benefits.", eligibility: "Generally under 125% of federal poverty line; some exceptions." },
    { name: "Volunteer Legal Services of Central Texas", url: "https://www.vlsoct.org", what: "Free legal clinics and pro bono representation.", eligibility: "Income-qualified; clinic triage decides what they can take." },
  ],
  Immigration: [
    { name: "American Gateways", url: "https://www.americangateways.org", what: "Low-cost immigration legal services: asylum, DACA, citizenship, visas.", eligibility: "Serves Central Texas; fees sliding-scale, some services free." },
    { name: "Casa Marianella", url: "https://www.casamarianella.org", what: "Shelter and support for recently arrived immigrants and asylum seekers.", eligibility: "Focused on adults experiencing homelessness who are recent immigrants." },
  ],
  Education: [
    { name: "Austin Community College", url: "https://www.austincc.edu", what: "Degrees, fast-track certificates, GED prep, and free adult education classes.", eligibility: "Open enrollment; adult ed and some workforce programs are free." },
    { name: "Austin Public Library", url: "https://library.austintexas.gov", what: "Free ESL conversation clubs, computer classes, and online learning licenses.", eligibility: "Free with a library card; card is free for city residents." },
    { name: "Literacy Coalition of Central Texas", url: "https://www.willread.org", what: "Adult literacy, ESL, and digital skills classes.", eligibility: "Free or low-cost for adult learners." },
  ],
  "Small Business": [
    { name: "City of Austin Small Business Program", url: "https://www.austintexas.gov/department/small-business", what: "Free classes, coaching, and the BizAid orientation for starting a business.", eligibility: "Free to anyone starting or running a business in Austin." },
    { name: "Texas State SBDC (Austin)", url: "https://www.txstatesbdc.org", what: "Free one-on-one business advising and market research.", eligibility: "Free for small businesses and aspiring founders in the region." },
    { name: "SCORE Austin", url: "https://www.score.org/austin", what: "Free mentoring from retired executives, plus workshops.", eligibility: "Free; open to anyone." },
  ],
};

const NEED_CATS = Object.keys(SUPPORT_DB);
const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];

// Static follow-up questions if the API is unavailable
const STATIC_FOLLOWUPS = {
  Housing: { id: "housing_sit", question: "What best describes your housing situation?", options: ["Looking for affordable housing", "Behind on rent / facing eviction", "Currently without stable housing", "Dispute with a landlord"] },
  Food: { id: "food_sit", question: "What kind of food help fits best?", options: ["Groceries this week", "Ongoing benefits (SNAP)", "Meals for kids or seniors"] },
  Employment: { id: "job_sit", question: "Where are you in the job search?", options: ["Need a job ASAP", "Want training / a new career", "Have interviews, need prep or attire"] },
  Healthcare: { id: "health_sit", question: "What do you need care for?", options: ["General / primary care", "Mental health", "Dental", "I need coverage / insurance help"] },
  Legal: { id: "legal_sit", question: "What area of law is this?", options: ["Housing / eviction", "Family", "Employment", "Benefits / other civil"] },
  Immigration: { id: "immig_sit", question: "What kind of immigration help?", options: ["Legal status / applications", "Recently arrived, need basics", "Citizenship / naturalization"] },
  Education: { id: "edu_sit", question: "What are you hoping to learn?", options: ["English (ESL)", "GED / high school equivalency", "Job skills or a certificate", "College"] },
  "Small Business": { id: "biz_sit", question: "Where is your business at?", options: ["Just an idea", "Starting up (first year)", "Running and want to grow"] },
};

const COMMON_Q = { id: "household", question: "Which of these describe you? (helps with eligibility)", options: ["Working / have income", "Low or no income right now", "Have kids at home", "Veteran", "Prefer not to say"] };

// ══════════════════════════════════════════════════════════════
// API helpers
// ══════════════════════════════════════════════════════════════
async function callClaude(prompt, useSearch) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function getFollowUps(state, city, needs) {
  const prompt = `A person in ${city}, ${state} needs help with: ${needs.join(", ")}.
Write follow-up questions to route them to the right local resources and explain eligibility.
Respond ONLY with JSON, no markdown fences:
{"questions":[{"id":"short_id","question":"...","options":["...","..."]}]}
Rules: max 3 questions total, each with 3-5 short tappable options, plain 8th-grade language, no questions about immigration status or anything invasive — ask about the situation, not the person's status.`;
  return callClaude(prompt, false);
}

async function getPlan(state, city, needs, answers) {
  const isAustin = city.trim().toLowerCase() === "austin" && state === "Texas";
  const curated = isAustin
    ? "Curated local resources you should prefer (verify nothing extra is needed):\n" +
      needs.map((n) => (SUPPORT_DB[n] || []).map((r) => `- ${r.name} (${r.url}) — ${r.what} Eligibility: ${r.eligibility}`).join("\n")).join("\n")
    : "No curated list for this city — use web search to find real, current local organizations and official programs. Prefer .gov and established nonprofits. Include real URLs only.";
  const prompt = `You are a social services navigator. Person in ${city}, ${state}. Needs: ${needs.join(", ")}. Their answers to intake questions: ${JSON.stringify(answers)}.
${curated}
Respond ONLY with JSON, no markdown fences:
{"summary":"2 warm sentences addressed to 'you' about their path forward",
 "resources":[{"name":"...","url":"https://...","what":"one sentence: what they provide","eligibility":"one sentence: who qualifies and any income/residency rules","firstStep":"the very first concrete action, under 15 words"}],
 "plan":[{"step":"imperative step title","detail":"one sentence"}],
 "note":"one sentence of honest practical advice"}
Rules: 4-6 resources max, most urgent first. 4-6 plan steps in the order they should actually be done. Eligibility must be honest about limits, never promise approval. Plain language.`;
  return callClaude(prompt, !isAustin);
}

function staticNavPlan(city, needs, answers) {
  const resources = needs.flatMap((n) => (SUPPORT_DB[n] || []).map((r) => ({ ...r, firstStep: "Visit the site and find the intake or 'get help' page." }))).slice(0, 6);
  return {
    summary: `Here's a starting map for ${needs.join(" and ").toLowerCase()} help in ${city}. Every organization below is established and used to walking people through their first call.`,
    resources,
    plan: [
      { step: "Call 2-1-1 first", detail: "One call screens you for multiple programs at once — it's the fastest way to learn what you qualify for." },
      { step: "Contact the top resource above", detail: "Ask specifically: 'What do I need to bring to apply?' and write it down." },
      { step: "Gather your documents", detail: "ID, proof of address, and proof of income cover most applications." },
      { step: "Apply to more than one program", detail: "Waitlists are real; parallel applications protect you." },
      { step: "Set a follow-up reminder", detail: "Programs rarely chase you — check back weekly on any pending application." },
    ],
    note: "Bring patience and paperwork: most delays are missing documents, not rejections.",
  };
}

function summaryText(nav, plan) {
  const lines = [
    `MY RESOURCE PLAN — ${nav.city}, ${nav.state}`,
    `Needs: ${nav.needs.join(", ")}`,
    "",
    "RESOURCES:",
    ...plan.resources.map((r) => `• ${r.name} — ${r.url}\n  ${r.what} Eligibility: ${r.eligibility}\n  First step: ${r.firstStep}`),
    "",
    "ACTION PLAN:",
    ...plan.plan.map((s, i) => `${i + 1}. ${s.step} — ${s.detail}`),
    "",
    `Note: ${plan.note}`,
  ];
  return lines.join("\n");
}

// ══════════════════════════════════════════════════════════════
// Settle-in mode helpers (unchanged logic)
// ══════════════════════════════════════════════════════════════
const AREAS = ["North Austin", "Central Austin", "South Austin", "East Austin", "West Austin", "the suburbs", "…not sure yet"];
const FIELDS = ["tech", "healthcare", "education", "creative work", "hospitality", "the trades", "a remote job", "school (student)", "the job hunt"];
const INTERESTS = [
  { id: "music", label: "live music" }, { id: "outdoors", label: "the outdoors" }, { id: "fitness", label: "fitness" },
  { id: "food", label: "food & markets" }, { id: "books", label: "books & writing" }, { id: "art", label: "art & film" },
  { id: "games", label: "games" }, { id: "dogs", label: "dogs" }, { id: "volunteering", label: "volunteering" },
  { id: "women", label: "women's groups" },
];
const GOALS = [
  { id: "friends", label: "new friends" }, { id: "jobs", label: "job leads" }, { id: "info", label: "things to do" },
  { id: "support", label: "support services" }, { id: "family", label: "family stuff" },
];

function matchOrgs(profile) {
  const wanted = new Set([...profile.interests, ...profile.goals]);
  if (profile.field === "tech") wanted.add("tech");
  return ORGS.map((o) => {
    let score = 0;
    o.tags.forEach((t) => { if (wanted.has(t)) score += 2; });
    if (profile.goals.includes("jobs") && o.cat === "jobs") score += 2;
    if (profile.goals.includes("friends") && (o.cat === "social" || o.tags.includes("friends"))) score += 1;
    if (profile.goals.includes("support") && o.cat === "support") score += 3;
    if (profile.goals.includes("family") && o.cat === "family") score += 3;
    if (o.cost === "free") score += 0.5;
    return { ...o, score };
  }).filter((o) => o.score > 0).sort((a, b) => b.score - a.score).slice(0, 14);
}

async function writeSettlePlan(profile, matches) {
  const prompt = `You are writing a warm, specific "first 30 days in Austin" plan for a newcomer.
Profile: lives in ${profile.area}; works in ${profile.field}; interests: ${profile.interests.join(", ") || "unspecified"}; looking for: ${profile.goals.join(", ")}.
Use ONLY these curated matches:
${matches.map((m) => `- ${m.name} — ${m.vibe} (${m.cadence}, ${m.cost})`).join("\n")}
Respond ONLY with JSON, no markdown fences:
{"intro":"2 sentences, warm, addressed to 'you'","weeks":[{"title":"Week 1 — ...","items":[{"org":"exact org name","action":"one concrete thing, under 20 words"}]},{"title":"Weeks 2–3 — ...","items":[]},{"title":"Week 4 — ...","items":[]}],"proTip":"one honest insider sentence"}
2-3 items per week, 7-8 orgs total, no repeats.`;
  return callClaude(prompt, false);
}

function staticSettlePlan(profile, matches) {
  const third = Math.ceil(matches.length / 3);
  const chunk = (i) => matches.slice(i * third, i * third + Math.min(third, 3));
  return {
    intro: `Here's your starter map of Austin — built around ${profile.goals.map((g) => GOALS.find((x) => x.id === g)?.label).join(", ")}.`,
    weeks: [
      { title: "Week 1 — get your bearings", items: chunk(0).map((m) => ({ org: m.name, action: "Check the calendar and put one date on yours." })) },
      { title: "Weeks 2–3 — show up twice", items: chunk(1).map((m) => ({ org: m.name, action: "Go once, then go again — familiarity is the whole trick." })) },
      { title: "Week 4 — put down a root", items: chunk(2).map((m) => ({ org: m.name, action: "Pick your favorite so far and commit to it monthly." })) },
    ],
    proTip: "Pick two recurring things and never miss them. Consistency beats variety.",
  };
}

// ══════════════════════════════════════════════════════════════
// UI atoms
// ══════════════════════════════════════════════════════════════
function Chip({ active, children, onClick }) {
  return (
    <button onClick={onClick}
      className="rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2"
      style={{ fontFamily: BODY, borderColor: active ? C.violet : C.line, background: active ? C.violet : "transparent", color: active ? "#fff" : C.ink }}>
      {children}
    </button>
  );
}

function BigCheck({ active, children, onClick }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors focus:outline-none focus-visible:ring-2"
      style={{ borderColor: active ? C.violet : C.line, background: active ? "#F1EEFA" : "#fff" }}>
      <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs"
        style={{ borderColor: active ? C.violet : C.line, background: active ? C.violet : "#fff", color: "#fff" }}>
        {active ? "✓" : ""}
      </span>
      <span style={{ fontFamily: BODY }}>{children}</span>
    </button>
  );
}

function Blank({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="mx-1 cursor-pointer bg-transparent focus:outline-none focus-visible:ring-2"
      style={{ fontFamily: DISPLAY, fontStyle: "italic", color: value ? C.violet : C.muted, borderBottom: `2px solid ${value ? C.violet : C.line}`, fontSize: "inherit" }}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (<option key={o} value={o} style={{ fontStyle: "normal", color: C.ink }}>{o}</option>))}
    </select>
  );
}

function CostTag({ cost }) {
  const map = { free: ["free", C.green], paid: ["paid", C.amber], mixed: ["free + paid", C.muted] };
  const [label, color] = map[cost] || map.mixed;
  return <span className="rounded-full px-2 py-0.5 text-xs" style={{ border: `1px solid ${color}`, color }}>{label}</span>;
}

function Loading({ children }) {
  return (
    <section className="mt-16 text-center">
      <div className="mx-auto h-2 w-48 overflow-hidden rounded-full" style={{ background: C.line }}>
        <div className="h-full w-1/2 animate-pulse rounded-full" style={{ background: `linear-gradient(90deg, ${C.violet}, ${C.amber})` }} />
      </div>
      <p className="mt-4" style={{ fontFamily: DISPLAY, fontStyle: "italic", color: C.muted }}>{children}</p>
    </section>
  );
}

function Horizon() {
  return (
    <div aria-hidden="true" className="relative w-full overflow-hidden print:hidden" style={{ height: 120 }}>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.violetDeep} 0%, ${C.violet} 45%, ${C.dusk} 72%, ${C.amber} 100%)` }} />
      <svg viewBox="0 0 800 40" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-10 w-full">
        <path d="M0,40 L0,26 Q80,10 170,22 Q260,34 340,18 Q420,4 520,20 Q620,34 710,16 L800,24 L800,40 Z" fill={C.paper} opacity="0.16" />
        <path d="M0,40 L0,32 Q100,20 200,28 Q300,36 400,24 Q500,14 620,26 Q720,34 800,28 L800,40 Z" fill={C.ink} />
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MODE 2 — Get Help navigator
// ══════════════════════════════════════════════════════════════
function HelpNavigator({ onBack }) {
  const [step, setStep] = useState(0); // 0 welcome/state, 1 city, 2 needs, 3 followups, 4 loading, 5 results
  const [nav, setNav] = useState({ state: "Texas", city: "", needs: [] });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [fallback, setFallback] = useState(false);

  const toggleNeed = (n) => setNav((p) => ({ ...p, needs: p.needs.includes(n) ? p.needs.filter((x) => x !== n) : [...p.needs, n] }));

  async function loadFollowUps() {
    setStep(3.5);
    try {
      const r = await getFollowUps(nav.state, nav.city, nav.needs);
      const qs = (r.questions || []).slice(0, 3);
      if (!qs.length) throw new Error("empty");
      setQuestions([...qs, COMMON_Q].slice(0, 3));
    } catch {
      const qs = nav.needs.slice(0, 2).map((n) => STATIC_FOLLOWUPS[n]).filter(Boolean);
      setQuestions([...qs, COMMON_Q].slice(0, 3));
    }
    setStep(3);
  }

  async function buildPlan() {
    setStep(4);
    try {
      const p = await getPlan(nav.state, nav.city, nav.needs, answers);
      if (!p || !p.resources) throw new Error("bad shape");
      setPlan(p);
      setFallback(false);
    } catch {
      setPlan(staticNavPlan(nav.city || "your city", nav.needs, answers));
      setFallback(true);
    }
    setStep(5);
  }

  const emailHref = plan
    ? `mailto:?subject=${encodeURIComponent(`My resource plan — ${nav.city}, ${nav.state}`)}&body=${encodeURIComponent(summaryText(nav, plan).slice(0, 1800))}`
    : "#";

  return (
    <section className="mt-6">
      <button onClick={onBack} className="text-sm underline underline-offset-2 print:hidden" style={{ color: C.muted }}>← Back to start</button>

      {/* Progress dots */}
      <div className="mt-4 flex gap-2 print:hidden" aria-hidden="true">
        {[0, 1, 2, 3, 5].map((s, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: step >= s ? C.violet : C.line }} />
        ))}
      </div>

      {step === 0 && (
        <div className="mt-8">
          <h2 className="text-3xl" style={{ fontFamily: DISPLAY }}>Welcome. Let's find you help.</h2>
          <p className="mt-2" style={{ color: C.muted }}>A few taps, no account, nothing stored. First — which state are you in?</p>
          <select value={nav.state} onChange={(e) => setNav((p) => ({ ...p, state: e.target.value }))}
            aria-label="Your state"
            className="mt-4 w-full rounded-xl border p-4 text-lg focus:outline-none focus-visible:ring-2 sm:w-80"
            style={{ borderColor: C.line, background: "#fff", fontFamily: BODY }}>
            {US_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div><button onClick={() => setStep(1)} className="mt-6 rounded-xl px-6 py-3 text-lg text-white focus:outline-none focus-visible:ring-2" style={{ background: C.violet, fontFamily: DISPLAY }}>Next →</button></div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8">
          <h2 className="text-3xl" style={{ fontFamily: DISPLAY }}>Which city in {nav.state}?</h2>
          <input value={nav.city} onChange={(e) => setNav((p) => ({ ...p, city: e.target.value }))}
            placeholder={nav.state === "Texas" ? "e.g. Austin" : "Your city"}
            aria-label="Your city"
            className="mt-4 w-full rounded-xl border p-4 text-lg focus:outline-none focus-visible:ring-2 sm:w-80"
            style={{ borderColor: C.line, background: "#fff", fontFamily: BODY }} />
          {nav.city.trim().toLowerCase() === "austin" && nav.state === "Texas" && (
            <p className="mt-2 text-sm" style={{ color: C.green }}>✓ Austin — we have a hand-curated local list for you.</p>
          )}
          <div><button onClick={() => setStep(2)} disabled={!nav.city.trim()}
            className="mt-6 rounded-xl px-6 py-3 text-lg focus:outline-none focus-visible:ring-2"
            style={{ background: nav.city.trim() ? C.violet : C.line, color: nav.city.trim() ? "#fff" : C.muted, fontFamily: DISPLAY, cursor: nav.city.trim() ? "pointer" : "not-allowed" }}>Next →</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <h2 className="text-3xl" style={{ fontFamily: DISPLAY }}>What do you need help with?</h2>
          <p className="mt-2" style={{ color: C.muted }}>Pick everything that applies.</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {NEED_CATS.map((n) => <BigCheck key={n} active={nav.needs.includes(n)} onClick={() => toggleNeed(n)}>{n}</BigCheck>)}
          </div>
          <button onClick={loadFollowUps} disabled={!nav.needs.length}
            className="mt-6 rounded-xl px-6 py-3 text-lg focus:outline-none focus-visible:ring-2"
            style={{ background: nav.needs.length ? C.violet : C.line, color: nav.needs.length ? "#fff" : C.muted, fontFamily: DISPLAY, cursor: nav.needs.length ? "pointer" : "not-allowed" }}>Next →</button>
        </div>
      )}

      {step === 3.5 && <Loading>Writing a couple of quick questions for your situation…</Loading>}

      {step === 3 && (
        <div className="mt-8">
          <h2 className="text-3xl" style={{ fontFamily: DISPLAY }}>A couple of quick questions</h2>
          <p className="mt-2" style={{ color: C.muted }}>These sharpen the matches and the eligibility notes. Skip any you like.</p>
          {questions.map((q) => (
            <fieldset key={q.id} className="mt-6">
              <legend className="font-medium" style={{ fontFamily: BODY }}>{q.question}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((o) => (
                  <Chip key={o} active={answers[q.id] === o} onClick={() => setAnswers((a) => ({ ...a, [q.id]: a[q.id] === o ? undefined : o }))}>{o}</Chip>
                ))}
              </div>
            </fieldset>
          ))}
          <button onClick={buildPlan} className="mt-8 rounded-xl px-6 py-3 text-lg text-white focus:outline-none focus-visible:ring-2" style={{ background: C.violet, fontFamily: DISPLAY }}>
            Find my resources →
          </button>
        </div>
      )}

      {step === 4 && <Loading>Matching you to local resources and writing your plan…</Loading>}

      {step === 5 && plan && (
        <div className="mt-8">
          <p className="text-lg leading-relaxed" style={{ fontFamily: DISPLAY }}>{plan.summary}</p>
          {fallback && <p className="mt-2 text-sm" style={{ color: C.muted }}>(Offline mode — showing the standard local list.)</p>}

          <h3 className="mt-8 text-xl" style={{ fontFamily: DISPLAY, color: C.violet }}>Your resources</h3>
          <div className="mt-3 space-y-3">
            {plan.resources.map((r, i) => (
              <div key={i} className="rounded-xl p-4" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-2 underline-offset-2" style={{ textDecorationColor: C.dusk }}>{r.name}</a>
                <p className="mt-1 text-sm">{r.what}</p>
                <p className="mt-1 text-sm" style={{ color: C.muted }}><span className="font-medium" style={{ color: C.green }}>Who qualifies:</span> {r.eligibility}</p>
                <p className="mt-1 text-sm"><span className="font-medium" style={{ color: C.amber }}>First step:</span> {r.firstStep}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-xl" style={{ fontFamily: DISPLAY, color: C.violet }}>Your action plan</h3>
          <ol className="mt-3 space-y-3">
            {plan.plan.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white" style={{ background: C.violet, fontFamily: DISPLAY }}>{i + 1}</span>
                <div><p className="font-medium">{s.step}</p><p className="text-sm" style={{ color: C.muted }}>{s.detail}</p></div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl p-5" style={{ background: C.violetDeep, color: "#fff" }}>
            <p className="text-xs uppercase" style={{ letterSpacing: "0.2em", color: C.dusk }}>Navigator's note</p>
            <p className="mt-2" style={{ fontFamily: DISPLAY, fontSize: "1.1rem" }}>{plan.note}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <a href={emailHref} className="rounded-xl px-5 py-3 text-white focus:outline-none focus-visible:ring-2" style={{ background: C.violet, fontFamily: DISPLAY }}>Email me this plan</a>
            <button onClick={() => window.print()} className="rounded-xl px-5 py-3 focus:outline-none focus-visible:ring-2" style={{ border: `1px solid ${C.violet}`, color: C.violet, fontFamily: DISPLAY }}>Print / save as PDF</button>
            <button onClick={() => { setStep(0); setPlan(null); setAnswers({}); setNav({ state: "Texas", city: "", needs: [] }); }} className="rounded-xl px-5 py-3 focus:outline-none focus-visible:ring-2" style={{ border: `1px solid ${C.line}`, color: C.muted, fontFamily: DISPLAY }}>Start over</button>
          </div>

          <p className="mt-6 text-xs" style={{ color: C.muted }}>
            Program rules and availability change often — the organizations above make the final call on eligibility. Nothing you entered is saved.
          </p>
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// MODE 1 — Settle In (existing flow)
// ══════════════════════════════════════════════════════════════
function SettleIn({ onBack }) {
  const [profile, setProfile] = useState({ area: "", field: "", interests: [], goals: [] });
  const [phase, setPhase] = useState("intake");
  const [plan, setPlan] = useState(null);
  const [matches, setMatches] = useState([]);
  const [usedFallback, setUsedFallback] = useState(false);

  const toggle = (key, id) => setProfile((p) => ({ ...p, [key]: p[key].includes(id) ? p[key].filter((x) => x !== id) : [...p[key], id] }));
  const ready = profile.area && profile.field && profile.goals.length > 0;

  async function build() {
    const m = matchOrgs(profile);
    setMatches(m);
    setPhase("loading");
    try {
      const p = await writeSettlePlan(profile, m);
      if (!p || !p.weeks) throw new Error("bad shape");
      setPlan(p); setUsedFallback(false);
    } catch {
      setPlan(staticSettlePlan(profile, m)); setUsedFallback(true);
    }
    setPhase("results");
  }

  const orgByName = (n) => matches.find((m) => m.name === n) || ORGS.find((o) => o.name === n);

  return (
    <section className="mt-6">
      <button onClick={onBack} className="text-sm underline underline-offset-2" style={{ color: C.muted }}>← Back to start</button>

      {phase === "intake" && (
        <div className="mt-6">
          <div className="rounded-2xl p-6 sm:p-8" style={{ border: `1px solid ${C.line}`, background: "#fff", fontFamily: DISPLAY, fontSize: "1.35rem", lineHeight: 2.1 }}>
            I just moved to
            <Blank value={profile.area} onChange={(v) => setProfile((p) => ({ ...p, area: v }))} options={AREAS} placeholder="which part of town" />
            . I work in
            <Blank value={profile.field} onChange={(v) => setProfile((p) => ({ ...p, field: v }))} options={FIELDS} placeholder="your field" />
            , and mostly I'm looking for
            <span className="mx-1" style={{ color: profile.goals.length ? C.violet : C.muted, fontStyle: "italic", borderBottom: `2px solid ${profile.goals.length ? C.violet : C.line}` }}>
              {profile.goals.length ? profile.goals.map((g) => GOALS.find((x) => x.id === g)?.label).join(" + ") : "…"}
            </span>.
          </div>
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase" style={{ letterSpacing: "0.18em", color: C.muted }}>I'm looking for (pick any)</p>
            <div className="flex flex-wrap gap-2">{GOALS.map((g) => <Chip key={g.id} active={profile.goals.includes(g.id)} onClick={() => toggle("goals", g.id)}>{g.label}</Chip>)}</div>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-xs uppercase" style={{ letterSpacing: "0.18em", color: C.muted }}>Into (optional, sharpens the matches)</p>
            <div className="flex flex-wrap gap-2">{INTERESTS.map((i) => <Chip key={i.id} active={profile.interests.includes(i.id)} onClick={() => toggle("interests", i.id)}>{i.label}</Chip>)}</div>
          </div>
          <button onClick={build} disabled={!ready}
            className="mt-8 w-full rounded-xl px-6 py-4 text-lg transition-opacity focus:outline-none focus-visible:ring-2 sm:w-auto"
            style={{ fontFamily: DISPLAY, background: ready ? C.violet : C.line, color: ready ? "#fff" : C.muted, cursor: ready ? "pointer" : "not-allowed" }}>
            Draw my map of Austin →
          </button>
          {!ready && <p className="mt-2 text-sm" style={{ color: C.muted }}>Fill in the blanks and pick at least one goal.</p>}
        </div>
      )}

      {phase === "loading" && <Loading>Matching you against the local list and writing your first month…</Loading>}

      {phase === "results" && plan && (
        <div className="mt-6">
          <p className="text-lg leading-relaxed" style={{ fontFamily: DISPLAY }}>{plan.intro}</p>
          {usedFallback && <p className="mt-2 text-sm" style={{ color: C.muted }}>(Offline mode — showing your matched list with a standard plan.)</p>}
          {plan.weeks.map((w) => (
            <div key={w.title} className="mt-8">
              <h2 className="text-xl" style={{ fontFamily: DISPLAY, color: C.violet }}>{w.title}</h2>
              <div className="mt-3 space-y-3">
                {w.items.map((it, idx) => {
                  const org = orgByName(it.org);
                  return (
                    <div key={idx} className="rounded-xl p-4" style={{ border: `1px solid ${C.line}`, background: "#fff" }}>
                      <div className="flex flex-wrap items-center gap-2">
                        {org ? <a href={org.url} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-2 underline-offset-2 focus:outline-none focus-visible:ring-2" style={{ color: C.ink, textDecorationColor: C.dusk }}>{it.org}</a> : <span className="font-medium">{it.org}</span>}
                        {org && <CostTag cost={org.cost} />}
                        {org && <span className="text-xs" style={{ color: C.muted }}>{org.cadence}</span>}
                      </div>
                      <p className="mt-1 text-sm">{it.action}</p>
                      {org && <p className="mt-1 text-sm" style={{ color: C.muted }}>{org.vibe}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-10 rounded-2xl p-5" style={{ background: C.violetDeep, color: "#fff" }}>
            <p className="text-xs uppercase" style={{ letterSpacing: "0.2em", color: C.dusk }}>Local's note</p>
            <p className="mt-2" style={{ fontFamily: DISPLAY, fontSize: "1.1rem" }}>{plan.proTip}</p>
          </div>
          <details className="mt-8">
            <summary className="cursor-pointer text-sm underline underline-offset-2" style={{ color: C.muted }}>See everything that matched you ({matches.length})</summary>
            <div className="mt-3 space-y-2">
              {matches.map((m) => (
                <div key={m.name} className="flex flex-wrap items-baseline gap-2 border-b pb-2 text-sm" style={{ borderColor: C.line }}>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2" style={{ textDecorationColor: C.dusk }}>{m.name}</a>
                  <CostTag cost={m.cost} />
                  <span style={{ color: C.muted }}>{m.vibe}</span>
                </div>
              ))}
            </div>
          </details>
          <button onClick={() => { setPhase("intake"); setPlan(null); }}
            className="mt-10 rounded-xl px-5 py-3 focus:outline-none focus-visible:ring-2"
            style={{ border: `1px solid ${C.violet}`, color: C.violet, fontFamily: DISPLAY }}>← Start over</button>
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// App shell
// ══════════════════════════════════════════════════════════════
export default function VioletCrownGuide() {
  const [mode, setMode] = useState(null); // null | 'settle' | 'help'

  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink, fontFamily: BODY }}>
      <Horizon />
      <main className="mx-auto max-w-2xl px-5 pb-20">
        <header className="pt-8 pb-2">
          <p className="text-xs uppercase" style={{ letterSpacing: "0.22em", color: C.muted }}>Austin, Texas · the Violet Crown city</p>
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl" style={{ fontFamily: DISPLAY, fontWeight: 400 }}>New here? Good.</h1>
        </header>

        {mode === null && (
          <section className="mt-6">
            <p className="max-w-lg" style={{ color: C.muted }}>Two ways in — pick the one that fits today. (You can always come back for the other.)</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button onClick={() => setMode("settle")}
                className="rounded-2xl border p-6 text-left transition-colors focus:outline-none focus-visible:ring-2"
                style={{ borderColor: C.line, background: "#fff" }}>
                <p className="text-2xl" style={{ fontFamily: DISPLAY, color: C.violet }}>Settle in</p>
                <p className="mt-2 text-sm" style={{ color: C.muted }}>New to Austin and building a life — friends, community, career, things to do. Get a personalized first-30-days plan.</p>
              </button>
              <button onClick={() => setMode("help")}
                className="rounded-2xl border p-6 text-left transition-colors focus:outline-none focus-visible:ring-2"
                style={{ borderColor: C.line, background: "#fff" }}>
                <p className="text-2xl" style={{ fontFamily: DISPLAY, color: C.amber }}>Get help</p>
                <p className="mt-2 text-sm" style={{ color: C.muted }}>Need housing, food, employment, healthcare, legal, immigration, education, or small-business support. Get matched with eligibility explained.</p>
              </button>
            </div>
          </section>
        )}

        {mode === "settle" && <SettleIn onBack={() => setMode(null)} />}
        {mode === "help" && <HelpNavigator onBack={() => setMode(null)} />}

        <footer className="mt-16 border-t pt-4 text-xs print:hidden" style={{ borderColor: C.line, color: C.muted }}>
          Starter dataset, hand-curated · verify hours & links before you go · not affiliated with any listed organization · not legal, medical, or financial advice.
        </footer>
      </main>
    </div>
  );
}
