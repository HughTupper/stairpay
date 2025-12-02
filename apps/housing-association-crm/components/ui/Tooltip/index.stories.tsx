import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./index";
import { Button } from "../Button";
import { InfoIcon, HelpCircleIcon, SettingsIcon } from "lucide-react";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <InfoIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Additional information</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-20">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Top (default)</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex gap-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Tooltip on left</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tooltip on right</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me (500ms delay)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip appears after a delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const LongText: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover for long text</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>
          This is a longer tooltip that demonstrates how the component handles
          multiple lines of text. The content will wrap naturally.
        </p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const OnDisabledButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>
          <Button disabled>Disabled Button</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>This action is currently disabled</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const MultipleTooltips: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <InfoIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Information</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircleIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <SettingsIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Rich content</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <div className="space-y-1">
          <p className="font-semibold">Feature Name</p>
          <p className="text-xs">
            This feature allows you to perform advanced operations with ease.
          </p>
          <p className="text-xs text-muted-foreground">
            Press Ctrl+K to activate
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Align Start</Button>
        </TooltipTrigger>
        <TooltipContent align="start">
          <p>Aligned to start</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Align Center (default)</Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Centered alignment</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Align End</Button>
        </TooltipTrigger>
        <TooltipContent align="end">
          <p>Aligned to end</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WithOffset: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>With offset</Button>
      </TooltipTrigger>
      <TooltipContent sideOffset={20}>
        <p>Tooltip with 20px offset</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const OnTextElement: Story = {
  render: () => (
    <p className="text-sm">
      This is some text with{" "}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-help">
            additional information
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This provides extra context</p>
        </TooltipContent>
      </Tooltip>{" "}
      that appears on hover.
    </p>
  ),
};
