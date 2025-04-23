import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { userSetPasswordSchema } from "@/models/user.model";
import { auth } from "@/auth";

const saltRounds = 10;

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.isPasswordSet === true) {
      return NextResponse.json(
        { error: "Password already set" },
        { status: 403 }
      );
    }

    const body = {
      name: session.user.name,
      email: session.user.email,
      password: await req.text(),
      isPasswordSet: false,
    };

    const parsed = userSetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // 🛡️ Prevent updating another user
    if (email !== session.user.email) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await db.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        isPasswordSet: true,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        profile_image: updatedUser.profile_image,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
