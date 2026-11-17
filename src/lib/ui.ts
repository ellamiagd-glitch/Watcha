// Small presentation helpers used across the UI.

// Deterministic hash so the same string always yields the same colours.
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// A duotone gradient derived from a seed string — used for generated poster art.
export function posterGradient(seed: string): string {
  const h1 = hash(seed) % 360;
  const h2 = (h1 + 40 + (hash(seed + "x") % 60)) % 360;
  return `linear-gradient(145deg, hsl(${h1} 62% 32%), hsl(${h2} 58% 16%))`;
}

// A softer gradient for avatars.
export function avatarGradient(seed: string): string {
  const h1 = hash(seed) % 360;
  const h2 = (h1 + 55) % 360;
  return `linear-gradient(135deg, hsl(${h1} 60% 52%), hsl(${h2} 62% 40%))`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function timeAgo(minutesAgo: number): string {
  if (minutesAgo < 1) return "just now";
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const SERVICE_COLOR: Record<string, string> = {
  Netflix: "#e50914",
  "Disney+": "#1f80e0",
  "Prime Video": "#1399de",
  Max: "#7b2ff7",
  "Apple TV+": "#d1d1d6",
  Hulu: "#1ce783",
};

export function serviceColor(service: string): string {
  return SERVICE_COLOR[service] ?? "#8b5cff";
}
