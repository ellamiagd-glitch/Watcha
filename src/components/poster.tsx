import type { Title } from "@/lib/types";
import { posterGradient, serviceColor } from "@/lib/ui";

const sizes = {
  sm: "text-[13px]",
  md: "text-sm",
  lg: "text-base",
} as const;

// Generated duotone poster art — rights-clean, never broken. Real artwork from a
// movie-database API swaps into this same component later.
export function Poster({
  title,
  size = "md",
  art = false,
  className = "",
}: {
  title: Title;
  size?: keyof typeof sizes;
  // Art-only (no text overlay) — use for thumbnail-sized posters.
  art?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-line ${className}`}
      style={{ background: posterGradient(title.name) }}
      title={art ? `${title.name} (${title.year})` : undefined}
    >
      {/* texture + vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_-10%,rgba(255,255,255,0.22),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {art && (
        <span
          className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ring-2 ring-black/30"
          style={{ background: serviceColor(title.service) }}
        />
      )}

      {!art && (
        <>
          {/* service chip */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: serviceColor(title.service) }}
            />
            <span className="text-[10px] font-semibold tracking-wide text-white/90">
              {title.service}
            </span>
          </div>

          {/* title block */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className={`font-display font-semibold leading-tight text-white ${sizes[size]}`}>
              {title.name}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
              <span>{title.year}</span>
              <span aria-hidden>·</span>
              <span className="capitalize">{title.type}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
