import Link from "next/link";
import type { ListView } from "@/lib/data";
import { Avatar } from "./avatar";
import { Poster } from "./poster";
import { Icon } from "./icon";

export function ListCard({ list }: { list: ListView }) {
  const covers = list.titles.slice(0, 4);
  return (
    <Link
      href={`/lists/${list.id}`}
      className="card press group block overflow-hidden p-4 transition hover:border-line2 hover:bg-panel focus-visible:border-line2"
    >
      {/* fanned poster stack */}
      <div className="flex items-end gap-2">
        {covers.map((t, i) => (
          <div
            key={t.id}
            className="w-1/4 transition-transform duration-200 group-hover:-translate-y-0.5"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            <Poster title={t} art />
          </div>
        ))}
      </div>

      <h3 className="mt-4 font-display text-base font-semibold leading-snug">{list.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{list.description}</p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Avatar profile={list.owner} size="sm" className="!h-6 !w-6" />
          <span>{list.owner.displayName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Icon name="tv" size={14} />
            {list.titles.length}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="heart" size={14} />
            {list.likes}
          </span>
        </div>
      </div>
    </Link>
  );
}
