/**
 * Simple CSV export utility.
 */
export function exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) return;

    const separator = ",";
    const keys = Object.keys(rows[0]);

    const csvContent = [
        keys.join(separator),
        ...rows.map(row =>
            keys.map(key => {
                const value = (row as Record<string, unknown>)[key] ?? "";
                return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(separator)
        )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Exports data as a printable PDF via the browser's native print dialog.
 * Opens a new window with a formatted HTML table and triggers print automatically.
 */
export function exportToPdf(filename: string, rows: object[], title?: string) {
    if (!rows || !rows.length) return;

    const keys = Object.keys(rows[0]);
    const headerRow = keys.map(k => `<th>${k}</th>`).join("");
    const bodyRows = rows.map(row =>
        `<tr>${keys.map(k => `<td>${(row as Record<string, unknown>)[k] ?? ""}</td>`).join("")}</tr>`
    ).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 18px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #e5e7eb; }
    td { padding: 7px 10px; border: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background: #f9fafb; }
    @media print { @page { margin: 20mm; } }
  </style>
</head>
<body>
  ${title ? `<h1>${title}</h1>` : ""}
  <table>
    <thead><tr>${headerRow}</tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
}
