import { NextRequest, NextResponse } from 'next/server';
import { validateInviteToken } from '../../../lib/auth/token-validator';
import { validateInvite } from '../../../lib/auth/invite-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const invite = searchParams.get('invite');

  if (!invite) {
    return NextResponse.json({ error: 'MISSING_INVITE' }, { status: 400 });
  }

  const token = validateInviteToken(invite);

  if (!token) {
    return NextResponse.json(
      { valid: false, error: 'INVALID' },
      { status: 400 }
    );
  }

  const validation = await validateInvite(token);

  if (!validation.valid) {
    return NextResponse.json(validation, { status: 400 });
  }

  return NextResponse.json(validation);
}
