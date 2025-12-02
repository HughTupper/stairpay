import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";
import { CheckIcon, XIcon, AlertCircleIcon } from "lucide-react";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
    asChild: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>
        <CheckIcon />
        Success
      </Badge>
      <Badge variant="destructive">
        <XIcon />
        Error
      </Badge>
      <Badge variant="secondary">
        <AlertCircleIcon />
        Warning
      </Badge>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge asChild>
        <a href="#notifications">5 New</a>
      </Badge>
      <Badge asChild variant="destructive">
        <a href="#alerts">3 Alerts</a>
      </Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Inactive</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
};

export const WithNumbers: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>1</Badge>
      <Badge variant="secondary">99+</Badge>
      <Badge variant="destructive">!</Badge>
    </div>
  ),
};
