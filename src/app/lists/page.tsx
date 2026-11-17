import { getPublicLists } from "@/lib/data";
import { ListCard } from "@/components/list-card";

export const metadata = { title: "Lists — WhosView" };

export default async function ListsPage() {
  const lists = await getPublicLists();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Lists</h1>
        <p className="mt-1 text-sm text-muted">
          Public collections of shows and films, curated by the community.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}
