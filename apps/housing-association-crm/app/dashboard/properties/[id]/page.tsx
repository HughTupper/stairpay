import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { ValuationChart } from "@/components/valuation-chart";

async function getPropertyDetails(propertyId: string, orgId: string) {
  const supabase = await createClient();

  // Get property with valuations and tenant
  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      id,
      address,
      postcode,
      property_value,
      created_at,
      property_valuations (
        id,
        valuation_date,
        estimated_value,
        value_change_percent,
        hpi_index
      ),
      tenants (
        id,
        first_name,
        last_name,
        email,
        phone,
        move_in_date,
        current_equity_percentage,
        monthly_rent,
        monthly_mortgage,
        monthly_service_charge
      )
    `
    )
    .eq("id", propertyId)
    .eq("organisation_id", orgId)
    .single();

  if (error || !property) {
    return null;
  }

  return property;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    redirect(routes.dashboard.properties);
  }

  const { id } = await params;
  const property = await getPropertyDetails(id, currentOrgId);

  if (!property) {
    notFound();
  }

  const valuations = (property.property_valuations as any[]) || [];
  const sortedValuations = valuations.sort(
    (a, b) =>
      new Date(a.valuation_date).getTime() -
      new Date(b.valuation_date).getTime()
  );

  const latestValuation = sortedValuations[sortedValuations.length - 1];
  const oldestValuation = sortedValuations[0];

  const currentValue =
    latestValuation?.estimated_value || property.property_value;
  const monthlyChange = latestValuation?.value_change_percent || 0;

  const yearlyChange = oldestValuation
    ? (
        ((latestValuation?.estimated_value - oldestValuation.estimated_value) /
          oldestValuation.estimated_value) *
        100
      ).toFixed(2)
    : "0";

  // Prepare chart data (last 12 months)
  const chartData = sortedValuations.slice(-12).map((val) => ({
    date: new Date(val.valuation_date).toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    }),
    value: parseFloat(val.estimated_value),
  }));

  const tenant = (property.tenants as any[])?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href={routes.dashboard.properties}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{property.address}</h1>
        <p className="text-muted-foreground mt-2">{property.postcode}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
            <CardDescription>Basic property details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Address</span>
              <span className="font-medium">{property.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Postcode</span>
              <span className="font-medium">{property.postcode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Original Value
              </span>
              <span className="font-medium">
                £
                {parseFloat(property.property_value).toLocaleString("en-GB", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Added</span>
              <span className="font-medium">
                {new Date(property.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Current Valuation */}
        <Card>
          <CardHeader>
            <CardTitle>Current Valuation</CardTitle>
            <CardDescription>Latest HPI-based estimate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Current Value
              </span>
              <span className="text-2xl font-bold">
                £
                {parseFloat(currentValue).toLocaleString("en-GB", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Monthly Change
              </span>
              <div className="flex items-center gap-2">
                {parseFloat(monthlyChange) >= 0 ? (
                  <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={
                    parseFloat(monthlyChange) >= 0
                      ? "font-medium text-green-600 dark:text-green-400"
                      : "font-medium text-red-600 dark:text-red-400"
                  }
                >
                  {monthlyChange}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                12-Month Growth
              </span>
              <Badge
                variant={
                  parseFloat(yearlyChange) >= 5 ? "default" : "secondary"
                }
                className={
                  parseFloat(yearlyChange) >= 5
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : ""
                }
              >
                +{yearlyChange}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <span className="font-medium">
                {latestValuation
                  ? new Date(latestValuation.valuation_date).toLocaleDateString(
                      "en-GB"
                    )
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valuation History Chart */}
      {chartData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>12-Month Valuation History</CardTitle>
            <CardDescription>
              HPI-based property value trend over the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ValuationChart data={chartData} />
          </CardContent>
        </Card>
      )}

      {/* Tenant Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
          <CardDescription>Current resident details</CardDescription>
        </CardHeader>
        <CardContent>
          {tenant ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name</span>
                <Link
                  href={routes.dashboard.tenant(tenant.id)}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {tenant.first_name} {tenant.last_name}
                </Link>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </span>
                <span className="font-medium">{tenant.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone
                </span>
                <span className="font-medium">{tenant.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Move In Date
                </span>
                <span className="font-medium">
                  {new Date(tenant.move_in_date).toLocaleDateString("en-GB")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Equity Ownership
                </span>
                <Badge>{tenant.current_equity_percentage}%</Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No tenant assigned to this property
              </p>
              <Button variant="outline" disabled>
                Add Tenant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
