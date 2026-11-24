export default async function handler(req, res) {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ alive: false });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);
    return res.status(200).json({ alive: response.status < 500 });
  } catch (e) {
    try {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 5000);
      const resHttp = await fetch(`http://${domain}`, {
        method: 'HEAD',
        signal: controller2.signal
      });
      clearTimeout(timeout2);
      return res.status(200).json({ alive: resHttp.status < 500 });
    } catch (err) {
      return res.status(200).json({ alive: false });
    }
  }
}
