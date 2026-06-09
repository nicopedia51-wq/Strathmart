import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Heart,
  MessageCircle,
  Share2,
  Plus,
  X,
  Upload,
  Filter,
  Trophy,
  GraduationCap,
  Users,
  HeartHandshake,
  Briefcase,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  useActivityClips,
  activitiesStore,
  type ActivityClip,
} from "@/lib/activities-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "School Activities — StrathMart" },
      {
        name: "description",
        content:
          "Live feed of campus events: tournaments, club meetings, career talks, and clips from on-campus action.",
      },
    ],
  }),
  component: ActivitiesPage,
});

const tagIcons: Record<ActivityClip["activityTag"], typeof Trophy> = {
  Sports: Trophy,
  Academic: GraduationCap,
  Club: Users,
  "Campus Life": HeartHandshake,
  Career: Briefcase,
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function ActivitiesPage() {
  const clips = useActivityClips();
  const [tag, setTag] = useState<ActivityClip["activityTag"] | "All">("All");
  const [showPost, setShowPost] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);

  const visible = tag === "All" ? clips : clips.filter((c) => c.activityTag === tag);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Sticky filter + post bar */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto px-4 py-3 lg:px-0">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {(["All", "Sports", "Academic", "Club", "Campus Life", "Career"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTag(t as ActivityClip["activityTag"] | "All")}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                tag === t
                  ? "gradient-accent text-accent-foreground shadow-card"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setShowPost(true)}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full gradient-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-card"
          >
            <Plus className="h-3.5 w-3.5" /> Post
          </button>
        </div>
      </div>

      {/* Vertical feed */}
      <main className="mx-auto max-w-md px-0 py-4 md:max-w-lg lg:max-w-xl">
        {visible.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <p className="text-lg font-semibold text-muted-foreground">No posts yet.</p>
            <p className="text-sm text-muted-foreground">Be the first to share an update.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((c) => {
              const Icon = tagIcons[c.activityTag];
              return (
                <article
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                >
                  {/* author bar */}
                  <header className="flex items-center gap-3 px-4 py-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full gradient-accent text-sm font-bold text-accent-foreground">
                      {c.author.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold leading-tight">{c.author}</div>
                      <div className="text-[11px] text-muted-foreground">{c.authorRole} · {timeAgo(c.postedAt)}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-foreground">
                      <Icon className="h-3 w-3 text-accent" /> {c.activityTag}
                    </span>
                  </header>

                  {/* media */}
                  {c.mediaUrl && (
                    <div className="relative aspect-square w-full bg-black">
                      {c.mediaType === "video" ? (
                        <video src={c.mediaUrl} controls className="h-full w-full object-contain" />
                      ) : (
                        <img src={c.mediaUrl} alt={c.activityTitle} className="h-full w-full object-cover" />
                      )}
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {c.activityTitle}
                      </div>
                    </div>
                  )}

                  {/* actions */}
                  <div className="flex items-center gap-4 px-4 py-3">
                    <button
                      onClick={() => activitiesStore.toggleLike(c.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold transition",
                        c.likedByMe ? "text-destructive" : "text-foreground hover:text-destructive",
                      )}
                    >
                      <Heart className={cn("h-5 w-5", c.likedByMe && "fill-destructive")} />
                      {c.likes}
                    </button>
                    <button
                      onClick={() => setOpenComments(openComments === c.id ? null : c.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-accent"
                    >
                      <MessageCircle className="h-5 w-5" />
                      {c.comments.length}
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: c.activityTitle,
                            text: c.caption,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(c.caption);
                        }
                      }}
                      className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold hover:text-accent"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* caption */}
                  <div className="px-4 pb-3 text-sm">
                    <span className="font-bold">{c.author}</span> <span className="text-foreground">{c.caption}</span>
                  </div>

                  {/* comments */}
                  {openComments === c.id && <Comments clip={c} />}
                </article>
              );
            })}
          </div>
        )}
      </main>

      {showPost && <PostClipDialog onClose={() => setShowPost(false)} />}

      <SiteFooter />
    </div>
  );
}

function Comments({ clip }: { clip: ActivityClip }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    activitiesStore.addComment(clip.id, author.trim() || "Anonymous", text.trim());
    setText("");
  }

  return (
    <div className="border-t border-border bg-secondary/40 p-4">
      {clip.comments.length === 0 ? (
        <p className="text-xs text-muted-foreground">Be the first to comment.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {clip.comments.map((c) => (
            <li key={c.id}>
              <span className="font-semibold">{c.author}</span>{" "}
              <span className="text-foreground">{c.text}</span>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="h-9 w-28 rounded-full border border-border bg-card px-3 text-xs outline-none focus:border-accent"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="h-9 flex-1 rounded-full border border-border bg-card px-3 text-xs outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-full gradient-accent px-4 text-xs font-semibold text-accent-foreground">
          Post
        </button>
      </form>
    </div>
  );
}

function PostClipDialog({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityTag, setActivityTag] = useState<ActivityClip["activityTag"]>("Campus Life");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("Student");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("File must be under 8 MB.");
      return;
    }
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    const reader = new FileReader();
    reader.onload = () => setMediaUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!caption.trim() || !activityTitle.trim() || !author.trim()) {
      setError("Please fill in name, activity and a caption.");
      return;
    }
    activitiesStore.add({
      caption: caption.trim(),
      activityTitle: activityTitle.trim(),
      activityTag,
      author: author.trim(),
      authorRole: authorRole.trim() || "Student",
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-hover"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Share an activity clip</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Post a photo, short clip, or update from a campus event.</p>

        {error && <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Photo or short video (optional)</span>
            <label className="grid h-40 w-full cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary hover:border-accent">
              {mediaUrl ? (
                mediaType === "video" ? (
                  <video src={mediaUrl} className="h-full w-full object-cover" />
                ) : (
                  <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Tap to upload (image or video, max 8 MB)</p>
                </div>
              )}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={onFile} />
            </label>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Caption</span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="What's happening?"
              className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <Field label="Activity / event" value={activityTitle} onChange={setActivityTitle} placeholder="e.g., Inter-Faculty Football" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Your name" value={author} onChange={setAuthor} placeholder="Jane W." />
            <Field label="Role (optional)" value={authorRole} onChange={setAuthorRole} placeholder="Student / Club / Office" />
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Tag</span>
            <select
              value={activityTag}
              onChange={(e) => setActivityTag(e.target.value as ActivityClip["activityTag"])}
              className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm"
            >
              <option>Sports</option>
              <option>Academic</option>
              <option>Club</option>
              <option>Campus Life</option>
              <option>Career</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-11 flex-1 rounded-full border border-border bg-card text-sm font-semibold hover:bg-secondary">
            Cancel
          </button>
          <button type="submit" className="h-11 flex-1 rounded-full gradient-accent text-sm font-semibold text-accent-foreground shadow-card">
            Post to feed
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
