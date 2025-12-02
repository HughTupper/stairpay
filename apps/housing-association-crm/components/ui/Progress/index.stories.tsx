import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./index";
import { useEffect, useState } from "react";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const LowProgress: Story = {
  args: {
    value: 25,
  },
};

export const HighProgress: Story = {
  args: {
    value: 75,
  },
};

export const Animated: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} className="w-[60%]" />;
  },
};

export const Loading: Story = {
  render: function Render() {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-full max-w-md space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">{progress}%</p>
      </div>
    );
  },
};

export const CustomHeight: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <p className="text-sm mb-2">Small (h-1)</p>
        <Progress value={60} className="h-1" />
      </div>
      <div>
        <p className="text-sm mb-2">Default (h-2)</p>
        <Progress value={60} />
      </div>
      <div>
        <p className="text-sm mb-2">Large (h-4)</p>
        <Progress value={60} className="h-4" />
      </div>
      <div>
        <p className="text-sm mb-2">Extra Large (h-6)</p>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => {
    const progress = 65;
    return (
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Uploading...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} aria-label="Upload progress" />
      </div>
    );
  },
};

export const MultipleSteps: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 1: Initialization</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 2: Processing</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step 3: Finalizing</span>
          <span>0%</span>
        </div>
        <Progress value={0} />
      </div>
    </div>
  ),
};

export const DifferentWidths: Story = {
  render: () => (
    <div className="space-y-4">
      <Progress value={60} className="w-full" />
      <Progress value={60} className="w-3/4" />
      <Progress value={60} className="w-1/2" />
      <Progress value={60} className="w-1/4" />
    </div>
  ),
};
