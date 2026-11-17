"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Subscribes to Supabase Realtime on the activity table and refreshes the
// server-rendered feed whenever anyone's watching status changes — so the
// "Watching now" rail and friend feed update live, no manual reload.
export function LiveRefresher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const channel = supabase
      .channel("activity-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity" },
        () => {
          // Debounce bursts of changes into a single refresh.
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => router.refresh(), 400);
        },
      )
      .subscribe();

    return () => {
      if (timer) clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
