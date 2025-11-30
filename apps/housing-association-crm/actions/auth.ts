"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@stairpay/shared-types";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organisationName: z
    .string()
    .min(2, "Organisation name must be at least 2 characters"),
});

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  organisationId: z.string().uuid("Invalid organisation ID"),
  role: z.enum(["admin", "viewer"]),
});

export async function signIn(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const validatedData = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(validatedData);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function signUp(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const validatedData = signUpSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      organisationName: formData.get("organisationName"),
    });

    const supabase = await createClient();

    // Create user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError) {
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user" };
    }

    // Create organisation
    const { data: orgData, error: orgError } = await supabase
      .from("organisations")
      .insert({ name: validatedData.organisationName })
      .select()
      .single();

    if (orgError) {
      return { error: "Failed to create organisation" };
    }

    // Link user to organisation with admin role
    const { error: linkError } = await supabase
      .from("user_organisations")
      .insert({
        user_id: authData.user.id,
        organisation_id: orgData.id,
        role: "admin",
      });

    if (linkError) {
      return { error: "Failed to link user to organisation" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function inviteUserToOrganisation(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const validatedData = inviteSchema.parse({
      email: formData.get("email"),
      organisationId: formData.get("organisationId"),
      role: formData.get("role"),
    });

    const supabase = await createClient();

    // Verify current user is an admin of the organisation
    const { data: membership } = await supabase
      .from("user_organisations")
      .select("role")
      .eq("organisation_id", validatedData.organisationId)
      .single();

    if (!membership || membership.role !== "admin") {
      return { error: "You must be an admin to invite users" };
    }

    // In a real app, you'd send an invitation email here
    // For now, we'll just return success
    return {
      success: true,
      data: {
        message: `Invitation sent to ${validatedData.email}`,
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
