import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useSellers, useProducts } from "@/lib/products-store";
import { Star, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/sellers")({
  head: () => ({ meta: [{ title: "Top sellers — StrathMart" }] }),
  component: SellersPage,
});

function SellersPage() {
  const sellers = useSellers();
  const products = useProducts();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <h1 className="font-display text-3xl font-bold">Top student sellers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Verified Strathmore students running their own stores.</p>

        {sellers.length === 0 ? (
          <div className="mt-20 grid place-items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-9 w-9 text-muted-foreground" />
            </div>
            <p className="mt-4 text-lg font-semibold text-muted-foreground">No sellers yet.</p>
            <p className="text-sm text-muted-foreground">Be the first to list a product and start your store.</p>
            <Link to="/products" className="mt-5 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow">
              Upload a product
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sellers.map((s) => {
              const count = products.filter((p) => p.sellerId === s.id).length;
              return (
                <Link
                  key={s.id}
                  to="/sellers/$id"
                  params={{ id: s.id }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-full gradient-accent font-display text-lg font-bold text-accent-foreground">
                      {s.avatar}
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold">{s.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {s.rating.toFixed(1)} · {count} product{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.bio}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
