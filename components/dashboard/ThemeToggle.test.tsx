import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/dashboard/theme-context";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ThemeToggle", () => {
  it("shows the current theme and toggles on click", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /theme: light/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /theme: light/i }));

    expect(screen.getByRole("button", { name: /theme: dark/i })).toBeInTheDocument();
  });
});
