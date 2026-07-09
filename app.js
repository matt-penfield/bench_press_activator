// Sample team data — replace with real data source later
const teamMembers = [
  { name: "Jordan Lee", title: "Sr. Consultant", market: "Seattle", persona: "Confidant", secondaryPersona: "Expert" },
  { name: "Casey Rivera", title: "Consultant", market: "Denver", persona: "Activator", secondaryPersona: "Debater" },
  { name: "Taylor Kim", title: "Principal", market: "Chicago", persona: "Realist", secondaryPersona: "Confidant" },
  { name: "Morgan Chen", title: "Sr. Director", market: "Seattle", persona: "Debater", secondaryPersona: "Activator" },
  { name: "Riley Patel", title: "Associate Consultant", market: "Atlanta", persona: "Expert", secondaryPersona: "Realist" },
  { name: "Sam Torres", title: "Director", market: "Denver", persona: "Confidant", secondaryPersona: "Realist" },
  { name: "Drew Nakamura", title: "Sr. Principal", market: "Chicago", persona: "Activator", secondaryPersona: "Expert" },
  { name: "Jamie Okafor", title: "Consultant", market: "Atlanta", persona: "Realist", secondaryPersona: "Activator" },
  { name: "Quinn Alvarez", title: "Sr. Consultant", market: "Seattle", persona: "Expert", secondaryPersona: "Debater" },
  { name: "Avery Singh", title: "Associate Consultant", market: "Denver", persona: "Debater", secondaryPersona: "Confidant" },
  { name: "Dakota Flores", title: "Principal", market: "Chicago", persona: "Activator", secondaryPersona: "Realist" },
  { name: "Hayden Park", title: "Consultant", market: "Atlanta", persona: "Confidant", secondaryPersona: "Activator" },
];

const personas = ["Confidant", "Activator", "Realist", "Debater", "Expert"];

function groupByPersona(members) {
  const groups = {};
  personas.forEach(p => groups[p] = []);
  members.forEach(m => {
    if (groups[m.persona]) {
      groups[m.persona].push(m);
    }
  });
  return groups;
}

// Mock survey scores for each member — percentage profile summing to 100%
// Based on 25-question assessment where each answer maps to a persona (A=Activator, B=Expert, C=Confidant, D=Debater, E=Realist)
function generateSurveyResults(persona, secondaryPersona) {
  // Guarantee ordering: primary > secondary > each of the other three.
  const base = { Activator: 0, Expert: 0, Confidant: 0, Debater: 0, Realist: 0 };
  const primaryScore = 38 + Math.floor(Math.random() * 7);      // 38-44%
  const secondaryScore = 22 + Math.floor(Math.random() * 7);    // 22-28% (always < primary)
  base[persona] = primaryScore;
  base[secondaryPersona] = secondaryScore;

  // Distribute the remainder across the other three, each capped below the secondary
  const others = personas.filter(p => p !== persona && p !== secondaryPersona);
  const remainder = 100 - primaryScore - secondaryScore;
  const shares = splitRemainder(remainder, others.length, secondaryScore - 1);
  others.forEach((p, i) => { base[p] = shares[i]; });

  return base;
}

// Split `total` into `n` parts, each between 4 and `maxEach`, so no "other"
// persona can rival the labeled secondary. Assumes 4*n <= total <= maxEach*n.
function splitRemainder(total, n, maxEach) {
  const parts = new Array(n).fill(4);
  let remaining = total - 4 * n;
  while (remaining > 0) {
    const i = Math.floor(Math.random() * n);
    if (parts[i] < maxEach) {
      parts[i]++;
      remaining--;
    }
  }
  return parts;
}

