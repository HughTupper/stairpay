import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Label } from "./index";

describe("Label", () => {
  describe("Rendering", () => {
    it("renders label with text", () => {
      render(<Label>Username</Label>);
      expect(screen.getByText("Username")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Label className="custom-class">Label</Label>);
      expect(screen.getByText("Label")).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      render(<Label data-testid="label">Label</Label>);
      expect(screen.getByTestId("label")).toHaveAttribute("data-slot", "label");
    });

    it("has default styling classes", () => {
      render(<Label data-testid="label">Label</Label>);
      const label = screen.getByTestId("label");
      expect(label).toHaveClass("text-sm", "font-medium");
    });
  });

  describe("Association with Input", () => {
    it("associates with input using htmlFor", () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <input id="test-input" />
        </>
      );
      const label = screen.getByText("Test Label");
      expect(label).toHaveAttribute("for", "test-input");
    });

    it("clicking label focuses associated input", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Label htmlFor="clickable-input">Clickable</Label>
          <input id="clickable-input" />
        </>
      );
      const label = screen.getByText("Clickable");
      const input = document.getElementById(
        "clickable-input"
      ) as HTMLInputElement;

      await user.click(label);
      expect(input).toHaveFocus();
    });
  });

  describe("States", () => {
    it("supports peer-disabled styling", () => {
      render(
        <div>
          <input disabled className="peer" />
          <Label data-testid="label">Disabled Label</Label>
        </div>
      );
      const label = screen.getByTestId("label");
      expect(label).toHaveClass(
        "peer-disabled:cursor-not-allowed",
        "peer-disabled:opacity-50"
      );
    });
  });

  describe("Accessibility", () => {
    it("renders as label element", () => {
      render(<Label>Accessible Label</Label>);
      const label = screen.getByText("Accessible Label");
      expect(label.tagName).toBe("LABEL");
    });

    it("supports aria-label", () => {
      render(<Label aria-label="Custom aria label">Label</Label>);
      expect(screen.getByText("Label")).toHaveAttribute(
        "aria-label",
        "Custom aria label"
      );
    });
  });

  describe("Content", () => {
    it("renders with JSX children", () => {
      render(
        <Label>
          <span>Required</span>
          <span className="text-destructive">*</span>
        </Label>
      );
      expect(screen.getByText("Required")).toBeInTheDocument();
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("supports gap for flex children", () => {
      render(<Label data-testid="label">Label with gap</Label>);
      expect(screen.getByTestId("label")).toHaveClass("gap-2");
    });
  });
});
