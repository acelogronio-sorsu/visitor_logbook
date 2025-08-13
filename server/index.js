const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// allow api calls from the frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
);

const spreadsheetId = "1TEHVzNxU6MvTDdnxm-3zNJLRiUqr52POS5__9crxz0M";
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Retrieves all the visitor that does not have a time out entry
app.get("/", async (req, res) => {
  // create client instance for auth
  const client = await auth.getClient();
  // instance of google sheets api
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // get rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Visitors!A:G", // specify the range of the sheet on the "Visitors" tab/sheet
  });

  const rows = getRows.data.values;

  // get the blank time out rows
  const blankRows = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cellValue = row[6]; // Assuming the time out is in the 7th column (index 6)

    // Check if the cell value is blank (undefined or empty string)
    if (!cellValue) {
      blankRows.push([
        i + 1, // Add 1 to get the actual row number in the sheet
        row[1],
      ]);
    }
  }

  res.status(200).send({
    nextRow: rows.length, // next row to be added
    visitors: blankRows, // send the visitors with blank time out
  });
});


// Update the time out column of a visitor
app.put("/timeout", async (req, res) => {
  const { index, timeOut } = req.body;

  // create client instance for auth
  const client = await auth.getClient();
  // instance of google sheets api
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Update the time out for the specified visitor
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: `Visitors!G${index}`, // added 2 to adjust for the zero index of arrays and for the header row
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[timeOut]],
    },
  });

  res.status(200).send("Visitor timed out successfully!");
});


// Add new entry to the visitor's logbook
app.post("/", async (req, res) => {
  const { date, name, affiliation, purpose, particulars, timeIn, timeOut } = req.body;

  // create client instance for auth
  const client = await auth.getClient();
  // instance of google sheets api
  const googleSheets = google.sheets({ version: "v4", auth: client });

  // Write the row/s to the sheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Visitors!A:F",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [date, name, affiliation, purpose, particulars, timeIn, timeOut], // row data
      ],
    },
  });

  res.status(200).send("Welcome to ORD!");
});

app.listen(1337, (req, res) => console.log("running on port 1337"));
