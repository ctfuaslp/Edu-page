// Campus Nova shared JS: theme + nav highlight + study plan

// --- Theme toggle ---
const THEME_KEY = "campus_theme";
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const tbtn = document.getElementById("theme-toggle");
  if (tbtn) tbtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);
  const tbtn = document.getElementById("theme-toggle");
  if (tbtn) {
    tbtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
}

// --- Study Plan (like favorites) ---
const PLAN_KEY = "edu_plan";
function loadPlan() { try { return JSON.parse(localStorage.getItem(PLAN_KEY) || "[]"); } catch { return []; } }
function savePlan(p) { localStorage.setItem(PLAN_KEY, JSON.stringify(p)); renderPlanCount(); }
function addToPlan(course) {
  const p = loadPlan();
  if (!p.some(c => c.id === course.id)) p.push(course);
  savePlan(p);
  toast(`Added: ${course.code}`);
}
function removeFromPlan(id) { savePlan(loadPlan().filter(c => c.id !== id)); }
function renderPlanCount() {
  const el = document.querySelector(".plan-count");
  if (el) el.textContent = String(loadPlan().length);
}

// --- Nav Active + Year ---
function initChrome() {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  renderPlanCount();

  // Render plan table when present
  const root = document.getElementById("plan-root");
  if (root) renderPlan(root);
}

// --- Render plan table ---
function renderPlan(root) {
  const p = loadPlan();
  const tbody = root.querySelector("tbody");
  const totalEl = document.getElementById("plan-total");
  tbody.innerHTML = "";
  let total = 0;
  for (const c of p) {
    total += c.units || 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.code}</td>
      <td>${c.name}</td>
      <td>${c.units || 0}</td>
      <td><button class="btn danger" data-remove="${c.id}">Remove</button></td>`;
    tbody.appendChild(tr);
  }
  if (totalEl) totalEl.textContent = String(total);
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    removeFromPlan(btn.getAttribute("data-remove"));
    renderPlan(root);
  }, { once: true });
}

// --- Tiny toast ---
let toastTimer = null;
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.position = "fixed";
    t.style.bottom = "18px";
    t.style.right = "18px";
    t.style.background = "rgba(2,6,23,0.95)";
    t.style.color = "white";
    t.style.padding = "10px 12px";
    t.style.borderRadius = "12px";
    t.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";
    t.style.zIndex = "100";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = "0"; }, 1400);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initChrome();
});