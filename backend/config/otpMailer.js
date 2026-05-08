const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});


const otpMailer = async (toMail, otp, purpose = 'login') => {
    const isRegistration = purpose === 'register';

    const subject = isRegistration
        ? '🔐 TechParts Store — Verify Your Email'
        : '🔑 TechParts Store — Your Login Code';

    const heading = isRegistration
        ? 'Verify Your Email Address'
        : 'Your Two-Factor Login Code';

    const description = isRegistration
        ? 'Welcome to TechParts Store! Please use the code below to verify your email and activate your account.'
        : 'Use the code below to complete your login. This code is valid for 10 minutes.';

    const mailInfo = {
        from: `"TechParts Store" <${process.env.EMAIL_USER}>`,
        to: toMail,
        subject,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#0f1629;border-radius:16px;border:1px solid #1e2a4a;overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0070f3,#00c8ff);padding:32px;text-align:center;">
                      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:1px;">⚡ TechParts Store</h1>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Computer Parts & Components</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 36px;">
                      <h2 style="margin:0 0 12px;color:#e2e8f0;font-size:20px;">${heading}</h2>
                      <p style="margin:0 0 32px;color:#94a3b8;font-size:15px;line-height:1.6;">${description}</p>
                      <!-- OTP Box -->
                      <div style="background:#1a2540;border:2px solid #0070f3;border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                        <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Verification Code</p>
                        <p style="margin:0;color:#00c8ff;font-size:42px;font-weight:800;letter-spacing:12px;font-family:monospace;">${otp}</p>
                      </div>
                      <p style="margin:0;color:#475569;font-size:13px;text-align:center;">
                        ⏱ This code expires in <strong style="color:#94a3b8;">10 minutes</strong>.<br/>
                        If you did not request this, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 36px;border-top:1px solid #1e2a4a;text-align:center;">
                      <p style="margin:0;color:#334155;font-size:12px;">© 2025 TechParts Store. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
    };

    await transporter.sendMail(mailInfo);
    console.log(`📧 OTP sent to ${toMail} (purpose: ${purpose})`);
};

module.exports = { otpMailer };