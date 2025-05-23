# Auth Starter – Prisma & NextAuth

![image](https://github.com/user-attachments/assets/428b88ac-4e06-4fe6-87f5-72a0c6c66d27)

This is a modern auth starter template built with **Next.js**, **NextAuth.js**, and **Prisma ORM**. It supports both **OAuth** and **Credentials** authentication with user registration, session tracking, and optional email confirmation. The codebase is clean, fully typed, and uses `zod` for schema validation.

---

## 🔥 Features

- **Providers**
  - Google (OAuth)
  - Auth0 (OAuth)
  - Credentials (Email + Password)
- **User Registration**
  - Account creation via form or OAuth
  - Account linking for existing users via OAuth
- **Email Confirmation**
  - Optional email confirmation support (inactive by default)
- **Protected Page**
  - Simple middleware-protected route
- **ORM & Validation**
  - Prisma ORM with PostgreSQL
  - `zod` for model and form validation
- **UI**
  - Refreshed and user-friendly login/register interface
- **Utils**
  - Utility functions for hashing, validation, user helpers, etc.

---

## 🚀 How to Use?

1. **Clone this repository:**

   ```bash
   git clone https://github.com/JunHengker/NextJS-Auth-Boiler-Plate.git
   cd NextJS-Auth-Boiler-Plate
   ```

2. **Setting up ENV:**

   Copy the `bash .env.example` and rename it as `bash .env`

3. **Generate the secret for NextAuth:**

   you could use the opensll rand to create the secret

   ```bash
   openssl rand -base64 32
   ```

4. **Install the depedencies and generate Prisma Client:**

   ```bash
   bun install
   bun db:generate
   ```

   you can check for other command on `package.json`

5. **Run the development server:**

   ```bash
   bun run dev
   ```

## "Learned from the community, cried with the community, now I commit back to the community 😤✨"
