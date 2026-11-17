import Link from "next/link";
import { notFound } from "next/navigation";
import { getList } from "@/lib/data";
import { Avatar } from "@/components/avatar";
import { Poster } from "@/components/poster";
import { Icon } from "@/components/icon";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const list = await getList(id);
  if (!list) notFound();

  return (
    <div className="space-y-8">
      <Link
        href="/lists"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-txt"
      >
        <Icon name="compass" size={16} />
        All lists
      </Link>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <div className="flex w-40 shrink-0 items-end gap-1.5">
          {list.titles.slice(0, 3).map((t) => (
            <div key={t.id} className="w-1/3">
              <Poster title={t} art />
            </div>
          ))}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight">
            {list.title}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{list.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <Link
              href={`/profile/${list.owner.username}`}
              className="flex items-center gap-2 hover:text-txt"
            >
              <Avatar profile={list.owner} size="sm" className="!h-7 !w-7" />
              {list.owner.displayName}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="tv" size={15} />
              {list.titles.length} titles
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="heart" size={15} />
              {list.likes}
            </span>
          </div>
          <div className="mt-5 flex gap-2.5">
            <button className="btn-primary">
              <Icon name="heart" size={16} />
              Like list
            </button>
            <button className="btn-ghost">
              <Icon name="plus" size={16} />
              Save
            </button>
          </div>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {list.titles.map((t) => (
            <Poster key={t.id} title={t} size="sm" />
          ))}
        </div>
      </section>
    </div>
  );
}
