import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await db.user.findUnique({ where: { email } });

  if (!user || user.isEmailVerified) {
    return NextResponse.json(
      { message: "User not found or already verified" },
      { status: 400 }
    );
  }

  const token = uuidv4();

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  await sendEmail(email, "Verify Your Email", `Click to verify: ${verifyUrl}`);

  return NextResponse.json({ message: "Verification email sent" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token)
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  const verification = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verification || verification.expires < new Date()) {
    return NextResponse.json(
      { error: "Token expired or invalid" },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { email: verification.identifier },
    data: { isEmailVerified: true },
  });

  await db.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?verified=1`
  );
}
