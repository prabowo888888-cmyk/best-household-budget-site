/* Seed data for Hearth & Ledger.
   One sample household — the Alvarez family of four — for November 2026.
   All figures are invented for the demo; the app never fetches anything. */

const SEED = {
  household: "The Alvarez Household",
  month: "2026-11",
  currency: "USD",
  income: [
    { id: "inc-1", label: "Maya's salary (nurse)", amount: 3850, day: 1 },
    { id: "inc-2", label: "Leo's salary (teacher)", amount: 2650, day: 15 },
    { id: "inc-3", label: "Weekend market stall", amount: 350, day: 22 }
  ],
  categories: [
    { id: "housing",    label: "Housing",    color: "#2f6f5e", budget: 1450 },
    { id: "groceries",  label: "Groceries",  color: "#3e8e6e", budget: 720 },
    { id: "transport",  label: "Transport",  color: "#c98a2b", budget: 380 },
    { id: "utilities",  label: "Utilities",  color: "#4a7fa5", budget: 310 },
    { id: "dining",     label: "Dining out", color: "#b4552d", budget: 220 },
    { id: "kids",       label: "Kids & school", color: "#7a5fa8", budget: 340 },
    { id: "health",     label: "Health",     color: "#c25b7a", budget: 180 },
    { id: "fun",        label: "Fun & treats", color: "#5a9e8f", budget: 150 },
    { id: "other",      label: "Other",      color: "#8a8f98", budget: 120 }
  ],
  transactions: [
    { id: "t-01", date: "2026-11-01", label: "Rent — Maple Street flat", category: "housing", amount: 1450 },
    { id: "t-02", date: "2026-11-02", label: "Weekly shop — GreenMart", category: "groceries", amount: 168.40 },
    { id: "t-03", date: "2026-11-03", label: "Bus passes (2)", category: "transport", amount: 96 },
    { id: "t-04", date: "2026-11-04", label: "Electricity bill", category: "utilities", amount: 132.75 },
    { id: "t-05", date: "2026-11-05", label: "Pizza night with the kids", category: "dining", amount: 42.50 },
    { id: "t-06", date: "2026-11-07", label: "School trip — science museum", category: "kids", amount: 58 },
    { id: "t-07", date: "2026-11-08", label: "Weekly shop — GreenMart", category: "groceries", amount: 154.20 },
    { id: "t-08", date: "2026-11-09", label: "Petrol", category: "transport", amount: 61.30 },
    { id: "t-09", date: "2026-11-10", label: "Internet & phone", category: "utilities", amount: 89 },
    { id: "t-10", date: "2026-11-11", label: "Dentist check-up (Nora)", category: "health", amount: 85 },
    { id: "t-11", date: "2026-11-12", label: "School lunches top-up", category: "kids", amount: 40 },
    { id: "t-12", date: "2026-11-13", label: "Weekly shop — GreenMart", category: "groceries", amount: 141.85 },
    { id: "t-13", date: "2026-11-14", label: "Takeaway tacos", category: "dining", amount: 36.90 },
    { id: "t-14", date: "2026-11-15", label: "Cinema — family film", category: "fun", amount: 47 },
    { id: "t-15", date: "2026-11-16", label: "Water bill", category: "utilities", amount: 54.60 },
    { id: "t-16", date: "2026-11-17", label: "Petrol", category: "transport", amount: 58.45 },
    { id: "t-17", date: "2026-11-18", label: "Weekly shop — GreenMart", category: "groceries", amount: 149.10 },
    { id: "t-18", date: "2026-11-19", label: "New school shoes (Sam)", category: "kids", amount: 64.99 },
    { id: "t-19", date: "2026-11-20", label: "Pharmacy — vitamins", category: "health", amount: 28.40 },
    { id: "t-20", date: "2026-11-21", label: "Birthday gift for Grandma", category: "other", amount: 52 },
    { id: "t-21", date: "2026-11-22", label: "Weekly shop — GreenMart", category: "groceries", amount: 132.55 },
    { id: "t-22", date: "2026-11-23", label: "Train tickets — visit family", category: "transport", amount: 74 },
    { id: "t-23", date: "2026-11-24", label: "Board game night snacks", category: "fun", amount: 23.80 },
    { id: "t-24", date: "2026-11-25", label: "Lunch out — Maya & Leo", category: "dining", amount: 38.20 }
  ],
  bills: [
    { id: "b-1", label: "Rent", amount: 1450, dueDay: 1, paid: true },
    { id: "b-2", label: "Electricity", amount: 132.75, dueDay: 4, paid: true },
    { id: "b-3", label: "Internet & phone", amount: 89, dueDay: 10, paid: true },
    { id: "b-4", label: "Water", amount: 54.60, dueDay: 16, paid: true },
    { id: "b-5", label: "Home insurance", amount: 62, dueDay: 20, paid: false },
    { id: "b-6", label: "Streaming (2 services)", amount: 24.98, dueDay: 27, paid: false },
    { id: "b-7", label: "Gym — family plan", amount: 45, dueDay: 28, paid: false }
  ],
  goals: [
    { id: "g-1", label: "Summer holiday fund", target: 2400, saved: 1480, note: "Two weeks by the coast in July." },
    { id: "g-2", label: "New washing machine", target: 650, saved: 420, note: "The old one rattles on spin cycle." },
    { id: "g-3", label: "Emergency cushion", target: 3000, saved: 1950, note: "Three months of essentials, slowly." }
  ],
  /* A short look back, so Reports can compare months honestly. */
  history: [
    { month: "2026-08", income: 6720, spending: 3560 },
    { month: "2026-09", income: 6850, spending: 3410 },
    { month: "2026-10", income: 6850, spending: 3685 }
  ]
};
