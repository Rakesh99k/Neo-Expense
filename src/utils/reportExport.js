import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Papa from 'papaparse';

export async function exportToPDF(items) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const title = 'Expenses Report';
  page.drawText(title, { x: 40, y: height - 50, size: 20, font, color: rgb(0.07,0.95,0.93) });

  const headers = ['Title','Amount','Category','Date','Notes'];
  const startY = height - 90;
  let y = startY;
  const lineHeight = 14;
  const maxRowsPerPage = Math.floor((height - 120) / lineHeight);
  const rows = items.map(i => [truncate(i.title,28), i.amount.toFixed(2), i.category, new Date(i.date).toLocaleDateString(), truncate(i.notes || '-', 30)]);

  drawRow(page, font, headers, 12, y, true);
  y -= lineHeight + 6;
  let rowCount = 0;
  for (const r of rows) {
    if (rowCount >= maxRowsPerPage) {
      rowCount = 0;
      y = height - 60;
      const newPage = pdfDoc.addPage();
      drawRow(newPage, font, headers, 12, y, true);
      y -= lineHeight + 6;
      page = newPage; // reassign for subsequent rows
    }
    drawRow(page, font, r, 10, y, false);
    y -= lineHeight;
    rowCount++;
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

function drawRow(page, font, cells, size, y, header) {
  let x = 40;
  const colors = header ? rgb(0.4,0.7,0.9) : rgb(0.85,0.85,0.85);
  cells.forEach((c, idx) => {
    const colWidth = [150,70,90,80,150][idx];
    page.drawText(String(c), { x, y, size, font, color: colors });
    x += colWidth;
  });
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max-1) + '…' : str;
}

export function exportToCSV(items) {
  const data = items.map(i => ({
    title: i.title,
    amount: i.amount,
    category: i.category,
    date: new Date(i.date).toISOString(),
    notes: i.notes || ''
  }));
  const csv = Papa.unparse(data);
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}
