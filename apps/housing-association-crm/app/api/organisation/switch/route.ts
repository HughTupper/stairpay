import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export async function POST(request: Request) {
  try {
    const { organisationId } = await request.json();

    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify user has access to this organisation
    const { data, error } = await supabase
      .from("user_organisations")
      .select("organisation_id")
      .eq("organisation_id", organisationId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Set cookie with organisation ID
    const cookieStore = await cookies();
    cookieStore.set("current_organisation_id", organisationId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const returnUrl = searchParams.get("returnUrl") || routes.dashboard.root;

  // If organisationId is provided, set it and redirect
  if (organisationId) {
    const supabase = await createClient();

    // Verify user has access to this organisation
    const { data, error } = await supabase
      .from("user_organisations")
      .select("organisation_id")
      .eq("organisation_id", organisationId)
      .single();

    if (!error && data) {
      // Set cookie with organisation ID
      const cookieStore = await cookies();
      cookieStore.set("current_organisation_id", organisationId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      redirect(returnUrl);
    }
  }

  // Otherwise just return current organisation ID
  const cookieStore = await cookies();
  const currentOrgId = cookieStore.get("current_organisation_id")?.value;

  return NextResponse.json({ organisationId: currentOrgId || null });
}
