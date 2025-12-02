import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Input } from "./index";

describe("Input", () => {
  describe("Rendering", () => {
    it("renders an input element", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("includes data-slot attribute", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
    });

    it("renders with placeholder", () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });
  });

  describe("Types", () => {
    it("renders text input by default", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders email input", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("renders password input", () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it("renders number input", () => {
      render(<Input type="number" />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("type", "number");
    });

    it("renders search input", () => {
      render(<Input type="search" />);
      const input = screen.getByRole("searchbox");
      expect(input).toHaveAttribute("type", "search");
    });
  });

  describe("States", () => {
    it("can be disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50");
    });

    it("can be readonly", () => {
      render(<Input readOnly value="Read only" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });

    it("supports aria-invalid attribute", () => {
      render(<Input aria-invalid />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid");
      expect(input).toHaveClass("aria-invalid:border-destructive");
    });

    it("supports required attribute", () => {
      render(<Input required />);
      expect(screen.getByRole("textbox")).toBeRequired();
    });
  });

  describe("Interactions", () => {
    it("accepts user input", async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");
      
      await user.type(input, "Hello World");
      expect(input).toHaveValue("Hello World");
    });

    it("calls onChange handler", async () => {
      const user = userEvent.setup();
      let value = "";
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        value = e.target.value;
      };

      render(<Input onChange={handleChange} />);
      await user.type(screen.getByRole("textbox"), "test");
      expect(value).toBe("test");
    });

    it("calls onFocus handler", async () => {
      const user = userEvent.setup();
      let focused = false;
      const handleFocus = () => {
        focused = true;
      };

      render(<Input onFocus={handleFocus} />);
      await user.click(screen.getByRole("textbox"));
      expect(focused).toBe(true);
    });

    it("calls onBlur handler", async () => {
      const user = userEvent.setup();
      let blurred = false;
      const handleBlur = () => {
        blurred = true;
      };

      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();
      expect(blurred).toBe(true);
    });

    it("can be focused with keyboard", async () => {
      const user = userEvent.setup();
      render(<Input />);
      
      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label", () => {
      render(<Input aria-label="Username" />);
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Input aria-describedby="helper-text" />
          <span id="helper-text">Enter your email</span>
        </>
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "helper-text");
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <label id="email-label">Email</label>
          <Input aria-labelledby="email-label" />
        </>
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-labelledby", "email-label");
    });
  });

  describe("Value Control", () => {
    it("works as controlled component", async () => {
      const user = userEvent.setup();
      const ControlledInput = () => {
        const [value, setValue] = React.useState("");
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      };

      render(<ControlledInput />);
      const input = screen.getByRole("textbox");
      
      await user.type(input, "controlled");
      expect(input).toHaveValue("controlled");
    });

    it("works as uncontrolled component with defaultValue", () => {
      render(<Input defaultValue="default text" />);
      expect(screen.getByRole("textbox")).toHaveValue("default text");
    });
  });
});
