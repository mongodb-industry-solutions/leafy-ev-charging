"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { UserRole, type User } from "@/graphql/generated/graphql";
import {
  getOrInitGuestIdentity,
  getStoredView,
  setGuestRole,
  setStoredView
} from "@/lib/utils/guestIdentity";
import { type AppView, isAdminRole } from "@/lib/utils/roleNavigation";

type UserContextValue = {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  /** The user's preferred top-level view (driver / admin / data modeller). */
  viewPreference: AppView;
  /** Switch to a view, syncing the underlying role for driver / admin. */
  setActiveView: (view: AppView) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUserState] = useState<User | null>(null);
  const [viewPreference, setViewPreferenceState] = useState<AppView>("driver");

  useEffect(() => {
    // Initialize guest identity on client side
    const guest = getOrInitGuestIdentity();
    const storedView =
      getStoredView() ?? (isAdminRole(guest.roles) ? "admin" : "driver");
    const frameId = window.requestAnimationFrame(() => {
      setSelectedUserState(guest);
      setViewPreferenceState(storedView);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const setSelectedUser = useCallback((user: User | null) => {
    setSelectedUserState(user);
    if (user?.roles[0]) {
      setGuestRole(user.roles[0]);
    }
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setSelectedUserState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        roles: [role]
      };
    });
    setGuestRole(role);
    const view: AppView = role === UserRole.Admin ? "admin" : "driver";
    setViewPreferenceState(view);
    setStoredView(view);
  }, []);

  const setActiveView = useCallback(
    (view: AppView) => {
      if (view === "admin") {
        setRole(UserRole.Admin);
      } else if (view === "driver") {
        setRole(UserRole.User);
      } else {
        setViewPreferenceState("dataModeller");
        setStoredView("dataModeller");
      }
    },
    [setRole]
  );

  const toggleRole = useCallback(() => {
    const nextRole = selectedUser?.roles.includes(UserRole.Admin)
      ? UserRole.User
      : UserRole.Admin;

    if (!selectedUser) {
      return;
    }

    setRole(nextRole);
  }, [selectedUser, setRole]);

  const value = useMemo(
    () => ({
      selectedUser,
      setSelectedUser,
      setRole,
      toggleRole,
      viewPreference,
      setActiveView
    }),
    [
      selectedUser,
      setRole,
      setSelectedUser,
      toggleRole,
      viewPreference,
      setActiveView
    ]
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return ctx;
}
