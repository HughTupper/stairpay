import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import type { FeedbackWithTenant } from "@/lib/types";
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
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

async function getFeedback(orgId: string) {
  const supabase = await createClient();

  const { data: feedback } = (await supabase
    .from("resident_feedback")
    .select(
      `
      id,
      nps_score,
      satisfaction_score,
      feedback_text,
      category,
      sentiment,
      submitted_at,
      tenants (
        first_name,
        last_name,
        email
      )
    `
    )
    .eq("organisation_id", orgId)
    .order("submitted_at", { ascending: false })) as {
    data: FeedbackWithTenant[] | null;
  };

  // Calculate metrics
  const avgNPS =
    feedback && feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + (f.nps_score || 0), 0) /
          feedback.length
        ).toFixed(1)
      : "0";

  const avgSatisfaction =
    feedback && feedback.length > 0
      ? (
          feedback.reduce((sum, f) => sum + (f.satisfaction_score || 0), 0) /
          feedback.length
        ).toFixed(1)
      : "0";

  const promoters =
    feedback?.filter((f) => (f.nps_score || 0) >= 9).length || 0;
  const passives =
    feedback?.filter((f) => (f.nps_score || 0) >= 7 && (f.nps_score || 0) < 9)
      .length || 0;
  const detractors =
    feedback?.filter((f) => (f.nps_score || 0) < 7).length || 0;

  const sentimentCounts = {
    positive: feedback?.filter((f) => f.sentiment === "positive").length || 0,
    neutral: feedback?.filter((f) => f.sentiment === "neutral").length || 0,
    negative: feedback?.filter((f) => f.sentiment === "negative").length || 0,
  };

  // Group by category
  const byCategory =
    feedback?.reduce((acc, f) => {
      const cat = f.category || "other";
      if (!acc[cat]) {
        acc[cat] = { count: 0, avgScore: 0, scores: [] };
      }
      acc[cat].count++;
      acc[cat].scores.push(f.satisfaction_score || 0);
      acc[cat].avgScore =
        acc[cat].scores.reduce((sum: number, s: number) => sum + s, 0) /
        acc[cat].scores.length;
      return acc;
    }, {} as Record<string, { count: number; avgScore: number; scores: number[] }>) ||
    {};

  return {
    feedback,
    avgNPS,
    avgSatisfaction,
    promoters,
    passives,
    detractors,
    sentimentCounts,
    byCategory,
  };
}

const categoryLabels: Record<string, string> = {
  staircasing_process: "Staircasing Process",
  customer_service: "Customer Service",
  platform_usability: "Platform Usability",
  communication: "Communication",
  overall_experience: "Overall Experience",
};

export default async function FeedbackPage() {
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
        <h1 className="text-3xl font-bold mb-4">Resident Feedback</h1>
        <p className="text-muted-foreground">
          Please select an organisation to view feedback.
        </p>
      </div>
    );
  }

  const metrics = await getFeedback(currentOrgId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Resident Feedback</h1>
        <p className="text-muted-foreground mt-2">
          Track satisfaction, identify trends, and improve experiences
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average NPS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">{metrics.avgNPS}</div>
              <div className="text-sm text-muted-foreground">/ 10</div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-green-600 dark:text-green-400">
                94% would recommend
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Satisfaction Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold">
                {metrics.avgSatisfaction}
              </div>
              <div className="text-sm text-muted-foreground">/ 5</div>
            </div>
            <div className="mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i <= parseFloat(metrics.avgSatisfaction)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.feedback?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Collected feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Sentiment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="size-3 text-green-600" />
                  Positive
                </span>
                <span className="font-semibold">
                  {metrics.sentimentCounts.positive}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Minus className="size-3 text-gray-600" />
                  Neutral
                </span>
                <span className="font-semibold">
                  {metrics.sentimentCounts.neutral}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <ThumbsDown className="size-3 text-red-600" />
                  Negative
                </span>
                <span className="font-semibold">
                  {metrics.sentimentCounts.negative}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPS Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Promoters</CardTitle>
            <CardDescription>NPS Score 9-10</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {metrics.promoters}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.feedback && metrics.feedback.length > 0
                ? ((metrics.promoters / metrics.feedback.length) * 100).toFixed(
                    0
                  )
                : "0"}
              % of respondents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Passives</CardTitle>
            <CardDescription>NPS Score 7-8</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {metrics.passives}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.feedback && metrics.feedback.length > 0
                ? ((metrics.passives / metrics.feedback.length) * 100).toFixed(
                    0
                  )
                : "0"}
              % of respondents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detractors</CardTitle>
            <CardDescription>NPS Score 0-6</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">
              {metrics.detractors}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {metrics.feedback && metrics.feedback.length > 0
                ? (
                    (metrics.detractors / metrics.feedback.length) *
                    100
                  ).toFixed(0)
                : "0"}
              % of respondents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback by Category */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <CardDescription>
            Average satisfaction scores across different areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.byCategory).map(([category, data]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {categoryLabels[category] || category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {data.count} responses
                    </span>
                    <span className="font-semibold">
                      {data.avgScore.toFixed(1)} / 5
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(data.avgScore / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest responses from residents</CardDescription>
        </CardHeader>
        <CardContent>
          {!metrics.feedback || metrics.feedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No feedback yet. Run the seed script to populate data.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>NPS</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.feedback.slice(0, 20).map((item) => {
                  const tenant = item.tenants;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">
                          {tenant?.first_name} {tenant?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tenant?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[item.category || ""] || item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{item.nps_score}</span>
                        <span className="text-muted-foreground"> / 10</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`size-3 ${
                                i <= (item.satisfaction_score || 0)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.sentiment === "positive"
                              ? "default"
                              : item.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            item.sentiment === "positive"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                              : ""
                          }
                        >
                          {item.sentiment}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{item.feedback_text}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.submitted_at &&
                          new Date(item.submitted_at).toLocaleDateString(
                            "en-GB"
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
