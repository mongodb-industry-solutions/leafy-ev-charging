"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { useUserContext } from "@/contexts/UserContext";
import { UserRole } from "@/graphql/generated/graphql";
import { AppView, getDefaultRouteForRoles } from "@/lib/utils/roleNavigation";

const noopSubscribe = () => () => {};

const ARCHITECTURE_IMAGE = {
  src: "/architecture.svg",
  alt: "Leafy EV Charging operational data layer architecture",
};

type Feature = {
  icon: string;
  title: string;
  description: string;
  tag: string;
  href: string;
  requiredRole?: UserRole;
  activeView?: AppView;
  iconBg: string;
  iconColor: string;
};

const FEATURES: Feature[] = [
  {
    icon: "map",
    title: "Station Finder",
    description:
      "Discover available charging stations on the map. View real-time availability and book a session.",
    tag: "Map View",
    href: "/map",
    requiredRole: UserRole.User,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: "ev_station",
    title: "Session Activity",
    description:
      "Track your charging sessions. Monitor status, energy delivered, and session history.",
    tag: "Sessions",
    href: "/sessions",
    requiredRole: UserRole.User,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: "analytics",
    title: "Admin Dashboard",
    description:
      "Monitor network-wide operations, fleet utilization, telemetry trends, and incident management.",
    tag: "Dashboard",
    href: "/dashboard",
    requiredRole: UserRole.Admin,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: "schema",
    title: "Data Model Explorer",
    description:
      "Follow the story from conceptual model to application and database behind this EV charging demo.",
    tag: "Data Model",
    href: "/data-model",
    activeView: "dataModeller",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

export function HomeScreen() {
  const router = useRouter();
  const { selectedUser, setRole, setActiveView } = useUserContext();
  const primaryHref = getDefaultRouteForRoles(selectedUser?.roles);

  const [expanded, setExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Only portal after mount so SSR and the client's first render agree,
  // avoiding a hydration mismatch on the portalled <dialog>.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!expanded) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expanded]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (expanded && !dialog.open) {
      dialog.showModal();
    } else if (!expanded && dialog.open) {
      dialog.close();
    }
  }, [expanded]);

  const handleFeatureClick =
    (feature: Feature) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (feature.activeView) {
        setActiveView(feature.activeView);
      }

      if (feature.requiredRole) {
        const currentRoles = selectedUser?.roles ?? [];
        if (!currentRoles.includes(feature.requiredRole)) {
          event.preventDefault();
          setRole(feature.requiredRole);
          router.push(feature.href);
        }
      }
    };

  const expandedOverlay =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <dialog
            ref={dialogRef}
            aria-label={ARCHITECTURE_IMAGE.alt}
            className="m-auto h-[90vh] w-[94vw] max-w-none overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-sm"
            onCancel={(event) => {
              event.preventDefault();
              setExpanded(false);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setExpanded(false);
            }}
          >
            <div className="relative h-full w-full">
              <Image
                src={ARCHITECTURE_IMAGE.src}
                alt={ARCHITECTURE_IMAGE.alt}
                className="p-6"
                priority
                fill
                style={{ objectFit: "contain" }}
              />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50"
                aria-label="Collapse image"
              >
                <svg
                  aria-hidden
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </dialog>,
          document.body
        )
      : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Leafy EV Charging"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
            Leafy EV Charging
          </h1>
        </div>

        <p className="mb-4 max-w-3xl text-sm text-slate-500 md:text-base">
          A unified operational data layer for the next-generation EV ecosystem
        </p>

        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group relative block w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
          aria-label="Expand architecture diagram"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={ARCHITECTURE_IMAGE.src}
              alt={ARCHITECTURE_IMAGE.alt}
              priority
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </button>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Explore the Demo
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              onClick={handleFeatureClick(feature)}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${feature.iconBg}`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${feature.iconColor}`}
                >
                  {feature.icon}
                </span>
              </div>

              <h3 className="mb-1 text-base font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 transition-colors group-hover:text-emerald-700">
                  {feature.tag}
                  <span className="ml-1 inline-block translate-x-0 transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-6 flex justify-center">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
        >
          <span className="material-symbols-outlined text-lg">bolt</span>
          Get Started
        </Link>
      </div>

      {expandedOverlay}
    </main>
  );
}
