import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { HomeIcon, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect(routes.dashboard.root);
  }

  // If not logged in, show landing page

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">StairProperty</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Modern property management for shared ownership housing associations
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Manage properties, track tenant equity, and streamline staircasing
            applications with our multi-tenant platform built for UK housing
            associations.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button asChild size="lg">
              <Link href={routes.signup}>Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={routes.login}>Sign In</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card>
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <HomeIcon className="size-6 text-primary" />
                </div>
                <CardTitle>Property Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track all shared ownership properties with valuations and
                  tenant details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="size-6 text-primary" />
                </div>
                <CardTitle>Equity Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor tenant equity percentages and staircasing progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Lock className="size-6 text-primary" />
                </div>
                <CardTitle>Multi-Tenant Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade data isolation with role-based access control
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-16 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Technical Demo:</strong> Built with Next.js 15,
                Supabase, Tailwind CSS, and deployed on AWS Amplify. Features
                multi-tenant architecture with Row Level Security, Server
                Actions, and optimistic UI updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
