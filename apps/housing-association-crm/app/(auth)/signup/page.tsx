"use client";

import { useActionState } from "react";
import { signUp } from "@/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, {});

  useEffect(() => {
    if (state.success) {
      router.push(routes.dashboard.root);
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href={routes.login}
              className="font-medium text-primary hover:underline"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organisationName">Organisation name</Label>
              <Input
                id="organisationName"
                name="organisationName"
                type="text"
                required
                placeholder="Organisation name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password (min 6 characters)"
              />
            </div>
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
