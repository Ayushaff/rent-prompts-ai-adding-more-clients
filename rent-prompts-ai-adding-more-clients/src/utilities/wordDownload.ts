
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const handleExportToWord = (output, onSuccess) => {
    const content = output;
    const lines = content.split("\n");
    const docContent: Paragraph[] = [];

    lines.forEach((line) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        // Detect headings
        docContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace(/\*\*/g, ""), // Remove Markdown-style "**"
                bold: true,
                size: 28, // Heading size: 14pt
                color: "1F4E79", // Dark blue color for headings
              }),
            ],
            spacing: { after: 200 }, // Add spacing after the heading
          })
        );
      } else if (line.startsWith("* ")) {
        // Detect bullet points
        docContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace("* ", ""), // Remove the bullet symbol
                size: 24, // Bullet point size: 12pt
                color: "333333", // Dark gray for text
              }),
            ],
            bullet: {
              level: 0, // Top-level bullet
            },
            spacing: { after: 100 }, // Add spacing after each bullet point
          })
        );
      } else if (line.startsWith("• **") && line.endsWith("**")) {
        // Detect bullet points
        docContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.replace("• **", ""), // Remove the bullet symbol
                size: 24, // Bullet point size: 12pt
                color: "333333", // Dark gray for text
              }),
            ],
            bullet: {
              level: 0, // Top-level bullet
            },
            spacing: { after: 100 }, // Add spacing after each bullet point
          })
        );
      }
       else if (line.trim() !== "") {
        // Treat all other lines as regular paragraphs
        docContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(), // Trim extra spaces
                size: 24, // Regular paragraph size: 12pt
                color: "333333",
              }),
            ],
            spacing: { after: 150 }, // Add spacing after the paragraph
          })
        );
      }
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docContent,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "output.docx");
      if(onSuccess) onSuccess();
    });
  };