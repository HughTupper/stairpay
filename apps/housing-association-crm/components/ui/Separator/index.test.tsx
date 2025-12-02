import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./index";

describe("Separator", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<Separator />);
      expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<Separator className="custom-class" />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      const { container } = render(<Separator />);
      expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    });
  });

  describe("Orientation", () => {
    it("renders horizontal by default", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders horizontal separator", () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders vertical separator", () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("applies correct classes for horizontal orientation", () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("bg-border", "shrink-0");
    });

    it("applies correct classes for vertical orientation", () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("bg-border", "shrink-0");
    });
  });

  describe("Decorative", () => {
    it("is decorative by default", () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("renders as decorative when decorative=true", () => {
      const { container } = render(<Separator decorative={true} />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("renders as non-decorative when decorative=false", () => {
      render(<Separator decorative={false} />);
      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has separator role when not decorative", () => {
      render(<Separator decorative={false} />);
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });

    it("has correct aria-orientation when not decorative", () => {
      render(<Separator decorative={false} orientation="vertical" />);
      const separator = screen.getByRole("separator");
      expect(separator).toHaveAttribute("aria-orientation", "vertical");
    });

    it("is hidden from accessibility tree when decorative", () => {
      const { container } = render(<Separator decorative={true} />);
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();
    });

    it("supports aria-label when not decorative", () => {
      render(<Separator decorative={false} aria-label="Section divider" />);
      expect(screen.getByLabelText("Section divider")).toBeInTheDocument();
    });
  });

  describe("Composition", () => {
    it("renders in flex container with horizontal orientation", () => {
      const { container } = render(
        <div className="flex flex-col gap-2">
          <div>Content 1</div>
          <Separator />
          <div>Content 2</div>
        </div>
      );
      expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    });

    it("renders in flex container with vertical orientation", () => {
      const { container } = render(
        <div className="flex gap-2 h-20">
          <div>Content 1</div>
          <Separator orientation="vertical" />
          <div>Content 2</div>
        </div>
      );
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveAttribute("data-orientation", "vertical");
    });

    it("applies custom styling", () => {
      const { container } = render(
        <Separator className="bg-red-500 h-1" />
      );
      const separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("bg-red-500", "h-1");
    });
  });

  describe("States", () => {
    it("maintains styling with different orientations", () => {
      const { container, rerender } = render(
        <Separator orientation="horizontal" className="my-4" />
      );
      let separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("my-4");

      rerender(<Separator orientation="vertical" className="my-4" />);
      separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toHaveClass("my-4");
    });

    it("can be toggled between decorative states", () => {
      const { container, rerender } = render(<Separator decorative={true} />);
      let separator = container.querySelector('[data-slot="separator"]');
      expect(separator).toBeInTheDocument();

      rerender(<Separator decorative={false} />);
      separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
    });
  });
});
