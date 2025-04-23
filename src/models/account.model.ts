import { z } from "zod";

export const accountSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  provider: z.string(),
  providerAccountId: z.string(),
  access_token: z.string().nullable(),
  id_token: z.string().nullable(),
  scope: z.string().nullable(),
  token_type: z.string().nullable(),
  session_state: z.string().nullable().optional(),
  expires_at: z.date().nullable().optional(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const accountUpdateableSchema = accountSchema
  .pick({
    access_token: true,
    id_token: true,
    scope: true,
    token_type: true,
    session_state: true,
    expires_at: true,
  })
  .extend({
    userId: z.string().uuid(),
  });

export const accountValidationSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  provider: z.string(),
  providerAccountId: z.string(),
  access_token: z.string().nullable(),
  id_token: z.string().nullable(),
  scope: z.string().nullable(),
  token_type: z.string().nullable(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountUpdateable = z.infer<typeof accountUpdateableSchema>;
