import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Moon, Search, Sun, User } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getUser } from "../../api/authAPI";

const PAGE_TITLES: Record<string, string> = {
  home: "Dashboard",
  services: "Services",
  "services/view": "View Service",
  models: "Model Registry",
  "models/view": "View Model",
  admin: "Admin",
  profile: "Profile",
  pipeline: "Pipeline",
  monitoring: "Monitoring",
  billing: "Billing",
  analyze: "Analyze",
};

function getPageTitle(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const key = parts.join("/");
  return PAGE_TITLES[key] ?? PAGE_TITLES[parts[0]] ?? "Dashboard";
}

const Navbar: React.FC = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const bg = useColorModeValue("white", "bg.surface");
  const borderColor = useColorModeValue("border.default", "border.default");
  const mutedColor = useColorModeValue("fg.muted", "fg.muted");
  const titleColor = useColorModeValue("fg.default", "fg.default");

  const router = useRouter();
  const [title, setTitle] = useState("Dashboard");

  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") ?? "" : "";
  const { data: user } = useQuery(
    ["User", email],
    () => getUser(email),
    { enabled: !!email }
  );

  useEffect(() => {
    setTitle(getPageTitle(router.pathname));
  }, [router.pathname]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("current_page");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    router.push("/");
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={40}
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      px={6}
      py={3}
      boxShadow="0 1px 0 rgba(45,95,78,0.06)"
    >
      <HStack spacing={4}>
        <Text
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="700"
          fontSize="xl"
          color={titleColor}
        >
          {title}
        </Text>
        <Spacer />

        {/* Global search (UI only — wired to list endpoints via CommandPalette) */}
        <InputGroup maxW="280px" display={{ base: "none", lg: "flex" }}>
          <InputLeftElement pointerEvents="none">
            <Search size={16} color="var(--chakra-colors-gray-400)" />
          </InputLeftElement>
          <Input
            placeholder="Search services, models… (⌘K)"
            size="sm"
            borderRadius="md"
            readOnly
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
            cursor="pointer"
          />
        </InputGroup>

        {/* Dark mode toggle */}
        <IconButton
          aria-label={colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"}
          icon={colorMode === "light" ? <Moon size={18} /> : <Sun size={18} />}
          variant="ghost"
          size="sm"
          onClick={toggleColorMode}
        />

        {/* User menu */}
        <Menu>
          <MenuButton
            as={Box}
            display="flex"
            alignItems="center"
            gap={2}
            cursor="pointer"
            px={3}
            py={2}
            borderRadius="md"
            _hover={{ bg: "brand.50" }}
            role="button"
            aria-label="User menu"
          >
            <HStack spacing={2}>
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg="brand.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="brand.600"
              >
                <User size={16} />
              </Box>
              <Text fontSize="sm" fontWeight="500" color={titleColor} display={{ base: "none", md: "block" }}>
                {user?.name ?? email}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/profile")}>
              My Profile
            </MenuItem>
            <MenuItem color="status.error" onClick={logout}>
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
};

export default Navbar;
