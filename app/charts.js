/* Small SVG chart helpers for Hearth & Ledger.
   No libraries — plain string-built SVG, drawn from the numbers passed in. */

function donutChart(slices, size) {
  /* slices: [{ label, value, color }]. Returns an SVG donut with a centre total. */
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const r = 70, cx = 100, cy = 100, circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = slices.filter(s => s.value > 0).map(s => {
    const frac = s.value / total;
    const len = frac * circumference;
    const dash = Math.max(len - 2, 1).toFixed(1) + " " + circumference.toFixed(1);
    const svg = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
      '" fill="none" stroke="' + s.color + '" stroke-width="26" stroke-dasharray="' +
      dash + '" stroke-dashoffset="' + (-offset).toFixed(1) + '"/>';
    offset += len;
    return svg;
  }).join("");
  return '<svg viewBox="0 0 200 200" width="' + size + '" height="' + size +
    '" role="img" aria-label="Spending by category chart">' +
    '<circle cx="100" cy="100" r="70" fill="none" stroke="#e8e4da" stroke-width="26"/>' +
    arcs +
    '<text x="100" y="96" text-anchor="middle" class="donut-total">' + money(total) + '</text>' +
    '<text x="100" y="116" text-anchor="middle" class="donut-caption">spent</text>' +
    '</svg>';
}

function barChart(rows, maxValue) {
  /* rows: [{ label, value, color }]. Horizontal bars with value labels. */
  const bars = rows.map(row => {
    const pct = maxValue > 0 ? Math.round(row.value / maxValue * 100) : 0;
    return '<div class="bar-row">' +
      '<span class="bar-label">' + escapeHtml(row.label) + '</span>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct +
      '%;background:' + row.color + '"></div></div>' +
      '<span class="bar-value">' + money(row.value) + '</span></div>';
  }).join("");
  return '<div class="bars">' + bars + '</div>';
}

function monthBars(months) {
  /* months: [{ month, income, spending }]. Paired vertical bars, income vs spending. */
  const max = Math.max.apply(null, months.map(m => Math.max(m.income, m.spending)));
  const cols = months.map(m => {
    const incH = Math.round(m.income / max * 120);
    const spH = Math.round(m.spending / max * 120);
    return '<div class="month-col">' +
      '<div class="month-pair">' +
      '<div class="month-bar income" style="height:' + incH + 'px" title="Income ' + money(m.income) + '"></div>' +
      '<div class="month-bar spending" style="height:' + spH + 'px" title="Spending ' + money(m.spending) + '"></div>' +
      '</div><span class="month-name">' + monthShort(m.month) + '</span>' +
      '<span class="month-figs">' + money(m.income) + ' in · ' + money(m.spending) + ' out</span></div>';
  }).join("");
  return '<div class="month-bars">' + cols + '</div>';
}
