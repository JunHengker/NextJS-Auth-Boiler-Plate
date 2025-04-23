import { NextResponse } from "next/server";
import db from "@/lib/db";
import { userSchema } from "@/models/user.model";
import bcrypt from "bcryptjs";

const saltRounds = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!hashedPassword) {
      return NextResponse.json(
        { error: "Password hashing failed" },
        { status: 500 }
      );
    }

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile_image: null,
        role: "USER",
        isEmailVerified: false,
        isPasswordSet: true,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        profile_image: newUser.profile_image,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
