import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[\p{L}\p{N}\s'-]+$/u, "Invalid characters in name"),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

function buildEmailHtml(name: string, email: string, message: string): string {
  const escaped = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#a5b4fc;">Portfolio Contact</p>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">New Message Received</h1>
              <p style="margin:12px 0 0;font-size:14px;color:#818cf8;">Someone reached out via your portfolio</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1e293b;padding:0 40px 32px;">

              <!-- Sender card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:44px;vertical-align:top;">
                          <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#ffffff;text-align:center;line-height:44px;">
                            ${escaped(name.charAt(0).toUpperCase())}
                          </div>
                        </td>
                        <td style="padding-left:16px;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#f1f5f9;">${escaped(name)}</p>
                          <a href="mailto:${escaped(email)}" style="font-size:13px;color:#818cf8;text-decoration:none;">${escaped(email)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="border-top:1px solid #334155;"></td>
                </tr>
              </table>

              <!-- Message label -->
              <p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#64748b;">Message</p>

              <!-- Message body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-left:3px solid #6366f1;border-radius:0 8px 8px 0;padding:16px 20px;">
                    <p style="margin:0;font-size:15px;line-height:1.75;color:#cbd5e1;">${escaped(message)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${escaped(email)}?subject=Re: Your message to Anuvrat Joshi"
                       style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.3px;">
                      Reply to ${escaped(name)}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;border-top:1px solid #1e293b;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#475569;">Sent from <strong style="color:#818cf8;">anuvratjoshi.dev</strong> portfolio contact form</p>
              <p style="margin:0;font-size:11px;color:#334155;">© ${new Date().getFullYear()} Anuvrat Joshi</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildAutoReplyHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanks for reaching out!</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#a5b4fc;">Anuvrat Joshi</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">Thanks for reaching out, ${name.split(" ")[0]}! 👋</h1>
              <p style="margin:12px 0 0;font-size:14px;color:#818cf8;line-height:1.6;">I've received your message and will get back to you within 24–48 hours.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#1e293b;padding:32px 40px;">

              <p style="margin:0 0 20px;font-size:15px;color:#94a3b8;line-height:1.75;">
                While you wait, feel free to check out my work:
              </p>

              <!-- Links -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:0 8px 0 0;" width="50%">
                    <a href="https://github.com/Anuvratjoshi" style="display:block;background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;text-decoration:none;text-align:center;">
                      <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#f1f5f9;">GitHub</p>
                      <p style="margin:0;font-size:11px;color:#64748b;">Open source packages</p>
                    </a>
                  </td>
                  <td style="padding:0 0 0 8px;" width="50%">
                    <a href="https://linkedin.com/in/anuvrat-joshi-39b867190" style="display:block;background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;text-decoration:none;text-align:center;">
                      <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#f1f5f9;">LinkedIn</p>
                      <p style="margin:0;font-size:11px;color:#64748b;">Professional profile</p>
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Direct contact</p>
                    <a href="mailto:joshianuvrat@gmail.com" style="font-size:14px;color:#818cf8;text-decoration:none;font-weight:600;">joshianuvrat@gmail.com</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f172a;border-top:1px solid #1e293b;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#475569;">Senior Full Stack Developer · MERN Stack · AI-Enhanced Workflows</p>
              <p style="margin:0;font-size:11px;color:#334155;">© ${new Date().getFullYear()} Anuvrat Joshi — Ahmedabad, GJ</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, message } = parsed.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send notification to Anuvrat
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: "joshianuvrat@gmail.com",
      replyTo: email,
      subject: `📬 New message from ${name} — Portfolio`,
      html: buildEmailHtml(name, email, message),
      text: `New contact form submission\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    // Send auto-reply to sender
    await transporter.sendMail({
      from: `"Anuvrat Joshi" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name.split(" ")[0]}! 👋`,
      html: buildAutoReplyHtml(name),
      text: `Hi ${name.split(" ")[0]},\n\nThanks for your message! I've received it and will get back to you within 24–48 hours.\n\nBest,\nAnuvrat Joshi\njoshianuvrat@gmail.com`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] send error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
