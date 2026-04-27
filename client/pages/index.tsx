import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { login } from "../api/authAPI";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const heroBg = useColorModeValue("brand.500", "neutral.surfaceDark");
  const surfaceBg = useColorModeValue("bg.canvas", "bg.surface");
  const mutation = useMutation(login);

  useEffect(() => {
    if (
      localStorage.getItem("refresh_token") &&
      localStorage.getItem("access_token")
    ) {
      const savedPage = localStorage.getItem("current_page");
      router.push(savedPage ?? "/services");
    }
  }, [router]);

  const validateCredentials = () => {
    mutation.mutate(
      { email: username, password: password },
      {
        onSuccess: () => {
          localStorage.setItem("email", username);
          const savedPage = localStorage.getItem("current_page");
          router.push(savedPage ?? "/services");
        },
        onError: (error: unknown) => {
          const axiosError = error as { response?: { status?: number } };
          const status = axiosError?.response?.status;
          if (status === 401 || status === 422) {
            toast({
              title: "Sign-in failed",
              description: "Invalid credentials — please check your email and password.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Something went off-key",
              description: "We couldn't reach the server. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") validateCredentials();
  };

  const formContent = (
    <Stack spacing={6} w="100%" maxW="360px">
      <Image
        src="/sage-v-logo.svg"
        alt="Sage V"
        width={160}
        height={44}
      />
      <Box>
        <Heading fontFamily="Fraunces, Georgia, serif" size="lg" mb={1}>
          Welcome back
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          Wisdom in every voice.
        </Text>
      </Box>
      <Stack spacing={3}>
        <Input
          value={username}
          type="email"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Email address"
          size="lg"
          aria-label="Email address"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          type="password"
          placeholder="Password"
          size="lg"
          aria-label="Password"
        />
      </Stack>
      <Button
        colorScheme="brand"
        size="lg"
        width="100%"
        isLoading={mutation.isLoading}
        onClick={validateCredentials}
      >
        Sign in
      </Button>
    </Stack>
  );

  return (
    <>
      <Head>
        <title>Sign in — Sage V</title>
        <meta name="description" content="Sign in to your Sage V workspace." />
      </Head>
      {isMobile ? (
        <Box
          minH="100vh"
          bg={surfaceBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          {formContent}
        </Box>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" minH="100vh">
          <GridItem
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={heroBg}
            p={12}
          >
            <Image
              src="/sage-v-hero.svg"
              width={480}
              height={480}
              alt="Sage V — Wisdom in every voice"
            />
          </GridItem>
          <GridItem
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={surfaceBg}
            p={12}
          >
            {formContent}
          </GridItem>
        </Grid>
      )}
    </>
  );
}
