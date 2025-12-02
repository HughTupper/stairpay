import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./index";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders as a child component when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("applies custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
    });
  });

  describe("Variants", () => {
    it("renders default variant", () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("renders destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive", "text-white");
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border", "bg-background");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary", "text-secondary-foreground");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("renders link variant", () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary", "underline-offset-4");
    });
  });

  describe("Sizes", () => {
    it("renders default size", () => {
      render(<Button size="default">Default Size</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9", "px-4", "py-2");
    });

    it("renders small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8", "px-3");
    });

    it("renders large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10", "px-6");
    });

    it("renders icon size", () => {
      render(<Button size="icon" aria-label="Icon button">🔍</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-9");
    });

    it("renders icon-sm size", () => {
      render(<Button size="icon-sm" aria-label="Small icon">🔍</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-8");
    });

    it("renders icon-lg size", () => {
      render(<Button size="icon-lg" aria-label="Large icon">🔍</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-10");
    });
  });

  describe("States", () => {
    it("can be disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");
    });

    it("supports aria-invalid attribute", () => {
      render(<Button aria-invalid>Invalid</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-invalid");
      expect(button).toHaveClass("aria-invalid:border-destructive");
    });
  });

  describe("Interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const user = userEvent.setup();
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole("button"));
      expect(clicked).toBe(true);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      let clicked = false;
      const handleClick = () => {
        clicked = true;
      };

      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      await user.click(screen.getByRole("button"));
      expect(clicked).toBe(false);
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<Button>Focus me</Button>);
      
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    it("can be activated with Enter key", async () => {
      const user = userEvent.setup();
      let activated = false;
      const handleClick = () => {
        activated = true;
      };

      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(activated).toBe(true);
    });

    it("can be activated with Space key", async () => {
      const user = userEvent.setup();
      let activated = false;
      const handleClick = () => {
        activated = true;
      };

      render(<Button onClick={handleClick}>Press Space</Button>);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(activated).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("has button role by default", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
    });

    it("supports custom type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("has button role by default", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
