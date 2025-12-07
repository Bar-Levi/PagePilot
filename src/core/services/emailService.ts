import nodemailer from "nodemailer";

/**
 * Email Service
 * 
 * Handles sending emails via Gmail SMTP
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD in environment variables
 */

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendOTPEmailParams {
  to: string;
  businessName: string;
  otp: string;
  publicUrl: string;
  loginUrl: string;
}

interface SendWelcomeEmailParams {
  to: string;
  businessName: string;
  otp: string;
  publicUrl: string;
  loginUrl: string;
}

/**
 * Send OTP email for login
 */
export async function sendOTPEmail(params: SendOTPEmailParams) {
  const { to, businessName, otp, publicUrl, loginUrl } = params;

  try {
    const info = await transporter.sendMail({
      from: `"PagePilot" <${process.env.GMAIL_USER}>`,
      to,
      subject: "קוד כניסה ל-PagePilot 🔐",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 קוד כניסה</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              שלום!
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">
              התקבלה בקשה להתחברות לחשבון שלך ב-PagePilot.
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; text-align: center; margin-bottom: 30px; border: 2px dashed #667eea;">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">קוד הכניסה שלך:</p>
              <p style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; margin: 0; font-family: 'Courier New', monospace;">
                ${otp}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">
              ⏰ הקוד תקף ל-30 דקות
            </p>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #1e40af; margin: 0;">
                <strong>💡 טיפ:</strong> לא ביקשת קוד? התעלם ממייל זה.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; text-align: center; margin-top: 30px;">
              PagePilot - בונה דפי נחיתה מקצועיים עם AI
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent successfully:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, error };
  }
}

/**
 * Send welcome email with account details
 */
export async function sendWelcomeEmail(params: SendWelcomeEmailParams) {
  const { to, businessName, otp, publicUrl, loginUrl } = params;

  try {
    const info = await transporter.sendMail({
      from: `"PagePilot" <${process.env.GMAIL_USER}>`,
      to,
      subject: `ברוך הבא ל-PagePilot! 🚀 - ${businessName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎉 ברוך הבא!</h1>
            <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 18px;">דף הנחיתה שלך מוכן</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              שלום <strong>${businessName}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">
              דף הנחיתה שלך נוצר בהצלחה! 🎉
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0; font-size: 18px;">📍 הדף הציבורי שלך</h3>
              <a href="${publicUrl}" style="color: #667eea; text-decoration: none; font-size: 16px; word-break: break-all;">
                ${publicUrl}
              </a>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0; font-size: 18px;">🔐 קוד כניסה חד-פעמי</h3>
              <p style="font-size: 28px; font-weight: bold; color: #667eea; letter-spacing: 3px; margin: 15px 0; font-family: 'Courier New', monospace; text-align: center;">
                ${otp}
              </p>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                ⏰ תקף ל-30 דקות
              </p>
            </div>
            
            <div style="background: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">📝 להתחברות ולניהול הדף:</h3>
              <ol style="color: #374151; font-size: 15px; line-height: 1.8; margin: 15px 0; padding-right: 20px;">
                <li>היכנס ל: <a href="${loginUrl}" style="color: #667eea;">${loginUrl}</a></li>
                <li>בחר "קוד למייל"</li>
                <li>הזן את המייל: <strong>${to}</strong></li>
                <li>הזן את הקוד: <strong>${otp}</strong></li>
                <li>בחר סיסמה קבועה</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                התחבר עכשיו 🚀
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="font-size: 14px; color: #92400e; margin: 0;">
                <strong>💡 טיפ:</strong> שמור מייל זה לעיון עתידי. תוכל תמיד לבקש קוד חדש דרך מסך ההתחברות.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #9ca3af; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              בהצלחה! 🚀<br>
              צוות PagePilot
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Welcome email sent successfully:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return { success: false, error };
  }
}
