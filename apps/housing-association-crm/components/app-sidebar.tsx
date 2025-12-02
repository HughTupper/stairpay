"use client";

import {
  Home,
  Building2,
  Users,
  Megaphone,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/Sidebar";
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

const coreNavItems = [
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

const stairpayFeatures = [
  {
    title: "Campaigns",
    url: routes.dashboard.campaigns,
    icon: Megaphone,
  },
  {
    title: "Service Providers",
    url: routes.dashboard.providers,
    icon: Briefcase,
  },
  {
    title: "Feedback",
    url: routes.dashboard.feedback,
    icon: MessageSquare,
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white dark:bg-gray-900 p-1">
                  <Image
                    src="/stairpay-icon.png"
                    alt="StairPay"
                    width={32}
                    height={32}
                    className="size-full"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">StairPay</span>
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
              {coreNavItems.map((item) => {
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
        <SidebarGroup>
          <SidebarGroupLabel>Engagement & Growth</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {stairpayFeatures.map((item) => {
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
