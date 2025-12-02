import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./index";
import { Button } from "../Button";

describe("Sheet", () => {
  describe("Rendering", () => {
    it("renders trigger button", () => {
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByRole("button", { name: "Open Sheet" })).toBeInTheDocument();
    });

    it("does not show content initially", () => {
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("opens sheet when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open Sheet" }));
      expect(screen.getByText("Sheet Title")).toBeInTheDocument();
    });

    it("closes sheet when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Title")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: "Close" });
      await user.click(closeButton);
      // Content should start animating out - wait for it to be removed
      await waitFor(() => {
        expect(screen.queryByText("Title")).not.toBeInTheDocument();
      });
    });

    it("calls onOpenChange when opened", async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();
      
      render(
        <Sheet onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Sides", () => {
    it("renders on right side by default", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Right Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("right-0");
    });

    it("renders on left side", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>Left Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("left-0");
    });

    it("renders on top side", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetTitle>Top Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("top-0");
    });

    it("renders on bottom side", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetTitle>Bottom Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("bottom-0");
    });
  });

  describe("Components", () => {
    it("renders SheetHeader", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Header Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      expect(screen.getByText("Header Title")).toBeInTheDocument();
    });

    it("renders SheetFooter", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetFooter>
              <Button>Action</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("renders SheetDescription", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Title</SheetTitle>
              <SheetDescription>This is a description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      expect(screen.getByText("This is a description")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has dialog role when open", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Accessible Sheet</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("has accessible close button", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("supports aria-describedby with description", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Description text</SheetDescription>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("Description text");
    });
  });

  describe("Composition", () => {
    it("renders complete sheet with all components", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Complete Sheet</SheetTitle>
              <SheetDescription>With all components</SheetDescription>
            </SheetHeader>
            <div className="p-4">Content goes here</div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button>Save</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Complete Sheet")).toBeInTheDocument();
      expect(screen.getByText("With all components")).toBeInTheDocument();
      expect(screen.getByText("Content goes here")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it("applies custom className to content", async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Open</Button>
          </SheetTrigger>
          <SheetContent className="custom-class">
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole("button"));
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("custom-class");
    });
  });
});
