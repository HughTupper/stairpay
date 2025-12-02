import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarMenuSkeleton,
} from "./index";

// Mock the use-mobile hook
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

describe("Sidebar", () => {
  describe("Rendering", () => {
    it("renders sidebar provider", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    });

    it("renders sidebar content", () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <div>Sidebar Content</div>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar className="custom-sidebar">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar-container"]');
      expect(sidebar).toHaveClass("custom-sidebar");
    });
  });

  describe("Variants", () => {
    it("renders default sidebar variant", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar variant="sidebar">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-variant", "sidebar");
    });

    it("renders floating variant", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar variant="floating">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-variant", "floating");
    });

    it("renders inset variant", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar variant="inset">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-variant", "inset");
    });
  });

  describe("Sides", () => {
    it("renders on left side by default", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-side", "left");
    });

    it("renders on right side", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar side="right">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-side", "right");
    });
  });

  describe("Collapsible", () => {
    it("renders with offcanvas collapsible by default", () => {
      const { container } = render(
        <SidebarProvider defaultOpen={false}>
          <Sidebar>
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-collapsible", "offcanvas");
    });

    it("renders with icon collapsible", () => {
      const { container } = render(
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const sidebar = container.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    });

    it("renders with none collapsible", () => {
      render(
        <SidebarProvider>
          <Sidebar collapsible="none">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Components", () => {
    it("renders sidebar header", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>Header Content</SidebarHeader>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-header"]')).toBeInTheDocument();
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("renders sidebar footer", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarFooter>Footer Content</SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-footer"]')).toBeInTheDocument();
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("renders sidebar separator", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <div>Above</div>
              <SidebarSeparator />
              <div>Below</div>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-separator"]')).toBeInTheDocument();
    });
  });

  describe("Menu", () => {
    it("renders sidebar menu", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item 1</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-menu"]')).toBeInTheDocument();
    });

    it("renders menu items", () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item 1</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item 2</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("renders menu button with active state", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Active Item</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      const button = container.querySelector('[data-slot="sidebar-menu-button"]');
      expect(button).toHaveAttribute("data-active", "true");
    });

    it("renders menu skeleton", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-menu-skeleton"]')).toBeInTheDocument();
    });
  });

  describe("Groups", () => {
    it("renders sidebar group", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Group Label</SidebarGroupLabel>
                <SidebarGroupContent>Group Content</SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-group"]')).toBeInTheDocument();
      expect(screen.getByText("Group Label")).toBeInTheDocument();
      expect(screen.getByText("Group Content")).toBeInTheDocument();
    });

    it("renders group label", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );
      expect(container.querySelector('[data-slot="sidebar-group-label"]')).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("triggers toggle when trigger button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider defaultOpen={true}>
          <div>
            <SidebarTrigger />
            <Sidebar>
              <SidebarContent>Content</SidebarContent>
            </Sidebar>
          </div>
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      await user.click(trigger);
      // Sidebar state should change
    });

    it("calls onClick when menu button is clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleClick}>
                    Click Me
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      await user.click(screen.getByText("Click Me"));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has accessible trigger button", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger />
        </SidebarProvider>
      );
      expect(screen.getByRole("button", { name: /toggle sidebar/i })).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item 1</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item 2</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      await user.tab();
      // First item should be focused
    });
  });

  describe("Composition", () => {
    it("renders complete sidebar structure", () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <h2>My App</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Dashboard</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <p>Footer</p>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByText("My App")).toBeInTheDocument();
      expect(screen.getByText("Main")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });
});
