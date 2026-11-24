import { DBEnquiry, DBContactMessage } from "../db/store";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mode: "resend" | "development_logged";
  recoveryLink?: string;
}

export function isEmailServiceConfigured(): boolean {
  const resendApiKey = process.env.RESEND_API_KEY;
  return Boolean(
    resendApiKey &&
      resendApiKey.startsWith("re_") &&
      !resendApiKey.includes("placeholder") &&
      !resendApiKey.includes("simulator")
  );
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<EmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Flash Solar <notifications@flashsolar.org>";

  // If live Resend API key is configured (and not in vitest/mocked test unless explicitly intended), send through Resend
  if (isEmailServiceConfigured()) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const safeError =
          typeof errData?.message === "string"
            ? errData.message
            : "Provider rejected message dispatch";
        return { success: false, error: `RESEND_ERROR: ${safeError}`, mode: "resend" };
      }

      const data = await res.json();
      return { success: true, messageId: data.id, mode: "resend" };
    } catch (err: unknown) {
      return {
        success: false,
        error: "NETWORK_ERROR: Unable to reach email delivery service",
        mode: "resend",
      };
    }
  }

  // If in production and email service is not configured, fail safely rather than claiming success
  if (process.env.NODE_ENV === "production") {
    return {
      success: false,
      error: "EMAIL_SERVICE_UNAVAILABLE: Resend API key is not configured in production environment.",
      mode: "resend",
    };
  }

  // Development & local fallback: structured logger preventing failures
  console.log("----------------------------------------------------------------");
  console.log(`[EMAIL DISPATCH - DEV SIMULATOR] To: ${to} | Subject: ${subject}`);
  console.log(text);
  console.log("----------------------------------------------------------------");

  return {
    success: true,
    messageId: `dev_${Date.now()}`,
    mode: "development_logged",
  };
}

// -----------------------------------------------------------------------------
// Email Templates
// -----------------------------------------------------------------------------

