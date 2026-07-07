// Sample team data — replace with real data source later
const teamMembers = [
  { name: "Jordan Lee", market: "Seattle", persona: "Confidant", secondaryPersona: "Expert" },
  { name: "Casey Rivera", market: "Denver", persona: "Activator", secondaryPersona: "Debater" },
  { name: "Taylor Kim", market: "Chicago", persona: "Realist", secondaryPersona: "Confidant" },
  { name: "Morgan Chen", market: "Seattle", persona: "Debater", secondaryPersona: "Activator" },
  { name: "Riley Patel", market: "Atlanta", persona: "Expert", secondaryPersona: "Realist" },
  { name: "Sam Torres", market: "Denver", persona: "Confidant", secondaryPersona: "Realist" },
  { name: "Drew Nakamura", market: "Chicago", persona: "Activator", secondaryPersona: "Expert" },
  { name: "Jamie Okafor", market: "Atlanta", persona: "Realist", secondaryPersona: "Activator" },
  { name: "Quinn Alvarez", market: "Seattle", persona: "Expert", secondaryPersona: "Debater" },
  { name: "Avery Singh", market: "Denver", persona: "Debater", secondaryPersona: "Confidant" },
  { name: "Dakota Flores", market: "Chicago", persona: "Activator", secondaryPersona: "Realist" },
  { name: "Hayden Park", market: "Atlanta", persona: "Confidant", secondaryPersona: "Activator" },
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

// Mock survey scores for each member (scores out of 10 per dimension)
function generateSurveyResults(persona) {
  const base = {
    Confidant:  { trust: 9, empathy: 8, challenge: 4, expertise: 5, action: 3 },
    Activator:  { trust: 6, empathy: 5, challenge: 7, expertise: 5, action: 9 },
    Realist:    { trust: 5, empathy: 6, challenge: 8, expertise: 6, action: 5 },
    Debater:    { trust: 4, empathy: 4, challenge: 9, expertise: 7, action: 6 },
    Expert:     { trust: 5, empathy: 4, challenge: 5, expertise: 9, action: 6 },
  };
  // Add slight randomness
  const scores = { ...base[persona] };
  Object.keys(scores).forEach(k => {
    scores[k] = Math.min(10, Math.max(1, scores[k] + Math.floor(Math.random() * 3) - 1));
  });
  return scores;
}

const dimensionLabels = {
  trust: "Trust Building",
  empathy: "Empathy & Listening",
  challenge: "Willingness to Challenge",
  expertise: "Domain Expertise",
  action: "Bias to Action",
};

const personaColors = {
  Confidant: "#6366f1",
  Activator: "#f59e0b",
  Realist: "#10b981",
  Debater: "#ef4444",
  Expert: "#8b5cf6",
};

// Pairing logic: complementary personas that balance each other
const pairingRationale = {
  Confidant: {
    best: ["Debater", "Activator"],
    reason: {
      Debater: "Balances empathy with constructive challenge",
      Activator: "Turns trust-built alignment into momentum",
    }
  },
  Activator: {
    best: ["Realist", "Confidant"],
    reason: {
      Realist: "Grounds action bias with practical constraints",
      Confidant: "Ensures team buy-in before pushing forward",
    }
  },
  Realist: {
    best: ["Activator", "Expert"],
    reason: {
      Activator: "Prevents analysis paralysis with action bias",
      Expert: "Deepens practical insights with domain knowledge",
    }
  },
  Debater: {
    best: ["Confidant", "Expert"],
    reason: {
      Confidant: "Softens challenge with relationship trust",
      Expert: "Backs arguments with evidence and depth",
    }
  },
  Expert: {
    best: ["Activator", "Debater"],
    reason: {
      Activator: "Moves expertise from theory to execution",
      Debater: "Stress-tests ideas for stronger outcomes",
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
  m.surveyResults = generateSurveyResults(m.persona);
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
      <td>${m.market}</td>
      <td><span class="persona-badge" data-persona="${m.persona}">${m.persona}</span></td>
      <td><span class="persona-badge" data-persona="${m.secondaryPersona}">${m.secondaryPersona}</span></td>
    </tr>
  `).join("");

  // Attach click handlers
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

  body.innerHTML = `
    <div class="survey-section">
      <h4>Activator Framework — Dimension Scores</h4>
      ${Object.entries(scores).map(([key, val]) => `
        <div class="score-row">
          <span class="score-label">${dimensionLabels[key]}</span>
          <div class="score-bar-container">
            <div class="score-bar">
              <div class="score-bar-fill" style="width:${val * 10}%; background:${color}"></div>
            </div>
            <span class="score-value">${val}/10</span>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="survey-section">
      <h4>Dominant Persona</h4>
      <p style="font-size:0.9rem; color:#444;">Based on survey responses, <strong>${member.name}</strong> most closely aligns with the <strong>${member.persona}</strong> archetype in the Activator framework.</p>
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

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
  initSorting();

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
});
