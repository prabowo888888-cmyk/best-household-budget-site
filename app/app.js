/* Hearth & Ledger — state, routing and rendering.
   Data lives in localStorage under one key; the seed in data.js is only
   used the first time, or after "Reset demo data". */

const STORAGE_KEY = "hearth-ledger-v1";
const ROUTES = ["dashboard", "transactions", "budgets", "bills", "goals", "reports"];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch (e) { /* corrupted storage: fall through to the seed */ }
  return structuredClone(SEED);
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

let state = loadState();
let txFilter = "all";

function money(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function money0(n) {
  return "$" + Math.round(Number(n)).toLocaleString("en-US");
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function monthShort(ym) {
  const d = new Date(ym + "-01T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function catLabel(id) {
  const c = state.categories.find(c => c.id === id);
  return c ? c.label : id;
}
function totalIncome() { return state.income.reduce((s, i) => s + i.amount, 0); }
function totalSpent() { return state.transactions.reduce((s, t) => s + t.amount, 0); }
function spentByCategory() {
  const out = {};
  state.categories.forEach(c => { out[c.id] = 0; });
  state.transactions.forEach(t => { out[t.category] = (out[t.category] || 0) + t.amount; });
  return out;
}
function unpaidBillsTotal() {
  return state.bills.filter(b => !b.paid).reduce((s, b) => s + b.amount, 0);
}

/* ---------- routing ---------- */
function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(hash) ? hash : "dashboard";
}
function render() {
  const route = currentRoute();
  document.querySelectorAll(".mainnav a").forEach(a => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  const view = document.getElementById("view");
  view.innerHTML = {
    dashboard: renderDashboard,
    transactions: renderTransactions,
    budgets: renderBudgets,
    bills: renderBills,
    goals: renderGoals,
    reports: renderReports
  }[route]();
  bindView(route);
}
window.addEventListener("hashchange", render);

/* ---------- dashboard ---------- */
function renderDashboard() {
  const income = totalIncome(), spent = totalSpent(), balance = income - spent;
  const rate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const byCat = spentByCategory();
  const slices = state.categories.map(c => ({ label: c.label, value: byCat[c.id], color: c.color }));
  const top = slices.slice().sort((a, b) => b.value - a.value).slice(0, 3);
  const over = state.categories.filter(c => byCat[c.id] > c.budget);
  const tip = over.length
    ? "Heads up: " + over.map(c => c.label).join(", ") + " " + (over.length === 1 ? "is" : "are") +
      " over budget this month. A small trim there covers the gap."
    : "Every category is inside its budget so far — the holiday fund is getting its share this month.";
  return '<div class="section-head"><h2>November overview</h2>' +
    '<p>' + escapeHtml(state.household) + ' · ' + money0(income) + ' coming in, ' + money0(spent) + ' going out.</p></div>' +
    '<div class="cards">' +
    '<div class="card good"><div class="label">Income</div><div class="big">' + money0(income) + '</div><div class="sub">' + state.income.length + ' sources this month</div></div>' +
    '<div class="card"><div class="label">Spending</div><div class="big">' + money0(spent) + '</div><div class="sub">' + state.transactions.length + ' transactions</div></div>' +
    '<div class="card ' + (balance >= 0 ? "good" : "warn") + '"><div class="label">Left over</div><div class="big">' + money0(balance) + '</div><div class="sub">Bills still unpaid: ' + money0(unpaidBillsTotal()) + '</div></div>' +
    '<div class="card good"><div class="label">Savings rate</div><div class="big">' + rate + '%</div><div class="sub">of income kept this month</div></div>' +
    '</div>' +
    '<div class="grid-2">' +
    '<div class="card"><h3>Where the money went</h3><div class="donut-wrap">' + donutChart(slices, 190) +
    '<ul class="legend">' + slices.map(s =>
      '<li><span class="swatch" style="background:' + s.color + '"></span>' + escapeHtml(s.label) +
      '<span class="amt">' + money0(s.value) + '</span></li>').join("") + '</ul></div></div>' +
    '<div class="card"><h3>Biggest categories</h3>' + barChart(top, top[0] ? top[0].value : 1) +
    '<p class="tip" style="margin-top:1rem"><strong>Takeaway:</strong> ' + escapeHtml(tip) + '</p></div>' +
    '</div>';
}

/* ---------- transactions ---------- */
function renderTransactions() {
  const cats = state.categories;
  const list = state.transactions
    .filter(t => txFilter === "all" || t.category === txFilter)
    .slice().sort((a, b) => b.date.localeCompare(a.date));
  const rows = list.map(t =>
    '<tr><td>' + t.date + '</td><td>' + escapeHtml(t.label) + '</td><td>' + escapeHtml(catLabel(t.category)) +
    '</td><td class="num">' + money(t.amount) + '</td>' +
    '<td><button type="button" class="danger" data-delete-tx="' + t.id + '">Delete</button></td></tr>').join("");
  return '<div class="section-head"><h2>Transactions</h2><p>Every dollar out, in one list. Add one below and the totals update everywhere.</p></div>' +
    '<div class="panel"><h3>Add a transaction</h3>' +
    '<form id="txForm" class="inline-form">' +
    '<div class="field"><label for="txDate">Date</label><input type="date" id="txDate" value="2026-11-26" required></div>' +
    '<div class="field"><label for="txLabel">What was it?</label><input type="text" id="txLabel" placeholder="e.g. Weekly shop" required maxlength="80"></div>' +
    '<div class="field"><label for="txCategory">Category</label><select id="txCategory">' +
    cats.map(c => '<option value="' + c.id + '">' + escapeHtml(c.label) + '</option>').join("") + '</select></div>' +
    '<div class="field"><label for="txAmount">Amount ($)</label><input type="number" id="txAmount" min="0.01" step="0.01" placeholder="0.00" required></div>' +
    '<button type="submit">Add transaction</button></form></div>' +
    '<div class="panel"><div class="toolbar"><label for="txFilterSel">Show</label>' +
    '<select id="txFilterSel"><option value="all">All categories</option>' +
    cats.map(c => '<option value="' + c.id + '"' + (txFilter === c.id ? " selected" : "") + '>' + escapeHtml(c.label) + '</option>').join("") +
    '</select><span class="spacer"></span><span class="hint">' + list.length + ' shown · ' + money(list.reduce((s, t) => s + t.amount, 0)) + ' total</span></div>' +
    (list.length ? '<table><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>'
      : '<p class="empty">Nothing in this category yet — add the first one above.</p>') + '</div>';
}

/* ---------- budgets ---------- */
function renderBudgets() {
  const byCat = spentByCategory();
  const rows = state.categories.map(c => {
    const spent = byCat[c.id] || 0;
    const pct = c.budget > 0 ? Math.round(spent / c.budget * 100) : 0;
    const left = c.budget - spent;
    return '<div class="budget-row"><div class="row-top"><span class="name">' + escapeHtml(c.label) + '</span>' +
      '<span class="figs">' + money(spent) + ' of ' + money0(c.budget) + ' · ' + (left >= 0 ? money0(left) + ' left' : money0(-left) + ' over') + '</span></div>' +
      '<div class="progress' + (pct > 100 ? " over" : "") + '"><div style="width:' + Math.min(pct, 100) + '%"></div></div>' +
      '<div class="edit"><label for="budget-' + c.id + '">Monthly budget $</label>' +
      '<input type="number" id="budget-' + c.id + '" min="0" step="1" value="' + c.budget + '">' +
      '<button type="button" class="small ghost" data-save-budget="' + c.id + '">Save</button></div></div>';
  }).join("");
  const totalBudget = state.categories.reduce((s, c) => s + c.budget, 0);
  return '<div class="section-head"><h2>Budgets</h2><p>Monthly limits per category. Change any amount and save — the progress bars follow.</p></div>' +
    '<div class="panel"><p class="hint">Total budgeted: <strong>' + money0(totalBudget) + '</strong> of ' + money0(totalIncome()) + ' income.</p>' + rows + '</div>';
}

/* ---------- bills ---------- */
function renderBills() {
  const sorted = state.bills.slice().sort((a, b) => a.dueDay - b.dueDay);
  const rows = sorted.map(b =>
    '<tr class="' + (b.paid ? "" : "over") + '"><td>' + escapeHtml(b.label) + '</td><td>Day ' + b.dueDay + '</td>' +
    '<td class="num">' + money(b.amount) + '</td>' +
    '<td><span class="pill' + (b.paid ? "" : " due") + '">' + (b.paid ? "Paid" : "Unpaid") + '</span></td>' +
    '<td>' + (b.paid
      ? '<button type="button" class="small ghost" data-bill="' + b.id + '" data-paid="0">Mark unpaid</button>'
      : '<button type="button" class="small" data-bill="' + b.id + '" data-paid="1">Mark as paid</button>') + '</td></tr>').join("");
  return '<div class="section-head"><h2>Bills</h2><p>Recurring bills for November. Marking one paid takes it off the amount still owed.</p></div>' +
    '<div class="panel"><p class="hint">Still to pay this month: <strong>' + money(unpaidBillsTotal()) + '</strong> across ' +
    state.bills.filter(b => !b.paid).length + ' bills.</p>' +
    '<table><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

/* ---------- goals ---------- */
function renderGoals() {
  const rows = state.goals.map(g => {
    const pct = Math.min(Math.round(g.saved / g.target * 100), 100);
    return '<div class="goal-row"><div class="row-top"><span><strong>' + escapeHtml(g.label) + '</strong></span>' +
      '<span>' + money0(g.saved) + ' of ' + money0(g.target) + ' · ' + pct + '%</span></div>' +
      '<p class="note">' + escapeHtml(g.note) + '</p>' +
      '<div class="progress"><div style="width:' + pct + '%"></div></div>' +
      '<div class="add-funds"><label for="fund-' + g.id + '">Add $</label>' +
      '<input type="number" id="fund-' + g.id + '" min="1" step="1" placeholder="50">' +
      '<button type="button" class="small" data-add-funds="' + g.id + '">Add funds</button></div></div>';
  }).join("");
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  return '<div class="section-head"><h2>Savings goals</h2><p>' + money0(totalSaved) + ' saved across ' + state.goals.length + ' goals. Add funds and watch the bars move.</p></div>' +
    '<div class="panel">' + rows + '</div>';
}

/* ---------- reports ---------- */
function renderReports() {
  const byCat = spentByCategory();
  const slices = state.categories.map(c => ({ label: c.label, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value);
  const months = state.history.concat([{ month: state.month, income: totalIncome(), spending: totalSpent() }]);
  const avgSpend = Math.round(months.reduce((s, m) => s + m.spending, 0) / months.length);
  const best = months.slice().sort((a, b) => a.spending - b.spending)[0];
  return '<div class="section-head"><h2>Reports</h2><p>Where November stands against the last three months.</p></div>' +
    '<div class="cards">' +
    '<div class="card"><div class="label">Average monthly spending</div><div class="big">' + money0(avgSpend) + '</div><div class="sub">Aug – Nov 2026</div></div>' +
    '<div class="card good"><div class="label">Cheapest month</div><div class="big">' + monthShort(best.month) + '</div><div class="sub">' + money0(best.spending) + ' spent</div></div>' +
    '<div class="card"><div class="label">November spending</div><div class="big">' + money0(totalSpent()) + '</div><div class="sub">' + (totalSpent() <= avgSpend ? "below" : "above") + ' the 4-month average</div></div>' +
    '<div class="card good"><div class="label">November savings</div><div class="big">' + money0(totalIncome() - totalSpent()) + '</div><div class="sub">income minus spending</div></div>' +
    '</div>' +
    '<div class="grid-2">' +
    '<div class="card"><h3>Spending by category</h3>' + barChart(slices, slices[0] ? slices[0].value : 1) + '</div>' +
    '<div class="card"><h3>Income vs spending</h3>' + monthBars(months) +
    '<p class="chart-key"><span class="key-income"></span>Income &nbsp; <span class="key-spending"></span>Spending</p></div>' +
    '</div>';
}

/* ---------- events ---------- */
function bindView(route) {
  if (route === "transactions") {
    document.getElementById("txFilterSel").addEventListener("change", e => {
      txFilter = e.target.value; render();
    });
    document.getElementById("txForm").addEventListener("submit", e => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("txAmount").value);
      const label = document.getElementById("txLabel").value.trim();
      if (!label || !(amount > 0)) return;
      state.transactions.push({
        id: "t-" + Date.now(),
        date: document.getElementById("txDate").value || "2026-11-26",
        label,
        category: document.getElementById("txCategory").value,
        amount: Math.round(amount * 100) / 100
      });
      saveState(); render();
    });
    document.querySelectorAll("[data-delete-tx]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.transactions = state.transactions.filter(t => t.id !== btn.dataset.deleteTx);
        saveState(); render();
      });
    });
  }
  if (route === "budgets") {
    document.querySelectorAll("[data-save-budget]").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById("budget-" + btn.dataset.saveBudget);
        const val = parseFloat(input.value);
        if (!(val >= 0)) return;
        state.categories.find(c => c.id === btn.dataset.saveBudget).budget = Math.round(val);
        saveState(); render();
      });
    });
  }
  if (route === "bills") {
    document.querySelectorAll("[data-bill]").forEach(btn => {
      btn.addEventListener("click", () => {
        const bill = state.bills.find(b => b.id === btn.dataset.bill);
        if (bill) { bill.paid = btn.dataset.paid === "1"; saveState(); render(); }
      });
    });
  }
  if (route === "goals") {
    document.querySelectorAll("[data-add-funds]").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById("fund-" + btn.dataset.addFunds);
        const val = parseFloat(input.value);
        if (!(val > 0)) return;
        const goal = state.goals.find(g => g.id === btn.dataset.addFunds);
        goal.saved = Math.min(goal.saved + val, goal.target);
        saveState(); render();
      });
    });
  }
}

/* ---------- month picker & reset ---------- */
(function init() {
  const select = document.getElementById("monthSelect");
  ["2026-08", "2026-09", "2026-10", "2026-11"].forEach(m => {
    const opt = document.createElement("option");
    opt.value = m; opt.textContent = monthShort(m);
    if (m === state.month) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", () => {
    /* The demo ships one full month of figures; other months show the
       comparison from Reports instead of invented daily detail. */
    if (select.value !== state.month) {
      select.value = state.month;
      location.hash = "#/reports";
      render();
    }
  });
  document.getElementById("resetDemo").addEventListener("click", () => {
    if (confirm("Reset all changes back to the original sample household?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = structuredClone(SEED);
      render();
    }
  });
  render();
})();
