import { useSyncExternalStore } from "react";

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Drink";
  availableFrom: string; // e.g. "07:00"
  availableUntil: string; // e.g. "10:00"
  servingsLeft: number;
  createdAt: string;
}

export interface MealOrder {
  id: string; // pickup code
  mealId: string;
  mealName: string;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  total: number;
  pickupLocation: string;
  status: "Paid · Awaiting pickup" | "Collected";
  createdAt: string;
}

const MEAL_KEY = "strathmart_meals_v1";
const ORDER_KEY = "strathmart_meal_orders_v1";
const ADMIN_KEY = "strathmart_admin_unlocked";

const seed: Meal[] = [
  {
    id: "m1",
    name: "Beef Pilau with Kachumbari",
    description:
      "Aromatic basmati pilau cooked with tender beef chunks, served with fresh tomato & onion kachumbari.",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1604908554049-a229345106a4?auto=format&fit=crop&w=800&q=80",
    category: "Lunch",
    availableFrom: "12:00",
    availableUntil: "14:30",
    servingsLeft: 80,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    name: "Chapati & Beef Stew",
    description:
      "Two soft chapatis served with a rich, slow-cooked beef stew. Cafeteria comfort classic.",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    category: "Lunch",
    availableFrom: "12:00",
    availableUntil: "14:30",
    servingsLeft: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m3",
    name: "Mandazi & Chai",
    description:
      "Three fluffy mandazis with a hot cup of spiced Kenyan chai. Perfect breakfast pick-me-up.",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80",
    category: "Breakfast",
    availableFrom: "07:00",
    availableUntil: "10:30",
    servingsLeft: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m4",
    name: "Ugali, Sukuma & Fried Fish",
    description:
      "Generous portion of ugali with sukuma wiki and crispy pan-fried tilapia. Hearty dinner.",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    category: "Dinner",
    availableFrom: "17:30",
    availableUntil: "20:00",
    servingsLeft: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m5",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice with marinated chicken, caramelised onions and saffron. Wednesday special.",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=80",
    category: "Lunch",
    availableFrom: "12:00",
    availableUntil: "14:30",
    servingsLeft: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: "m6",
    name: "Fresh Mango Juice",
    description: "Freshly blended ripe mango juice. Served chilled.",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
    category: "Drink",
    availableFrom: "07:00",
    availableUntil: "18:00",
    servingsLeft: 150,
    createdAt: new Date().toISOString(),
  },
];

let meals: Meal[] = seed;
let orders: MealOrder[] = [];
const mealListeners = new Set<() => void>();
const orderListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    const rawM = localStorage.getItem(MEAL_KEY);
    if (rawM) meals = JSON.parse(rawM);
    else localStorage.setItem(MEAL_KEY, JSON.stringify(meals));
    const rawO = localStorage.getItem(ORDER_KEY);
    if (rawO) orders = JSON.parse(rawO);
  } catch {}
}

function persistMeals() {
  if (typeof window !== "undefined")
    localStorage.setItem(MEAL_KEY, JSON.stringify(meals));
  mealListeners.forEach((l) => l());
}
function persistOrders() {
  if (typeof window !== "undefined")
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  orderListeners.forEach((l) => l());
}

function genCode() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `STM-${s}`;
}

export const mealsStore = {
  add(m: Omit<Meal, "id" | "createdAt">) {
    const meal: Meal = {
      ...m,
      id: `m${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    meals = [meal, ...meals];
    persistMeals();
    return meal;
  },
  remove(id: string) {
    meals = meals.filter((m) => m.id !== id);
    persistMeals();
  },
  find(id: string) {
    return meals.find((m) => m.id === id);
  },
  get() {
    return meals;
  },
  subscribe(l: () => void) {
    mealListeners.add(l);
    return () => mealListeners.delete(l);
  },
};

export const mealOrdersStore = {
  place(input: {
    meal: Meal;
    buyerName: string;
    buyerPhone: string;
    quantity: number;
    pickupLocation: string;
  }): MealOrder {
    const order: MealOrder = {
      id: genCode(),
      mealId: input.meal.id,
      mealName: input.meal.name,
      buyerName: input.buyerName,
      buyerPhone: input.buyerPhone,
      quantity: input.quantity,
      total: input.meal.price * input.quantity,
      pickupLocation: input.pickupLocation,
      status: "Paid · Awaiting pickup",
      createdAt: new Date().toISOString(),
    };
    orders = [order, ...orders];
    // decrement servings
    meals = meals.map((m) =>
      m.id === input.meal.id
        ? { ...m, servingsLeft: Math.max(0, m.servingsLeft - input.quantity) }
        : m,
    );
    persistMeals();
    persistOrders();
    return order;
  },
  markCollected(id: string) {
    orders = orders.map((o) => (o.id === id ? { ...o, status: "Collected" } : o));
    persistOrders();
  },
  get() {
    return orders;
  },
  subscribe(l: () => void) {
    orderListeners.add(l);
    return () => orderListeners.delete(l);
  },
};

export function useMeals() {
  return useSyncExternalStore(
    mealsStore.subscribe,
    () => meals,
    () => meals,
  );
}
export function useMealOrders() {
  return useSyncExternalStore(
    mealOrdersStore.subscribe,
    () => orders,
    () => orders,
  );
}

// Simple mock admin gate (demo only — replace with real auth before scaling)
export const ADMIN_PASSWORD = "strath-admin";
export const adminGate = {
  isUnlocked() {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ADMIN_KEY) === "1";
  },
  unlock(pw: string) {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, "1");
      return true;
    }
    return false;
  },
  lock() {
    localStorage.removeItem(ADMIN_KEY);
  },
};
