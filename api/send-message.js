// Vercel Function: Send Message with Upstash Redis
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
      const { familyId, senderId, senderName, content, attachment, replyTo } = data;

      console.log('[API] Send message request:', {
        familyId,
        senderId,
        senderName,
        contentLength: content?.length,
        hasAttachment: !!attachment,
        attachmentType: attachment?.type,
        hasReplyTo: !!replyTo
      });

      if (!familyId || !senderId || !senderName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate attachment size
      if (attachment) {
        const maxSize = attachment.type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        if (attachment.size > maxSize) {
          return res.status(400).json({
            error: `File too large. Maximum size for ${attachment.type} is ${maxSize / (1024 * 1024)}MB`
          });
        }
      }

      const messageId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const redis = getRedis();
      if (!redis) {
        console.error('[API] Redis not available');
        return res.status(500).json({ error: 'Storage service unavailable' });
      }

      const message = {
        id: messageId,
        familyId,
        senderId,
        senderName,
        content: content || '', // Allow empty content if attachment exists
        timestamp: Date.now(),
        ...(attachment && { attachment }),
        ...(replyTo && { replyTo: { id: replyTo.messageId, senderId: replyTo.senderId, senderName: replyTo.senderName, content: replyTo.content } }),
      };

      // Redis List에 저장 (Upstash Redis는 자동으로 JSON 직렬화)
      await redis.lpush(`messages:${familyId}`, message);

      // 최대 1000개 메시지 유지
      await redis.ltrim(`messages:${familyId}`, 0, 999);

      // 7일 TTL 설정
      await redis.expire(`messages:${familyId}`, 7 * 24 * 60 * 60);

      console.log('[API] Message saved:', { messageId, familyId });

      return res.status(200).json({ success: true, messageId });
    } catch (error) {
      console.error('[API] Error sending message:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
};
