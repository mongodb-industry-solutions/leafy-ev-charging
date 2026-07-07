"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { useUserContext } from "@/contexts/UserContext";
import { TALK_TRACK } from "@/lib/utils/const";
import {
  type AppView,
  getDefaultRouteForView,
  getNavLinksForView,
  isAdminRole,
  resolveActiveView
} from "@/lib/utils/roleNavigation";
import { InfoWizard } from "@/ui/InfoWizard";

type ViewOption = {
  view: AppView;
  /** Short label used in the switcher row. */
  label: string;
  /** Subtle one-liner shown under the label. */
  subtitle: string;
  /** Label shown next to the avatar, e.g. "Driver View". */
  viewLabel: string;
  icon: string;
  /** Avatar bubble background for the active view. */
  bubble: string;
  /** Hover ring color on the avatar. */
  ring: string;
  rowActiveBg: string;
  rowActiveText: string;
  rowIconActive: string;
  rowIconIdle: string;
  rowActiveLabel: string;
};

const VIEW_OPTIONS: ViewOption[] = [
  {
    view: "driver",
    label: "Driver",
    subtitle: "EV Charging Station App",
    viewLabel: "Driver View",
    icon: "directions_car",
    bubble: "bg-emerald-500",
    ring: "group-hover:ring-emerald-300",
    rowActiveBg: "bg-emerald-50",
    rowActiveText: "text-emerald-900",
    rowIconActive: "bg-emerald-500",
    rowIconIdle: "bg-emerald-300",
    rowActiveLabel: "text-emerald-600"
  },
  {
    view: "admin",
    label: "Admin",
    subtitle: "Charging Stations Operator",
    viewLabel: "Admin View",
    icon: "admin_panel_settings",
    bubble: "bg-amber-400",
    ring: "group-hover:ring-amber-300",
    rowActiveBg: "bg-amber-50",
    rowActiveText: "text-amber-900",
    rowIconActive: "bg-amber-400",
    rowIconIdle: "bg-amber-300",
    rowActiveLabel: "text-amber-600"
  },
  {
    view: "dataModeller",
    label: "Data Modeller",
    subtitle: "COVESA S2DM Model",
    viewLabel: "Data Modeller View",
    icon: "schema",
    bubble: "bg-slate-500",
    ring: "group-hover:ring-slate-300",
    rowActiveBg: "bg-slate-100",
    rowActiveText: "text-slate-900",
    rowIconActive: "bg-slate-500",
    rowIconIdle: "bg-slate-300",
    rowActiveLabel: "text-slate-600"
  }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedUser, viewPreference, setActiveView } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Render LeafyGreen widgets only after mount. They rely on client-injected
  // emotion styles, so server-rendering them causes a brief unstyled flash
  // (FOUC). A plain-CSS placeholder holds the exact footprint to avoid any
  // layout shift when the real button swaps in.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentUser = selectedUser;
  const isAdmin = isAdminRole(currentUser?.roles);
  const activeView = resolveActiveView(pathname, isAdmin, viewPreference);
  const activeOption =
    VIEW_OPTIONS.find((option) => option.view === activeView) ?? VIEW_OPTIONS[0];
  const navLinks = getNavLinksForView(activeView);

  const handleViewSelect = (view: AppView) => {
    setActiveView(view);
    setIsOpen(false);
    router.replace(getDefaultRouteForView(view));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Note: we intentionally render the header even before the guest identity has
  // loaded so the sticky h-16 bar always reserves its space. Returning null here
  // caused a layout shift (content jumped down) once the user resolved on the
  // client. The view chrome is derived from the route + preference, not the user.

  return (
    <header className="sticky top-0 z-[1100] flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex-shrink-0">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 text-inherit no-underline"
        >
          <Image
            src="/logo.png"
            alt="LeafyCharge"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />
          <span className="text-xl font-semibold text-slate-900">
            LeafyCharge
          </span>
        </Link>
      </div>

      <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        {navLinks.map(({ href, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-4 py-2 text-[0.9375rem] font-medium no-underline transition-colors ${
                isActive
                  ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-shrink-0 items-center gap-6">
        {mounted ? (
          <InfoWizard open={infoOpen} setOpen={setInfoOpen} sections={TALK_TRACK} />
        ) : (
          // Invisible spacer reserving the button's footprint so nothing shifts
          // when the real (client-only) LeafyGreen button appears after mount.
          <span
            aria-hidden
            className="invisible inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium"
          >
            <span className="inline-block h-4 w-4" />
            Tell me more!
          </span>
        )}
        <div ref={dropdownRef}>
          <div className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen((prev) => !prev);
                }
              }}
              className="group flex cursor-pointer items-center gap-3 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-slate-50"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-label="Change view"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-shadow group-hover:ring-2 group-hover:ring-offset-1 ${activeOption.ring} ${activeOption.bubble}`}
                aria-hidden
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24 }}
                >
                  {activeOption.icon}
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-900">
                  {activeOption.viewLabel}
                </span>
                <span className="flex items-center gap-0.5 text-[11px] font-medium text-slate-400">
                  Change view
                  <span
                    className={`material-symbols-outlined transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ fontSize: 14 }}
                  >
                    expand_more
                  </span>
                </span>
              </div>
            </div>

            {isOpen && (
              <div className="absolute right-0 top-full z-[1100] mt-2 w-65 overflow-hidden rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                {VIEW_OPTIONS.map((option) => {
                  const isSelected = option.view === activeView;
                  return (
                    <div
                      key={option.view}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleViewSelect(option.view)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 transition-colors ${
                        isSelected
                          ? `${option.rowActiveBg} ${option.rowActiveText}`
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                          isSelected ? option.rowIconActive : option.rowIconIdle
                        }`}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 22 }}
                        >
                          {option.icon}
                        </span>
                      </div>
                      <div>
                        <span className="text-[15px] font-semibold">
                          {option.label}
                        </span>
                        <p
                          className={`whitespace-nowrap text-[11px] font-medium ${
                            isSelected ? option.rowActiveLabel : "text-slate-400"
                          }`}
                        >
                          {option.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
