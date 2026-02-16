// Vercel Function: Join Family
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
      const { familyId, name, authCode, publicKey } = data;

      console.log('[API] Join family request:', { familyId, name, authCode });

      if (!familyId || typeof familyId !== 'string') {
        return res.status(400).json({ error: 'Family ID is required' });
      }

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name is required' });
      }

      if (!authCode || authCode.length !== 4) {
        return res.status(400).json({ error: 'Auth code must be 4 characters' });
      }

      if (!publicKey || typeof publicKey !== 'string') {
        return res.status(400).json({ error: 'Public key is required' });
      }

      // Redis에서 가족 조회
      const family = await redis.hgetall(`family:${familyId}`);

      if (!family || Object.keys(family).length === 0) {
        return res.status(404).json({ error: 'Family not found' });
      }

      // authCode 확인 (문자열 변환 필요)
      if (family.authCode !== authCode) {
        return res.status(401).json({ error: 'Invalid auth code' });
      }

      const memberId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // 멤버 추가
      let members = JSON.parse(family.members || '[]');
      members.push({ id: memberId, name: name.trim(), publicKey });
      family.members = JSON.stringify(members);

      await redis.hset(`family:${familyId}`, family);

      // 시스템 메시지 추가
      await redis.lpush(`messages:${familyId}`, JSON.stringify({
        id: `sys-${Date.now()}`,
        familyId,
        senderId: 'system',
        senderName: '시스템',
        content: `${name}님이 가족에 참여했습니다.`,
        timestamp: Date.now(),
        encrypted: false,
      }));

      console.log('[API] Family joined:', { familyId, memberId });

      return res.status(200).json({
        familyId,
        memberId,
        members: JSON.parse(family.members),
      });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON' });
    } catch (error) {
      console.error('[API] Error joining family:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
