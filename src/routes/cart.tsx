import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useCart, cart } from "@/lib/cart-store";
import { formatKsh } from "@/lib/mock-data";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — StrathMart" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, count } = useCart();
  const delivery = items.length > 0 ? 100 : 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <h1 className="font-display text-3xl font-bold">Your cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">{count} item{count !== 1 ? "s" : ""}</p>

        {items.length === 0 ? (
          <div className="mt-16 grid place-items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Browse the marketplace to find something you love.</p>
            <Link to="/products" className="mt-5 inline-flex items-center gap-2 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow">
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((line) => (
                <div key={line.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
                  {line.kind === "product" ? (
                    <Link to="/products/$id" params={{ id: line.id }} className="shrink-0">
                      <img src={line.image} alt={line.title} className="h-24 w-24 rounded-xl object-cover" />
                    </Link>
                  ) : (
                    <img src={line.image} alt={line.title} className="h-24 w-24 rounded-xl object-cover" />
                  )}
                  <div className="flex flex-1 flex-col">
                    {line.kind === "product" ? (
                      <Link to="/products/$id" params={{ id: line.id }} className="line-clamp-2 text-sm font-semibold hover:text-accent">
                        {line.title}
                      </Link>
                    ) : (
                      <span className="line-clamp-2 text-sm font-semibold">{line.title}</span>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {line.kind === "product" ? `by ${line.product.sellerName}` : "Cafeteria meal"}
                    </p>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <button onClick={() => cart.setQty(line.id, line.qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-secondary">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{line.qty}</span>
                        <button onClick={() => cart.setQty(line.id, line.qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-secondary">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-accent">{formatKsh(line.price * line.qty)}</div>
                        <button
                          onClick={() => cart.remove(line.id)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatKsh(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-semibold">{formatKsh(delivery)}</dd>
                </div>
                <div className="my-3 border-t border-border" />
                <div className="flex justify-between text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display text-xl font-bold text-accent">{formatKsh(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full gradient-accent py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">Pay via M-PESA or card</p>
            </aside>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
