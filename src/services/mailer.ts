import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
type MailOptions = {
  to: string;
  subject: string;
  text: string;
};

class Mailer {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN, // Generated programmatically
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender address
      to: options.to, // List of recipients
      subject: options.subject, // Subject line
      text: options.text, // Plain text body
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }
}

export default new Mailer();
