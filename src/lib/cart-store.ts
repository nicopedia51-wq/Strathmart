import { useSyncExternalStore } from "react";
import type { Product } from "./mock-data";
import { productsStore } from "./products-store";
import { mealsStore, type Meal } from "./meals-store";

export interface CartItem {
  productId: string;
  qty: number;
  kind: "product" | "meal";
}

const KEY = "strathmart_cart_v2";
let state: CartItem[] = [];
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

export const cart = {
  add(productId: string, qty = 1, kind: "product" | "meal" = "product") {
    const existing = state.find((i) => i.productId === productId);
    if (existing) {
      state = state.map((i) =>
        i.productId === productId ? { ...i, qty: i.qty + qty } : i,
      );
    } else {
      state = [...state, { productId, qty, kind }];
    }
    persist();
  },
  remove(productId: string) {
    state = state.filter((i) => i.productId !== productId);
    persist();
  },
  setQty(productId: string, qty: number) {
    if (qty <= 0) return cart.remove(productId);
    state = state.map((i) => (i.productId === productId ? { ...i, qty } : i));
    persist();
  },
  clear() {
    state = [];
    persist();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return state;
  },
};

export type CartLine =
  | { kind: "product"; product: Product; qty: number; price: number; image: string; title: string; id: string }
  | { kind: "meal"; meal: Meal; qty: number; price: number; image: string; title: string; id: string };

export function useCart() {
  const items = useSyncExternalStore(
    cart.subscribe,
    () => state,
    () => state,
  );
  const detailed: CartLine[] = items
    .map((i) => {
      if (i.kind === "meal") {
        const meal = mealsStore.find(i.productId);
        if (!meal) return null;
        return {
          kind: "meal" as const,
          meal,
          qty: i.qty,
          price: meal.price,
          image: meal.image,
          title: meal.name,
          id: meal.id,
        };
      }
      const product = productsStore.find(i.productId);
      if (!product) return null;
      return {
        kind: "product" as const,
        product,
        qty: i.qty,
        price: product.price,
        image: product.image,
        title: product.title,
        id: product.id,
      };
    })
    .filter(Boolean) as CartLine[];

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = detailed.reduce((s, i) => s + i.price * i.qty, 0);
  return { items: detailed, count, subtotal };
}
