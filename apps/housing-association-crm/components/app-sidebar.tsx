"use client";

import { Home, Building2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

type Organisation = {
  id: string;
  name: string;
  role: "admin" | "viewer";
};

type AppSidebarProps = {
  organisations: Organisation[];
  currentOrganisationId: string | null;
};

const navItems = [
  {
    title: "Dashboard",
    url: routes.dashboard.root,
    icon: Home,
  },
  {
    title: "Properties",
    url: routes.dashboard.properties,
    icon: Building2,
  },
  {
    title: "Tenants",
    url: routes.dashboard.tenants,
    icon: Users,
  },
];

export function AppSidebar({
  organisations,
  currentOrganisationId,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routes.dashboard.root}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">StairProperty</span>
                  <span className="truncate text-xs">Property Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          organisations={organisations}
          currentOrganisationId={currentOrganisationId}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
