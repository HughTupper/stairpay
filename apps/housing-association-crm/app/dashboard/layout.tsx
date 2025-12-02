import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { AppSidebar } from "@/app/dashboard/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/Sidebar";
import { Separator } from "@/components/ui/Separator";

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
    <SidebarProvider>
      <AppSidebar
        organisations={organisations}
        currentOrganisationId={currentOrganisationId}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
