import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./index";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">First Section</h4>
        <p className="text-sm text-muted-foreground">Content here</p>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Second Section</h4>
        <p className="text-sm text-muted-foreground">Content here</p>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Third Section</h4>
        <p className="text-sm text-muted-foreground">Content here</p>
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-2">
      <div className="p-2">
        <h3 className="font-semibold">Item 1</h3>
        <p className="text-sm text-muted-foreground">Description of item 1</p>
      </div>
      <Separator />
      <div className="p-2">
        <h3 className="font-semibold">Item 2</h3>
        <p className="text-sm text-muted-foreground">Description of item 2</p>
      </div>
      <Separator />
      <div className="p-2">
        <h3 className="font-semibold">Item 3</h3>
        <p className="text-sm text-muted-foreground">Description of item 3</p>
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  ),
};

export const InNavigation: Story = {
  render: () => (
    <div className="flex h-10 items-center space-x-4 text-sm">
      <a href="#" className="hover:underline">Home</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:underline">About</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:underline">Services</a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:underline">Contact</a>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <p className="text-sm mb-2">Default</p>
        <Separator />
      </div>
      <div>
        <p className="text-sm mb-2">Thick (h-1)</p>
        <Separator className="h-1" />
      </div>
      <div>
        <p className="text-sm mb-2">Colored</p>
        <Separator className="bg-primary" />
      </div>
      <div>
        <p className="text-sm mb-2">Dashed</p>
        <Separator className="border-t border-dashed bg-transparent" />
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-full max-w-md border rounded-lg p-6">
      <h2 className="text-lg font-semibold">Card Title</h2>
      <p className="text-sm text-muted-foreground mt-2">
        This is a description of the card content.
      </p>
      <Separator className="my-4" />
      <div className="space-y-2">
        <p className="text-sm">Additional content below the separator.</p>
        <p className="text-sm text-muted-foreground">
          More information can go here.
        </p>
      </div>
    </div>
  ),
};

export const NonDecorative: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 1</h4>
        <p className="text-sm text-muted-foreground">Content for section 1</p>
      </div>
      <Separator decorative={false} aria-label="Content separator" className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 2</h4>
        <p className="text-sm text-muted-foreground">Content for section 2</p>
      </div>
    </div>
  ),
};
