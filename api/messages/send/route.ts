// api/messages/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { familyId, senderId, senderName, content, encrypted } = await request.json();

    // 입력 검증
    if (!familyId || !senderId || !senderName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = {
      id: crypto.randomUUID(),
      familyId,
      senderId,
      senderName,
      content,
      timestamp: Date.now(),
      encrypted: encrypted || false,
    };

    await storage.saveMessage(message);

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
