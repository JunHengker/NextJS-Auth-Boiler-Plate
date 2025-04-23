"use client";

import { useEffect, useState } from "react";

import { getProviders } from "next-auth/react";

import Divider from "@/components/Divider";
import LoginForm from "@/components/LoginForm";
import LoginButton from "@/components/buttons/LoginButton";

type Providers = Awaited<ReturnType<typeof getProviders>>;

const renderLoginButtons = (providers: Providers | null) =>
  providers
    ? Object.values(providers)
        .filter((provider) => provider !== null)
        .filter(({ id }) => id !== "prisma-credentials")
        .map((provider) => <LoginButton auth={provider} key={provider.id} />)
    : null;

export default function SignIn() {
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      const response = await getProviders();
      setProviders(response);
    }
    fetchProviders();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center mx-auto p-24 max-w-[40rem]">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <LoginForm />
      <Divider />
      <div className="flex flex-col items-center gap-y-4">
        {renderLoginButtons(providers)}
      </div>
    </div>
  );
}
