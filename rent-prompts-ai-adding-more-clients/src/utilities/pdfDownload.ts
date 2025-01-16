
import { jsPDF } from "jspdf";

export const handleDownloadPDF = (output, onSuccess) => {
    const doc = new jsPDF();
    const content = output;

    if (typeof content === "string") {
      const pageWidth = 190; // Width available for text (A4 size page minus margins)
      const lineHeight = 7; // Line height
      const startX = 10; // Starting X position for text
      let startY = 10; // Starting Y position for text

      const lines = doc.splitTextToSize(content, pageWidth);

      lines.forEach((line, index) => {
        // Detect headings and apply different styles
        if (line.startsWith("**") && line.endsWith("**")) {
          // Treat this as a heading
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18); // Heading size: 18pt
          doc.setTextColor(31, 78, 121); // Dark blue color for headings
          line = line.replace(/\*\*/g, ""); // Remove Markdown-style "**" for heading
        } else if (line.startsWith("* ")) {
          // Detect bullet points
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12); // Bullet point size: 12pt
          doc.setTextColor(51, 51, 51); // Dark gray for text
          line = line.replace("* ", "• "); // Convert '*' to bullet symbol
        } else {
          // Regular paragraph
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12); // Regular paragraph size: 12pt
          doc.setTextColor(51, 51, 51); // Dark gray for text
        }

        // Check if the line fits within the page height
        if (startY + lineHeight > doc.internal.pageSize.height - 10) {
          // If the next line exceeds the page height, add a new page
          doc.addPage();
          startY = 10; // Reset Y position for new page
        }

        // Draw the line
        doc.text(line, startX, startY);
        startY += lineHeight; // Move to the next line position
      });

      doc.save("output.pdf");
      if (onSuccess) onSuccess();
    } else {
      console.error("Output is not in a valid format for PDF generation.");
    }
  };