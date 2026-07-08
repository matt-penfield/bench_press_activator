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
  // Base profiles: dominant persona gets ~36-44%, secondary ~20-28%, others split remainder
  const base = { Activator: 8, Expert: 8, Confidant: 8, Debater: 8, Realist: 8 };
  base[persona] = 36 + Math.floor(Math.random() * 9);       // 36-44%  (9-11 of 25 answers)
  base[secondaryPersona] = 20 + Math.floor(Math.random() * 9); // 20-28% (5-7 of 25 answers)

  // Distribute remainder across the other three
  const total = Object.values(base).reduce((a, b) => a + b, 0);
  const others = personas.filter(p => p !== persona && p !== secondaryPersona);
  const remainder = 100 - base[persona] - base[secondaryPersona];
  const shares = splitRemainder(remainder, 3);
  others.forEach((p, i) => { base[p] = shares[i]; });

  return base;
}

function splitRemainder(total, n) {
  const parts = [];
  let remaining = total;
  for (let i = 0; i < n - 1; i++) {
    const max = Math.max(4, remaining - (n - i - 1) * 4);
    const val = 4 + Math.floor(Math.random() * (max - 4 + 1));
    parts.push(val);
    remaining -= val;
  }
  parts.push(Math.max(4, remaining));
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
      <td><span class="persona-badge clickable" data-persona="${m.persona}">${m.persona}</span></td>
      <td><span class="persona-badge clickable" data-persona="${m.secondaryPersona}">${m.secondaryPersona}</span></td>
    </tr>
  `).join("");

  // Attach click handlers for rows (member modal)
  tbody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const idx = parseInt(row.dataset.index, 10);
      openModal(teamMembers[idx]);
    });
  });

  // Attach click handlers for persona badges (persona modal)
  tbody.querySelectorAll(".persona-badge.clickable").forEach(badge => {
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      openPersonaModal(badge.dataset.persona);
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

  // Sort personas by score descending for display
  const sortedPersonas = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  body.innerHTML = `
    <div class="survey-section">
      <h4>Persona Profile — Survey Results</h4>
      <p style="font-size:0.8rem; color:var(--slate-500); margin-bottom:12px;">Based on 25 behavioral questions. Each bar shows what percentage of responses aligned to that persona.</p>
      ${sortedPersonas.map(([key, val]) => `
        <div class="score-row">
          <span class="score-label">${key}</span>
          <div class="score-bar-container">
            <div class="score-bar">
              <div class="score-bar-fill" style="width:${val}%; background:${personaColors[key]}"></div>
            </div>
            <span class="score-value">${val}%</span>
          </div>
        </div>
      `).join("")}
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
              <span class="persona-badge" data-persona="${p.persona}">${p.persona.charAt(0)}</span>
              <span class="pairing-name">${p.name}</span>
              <span class="pairing-reason">${p.reason}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  initSorting();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  document.getElementById("persona-modal-close").addEventListener("click", closePersonaModal);
  document.getElementById("persona-modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closePersonaModal();
  });
});
