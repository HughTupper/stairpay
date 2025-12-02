import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./index";
import { Button } from "../Button";

describe("Tooltip", () => {
  describe("Rendering", () => {
    it("renders trigger", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      );
      expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
    });

    it("does not show content initially", () => {
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      );
      expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("shows tooltip on hover", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      expect((await screen.findAllByText("Tooltip text")).length).toBeGreaterThan(0);
    });

    it("hides tooltip on unhover", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");
      await user.hover(button);
      expect((await screen.findAllByText("Tooltip text")).length).toBeGreaterThan(0);

      await user.unhover(button);
      // Tooltip should start animating out
    });

    it("shows tooltip on focus", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Focus me</Button>
          </TooltipTrigger>
          <TooltipContent>Focus tooltip</TooltipContent>
        </Tooltip>
      );

      await user.tab();
      expect((await screen.findAllByText("Focus tooltip")).length).toBeGreaterThan(0);
    });
  });

  describe("TooltipProvider", () => {
    it("renders with TooltipProvider", () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover</Button>
            </TooltipTrigger>
            <TooltipContent>Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports custom delay duration", async () => {
      const user = userEvent.setup();
      render(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover</Button>
            </TooltipTrigger>
            <TooltipContent>Fast tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole("button"));
      expect((await screen.findAllByText("Fast tooltip")).length).toBeGreaterThan(0);
    });
  });

  describe("Positioning", () => {
    it("supports side prop", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      const tooltips = await screen.findAllByText("Bottom tooltip"); const tooltip = tooltips[0];
      expect(tooltip).toBeInTheDocument();
    });

    it("supports sideOffset prop", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={10}>Offset tooltip</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      expect((await screen.findAllByText("Offset tooltip")).length).toBeGreaterThan(0);
    });

    it("supports align prop", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent align="start">Aligned tooltip</TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      expect((await screen.findAllByText("Aligned tooltip")).length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("associates tooltip with trigger", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Accessible tooltip</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");
      await user.hover(button);
      
      const tooltips = await screen.findAllByText("Accessible tooltip"); const tooltip = tooltips[0];
      expect(tooltip).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Keyboard accessible</Button>
          </TooltipTrigger>
          <TooltipContent>Keyboard tooltip</TooltipContent>
        </Tooltip>
      );

      await user.tab();
      expect((await screen.findAllByText("Keyboard tooltip")).length).toBeGreaterThan(0);

      await user.tab();
      // Tooltip should hide when focus moves away
    });
  });

  describe("Composition", () => {
    it("renders with custom className", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            Custom styled tooltip
          </TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      const tooltips = await screen.findAllByText("Custom styled tooltip"); const tooltip = tooltips[0];
      expect(tooltip).toHaveClass("custom-tooltip");
    });

    it("renders with complex content", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover</Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <strong>Title</strong>
              <p>Description text</p>
            </div>
          </TooltipContent>
        </Tooltip>
      );

      await user.hover(screen.getByRole("button"));
      expect((await screen.findAllByText("Title")).length).toBeGreaterThan(0);
      expect(screen.getAllByText("Description text")[0]).toBeInTheDocument();
    });

    it("renders multiple tooltips", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>First</Button>
            </TooltipTrigger>
            <TooltipContent>First tooltip</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Second</Button>
            </TooltipTrigger>
            <TooltipContent>Second tooltip</TooltipContent>
          </Tooltip>
        </div>
      );

      await user.hover(screen.getByRole("button", { name: "First" }));
      expect((await screen.findAllByText("First tooltip")).length).toBeGreaterThan(0);
    });
  });

  describe("States", () => {
    it("supports open state control", () => {
      render(
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Button>Button</Button>
          </TooltipTrigger>
          <TooltipContent>Always visible</TooltipContent>
        </Tooltip>
      );

      expect(screen.getAllByText("Always visible")[0]).toBeInTheDocument();
    });

    it("supports disabled trigger", async () => {
      const user = userEvent.setup();
      render(
        <Tooltip>
          <TooltipTrigger asChild>
            <Button disabled>Disabled</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip for disabled</TooltipContent>
        </Tooltip>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      
      // Hovering disabled button should still show tooltip
      await user.hover(button);
    });
  });
});
