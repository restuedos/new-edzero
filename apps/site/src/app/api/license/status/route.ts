import { NextResponse } from 'next/server';
import { getLicenseService } from '@/lib/license';

export async function GET() {
  const service = getLicenseService();
  return NextResponse.json({
    enforced: service.shouldEnforce(),
    verified: service.isVerified(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { licenseKey?: string };
  const licenseKey = body.licenseKey?.trim();
  if (!licenseKey) {
    return NextResponse.json({ ok: false, message: 'License key is required.' }, { status: 400 });
  }

  const result = await getLicenseService().activate(licenseKey);
  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}
