// Vercel Function: Send Message
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
    const { familyId, senderId, senderName, content, encrypted } = req.body || {};

    console.log('[API] Send message request:', { familyId, senderId, senderName, contentLength: content?.length });

    if (!familyId || !senderId || !senderName || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const messageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // TODO: Vercel KV 또는 DB에 저장
    console.log('[API] Message saved:', { messageId, familyId });

    return res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error('[API] Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
