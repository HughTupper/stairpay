import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./index";

describe("Table", () => {
  describe("Rendering", () => {
    it("renders table", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table"]')
      ).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(
        <Table className="custom-class">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const table = container.querySelector('[data-slot="table"]');
      expect(table).toHaveClass("custom-class");
    });

    it("renders table container", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table-container"]')
      ).toBeInTheDocument();
    });
  });

  describe("Table Header", () => {
    it("renders table header", () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table-header"]')
      ).toBeInTheDocument();
    });

    it("renders table head cells", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      const header = container.querySelector('[data-slot="table-header"]');
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("Table Body", () => {
    it("renders table body", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table-body"]')
      ).toBeInTheDocument();
    });

    it("renders multiple rows", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const rows = container.querySelectorAll('[data-slot="table-row"]');
      expect(rows).toHaveLength(3);
    });

    it("applies custom className to body", () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const body = container.querySelector('[data-slot="table-body"]');
      expect(body).toHaveClass("custom-body");
    });
  });

  describe("Table Footer", () => {
    it("renders table footer", () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table-footer"]')
      ).toBeInTheDocument();
    });

    it("applies footer styling", () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      const footer = container.querySelector('[data-slot="table-footer"]');
      expect(footer).toHaveClass("bg-muted/50", "border-t", "font-medium");
    });
  });

  describe("Table Row", () => {
    it("renders table row", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(
        container.querySelector('[data-slot="table-row"]')
      ).toBeInTheDocument();
    });

    it("supports selected state", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Selected</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const row = container.querySelector('[data-slot="table-row"]');
      expect(row).toHaveAttribute("data-state", "selected");
    });

    it("applies custom className to row", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const row = container.querySelector('[data-slot="table-row"]');
      expect(row).toHaveClass("custom-row");
    });
  });

  describe("Table Cell", () => {
    it("renders table cell", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText("Cell Content")).toBeInTheDocument();
    });

    it("renders multiple cells in a row", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
              <TableCell>Cell 2</TableCell>
              <TableCell>Cell 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText("Cell 1")).toBeInTheDocument();
      expect(screen.getByText("Cell 2")).toBeInTheDocument();
      expect(screen.getByText("Cell 3")).toBeInTheDocument();
    });

    it("applies custom className to cell", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const cell = container.querySelector('[data-slot="table-cell"]');
      expect(cell).toHaveClass("custom-cell");
    });
  });

  describe("Table Caption", () => {
    it("renders table caption", () => {
      render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText("Table Caption")).toBeInTheDocument();
    });

    it("applies caption styling", () => {
      const { container } = render(
        <Table>
          <TableCaption>Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const caption = container.querySelector('[data-slot="table-caption"]');
      expect(caption).toHaveClass("text-muted-foreground", "mt-4", "text-sm");
    });
  });

  describe("Accessibility", () => {
    it("has table role", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("has proper semantic structure", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("rowgroup")).toHaveLength(2); // thead and tbody
      expect(screen.getAllByRole("row")).toHaveLength(2);
    });

    it("supports aria-label", () => {
      render(
        <Table aria-label="User data table">
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByLabelText("User data table")).toBeInTheDocument();
    });
  });

  describe("Composition", () => {
    it("renders complete table structure", () => {
      render(
        <Table>
          <TableCaption>A list of users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total: 2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText("A list of users")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Total: 2 users")).toBeInTheDocument();
    });

    it("handles responsive container", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const tableContainer = container.querySelector(
        '[data-slot="table-container"]'
      );
      expect(tableContainer).toHaveClass("overflow-x-auto");
    });
  });
});
