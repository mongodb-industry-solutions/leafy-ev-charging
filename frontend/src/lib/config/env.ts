export const config = {
  // Same-origin path served by the frontend; Next.js proxies it to the backend
  // (see next.config.ts rewrites). Identical locally and on Kanopy.
  graphqlUrl: "/graphql"
} as const;
