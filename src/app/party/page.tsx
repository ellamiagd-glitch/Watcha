import Link from "next/link";
import { Icon } from "@/components/icon";

export const metadata = { title: "Watch party — WhosView" };

const SERVICES = ["Netflix", "Disney+", "Prime Video", "Max", "Apple TV+", "Hulu"];

export default function PartyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-6 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white">
        <Icon name="sparkles" size={30} />
      </div>

      <div className="space-y-3">
        <span className="chip mx-auto">Coming soon</span>
        <h1 className="font-display text-3xl font-bold tracking-tight">Watch parties</h1>
        <p className="mx-auto max-w-lg text-muted">
          Start a room, invite friends, and press play together — synced to the second, with a
          live chat alongside. Everyone streams from their own account; WhosView just keeps you in
          time.
        </p>
      </div>

      <div className="card space-y-4 p-6 text-left">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
          How it will work
        </h2>
        <ul className="space-y-3 text-sm">
          {[
            "Install the WhosView browser extension",
            "Open a show on a supported service and hit “Start a party”",
            "Share the room link — playback stays in sync for everyone",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                {i + 1}
              </span>
              <span className="text-txt/90">{step}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-1">
          {SERVICES.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </div>

      <Link href="/" className="btn-ghost mx-auto">
        <Icon name="home" size={16} />
        Back home
      </Link>
    </div>
  );
}
