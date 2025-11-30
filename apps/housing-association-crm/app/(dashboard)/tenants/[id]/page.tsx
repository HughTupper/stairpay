import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TenantDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const currentOrgId = cookieStore.get("current_organisation_id")?.value;

  if (!currentOrgId) {
    redirect("/dashboard");
  }

  // Fetch tenant details
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*, properties(id, address, postcode, property_value)")
    .eq("id", id)
    .eq("organisation_id", currentOrgId)
    .single();

  if (!tenant) {
    notFound();
  }

  // Fetch staircasing applications
  const { data: applications } = await supabase
    .from("staircasing_applications")
    .select("*")
    .eq("tenant_id", id)
    .order("application_date", { ascending: false });

  const monthlyTotal =
    parseFloat(tenant.monthly_rent) +
    parseFloat(tenant.monthly_mortgage) +
    parseFloat(tenant.monthly_service_charge);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a
          href="/dashboard/tenants"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Tenants
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {tenant.first_name} {tenant.last_name}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tenant.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tenant.phone || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Property
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tenant.properties.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tenant.properties.postcode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Move-in Date
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(tenant.move_in_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Equity Ownership */}
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Equity Ownership
            </h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-900">
                    Current Ownership
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {tenant.current_equity_percentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${tenant.current_equity_percentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                ></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your Share
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  £
                  {(
                    (tenant.current_equity_percentage / 100) *
                    tenant.properties.property_value
                  ).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remaining to Own
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  £
                  {(
                    ((100 - tenant.current_equity_percentage) / 100) *
                    tenant.properties.property_value
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Payments Breakdown */}
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Payments
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Rent
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  £{parseFloat(tenant.monthly_rent).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Mortgage
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  £{parseFloat(tenant.monthly_mortgage).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Service Charge
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  £{parseFloat(tenant.monthly_service_charge).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  Total Monthly
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  £{monthlyTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Staircasing Applications */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Staircasing History
            </h3>
            {!applications || applications.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No staircasing applications yet.
              </p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        +{app.equity_percentage_requested}% Equity
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Applied{" "}
                      {new Date(app.application_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      £{parseFloat(app.estimated_cost).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
    approved:
      "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
    completed:
      "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
    rejected: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        colors[status as keyof typeof colors] || colors.pending
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
