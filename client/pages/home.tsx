import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Link as ChakraLink,
  Skeleton,
  SkeletonText,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { viewadmindashboard } from "../api/adminAPI";
import { listServices } from "../api/serviceAPI";
import KpiCard from "../components/Dashboard/KpiCard";

type ServiceHealth = "available" | "disabled" | "unknown";

const HEALTH_COLORS: Record<ServiceHealth, string> = {
  available: "#4A7C59",
  disabled: "#B8453B",
  unknown: "#D4A574",
};

function getHealth(isActive: boolean | null | undefined): ServiceHealth {
  if (isActive === true) return "available";
  if (isActive === false) return "disabled";
  return "unknown";
}

const TASK_COLORS = [
  "#2D5F4E",
  "#7BA697",
  "#D4A574",
  "#5B7DB1",
  "#4A7C59",
  "#C9985F",
  "#91B3A3",
];

function ServiceHealthGrid({
  services,
  isLoading,
}: {
  services: ServiceList[];
  isLoading: boolean;
}) {
  const borderColor = useColorModeValue("border.default", "border.default");
  const bg = useColorModeValue("white", "bg.surface");
  const router = useRouter();

  if (isLoading) {
    return (
      <Grid templateColumns="repeat(auto-fill, minmax(160px, 1fr))" gap={3}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height="64px" borderRadius="lg" />
        ))}
      </Grid>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Box textAlign="center" py={8} color="fg.muted">
        <Text fontSize="sm">No services yet — your first inference is one click away.</Text>
        <NextLink href="/admin" passHref legacyBehavior>
          <Button as="a" colorScheme="brand" size="sm" mt={3}>
            Add a service
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(160px, 1fr))" gap={3}>
      {services.map((svc) => {
        const health = getHealth(svc.isActive);
        return (
          <Tooltip key={svc.serviceId ?? svc.name} label={health} hasArrow>
            <Box
              bg={bg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="lg"
              p={3}
              cursor="pointer"
              _hover={{ boxShadow: "brandMd", borderColor: "brand.200" }}
              onClick={() =>
                router.push(`/services/view?serviceId=${svc.serviceId}`)
              }
              transition="all 0.15s"
            >
              <HStack spacing={2} mb={1}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={HEALTH_COLORS[health]}
                  flexShrink={0}
                />
                <Text fontSize="xs" fontWeight="600" noOfLines={1}>
                  {svc.name}
                </Text>
              </HStack>
              {svc.taskType && (
                <Badge
                  colorScheme="brand"
                  variant="subtle"
                  fontSize="10px"
                >
                  {svc.taskType}
                </Badge>
              )}
            </Box>
          </Tooltip>
        );
      })}
    </Grid>
  );
}

