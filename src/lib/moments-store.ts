import { useSyncExternalStore } from "react";

export type Privacy = "anonymous" | "school" | "public";

export interface Moment {
  id: string;
  mediaUrl: string; // data URL (image fallback) or remote
  mediaType: "video" | "image";
  caption: string;
  hashtags: string[];
  filter: string;
  privacy: Privacy;
  author: string;
  likes: number;
  likedByMe: boolean;
  comments: { id: string; author: string; text: string; at: string }[];
  postedAt: string;
}

const KEY = "strathmart_moments_v1";

const seed: Moment[] = [
  {
    id: "m1",
    mediaUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    caption: "Late-night library grind 📚✨ finals szn loading",
    hashtags: ["#StrathLife", "#FinalsWeek"],
    filter: "none",
    privacy: "school",
    author: "Aisha M.",
    likes: 248,
    likedByMe: false,
    comments: [{ id: "c1", author: "David K.", text: "Mood 💯", at: new Date().toISOString() }],
    postedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "m2",
    mediaUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    caption: "Faculty league semis tonight — pull up to the field! ⚽🔥",
    hashtags: ["#StrathSports", "#FacultyLeague"],
    filter: "vivid",
    privacy: "public",
    author: "Sports Office",
    likes: 512,
    likedByMe: false,
    comments: [],
    postedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "m3",
    mediaUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    caption: "Anonymous confession: that cafeteria pilau actually slaps 🍛",
    hashtags: ["#StrathEats"],
    filter: "warm",
    privacy: "anonymous",
    author: "Anonymous",
    likes: 89,
    likedByMe: false,
    comments: [],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

let state: Moment[] = seed;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
    else localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

// ---- AI Content Guard (mock) ----
const BANNED = [
  "uchichi","nude","nudes","sex","scam","hack","cheat","fraud","kill",
  "drugs","weed","stupid","idiot","fool","ugly","trash human","hate you",
];

export type ModerationResult =
  | { ok: true }
  | { ok: false; reasons: string[]; banDays: number };

export function moderate(text: string): ModerationResult {
  const lower = text.toLowerCase();
  const reasons: string[] = [];
  for (const w of BANNED) {
    if (lower.includes(w)) reasons.push(`Flagged term: "${w}"`);
  }
  if (reasons.length === 0) return { ok: true };
  return { ok: false, reasons, banDays: 30 };
}

export const momentsStore = {
  add(m: Omit<Moment, "id" | "likes" | "likedByMe" | "comments" | "postedAt">) {
    const item: Moment = {
      ...m,
      id: `m${Date.now()}`,
      likes: 0,
      likedByMe: false,
      comments: [],
      postedAt: new Date().toISOString(),
    };
    state = [item, ...state];
    persist();
    return item;
  },
  toggleLike(id: string) {
    state = state.map((c) =>
      c.id === id
        ? { ...c, likedByMe: !c.likedByMe, likes: c.likes + (c.likedByMe ? -1 : 1) }
        : c,
    );
    persist();
  },
  addComment(id: string, author: string, text: string) {
    state = state.map((c) =>
      c.id === id
        ? {
            ...c,
            comments: [
              ...c.comments,
              { id: `c${Date.now()}`, author, text, at: new Date().toISOString() },
            ],
          }
        : c,
    );
    persist();
  },
  get() {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useMoments() {
  return useSyncExternalStore(
    momentsStore.subscribe,
    () => state,
    () => state,
  );
}
