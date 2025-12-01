"use client";

import { useActionState, useOptimistic, useState } from "react";
import { createProperty } from "@/actions/properties";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Property = {
  id: string;
  address: string;
  postcode: string;
  property_value: number;
  created_at: string;
};

export function PropertyForm() {
  const [state, formAction, isPending] = useActionState(createProperty, {});
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>Add Property</Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add New Property</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
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
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Property"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

type PropertyListProps = {
  initialProperties: Property[];
};

export function PropertyList({ initialProperties }: PropertyListProps) {
  const [optimisticProperties] = useOptimistic(
    initialProperties,
    (state: Property[], newProperty: Property) => [...state, newProperty]
  );

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      {optimisticProperties.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Home className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">No properties</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new property.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {optimisticProperties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle>{property.address}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {property.postcode}
                </p>
                <p className="text-2xl font-bold text-primary">
                  £{property.property_value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Added {new Date(property.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
