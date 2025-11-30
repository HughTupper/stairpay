"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

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
  const [isOpen, setIsOpen] = useState(false);

  const currentOrg = organisations.find(
    (org) => org.id === currentOrganisationId
  );

  const handleSwitch = async (orgId: string) => {
    // Set cookie with selected organisation
    await fetch(routes.api.organisationSwitch, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organisationId: orgId }),
    });
    setIsOpen(false);
    router.refresh();
  };

  if (organisations.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="truncate max-w-[200px]">
          {currentOrg?.name || "Select organisation"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {organisations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSwitch(org.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    org.id === currentOrganisationId
                      ? "bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="truncate">{org.name}</span>
                  {org.id === currentOrganisationId && (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
