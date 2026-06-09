import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, X, Heart, MessageCircle, Share2, Shield, Lock, Globe2, EyeOff,
  Sparkles, AlertTriangle, Send, Video, Image as ImageIcon, Home, Compass,
  Users, Radio, Bookmark, Music2, Plus, MoreHorizontal,
  ShoppingBag, Utensils,
} from "lucide-react";
import { toast } from "sonner";
import {
  momentsStore, useMoments, moderate, type Privacy, type Moment,
} from "@/lib/moments-store";
import { notificationsStore } from "@/lib/notifications-store";

export const Route = createFileRoute("/moments")({
  head: () => ({
    meta: [
      { title: "Campus Moments — StrathMart" },
      { name: "description", content: "TikTok-style campus video feed for Strathmore students. Record, filter, share and like moments with AI content guard." },
    ],
  }),
  component: MomentsPage,
});

const FILTERS = [
  { id: "none", label: "Original", css: "" },
  { id: "vivid", label: "Vivid", css: "saturate(1.6) contrast(1.1)" },
  { id: "warm", label: "Campus Warm", css: "sepia(0.3) saturate(1.3) hue-rotate(-10deg)" },
  { id: "noir", label: "Library Noir", css: "grayscale(1) contrast(1.2)" },
  { id: "night", label: "Campus Night", css: "brightness(0.85) saturate(1.4) hue-rotate(190deg)" },
  { id: "beauty", label: "Beauty", css: "brightness(1.1) saturate(1.15) blur(0.3px)" },
];

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function extractHashtags(t: string) {
  return Array.from(t.matchAll(/#[\p{L}0-9_]+/gu)).map((m) => m[0]);
}

// ===================== PAGE =====================
function MomentsPage() {
  const moments = useMoments();
  const [camOpen, setCamOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop 3-col grid; mobile = single full-screen feed */}
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)_340px] lg:gap-0">
        {/* LEFT SIDEBAR — desktop only */}
        <LeftSidebar onRecord={() => setCamOpen(true)} />

        {/* CENTER FEED */}
        <main className="relative h-[100dvh] snap-y snap-mandatory overflow-y-scroll lg:h-screen">
          {moments.length === 0 ? (
            <EmptyState onRecord={() => setCamOpen(true)} />
          ) : (
            moments.map((m) => <MomentSlide key={m.id} moment={m} />)
          )}
        </main>

        {/* RIGHT SIDEBAR — desktop only */}
        <RightSidebar />
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setCamOpen(true)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 shadow-[0_10px_30px_-6px_rgba(255,80,80,0.7)] lg:hidden"
        aria-label="Record"
      >
        <Camera className="h-6 w-6 text-white" />
      </button>

      {camOpen && <CameraStudio onClose={() => setCamOpen(false)} />}
    </div>
  );
}

