import { auth } from "@/auth";
import { cookies } from "next/headers";
import LogoutButton from "@/components/buttons/LogoutButton";
import OAuth from "@/components/verify-sections/OAuth";
import CreatePassword from "@/components/verify-sections/CreatePassword";
import {
  Shield,
  User,
  CheckCircle,
  ChevronDown,
  LinkIcon,
  Mail,
  Key,
  AlertCircle,
} from "lucide-react";

export default async function Protected() {
  const session = await auth();

  // Session from auth()
  console.log("Session data:", session);

  // Manually fetch the session cookie and send it to the API route
  const cookieHeader = (await cookies())
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:3000/api/protected", {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const apiResponse = await res.text();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <header className="bg-white shadow-sm rounded-lg mb-8">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Account Dashboard
                </h1>
              </div>
              <LogoutButton />
            </div>
          </header>

          <main>
            <div className="max-w-7xl mx-auto">
              <div className="bg-white shadow-sm rounded-lg mb-8 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mr-4">
                      <User className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {session?.user?.name || "Welcome"}
                      </h2>
                      <p className="text-indigo-100">
                        {session?.user?.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Account Status
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Email Verified
                          </span>
                          {session?.user?.isEmailVerified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            OAuth Linked
                          </span>
                          {session?.user?.isLinked ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Linked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Linked
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Password Set
                          </span>
                          {session?.user?.isPasswordSet ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Set
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <AlertCircle className="h-5 w-5 text-indigo-500 mr-2" />
                        Actions Needed
                      </h3>
                      <div className="mt-4">
                        {!session?.user?.isLinked &&
                          !session?.user?.isEmailVerified && (
                            <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Mail className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-yellow-800">
                                    Verify Your Email
                                  </h4>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    Please verify your email address to secure
                                    your account.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {!session?.user?.isPasswordSet && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <Key className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-yellow-800">
                                  Set Your Password
                                </h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Create a password to secure your account and
                                  enable all features.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {!session?.user?.isLinked && (
                          <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <LinkIcon className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-yellow-800">
                                  Link OAuth Provider
                                </h4>
                                <p className="text-sm text-yellow-700 mt-1">
                                  Link your account with a social provider for
                                  easier login.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {session?.user?.isLinked &&
                          session?.user?.isPasswordSet &&
                          session?.user?.isEmailVerified && (
                            <div className="p-3 bg-green-50 rounded-md border border-green-100">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-green-800">
                                    Account Fully Set Up
                                  </h4>
                                  <p className="text-sm text-green-700 mt-1">
                                    Your account is fully configured and secure.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Account Verification
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete these steps to secure your account
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {!session?.user?.isLinked && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <LinkIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        Link with OAuth Provider
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {session?.user && <OAuth />}
                      </div>
                    </div>
                  )}

                  {!session?.user?.isPasswordSet && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                        <Key className="h-5 w-5 text-indigo-500 mr-2" />
                        Create Password
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {session?.user?.email && <CreatePassword />}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <details className="bg-white shadow-sm rounded-lg mb-8 group">
                <summary className="px-4 py-5 sm:px-6 cursor-pointer focus:outline-none">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Debug Information
                    </h3>
                    <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Session Data
                    </h4>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs text-gray-800 max-h-96">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      API Response
                    </h4>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs text-gray-800 max-h-96">
                      {apiResponse}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
