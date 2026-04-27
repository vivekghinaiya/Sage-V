import {
  Box,
  Button,
  Divider,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, Key, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import AccessKeys from "./AccessKeys";
import ExportFeedback from "./ExportFeedback";

type AdminSection = "menu" | "access-keys" | "feedback";

const AdminPage: React.FC = () => {
  const [section, setSection] = useState<AdminSection>("menu");
  const smallscreen = useMediaQuery("(max-width: 1080px)");

  const sidebarBg = useColorModeValue("white", "bg.surface");
  const borderColor = useColorModeValue("border.default", "border.default");
  const activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const activeColor = useColorModeValue("brand.600", "brand.300");
  const mutedText = useColorModeValue("fg.muted", "fg.muted");

  if (smallscreen) {
    if (section === "menu") {
      return (
        <Box p={4}>
          <Button
            w="100%"
            mb={3}
            colorScheme="brand"
            leftIcon={<Key size={16} />}
            onClick={() => setSection("access-keys")}
          >
            API Keys
          </Button>
          <Button
            w="100%"
            colorScheme="brand"
            variant="outline"
            leftIcon={<MessageSquare size={16} />}
            onClick={() => setSection("feedback")}
          >
            Export Feedback
          </Button>
        </Box>
      );
    }
    return (
      <Box>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          ml={4}
          mb={2}
          onClick={() => setSection("menu")}
        >
          Admin
        </Button>
        {section === "access-keys" && <AccessKeys />}
        {section === "feedback" && <ExportFeedback />}
      </Box>
    );
  }

  return (
    <Box display="flex" minH="calc(100vh - 6rem)">
      <VStack
        align="stretch"
        spacing={0}
        w="220px"
        flexShrink={0}
        bg={sidebarBg}
        borderRight="1px solid"
        borderColor={borderColor}
        pt={4}
      >
        <Text
          px={4}
          pb={2}
          fontSize="10px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="wider"
          color={mutedText}
        >
          Admin
        </Text>
        <Divider />
        {(
          [
            { key: "access-keys", label: "Access Keys", icon: <Key size={16} /> },
            { key: "feedback", label: "Export Feedback", icon: <MessageSquare size={16} /> },
          ] as { key: AdminSection; label: string; icon: React.ReactNode }[]
        ).map(({ key, label, icon }) => (
          <Box
            key={key}
            px={4}
            py={3}
            cursor="pointer"
            bg={section === key ? activeBg : "transparent"}
            color={section === key ? activeColor : undefined}
            borderLeft={section === key ? "3px solid" : "3px solid transparent"}
            borderLeftColor={section === key ? "accent.400" : "transparent"}
            _hover={{ bg: activeBg, color: activeColor }}
            onClick={() => setSection(key)}
          >
            <HStack spacing={2}>
              {icon}
              <Text fontWeight={section === key ? "600" : "400"} fontSize="sm">
                {label}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Box flex={1} p={6}>
        {section === "menu" && (
          <Text color={mutedText}>Select a section from the sidebar.</Text>
        )}
        {section === "access-keys" && <AccessKeys />}
        {section === "feedback" && <ExportFeedback />}
      </Box>
    </Box>
  );
};

export default AdminPage;
