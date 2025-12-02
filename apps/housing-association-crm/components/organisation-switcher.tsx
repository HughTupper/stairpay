"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

type Organisation = {
  id: string;
  name: string;
  role: "admin" | "viewer";
};

type OrganisationSwitcherProps = {
  organisations: Organisation[];
  currentOrganisationId: string | null;
};

export function OrganisationSwitcher({
  organisations,
  currentOrganisationId,
}: OrganisationSwitcherProps) {
  const router = useRouter();

  const currentOrg = organisations.find(
    (org) => org.id === currentOrganisationId
  );

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrganisationId) {
      return; // Already selected
    }

    try {
      // Set cookie with selected organisation
      const response = await fetch(routes.api.organisationSwitch, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organisationId: orgId }),
      });

      if (response.ok) {
        // Force a full page reload to ensure cookie is properly read
        window.location.href = routes.dashboard.root;
      }
    } catch (error) {
      console.error("Failed to switch organisation:", error);
    }
  };

  if (organisations.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className="truncate max-w-[200px]">
            {currentOrg?.name || "Select organisation"}
          </span>
          <ChevronsUpDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {organisations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className="flex items-center justify-between"
          >
            <span className="truncate">{org.name}</span>
            {org.id === currentOrganisationId && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
