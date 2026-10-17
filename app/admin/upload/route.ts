import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/auth";

// Route handler rather than a server action: server actions cap bodies at 1 MB.
// 4 MB keeps uploads under Vercel's 4.5 MB request limit.
const MAX_BYTES = 4 * 1024 * 1024;
const FOLDERS = new Set(["services", "blog"]);

type Detected = { mime: string; ext: string };

/** Identify the image from its first bytes; the browser-supplied type is not trusted. */
function detectImage(b: Buffer): Detected | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return { mime: "image/jpeg", ext: "jpg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { mime: "image/png", ext: "png" };
  if (
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  )
    return { mime: "image/webp", ext: "webp" };
  if (
    b.toString("ascii", 4, 8) === "ftyp" &&
    ["avif", "avis"].includes(b.toString("ascii", 8, 12))
  )
    return { mime: "image/avif", ext: "avif" };
  return null;
}

/** Host of an Origin header, or null if it isn't a valid URL (e.g. the literal "null"). */
function safeHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  // CSRF: only accept same-origin requests from the admin UI
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host || safeHost(origin) !== host) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Sign in as an admin to upload." },
      { status: 401 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }
  if (!FOLDERS.has(folder)) {
    return NextResponse.json(
      { error: "Invalid upload folder." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Images must be 4 MB or smaller." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImage(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP or AVIF image." },
      { status: 400 },
    );
  }

  const path = `${folder}/${randomUUID()}.${detected.ext}`;
  const { error } = await admin.supabase.storage
    .from("media")
    .upload(path, buffer, {
      contentType: detected.mime,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) {
    console.error("Admin upload failed:", error.message);
    return NextResponse.json(
      { error: "Upload failed. Try again." },
      { status: 500 },
    );
  }

  const {
    data: { publicUrl },
  } = admin.supabase.storage.from("media").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl });
}