export async function sendNewEnquiryNotification(enquiry: DBEnquiry): Promise<EmailResult> {
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || "info@flashsolar.org";

  const subject = `[New Sizing Enquiry] Ref: ${enquiry.referenceNumber} - ${enquiry.fullName} (${enquiry.productOfInterest})`;

  const text = `
New Flash Solar Engineering Enquiry
Reference: ${enquiry.referenceNumber}
Full Name: ${enquiry.fullName}
Company: ${enquiry.company || "Not provided"}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Location: ${enquiry.city ? `${enquiry.city}, ` : ""}${enquiry.country || "Global"}
Product: ${enquiry.productOfInterest}
Project Type: ${enquiry.projectType || "General"}
Estimated Power: ${enquiry.estimatedPowerReq || "Not specified"}
Daily Energy Demand: ${enquiry.estimatedDailyEnergy || "Not specified"}

Message:
${enquiry.message}

Received: ${new Date(enquiry.createdAt).toLocaleString()}
  `.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #061321; color: #F7F7F5; padding: 32px; border-radius: 12px; border: 1px solid #29445E;">
      <div style="border-bottom: 2px solid #F2B33F; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #F7F7F5; margin: 0; font-size: 22px;">FLASH <span style="color: #F2B33F;">SOLAR</span></h2>
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; letter-spacing: 2px;">Engineering Sizing Intake</span>
      </div>
      <p style="font-size: 14px; color: #FFD17A; margin-top: 0;">A new technical sizing enquiry has been submitted.</p>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; background: #101F32; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0; width: 40%;">Reference:</td><td style="padding: 10px 14px; color: #F2B33F; font-family: monospace; font-weight: bold;">${enquiry.referenceNumber}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Name:</td><td style="padding: 10px 14px; color: #F7F7F5;">${enquiry.fullName}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Company:</td><td style="padding: 10px 14px; color: #F7F7F5;">${enquiry.company || "Individual"}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Email:</td><td style="padding: 10px 14px; color: #F7F7F5;"><a href="mailto:${enquiry.email}" style="color: #F2B33F;">${enquiry.email}</a></td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Phone:</td><td style="padding: 10px 14px; color: #F7F7F5;">${enquiry.phone}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Product of Interest:</td><td style="padding: 10px 14px; color: #34D399; font-weight: bold;">${enquiry.productOfInterest}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 10px 14px; color: #B6C1D0;">Location:</td><td style="padding: 10px 14px; color: #F7F7F5;">${enquiry.city ? `${enquiry.city}, ` : ""}${enquiry.country || "Global"}</td></tr>
      </table>

      <div style="background: #081422; padding: 16px; border-radius: 8px; border: 1px solid #182C44; margin-top: 16px;">
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; font-weight: bold;">Project Scope:</span>
        <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: #F7F7F5;">${enquiry.message}</p>
      </div>
      
      <p style="font-size: 11px; color: #B6C1D0; margin-top: 24px; border-top: 1px solid #1E3E62; padding-top: 12px;">
        Flash Solar Platform • Automated Lead Ingestion
      </p>
    </div>
  `;

  return sendEmail({ to: companyEmail, subject, text, html });
}

export async function sendCustomerEnquiryConfirmation(enquiry: DBEnquiry): Promise<EmailResult> {
  const subject = `Flash Solar Enquiry Confirmation [Ref: ${enquiry.referenceNumber}]`;

  const text = `
Hello ${enquiry.fullName},

Thank you for contacting Flash Solar regarding ${enquiry.productOfInterest}.

We have received your project details and assigned reference number: ${enquiry.referenceNumber}.
Our electrical engineering team will review your load specifications and contact you shortly.

Summary of submitted information:
- Reference: ${enquiry.referenceNumber}
- System of Interest: ${enquiry.productOfInterest}
- Contact Phone: ${enquiry.phone}

For urgent technical assistance, please reply to this email or contact info@flashsolar.org.

Warm regards,
Flash Solar Engineering Desk
https://flashsolar.org
  `.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #061321; color: #F7F7F5; padding: 32px; border-radius: 12px; border: 1px solid #29445E;">
      <div style="border-bottom: 2px solid #F2B33F; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #F7F7F5; margin: 0; font-size: 22px;">FLASH <span style="color: #F2B33F;">SOLAR</span></h2>
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; letter-spacing: 2px;">Clean Energy & Energy Storage</span>
      </div>
      <h3 style="color: #F7F7F5; margin-top: 0; font-size: 18px;">Enquiry Received &amp; Logged</h3>
      <p style="font-size: 14px; color: #B6C1D0; line-height: 1.6;">
        Dear <strong>${enquiry.fullName}</strong>,<br/><br/>
        Thank you for submitting your specifications regarding <strong>${enquiry.productOfInterest}</strong>. Your enquiry has been registered in our engineering pipeline under reference number:
      </p>
      <div style="background: #101F32; padding: 16px; border-radius: 8px; border: 1px solid #29445E; text-align: center; margin: 20px 0;">
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; display: block; margin-bottom: 4px;">Tracking Reference</span>
        <span style="font-size: 24px; font-family: monospace; font-weight: bold; color: #F2B33F; letter-spacing: 2px;">${enquiry.referenceNumber}</span>
      </div>
      <p style="font-size: 13px; color: #B6C1D0; line-height: 1.6;">
        Our electrical engineering desk reviews load profiles, temperature deratings, and battery bank sizing prior to proposal issuance. An engineer will follow up with you directly.
      </p>
      <div style="border-top: 1px solid #1E3E62; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #B6C1D0;">
        <strong>Flash Solar Engineering Desk</strong><br/>
        Email: <a href="mailto:info@flashsolar.org" style="color: #F2B33F;">info@flashsolar.org</a> | Web: <a href="https://flashsolar.org" style="color: #F2B33F;">flashsolar.org</a>
      </div>
    </div>
  `;

  return sendEmail({ to: enquiry.email, subject, text, html });
}

export async function sendContactMessageAlert(msg: DBContactMessage): Promise<EmailResult> {
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL || "info@flashsolar.org";
  const subject = `[Contact Form Message] ${msg.subject || "General Inquiry"} - ${msg.name}`;

  const text = `
New Contact Message Received
Reference: ${msg.referenceNumber}
Name: ${msg.name}
Email: ${msg.email}
Phone: ${msg.phone || "Not provided"}
Subject: ${msg.subject || "General"}

Message:
${msg.message}
  `.trim();

  const html = `
    <div style="font-family: sans-serif; background: #061321; color: #F7F7F5; padding: 24px; border-radius: 8px;">
      <h3 style="color: #F2B33F; margin-top: 0;">New Contact Form Message</h3>
      <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
      <p><strong>Phone:</strong> ${msg.phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${msg.subject || "General"}</p>
      <div style="background: #101F32; padding: 12px; border-radius: 6px; margin-top: 12px;">
        <p style="margin: 0;">${msg.message}</p>
      </div>
    </div>
  `;

  return sendEmail({ to: companyEmail, subject, text, html });
}

