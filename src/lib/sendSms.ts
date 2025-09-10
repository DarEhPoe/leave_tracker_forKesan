import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendSms(to: string[] | string, message: string) {
  const recipients = Array.isArray(to) ? to : [to];
  // Send to all recipients in parallel
  return Promise.all(
    recipients.map((recipient) =>
      client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: recipient,
      })
    )
  );
}