const personaDescriptions = {
  Activator: {
    identity: "Growth comes from creating opportunity.",
    signals: "Growth driver, proactive, opportunity creator",
    risk: "Can sacrifice depth for breadth",
    leaderTakeaway: "Leverage for pipeline creation",
    clientImpression: "They always bring value.",
  },
  Expert: {
    identity: "My expertise creates demand.",
    signals: "Strong delivery, trusted capability, technical credibility",
    risk: "Reactive, waits for demand",
    leaderTakeaway: "Pair with Activators to convert expertise into pipeline",
    clientImpression: "They're brilliant.",
  },
  Confidant: {
    identity: "People buy from people they trust.",
    signals: "Deep relationships, high trust, loyalty",
    risk: "Avoids tension, slow expansion, single-threaded accounts",
    leaderTakeaway: "Anchor on key accounts",
    clientImpression: "I trust them completely.",
  },
  Debater: {
    identity: "The client is wrong — and I'll prove it.",
    signals: "Insightful, challenges thinking, creates disruption",
    risk: "Can alienate stakeholders, overly confrontational",
    leaderTakeaway: "Use in strategic pursuits",
    clientImpression: "They changed how I think.",
  },
  Realist: {
    identity: "Trust comes from honesty.",
    signals: "Strong judgment, protects margin, credibility",
    risk: "Overly conservative, can seem cautious",
    leaderTakeaway: "Critical for deal qualification",
    clientImpression: "They tell me the truth.",
  },
};

const personaColors = {
  Confidant: "#0C62FB",
  Activator: "#FF4D5F",
  Realist: "#1BE1F2",
  Debater: "#C7B9FF",
  Expert: "#002FAF",
};

// Consistent per-persona description of what they bring to a sales team pairing
const personaPairingValue = {
  Activator: "Creates pipeline and drives outreach — keeps deals moving forward",
  Expert: "Brings technical credibility — clients trust their depth in the room",
  Confidant: "Builds deep client trust — opens doors and protects relationships",
  Debater: "Challenges client thinking — elevates the conversation to strategic",
  Realist: "Qualifies deals and manages scope — protects margin and delivery",
};

// Pairing logic: complementary personas based on strengths/weaknesses from the Activator framework
const pairingRationale = {
  Confidant: {
    best: ["Activator", "Debater"],
    reason: {
      Activator: "Turns deep trust into proactive growth opportunities",
      Debater: "Challenges comfort zone; expands beyond single-threaded accounts",
    }
  },
  Activator: {
    best: ["Realist", "Expert"],
    reason: {
      Realist: "Grounds opportunity creation with deal qualification rigor",
      Expert: "Adds technical depth to broad pipeline creation",
    }
  },
  Realist: {
    best: ["Activator", "Confidant"],
    reason: {
      Activator: "Prevents over-caution; drives momentum on qualified deals",
      Confidant: "Softens directness with relationship warmth",
    }
  },
  Debater: {
    best: ["Confidant", "Expert"],
    reason: {
      Confidant: "Balances challenge with trust so clients stay engaged",
      Expert: "Backs provocative thinking with evidence and credibility",
    }
  },
  Expert: {
    best: ["Activator", "Debater"],
    reason: {
      Activator: "Converts reactive expertise into proactive demand creation",
      Debater: "Stress-tests ideas, sharpens positioning for strategic pursuits",
    }
  },
};

function getPairingSuggestions(member) {
  const rationale = pairingRationale[member.persona];
  const suggestions = [];

  rationale.best.forEach(targetPersona => {
    const candidates = teamMembers.filter(
      m => m.name !== member.name && (m.persona === targetPersona || m.secondaryPersona === targetPersona)
    );
    candidates.forEach(c => {
      suggestions.push({
        name: c.name,
        persona: c.persona,
        reason: rationale.reason[targetPersona],
      });
    });
  });

  // Deduplicate and limit to top 3
  const seen = new Set();
  return suggestions.filter(s => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  }).slice(0, 3);
}

// Pre-generate survey results for consistency within session
teamMembers.forEach(m => {
  m.surveyResults = generateSurveyResults(m.persona, m.secondaryPersona);
});

