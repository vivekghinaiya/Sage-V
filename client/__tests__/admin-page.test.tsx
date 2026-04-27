import { ChakraProvider } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { customTheme } from "../themes/index";

vi.mock("../hooks/useMediaQuery", () => ({ default: () => false }));
vi.mock("./AccessKeys", () => ({ default: () => <div>AccessKeys</div> }), {
  virtual: true,
});
vi.mock("./ExportFeedback", () => ({ default: () => <div>ExportFeedback</div> }), {
  virtual: true,
});
vi.mock("../components/Admin/AccessKeys", () => ({
  default: () => <div>AccessKeys</div>,
}));
vi.mock("../components/Admin/ExportFeedback", () => ({
  default: () => <div>ExportFeedback</div>,
}));

import AdminPage from "../components/Admin/AdminPage";

const wrap = (ui: React.ReactNode) => (
  <ChakraProvider theme={customTheme}>{ui}</ChakraProvider>
);

describe("AdminPage", () => {
  it("renders Access Keys section link", () => {
    render(wrap(<AdminPage />));
    expect(screen.getByText("Access Keys")).toBeInTheDocument();
  });

  it("renders Export Feedback section link", () => {
    render(wrap(<AdminPage />));
    expect(screen.getByText("Export Feedback")).toBeInTheDocument();
  });
});
