"use client";
import { getProviders } from "next-auth/react";
import LoginButton from "@/components/buttons/LoginButton";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

// OAuth email verification
type Providers = Awaited<ReturnType<typeof getProviders>>;
const renderLoginButtons = (providers: Providers | null) =>
  providers
    ? Object.values(providers)
        .filter((provider) => provider !== null)
        .filter(({ id }) => id !== "prisma-credentials")
        .map((provider) => <LoginButton auth={provider} key={provider.id} />)
    : null;

export default function OAuth() {
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      const response = await getProviders();
      setProviders(response);
    }
    fetchProviders();
  }, []);

  return (
    <div className="w-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Link Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please link your account to continue. You can use any of the
            following methods:
          </p>
        </div>

        <div className="w-full bg-white py-8 shadow-lg sm:rounded-lg sm:px-10 flex flex-row gap-4">
          {renderLoginButtons(providers)}
        </div>
      </div>
    </div>
  );
}
