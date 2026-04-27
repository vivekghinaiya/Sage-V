import { ChakraProvider } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KpiCard from "../components/Dashboard/KpiCard";
import { customTheme } from "../themes/index";

const wrap = (ui: React.ReactNode) => (
  <ChakraProvider theme={customTheme}>{ui}</ChakraProvider>
);

describe("KpiCard", () => {
  it("renders label and value", () => {
    render(
      wrap(
        <KpiCard
          label="API Calls (24h)"
          value="1,234"
          tooltip="Total API calls"
        />
      )
    );
    expect(screen.getByText("API Calls (24h)")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading=true", () => {
    const { container } = render(
      wrap(
        <KpiCard
          label="API Calls (24h)"
          value="1,234"
          tooltip="Total API calls"
          isLoading
        />
      )
    );
    expect(container.querySelector(".chakra-skeleton")).toBeInTheDocument();
  });
});
