import { NextResponse } from 'next/server';
import { getPayload } from '@/lib/payload';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ ok: false, message: 'Name, email, and message are required.' }, { status: 400 });
  }

  const payload = await getPayload();
  await payload.create({
    collection: 'contact-submissions',
    data: {
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject?.trim() ?? '',
      message: body.message.trim(),
      status: 'new',
    },
  });

  return NextResponse.json({ ok: true, message: 'Message sent successfully.' });
}
