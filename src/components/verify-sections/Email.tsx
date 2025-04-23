"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

export default function EmailVerification({
  email,
  isVerified,
}: {
  email: string;
  isVerified: boolean;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/register/verify-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return isVerified ? (
    <div className="w-full flex items-center justify-center bg-green-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email is already verified. You can now log in using your email
            and password.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please verify your email to continue. Click the button below to
            resend the verification email.
          </p>
        </div>

        <div className="w-full bg-white items-center py-8 shadow-lg sm:rounded-lg sm:px-10 flex flex-row gap-4">
          <button
            onClick={handleSendVerification}
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
          {message && <div className="text-sm text-gray-600">{message}</div>}
        </div>
      </div>
    </div>
  );
}
