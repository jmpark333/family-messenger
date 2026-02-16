// Vercel Function: Join Family
export default async function handler(req, res) {
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

  try {
    // Parse body
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
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

        console.log('[API] Family joined:', { familyId, memberId });

        return res.status(200).json({
          familyId,
          memberId,
          members: [
            { id: memberId, name: name.trim(), publicKey }
          ],
        });
      } catch (parseError) {
        console.error('[API] JSON parse error:', parseError);
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } catch (error) {
    console.error('[API] Error joining family:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
