"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icon";
import { Avatar } from "./avatar";
import { signOut } from "@/app/actions";

type ShellUser = { username: string; displayName: string } | null;

function navFor(username: string) {
  return [
    { href: "/", label: "Home", icon: "home" as const },
    { href: "/lists", label: "Lists", icon: "list" as const },
    { href: `/profile/${username}`, label: "Profile", icon: "user" as const, match: "/profile" },
  ];
}

function isActive(pathname: string, item: { href: string; match?: string }) {
  if (item.href === "/") return pathname === "/";
  return pathname.startsWith(item.match ?? item.href);
}

export function AppShell({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: ShellUser;
}) {
  const pathname = usePathname();

  // No app chrome on auth screens.
  if (pathname.startsWith("/login") || pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  const username = currentUser?.username ?? "ella";
  const nav = navFor(username);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line px-4 py-6 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Icon name="playCircle" size={22} />
          </span>
          <span className="font-display text-xl font-black tracking-tight">WhosView</span>
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(pathname, item) ? "nav-item-active" : ""}`}
              aria-current={isActive(pathname, item) ? "page" : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <Link href="/party" className="btn-primary w-full">
            <Icon name="sparkles" size={18} />
            Start a watch party
          </Link>

          {currentUser && (
            <div className="flex items-center gap-2.5 border-t border-line pt-4">
              <Avatar
                profile={{
                  id: "me",
                  username: currentUser.username,
                  displayName: currentUser.displayName,
                  friendIds: [],
                }}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{currentUser.displayName}</div>
                <div className="truncate text-xs text-muted">@{currentUser.username}</div>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="press grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-white/[0.05] hover:text-txt"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <Icon name="play" size={16} className="rotate-180" />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-col pb-24 lg:pb-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-ink/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
              <Icon name="playCircle" size={20} />
            </span>
            <span className="font-display text-lg font-black">WhosView</span>
          </Link>
          <Link href="/party" className="btn-primary px-3 py-1.5 text-xs">
            <Icon name="sparkles" size={16} />
            Party
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-line bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Primary"
      >
        {nav.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                active ? "text-brand" : "text-muted"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon name={item.icon} size={22} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
