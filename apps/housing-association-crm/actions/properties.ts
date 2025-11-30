"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@stairpay/shared-types";

const propertySchema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  postcode: z.string().min(3, "Postcode is required"),
  propertyValue: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Property value must be a positive number",
    }),
});

export async function createProperty(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const cookieStore = await cookies();
    const organisationId = cookieStore.get("current_organisation_id")?.value;

    if (!organisationId) {
      return { error: "No organisation selected" };
    }

    const validatedData = propertySchema.parse({
      address: formData.get("address"),
      postcode: formData.get("postcode"),
      propertyValue: formData.get("propertyValue"),
    });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("properties")
      .insert({
        organisation_id: organisationId,
        address: validatedData.address,
        postcode: validatedData.postcode,
        property_value: parseFloat(validatedData.propertyValue),
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/properties"); revalidatePath("/");

    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function updateProperty(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const propertyId = formData.get("id") as string;

    if (!propertyId) {
      return { error: "Property ID is required" };
    }

    const validatedData = propertySchema.parse({
      address: formData.get("address"),
      postcode: formData.get("postcode"),
      propertyValue: formData.get("propertyValue"),
    });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("properties")
      .update({
        address: validatedData.address,
        postcode: validatedData.postcode,
        property_value: parseFloat(validatedData.propertyValue),
      })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/properties"); revalidatePath("/");

    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteProperty(propertyId: string): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/properties"); revalidatePath("/");

    return { success: true };
  } catch {
    return { error: "An unexpected error occurred" };
  }
}
