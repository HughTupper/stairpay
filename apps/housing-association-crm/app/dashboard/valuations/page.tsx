import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

async function getValuations(orgId: string) {
  const supabase = await createClient();

  // Get latest valuation for each property
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

  return properties?.map((property) => {
    const valuations = (property.property_valuations as any[]) || [];
    const sortedValuations = valuations.sort(
      (a, b) =>
        new Date(b.valuation_date).getTime() -
        new Date(a.valuation_date).getTime()
    );
    const latestValuation = sortedValuations[0];
    const previousValuation = sortedValuations[1];

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
      currentValue: latestValuation?.estimated_value || property.property_value,
      valuationDate: latestValuation?.valuation_date,
      monthlyChange: latestValuation?.value_change_percent || 0,
      yearlyChange: yearChange,
      hpiIndex: latestValuation?.hpi_index,
      valuationHistory: sortedValuations,
    };
  });
}

export default async function ValuationsPage() {
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
        <h1 className="text-3xl font-bold mb-4">Property Valuations</h1>
        <p className="text-muted-foreground">
          Please select an organisation to view valuations.
        </p>
      </div>
    );
  }

  const valuations = await getValuations(currentOrgId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Valuations</h1>
        <p className="text-muted-foreground mt-2">
          Monthly HPI-based property value tracking
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £
              {valuations
                ?.reduce((sum, v) => sum + parseFloat(v.currentValue), 0)
                .toLocaleString("en-GB", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {valuations?.length} properties
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
              {valuations && valuations.length > 0
                ? (
                    valuations.reduce(
                      (sum, v) => sum + parseFloat(v.currentValue),
                      0
                    ) / valuations.length
                  ).toLocaleString("en-GB", { maximumFractionDigits: 0 })
                : "0"}
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
              {valuations && valuations.length > 0
                ? (
                    valuations.reduce(
                      (sum, v) => sum + parseFloat(v.yearlyChange),
                      0
                    ) / valuations.length
                  ).toFixed(2)
                : "0"}
              %
              <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Positive market trend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Valuations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Valuations</CardTitle>
          <CardDescription>
            Latest HPI valuations and price trends for all properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!valuations || valuations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No valuations available. Run the seed script to populate data.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Original Value</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Monthly Change</TableHead>
                  <TableHead>12-Month Change</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valuations.map((valuation) => (
                  <TableRow key={valuation.id}>
                    <TableCell>
                      <div className="font-medium">{valuation.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {valuation.postcode}
                      </div>
                    </TableCell>
                    <TableCell>
                      £
                      {parseFloat(valuation.originalValue).toLocaleString(
                        "en-GB",
                        { maximumFractionDigits: 0 }
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      £
                      {parseFloat(valuation.currentValue).toLocaleString(
                        "en-GB",
                        { maximumFractionDigits: 0 }
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {parseFloat(valuation.monthlyChange) >= 0 ? (
                          <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                        )}
                        <span
                          className={
                            parseFloat(valuation.monthlyChange) >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {valuation.monthlyChange}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parseFloat(valuation.yearlyChange) >= 5
                            ? "default"
                            : "secondary"
                        }
                        className={
                          parseFloat(valuation.yearlyChange) >= 5
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                            : ""
                        }
                      >
                        +{valuation.yearlyChange}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {valuation.valuationDate
                        ? new Date(valuation.valuationDate).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Market Insights</CardTitle>
            <CardDescription>
              How property values are affecting staircasing opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
              <div className="font-medium text-green-900 dark:text-green-100">
                Strong Growth Period
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                Average 8% annual growth presents good staircasing opportunities
                for residents who purchased equity earlier.
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                HPI Methodology
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Valuations use House Price Index data updated monthly, providing
                accurate market-based estimates without survey costs.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended Actions</CardTitle>
            <CardDescription>Opportunities to engage residents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 mt-0.5">
                <TrendingUp className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  Target High-Growth Properties
                </div>
                <div className="text-xs text-muted-foreground">
                  Create campaigns for residents in properties showing &gt;7%
                  annual growth
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-2 mt-0.5">
                <TrendingUp className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  Share Value Increase Alerts
                </div>
                <div className="text-xs text-muted-foreground">
                  Notify residents when their property value increases
                  significantly
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
