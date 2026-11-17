import type { Profile } from "@/lib/types";
import { avatarGradient, initials } from "@/lib/ui";

const dims: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-2xl",
};

export function Avatar({
  profile,
  size = "md",
  live = false,
  className = "",
}: {
  profile: Profile;
  size?: keyof typeof dims;
  live?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`grid place-items-center rounded-full font-display font-semibold text-white ring-1 ring-white/10 ${dims[size]}`}
        style={{ background: avatarGradient(profile.displayName) }}
        aria-hidden="true"
      >
        {initials(profile.displayName)}
      </div>
      {live && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ink">
          <span className="h-2.5 w-2.5 animate-livedot rounded-full bg-live" />
        </span>
      )}
    </div>
  );
}
