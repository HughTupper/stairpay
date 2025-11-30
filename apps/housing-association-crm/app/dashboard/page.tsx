import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { Home, Users, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(routes.login);
  }

  const cookieStore = await cookies();
  const currentOrgId = cookieStore.get("current_organisation_id")?.value;

  if (!currentOrgId) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to StairProperty
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please select an organisation to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Home className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Properties
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
            <div className="text-sm">
              <a
                href={routes.dashboard.properties}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                View all properties
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Tenants
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
            <div className="text-sm">
              <a
                href={routes.dashboard.tenants}
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                View all tenants
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Applications
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">
                No pending applications
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