let currentSort = { key: null, direction: "asc" };

function getSorted() {
  const sorted = [...teamMembers];
  if (currentSort.key) {
    sorted.sort((a, b) => {
      const aVal = (a[currentSort.key] || "").toLowerCase();
      const bVal = (b[currentSort.key] || "").toLowerCase();
      if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  } else {
    sorted.sort((a, b) => personas.indexOf(a.persona) - personas.indexOf(b.persona));
  }
  return sorted;
}

function renderTable() {
  const tbody = document.getElementById("team-tbody");
  const sorted = getSorted();

  tbody.innerHTML = sorted.map((m, i) => `
    <tr data-index="${teamMembers.indexOf(m)}">
      <td>${m.name}</td>
      <td>${m.title}</td>
      <td>${m.market}</td>
      <td><span class="persona-badge" data-persona="${m.persona}">${m.persona}</span></td>
      <td><span class="persona-badge" data-persona="${m.secondaryPersona}">${m.secondaryPersona}</span></td>
      <td><span class="client-facing-badge" data-persona="${m.persona}">${m.clientFacing}</span></td>
    </tr>
  `).join("");

  // Attach click handlers for rows (member modal)
  tbody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const idx = parseInt(row.dataset.index, 10);
      openModal(teamMembers[idx]);
    });
  });

  // Update header sort indicators
  document.querySelectorAll(".team-table th[data-sort]").forEach(th => {
    th.classList.remove("sort-asc", "sort-desc");
    if (th.dataset.sort === currentSort.key) {
      th.classList.add(currentSort.direction === "asc" ? "sort-asc" : "sort-desc");
    }
  });
}

function initSorting() {
  document.querySelectorAll(".team-table th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (currentSort.key === key) {
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort.key = key;
        currentSort.direction = "asc";
      }
      renderTable();
    });
  });
}

