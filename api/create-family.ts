// Vercel Function: Create Family
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
      const { name, authCode, publicKey } = data;

      console.log('[API] Create family request:', { name, authCode, hasPublicKey: !!publicKey });

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name is required' });
      }

      if (!authCode || authCode.length !== 4) {
        return res.status(400).json({ error: 'Auth code must be 4 characters' });
      }

      if (!publicKey || typeof publicKey !== 'string') {
        return res.status(400).json({ error: 'Public key is required' });
      }

      // UUID 생성
      const familyId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const memberId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Redis에 가족 저장
      const family = {
        id: familyId,
        authCode,
        members: [{ id: memberId, name: name.trim(), publicKey }],
        createdAt: Date.now(),
      };
      await redis.hset(`family:${familyId}`, family);
      await redis.expire(`family:${familyId}`, 60 * 60 * 24 * 30); // 30일

      // 메시지 리스트 초기화
      await redis.lpush(`messages:${familyId}`, JSON.stringify({
        id: 'system',
        familyId,
        senderId: 'system',
        senderName: '시스템',
        content: `${name}님이 가족을 생성했습니다.`,
        timestamp: Date.now(),
        encrypted: false,
      }));

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      const inviteUrl = `${baseUrl}/invite?family=${familyId}`;

      console.log('[API] Family created:', { familyId, memberId });

      return res.status(200).json({
        familyId,
        memberId,
        inviteUrl,
      });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON' });
    } catch (error) {
      console.error('[API] Error creating family:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
