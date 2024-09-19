const axios = require("axios");

export default async function handler(req, res) {
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required" });
  }

  try {
    const l2BeatUrl = `https://l2beat.com/api/trpc/tvl.chart?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22filter%22%3A%7B%22type%22%3A%22projects%22%2C%22projectIds%22%3A%5B%22${projectId}%22%5D%7D%2C%22range%22%3A%22max%22%2C%22excludeAssociatedTokens%22%3Afalse%7D%7D%7D`;

    const response = await axios.get(l2BeatUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching TVL for project ${projectId}:`, error);
    res
      .status(500)
      .json({ error: `Error fetching TVL for project ${projectId}` });
  }
}
