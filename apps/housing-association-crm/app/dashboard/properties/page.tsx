import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PropertyForm } from "@/app/dashboard/properties/_components/property-form";
import { routes } from "@/lib/routes";
import type { PropertyWithValuationSummary } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

async function getPropertiesWithValuations(
  orgId: string
): Promise<PropertyWithValuationSummary[]> {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select(
      `
      id,
      address,
      postcode,
      property_value,
      property_valuations (
        id,
        valuation_date,
        estimated_value,
        value_change_percent,
        hpi_index
      )
    `
    )
    .eq("organisation_id", orgId)
    .order("address");

  return (
    properties?.map((property): PropertyWithValuationSummary => {
      const valuations = property.property_valuations || [];
      const sortedValuations = valuations.sort(
        (a, b) =>
          new Date(b.valuation_date).getTime() -
          new Date(a.valuation_date).getTime()
      );
      const latestValuation = sortedValuations[0];

      // Calculate 12-month trend
      const oldestValuation = valuations.sort(
        (a, b) =>
          new Date(a.valuation_date).getTime() -
          new Date(b.valuation_date).getTime()
      )[0];
      const yearChange = oldestValuation
        ? (
            ((latestValuation?.estimated_value -
              oldestValuation.estimated_value) /
              oldestValuation.estimated_value) *
            100
          ).toFixed(2)
        : "0";

      return {
        id: property.id,
        address: property.address,
        postcode: property.postcode,
        originalValue: property.property_value,
        currentValue:
          latestValuation?.estimated_value || property.property_value,
        valuationDate: latestValuation?.valuation_date ?? null,
        monthlyChange: latestValuation?.value_change_percent || 0,
        yearlyChange: yearChange,
      };
    }) ?? []
  );
}

function PropertiesLoading() {
  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    </div>
  );
}

async function PropertiesContent({ orgId }: { orgId: string }) {
  const properties = await getPropertiesWithValuations(orgId);

  if (!properties || properties.length === 0) {
    return (
      <div className="mt-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              No properties found. Add your first property to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const averageValue = totalValue / properties.length;
  const averageGrowth =
    properties.reduce((sum, p) => sum + parseFloat(p.yearlyChange), 0) /
    properties.length;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £
              {totalValue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {properties.length} properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Average Property Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £
              {averageValue.toLocaleString("en-GB", {
                maximumFractionDigits: 0,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on latest HPI data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Average 12-Month Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {averageGrowth.toFixed(2)}%
              {averageGrowth >= 0 ? (
                <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="size-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {averageGrowth >= 0 ? "Positive" : "Negative"} market trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table */}
      <Card className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Monthly Change</TableHead>
              <TableHead>12-Month Growth</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Link
                    href={routes.dashboard.property(property.id)}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {property.address}
                  </Link>
                  <div className="text-sm text-muted-foreground">
                    {property.postcode}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  £
                  {property.currentValue.toLocaleString("en-GB", {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {property.monthlyChange >= 0 ? (
                      <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                    )}
                    <span
                      className={
                        property.monthlyChange >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {property.monthlyChange}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      parseFloat(property.yearlyChange) >= 5
                        ? "default"
                        : "secondary"
                    }
                    className={
                      parseFloat(property.yearlyChange) >= 5
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                        : ""
                    }
                  >
                    +{property.yearlyChange}%
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {property.valuationDate
                    ? new Date(property.valuationDate).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default async function PropertiesPage() {
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
          Properties
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Please select an organisation to view properties.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Properties
          </h1>
          <p className="text-muted-foreground mt-2">
            Portfolio overview and property valuations
          </p>
        </div>
        <PropertyForm />
      </div>

      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesContent orgId={currentOrgId} />
      </Suspense>
    </div>
  );
}
