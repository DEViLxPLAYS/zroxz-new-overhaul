import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a lead notification to the Zroxz team.
 * @param {Object} lead
 */
export async function sendLeadNotification(lead) {
  await resend.emails.send({
    from: 'Zroxz Website <notifications@zroxz.com>',
    to: process.env.CONTACT_EMAIL_TO,
    subject: `New lead: ${lead.name} — ${lead.service || 'General inquiry'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">New Website Lead</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Company</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.company || 'N/A'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Service</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.service || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Budget</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.budget || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: 600;">Source</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${lead.source_page || 'Not specified'}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #F7F7FA; border-radius: 8px;">
          <strong>Message:</strong>
          <p style="margin: 8px 0 0;">${lead.message}</p>
        </div>
        <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">Sent from zroxz.com contact form</p>
      </div>
    `,
  });
}

/**
 * Sends a confirmation email to the lead.
 * @param {Object} lead
 */
export async function sendLeadConfirmation(lead) {
  await resend.emails.send({
    from: 'Zroxz <hello@zroxz.com>',
    to: lead.email,
    subject: `We've got your message, ${lead.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Thanks for reaching out, ${lead.name}.</h2>
        <p>We've received your message and will respond within <strong>24 hours</strong>.</p>
        <p>In the meantime, you can book a strategy call directly — no commitment, just a 30-minute conversation to map out what's possible for your business:</p>
        <div style="margin: 24px 0;">
          <a href="https://zroxz.com/contact" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Book a Call →</a>
        </div>
        <p style="color: #6B7280;">— The Zroxz Team</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
        <p style="color: #9CA3AF; font-size: 12px;">Zroxz · AI Automation & Creative Agency · <a href="https://zroxz.com" style="color: #7C3AED;">zroxz.com</a></p>
      </div>
    `,
  });
}
