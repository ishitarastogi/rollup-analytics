const axios = require("axios");

export default async function handler(req, res) {
  // Allow CORS from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { projectId } = req.query;

  try {
    const l2BeatUrl = `https://l2beat.com/api/trpc/tvl.chart?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22filter%22%3A%7B%22type%22%3A%22projects%22%2C%22projectIds%22%3A%5B%22${projectId}%22%5D%7D%2C%22range%22%3A%22max%22%2C%22excludeAssociatedTokens%22%3Afalse%7D%7D%7D`;

    const response = await axios.get(l2BeatUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching TVL data" });
  }
}
