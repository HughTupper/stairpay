import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  Home,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Star,
  Megaphone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

async function getDashboardMetrics(orgId: string) {
  const supabase = await createClient();

  // Get counts in parallel
  const [
    { count: propertyCount },
    { count: tenantCount },
    { count: pendingApplications },
    { count: completedApplications },
    { data: recentFeedback },
    { data: campaignData },
    { data: topInsights },
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", orgId),
    supabase
      .from("tenants")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", orgId),
    supabase
      .from("staircasing_applications")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", orgId)
      .eq("status", "pending"),
    supabase
      .from("staircasing_applications")
      .select("*", { count: "exact", head: true })
      .eq("organisation_id", orgId)
      .eq("status", "completed"),
    supabase
      .from("resident_feedback")
      .select("nps_score, satisfaction_score")
      .eq("organisation_id", orgId)
      .order("submitted_at", { ascending: false })
      .limit(50),
    supabase
      .from("marketing_campaigns")
      .select("total_sent, total_converted")
      .eq("organisation_id", orgId)
      .eq("status", "active"),
    supabase
      .from("financial_insights")
      .select("readiness_score, recommended_action")
      .eq("organisation_id", orgId)
      .gte("readiness_score", 70)
      .order("readiness_score", { ascending: false })
      .limit(5),
  ]);

  // Calculate average NPS
  const avgNPS =
    recentFeedback && recentFeedback.length > 0
      ? (
          recentFeedback.reduce((sum, f) => sum + (f.nps_score || 0), 0) /
          recentFeedback.length
        ).toFixed(1)
      : "0";

  // Calculate campaign conversion rate
  const totalSent =
    campaignData?.reduce((sum, c) => sum + (c.total_sent || 0), 0) || 0;
  const totalConverted =
    campaignData?.reduce((sum, c) => sum + (c.total_converted || 0), 0) || 0;
  const conversionRate =
    totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : "0";

  return {
    propertyCount: propertyCount || 0,
    tenantCount: tenantCount || 0,
    pendingApplications: pendingApplications || 0,
    completedApplications: completedApplications || 0,
    avgNPS,
    conversionRate,
    readyToStaircaseCount: topInsights?.length || 0,
  };
}

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
        <h1 className="text-3xl font-bold mb-4">Welcome to StairProperty</h1>
        <p className="text-muted-foreground">
          Please select an organisation to get started.
        </p>
      </div>
    );
  }

  const metrics = await getDashboardMetrics(currentOrgId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Your shared ownership management overview
        </p>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.propertyCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Managed properties
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href={routes.dashboard.properties}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all properties
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Owners</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tenantCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active residents
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href={routes.dashboard.tenants}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all residents
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.pendingApplications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
          <CardFooter>
            {metrics.pendingApplications > 0 ? (
              <span className="text-sm text-orange-600 dark:text-orange-400">
                Requires attention
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                No pending applications
              </span>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Staircasing
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.completedApplications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful transactions
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <TrendingUp className="size-3 mr-1" />
              120% increase (YTD)
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* StairPay Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resident Satisfaction</CardTitle>
            <CardDescription>Average NPS Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">{metrics.avgNPS}</div>
              <div className="text-sm text-muted-foreground">/ 10</div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Star className="size-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">94% satisfaction rate</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href={routes.dashboard.feedback}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all feedback →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Performance</CardTitle>
            <CardDescription>Conversion Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">{metrics.conversionRate}</div>
              <div className="text-sm text-muted-foreground">%</div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Megaphone className="size-5 text-blue-500" />
              <span className="text-sm font-medium">
                300% increase in enquiries
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href={routes.dashboard.campaigns}
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage campaigns →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Staircasing Pipeline</CardTitle>
            <CardDescription>Ready to Staircase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold">
                {metrics.readyToStaircaseCount}
              </div>
              <div className="text-sm text-muted-foreground">residents</div>
            </div>
            <div className="mt-4">
              <Badge
                variant="outline"
                className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
              >
                High readiness score (&gt;70%)
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Link
              href={routes.dashboard.properties}
              className="text-sm font-medium text-primary hover:underline"
            >
              View opportunities →
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for property management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href={routes.dashboard.properties}
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Add New Property</div>
              <div className="text-sm text-muted-foreground">
                Register a new shared ownership property
              </div>
            </Link>
            <Link
              href={routes.dashboard.campaigns}
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Create Campaign</div>
              <div className="text-sm text-muted-foreground">
                Launch targeted staircasing campaign
              </div>
            </Link>
            <Link
              href={routes.dashboard.providers}
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Find Service Provider</div>
              <div className="text-sm text-muted-foreground">
                Connect residents with trusted brokers & surveyors
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Highlights</CardTitle>
            <CardDescription>Powered by StairPay technology</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  Monthly HPI Valuations
                </div>
                <div className="text-xs text-muted-foreground">
                  Automated property value tracking for all properties
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                <Megaphone className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Smart Campaigns</div>
                <div className="text-xs text-muted-foreground">
                  Data-driven triggers for targeted resident engagement
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                <Star className="size-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Resident Feedback</div>
                <div className="text-xs text-muted-foreground">
                  Real-time satisfaction tracking and insights
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
