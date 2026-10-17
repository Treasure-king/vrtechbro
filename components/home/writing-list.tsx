import Link from "next/link";
import { RevealItem } from "@/components/motion/reveal-item";
import { Spotlight } from "@/components/motion/spotlight";
import type { BlogCardProps } from "@/types/blog-card";

/** Latest posts as a dated list, the way a journal's contents page reads. */
export function WritingList({ posts }: { posts: BlogCardProps[] }) {
  return (
    <ul className="border-border-subtle border-t">
      {posts.map((post, i) => (
        <RevealItem
          key={post.slug}
          index={i}
          className="border-border-subtle border-b"
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group focus-visible:bg-bg-secondary block outline-none"
          >
            <Spotlight className="grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4">
              <span className="text-text-muted text-sm md:col-span-2">
                {post.published_at && (
                  <time dateTime={new Date(post.published_at).toISOString()}>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
              </span>
              <h3 className="font-display text-text-primary group-hover:text-accent-hover text-xl font-semibold tracking-tight transition-colors md:col-span-7">
                {post.title}
              </h3>
              <span className="text-text-muted text-sm md:col-span-3 md:text-right">
                {(post.tags ?? []).slice(0, 2).join(", ")}
              </span>
            </Spotlight>
          </Link>
        </RevealItem>
      ))}
    </ul>
  );
}
