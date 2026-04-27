import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    const errorId = Math.random().toString(36).slice(2, 10).toUpperCase();
    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          minH="60vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={6}
        >
          <VStack spacing={4} textAlign="center" maxW="440px">
            <Text fontSize="4xl">🎵</Text>
            <Heading fontFamily="Fraunces, Georgia, serif" size="lg">
              Something went off-key.
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Our team has been notified. If you need immediate help, share
              error ID{" "}
              <Text as="code" fontFamily="mono" fontWeight="600">
                {this.state.errorId}
              </Text>{" "}
              with support.
            </Text>
            <Button
              colorScheme="brand"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </Button>
          </VStack>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
