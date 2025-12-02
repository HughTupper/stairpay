import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./index";

describe("Badge", () => {
  describe("Rendering", () => {
    it("renders with children", () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("renders as a child component when asChild is true", () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      );
      const link = screen.getByRole("link", { name: "Link Badge" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("applies custom className", () => {
      render(<Badge className="custom-class">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveAttribute("data-slot", "badge");
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Badge variant="default">Default</Badge>);
      const badge = screen.getByText("Default");
      expect(badge).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("renders secondary variant", () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      const badge = screen.getByText("Secondary");
      expect(badge).toHaveClass("bg-secondary", "text-secondary-foreground");
    });

    it("renders destructive variant", () => {
      render(<Badge variant="destructive">Error</Badge>);
      const badge = screen.getByText("Error");
      expect(badge).toHaveClass("bg-destructive", "text-white");
    });

    it("renders outline variant", () => {
      render(<Badge variant="outline">Outline</Badge>);
      const badge = screen.getByText("Outline");
      expect(badge).toHaveClass("text-foreground");
    });
  });

  describe("States", () => {
    it("renders with disabled state when asChild with disabled element", () => {
      render(
        <Badge asChild>
          <button disabled>Disabled</button>
        </Badge>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("renders with aria-invalid attribute", () => {
      render(<Badge aria-invalid>Invalid</Badge>);
      expect(screen.getByText("Invalid")).toHaveAttribute("aria-invalid");
    });
  });

  describe("Accessibility", () => {
    it("renders as a span by default", () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(container.querySelector("span")).toBeInTheDocument();
    });

    it("supports custom ARIA attributes", () => {
      render(<Badge aria-label="Status badge">Active</Badge>);
      expect(screen.getByLabelText("Status badge")).toBeInTheDocument();
    });
  });

  describe("Composition", () => {
    it("renders with icon", () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          With Icon
        </Badge>
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    it("renders as a link when asChild with anchor", () => {
      render(
        <Badge asChild variant="secondary">
          <a href="/notifications">5 New</a>
        </Badge>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveClass("bg-secondary");
      expect(link).toHaveAttribute("href", "/notifications");
    });

    it("applies all variant and custom classes", () => {
      render(
        <Badge variant="destructive" className="font-bold uppercase">
          Alert
        </Badge>
      );
      const badge = screen.getByText("Alert");
      expect(badge).toHaveClass("bg-destructive", "font-bold", "uppercase");
    });
  });
});
