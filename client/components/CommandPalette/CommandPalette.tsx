import {
  Box,
  Input,
  Text,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import {
  BarChart2,
  Cpu,
  GitBranch,
  Key,
  LayoutGrid,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

interface CommandPaletteProps {
  services?: Array<{ name: string; serviceId?: string }>;
  models?: Array<{ name: string; modelId?: string }>;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  services = [],
  models = [],
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const { toggleColorMode, colorMode } = useColorMode();
  const inputRef = useRef<HTMLInputElement>(null);

  const bg = useColorModeValue("white", "#1A1F2C");
  const borderColor = useColorModeValue("#E5DFD3", "#2A3142");
  const itemHoverBg = useColorModeValue("#F0F5F2", "rgba(255,255,255,0.08)");
  const itemActiveBg = useColorModeValue("#D9E5DF", "rgba(255,255,255,0.15)");
  const mutedText = useColorModeValue("#5A6473", "#9CA3AF");
  const textColor = useColorModeValue("#1A1F2C", "#FAF8F4");

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const staticItems: CommandItem[] = [
    { id: "nav-home", label: "Dashboard", icon: <LayoutGrid size={16} />, action: () => navigate("/home"), group: "Navigation" },
    { id: "nav-services", label: "Services", icon: <LayoutGrid size={16} />, action: () => navigate("/services"), group: "Navigation" },
    { id: "nav-models", label: "Models", icon: <Cpu size={16} />, action: () => navigate("/models"), group: "Navigation" },
    { id: "nav-pipeline", label: "Pipeline", icon: <GitBranch size={16} />, action: () => navigate("/pipeline"), group: "Navigation" },
    { id: "nav-monitoring", label: "Monitoring", icon: <BarChart2 size={16} />, action: () => navigate("/monitoring"), group: "Navigation" },
    { id: "nav-admin", label: "Admin", icon: <Settings size={16} />, action: () => navigate("/admin"), group: "Navigation" },
    { id: "nav-api-keys", label: "API Keys", icon: <Key size={16} />, action: () => navigate("/admin"), group: "Navigation" },
    {
      id: "toggle-theme",
      label: colorMode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode",
      icon: colorMode === "light" ? <Moon size={16} /> : <Sun size={16} />,
      action: () => { toggleColorMode(); setOpen(false); },
      group: "Actions",
    },
  ];

  const serviceItems: CommandItem[] = services.map((svc) => ({
    id: `service-${svc.serviceId}`,
    label: svc.name,
    description: "Service",
    icon: <LayoutGrid size={16} />,
    action: () => navigate(`/services/view?serviceId=${svc.serviceId}`),
    group: "Services",
  }));

  const modelItems: CommandItem[] = models.map((m) => ({
    id: `model-${m.modelId}`,
    label: m.name,
    description: "Model",
    icon: <Cpu size={16} />,
    action: () => navigate(`/models/view?modelId=${m.modelId}`),
    group: "Models",
  }));

  const allItems = useMemo(
    () => [...staticItems, ...serviceItems, ...modelItems],
    [colorMode, services, models]
  );

  const filtered = useMemo(
    () =>
      search.trim()
        ? allItems.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
          )
        : allItems,
    [search, allItems]
  );

  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
      }, {}),
    [filtered]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearch("");
        setActiveIdx(0);
      }
      if (e.key === "Escape") setOpen(false);
      if (open) {
        if (e.key === "ArrowDown") setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
        if (e.key === "ArrowUp") setActiveIdx((i) => Math.max(i - 1, 0));
        if (e.key === "Enter" && filtered[activeIdx]) {
          filtered[activeIdx].action();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, activeIdx]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  let globalIdx = 0;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1000}
      bg="rgba(26,31,44,0.4)"
      backdropFilter="blur(4px)"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      pt="15vh"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <Box
        bg={bg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        boxShadow="0 16px 48px rgba(45,95,78,0.16)"
        w="full"
        maxW="560px"
        mx={4}
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
        color={textColor}
      >
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveIdx(0); }}
          placeholder="Search pages, services, models…"
          px={4}
          py={3}
          fontSize="md"
          borderBottom="1px solid"
          borderColor={borderColor}
          bg="transparent"
          borderRadius={0}
          outline="none"
          border="none"
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          _focus={{ boxShadow: "none", borderColor }}
          aria-label="Search command palette"
        />

        <Box maxH="360px" overflowY="auto" py={2} role="listbox">
          {filtered.length === 0 && (
            <Box px={4} py={8} textAlign="center" color={mutedText} fontSize="sm">
              No results — try a different search.
            </Box>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <Box key={group} mb={1}>
              <Text
                px={4}
                py={1}
                fontSize="10px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="wider"
                color={mutedText}
              >
                {group}
              </Text>
              {items.map((item) => {
                const idx = globalIdx++;
                const isActive = idx === activeIdx;
                return (
                  <Box
                    key={item.id}
                    px={4}
                    py={2.5}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    cursor="pointer"
                    fontSize="sm"
                    bg={isActive ? itemActiveBg : "transparent"}
                    _hover={{ bg: itemHoverBg }}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIdx(idx)}
                    role="option"
                    aria-selected={isActive}
                  >
                    <Box color={mutedText} flexShrink={0}>{item.icon}</Box>
                    <Box>
                      <Text fontWeight="500">{item.label}</Text>
                      {item.description && (
                        <Text fontSize="xs" color={mutedText}>
                          {item.description}
                        </Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        <Box
          px={4}
          py={2}
          borderTop="1px solid"
          borderColor={borderColor}
          display="flex"
          gap={4}
        >
          <Text fontSize="11px" color={mutedText}>↑↓ navigate</Text>
          <Text fontSize="11px" color={mutedText}>↵ select</Text>
          <Text fontSize="11px" color={mutedText}>esc close</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CommandPalette;
