// api/messages/poll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/api/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');
    const since = searchParams.get('since');

    if (!familyId) {
      return NextResponse.json(
        { error: 'Missing familyId' },
        { status: 400 }
      );
    }

    const messages = await storage.getMessages(
      familyId,
      since ? parseInt(since, 10) : undefined
    );

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error polling messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
