import { ChakraProvider, Box, Grid, GridItem } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Script from "next/script";
import Navbar from "../components/Navigation/Navbar";
import NavbarMobile from "../components/Navigation/NavbarMobile";
import Sidebar from "../components/Navigation/Sidebar";
import CommandPalette from "../components/CommandPalette/CommandPalette";
import { customTheme } from "../themes/index";
import useMediaQuery from "../hooks/useMediaQuery";
import "../styles/global.css";
import { listServices } from "../api/serviceAPI";
import { listModels } from "../api/modelAPI";
import { useQuery } from "@tanstack/react-query";

const LAYOUT_PAGES = new Set([
  "/home",
  "/services",
  "/services/view",
  "/models",
  "/models/view",
  "/billing",
  "/profile",
  "/admin",
  "/pipeline",
  "/monitoring",
  "/analyze",
]);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const smallscreen = useMediaQuery("(max-width: 1080px)");

  const { data: services } = useQuery(["services"], listServices, {
    staleTime: 120_000,
  });
  const { data: models } = useQuery(["models"], listModels, {
    staleTime: 120_000,
  });

  return (
    <>
      <CommandPalette
        services={(services as Array<{ name: string; serviceId?: string }> | undefined) ?? []}
        models={(models as Array<{ name: string; modelId?: string }> | undefined) ?? []}
      />
      <Grid
        overflowX="hidden"
        templateAreas={`"nav main"`}
        gridTemplateColumns={smallscreen ? "1fr" : "72px 1fr"}
        minH="100vh"
      >
        {!smallscreen && (
          <GridItem>
            <Sidebar />
          </GridItem>
        )}
        <GridItem>
          {smallscreen ? <NavbarMobile /> : <Navbar />}
          {children}
        </GridItem>
      </Grid>
    </>
  );
};

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  const isLayoutNeeded = LAYOUT_PAGES.has(appProps.router.pathname);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000 },
    },
  }));
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_page");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    router.push("/");
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId === null && isLayoutNeeded) {
      logout();
    }
  }, [appProps.router.pathname]);

  const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

  return (
    <ChakraProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <LayoutComponent>
          <Script
            type="text/javascript"
            src="https://ai4bharat.github.io/Recorderjs/lib/recorder.js"
          />
          <Component {...pageProps} />
        </LayoutComponent>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
