// api/family/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { name, authCode, publicKey } = await request.json();

    // 입력 검증
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!authCode || authCode.length !== 4) {
      return NextResponse.json(
        { error: 'Auth code must be 4 characters' },
        { status: 400 }
      );
    }

    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      );
    }

    const memberId = crypto.randomUUID();
    const family = await storage.createFamily(
      name.trim(),
      authCode.toUpperCase(),
      memberId,
      publicKey
    );

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite?family=${family.id}`;

    return NextResponse.json({
      familyId: family.id,
      memberId,
      inviteUrl,
    });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
