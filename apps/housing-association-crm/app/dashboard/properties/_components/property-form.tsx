"use client";

import { useActionState, useState, useEffect } from "react";
import { createProperty } from "@/actions/properties";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

export function PropertyForm() {
  const [state, formAction, isPending] = useActionState(createProperty, {});
  const [open, setOpen] = useState(false);

  // Close the sheet when property is successfully created
  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Property</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Property</SheetTitle>
          <SheetDescription>
            Enter the property details to add it to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <form action={formAction} className="space-y-4 mt-6 px-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              name="address"
              id="address"
              required
              placeholder="123 High Street, London"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              type="text"
              name="postcode"
              id="postcode"
              required
              placeholder="SW1A 1AA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyValue">Property Value (£)</Label>
            <Input
              type="number"
              name="propertyValue"
              id="propertyValue"
              required
              step="0.01"
              min="0"
              placeholder="250000"
            />
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Creating..." : "Create Property"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
