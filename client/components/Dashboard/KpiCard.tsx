import {
  Box,
  Skeleton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

interface SparkPoint {
  v: number;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  tooltip: string;
  sparkData?: SparkPoint[];
  isLoading?: boolean;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  tooltip,
  sparkData,
  isLoading,
  color = "brand.500",
}) => {
  const bg = useColorModeValue("white", "bg.surface");
  const borderColor = useColorModeValue("border.default", "border.default");
  const labelColor = useColorModeValue("fg.muted", "fg.muted");

  return (
    <Tooltip label={tooltip} hasArrow placement="top">
      <Box
        bg={bg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        p={5}
        boxShadow="brand"
        position="relative"
        overflow="hidden"
      >
        <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="wider" color={labelColor} mb={1}>
          {label}
        </Text>
        {isLoading ? (
          <Skeleton height="36px" width="120px" borderRadius="md" />
        ) : (
          <Text
            fontSize="3xl"
            fontWeight="700"
            color={color}
            fontFamily="Fraunces, Georgia, serif"
            lineHeight="1"
          >
            {value}
          </Text>
        )}
        {sparkData && sparkData.length > 0 && (
          <Box position="absolute" bottom={0} right={0} w="120px" h="50px" opacity={0.3}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--chakra-colors-accent-400)"
                  fill="var(--chakra-colors-accent-100)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default KpiCard;