export async function sendPasswordResetEmail({
  to,
  resetToken,
  userName,
}: {
  to: string;
  resetToken: string;
  userName: string;
}): Promise<EmailResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flashsolar.org";
  const resetLink = `${appUrl}/admin/reset-password?token=${encodeURIComponent(resetToken)}`;
  const subject = `[Flash Solar Security] Administrative Password Reset Request`;

  const text = `
Hello ${userName},

A password reset request has been initiated for your Flash Solar administrative account (${to}).

To reset your password, visit the following secure link (valid for 60 minutes):
${resetLink}

If you did not request this password reset, please ignore this notice or contact the platform security desk immediately at info@flashsolar.org.

Flash Solar Infrastructure Security
https://flashsolar.org
  `.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #061321; color: #F7F7F5; padding: 32px; border-radius: 12px; border: 1px solid #29445E;">
      <div style="border-bottom: 2px solid #F2B33F; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #F7F7F5; margin: 0; font-size: 22px;">FLASH <span style="color: #F2B33F;">SOLAR</span></h2>
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; letter-spacing: 2px;">Administrative Security Desk</span>
      </div>
      <h3 style="color: #F7F7F5; margin-top: 0; font-size: 18px;">Password Reset Authorization</h3>
      <p style="font-size: 14px; color: #B6C1D0; line-height: 1.6;">
        Hello <strong>${userName}</strong>,<br/><br/>
        A credential reset request was submitted for your administrator account. Click the button below to establish a new password (active for 60 minutes):
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetLink}" style="background: #F2B33F; color: #061321; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 13px; display: inline-block;">
          Reset Administrator Password
        </a>
      </div>
      <p style="font-size: 12px; color: #B6C1D0; line-height: 1.6; word-break: break-all;">
        Direct link: <a href="${resetLink}" style="color: #F2B33F;">${resetLink}</a>
      </p>
      <div style="border-top: 1px solid #1E3E62; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #B6C1D0;">
        If you did not request this reset, your account remains secure. No action is required.
      </div>
    </div>
  `;

  if (!isEmailServiceConfigured()) {
    console.warn(
      `[LOCAL ADMIN RECOVERY] Email provider not configured. Reset link for ${to}: ${resetLink}`
    );
    return {
      success: false,
      error: "EMAIL_SERVICE_UNAVAILABLE: Resend API key is not configured for email dispatch.",
      mode: "resend",
      recoveryLink: resetLink,
    };
  }

  return sendEmail({ to, subject, text, html });
}

export async function sendLeadAssignmentNotification({
  to,
  engineerName,
  enquiry,
}: {
  to: string;
  engineerName: string;
  enquiry: DBEnquiry;
}): Promise<EmailResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flashsolar.org";
  const deskLink = `${appUrl}/admin/enquiries?search=${encodeURIComponent(enquiry.referenceNumber)}`;
  const subject = `[Lead Assigned] Ref: ${enquiry.referenceNumber} - ${enquiry.fullName} (${enquiry.productOfInterest})`;

  const text = `
Hello ${engineerName},

A prospective client engineering sizing enquiry has been assigned to you.

Lead Reference: ${enquiry.referenceNumber}
Client Name: ${enquiry.fullName}
Company: ${enquiry.company || "Individual"}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Product of Interest: ${enquiry.productOfInterest}
Project Type: ${enquiry.projectType || "General Consultation"}
Estimated Power: ${enquiry.estimatedPowerReq || "Not specified"}
Daily Energy Demand: ${enquiry.estimatedDailyEnergy || "Not specified"}

Review and update lead status at:
${deskLink}

Flash Solar Lead Dispatcher
  `.trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #061321; color: #F7F7F5; padding: 32px; border-radius: 12px; border: 1px solid #29445E;">
      <div style="border-bottom: 2px solid #F2B33F; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #F7F7F5; margin: 0; font-size: 22px;">FLASH <span style="color: #F2B33F;">SOLAR</span></h2>
        <span style="font-size: 11px; text-transform: uppercase; color: #B6C1D0; letter-spacing: 2px;">Engineering Lead Assignment</span>
      </div>
      <h3 style="color: #F7F7F5; margin-top: 0; font-size: 18px;">New Lead Assigned</h3>
      <p style="font-size: 14px; color: #B6C1D0;">
        Hello <strong>${engineerName}</strong>, the following engineering inquiry has been routed to your queue:
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 16px 0; background: #101F32; border-radius: 8px;">
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 8px 12px; color: #B6C1D0;">Reference:</td><td style="padding: 8px 12px; color: #F2B33F; font-family: monospace; font-weight: bold;">${enquiry.referenceNumber}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 8px 12px; color: #B6C1D0;">Client:</td><td style="padding: 8px 12px; color: #F7F7F5;">${enquiry.fullName} (${enquiry.company || "Individual"})</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 8px 12px; color: #B6C1D0;">System:</td><td style="padding: 8px 12px; color: #34D399; font-weight: bold;">${enquiry.productOfInterest}</td></tr>
        <tr style="border-bottom: 1px solid #1E3E62;"><td style="padding: 8px 12px; color: #B6C1D0;">Contact:</td><td style="padding: 8px 12px; color: #F7F7F5;">${enquiry.email} / ${enquiry.phone}</td></tr>
      </table>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${deskLink}" style="background: #F2B33F; color: #061321; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; display: inline-block;">
          Open Lead in Command Center
        </a>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, text, html });
}
