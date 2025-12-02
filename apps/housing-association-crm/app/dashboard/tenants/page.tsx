import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { TenantWithProperty } from "@/lib/types";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

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
        <h1 className="text-3xl font-bold mb-4">Tenants</h1>
        <p className="text-muted-foreground">
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

  // Type assertion for joined query
  const typedTenants = tenants as TenantWithProperty[] | null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Tenants</h1>

      {!typedTenants || typedTenants.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No tenants</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Run the seed script to add demo data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Equity %</TableHead>
                <TableHead>Monthly Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typedTenants.map((tenant) => {
                const monthlyTotal =
                  tenant.monthly_rent +
                  tenant.monthly_mortgage +
                  tenant.monthly_service_charge;

                return (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <Link
                        href={routes.dashboard.tenant(tenant.id)}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {tenant.first_name} {tenant.last_name}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {tenant.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{tenant.properties?.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {tenant.properties?.postcode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {tenant.current_equity_percentage}%
                      </span>
                    </TableCell>
                    <TableCell>£{monthlyTotal.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
