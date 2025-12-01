import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
    redirect(routes.login);
  }

  const cookieStore = await cookies();
  const currentOrgId = cookieStore.get("current_organisation_id")?.value;

  if (!currentOrgId) {
    redirect(routes.dashboard.root);
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
        <Button variant="link" asChild className="p-0">
          <Link href={routes.dashboard.tenants}>← Back to Tenants</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenant Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {tenant.first_name} {tenant.last_name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{tenant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{tenant.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="text-sm font-medium">
                    {tenant.properties.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tenant.properties.postcode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Move-in Date</p>
                  <p className="text-sm font-medium">
                    {new Date(tenant.move_in_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equity Ownership */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Ownership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge>Current Ownership</Badge>
                  <span className="text-2xl font-bold text-primary">
                    {tenant.current_equity_percentage}%
                  </span>
                </div>
                <Progress value={tenant.current_equity_percentage} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Share</p>
                    <p className="text-lg font-semibold">
                      £
                      {(
                        (tenant.current_equity_percentage / 100) *
                        tenant.properties.property_value
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Remaining to Own
                    </p>
                    <p className="text-lg font-semibold">
                      £
                      {(
                        ((100 - tenant.current_equity_percentage) / 100) *
                        tenant.properties.property_value
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Payments Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rent</span>
                  <span className="text-sm font-semibold">
                    £{parseFloat(tenant.monthly_rent).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Mortgage
                  </span>
                  <span className="text-sm font-semibold">
                    £{parseFloat(tenant.monthly_mortgage).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Service Charge
                  </span>
                  <span className="text-sm font-semibold">
                    £{parseFloat(tenant.monthly_service_charge).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-3">
                  <span className="text-base font-semibold">
                    Total Monthly
                  </span>
                  <span className="text-lg font-bold text-primary">
                    £{monthlyTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staircasing Applications */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Staircasing History</CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No staircasing applications yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border-l-4 border-primary pl-4 py-2"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold">
                          +{app.equity_percentage_requested}% Equity
                        </span>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied{" "}
                        {new Date(app.application_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        £{parseFloat(app.estimated_cost).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    pending: "secondary" as const,
    approved: "default" as const,
    completed: "default" as const,
    rejected: "destructive" as const,
  };

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
