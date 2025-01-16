import { sendEmail } from './sendEmail';
import { InvitationEmailTemplate } from '../app/(frontend)/dashboard/onboard/InvitationEmail';
import {  AccessEmailTemplate } from '@/app/(frontend)/dashboard/onboard/AccessEmail';
interface InvitationParams {
  to: string;
  password: string;
}
interface AccessParams {
  to: string;
}


export async function sendInvitationEmail({ to, password }: InvitationParams) {
  try {
    await sendEmail({
      to,
      subject: 'YOU ARE INVITED!',
      html:InvitationEmailTemplate(to,password),
    });
    return { success: true, message: 'Invite sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendPrivateRappAccessEmail({ to }: AccessParams) {
  try {
    await sendEmail({
      to,
      subject: 'Exclusive Access to RentPrompts Rapp!',
      html: AccessEmailTemplate,
    });
    return { success: true, message: 'Invite sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

