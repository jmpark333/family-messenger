// Vercel Function: Send Message
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const { familyId, senderId, senderName, content, encrypted } = data;

      console.log('[API] Send message request:', { familyId, senderId, senderName, contentLength: content?.length });

      if (!familyId || !senderId || !senderName || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const messageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const message = {
        id: messageId,
        familyId,
        senderId,
        senderName,
        content,
        timestamp: Date.now(),
        encrypted: encrypted || false,
      };

      // Redis에 메시지 저장
      await redis.lpush(`messages:${familyId}`, JSON.stringify(message));
      // 최근 1000개만 유지
      await redis.ltrim(`messages:${familyId}`, 0, 999);
      // 7일 만료
      await redis.expire(`messages:${familyId}`, 60 * 60 * 24 * 7);

      console.log('[API] Message saved:', { messageId, familyId });

      return res.status(200).json({ success: true, messageId });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON' });
    } catch (error) {
      console.error('[API] Error sending message:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
