# Hearth & Ledger

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/prabowo888888-cmyk/best-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/prabowo888888-cmyk/best-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth & Ledger is a small household budget site that runs entirely in the
browser. It follows one made-up family, the Alvarez household, through
November 2026: what comes in, what goes out, which bills are still owed, and
how close the family is to its savings goals. Nothing leaves the browser and
nothing is fetched from the network — open the page and it simply works,
on a laptop or on a phone.

## What you can do here

- **Dashboard** — the month at a glance: income, spending, what is left
  over, the savings rate, and a chart of where the money went.
- **Transactions** — the full list of spending, with real figures. Add a new
  transaction and the totals, charts and reports update at once; filter the
  list by category or delete a line you no longer need.
- **Budgets** — a monthly limit for each category, with a progress bar that
  turns red when spending passes the limit. Edit any amount and save it.
- **Bills** — the recurring bills for the month. Mark one as paid and the
  amount still owed drops straight away.
- **Goals** — three savings goals with progress bars. Add funds to any goal
  and watch it move toward its target.
- **Reports** — spending by category and an income-versus-spending
  comparison across the last four months.

Every change you make is saved in the browser's local storage, so the budget
is still there when you come back. The "Reset demo data" link in the footer
restores the original sample figures.

## How to run it

Serve the `app/` folder with any static file server and open it:

```sh
cd app
python3 -m http.server 8000
```

Then visit `http://localhost:8000/` in a browser. There is no build step
and no framework — the site is plain HTML, CSS and JavaScript files.

## How the entry is assembled

`main.ts` copies `app/` and `screenshots/` into the output directory and
writes `dossier.json` with the kit's `buildDossier` helper:

```sh
MAKEFUN_OUTPUT_DIR=/tmp/hearth-ledger-out node --experimental-strip-types main.ts
```

(Requires Node 22 or newer; the project uses only the standard library.)

## Files

| File | What it is |
| --- | --- |
| `app/index.html` | Page shell, navigation and month picker |
| `app/style.css` | All styling, including the phone layout |
| `app/data.js` | The sample household's figures for November 2026 |
| `app/charts.js` | Small SVG donut and bar chart helpers |
| `app/app.js` | State, routing and every section's rendering |
| `screenshots/` | Real renders of the site in a browser |
| `main.ts` | Copies the site and screenshots, writes `dossier.json` |
