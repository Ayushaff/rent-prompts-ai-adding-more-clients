
import * as XLSX from "xlsx";

export const handleDownloadExcel = (output, onSuccess) => {
    const content = output;

    if (typeof content === "string") {
      // Split content into rows (e.g., by newline or a delimiter)
      const rows = content.split("\n").map((line) => ({ Output: line }));

      // Create a worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Save the file
      XLSX.writeFile(workbook, "output.xlsx");
      console.log("Excel file downloaded!");
      if(onSuccess) onSuccess();
    } else {
      console.error("Output is not in a valid format for Excel generation.")
    }
  };