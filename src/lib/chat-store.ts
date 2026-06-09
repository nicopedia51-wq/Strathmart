import { useSyncExternalStore } from "react";

export interface ChatMessage {
  id: string;
  from: "me" | "seller";
  text: string;
  at: string;
}

const KEY = "strathmart_chats_v1";

// Map sellerId -> messages
let state: Record<string, ChatMessage[]> = {};
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}
function persist() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

const autoReplies = [
  "Hey 👋 thanks for reaching out! Yes it's still available.",
  "I'm on campus today, we can meet at the library lawn whenever you're free.",
  "Price is slightly negotiable for serious buyers. What's your offer?",
  "Sure! When would you like to pick it up?",
  "It's in great condition. Happy to send more photos if you'd like.",
];

export const chatStore = {
  send(sellerId: string, text: string) {
    const msg: ChatMessage = {
      id: `c${Date.now()}`,
      from: "me",
      text,
      at: new Date().toISOString(),
    };
    state = { ...state, [sellerId]: [...(state[sellerId] || []), msg] };
    persist();
    // mock seller reply after a short delay
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `c${Date.now() + 1}`,
        from: "seller",
        text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        at: new Date().toISOString(),
      };
      state = { ...state, [sellerId]: [...(state[sellerId] || []), reply] };
      persist();
    }, 900 + Math.random() * 800);
  },
  get(sellerId: string) {
    return state[sellerId] || [];
  },
  all() {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useChat(sellerId: string) {
  return useSyncExternalStore(
    chatStore.subscribe,
    () => state[sellerId] || [],
    () => state[sellerId] || [],
  );
}
