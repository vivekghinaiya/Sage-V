import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

export const sageVTheme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#F0F5F2",
      100: "#D9E5DF",
      200: "#B5CCC1",
      300: "#91B3A3",
      400: "#7BA697",
      500: "#2D5F4E",
      600: "#244D3F",
      700: "#1B3A30",
      800: "#122820",
      900: "#091410",
    },
    accent: {
      50: "#FBF5EC",
      100: "#F2E4CB",
      200: "#E9D3AA",
      300: "#DFC289",
      400: "#D4A574",
      500: "#C9985F",
      600: "#A37A4C",
      700: "#7C5C39",
      800: "#563E26",
      900: "#2F2013",
    },
    neutral: {
      dark: "#1A1F2C",
      surface: "#FAF8F4",
      surfaceDark: "#0F1419",
      bgDark: "#1A1F2C",
    },
    status: {
      success: "#4A7C59",
      warning: "#D4A574",
      error: "#B8453B",
      info: "#5B7DB1",
    },
  },
  semanticTokens: {
    colors: {
      "bg.canvas": { default: "#FAF8F4", _dark: "#0F1419" },
      "bg.surface": { default: "white", _dark: "#1A1F2C" },
      "bg.muted": { default: "#F0EDE5", _dark: "#1F2533" },
      "fg.default": { default: "#1A1F2C", _dark: "#FAF8F4" },
      "fg.muted": { default: "#5A6473", _dark: "#9CA3AF" },
      "border.default": { default: "#E5DFD3", _dark: "#2A3142" },
    },
  },
  fonts: {
    heading: `'Fraunces', Georgia, serif`,
    body: `'Inter', system-ui, sans-serif`,
    mono: `'JetBrains Mono', 'Fira Mono', monospace`,
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    xl: "20px",
    "2xl": "28px",
  },
  shadows: {
    brand: "0 4px 24px rgba(45, 95, 78, 0.08)",
    brandMd: "0 8px 32px rgba(45, 95, 78, 0.12)",
    brandLg: "0 16px 48px rgba(45, 95, 78, 0.16)",
  },
  styles: {
    global: (props: Record<string, unknown>) => ({
      body: {
        bg: mode("#FAF8F4", "#0F1419")(props),
        color: mode("#1A1F2C", "#FAF8F4")(props),
        fontFamily: "Inter, system-ui, sans-serif",
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props),
      },
      "h1, h2": {
        fontFamily: "Fraunces, Georgia, serif",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
        borderRadius: "md",
      },
      variants: {
        solid: (props: Record<string, unknown>) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : undefined,
          color: props.colorScheme === "brand" ? "white" : undefined,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.600" : undefined,
          },
          _active: {
            bg: props.colorScheme === "brand" ? "brand.700" : undefined,
          },
        }),
        outline: (props: Record<string, unknown>) => ({
          borderColor: props.colorScheme === "accent" ? "accent.400" : undefined,
          color: props.colorScheme === "accent" ? "accent.500" : undefined,
          _hover: {
            bg: props.colorScheme === "accent" ? "accent.50" : undefined,
          },
        }),
        ghost: {
          _hover: {
            bg: "brand.50",
          },
        },
      },
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Card: {
      baseStyle: (props: Record<string, unknown>) => ({
        container: {
          bg: mode("white", "#1A1F2C")(props),
          borderRadius: "xl",
          border: "1px solid",
          borderColor: mode("#E5DFD3", "#2A3142")(props),
          boxShadow: "brand",
        },
      }),
    },
    Input: {
      variants: {
        outline: (props: Record<string, unknown>) => ({
          field: {
            borderRadius: "md",
            borderColor: mode("#E5DFD3", "#2A3142")(props),
            _focus: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Select: {
      variants: {
        outline: (props: Record<string, unknown>) => ({
          field: {
            borderRadius: "md",
            borderColor: mode("#E5DFD3", "#2A3142")(props),
            _focus: {
              borderColor: "brand.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
            },
          },
        }),
      },
    },
    Modal: {
      baseStyle: (props: Record<string, unknown>) => ({
        dialog: {
          borderRadius: "xl",
          bg: mode("white", "#1A1F2C")(props),
        },
        overlay: {
          backdropFilter: "blur(4px)",
        },
      }),
    },
    Divider: {
      baseStyle: (props: Record<string, unknown>) => ({
        borderColor: mode("#E5DFD3", "#2A3142")(props),
      }),
    },
    Table: {
      variants: {
        simple: (props: Record<string, unknown>) => ({
          th: {
            borderColor: mode("#E5DFD3", "#2A3142")(props),
            color: mode("#5A6473", "#9CA3AF")(props),
            fontWeight: "600",
            fontSize: "xs",
            textTransform: "uppercase",
            letterSpacing: "wider",
          },
          td: {
            borderColor: mode("#E5DFD3", "#2A3142")(props),
          },
        }),
      },
    },
    Badge: {
      variants: {
        subtle: (props: Record<string, unknown>) => ({
          bg: props.colorScheme === "brand"
            ? mode("brand.50", "brand.900")(props)
            : undefined,
          color: props.colorScheme === "brand"
            ? mode("brand.700", "brand.200")(props)
            : undefined,
        }),
      },
    },
  },
});
