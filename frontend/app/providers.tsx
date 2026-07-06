"use client";

import { ApolloProvider } from "@apollo/client/react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";

import { UserProvider } from "@/contexts/UserContext";
import { apolloClient } from "@/lib/apollo/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <LeafyGreenProvider>{children}</LeafyGreenProvider>
      </UserProvider>
    </ApolloProvider>
  );
}
