// Vercel Function: Get Family Members (for public key sync)
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
    const { familyId } = req.query;

    if (!familyId || typeof familyId !== 'string') {
      return res.status(400).json({ error: 'Family ID is required' });
    }

    const redis = getRedis();
    if (!redis) {
      console.error('[API] Redis not available');
      return res.status(500).json({ error: 'Storage service unavailable' });
    }

    // Get family data
    let familyData;
    try {
      familyData = await redis.get(`family:${familyId}`);
    } catch (redisError) {
      console.error('[API] Redis get failed:', redisError);
      return res.status(500).json({ error: 'Database error', details: redisError.message });
    }

    if (!familyData) {
      return res.status(404).json({ error: 'Family not found' });
    }

    // Upstash Redis는 이미 역직렬화된 객체를 반환
    const family = typeof familyData === 'string' ? JSON.parse(familyData) : familyData;

    console.log('[API] Get family members:', { familyId, memberCount: family.members?.length || 0 });

    return res.status(200).json({
      familyId,
      members: family.members || [],
    });
  } catch (error) {
    console.error('[API] Error getting family members:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
