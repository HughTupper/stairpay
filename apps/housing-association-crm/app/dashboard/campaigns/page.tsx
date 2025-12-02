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
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import {
  Megaphone,
  Users,
  Mail,
  MousePointer,
  CheckCircle,
} from "lucide-react";

async function getCampaigns(orgId: string) {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("marketing_campaigns")
    .select(
      `
      id,
      name,
      description,
      status,
      start_date,
      end_date,
      total_sent,
      total_opened,
      total_clicked,
      total_converted,
      campaign_triggers (
        id,
        trigger_type,
        trigger_conditions,
        is_active
      )
    `
    )
    .eq("organisation_id", orgId)
    .order("start_date", { ascending: false });

  return campaigns;
}

export default async function CampaignsPage() {
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
        <h1 className="text-3xl font-bold mb-4">Marketing Campaigns</h1>
        <p className="text-muted-foreground">
          Please select an organisation to view campaigns.
        </p>
      </div>
    );
  }

  const campaigns = await getCampaigns(currentOrgId);

  // Calculate overall metrics
  const totalSent =
    campaigns?.reduce((sum, c) => sum + (c.total_sent || 0), 0) || 0;
  const totalConverted =
    campaigns?.reduce((sum, c) => sum + (c.total_converted || 0), 0) || 0;
  const overallConversionRate =
    totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
        <p className="text-muted-foreground mt-2">
          Targeted resident engagement to drive staircasing transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Megaphone className="size-4" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns?.filter((c) => c.status === "active").length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="size-4" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Emails delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="size-4" />
              Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConverted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Staircasing applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate}%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +300% from baseline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Detailed metrics for all marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!campaigns || campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No campaigns yet. Run the seed script to populate demo data.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead>Clicked</TableHead>
                  <TableHead>Converted</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const openRate = campaign.total_sent
                    ? (
                        (campaign.total_opened / campaign.total_sent) *
                        100
                      ).toFixed(1)
                    : "0";
                  const clickRate = campaign.total_sent
                    ? (
                        (campaign.total_clicked / campaign.total_sent) *
                        100
                      ).toFixed(1)
                    : "0";
                  const conversionRate = campaign.total_sent
                    ? (
                        (campaign.total_converted / campaign.total_sent) *
                        100
                      ).toFixed(1)
                    : "0";

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            campaign.status === "active"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                              : ""
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.total_sent}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {campaign.total_opened}
                          <span className="text-xs text-muted-foreground">
                            ({openRate}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {campaign.total_clicked}
                          <span className="text-xs text-muted-foreground">
                            ({clickRate}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {campaign.total_converted}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            parseFloat(conversionRate) >= 10
                              ? "default"
                              : "outline"
                          }
                          className={
                            parseFloat(conversionRate) >= 10
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                              : ""
                          }
                        >
                          {conversionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Campaign Triggers & Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Triggers</CardTitle>
            <CardDescription>
              Automated rules that initiate campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaigns?.map((campaign) => {
              const triggers = campaign.campaign_triggers || [];
              return triggers.map((trigger) => (
                <div
                  key={trigger.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{campaign.name}</div>
                    <Badge
                      variant={trigger.is_active ? "default" : "secondary"}
                    >
                      {trigger.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Trigger:</span>{" "}
                    {trigger.trigger_type.replace(/_/g, " ")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Conditions:{" "}
                    {JSON.stringify(trigger.trigger_conditions).substring(
                      0,
                      100
                    )}
                  </div>
                </div>
              ));
            })}
            {(!campaigns ||
              campaigns.every(
                (c) => !c.campaign_triggers || c.campaign_triggers.length === 0
              )) && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No triggers configured yet
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Best Practices</CardTitle>
            <CardDescription>
              Proven strategies from StairPay platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <div className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Users className="size-4" />
                Equity Threshold Campaigns
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Target residents who reach 50% equity - they&apos;re most likely
                to consider full staircasing. Average conversion: 16%.
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950 p-4">
              <div className="font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <MousePointer className="size-4" />
                Anniversary Timing
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                Contact residents on move-in anniversaries when they&apos;re
                reflecting on their journey. Engagement rates 2x higher.
              </div>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
              <div className="font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
                <CheckCircle className="size-4" />
                Value Increase Alerts
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                Notify residents when property values rise significantly (5%+).
                Creates urgency and demonstrates ROI potential.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
