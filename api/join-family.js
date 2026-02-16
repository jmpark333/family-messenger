// Vercel Function: Join Family with Upstash Redis
const { getRedis } = require('./lib/redis');

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

      const memberId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const redis = getRedis();
      if (!redis) {
        console.error('[API] Redis not available');
        return res.status(500).json({ error: 'Storage service unavailable' });
      }

      // Validate family exists and auth code matches
      console.log('[API] Looking up family in Redis:', familyId);
      let familyData;
      try {
        familyData = await redis.get(`family:${familyId}`);
        console.log('[API] Redis lookup result:', familyData ? 'Found' : 'Not found');
      } catch (redisError) {
        console.error('[API] Redis get failed:', redisError);
        return res.status(500).json({ error: 'Database error', details: redisError.message });
      }

      if (!familyData) {
        console.error('[API] Family not found:', familyId);
        return res.status(404).json({ error: 'Family not found' });
      }

      const family = JSON.parse(familyData);
      if (family.authCode !== authCode) {
        console.error('[API] Invalid auth code');
        return res.status(401).json({ error: 'Invalid authentication code' });
      }

      // Add new member
      family.members.push({ id: memberId, name: name.trim(), publicKey });
      try {
        await redis.set(`family:${familyId}`, JSON.stringify(family));
        // TTL 재설정
        await redis.expire(`family:${familyId}`, 7 * 24 * 60 * 60);
      } catch (setError) {
        console.error('[API] Failed to update family:', setError);
        return res.status(500).json({ error: 'Failed to update family' });
      }

      console.log('[API] Family joined:', { familyId, memberId });

      return res.status(200).json({
        familyId,
        memberId,
        members: family.members,
      });
    } catch (error) {
      console.error('[API] Error joining family:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
};
