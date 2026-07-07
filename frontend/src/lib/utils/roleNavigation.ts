"use client";

import { UserRole } from "@/graphql/generated/graphql";

export const DRIVER_HOME_ROUTE = "/map";
export const DRIVER_SESSIONS_ROUTE = "/sessions";
export const ADMIN_DASHBOARD_ROUTE = "/dashboard";
export const DATA_MODEL_ROUTE = "/data-model";

export const HOME_ROUTE = "/";

/**
 * The app is organized into three top-level views. Driver and Admin map onto
 * backend user roles; Data Modeller is a client-only view that surfaces the
 * Data Model Explorer alongside the others.
 */
export type AppView = "driver" | "admin" | "dataModeller";

export const DRIVER_NAV_LINKS = [
  { href: HOME_ROUTE, label: "Home" },
  { href: DRIVER_HOME_ROUTE, label: "Station Finder" },
  { href: DRIVER_SESSIONS_ROUTE, label: "Session Activity" }
] as const;

export const ADMIN_NAV_LINKS = [
  { href: HOME_ROUTE, label: "Home" },
  { href: ADMIN_DASHBOARD_ROUTE, label: "Analytics Dashboard" }
] as const;

export const DATA_MODELLER_NAV_LINKS = [
  { href: HOME_ROUTE, label: "Home" },
  { href: DATA_MODEL_ROUTE, label: "Data Model Explorer" }
] as const;

export function isAdminRole(roles: UserRole[] | undefined): boolean {
  return roles?.includes(UserRole.Admin) ?? false;
}

export function getDefaultRouteForRoles(roles: UserRole[] | undefined): string {
  return isAdminRole(roles) ? ADMIN_DASHBOARD_ROUTE : DRIVER_HOME_ROUTE;
}

export function getDefaultRouteForRole(role: UserRole): string {
  return role === UserRole.Admin ? ADMIN_DASHBOARD_ROUTE : DRIVER_HOME_ROUTE;
}

export function getNavLinksForView(
  view: AppView
): ReadonlyArray<{ href: string; label: string }> {
  switch (view) {
    case "admin":
      return ADMIN_NAV_LINKS;
    case "dataModeller":
      return DATA_MODELLER_NAV_LINKS;
    default:
      return DRIVER_NAV_LINKS;
  }
}

export function getDefaultRouteForView(view: AppView): string {
  switch (view) {
    case "admin":
      return ADMIN_DASHBOARD_ROUTE;
    case "dataModeller":
      return DATA_MODEL_ROUTE;
    default:
      return DRIVER_HOME_ROUTE;
  }
}

/**
 * Resolves the active view from the current route, falling back to the user's
 * explicit view preference (used on shared routes like Home) and finally their
 * role. Route-specific pages always win so deep links show the right chrome.
 */
export function resolveActiveView(
  pathname: string,
  isAdmin: boolean,
  preference: AppView | null
): AppView {
  if (pathname.startsWith(DATA_MODEL_ROUTE)) return "dataModeller";
  if (pathname.startsWith(ADMIN_DASHBOARD_ROUTE)) return "admin";
  if (
    pathname.startsWith(DRIVER_HOME_ROUTE) ||
    pathname.startsWith(DRIVER_SESSIONS_ROUTE)
  ) {
    return "driver";
  }
  if (preference) return preference;
  return isAdmin ? "admin" : "driver";
}
