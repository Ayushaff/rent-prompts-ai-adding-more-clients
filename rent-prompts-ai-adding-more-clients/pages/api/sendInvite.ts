import { NextApiRequest, NextApiResponse } from 'next';
import { sendInvitationEmail } from 'src/utilities/sendEmailHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email ,password} = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' ,success: false});
  }

  try {
    const response = await sendInvitationEmail({ to: email, password: password });

    if (response.success) {
      return res.status(200).json({ message: 'Invitation sent successfully!' ,success: true});
    } else {
      return res.status(500).json({ error: 'Failed to send invitation' ,success: false});
    }
  } catch (error) {
    console.error('Error sending invitation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
