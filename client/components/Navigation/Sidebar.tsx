import {
  Box,
  Divider,
  HStack,
  Image,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  BarChart2,
  Cpu,
  GitBranch,
  LayoutGrid,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type NavSection = {
  label: string;
  items: NavItem[];
  adminOnly?: boolean;
};

type NavItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathKey: string;
  adminOnly?: boolean;
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      {
        href: "/services",
        icon: <LayoutGrid size={20} />,
        label: "Services",
        pathKey: "services",
      },
      {
        href: "/models",
        icon: <Cpu size={20} />,
        label: "Models",
        pathKey: "models",
      },
      {
        href: "/pipeline",
        icon: <GitBranch size={20} />,
        label: "Pipeline",
        pathKey: "pipeline",
      },
    ],
  },
  {
    label: "Insights",
    adminOnly: true,
    items: [
      {
        href: "/monitoring",
        icon: <BarChart2 size={20} />,
        label: "Monitoring",
        pathKey: "monitoring",
        adminOnly: true,
      },
    ],
  },
  {
    label: "Admin",
    adminOnly: true,
    items: [
      {
        href: "/admin",
        icon: <Settings size={20} />,
        label: "Admin",
        pathKey: "admin",
        adminOnly: true,
      },
    ],
  },
];

const Sidebar: React.FC = () => {
  const bg = useColorModeValue("white", "bg.surface");
  const borderColor = useColorModeValue("border.default", "border.default");
  const labelColor = useColorModeValue("fg.muted", "fg.muted");
  const activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const textColor = useColorModeValue("fg.default", "fg.default");

  const [userRole, setUserRole] = useState<string>("CONSUMER");
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role") ?? "CONSUMER";
    setUserRole(role);
    const segment = router.pathname.split("/")[1];
    setActiveKey(segment);
  }, [router.pathname]);

  const isAdmin = userRole === "ADMIN";

  return (
    <Box
      h="100vh"
      position="fixed"
      bg={bg}
      borderRight="1px solid"
      borderColor={borderColor}
      zIndex={50}
      width={isOpen ? "220px" : "72px"}
      transition="width 0.2s ease"
      display="flex"
      flexDirection="column"
      boxShadow="brand"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      overflow="hidden"
    >
      {/* Logo area */}
      <Box px={3} py={4} borderBottom="1px solid" borderColor={borderColor}>
        <HStack spacing={3}>
          <Box flexShrink={0}>
            <Image
              src="/sage-v-mark.svg"
              alt="Sage V"
              width="40px"
              height="40px"
            />
          </Box>
          {isOpen && (
            <Text
              fontFamily="Fraunces, Georgia, serif"
              fontWeight="700"
              fontSize="lg"
              color={activeColor}
              whiteSpace="nowrap"
            >
              Sage V
            </Text>
          )}
        </HStack>
      </Box>

      {/* Navigation */}
      <VStack spacing={0} align="stretch" flex={1} py={3} overflowY="auto">
        {NAV_SECTIONS.map((section) => {
          if (section.adminOnly && !isAdmin) return null;
          const visibleItems = section.items.filter(
            (item) => !item.adminOnly || isAdmin
          );
          if (visibleItems.length === 0) return null;

          return (
            <Box key={section.label} mb={2}>
              {isOpen && (
                <Text
                  px={4}
                  py={1}
                  fontSize="10px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  color={labelColor}
                  whiteSpace="nowrap"
                >
                  {section.label}
                </Text>
              )}
              {visibleItems.map((item) => {
                const isActive = activeKey === item.pathKey;
                return (
                  <Tooltip
                    key={item.href}
                    label={item.label}
                    placement="right"
                    isDisabled={isOpen}
                    hasArrow
                  >
                    <Link href={item.href} passHref legacyBehavior>
                      <Box
                        as="a"
                        mx={2}
                        px={isOpen ? 3 : 0}
                        py={2}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent={isOpen ? "flex-start" : "center"}
                        bg={isActive ? activeBg : "transparent"}
                        color={isActive ? activeColor : textColor}
                        borderLeft={isActive ? "3px solid" : "3px solid transparent"}
                        borderLeftColor={isActive ? "accent.400" : "transparent"}
                        _hover={{
                          bg: activeBg,
                          color: activeColor,
                        }}
                        transition="all 0.15s"
                        cursor="pointer"
                        role="link"
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Box flexShrink={0}>{item.icon}</Box>
                        {isOpen && (
                          <Text
                            ml={3}
                            fontSize="sm"
                            fontWeight={isActive ? "600" : "400"}
                            whiteSpace="nowrap"
                          >
                            {item.label}
                          </Text>
                        )}
                      </Box>
                    </Link>
                  </Tooltip>
                );
              })}
              {isOpen && <Divider mt={2} />}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
