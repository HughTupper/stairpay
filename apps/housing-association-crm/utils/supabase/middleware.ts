import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { routes } from "@/lib/routes";
import { env } from "@/lib/env";

const MAX_COOKIE_AGE = 60 * 60 * 24 * 30; // 30 days

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith(routes.login) &&
    !request.nextUrl.pathname.startsWith(routes.signup) &&
    request.nextUrl.pathname.startsWith(routes.dashboard.root)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    return NextResponse.redirect(url);
  }

  // If user is logged in and accessing dashboard but has no org selected,
  // automatically select their first organization
  if (
    user &&
    request.nextUrl.pathname.startsWith(routes.dashboard.root) &&
    !request.cookies.get("current_organisation_id")
  ) {
    const { data: userOrgs } = await supabase
      .from("user_organisations")
      .select("organisation_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (userOrgs) {
      supabaseResponse.cookies.set(
        "current_organisation_id",
        userOrgs.organisation_id,
        {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: MAX_COOKIE_AGE,
        }
      );
    }
  }

  return supabaseResponse;
}
