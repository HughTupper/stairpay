import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Users } from "lucide-react";

export default async function TenantsPage() {
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
          Tenants
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please select an organisation to view tenants.
        </p>
      </div>
    );
  }

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*, properties(address, postcode)")
    .eq("organisation_id", currentOrgId)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Tenants
      </h1>

      {!tenants || tenants.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
            No tenants
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Run the seed script to add demo data.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Equity %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monthly Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {tenants.map((tenant) => {
                const monthlyTotal =
                  parseFloat(tenant.monthly_rent) +
                  parseFloat(tenant.monthly_mortgage) +
                  parseFloat(tenant.monthly_service_charge);

                return (
                  <tr key={tenant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {tenant.first_name} {tenant.last_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {tenant.properties?.address}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tenant.properties?.postcode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {tenant.current_equity_percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      £{monthlyTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={routes.dashboard.tenant(tenant.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
