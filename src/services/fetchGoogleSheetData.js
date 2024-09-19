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
      projectId: rowData[2], // Fetch the ID from the 3rd column
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
    console.log(parsedData); // Add this line to check if the project IDs are valid

    return parsedData;
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    throw error;
  }
};

const fetchTvlFromL2Beat = async (projectId) => {
  if (!projectId) {
    console.error("No projectId provided!");
    return "--"; // Fallback in case of missing projectId
  }

  const proxyUrl = `/api/tvl?projectId=${projectId}`;
  console.log("Requesting TVL for project:", projectId);

  try {
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    const tvlData = response.data?.tvlData;

    if (!tvlData || tvlData.length === 0) {
      console.error(`No TVL data found for project ${projectId}`);
      return "--";
    }

    // The API response is assumed to return data in the expected format
    const lastEntry = tvlData[tvlData.length - 1];
    if (!lastEntry || lastEntry.length < 4) {
      console.error(`Malformed data for project ${projectId}`);
      return "--";
    }

    // Calculate the TVL sum by adding the 2nd, 3rd, and 4th entries and dividing by 100,000,000
    const tvlSum = (lastEntry[1] + lastEntry[2] + lastEntry[3]) / 100000000;
    return tvlSum;
  } catch (error) {
    console.error(`Error fetching TVL for project ${projectId}:`, error);
    return "--";
  }
};

// Modify fetchBlockExplorerData to fetch TVL data
export const fetchBlockExplorerData = async (dataRow) => {
  try {
    const explorerStats = await fetchExplorerStats(dataRow.blockExplorerUrl);
    const tvl = await fetchTvlFromL2Beat(dataRow.projectId); // Fetch TVL data

    // Return updated row data with fetched block explorer stats and TVL
    return {
      ...dataRow,
      totalAddresses: explorerStats.totalAddresses,
      totalTransactions: explorerStats.totalTransactions,
      transactionsToday: explorerStats.transactionsToday,
      last30DaysTxCount: explorerStats.last30DaysTxCount,
      tvl, // Add the TVL field
    };
  } catch (error) {
    console.error("Error fetching block explorer data:", error);
    return dataRow; // Return the row as-is in case of an error
  }
};
