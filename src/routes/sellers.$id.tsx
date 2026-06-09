import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/products-store";
import { ChatDialog } from "@/components/chat-dialog";
import { Star, MessageCircle, UserPlus } from "lucide-react";

export const Route = createFileRoute("/sellers/$id")({
  component: SellerProfile,
  notFoundComponent: () => <div className="grid min-h-screen place-items-center">Seller not found.</div>,
  loader: ({ params }) => ({ sellerId: params.id }),
});

function SellerProfile() {
  const { sellerId } = Route.useLoaderData();
  const products = useProducts();
  const sellerProducts = products.filter((p) => p.sellerId === sellerId);
  const [chatOpen, setChatOpen] = useState(false);

  if (sellerProducts.length === 0) {
    throw notFound();
  }

  const name = sellerProducts[0].sellerName;
  const avatar = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avgRating =
    sellerProducts.reduce((s, p) => s + p.rating, 0) / sellerProducts.length;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="grid h-24 w-24 place-items-center rounded-2xl gradient-accent font-display text-3xl font-bold text-accent-foreground shadow-glow">
              {avatar}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold md:text-4xl">{name}</h1>
              <p className="mt-1 text-primary-foreground/80">Verified Strathmore student seller</p>
              <div className="mt-3 flex flex-wrap gap-5 text-sm">
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-accent text-accent" /><b>{avgRating.toFixed(1)}</b></span>
                <span><b>{sellerProducts.length}</b> products</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-full gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow">
                <UserPlus className="h-4 w-4" /> Follow
              </button>
              <button onClick={() => setChatOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/20">
                <MessageCircle className="h-4 w-4" /> Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <h2 className="font-display text-2xl font-bold">Products from {name}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {sellerProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      {chatOpen && (
        <ChatDialog sellerId={sellerId} sellerName={name} onClose={() => setChatOpen(false)} />
      )}
      <SiteFooter />
    </div>
  );
}
