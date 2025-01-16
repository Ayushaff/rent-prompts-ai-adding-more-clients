import { ReactNode } from 'react';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject,html }: { to: string; subject: string; html:string }) {
  try {
    const response = await resend.emails.send({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    throw new Error('Email sending failed');
  }
}
