import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Auth0Button from "@/components/buttons/Auth0";
import GoogleButton from "@/components/buttons/GoogleButton";
import LoginButton from "@/components/buttons/LoginButton";
import LogoutButton from "@/components/buttons/LogoutButton";
import { ArrowRight, Github, Star, Code, CheckCircle } from "lucide-react";
import { Shield } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/protected");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/icons/next.svg"
                alt="Next.js Logo"
                width={80}
                height={24}
                // style={{ height: "auto", width: "auto" }}
                priority
              />
              <span className="text-sm font-medium text-gray-500">+</span>
              <Image
                src="/images/icons/nextAuth.png"
                alt="NextAuth.js Logo"
                width={30}
                height={30}
                priority
              />
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/vercel/next.js"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              {session ? <LogoutButton /> : <LoginButton auth={session} />}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
          <div className="absolute bg-[url('/images/icons/next.svg?height=500&width=1500')] bg-center opacity-5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Next.js 15</span>
                <span className="block text-indigo-600 mt-1">
                  with Auth.js Integration
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                A modern authentication solution for your Next.js applications.
                Secure, flexible, and easy to implement.
              </p>
            </div>

            <div className="mt-12 sm:mt-16">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-lg mx-auto">
                <div className="px-6 py-8">
                  <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
                    Sign in to get started
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      <GoogleButton />
                      <Auth0Button />
                    </div>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>
                    <a
                      href="/auth/signin"
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <span>Email and Password</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need for authentication
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                A complete authentication solution with multiple providers and
                secure session management.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      Multiple Auth Providers
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Support for Google, Auth0, and custom credentials
                    authentication.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Code className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      Next.js 15 App Router
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Built with the latest Next.js features and best practices.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Star className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      Database Integration
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Includes database adapter for persistent user sessions and
                    accounts.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      Secure by Default
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    Built with security best practices and regular updates.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-10">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Updates
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Changelog
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Stay up to date with the latest improvements and updates.
              </p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-3xl mx-auto">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      23-04-2025
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Latest
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="text-indigo-600 font-semibold">
                      Refactor
                    </span>{" "}
                    the entire authentication flow by removing the previous
                    GraphQL implementation and migrating to Prisma ORM for
                    better performance and maintainability. Introduced zod for
                    robust schema validation across models and input data.
                    Implemented a new authentication strategy using NextAuth,
                    supporting both credentials-based and OAuth login, with
                    proper session tracking and user linking in the database.
                    Added optional email confirmation logic (currently unused),
                    and significantly improved the UI/UX for a smoother user
                    experience. Also included various utility enhancements and
                    internal improvements for cleaner and more scalable code.
                  </p>
                </li>
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      21-04-2025
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Forked from{" "}
                    <a
                      href="https://github.com/weehongkoh/nextjs-app-router-authjs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      weehongkoh/nextjs-app-router-authjs
                    </a>{" "}
                  </p>
                </li>
              </ul>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all updates <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Vercel</span>
              <Image
                src="/images/icons/vercel.svg"
                alt="Vercel Logo"
                width={100}
                height={24}
                priority
              />
            </a>
            <a
              href="https://github.com/vercel/next.js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} Next.js + Auth.js. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
