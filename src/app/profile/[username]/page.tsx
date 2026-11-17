import { notFound } from "next/navigation";
import {
  getProfileByUsername,
  getListsByOwner,
  getUserActivity,
  CURRENT_USER_ID,
} from "@/lib/data";
import { Avatar } from "@/components/avatar";
import { ListCard } from "@/components/list-card";
import { FeedItem, LiveCard } from "@/components/activity-card";
import { Icon } from "@/components/icon";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const [lists, activity] = await Promise.all([
    getListsByOwner(profile.id),
    getUserActivity(profile.id),
  ]);

  const isMe = profile.id === CURRENT_USER_ID;
  const watching = activity.filter((v) => v.activity.status === "watching");
  const recent = activity.filter((v) => v.activity.status === "finished");

  return (
    <div className="space-y-10">
      {/* Profile header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar profile={profile} size="xl" live={watching.length > 0} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight">{profile.displayName}</h1>
          <p className="text-sm text-muted">@{profile.username}</p>
          {profile.bio && <p className="mt-2 max-w-xl text-sm text-txt/90">{profile.bio}</p>}
          <div className="mt-3 flex gap-5 text-sm text-muted">
            <span>
              <span className="font-semibold text-txt">{profile.friendIds.length}</span> friends
            </span>
            <span>
              <span className="font-semibold text-txt">{lists.length}</span>{" "}
              {lists.length === 1 ? "list" : "lists"}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          {isMe ? (
            <button className="btn-ghost">
              <Icon name="user" size={16} />
              Edit profile
            </button>
          ) : (
            <button className="btn-primary">
              <Icon name="plus" size={16} />
              Add friend
            </button>
          )}
        </div>
      </header>

      {/* Currently watching */}
      {watching.length > 0 && (
        <section>
          <h2 className="section-title mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-livedot rounded-full bg-live" />
            Watching now
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {watching.map((v) => (
              <LiveCard key={v.activity.id} view={v} />
            ))}
          </div>
        </section>
      )}

      {/* Lists */}
      <section>
        <h2 className="section-title mb-3">{isMe ? "Your lists" : "Lists"}</h2>
        {lists.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <div className="card grid place-items-center gap-2 p-10 text-center">
            <Icon name="list" size={28} className="text-muted" />
            <p className="text-sm text-muted">No lists yet.</p>
          </div>
        )}
      </section>

      {/* Recent activity */}
      {recent.length > 0 && (
        <section>
          <h2 className="section-title mb-3">Recently watched</h2>
          <div className="card divide-y divide-line p-2">
            {recent.map((v) => (
              <FeedItem key={v.activity.id} view={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
