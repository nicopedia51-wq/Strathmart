import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart, cart } from "@/lib/cart-store";
import { formatKsh } from "@/lib/mock-data";
import { CheckCircle2, Smartphone, CreditCard } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — StrathMart" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [placed, setPlaced] = useState(false);
  const delivery = items.length > 0 ? 100 : 0;
  const total = subtotal + delivery;

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    cart.clear();
    setTimeout(() => navigate({ to: "/" }), 3500);
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold">Order placed! 🎉</h1>
          <p className="mt-2 text-muted-foreground">You'll get an M-PESA prompt shortly. Sellers have been notified.</p>
          <Link to="/" className="mt-6 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="grid place-items-center py-32 text-muted-foreground">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
        <form onSubmit={placeOrder} className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Delivery details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Full name" required defaultValue="Jane Wanjiku" />
                <Field label="Phone (M-PESA)" required defaultValue="0712 345 678" />
                <Field label="Strathmore email" type="email" required defaultValue="jane.wanjiku@strathmore.edu" />
                <Field label="Student ID" required defaultValue="STM-2024-1234" />
                <div className="sm:col-span-2">
                  <Field label="Hostel / Pickup point" required defaultValue="Marist Hall — Room 304" />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PayOption
                  icon={Smartphone}
                  label="M-PESA"
                  desc="STK push to your phone"
                  active={method === "mpesa"}
                  onClick={() => setMethod("mpesa")}
                />
                <PayOption
                  icon={CreditCard}
                  label="Card"
                  desc="Visa, Mastercard"
                  active={method === "card"}
                  onClick={() => setMethod("card")}
                />
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold">Your order</h2>
            <ul className="mt-4 space-y-3">
              {items.map((line) => (
                <li key={line.id} className="flex items-center gap-3 text-sm">
                  <img src={line.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="line-clamp-1 font-medium">{line.title}</div>
                    <div className="text-xs text-muted-foreground">Qty {line.qty}</div>
                  </div>
                  <div className="font-semibold">{formatKsh(line.price * line.qty)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <Row k="Subtotal" v={formatKsh(subtotal)} />
              <Row k="Delivery" v={formatKsh(delivery)} />
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-display text-xl font-bold text-accent">{formatKsh(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              className="mt-5 w-full rounded-full gradient-accent py-3 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-[1.02]"
            >
              Place order · {formatKsh(total)}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              By placing, you agree to the StrathMart terms. 4.5% goes to platform fees.
            </p>
          </aside>
        </form>
      </div>
      <SiteFooter />
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}

function PayOption({ icon: Icon, label, desc, active, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
        active ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
      }`}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "gradient-accent text-accent-foreground" : "bg-secondary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