// Build an SVG radar (spider) chart from a persona-score map summing to ~100%
function renderRadarChart(scores) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 95;
  const maxScale = 50; // percent that maps to the outer ring
  const axes = personas;
  const n = axes.length;

  const angleFor = i => (-90 + i * (360 / n)) * (Math.PI / 180);
  const point = (i, frac) => {
    const a = angleFor(i);
    return {
      x: cx + Math.cos(a) * radius * frac,
      y: cy + Math.sin(a) * radius * frac,
    };
  };

  const rings = [0.25, 0.5, 0.75, 1].map(frac => {
    const pts = axes.map((_, i) => {
      const pt = point(i, frac);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(" ");
    return `<polygon points="${pts}" class="radar-grid" />`;
  }).join("");

  const spokes = axes.map((_, i) => {
    const pt = point(i, 1);
    return `<line x1="${cx}" y1="${cy}" x2="${pt.x.toFixed(1)}" y2="${pt.y.toFixed(1)}" class="radar-spoke" />`;
  }).join("");

  const dataPts = axes.map((persona, i) => {
    const frac = Math.min((scores[persona] || 0) / maxScale, 1);
    const pt = point(i, frac);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  const dots = axes.map((persona, i) => {
    const frac = Math.min((scores[persona] || 0) / maxScale, 1);
    const pt = point(i, frac);
    return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.5" fill="${personaColors[persona]}" class="radar-dot" />`;
  }).join("");

  const labels = axes.map((persona, i) => {
    const pt = point(i, 1.2);
    let anchor = "middle";
    if (pt.x < cx - 5) anchor = "end";
    else if (pt.x > cx + 5) anchor = "start";
    return `<text x="${pt.x.toFixed(1)}" y="${pt.y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle" class="radar-label">${persona} ${scores[persona] || 0}%</text>`;
  }).join("");

  return `
    <svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="Persona profile radar chart">
      <g class="radar-grid-group">${rings}${spokes}</g>
      <polygon points="${dataPts}" class="radar-area" />
      <g class="radar-dots">${dots}</g>
      <g class="radar-labels">${labels}</g>
    </svg>`;
}

function openModal(member) {
  const overlay = document.getElementById("modal-overlay");
  document.getElementById("modal-name").textContent = member.name;

  const badge = document.getElementById("modal-persona");
  badge.textContent = member.persona;
  badge.dataset.persona = member.persona;

  const body = document.getElementById("modal-body");
  const scores = member.surveyResults;
  const color = personaColors[member.persona];
  const pairings = getPairingSuggestions(member);
  const desc = personaDescriptions[member.persona];
  const composite = getPersonaType(member.persona, member.secondaryPersona);

  body.innerHTML = `
    <div class="composite-hero" data-persona="${composite.primary}">
      <span class="composite-code" data-persona="${composite.primary}">${composite.code}</span>
      <div class="composite-hero-text">
        <h3 class="composite-name">${composite.blendName}</h3>
        <p class="composite-formula">
          <span class="persona-badge" data-persona="${composite.primary}">${composite.primary}</span>
          <span class="formula-plus">+</span>
          <span class="persona-badge" data-persona="${composite.secondary}">${composite.secondary}</span>
        </p>
      </div>
    </div>
    <p class="composite-description">${composite.blendDescription}</p>
    <div class="survey-section">
      <h4>Persona Profile — Survey Results</h4>
      <p style="font-size:0.8rem; color:var(--slate-500); margin-bottom:12px;">Based on 25 behavioral questions. Each axis shows what percentage of responses aligned to that persona.</p>
      <div class="radar-wrap">
        ${renderRadarChart(scores)}
      </div>
    </div>
    <div class="survey-section">
      <h4>Dominant Persona — ${member.persona}</h4>
      <p style="font-size:0.95rem; font-style:italic; color:var(--slalom-blue); margin-bottom:8px;">"${desc.identity}"</p>
      <div style="font-size:0.85rem; color:var(--slate-700); line-height:1.6;">
        <p><strong>Signals:</strong> ${desc.signals}</p>
        <p><strong>Risk:</strong> ${desc.risk}</p>
        <p><strong>Leadership takeaway:</strong> ${desc.leaderTakeaway}</p>
        <p style="margin-top:6px; color:var(--slate-500);"><em>Client impression: "${desc.clientImpression}"</em></p>
      </div>
    </div>
    <div class="survey-section">
      <h4>Suggested Pairings</h4>
      ${pairings.length ? `
        <ul class="pairing-list">
          ${pairings.map(p => `
            <li class="pairing-item">
              <span class="persona-badge" data-persona="${p.persona}" title="${p.persona}">${p.persona.charAt(0)}</span>
              <span class="pairing-name">${p.name}</span>
              <span class="pairing-reason">${personaPairingValue[p.persona]}</span>
            </li>
          `).join("")}
        </ul>
      ` : `<p style="font-size:0.9rem; color:#aaa;">No pairings available</p>`}
    </div>
  `;

  overlay.classList.add("active");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
}

function openPersonaModal(personaName) {
  const overlay = document.getElementById("persona-modal-overlay");
  const desc = personaDescriptions[personaName];
  const color = personaColors[personaName];

  document.getElementById("persona-modal-name").textContent = personaName;
  const badge = document.getElementById("persona-modal-badge");
  badge.textContent = personaName;
  badge.dataset.persona = personaName;

  // Find team members with this persona (dominant or secondary)
  const membersWithPersona = teamMembers.filter(
    m => m.persona === personaName || m.secondaryPersona === personaName
  );

  const body = document.getElementById("persona-modal-body");
  body.innerHTML = `
    <div class="survey-section">
      <h4>Core Identity</h4>
      <p style="font-size:1.05rem; font-style:italic; color:var(--slalom-blue); margin-bottom:12px;">&ldquo;${desc.identity}&rdquo;</p>
    </div>
    <div class="survey-section">
      <h4>Characteristics</h4>
      <div style="font-size:0.85rem; color:var(--slate-700); line-height:1.7;">
        <p><strong>Signals:</strong> ${desc.signals}</p>
        <p><strong>Risk:</strong> ${desc.risk}</p>
        <p><strong>Leadership takeaway:</strong> ${desc.leaderTakeaway}</p>
        <p style="margin-top:8px; color:var(--slate-500);"><em>Client impression: &ldquo;${desc.clientImpression}&rdquo;</em></p>
      </div>
    </div>
    <div class="survey-section">
      <h4>Team Members with this Persona</h4>
      ${membersWithPersona.length ? `
        <ul class="pairing-list">
          ${membersWithPersona.map(m => `
            <li class="pairing-item">
              <span class="pairing-name">${m.name}</span>
              <span class="pairing-reason">${m.persona === personaName ? 'Dominant' : 'Secondary'}</span>
            </li>
          `).join("")}
        </ul>
      ` : `<p style="font-size:0.9rem; color:var(--slate-400);">No team members with this persona</p>`}
    </div>
  `;

  overlay.classList.add("active");
}

function closePersonaModal() {
  document.getElementById("persona-modal-overlay").classList.remove("active");
}

// ---- Enneagram-style Persona Model ----
// Every seller has a PRIMARY persona (core) and a SECONDARY persona (wing).
// Each core is naturally offset by two "balance points" — complementary
// personas that counter the core's blind spots. Balance points are derived
// from the pairing framework above, so the model stays a single source of truth.
const personaBalance = {
  Confidant: pairingRationale.Confidant.best,
  Activator: pairingRationale.Activator.best,
  Realist: pairingRationale.Realist.best,
  Debater: pairingRationale.Debater.best,
  Expert: pairingRationale.Expert.best,
};

const personaShort = { Activator: "A", Confidant: "C", Realist: "R", Debater: "D", Expert: "E" };

// Personas whose badge/light color needs dark text for contrast
const personaTextDark = { Realist: true, Debater: true };

// Derived composite personas — a named blend for every primary + secondary pair.
// The primary sets the core drive; the secondary (wing) shapes how it shows up.
const blendedPersonas = {
  Confidant: {
    Activator: { name: "The Connector", description: "Deep client trust that opens doors, paired with the drive to turn those relationships into fresh pipeline and growth." },
    Realist: { name: "Trusted Partner", description: "Relationships built on candor. Clients lean on them because they feel both cared for and told the truth." },
    Debater: { name: "Trusted Challenger", description: "Uses hard-won trust as a license to push clients past their assumptions without ever fracturing the relationship." },
    Expert: { name: "Trusted Advisor", description: "Pairs genuine relationships with real credibility, so clients seek out their judgment on the decisions that matter most." },
  },
  Activator: {
    Confidant: { name: "The Rainmaker", description: "Generates pipeline through a wide, warm network — opportunities follow because people genuinely enjoy working with them." },
    Realist: { name: "Disciplined Driver", description: "Relentlessly creates opportunity but qualifies as they go, so all that momentum lands on the deals actually worth winning." },
    Debater: { name: "Bold Instigator", description: "Manufactures demand by provoking new thinking, sparking conversations that reframe what the client believes they need." },
    Expert: { name: "Credible Hunter", description: "Opens doors on the strength of proven expertise, converting proactive outreach into engagements clients trust from day one." },
  },
  Realist: {
    Confidant: { name: "Honest Broker", description: "Delivers uncomfortable truths in a way that lands as care, protecting both the client's outcome and the relationship." },
    Activator: { name: "Pragmatic Driver", description: "Keeps deals honest and well-scoped while still pushing momentum on the opportunities that genuinely deserve it." },
    Debater: { name: "Straight Shooter", description: "Direct and unflinching — challenges assumptions with a candor that clients come to respect and rely on." },
    Expert: { name: "The Validator", description: "Grounds every recommendation in expertise and honest assessment, becoming the team's quality conscience." },
  },
  Debater: {
    Confidant: { name: "Diplomatic Challenger", description: "Pushes clients well past their comfort zone while relational trust keeps the challenge feeling safe rather than confrontational." },
    Activator: { name: "The Disruptor", description: "Challenges the status quo to create urgency, turning provocative insight directly into new pipeline." },
    Realist: { name: "Devil's Advocate", description: "Challenges thinking with grounded honesty, stress-testing decisions before they harden into commitments." },
    Expert: { name: "Thought Leader", description: "Reframes the client's thinking with the depth to back it up, making bold ideas credible instead of merely provocative." },
  },
  Expert: {
    Confidant: { name: "Go-To Specialist", description: "The trusted domain authority clients call first, combining deep credibility with a genuinely strong relationship." },
    Activator: { name: "The Evangelist", description: "Turns deep expertise into demand, actively creating the conversations others wait for." },
    Realist: { name: "The Craftsman", description: "Pairs mastery with candor — delivers excellent work alongside an honest view of what's truly achievable." },
    Debater: { name: "The Visionary", description: "Uses authority to challenge convention, pushing clients toward bolder, better-informed decisions." },
  },
};

// Build the full profile for a single primary/secondary permutation
function getPersonaType(primary, secondary) {
  const balance = personaBalance[primary];
  const blend = blendedPersonas[primary][secondary];
  return {
    primary,
    secondary,
    code: `${personaShort[primary]}${personaShort[secondary].toLowerCase()}`,
    blendName: blend.name,
    blendDescription: blend.description,
    name: `${primary} with a ${secondary} wing`,
    identity: personaDescriptions[primary].identity,
    coreStrength: personaPairingValue[primary],
    wing: { persona: secondary, flavor: personaPairingValue[secondary] },
    risk: personaDescriptions[primary].risk,
    balancedBy: balance.map(p => ({
      persona: p,
      reason: pairingRationale[primary].reason[p],
      value: personaPairingValue[p],
    })),
  };
}

// Generate every permutation: 5 primaries × 4 secondaries = 20 types
function buildPersonaModel() {
  const model = [];
  personas.forEach(primary => {
    personas.forEach(secondary => {
      if (primary !== secondary) model.push(getPersonaType(primary, secondary));
    });
  });
  return model;
}

const personaModel = buildPersonaModel();
let selectedTypeCode = personaModel[0].code;

// Compute pentagon node coordinates (one per persona) around a circle
function getNodePositions() {
  const cx = 200, cy = 185, r = 132;
  const positions = {};
  personas.forEach((p, i) => {
    const angle = (-90 + i * (360 / personas.length)) * (Math.PI / 180);
    positions[p] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return positions;
}

function renderDiagram(type) {
  const pos = getNodePositions();
  const highlight = {
    [type.primary]: "primary",
    [type.secondary]: type.secondary === type.primary ? undefined : "wing",
  };
  type.balancedBy.forEach(b => {
    if (!highlight[b.persona]) highlight[b.persona] = "balance";
  });

  // Wing link (dashed) + balance arrows (solid) originate from the primary node
  const p = pos[type.primary];
  const wingLine = `<line x1="${p.x}" y1="${p.y}" x2="${pos[type.secondary].x}" y2="${pos[type.secondary].y}" class="link link-wing" />`;
  const balanceLines = type.balancedBy.map(b =>
    `<line x1="${p.x}" y1="${p.y}" x2="${pos[b.persona].x}" y2="${pos[b.persona].y}" class="link link-balance" marker-end="url(#arrow)" />`
  ).join("");

  const nodes = personas.map(persona => {
    const { x, y } = pos[persona];
    const role = highlight[persona] || "muted";
    const fill = personaColors[persona];
    const textFill = personaTextDark[persona] ? "#0F172A" : "#FFFFFF";
    const rOuter = role === "primary" ? 30 : 24;
    return `
      <g class="node node-${role}" data-persona="${persona}" transform="translate(${x},${y})">
        <circle r="${rOuter}" fill="${fill}" class="node-circle" />
        <text class="node-label" y="5" text-anchor="middle" fill="${textFill}">${personaShort[persona]}</text>
      </g>`;
  }).join("");

  return `
    <svg viewBox="0 0 400 370" class="model-svg" role="img" aria-label="Persona balance diagram">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--slate-400)" />
        </marker>
      </defs>
      <g class="links">${balanceLines}${wingLine}</g>
      <g class="nodes">${nodes}</g>
    </svg>`;
}

function renderModelDetail(type) {
  const desc = personaDescriptions[type.primary];
  return `
    <div class="type-detail-header">
      <span class="type-code" data-persona="${type.primary}">${type.code}</span>
      <div>
        <h3 class="type-name">${type.blendName}</h3>
        <p class="type-blend-formula">${type.primary} <span class="formula-plus">+</span> ${type.secondary}</p>
      </div>
    </div>

    <p class="type-blend-description">${type.blendDescription}</p>

    <div class="survey-section">
      <h4>Core — ${type.primary}</h4>
      <p class="type-line">${type.coreStrength}</p>
    </div>

    <div class="survey-section">
      <h4>Wing — ${type.wing.persona}</h4>
      <p class="type-line">${type.wing.flavor}</p>
    </div>

    <div class="survey-section">
      <h4>Balance Points</h4>
      <ul class="pairing-list">
        ${type.balancedBy.map(b => `
          <li class="pairing-item">
            <span class="persona-badge" data-persona="${b.persona}" title="${b.persona}">${b.persona}</span>
            <span class="pairing-reason">${b.reason}</span>
          </li>
        `).join("")}
      </ul>
    </div>

    <div class="survey-section">
      <h4>Watch For</h4>
      <p class="type-line type-risk">${desc.risk}</p>
    </div>`;
}

function selectType(code) {
  selectedTypeCode = code;
  const type = personaModel.find(t => t.code === code);
  if (!type) return;
  document.getElementById("model-diagram-svg").innerHTML = renderDiagram(type);
  document.getElementById("model-detail").innerHTML = renderModelDetail(type);
  document.querySelectorAll(".permutation-cell").forEach(cell => {
    cell.classList.toggle("selected", cell.dataset.code === code);
  });
}

function renderModel() {
  // Legend
  document.getElementById("model-legend").innerHTML = personas.map(p =>
    `<span class="legend-item"><span class="legend-dot" style="background:${personaColors[p]}"></span>${p}</span>`
  ).join("");

  // Permutation grid grouped by primary persona
  const grid = document.getElementById("permutation-grid");
  grid.innerHTML = personas.map(primary => `
    <div class="permutation-group">
      <div class="permutation-group-title">
        <span class="persona-badge" data-persona="${primary}">${primary}</span> core
      </div>
      <div class="permutation-cells">
        ${personaModel.filter(t => t.primary === primary).map(t => `
          <button class="permutation-cell" data-code="${t.code}" data-persona="${primary}">
            <span class="cell-name">${t.blendName}</span>
            <span class="cell-wing">+ ${t.secondary}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".permutation-cell").forEach(cell => {
    cell.addEventListener("click", () => selectType(cell.dataset.code));
  });

  selectType(selectedTypeCode);
}

document.addEventListener("DOMContentLoaded", () => {
  // Derive each member's client-facing (composite) persona name for the table
  teamMembers.forEach(m => {
    m.clientFacing = getPersonaType(m.persona, m.secondaryPersona).blendName;
  });

  renderTable();
  initSorting();
  renderModel();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById("persona-modal-close").addEventListener("click", closePersonaModal);
  document.getElementById("persona-modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closePersonaModal();
  });
});
