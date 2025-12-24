/**
 * Report export utilities.
 * - exportToPDF(items): generates a simple tabular PDF report.
 * - exportToCSV(items): returns a CSV Blob using PapaParse.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; // PDF generation toolkit
import Papa from 'papaparse'; // CSV stringify utility

export async function exportToPDF(items) { // build a simple PDF table
  const pdfDoc = await PDFDocument.create(); // new document
  let page = pdfDoc.addPage(); // first page (reassign on page break)
  const { width, height } = page.getSize(); // page dimensions
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // embed font
  const title = 'Expenses Report'; // document title
  page.drawText(title, { x: 40, y: height - 50, size: 20, font, color: rgb(0.07,0.95,0.93) }); // draw title

  const headers = ['Title','Amount','Category','Date','Notes']; // table headers
  const startY = height - 90; // starting y for table
  let y = startY; // current y position
  const lineHeight = 14; // row spacing
  const maxRowsPerPage = Math.floor((height - 120) / lineHeight); // rows per page
  const rows = items.map(i => [truncate(i.title,28), i.amount.toFixed(2), i.category, new Date(i.date).toLocaleDateString(), truncate(i.notes || '-', 30)]); // string rows

  drawRow(page, font, headers, 12, y, true); // draw header row
  y -= lineHeight + 6; // move down
  let rowCount = 0; // rows on current page
  for (const r of rows) { // draw each row
    if (rowCount >= maxRowsPerPage) { // page break condition
      rowCount = 0; // reset counter
      y = height - 60; // reset y
      const newPage = pdfDoc.addPage(); // add new page
      page = newPage; // switch context
      drawRow(page, font, headers, 12, y, true); // redraw headers
      y -= lineHeight + 6; // move below header
    }
    drawRow(page, font, r, 10, y, false); // draw data row
    y -= lineHeight; // move y for next row
    rowCount++; // increment count
  }

  const pdfBytes = await pdfDoc.save(); // serialize PDF
  return new Blob([pdfBytes], { type: 'application/pdf' }); // return Blob for download
}

function drawRow(page, font, cells, size, y, header) { // draw a row of text cells
  let x = 40; // starting x
  const colors = header ? rgb(0.4,0.7,0.9) : rgb(0.85,0.85,0.85); // header vs data color
  cells.forEach((c, idx) => { // for each column
    const colWidth = [150,70,90,80,150][idx]; // fixed widths
    page.drawText(String(c), { x, y, size, font, color: colors }); // draw text
    x += colWidth; // advance x
  });
}

function truncate(str, max) { // limit string length with ellipsis
  return str.length > max ? str.slice(0, max-1) + '…' : str; // truncate if needed
}

export function exportToCSV(items) { // build CSV Blob from items
  const data = items.map(i => ({ // normalize/export fields
    title: i.title,
    amount: i.amount,
    category: i.category,
    date: new Date(i.date).toISOString(),
    notes: i.notes || ''
  }));
  const csv = Papa.unparse(data); // to CSV string
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // Blob for download
}
