// Vercel Function: Create Family
const { Redis } = require('@upstash/redis');

module.exports = async function handler(req, res) {
  console.log('[API] create-family called, method:', req.method);

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
  req.on('data', chunk => {
    body += chunk;
    console.log('[API] Received chunk, length:', chunk.length);
  });
  req.on('end', async () => {
    try {
      console.log('[API] Raw body:', body);

      if (!body || body.trim().length === 0) {
        console.error('[API] Empty body');
        return res.status(400).json({ error: 'Request body is empty' });
      }

      const data = JSON.parse(body);
      console.log('[API] Parsed data:', {
        name: data.name,
        authCode: data.authCode,
        hasPublicKey: !!data.publicKey
      });

      const { name, authCode, publicKey } = data;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        console.error('[API] Name validation failed');
        return res.status(400).json({ error: 'Name is required' });
      }

      if (!authCode || authCode.length !== 4) {
        console.error('[API] AuthCode validation failed:', authCode);
        return res.status(400).json({ error: 'Auth code must be 4 characters' });
      }

      if (!publicKey || typeof publicKey !== 'string') {
        console.error('[API] PublicKey validation failed');
        return res.status(400).json({ error: 'Public key is required' });
      }

      console.log('[API] All validations passed, creating family...');

      // UUID 생성
      const familyId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const memberId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Redis 연결 테스트
      console.log('[API] Connecting to Redis...');
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });

      // Redis에 가족 저장
      const family = {
        id: familyId,
        authCode,
        members: [{ id: memberId, name: name.trim(), publicKey }],
        createdAt: Date.now(),
      };

      console.log('[API] Saving family to Redis:', familyId);
      await redis.hset(`family:${familyId}`, family);
      await redis.expire(`family:${familyId}`, 60 * 60 * 24 * 30); // 30일
      console.log('[API] Family saved successfully');

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
      console.log('[API] Initial message saved');

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
      const inviteUrl = `${baseUrl}/invite?family=${familyId}`;

      console.log('[API] Family created successfully:', { familyId, memberId, inviteUrl });

      return res.status(200).json({
        familyId,
        memberId,
        inviteUrl,
      });
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON', details: parseError.message });
    } catch (error) {
      console.error('[API] Error creating family:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
};
