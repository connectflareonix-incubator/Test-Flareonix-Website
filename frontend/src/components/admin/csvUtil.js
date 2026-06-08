/* Convert a JSON array to a CSV string and trigger download. */
export function downloadCSV(rows, filename = 'export.csv') {
  if (!rows || rows.length === 0) {
    const blob = new Blob(['\uFEFF' + 'No data\n'], { type: 'text/csv;charset=utf-8' });
    triggerDownload(blob, filename);
    return;
  }
  const keys = Array.from(rows.reduce((set, r) => {
    Object.keys(r || {}).forEach((k) => set.add(k));
    return set;
  }, new Set()));
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') v = JSON.stringify(v);
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [keys.join(',')];
  rows.forEach((r) => lines.push(keys.map((k) => esc(r[k])).join(',')));
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
