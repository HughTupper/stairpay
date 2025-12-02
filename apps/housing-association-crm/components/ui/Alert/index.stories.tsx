import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "./index";
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Alert>
      <InfoIcon />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational message with an icon.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert>
      <CheckCircleIcon />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        Your changes have been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert>
      <TriangleAlertIcon />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
};

export const OnlyDescription: Story = {
  render: () => (
    <Alert>
      <AlertDescription>
        This alert only has a description without a title.
      </AlertDescription>
    </Alert>
  ),
};

export const MultipleAlerts: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          This is an informational alert.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircleIcon />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Operation completed successfully.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An error occurred while processing your request.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Alert>
      <InfoIcon />
      <AlertTitle>Important Information</AlertTitle>
      <AlertDescription>
        <p>
          This alert contains multiple paragraphs of content to demonstrate how the
          component handles longer text.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </AlertDescription>
    </Alert>
  ),
};
