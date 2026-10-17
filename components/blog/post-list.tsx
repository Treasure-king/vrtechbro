"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { cn } from "@/lib/utils";
import type { BlogCardProps } from "@/types/blog-card";

/**
 * The full list of posts. Without JavaScript every post is shown; once hydrated,
 * topic buttons appear and narrow the list by tag.
 */
const noopSubscribe = () => () => {};

export function PostList({ posts }: { posts: BlogCardProps[] }) {
  const [topic, setTopic] = useState<string | null>(null);

  // false during server rendering and hydration, true once running in the browser
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts)
      for (const tag of post.tags ?? [])
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 8);
  }, [posts]);

  const visible = topic ? posts.filter((p) => p.tags?.includes(topic)) : posts;

  const chip = (label: string, value: string | null) => (
    <button
      key={label}
      type="button"
      aria-pressed={topic === value}
      onClick={() => setTopic(value)}
      className={cn(
        "focus-visible:outline-accent-primary cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        topic === value
          ? "border-accent-primary bg-accent-primary/10 text-text-primary"
          : "border-border-subtle text-text-secondary hover:border-border-strong hover:text-text-primary",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      {ready && topics.length > 1 && (
        <div
          role="group"
          aria-label="Filter articles by topic"
          className="mb-8 flex flex-wrap gap-2"
        >
          {chip("All topics", null)}
          {topics.map((t) => chip(t, t))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {topic ? `Showing ${visible.length} articles about ${topic}` : ""}
      </p>
      <div className="border-border-subtle border-t">
        {visible.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  );
}
