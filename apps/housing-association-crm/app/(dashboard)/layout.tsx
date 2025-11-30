import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { OrganisationSwitcher } from "@/components/organisation-switcher";
import { signOut } from "@/actions/auth";

async function getUserOrganisations() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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

  // If no current org is set but user has orgs, set the first one
  if (!currentOrganisationId && organisations.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set("current_organisation_id", organisations[0].id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  StairProperty
                </h1>
              </div>
              <div className="hidden md:flex md:gap-4">
                <a
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Dashboard
                </a>
                <a
                  href="/properties"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Properties
                </a>
                <a
                  href="/tenants"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Tenants
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OrganisationSwitcher
                organisations={organisations}
                currentOrganisationId={currentOrganisationId}
              />
              <ThemeToggle />
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
