"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  User,
  Mail,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { signIn } from "next-auth/react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const getStrengthText = () => {
    if (!password) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (!password) return "bg-gray-200";
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  // API call to register the user
  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    data.password = password;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
      } else {
        setSuccess(result.message || "User created successfully");
        reset();
        window.location.href = "/auth/signin";
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us today and get started
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="mt-2 text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="pb-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Full name is required" })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <div className="absolute flex items-center pointer-events-none ">
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                </div>
              )}
            </div>

            <div className="pb-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <div className="absolute flex items-center pointer-events-none ">
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                </div>
              )}
            </div>

            <div className="pb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs font-medium text-gray-500">
                      Password strength
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        passwordStrength <= 2
                          ? "text-red-500"
                          : passwordStrength <= 4
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {getStrengthText()}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      {password.length >= 8 ? (
                        <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center">
                      {/[A-Z]/.test(password) ? (
                        <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      )}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center">
                      {/\d/.test(password) ? (
                        <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      )}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center">
                      {/[^A-Za-z0-9]/.test(password) ? (
                        <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      )}
                      <span>Special character</span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="absolute flex items-center pointer-events-none ">
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    <ArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                  )}
                </span>
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?
            </span>
            <button
              className="ml-2 font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() =>
                signIn("credentials", { callbackUrl: "/protected" })
              }
            >
              Sign in instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
