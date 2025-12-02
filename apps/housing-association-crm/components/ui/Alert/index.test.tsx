import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "./index";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

describe("Alert", () => {
  describe("Rendering", () => {
    it("renders with children", () => {
      render(
        <Alert>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert description</AlertDescription>
        </Alert>
      );
      expect(screen.getByText("Alert Title")).toBeInTheDocument();
      expect(screen.getByText("Alert description")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Alert className="custom-class">Alert</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert");
    });

    it("has role=alert for accessibility", () => {
      render(<Alert>Alert content</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Alert variant="default">Default Alert</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("bg-card", "text-card-foreground");
    });

    it("renders destructive variant", () => {
      render(<Alert variant="destructive">Error Alert</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("text-destructive", "bg-card");
    });
  });

  describe("Alert Title", () => {
    it("renders AlertTitle with correct styling", () => {
      render(<AlertTitle>Important</AlertTitle>);
      const title = screen.getByText("Important");
      expect(title).toHaveClass("col-start-2", "font-medium");
    });

    it("includes data-slot attribute for AlertTitle", () => {
      render(<AlertTitle>Title</AlertTitle>);
      expect(screen.getByText("Title")).toHaveAttribute(
        "data-slot",
        "alert-title"
      );
    });

    it("applies custom className to AlertTitle", () => {
      render(<AlertTitle className="text-lg">Title</AlertTitle>);
      expect(screen.getByText("Title")).toHaveClass("text-lg");
    });
  });

  describe("Alert Description", () => {
    it("renders AlertDescription with correct styling", () => {
      render(<AlertDescription>Description text</AlertDescription>);
      const description = screen.getByText("Description text");
      expect(description).toHaveClass("text-muted-foreground", "col-start-2");
    });

    it("includes data-slot attribute for AlertDescription", () => {
      render(<AlertDescription>Description</AlertDescription>);
      expect(screen.getByText("Description")).toHaveAttribute(
        "data-slot",
        "alert-description"
      );
    });

    it("applies custom className to AlertDescription", () => {
      render(
        <AlertDescription className="text-xs">Description</AlertDescription>
      );
      expect(screen.getByText("Description")).toHaveClass("text-xs");
    });

    it("supports paragraph children", () => {
      render(
        <AlertDescription>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </AlertDescription>
      );
      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("supports ARIA attributes", () => {
      render(
        <Alert aria-label="Information alert">
          <AlertTitle>Info</AlertTitle>
        </Alert>
      );
      expect(screen.getByLabelText("Information alert")).toBeInTheDocument();
    });

    it("has semantic role alert", () => {
      render(<Alert>Alert message</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert.tagName).toBe("DIV");
    });
  });

  describe("Composition", () => {
    it("renders with icon", () => {
      render(
        <Alert>
          <AlertCircleIcon data-testid="alert-icon" />
          <AlertTitle>With Icon</AlertTitle>
          <AlertDescription>This alert has an icon</AlertDescription>
        </Alert>
      );
      expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("renders complete alert with all components", () => {
      render(
        <Alert variant="destructive">
          <AlertCircleIcon data-testid="icon" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again.
          </AlertDescription>
        </Alert>
      );
      expect(screen.getByRole("alert")).toHaveClass("text-destructive");
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument();
    });

    it("renders success alert composition", () => {
      render(
        <Alert>
          <CheckCircleIcon data-testid="success-icon" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your changes have been saved.</AlertDescription>
        </Alert>
      );
      expect(screen.getByTestId("success-icon")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it("renders alert with only description", () => {
      render(
        <Alert>
          <AlertDescription>Simple alert message</AlertDescription>
        </Alert>
      );
      expect(screen.getByText("Simple alert message")).toBeInTheDocument();
    });
  });
});
