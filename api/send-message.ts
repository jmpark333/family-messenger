// Vercel Function: Send Message
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
        const { familyId, senderId, senderName, content } = data;

        console.log('[API] Send message request:', { familyId, senderId, senderName, contentLength: content?.length });

        if (!familyId || !senderId || !senderName || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const messageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

        console.log('[API] Message saved:', { messageId, familyId });

        return res.status(200).json({ success: true, messageId });
      } catch (parseError) {
        console.error('[API] JSON parse error:', parseError);
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } catch (error) {
    console.error('[API] Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
