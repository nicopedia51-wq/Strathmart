import { useSyncExternalStore } from "react";
import type { Product, Seller } from "./mock-data";

const KEY = "strathmart_products_v2";

let state: Product[] = [];
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
}

function persist() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      // Surface quota errors to the caller so the UI can react.
      throw new Error("Browser storage quota exceeded. Try a smaller image.");
    }
  }
  listeners.forEach((l) => l());
}

export const productsStore = {
  add(p: Omit<Product, "id" | "rating" | "reviews" | "sold" | "createdAt">) {
    const newP: Product = {
      ...p,
      id: `p${Date.now()}`,
      rating: 5,
      reviews: 0,
      sold: 0,
      createdAt: new Date().toISOString(),
    };
    state = [newP, ...state];
    persist();
    return newP;
  },
  remove(id: string) {
    state = state.filter((p) => p.id !== id);
    persist();
  },
  find(id: string) {
    return state.find((p) => p.id === id);
  },
  get() {
    return state;
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useProducts() {
  const list = useSyncExternalStore(
    productsStore.subscribe,
    () => state,
    () => state,
  );
  return list;
}

export function useSellers(): Seller[] {
  const list = useProducts();
  const map = new Map<string, Seller & { products: number }>();
  for (const p of list) {
    const existing = map.get(p.sellerId);
    if (existing) {
      existing.products += 1;
    } else {
      map.set(p.sellerId, {
        id: p.sellerId,
        name: p.sellerName,
        avatar: p.sellerName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        rating: p.rating,
        followers: 0,
        bio: `Strathmore student seller · ${p.sellerName}`,
        products: 1,
      });
    }
  }
  return Array.from(map.values());
}
