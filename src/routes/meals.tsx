import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  useMeals,
  useMealOrders,
  mealsStore,
  mealOrdersStore,
  adminGate,
  type Meal,
  type MealOrder,
} from "@/lib/meals-store";
import { formatKsh } from "@/lib/mock-data";
import {
  Utensils,
  Plus,
  X,
  Lock,
  Unlock,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  ChefHat,
  Upload,
  Receipt,
  Soup,
  Coffee,
  Sandwich,
  Cookie,
  GlassWater,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/meals")({
  head: () => ({
    meta: [
      { title: "Cafeteria Meals — StrathMart" },
      {
        name: "description",
        content:
          "Order from the Strathmore cafeteria. Pay via M-PESA, get a pickup code, collect your food.",
      },
    ],
  }),
  component: MealsPage,
});

const categoryIcons: Record<Meal["category"], typeof Soup> = {
  Breakfast: Coffee,
  Lunch: Soup,
  Dinner: Sandwich,
  Snack: Cookie,
  Drink: GlassWater,
};

type Tab = "Menu" | "My Orders" | "Admin";

function MealsPage() {
  const meals = useMeals();
  const orders = useMealOrders();
  const [tab, setTab] = useState<Tab>("Menu");
  const [filter, setFilter] = useState<Meal["category"] | "All">("All");
  const [orderingMeal, setOrderingMeal] = useState<Meal | null>(null);
  const [confirmation, setConfirmation] = useState<MealOrder | null>(null);

  const visibleMeals =
    filter === "All" ? meals : meals.filter((m) => m.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
            <ChefHat className="h-3.5 w-3.5 text-accent" /> Strathmore Cafeteria
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
            Skip the queue. <br />
            <span className="bg-gradient-to-r from-accent to-orange-300 bg-clip-text text-transparent">
              Just collect your meal.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-primary-foreground/85">
            Order from today's menu, pay securely via M-PESA, and get a pickup
            code on your phone. Show it at the cafeteria counter — that's it.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center md:max-w-md">
            {[
              { v: meals.length, l: "Meals today" },
              { v: meals.reduce((s, m) => s + m.servingsLeft, 0), l: "Servings left" },
              { v: "🔒", l: "Secure pay" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur-sm">
                <div className="font-display text-lg font-bold text-accent">{s.v}</div>
                <div className="text-[11px] text-primary-foreground/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 lg:px-6">
          {(["Menu", "My Orders", "Admin"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-4 text-sm font-semibold transition ${
                tab === t ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "My Orders" && orders.length > 0 && (
                <span className="ml-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                  {orders.length}
                </span>
              )}
              {tab === t && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full gradient-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "Menu" && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          {/* Category chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {(["All", "Breakfast", "Lunch", "Dinner", "Snack", "Drink"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c as Meal["category"] | "All")}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filter === c
                    ? "border-accent bg-accent text-accent-foreground shadow-card"
                    : "border-border bg-card text-foreground hover:border-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {visibleMeals.length === 0 ? (
            <EmptyMenu />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleMeals.map((meal) => {
                const Icon = categoryIcons[meal.category];
                const soldOut = meal.servingsLeft <= 0;
                return (
                  <article
                    key={meal.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary backdrop-blur-sm">
                        <Icon className="h-3 w-3" /> {meal.category}
                      </span>
                      {soldOut && (
                        <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-bold text-white">
                          Sold out
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-bold leading-snug">{meal.name}</h3>
                        <span className="shrink-0 font-display text-xl font-bold text-accent">{formatKsh(meal.price)}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{meal.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{meal.availableFrom} – {meal.availableUntil}</span>
                        <span>{meal.servingsLeft} left</span>
                      </div>
                      <button
                        onClick={() => setOrderingMeal(meal)}
                        disabled={soldOut}
                        className="mt-4 w-full rounded-full gradient-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-card transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {soldOut ? "Sold out" : "Order now"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === "My Orders" && <MyOrdersTab orders={orders} />}
      {tab === "Admin" && <AdminTab />}

      {orderingMeal && (
        <OrderMealDialog
          meal={orderingMeal}
          onClose={() => setOrderingMeal(null)}
          onConfirmed={(order) => {
            setOrderingMeal(null);
            setConfirmation(order);
          }}
        />
      )}
      {confirmation && (
        <PickupConfirmationDialog
          order={confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}

      <SiteFooter />
    </div>
  );
}

function EmptyMenu() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
      <Utensils className="h-10 w-10 text-muted-foreground/40" />
      <p className="mt-4 text-lg font-semibold text-muted-foreground">No meals available right now.</p>
      <p className="text-sm text-muted-foreground">The cafeteria team will post today's menu soon.</p>
    </div>
  );
}

function MyOrdersTab({ orders }: { orders: MealOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <Receipt className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-semibold text-muted-foreground">No orders yet.</p>
          <p className="text-sm text-muted-foreground">Order a meal from the menu — your pickup codes will appear here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="grid gap-4 md:grid-cols-2">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pickup code</div>
                <div className="mt-1 font-display text-2xl font-bold text-accent">{o.id}</div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  o.status === "Collected"
                    ? "bg-success/15 text-success"
                    : "bg-accent/15 text-accent"
                }`}
              >
                {o.status}
              </span>
            </div>
            <div className="mt-4 text-sm">
              <div className="font-semibold">{o.mealName} × {o.quantity}</div>
              <div className="text-muted-foreground">{formatKsh(o.total)} paid via M-PESA</div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Pickup: {o.pickupLocation}
            </div>
            {o.status !== "Collected" && (
              <button
                onClick={() => mealOrdersStore.markCollected(o.id)}
                className="mt-4 w-full rounded-full border border-border bg-secondary py-2 text-xs font-semibold hover:bg-secondary/70"
              >
                Mark as collected
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTab() {
  const [unlocked, setUnlocked] = useState(adminGate.isUnlocked());
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const meals = useMeals();

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 lg:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-accent">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">Cafeteria Admin Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Only school cafeteria staff can post or edit meals.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminGate.unlock(pw)) {
                setUnlocked(true);
                setError("");
              } else {
                setError("Wrong password. Hint for demo: strath-admin");
              }
            }}
            className="mt-5 space-y-3"
          >
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Admin password"
              className="h-11 w-full rounded-lg border border-border bg-secondary px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button type="submit" className="w-full rounded-full gradient-accent py-2.5 text-sm font-semibold text-accent-foreground shadow-card">
              Unlock admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Cafeteria menu manager</h2>
          <p className="text-sm text-muted-foreground">Post today's meals — students see them instantly.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              adminGate.lock();
              setUnlocked(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary"
          >
            <Unlock className="h-3.5 w-3.5" /> Lock admin
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-full gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card"
          >
            <Plus className="h-4 w-4" /> Add meal
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Meal</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Servings</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {meals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No meals yet.</td>
              </tr>
            )}
            {meals.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={m.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-semibold">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{m.category}</td>
                <td className="px-4 py-3">{formatKsh(m.price)}</td>
                <td className="px-4 py-3">{m.servingsLeft}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => mealsStore.remove(m.id)}
                    className="text-xs font-semibold text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddMealDialog onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddMealDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Meal["category"]>("Lunch");
  const [availableFrom, setAvailableFrom] = useState("12:00");
  const [availableUntil, setAvailableUntil] = useState("14:30");
  const [servingsLeft, setServingsLeft] = useState("50");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be under 3 MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !image) {
      setError("Please fill all fields and add a photo.");
      return;
    }
    mealsStore.add({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image,
      category,
      availableFrom,
      availableUntil,
      servingsLeft: Number(servingsLeft) || 50,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-hover">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Add meal to menu</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Meal photo</span>
            <label className="grid h-32 w-full cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary hover:border-accent">
              {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="text-center"><Upload className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-1 text-xs text-muted-foreground">Tap to upload</p></div>}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </label>
          <Input label="Meal name" value={name} onChange={setName} placeholder="Beef Pilau with Kachumbari" />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Ingredients, portion size..." className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (KSh)" value={price} onChange={setPrice} type="number" placeholder="250" />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as Meal["category"])} className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm">
                <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Drink</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="From" value={availableFrom} onChange={setAvailableFrom} type="time" />
            <Input label="Until" value={availableUntil} onChange={setAvailableUntil} type="time" />
            <Input label="Servings" value={servingsLeft} onChange={setServingsLeft} type="number" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-11 flex-1 rounded-full border border-border bg-card text-sm font-semibold hover:bg-secondary">Cancel</button>
          <button type="submit" className="h-11 flex-1 rounded-full gradient-accent text-sm font-semibold text-accent-foreground shadow-card">Publish to menu</button>
        </div>
      </form>
    </div>
  );
}

function OrderMealDialog({ meal, onClose, onConfirmed }: { meal: Meal; onClose: () => void; onConfirmed: (o: MealOrder) => void }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("Main Cafeteria Counter");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const total = meal.price * qty;

  function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Enter your name and M-PESA number.");
      return;
    }
    setPaying(true);
    setTimeout(() => {
      const order = mealOrdersStore.place({
        meal,
        buyerName: name.trim(),
        buyerPhone: phone.trim(),
        quantity: qty,
        pickupLocation,
      });
      onConfirmed(order);
    }, 1100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={pay} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-hover">
        <div className="relative h-40 overflow-hidden">
          <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
          <button type="button" onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <h2 className="font-display text-xl font-bold">{meal.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{meal.description}</p>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary p-3">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center rounded-full border border-border bg-card">
              <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center hover:bg-secondary">-</button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button type="button" onClick={() => setQty(Math.min(meal.servingsLeft, qty + 1))} className="grid h-8 w-8 place-items-center hover:bg-secondary">+</button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Input label="Your name" value={name} onChange={setName} placeholder="Jane Wanjiku" />
            <Input label="M-PESA phone" value={phone} onChange={setPhone} placeholder="07XX XXX XXX" />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">Pickup point</span>
              <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm">
                <option>Main Cafeteria Counter</option>
                <option>Student Centre Kiosk</option>
                <option>Library Café</option>
              </select>
            </label>
          </div>

          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

          <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary p-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-accent">{formatKsh(total)}</span>
          </div>

          <button
            type="submit"
            disabled={paying}
            className="mt-4 w-full rounded-full gradient-accent py-3 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-60"
          >
            {paying ? "Sending M-PESA prompt..." : `Pay ${formatKsh(total)} via M-PESA`}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1 text-center text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-success" /> Secure payment · pickup code on confirmation
          </p>
        </div>
      </form>
    </div>
  );
}

function PickupConfirmationDialog({ order, onClose }: { order: MealOrder; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card text-center shadow-hover">
        <div className="gradient-hero px-6 py-8 text-primary-foreground">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur-sm">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">Payment received 🎉</h2>
          <p className="mt-1 text-sm text-primary-foreground/80">Show this code at the cafeteria counter to collect your meal.</p>
        </div>

        <div className="p-6">
          <div className="rounded-2xl border-2 border-dashed border-accent bg-accent/5 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your pickup code</div>
            <div className="mt-2 font-display text-4xl font-bold tracking-wider text-accent">{order.id}</div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(order.id);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy code"}
            </button>
          </div>

          <div className="mt-5 space-y-2 rounded-xl bg-secondary p-4 text-left text-sm">
            <Row k="Meal" v={`${order.mealName} × ${order.quantity}`} />
            <Row k="Paid" v={formatKsh(order.total)} />
            <Row k="Pickup at" v={order.pickupLocation} />
            <Row k="Time" v={new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            We've also sent the code via SMS to {order.buyerPhone}. Walk to the cafeteria and show this screen — that's it.
          </p>

          <div className="mt-5 flex gap-2">
            <Link to="/meals" onClick={onClose} className="h-11 flex-1 inline-grid place-items-center rounded-full border border-border bg-card text-sm font-semibold hover:bg-secondary">
              Order more
            </Link>
            <button onClick={onClose} className="h-11 flex-1 rounded-full gradient-accent text-sm font-semibold text-accent-foreground shadow-card">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
