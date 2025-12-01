import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { OrganisationSwitcher } from "@/components/organisation-switcher";
import { signOut } from "@/actions/auth";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getUserOrganisations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(routes.login);
  }

  const { data: orgs, error } = await supabase
    .from("user_organisations")
    .select("organisation_id, role, organisations!inner(id, name)")
    .eq("user_id", user.id);

  if (error || !orgs) {
    return [];
  }

  return orgs.map((org) => ({
    // @ts-expect-error - Supabase types are complex with joins
    id: org.organisations.id,
    // @ts-expect-error - Supabase types are complex with joins
    name: org.organisations.name,
    role: org.role as "admin" | "viewer",
  }));
}

async function getCurrentOrganisationId() {
  const cookieStore = await cookies();
  return cookieStore.get("current_organisation_id")?.value || null;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organisations = await getUserOrganisations();
  const currentOrganisationId = await getCurrentOrganisationId();

  // If no current org is set but user has orgs, redirect to set it via API route
  if (!currentOrganisationId && organisations.length > 0) {
    redirect(
      `${routes.api.organisationSwitch}?organisationId=${organisations[0].id}&returnUrl=${routes.dashboard.root}`
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold">StairProperty</h1>
              </div>
              <div className="hidden md:flex md:gap-2">
                <Button variant="ghost" asChild>
                  <Link href={routes.dashboard.root}>Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={routes.dashboard.properties}>Properties</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href={routes.dashboard.tenants}>Tenants</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OrganisationSwitcher
                organisations={organisations}
                currentOrganisationId={currentOrganisationId}
              />
              <ThemeToggle />
              <form action={signOut}>
                <Button type="submit" variant="ghost">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