// ===================== LEFT SIDEBAR =====================
function LeftSidebar({ onRecord }: { onRecord: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/moments", label: "For You", icon: Home, active: pathname === "/moments" },
    { to: "/products", label: "Marketplace", icon: ShoppingBag },
    { to: "/meals", label: "Cafeteria", icon: Utensils },
    { to: "/activities", label: "Activities", icon: Compass },
    { to: "/sellers", label: "Sellers", icon: Users },
    { to: "/", label: "Home", icon: Radio },
  ];
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/5 bg-black px-3 py-5 lg:flex">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 font-display text-lg font-black text-white">
          S
        </div>
        <span className="font-display text-xl font-bold">StrathMart</span>
      </Link>
      <nav className="space-y-0.5">
        {items.map((it) => (
          <Link
            key={it.label}
            to={it.to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold transition ${
              it.active ? "bg-white/5 text-rose-500" : "text-white/80 hover:bg-white/5"
            }`}
          >
            <it.icon className="h-6 w-6" />
            {it.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={onRecord}
        className="mt-5 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-rose-500 to-orange-400 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.02]"
      >
        <Plus className="h-4 w-4" /> Upload
      </button>
      <div className="mt-auto px-2 text-[11px] text-white/40">
        <div className="mb-2 font-semibold text-white/60">AI Content Guard · Active</div>
        Posts are auto-scanned. Violations result in a 30-day suspension.
      </div>
    </aside>
  );
}

// ===================== RIGHT SIDEBAR =====================
function RightSidebar() {
  const tags = ["#StrathLife", "#FinalsWeek", "#FacultyLeague", "#StrathEats", "#CampusFits", "#OpenMicStrath"];
  return (
    <aside className="sticky top-0 hidden h-screen flex-col gap-4 overflow-y-auto border-l border-white/5 bg-black px-4 py-5 lg:flex">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-rose-500" /> Trending on Campus
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80">{t}</span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <Radio className="h-4 w-4 text-rose-500" /> LIVE now
        </div>
        {[
          { n: "Sports Office", v: "Faculty League · Field 2" },
          { n: "Music Society", v: "Open mic · Auditorium" },
        ].map((l) => (
          <div key={l.n} className="mb-2 flex items-center gap-3">
            <div className="relative">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-xs font-bold">
                {l.n.split(" ").map((w) => w[0]).join("")}
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-rose-500 px-1 text-[8px] font-bold">LIVE</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">{l.n}</div>
              <div className="truncate text-[10px] text-white/50">{l.v}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[11px] text-white/50">
        © StrathMart · Campus Moments · Be kind. Be real.
      </div>
    </aside>
  );
}

// ===================== EMPTY =====================
function EmptyState({ onRecord }: { onRecord: () => void }) {
  return (
    <div className="grid h-[100dvh] place-items-center px-6 text-center lg:h-screen">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400">
          <Camera className="h-10 w-10" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Be the first to post a moment</h2>
        <p className="mt-1 text-sm text-white/60">Drop a clip, a confession, or a campus highlight.</p>
        <button onClick={onRecord} className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black">
          Record now
        </button>
      </div>
    </div>
  );
}

// ===================== MOMENT SLIDE (TikTok-style) =====================
function MomentSlide({ moment }: { moment: Moment }) {
  const filter = FILTERS.find((f) => f.id === moment.filter)?.css || "";
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showComments, setShowComments] = useState(false);
  const tapRef = useRef<number>(0);

  const privacyMeta: Record<Privacy, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
    anonymous: { icon: EyeOff, label: "Anonymous" },
    school: { icon: Lock, label: "School Only" },
    public: { icon: Globe2, label: "Public" },
  };
  const P = privacyMeta[moment.privacy];

  function onTap(e: React.MouseEvent | React.TouchEvent) {
    const now = Date.now();
    const target = e.currentTarget.getBoundingClientRect();
    let cx = target.width / 2, cy = target.height / 2;
    if ("touches" in e && e.touches[0]) {
      cx = e.touches[0].clientX - target.left;
      cy = e.touches[0].clientY - target.top;
    } else if ("clientX" in e) {
      cx = (e as React.MouseEvent).clientX - target.left;
      cy = (e as React.MouseEvent).clientY - target.top;
    }
    if (now - tapRef.current < 300) {
      if (!moment.likedByMe) momentsStore.toggleLike(moment.id);
      const id = Date.now();
      setBursts((b) => [...b, { id, x: cx, y: cy }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
    }
    tapRef.current = now;
  }

  return (
    <section className="relative flex h-[100dvh] snap-start items-center justify-center bg-black lg:h-screen">
      {/* Vertical video frame — phone-shaped on desktop */}
      <div
        className="relative h-full w-full overflow-hidden bg-black lg:h-[min(92vh,900px)] lg:w-[min(440px,calc((100vh-4rem)*9/16))] lg:rounded-2xl lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
        onClick={onTap}
      >
        {moment.mediaType === "video" ? (
          <video
            src={moment.mediaUrl}
            className="h-full w-full object-cover"
            style={{ filter }}
            playsInline
            loop
            muted
            autoPlay
          />
        ) : (
          <img
            src={moment.mediaUrl}
            alt={moment.caption}
            className="h-full w-full object-cover"
            style={{ filter }}
          />
        )}

        {/* gradient overlay for text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* heart bursts */}
        <AnimatePresence>
          {bursts.map((b) => (
            <BurstHeart key={b.id} x={b.x} y={b.y} />
          ))}
        </AnimatePresence>

        {/* author + caption */}
        <div className="absolute bottom-4 left-4 right-20 z-10 text-white">
          <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
            <P.icon className="h-3 w-3" /> {P.label}
          </div>
          <div className="text-base font-bold">@{moment.author.toLowerCase().replace(/\s+/g, "_")}</div>
          <p className="mt-1 line-clamp-3 text-sm">{moment.caption}</p>
          {moment.hashtags.length > 0 && (
            <p className="mt-1 text-xs font-semibold text-white/90">{moment.hashtags.join(" ")}</p>
          )}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/70">
            <Music2 className="h-3 w-3" />
            <div className="truncate">original sound · {moment.author}</div>
          </div>
        </div>

        {/* right action rail (TikTok-style) */}
        <div className="absolute bottom-6 right-2 z-10 flex flex-col items-center gap-4 text-white">
          <div className="relative">
            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-rose-500 to-orange-400 text-sm font-bold">
              {moment.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <span className="absolute -bottom-1.5 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-rose-500 text-white">
              <Plus className="h-3 w-3" />
            </span>
          </div>
          <ActionButton
            icon={Heart}
            label={String(moment.likes)}
            active={moment.likedByMe}
            onClick={() => momentsStore.toggleLike(moment.id)}
          />
          <ActionButton icon={MessageCircle} label={String(moment.comments.length)} onClick={() => setShowComments(true)} />
          <ActionButton icon={Bookmark} label="Save" />
          <ActionButton icon={Share2} label="Share" />
          <button className="grid h-10 w-10 place-items-center text-white/80">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {/* spinning music disc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="mt-1 grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black"
          >
            <Music2 className="h-4 w-4" />
          </motion.div>
        </div>

        {/* top badge */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 text-[11px] text-white/80">
          <Shield className="h-3 w-3 text-emerald-400" /> AI Guard · {timeAgo(moment.postedAt)}
        </div>
      </div>

      <CommentsSheet
        open={showComments}
        onClose={() => setShowComments(false)}
        moment={moment}
      />
    </section>
  );
}

function ActionButton({
  icon: Icon, label, active, onClick,
}: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 text-white">
      <motion.div
        whileTap={{ scale: 0.85 }}
        className={`grid h-11 w-11 place-items-center rounded-full bg-black/30 backdrop-blur-md`}
      >
        <Icon className={`h-6 w-6 transition ${active ? "fill-rose-500 text-rose-500" : ""}`} />
      </motion.div>
      <span className="text-[11px] font-semibold drop-shadow">{label}</span>
    </button>
  );
}

function BurstHeart({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.4, rotateZ: -20 }}
      animate={{ opacity: 1, scale: 1.3, rotateZ: 0 }}
      exit={{ opacity: 0, scale: 1.8, y: -80 }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Heart className="h-28 w-28 fill-rose-500 text-rose-500 drop-shadow-[0_0_40px_rgba(244,63,94,0.8)]" />
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-rose-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 90,
              y: Math.sin(angle) * 90,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </motion.div>
  );
}

// ===================== COMMENTS DRAWER =====================
function CommentsSheet({ open, onClose, moment }: { open: boolean; onClose: () => void; moment: Moment }) {
  const [text, setText] = useState("");
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[75vh] rounded-t-3xl border-t border-white/10 bg-zinc-950 text-white shadow-2xl lg:inset-x-auto lg:right-8 lg:bottom-8 lg:w-[380px] lg:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="font-bold">{moment.comments.length} comments</div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto px-4 py-3">
              {moment.comments.length === 0 && (
                <div className="py-8 text-center text-sm text-white/50">Be the first to comment.</div>
              )}
              <AnimatePresence initial={false}>
                {moment.comments.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-xs font-bold">
                      {c.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 rounded-2xl bg-white/5 px-3 py-2">
                      <div className="text-xs font-bold">{c.author}</div>
                      <div className="text-sm">{c.text}</div>
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-white/40">
                        <span>{timeAgo(c.at)}</span>
                        <button className="hover:text-white">Reply</button>
                        <button className="inline-flex items-center gap-0.5 hover:text-rose-400">
                          <Heart className="h-3 w-3" /> 0
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!text.trim()) return;
                const v = moderate(text);
                if (!v.ok) {
                  toast.error("Comment blocked by AI Content Guard", { description: v.reasons.join(", ") });
                  return;
                }
                momentsStore.addComment(moment.id, "You", text.trim());
                setText("");
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="h-10 flex-1 rounded-full bg-white/5 px-4 text-sm outline-none focus:bg-white/10"
              />
              <button className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ===================== CAMERA STUDIO =====================
function CameraStudio({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [filter, setFilter] = useState("none");
  const [snap, setSnap] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("school");
  const [camError, setCamError] = useState<string | null>(null);
  const [banUntil, setBanUntil] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        setCamError("Camera unavailable. You can still pick an image or video from your device.");
      }
    })();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capture() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 720;
    canvas.height = v.videoHeight || 1280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.filter = FILTERS.find((f) => f.id === filter)?.css || "none";
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    setSnap(canvas.toDataURL("image/jpeg", 0.8));
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setSnap(reader.result as string);
    reader.readAsDataURL(f);
  }

  function publish() {
    if (!snap) { toast.error("Capture or upload a moment first"); return; }
    const text = `${caption} ${extractHashtags(caption).join(" ")}`;
    const verdict = moderate(text);
    if (!verdict.ok) {
      const until = new Date(Date.now() + verdict.banDays * 86400 * 1000).toISOString();
      setBanUntil(until);
      notificationsStore.push({
        kind: "system",
        title: "🚫 Account Under Investigation",
        body: `Violation of Campus Policy. Posting suspended for ${verdict.banDays} days.`,
      });
      return;
    }
    try {
      momentsStore.add({
        mediaUrl: snap,
        mediaType: "image",
        caption: caption.trim() || "—",
        hashtags: extractHashtags(caption),
        filter,
        privacy,
        author: privacy === "anonymous" ? "Anonymous" : "You",
      });
      notificationsStore.push({
        kind: "like",
        title: "Moment published ✨",
        body: "AI Content Guard cleared your post.",
        href: "/moments",
      });
      onClose();
    } catch (err) {
      toast.error("Could not save", { description: (err as Error).message });
    }
  }

  if (banUntil) {
    return (
      <div className="fixed inset-0 z-[60] grid place-items-center bg-black/85 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="max-w-md rounded-3xl border-2 border-rose-500 bg-zinc-950 p-6 text-center text-white shadow-2xl"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-500/15">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-rose-500">Account Under Investigation</h2>
          <p className="mt-2 text-sm text-white/70">
            Your post was blocked for <strong>Violation of Campus Policy</strong>. Posting suspended for <strong>30 days</strong>.
          </p>
          <button onClick={onClose} className="mt-5 w-full rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black">
            I understand
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
    >
      <header className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20">
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-4 w-4 text-emerald-400" /> AI Content Guard armed
        </div>
        <button
          onClick={publish}
          disabled={!snap}
          className="rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-1.5 text-sm font-bold text-white disabled:opacity-40"
        >
          Post
        </button>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {snap ? (
          <img src={snap} alt="preview" className="h-full w-full object-cover" style={{ filter: FILTERS.find((f) => f.id === filter)?.css }} />
        ) : (
          <video
            ref={videoRef} autoPlay playsInline muted
            className="h-full w-full object-cover"
            style={{ filter: FILTERS.find((f) => f.id === filter)?.css }}
          />
        )}
        {camError && !snap && (
          <div className="absolute inset-0 grid place-items-center bg-black/70 p-6 text-center text-sm">
            <div>
              <Video className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p className="mb-4 text-white/80">{camError}</p>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 text-sm font-bold text-white">
                <ImageIcon className="h-4 w-4" /> Upload from device
                <input type="file" accept="image/*,video/*" className="hidden" onChange={pickFile} />
              </label>
            </div>
          </div>
        )}

        <div className="absolute bottom-32 left-0 right-0 overflow-x-auto px-4">
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition ${
                  filter === f.id ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white" : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <Sparkles className="mr-1 inline h-3 w-3" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {!snap && (
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6">
            <label className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25">
              <ImageIcon className="h-5 w-5" />
              <input type="file" accept="image/*,video/*" className="hidden" onChange={pickFile} />
            </label>
            <button onClick={capture} className="grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-4 ring-white">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-400" />
            </button>
            <div className="h-12 w-12" />
          </div>
        )}
      </div>

      {snap && (
        <div className="border-t border-white/10 bg-zinc-950 p-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            placeholder="Add caption... #StrathLife"
            className="w-full resize-none rounded-xl bg-white/5 p-3 text-sm outline-none focus:bg-white/10"
          />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-white/60">Privacy:</span>
            {(["public", "school", "anonymous"] as Privacy[]).map((p) => (
              <button
                key={p}
                onClick={() => setPrivacy(p)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                  privacy === p ? "bg-white text-black" : "bg-white/10 text-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setSnap(null)} className="ml-auto text-xs text-white/60 hover:text-white">Retake</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
