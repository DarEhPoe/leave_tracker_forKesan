// lib/sendEmail.ts
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

type EmailBody = {
  to: [];
  subject: string;
  body: string;
};

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN!;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS!;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmail(data: EmailBody) {

  const accessToken = await oAuth2Client.getAccessToken();
  if (!accessToken.token) throw new Error('Failed to get access token');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: EMAIL_ADDRESS,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: data.to,
    subject: data.subject,
    html: data.body,
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
}
