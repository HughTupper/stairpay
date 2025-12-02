import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./index";

describe("Skeleton", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<Skeleton />);
      expect(
        container.querySelector('[data-slot="skeleton"]')
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      const { container } = render(<Skeleton />);
      expect(
        container.querySelector('[data-slot="skeleton"]')
      ).toBeInTheDocument();
    });

    it("has default styling classes", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("bg-accent", "animate-pulse", "rounded-md");
    });
  });

  describe("States", () => {
    it("renders with custom dimensions", () => {
      const { container } = render(<Skeleton className="w-32 h-8" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("w-32", "h-8");
    });

    it("renders with custom border radius", () => {
      const { container } = render(<Skeleton className="rounded-full" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("rounded-full");
    });

    it("renders with full width", () => {
      const { container } = render(<Skeleton className="w-full" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("w-full");
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Skeleton aria-label="Loading content" />);
      expect(screen.getByLabelText("Loading content")).toBeInTheDocument();
    });

    it("supports aria-busy", () => {
      const { container } = render(<Skeleton aria-busy="true" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveAttribute("aria-busy", "true");
    });

    it("supports role attribute", () => {
      const { container } = render(<Skeleton role="status" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveAttribute("role", "status");
    });
  });

  describe("Composition", () => {
    it("renders multiple skeletons", () => {
      const { container } = render(
        <div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(2);
    });

    it("renders skeleton card", () => {
      const { container } = render(
        <div className="space-y-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });

    it("renders skeleton list", () => {
      const { container } = render(
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(9); // 3 items * 3 skeletons each
    });

    it("renders with custom animation", () => {
      const { container } = render(
        <Skeleton className="animate-none bg-gray-200" />
      );
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("animate-none", "bg-gray-200");
    });
  });

  describe("Variants", () => {
    it("renders circular skeleton", () => {
      const { container } = render(
        <Skeleton className="h-12 w-12 rounded-full" />
      );
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("rounded-full", "h-12", "w-12");
    });

    it("renders rectangular skeleton", () => {
      const { container } = render(
        <Skeleton className="h-32 w-full rounded-lg" />
      );
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("rounded-lg", "h-32", "w-full");
    });

    it("renders text line skeleton", () => {
      const { container } = render(<Skeleton className="h-4 w-full" />);
      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toHaveClass("h-4", "w-full");
    });
  });

  describe("Integration", () => {
    it("maintains classes when used in flex container", () => {
      const { container } = render(
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 flex-1" />
        </div>
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons[0]).toHaveClass("h-10", "w-10");
      expect(skeletons[1]).toHaveClass("h-10", "flex-1");
    });

    it("works within grid layout", () => {
      const { container } = render(
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      );
      const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons).toHaveLength(3);
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass("h-24");
      });
    });
  });
});
