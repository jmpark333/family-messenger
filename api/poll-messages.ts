// Vercel Function: Poll Messages
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const familyId = url.searchParams.get('familyId');
    const since = url.searchParams.get('since');

    console.log('[API] Poll messages request:', { familyId, since });

    if (!familyId) {
      return res.status(400).json({ error: 'Missing familyId' });
    }

    // Redis에서 메시지 조회
    const messageStrings = await redis.lrange(`messages:${familyId}`, 0, -1);
    let messages = messageStrings.map(s => JSON.parse(s)).reverse(); // 최신순 정렬

    // since 필터링
    if (since) {
      const sinceTime = parseInt(since, 10);
      messages = messages.filter(m => m.timestamp > sinceTime);
    }

    console.log('[API] Polling result:', { familyId, messageCount: messages.length });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('[API] Error polling messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
