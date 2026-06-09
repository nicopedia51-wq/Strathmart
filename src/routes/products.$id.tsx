import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { formatKsh } from "@/lib/mock-data";
import { productsStore, useProducts } from "@/lib/products-store";
import { cart } from "@/lib/cart-store";
import { ChatDialog } from "@/components/chat-dialog";
import { Star, ShoppingCart, MessageCircle, Shield, Truck, Minus, Plus, Heart } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">Product not found.</div>
  ),
  loader: ({ params }) => {
    const product = productsStore.find(params.id);
    if (!product) throw notFound();
    return { product };
  },
});

function ProductDetail() {
  const all = useProducts();
  const loaded = Route.useLoaderData().product;
  const product = all.find((p) => p.id === loaded.id) || loaded;
  const [qty, setQty] = useState(1);
  const [chatOpen, setChatOpen] = useState(false);
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link> /{" "}
          <Link to="/products" className="hover:text-accent">{product.category}</Link> /{" "}
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <img src={product.image} alt={product.title} className="aspect-square w-full object-cover" />
          </div>

          <div>
            {product.badge && (
              <span className="rounded-full gradient-accent px-3 py-1 text-xs font-bold uppercase text-accent-foreground">
                {product.badge}
              </span>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{product.title}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{product.sold} sold</span>
            </div>

            <div className="mt-5 rounded-2xl bg-secondary p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-accent">{formatKsh(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatKsh(product.originalPrice)}</span>
                    <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-success">In stock: {product.inStock} available</p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold">Quantity:</span>
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-10 w-10 place-items-center hover:bg-secondary">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.inStock, qty + 1))} className="grid h-10 w-10 place-items-center hover:bg-secondary">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => cart.add(product.id, qty)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </button>
              <button
                onClick={() => cart.add(product.id, qty)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-105"
              >
                Buy now
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-accent bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition hover:bg-accent hover:text-accent-foreground"
                aria-label="Message seller"
              >
                <MessageCircle className="h-4 w-4" /> Message seller
              </button>
              <button className="grid h-12 w-12 place-items-center rounded-full border border-border hover:border-accent hover:text-accent">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Seller card */}
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-full gradient-accent font-bold text-accent-foreground">
                {product.sellerName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <Link to="/sellers/$id" params={{ id: product.sellerId }} className="text-sm font-bold hover:text-accent">
                  {product.sellerName}
                </Link>
                <div className="text-xs text-muted-foreground">Verified Strathmore student seller</div>
              </div>
              <button
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Chat
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                <Shield className="h-4 w-4 text-success" />
                <span>Verified Strathmore student</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3">
                <Truck className="h-4 w-4 text-success" />
                <span>Campus pickup or delivery</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold">You might also like</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
      {chatOpen && (
        <ChatDialog
          sellerId={product.sellerId}
          sellerName={product.sellerName}
          contextLabel={product.title}
          onClose={() => setChatOpen(false)}
        />
      )}
      <SiteFooter />
    </div>
  );
}
