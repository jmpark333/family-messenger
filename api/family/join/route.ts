// api/family/join/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/api/storage';

export async function POST(request: NextRequest) {
  try {
    const { familyId, name, authCode, publicKey } = await request.json();

    // 입력 검증
    if (!familyId || typeof familyId !== 'string') {
      return NextResponse.json(
        { error: 'Family ID is required' },
        { status: 400 }
      );
    }

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

    const family = await storage.getFamily(familyId);

    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    if (family.authCode !== authCode.toUpperCase()) {
      return NextResponse.json(
        { error: 'Invalid auth code' },
        { status: 401 }
      );
    }

    if (family.members.length >= 4) {
      return NextResponse.json(
        { error: 'Family is full (max 4 members)' },
        { status: 400 }
      );
    }

    const memberId = crypto.randomUUID();
    const success = await storage.addMember(
      familyId,
      memberId,
      name.trim(),
      publicKey
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to join family' },
        { status: 400 }
      );
    }

    // 업데이트된 멤버 목록 반환
    const updatedFamily = await storage.getFamily(familyId);

    return NextResponse.json({
      familyId,
      memberId,
      members: updatedFamily?.members,
    });
  } catch (error) {
    console.error('Error joining family:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
