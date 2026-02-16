// Vercel Function: Join Family
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { familyId, name, authCode, publicKey } = await req.body;

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

    // TODO: Vercel KV 또는 DB에 저장 (현재는 mock 응답)
    return res.status(200).json({
      familyId,
      memberId,
      members: [
        { id: memberId, name: name.trim(), publicKey }
      ],
    });
  } catch (error) {
    console.error('Error joining family:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
