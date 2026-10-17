"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/blog/markdown";
import { Field, fieldAria, inputClass } from "@/components/admin/field";
import { FormActions, Section } from "@/components/admin/form-actions";
import { ImageField } from "@/components/admin/image-field";
import { TitleSlugFields } from "@/components/admin/slug-input";
import { useSaveResult } from "@/components/admin/use-save-result";
import type { ActionResult } from "@/lib/admin/validation";
import { saveBlog } from "@/app/admin/(panel)/blog/actions";

export type BlogFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  content?: string | null;
  tags?: string[] | null;
  keywords?: string[] | null;
  author?: string | null;
  thumbnail?: string | null;
  published_at?: string | null;
  reading_time?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

const CONTENT_HINT =
  "Markdown: ## and ### for headings, - for lists, **bold**, [link](https://…), ``` for code blocks.";

export function BlogForm({ post }: { post?: BlogFormValues }) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(saveBlog, null);
  useSaveResult(state, "/admin/blog", "Post");
  const [content, setContent] = useState(post?.content ?? "");
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-4xl space-y-8" noValidate>
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      {post?.slug && (
        <input type="hidden" name="previous_slug" value={post.slug} />
      )}

      <Section title="Post">
        <TitleSlugFields
          defaultTitle={post?.title}
          defaultSlug={post?.slug}
          basePath="/blog"
          errors={e}
        />
        <Field
          id="description"
          label="Summary"
          hint="Shown under the title, in the blog list and in search results."
          error={e?.description}
        >
          <Textarea
            {...fieldAria("description", e?.description)}
            defaultValue={post?.description ?? ""}
            rows={3}
            className={inputClass}
          />
        </Field>

        <div className="space-y-2">
          <label
            htmlFor="content"
            className="text-text-primary text-sm font-medium"
          >
            Article
          </label>
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent
              value="write"
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <Textarea
                {...fieldAria("content", e?.content, CONTENT_HINT)}
                value={content}
                onChange={(ev) => setContent(ev.target.value)}
                rows={22}
                className={`${inputClass} font-mono text-sm`}
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="border-border-subtle bg-bg-primary min-h-64 rounded-lg border p-6">
                {content.trim() ? (
                  <Markdown content={content} />
                ) : (
                  <p className="text-text-muted">Nothing to preview yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          {e?.content ? (
            <p id="content-error" role="alert" className="text-error text-sm">
              {e.content}
            </p>
          ) : (
            <p id="content-hint" className="text-text-muted text-sm">
              {CONTENT_HINT}
            </p>
          )}
        </div>
      </Section>

      <Section title="Details">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="author" label="Author" error={e?.author}>
            <Input
              {...fieldAria("author", e?.author)}
              defaultValue={post?.author ?? ""}
              className={inputClass}
            />
          </Field>
          <Field
            id="published_at"
            label="Publish date"
            hint="Leave empty for today."
            error={e?.published_at}
          >
            <Input
              {...fieldAria("published_at", e?.published_at)}
              type="date"
              defaultValue={post?.published_at?.slice(0, 10) ?? ""}
              className={inputClass}
            />
          </Field>
          <Field
            id="tags"
            label="Topics"
            hint="Comma separated, e.g. Next.js, Web Development"
            error={e?.tags}
          >
            <Input
              {...fieldAria("tags", e?.tags)}
              defaultValue={(post?.tags ?? []).join(", ")}
              className={inputClass}
            />
          </Field>
          <Field
            id="reading_time"
            label="Reading time (minutes)"
            hint="Leave at 0 to calculate it from the article."
            error={e?.reading_time}
          >
            <Input
              {...fieldAria("reading_time", e?.reading_time)}
              type="number"
              min={0}
              defaultValue={post?.reading_time ?? 0}
              className={inputClass}
            />
          </Field>
        </div>
        <ImageField
          name="thumbnail"
          label="Cover image"
          folder="blog"
          defaultValue={post?.thumbnail}
          error={e?.thumbnail}
        />
      </Section>

      <Section title="Search engines">
        <Field
          id="keywords"
          label="Keywords"
          hint="Comma separated."
          error={e?.keywords}
        >
          <Input
            {...fieldAria("keywords", e?.keywords)}
            defaultValue={(post?.keywords ?? []).join(", ")}
            className={inputClass}
          />
        </Field>
        <Field
          id="meta_title"
          label="SEO title"
          hint="Up to 70 characters."
          error={e?.meta_title}
        >
          <Input
            {...fieldAria("meta_title", e?.meta_title)}
            defaultValue={post?.meta_title ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          id="meta_description"
          label="SEO description"
          hint="Up to 170 characters."
          error={e?.meta_description}
        >
          <Textarea
            {...fieldAria("meta_description", e?.meta_description)}
            defaultValue={post?.meta_description ?? ""}
            rows={2}
            className={inputClass}
          />
        </Field>
      </Section>

      <FormActions pending={pending} cancelHref="/admin/blog" />
    </form>
  );
}
