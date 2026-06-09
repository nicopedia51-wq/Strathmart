import { useSyncExternalStore } from "react";

export interface ActivityClip {
  id: string;
  /** Image data URL or remote URL. Optional. */
  mediaUrl?: string;
  mediaType?: "image" | "video";
  caption: string;
  author: string;
  authorRole: string; // e.g. Sports Office, Student
  activityTitle: string;
  activityTag: "Sports" | "Academic" | "Club" | "Campus Life" | "Career";
  likes: number;
  likedByMe: boolean;
  comments: { id: string; author: string; text: string; at: string }[];
  postedAt: string;
}

const KEY = "strathmart_activity_clips_v1";

const seed: ActivityClip[] = [
  {
    id: "ac1",
    mediaUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption: "Goooaal! 🔥 Faculty of Law just leveled it in the 78th minute. What a match! ⚽",
    author: "Sports Office",
    authorRole: "Strathmore Sports",
    activityTitle: "Inter-Faculty Football Tournament",
    activityTag: "Sports",
    likes: 142,
    likedByMe: false,
    comments: [
      { id: "cm1", author: "David K.", text: "I was there! Insane atmosphere 🏟️", at: new Date().toISOString() },
      { id: "cm2", author: "Aisha M.", text: "Law all the way! 💜", at: new Date().toISOString() },
    ],
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "ac2",
    mediaUrl:
      "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption:
      "Pitch night is on 🚀 — 8 student startups, KSh 50K prize, and live Q&A with Safaricom alumni investors. Reserve your seat!",
    author: "Entrepreneurship Club",
    authorRole: "Club Lead",
    activityTitle: "Strathmore Pitch Night",
    activityTag: "Club",
    likes: 76,
    likedByMe: false,
    comments: [],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "ac3",
    mediaUrl:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption:
      "Career talk with Google Kenya happening NOW in LH3. AI products, internships, free pizza 🍕 — pull up!",
    author: "Career Services",
    authorRole: "Strathmore Careers",
    activityTitle: "Tech Talk: Building AI Products",
    activityTag: "Career",
    likes: 58,
    likedByMe: false,
    comments: [
      { id: "cm3", author: "Faith W.", text: "Running there now 🏃‍♀️", at: new Date().toISOString() },
    ],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "ac4",
    mediaUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    mediaType: "image",
    caption:
      "Sustainability committee clean-up done & dusted ✨ Massive turnout this Saturday — proud of you all. Free tees still available at the SU office.",
    author: "Sustainability Committee",
    authorRole: "Student Union",
    activityTitle: "Campus Clean-Up Drive",
    activityTag: "Campus Life",
    likes: 91,
    likedByMe: false,
    comments: [],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let state: ActivityClip[] = seed;
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

export const activitiesStore = {
  add(clip: Omit<ActivityClip, "id" | "likes" | "likedByMe" | "comments" | "postedAt">) {
    const newClip: ActivityClip = {
      ...clip,
      id: `ac${Date.now()}`,
      likes: 0,
      likedByMe: false,
      comments: [],
      postedAt: new Date().toISOString(),
    };
    state = [newClip, ...state];
    persist();
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
              { id: `cm${Date.now()}`, author, text, at: new Date().toISOString() },
            ],
          }
        : c,
    );
    persist();
  },
  remove(id: string) {
    state = state.filter((c) => c.id !== id);
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

export function useActivityClips() {
  return useSyncExternalStore(
    activitiesStore.subscribe,
    () => state,
    () => state,
  );
}
