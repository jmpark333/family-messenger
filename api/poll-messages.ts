// Vercel Function: Poll Messages
export default async function handler(req, res) {
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

    // TODO: Vercel KV 또는 DB에서 조회
    const messages = [];

    console.log('[API] Polling result:', { familyId, messageCount: messages.length });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error('[API] Error polling messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
