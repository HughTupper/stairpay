import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./index";

describe("Progress", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<Progress value={50} />);
      expect(
        container.querySelector('[data-slot="progress"]')
      ).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <Progress value={50} className="custom-class" />
      );
      const progress = container.querySelector('[data-slot="progress"]');
      expect(progress).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      const { container } = render(<Progress value={50} />);
      expect(
        container.querySelector('[data-slot="progress"]')
      ).toBeInTheDocument();
    });

    it("renders indicator", () => {
      const { container } = render(<Progress value={50} />);
      expect(
        container.querySelector('[data-slot="progress-indicator"]')
      ).toBeInTheDocument();
    });
  });

  describe("States", () => {
    it("renders with 0% progress", () => {
      const { container } = render(<Progress value={0} />);
      const indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
    });

    it("renders with 50% progress", () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-50%)" });
    });

    it("renders with 100% progress", () => {
      const { container } = render(<Progress value={100} />);
      const indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
    });

    it("handles undefined value", () => {
      const { container } = render(<Progress />);
      const indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
    });

    it("handles max prop", () => {
      const { container } = render(<Progress value={50} max={200} />);
      const progress = container.querySelector('[data-slot="progress"]');
      expect(progress).toHaveAttribute("aria-valuemax", "200");
    });
  });

  describe("Accessibility", () => {
    it("has progressbar role", () => {
      render(<Progress value={50} />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("has correct aria-valuenow", () => {
      render(<Progress value={75} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    });

    it("supports aria-label", () => {
      render(<Progress value={50} aria-label="Upload progress" />);
      expect(screen.getByLabelText("Upload progress")).toBeInTheDocument();
    });

    it("supports aria-valuetext", () => {
      render(<Progress value={50} aria-valuetext="50 percent" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuetext", "50 percent");
    });
  });

  describe("Composition", () => {
    it("renders with custom width", () => {
      const { container } = render(<Progress value={50} className="w-64" />);
      const progress = container.querySelector('[data-slot="progress"]');
      expect(progress).toHaveClass("w-64");
    });

    it("renders with custom height", () => {
      const { container } = render(<Progress value={50} className="h-4" />);
      const progress = container.querySelector('[data-slot="progress"]');
      expect(progress).toHaveClass("h-4");
    });

    it("applies transition classes", () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      );
      expect(indicator).toHaveClass("transition-all");
    });
  });

  describe("Value updates", () => {
    it("updates progress value when prop changes", () => {
      const { container, rerender } = render(<Progress value={25} />);
      let indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-75%)" });

      rerender(<Progress value={75} />);
      indicator = container.querySelector(
        '[data-slot="progress-indicator"]'
      ) as HTMLElement;
      expect(indicator).toHaveStyle({ transform: "translateX(-25%)" });
    });

    it("maintains styling during value changes", () => {
      const { container, rerender } = render(
        <Progress value={0} className="custom" />
      );
      const progress = container.querySelector('[data-slot="progress"]');
      expect(progress).toHaveClass("custom");

      rerender(<Progress value={100} className="custom" />);
      expect(progress).toHaveClass("custom");
    });
  });
});
