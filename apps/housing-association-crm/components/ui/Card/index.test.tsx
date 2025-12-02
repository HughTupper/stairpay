import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./index";

describe("Card", () => {
  describe("Rendering", () => {
    it("renders card component", () => {
      render(<Card data-testid="card">Card Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
    });

    it("renders with children", () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Card
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveClass("custom-class");
    });

    it("has default styling classes", () => {
      render(<Card data-testid="card">Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "rounded-xl",
        "border"
      );
    });
  });

  describe("CardHeader", () => {
    it("renders CardHeader", () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      const header = screen.getByTestId("header");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
    });

    it("applies custom className to CardHeader", () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Header
        </CardHeader>
      );
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
    });
  });

  describe("CardTitle", () => {
    it("renders CardTitle", () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText("Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
    });

    it("has correct styling", () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      expect(screen.getByTestId("title")).toHaveClass("font-semibold");
    });
  });

  describe("CardDescription", () => {
    it("renders CardDescription", () => {
      render(<CardDescription>Description text</CardDescription>);
      const description = screen.getByText("Description text");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "card-description");
    });

    it("has muted text styling", () => {
      render(
        <CardDescription data-testid="description">Description</CardDescription>
      );
      expect(screen.getByTestId("description")).toHaveClass(
        "text-muted-foreground"
      );
    });
  });

  describe("CardContent", () => {
    it("renders CardContent", () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText("Content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "card-content");
    });

    it("has padding", () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      expect(screen.getByTestId("content")).toHaveClass("px-6");
    });
  });

  describe("CardFooter", () => {
    it("renders CardFooter", () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText("Footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "card-footer");
    });

    it("has flex layout", () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId("footer")).toHaveClass("flex", "items-center");
    });
  });

  describe("CardAction", () => {
    it("renders CardAction", () => {
      render(<CardAction data-testid="action">Action</CardAction>);
      const action = screen.getByTestId("action");
      expect(action).toBeInTheDocument();
      expect(action).toHaveAttribute("data-slot", "card-action");
    });

    it("has grid positioning", () => {
      render(<CardAction data-testid="action">Action</CardAction>);
      const action = screen.getByTestId("action");
      expect(action).toHaveClass("col-start-2", "row-span-2");
    });
  });

  describe("Composition", () => {
    it("renders complete card with all components", () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description text")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Main content here")).toBeInTheDocument();
      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("works without optional components", () => {
      render(
        <Card>
          <CardContent>Just content</CardContent>
        </Card>
      );

      expect(screen.getByText("Just content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("supports custom aria attributes", () => {
      render(
        <Card aria-label="User profile card" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveAttribute(
        "aria-label",
        "User profile card"
      );
    });

    it("supports role attribute", () => {
      render(
        <Card role="article" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId("card")).toHaveAttribute("role", "article");
    });
  });
});
