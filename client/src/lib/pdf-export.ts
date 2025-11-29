import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ClassItem, Day } from "@shared/schema";
import { DAYS } from "@shared/schema";
import { formatTime, getClassesForDay, sortByTime } from "./timetable-utils";

export function exportToPDF(classes: ClassItem[]): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Timetable", 148.5, 20, { align: "center" });

  // Subtitle with date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 148.5, 28, { align: "center" });

  // Reset text color
  doc.setTextColor(0);

  // Prepare table data
  const tableHead = [["Time", ...DAYS]];
  const tableBody: string[][] = [];

  // Generate time slots (6 AM to 10 PM)
  for (let hour = 6; hour <= 21; hour++) {
    const timeLabel = `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`;
    const row: string[] = [timeLabel];

    for (const day of DAYS) {
      const dayClasses = getClassesForDay(classes, day as Day);
      const classesAtHour = dayClasses.filter((c) => {
        const [startHour] = c.startTime.split(":").map(Number);
        return startHour === hour;
      });

      if (classesAtHour.length > 0) {
        const classInfo = classesAtHour
          .map(
            (c) =>
              `${c.name}\n${formatTime(c.startTime)} - ${formatTime(c.endTime)}${c.location ? `\n${c.location}` : ""}`
          )
          .join("\n\n");
        row.push(classInfo);
      } else {
        row.push("");
      }
    }

    tableBody.push(row);
  }

  // Create table
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 35,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246], // Primary blue
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
      valign: "top",
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center", fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    margin: { left: 10, right: 10 },
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount} - Time Table Generator`,
      148.5,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Download
  doc.save("timetable.pdf");
}

// Export as detailed class list PDF
export function exportClassListPDF(classes: ClassItem[]): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Class Schedule", 105, 20, { align: "center" });

  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${classes.length} classes - Generated on ${new Date().toLocaleDateString()}`, 105, 28, {
    align: "center",
  });

  doc.setTextColor(0);

  // Sort classes by name
  const sorted = [...classes].sort((a, b) => a.name.localeCompare(b.name));

  // Create table
  const tableHead = [["Subject", "Days", "Time", "Location"]];
  const tableBody = sorted.map((c) => [
    c.name,
    c.days.join(", "),
    `${formatTime(c.startTime)} - ${formatTime(c.endTime)}`,
    c.location || "-",
  ]);

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 10,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // Download
  doc.save("class-list.pdf");
}
