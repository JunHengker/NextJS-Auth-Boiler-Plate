import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
  console.log("Sending email to:", to);
  console.log("Email subject:", subject);
  console.log("Email text:", text);
  console.log("Email user:", process.env.EMAIL_USER);
  console.log("Email pass:", process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}