export default function Home() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");

  const cardBg = useColorModeValue("white", "bg.surface");
  const borderColor = useColorModeValue("border.default", "border.default");
  const mutedText = useColorModeValue("fg.muted", "fg.muted");
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL ?? "";

  useEffect(() => {
    const email = localStorage.getItem("email") ?? "";
    setFirstName(email.split("@")[0] ?? "there");
  }, []);

  const userId =
    typeof window !== "undefined"
      ? (localStorage.getItem("user_id") ?? "")
      : "";

  const { data: dashboard, isLoading: dashLoading } = useQuery(
    ["dashboard", userId],
    () => viewadmindashboard(userId, 100, 1),
    { enabled: !!userId, staleTime: 60_000 }
  );

  const { data: services, isLoading: svcLoading } = useQuery(
    ["services"],
    listServices,
    { staleTime: 60_000 }
  );

  const apiKeys: unknown[] = dashboard?.api_keys ?? [];
  const totalCalls = apiKeys.reduce((acc: number, k: unknown) => {
    const key = k as { requests_in_last_24_hours?: number };
    return acc + (key.requests_in_last_24_hours ?? 0);
  }, 0);

  const taskTypeCounts: Record<string, number> = {};
  if (Array.isArray(services)) {
    (services as ServiceList[]).forEach((s) => {
      const t = s.task?.type ?? s.taskType ?? "other";
      taskTypeCounts[t] = (taskTypeCounts[t] ?? 0) + 1;
    });
  }
  const taskChartData = Object.entries(taskTypeCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const latencyData = [
    { name: "p50", ms: 120 },
    { name: "p95", ms: 340 },
    { name: "p99", ms: 780 },
  ];

  return (
    <>
      <Head>
        <title>Dashboard — Sage V</title>
        <meta name="description" content="Sage V platform overview dashboard." />
      </Head>

      <Box px={{ base: 4, lg: 8 }} py={6} maxW="1400px">
        {/* Header */}
        <Box mb={8}>
          <Text
            fontFamily="Fraunces, Georgia, serif"
            fontSize="2xl"
            fontWeight="700"
          >
            Welcome back, {firstName}.
          </Text>
          <Text color={mutedText} fontSize="sm" mt={1}>
            Here&apos;s what your Sage V workspace looks like today.
          </Text>
        </Box>

        {/* KPI strip */}
        <Grid
          templateColumns={{ base: "1fr 1fr", lg: "repeat(4, 1fr)" }}
          gap={4}
          mb={8}
        >
          <KpiCard
            label="API Calls (24h)"
            value={dashLoading ? "—" : totalCalls.toLocaleString()}
            tooltip="Total inference requests from all API keys in the last 24 hours."
            isLoading={dashLoading}
            color="brand.500"
          />
          <KpiCard
            label="Active Services"
            value={
              dashLoading || svcLoading
                ? "—"
                : (services as ServiceList[] | undefined)?.filter(
                    (s) => s.isActive
                  ).length ?? 0
            }
            tooltip="Services currently in an available health state."
            isLoading={dashLoading || svcLoading}
            color="status.success"
          />
          <KpiCard
            label="Total Models"
            value={dashLoading ? "—" : (dashboard?.models?.length ?? 0)}
            tooltip="Models registered in the Sage V model registry."
            isLoading={dashLoading}
            color="accent.500"
          />
          <KpiCard
            label="API Keys"
            value={dashLoading ? "—" : apiKeys.length}
            tooltip="Total API keys across all users."
            isLoading={dashLoading}
            color="status.info"
          />
        </Grid>

        {/* Charts row */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mb={8}>
          {/* Task distribution chart */}
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            p={5}
            boxShadow="brand"
          >
            <Text fontWeight="600" fontSize="sm" mb={4}>
              Services by Task Type
            </Text>
            {svcLoading ? (
              <Skeleton height="200px" borderRadius="lg" />
            ) : taskChartData.length === 0 ? (
              <Box textAlign="center" py={8} color={mutedText}>
                <Text fontSize="sm">No services yet — your first inference is one click away.</Text>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={taskChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-border-default, #E5DFD3)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <ChartTooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {taskChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={TASK_COLORS[index % TASK_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>

          {/* Latency panel */}
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            p={5}
            boxShadow="brand"
          >
            <Text fontWeight="600" fontSize="sm" mb={4}>
              Latency (ms) — illustrative
            </Text>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={latencyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-border-default, #E5DFD3)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip formatter={(v) => [`${v} ms`, "Latency"]} />
                <Bar dataKey="ms" radius={[4, 4, 0, 0]}>
                  <Cell fill="#2D5F4E" />
                  <Cell fill="#D4A574" />
                  <Cell fill="#B8453B" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Service health grid */}
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          p={5}
          boxShadow="brand"
          mb={8}
        >
          <Text fontWeight="600" fontSize="sm" mb={4}>
            Service Health
          </Text>
          <ServiceHealthGrid
            services={(services as ServiceList[] | undefined) ?? []}
            isLoading={svcLoading}
          />
        </Box>

        {/* Bottom row */}
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          {/* Quick actions */}
          <Box
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
            p={5}
            boxShadow="brand"
          >
            <Text fontWeight="600" fontSize="sm" mb={4}>
              Quick Actions
            </Text>
            <HStack flexWrap="wrap" gap={3}>
              <NextLink href="/services" passHref legacyBehavior>
                <Button as="a" size="sm" colorScheme="brand">
                  Try a model
                </Button>
              </NextLink>
              <NextLink href="/admin" passHref legacyBehavior>
                <Button as="a" size="sm" colorScheme="brand" variant="outline">
                  Create API key
                </Button>
              </NextLink>
              <ChakraLink
                href="https://github.com/AI4Bharat/Dhruva-Platform"
                isExternal
              >
                <Button size="sm" variant="ghost">
                  View docs
                </Button>
              </ChakraLink>
              {grafanaUrl && (
                <ChakraLink href={grafanaUrl} isExternal>
                  <Button size="sm" variant="ghost">
                    Open Grafana
                  </Button>
                </ChakraLink>
              )}
            </HStack>
          </Box>

          {/* Embedded Grafana */}
          {grafanaUrl && (
            <Box
              bg={cardBg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="brand"
              minH="200px"
            >
              <Box p={3} borderBottom="1px solid" borderColor={borderColor}>
                <Text fontWeight="600" fontSize="sm">
                  Monitoring
                </Text>
              </Box>
              <Box as="iframe"
                src={grafanaUrl}
                width="100%"
                height="200px"
                title="Grafana dashboard"
                frameBorder="0"
              />
            </Box>
          )}
        </Grid>
      </Box>
    </>
  );
}
