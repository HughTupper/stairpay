import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { HomeIcon, BarChart3, Lock } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect(routes.dashboard.root);
  }

  // If not logged in, show landing page

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            StairProperty
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Modern property management for shared ownership housing associations
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Manage properties, track tenant equity, and streamline staircasing
            applications with our multi-tenant platform built for UK housing
            associations.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <a
              href={routes.signup}
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Get Started
            </a>
            <a
              href={routes.login}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign In
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <HomeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Property Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track all shared ownership properties with valuations and tenant
                details
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Equity Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor tenant equity percentages and staircasing progress
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Multi-Tenant Security
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade data isolation with role-based access control
              </p>
            </div>
          </div>

          <div className="mt-16 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Technical Demo:</strong> Built with Next.js 15, Supabase,
              Tailwind CSS, and deployed on AWS Amplify. Features multi-tenant
              architecture with Row Level Security, Server Actions, and
              optimistic UI updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
