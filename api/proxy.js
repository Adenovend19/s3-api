export default async function handler(req, res) {
  try {
    const key = req.query['0'];
    if (!key) {
      return res.status(400).send("Missing key");
    }

    const decodedKey = decodeURIComponent(key);
    const s3Url = `https://s3.ap-southeast-3.amazonaws.com/resource.cakap.com/${decodedKey}`;

    const response = await fetch(s3Url);

    if (!response.ok) {
      return res.status(response.status).send("Error fetching S3 file");
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err) {
    console.error("S3 Proxy Error:", err);
    res.status(500).send("Server error");
  }
}