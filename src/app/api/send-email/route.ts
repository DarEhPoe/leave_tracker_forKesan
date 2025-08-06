// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendEmail';

type EmailBody = {
  to: [];
  subject: string;
  body: string;
};

export async function POST(request: Request) {
  try {
    const data: EmailBody = await request.json();

    if (!data.to || !data.subject || !data.body) {
      return NextResponse.json(
        { success: false, message: 'All fields (to, subject, body) are required' },
        { status: 400 }
      );
    }

    const result = await sendEmail(data);
    return NextResponse.json(
      { success: true, message: 'Email sent successfully', result },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', (error as Error).message || error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email', error: (error as Error).message },
      { status: 500 }
    );
  }
}
