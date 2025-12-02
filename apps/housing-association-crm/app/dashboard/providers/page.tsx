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
import { Badge } from "@/components/ui/badge";
import { Briefcase, Star, Mail, Phone, Globe, TrendingUp } from "lucide-react";

async function getServiceProviders(orgId: string) {
  const supabase = await createClient();

  const { data: providers } = await supabase
    .from("service_providers")
    .select("*")
    .eq("organisation_id", orgId)
    .order("is_preferred", { ascending: false })
    .order("average_rating", { ascending: false });

  // Group by provider type
  const grouped = providers?.reduce((acc, provider) => {
    if (!acc[provider.provider_type]) {
      acc[provider.provider_type] = [];
    }
    acc[provider.provider_type].push(provider);
    return acc;
  }, {} as Record<string, any[]>);

  return { providers, grouped };
}

const providerTypeLabels: Record<string, string> = {
  broker: "Mortgage Brokers",
  surveyor: "Surveyors",
  valuer: "Valuers",
  conveyancer: "Conveyancers",
  solicitor: "Solicitors",
};

const providerTypeIcons: Record<string, string> = {
  broker: "💰",
  surveyor: "🏗️",
  valuer: "📊",
  conveyancer: "📝",
  solicitor: "⚖️",
};

export default async function ProvidersPage() {
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
        <h1 className="text-3xl font-bold mb-4">Service Providers</h1>
        <p className="text-muted-foreground">
          Please select an organisation to view service providers.
        </p>
      </div>
    );
  }

  const { providers, grouped } = await getServiceProviders(currentOrgId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Service Provider Directory</h1>
        <p className="text-muted-foreground mt-2">
          Trusted brokers, surveyors, and conveyancers for your residents
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="size-4" />
              Total Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vetted professionals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="size-4" />
              Preferred Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers?.filter((p) => p.is_preferred).length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Top-rated providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {providers && providers.length > 0
                ? (
                    providers.reduce(
                      (sum, p) => sum + (p.average_rating || 0),
                      0
                    ) / providers.length
                  ).toFixed(1)
                : "0"}
              <Star className="size-5 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers?.reduce(
                (sum, p) => sum + (p.total_referrals || 0),
                0
              ) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Providers by Type */}
      {!providers || providers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="mx-auto size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No service providers yet. Run the seed script to populate data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped &&
            (Object.entries(grouped) as [string, any[]][]).map(
              ([type, typeProviders]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">
                      {providerTypeIcons[type] || "📋"}
                    </span>
                    <h2 className="text-2xl font-bold">
                      {providerTypeLabels[type] || type}
                    </h2>
                    <Badge variant="secondary" className="ml-2">
                      {typeProviders.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {typeProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className={
                          provider.is_preferred
                            ? "border-primary shadow-md"
                            : ""
                        }
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {provider.company_name}
                              </CardTitle>
                              <CardDescription>
                                {provider.contact_name}
                              </CardDescription>
                            </div>
                            {provider.is_preferred && (
                              <Badge className="bg-primary">
                                <Star className="size-3 mr-1 fill-current" />
                                Preferred
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Contact Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="size-4 text-muted-foreground" />
                              <a
                                href={`mailto:${provider.email}`}
                                className="text-primary hover:underline truncate"
                              >
                                {provider.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="size-4 text-muted-foreground" />
                              <a
                                href={`tel:${provider.phone}`}
                                className="hover:underline"
                              >
                                {provider.phone}
                              </a>
                            </div>
                            {provider.website && (
                              <div className="flex items-center gap-2 text-sm">
                                <Globe className="size-4 text-muted-foreground" />
                                <a
                                  href={provider.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline truncate"
                                >
                                  Visit website
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Specializations */}
                          {provider.specializations &&
                            provider.specializations.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-muted-foreground mb-2">
                                  Specializations
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {provider.specializations.map(
                                    (spec: string) => (
                                      <Badge key={spec} variant="outline">
                                        {spec}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Rating & Referrals */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-1">
                              <Star className="size-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold">
                                {provider.average_rating?.toFixed(1) || "N/A"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {provider.total_referrals || 0} referrals
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why Use Our Directory?</CardTitle>
            <CardDescription>
              Benefits of our vetted service provider network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                Pre-Vetted Professionals
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                All providers are thoroughly vetted for quality, reliability,
                and shared ownership expertise.
              </div>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
              <div className="font-medium text-green-900 dark:text-green-100">
                Transparent Pricing
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                Competitive rates with no hidden fees. Residents know exactly
                what to expect.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">For Residents</CardTitle>
            <CardDescription>
              How to connect with service providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2 mt-0.5">
                <TrendingUp className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm">1. Browse Directory</div>
                <div className="text-xs text-muted-foreground">
                  Review providers by type and specialization
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-2 mt-0.5">
                <Phone className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="font-medium text-sm">2. Make Contact</div>
                <div className="text-xs text-muted-foreground">
                  Reach out directly via email or phone
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-0.5">
                <Star className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm">3. Share Feedback</div>
                <div className="text-xs text-muted-foreground">
                  Help others by rating your experience
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
