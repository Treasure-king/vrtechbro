"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, fieldAria, inputClass } from "@/components/admin/field";

/**
 * Image URL field with an upload button. Uploading stores the file in the
 * Supabase "media" bucket (via /admin/upload) and fills in its public URL.
 */
export function ImageField({
  name,
  label,
  folder,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  folder: "services" | "blog";
  defaultValue?: string | null;
  error?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const hint =
    "Upload a JPEG, PNG, WebP or AVIF up to 4 MB, or paste an image address.";

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/admin/upload", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload failed. Try again.");
        return;
      }
      setUrl(data.url);
      toast.success("Image uploaded");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const previewable = /^https:\/\//i.test(url) || url.startsWith("/images/");

  return (
    <Field id={name} label={label} hint={hint} error={error}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          {...fieldAria(name, error, hint)}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… or /images/…"
          className={inputClass}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          id={`${name}-file`}
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          isLoading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {!uploading && <Upload className="h-4 w-4" />}
          Upload image
        </Button>
      </div>
      {previewable && (
        <div className="border-border-subtle relative mt-2 aspect-video w-48 overflow-hidden rounded-lg border">
          <Image
            src={url}
            alt=""
            fill
            sizes="192px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}
    </Field>
  );
}
