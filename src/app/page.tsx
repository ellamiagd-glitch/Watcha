import Link from "next/link";
import {
  getCurrentUser,
  getFriendFeed,
  getFriendStatuses,
  getLiveNow,
  getPublicLists,
  getUserActivity,
} from "@/lib/data";
import { LiveCard, FeedItem } from "@/components/activity-card";
import { FriendStatus } from "@/components/friend-status";
import { ListCard } from "@/components/list-card";
import { Poster } from "@/components/poster";
import { Icon } from "@/components/icon";

export default async function HomePage() {
  const [me, live, feed, friends, lists, myActivity] = await Promise.all([
    getCurrentUser(),
    getLiveNow(),
    getFriendFeed(),
    getFriendStatuses(),
    getPublicLists(),
    getUserActivity(),
  ]);

  const resume = myActivity.find((v) => v.activity.status === "watching");
  const popular = lists.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Greeting + resume */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Hi, {me?.displayName ?? "there"}
          </h1>
        </div>
        {resume && (
          <Link
            href="/party"
            className="card press flex items-center gap-3 p-2.5 pr-4 transition hover:border-line2"
          >
            <div className="w-10 shrink-0">
              <Poster title={resume.title} art />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Jump back in
              </div>
              <div className="truncate text-sm font-semibold">{resume.title.name}</div>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white">
              <Icon name="play" size={18} />
            </span>
          </Link>
        )}
      </header>

      {/* Watching now */}
      {live.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title flex items-center gap-2">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="h-2 w-2 animate-livedot rounded-full bg-live" />
              </span>
              Watching now
            </h2>
            <span className="text-xs text-muted">{live.length} friends live</span>
          </div>
          <div className="stagger-children group -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
            {live.map((v) => (
              <LiveCard key={v.activity.id} view={v} />
            ))}
          </div>
        </section>
      )}

      {/* Feed + friends */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <section>
          <h2 className="section-title mb-2">Friend activity</h2>
          <div className="card stagger-children divide-y divide-line p-2">
            {feed.map((v) => (
              <FeedItem key={v.activity.id} view={v} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="section-title">Friends</h2>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                <Icon name="plus" size={14} />
                Add
              </button>
            </div>
            <div className="card stagger-children p-2">
              {friends.map(({ user, latest }) => (
                <FriendStatus key={user.id} user={user} latest={latest} />
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Popular lists */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Popular lists this week</h2>
          <Link href="/lists" className="text-xs font-medium text-brand hover:underline">
            Browse all
          </Link>
        </div>
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </section>
    </div>
  );
}
