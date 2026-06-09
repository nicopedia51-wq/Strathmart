import { useSyncExternalStore } from "react";
import { toast } from "sonner";

export type NotifKind = "order" | "pickup" | "message" | "like" | "system";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
}

const KEY = "strathmart_notifications_v1";

const seed: Notification[] = [
  {
    id: "n1",
    kind: "pickup",
    title: "Pickup code ready",
    body: "Your meal STM-K7P2X is ready. Show this at the cafeteria counter.",
    at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    read: false,
    href: "/meals",
  },
  {
    id: "n2",
    kind: "message",
    title: "New seller reply",
    body: "Aisha M. replied: \"Still available, can meet at the library lawn.\"",
    at: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    read: false,
    href: "/products",
  },
  {
    id: "n3",
    kind: "order",
    title: "Order confirmed",
    body: "Calculus textbook order placed. Seller has been notified.",
    at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    href: "/cart",
  },
];

let state: Notification[] = seed;
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

export const notificationsStore = {
  push(n: Omit<Notification, "id" | "at" | "read">) {
    const item: Notification = {
      ...n,
      id: `n${Date.now()}`,
      at: new Date().toISOString(),
      read: false,
    };
    state = [item, ...state];
    persist();
    toast(item.title, { description: item.body });
  },
  markAllRead() {
    state = state.map((n) => ({ ...n, read: true }));
    persist();
  },
  markRead(id: string) {
    state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
    persist();
  },
  clear() {
    state = [];
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

export function useNotifications() {
  return useSyncExternalStore(
    notificationsStore.subscribe,
    () => state,
    () => state,
  );
}
