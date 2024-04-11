const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Route to handle Excel data upload
app.post("/upload", (req, res) => {
  try {
    // Extract the Excel data from the request body
    const excelData = req.body.excelData;

    // Convert Excel data to JSON format
    const jsonData = parseExcelData(excelData);

    // Send the structured JSON data as response
    console.log("Api called!");
    res.json(jsonData);
  } catch (error) {
    // Handle errors
    console.error("Error processing Excel data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to parse Excel data and structure it as JSON
function parseExcelData(excelData) {
  // Split the Excel data by newline character to get rows
  const rows = excelData.split("\n");

  // Extract column headings from the first row
  const headings = rows[0].split("\t");

  // Remove the first row (headings) from the rows array
  const dataRows = rows.slice(1);

  // Initialize an array to store the structured JSON data
  const jsonData = [];

  // Iterate over each data row
  dataRows.forEach((row) => {
    // Split the row by tab character to get individual cells
    const cells = row.split("\t");

    // Initialize an object to store the row data
    const rowData = {};

    // Iterate over each cell and add it to the rowData object
    cells.forEach((cell, index) => {
      rowData[headings[index]] = cell.trim(); // Trim whitespace from cell values
    });

    // Add the rowData object to the jsonData array
    jsonData.push(rowData);
  });

  return jsonData;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
