// Vercel Function: Poll Messages with Upstash Redis
const { getRedis } = require('./lib/redis');

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

    const redis = getRedis();
    if (!redis) {
      console.error('[API] Redis not available');
      return res.status(500).json({ error: 'Storage service unavailable' });
    }

    // Redis에서 메시지 조회
    const rawMessages = await redis.lrange(`messages:${familyId}`, 0, -1);
    let messages = rawMessages.map(msg => JSON.parse(msg));

    // since 파라미터가 있으면 필터링
    if (since) {
      const sinceTime = parseInt(since, 10);
      messages = messages.filter(msg => msg.timestamp > sinceTime);
    }

    // 최신 메시지가 먼저 오도록 정렬 (최신순)
    messages.sort((a, b) => b.timestamp - a.timestamp);

    console.log('[API] Polling result:', { familyId, messageCount: messages.length });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('[API] Error polling messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
