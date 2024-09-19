import axios from "axios";

// Replace with your own Google Sheets URL and API key
const GOOGLE_SHEET_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1IuSBmbdAu_fdQ4X3VCgAEz1wSxdYiJe8Kn5lUtnr2tg/values/Sheet1!A2:Z1000?key=AIzaSyAG8hFaegrHjZ5Wn8D7XmCAh8ydDnuH4WI";

// Function to fetch stats from the explorer's API
const fetchExplorerStats = async (blockExplorerUrl) => {
  try {
    const statsResponse = await axios.get(`${blockExplorerUrl}/api/v2/stats`, {
      timeout: 5000,
    });
    const chartsResponse = await axios.get(
      `${blockExplorerUrl}/api/v2/stats/charts/transactions`
    );

    const totalAddresses = statsResponse.data.total_addresses;
    const totalTransactions = statsResponse.data.total_transactions;
    const transactionsToday = statsResponse.data.transactions_today;

    // Sum the transaction counts from the last 30 days
    const transactionChartData = chartsResponse.data.chart_data;
    const last30DaysTxCount = transactionChartData.reduce(
      (sum, day) => sum + day.tx_count,
      0
    );

    return {
      totalAddresses,
      totalTransactions,
      transactionsToday,
      last30DaysTxCount,
    };
  } catch (error) {
    console.error("Error fetching explorer stats:", error);
    return {
      totalAddresses: "--",
      totalTransactions: "--",
      transactionsToday: "--",
      last30DaysTxCount: "--",
    };
  }
};

// Fetch Google Sheets data directly using the Google Sheets API
export const fetchGoogleSheetData = async () => {
  try {
    const response = await axios.get(GOOGLE_SHEET_URL, { timeout: 5000 });
    const sheetData = response.data.values; // This contains the actual data from the sheet

    // Create an initial parsed data with placeholders for block explorer data
    const parsedData = sheetData.map((rowData) => ({
      name: rowData[0],
      launchDate: rowData[8],
      framework: rowData[10],
      da: rowData[11],
      vertical: rowData[9],
      raas: rowData[4],
      totalAddresses: "--", // Placeholder
      totalTransactions: "--", // Placeholder
      transactionsToday: "--", // Placeholder
      last30DaysTxCount: "--", // Placeholder
      blockExplorerUrl: rowData[1].trim(), // Store block explorer URL for later use
    }));

    return parsedData;
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
};

// Fetch block explorer data separately for each row
export const fetchBlockExplorerData = async (dataRow) => {
  try {
    const explorerStats = await fetchExplorerStats(dataRow.blockExplorerUrl);

    // Return updated row data with fetched block explorer stats
    return {
      ...dataRow,
      totalAddresses: explorerStats.totalAddresses,
      totalTransactions: explorerStats.totalTransactions,
      transactionsToday: explorerStats.transactionsToday,
      last30DaysTxCount: explorerStats.last30DaysTxCount,
    };
  } catch (error) {
    console.error("Error fetching block explorer data:", error);
    return dataRow; // Return the row as-is in case of an error
  }
};
