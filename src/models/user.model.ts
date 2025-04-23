import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string({ required_error: "Name cannot be empty" }).min(2).max(100),
  email: z.string({ required_error: "Email cannot be empty" }).email(),
  password: z
    .string({ required_error: "Password cannot be empty" })
    .min(4)
    .max(100),
  profile_image: z.string().optional(),
  role: z.enum(["ADMIN", "TEACHER", "STUDENT", "USER"]).default("USER"),
  isEmailVerified: z.boolean().optional().default(false),
  isPasswordSet: z.boolean().optional().default(false),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const userUpdateableSchema = userSchema
  .pick({
    name: true,
    email: true,
    profile_image: true,
    role: true,
    isEmailVerified: true,
    isPasswordSet: true,
  })
  .extend({
    password: z.string().optional(),
  });

export const userLoginSchema = z.object({
  email: z.string({ required_error: "Email cannot be empty" }).email(),
  password: z.string({ required_error: "Password cannot be empty" }),
});

export const userWithoutPass = userSchema.omit({
  password: true,
});

export const userSetPasswordSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
  isPasswordSet: true,
});

export type User = z.infer<typeof userSchema>;
export type UserUpdateable = z.infer<typeof userUpdateableSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
