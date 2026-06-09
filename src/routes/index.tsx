import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Truck, Shield, Star, Utensils, Megaphone } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/products-store";
import { useMeals } from "@/lib/meals-store";
import { categories } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StrathMart — The Student Marketplace" },
      { name: "description", content: "Buy, sell, and order food on Strathmore University's official student marketplace. Textbooks, electronics, fashion, meals — all in one place." },
      { property: "og:title", content: "StrathMart — The Student Marketplace" },
      { property: "og:description", content: "Buy, sell, and order food on Strathmore's official student marketplace." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Home,
});

function Home() {
  const products = useProducts();
  const meals = useMeals();
  const trending = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8);
  const featuredMeals = meals.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:px-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              The official Strathmore student marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
              Shop, sell & eat
              <br />
              <span className="bg-gradient-to-r from-accent to-orange-300 bg-clip-text text-transparent">
                all on campus.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              Buy from fellow students at student prices. Sell what you no longer need.
              Order meals from the school cafeteria. One platform, zero hassle.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-105"
              >
                Browse marketplace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/meals"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
              >
                <Utensils className="h-4 w-4" /> Order meals
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: `${products.length}+`, l: "Products" },
                { v: `${meals.length}`, l: "Meals today" },
                { v: "4.9★", l: "Avg rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl border border-white/15 bg-white/5 p-3 text-center backdrop-blur-sm">
                  <div className="font-display text-xl font-bold text-accent">{s.v}</div>
                  <div className="text-xs text-primary-foreground/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-accent opacity-30 blur-2xl" />
            <img
              src={heroImg}
              alt="Strathmore students using StrathMart marketplace"
              width={1536}
              height={1024}
              className="relative rounded-3xl border border-white/10 shadow-hover"
            />
          </div>
        </div>
      </section>

      {/* Quick access tiles */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Link to="/products" className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover">
            <div className="text-3xl">🛍️</div>
            <h3 className="mt-3 font-display text-lg font-bold">Marketplace</h3>
            <p className="text-sm text-muted-foreground">Buy & sell anything from fellow students.</p>
            <div className="mt-3 text-xs font-semibold text-accent group-hover:underline">Browse products →</div>
          </Link>
          <Link to="/meals" className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover">
            <div className="text-3xl">🍱</div>
            <h3 className="mt-3 font-display text-lg font-bold">Cafeteria Meals</h3>
            <p className="text-sm text-muted-foreground">Pay here, get a pickup code, collect at the cafeteria.</p>
            <div className="mt-3 text-xs font-semibold text-accent group-hover:underline">Order meals →</div>
          </Link>
          <Link to="/activities" className="group rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover">
            <div className="text-3xl">📣</div>
            <h3 className="mt-3 font-display text-lg font-bold">School Activities</h3>
            <p className="text-sm text-muted-foreground">Watch clips & updates from on-campus events.</p>
            <div className="mt-3 text-xs font-semibold text-accent group-hover:underline">Open feed →</div>
          </Link>
          <Link to="/moments" className="group relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5 p-6 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover">
            <div className="text-3xl">✨</div>
            <h3 className="mt-3 font-display text-lg font-bold">Campus Moments</h3>
            <p className="text-sm text-muted-foreground">Record, filter & share campus vibes. AI-protected.</p>
            <div className="mt-3 text-xs font-semibold text-accent group-hover:underline">Vibe check →</div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pb-4 lg:px-6">
        <h2 className="font-display text-xl font-bold">Shop by category</h2>
        <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/products"
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-card transition hover:-translate-y-1 hover:border-accent hover:shadow-hover"
            >
              <div className="text-2xl transition group-hover:scale-110">{c.icon}</div>
              <span className="text-[11px] font-semibold text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card md:grid-cols-3">
          {[
            { i: Shield, t: "Verified students only", d: "Sellers verified via Strathmore email" },
            { i: Truck, t: "Hostel delivery", d: "Pickup or delivery across campus" },
            { i: TrendingUp, t: "Best student prices", d: "Average 40% cheaper than retail" },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-accent">
                <f.i className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">🔥 Trending now</h2>
              <p className="mt-1 text-sm text-muted-foreground">What students are listing this week</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-accent hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Meals banner */}
      {featuredMeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="overflow-hidden rounded-3xl gradient-accent p-8 text-accent-foreground md:p-12">
            <div className="grid items-center gap-6 md:grid-cols-2">
              <div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase backdrop-blur-sm">
                  Cafeteria · Today
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  Skip the queue 🍱
                </h2>
                <p className="mt-2 max-w-md text-accent-foreground/90">
                  Order ahead, pay via M-PESA, and just show your pickup code at the cafeteria counter.
                </p>
                <Link
                  to="/meals"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:scale-105"
                >
                  See today's menu <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {featuredMeals.map((m) => (
                  <Link key={m.id} to="/meals" className="overflow-hidden rounded-xl bg-card shadow-card transition hover:scale-105">
                    <img src={m.image} alt={m.name} loading="lazy" className="aspect-square w-full object-cover" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Activities CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Link to="/activities" className="block overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition hover:border-accent hover:shadow-hover md:p-10">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-accent text-accent-foreground">
                <Megaphone className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">School Activities Feed</h2>
                <p className="text-sm text-muted-foreground">Tournaments, club events, recruitment talks — and clips from the action.</p>
              </div>
            </div>
            <span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">Open feed →</span>
          </div>
        </Link>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "Aisha M.", r: "BCom Y3", q: "Sold my old textbooks in 2 days. Made KSh 4,500!" },
            { n: "David K.", r: "BBIT Y2", q: "Got a MacBook way under retail. Seller was super legit." },
            { n: "Faith W.", r: "LLB Y1", q: "Pre-ordering lunch means I never queue at the cafeteria anymore." },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-accent" />)}
              </div>
              <p className="mt-3 text-sm text-foreground">"{t.q}"</p>
              <div className="mt-4 text-xs font-semibold text-foreground">{t.n}</div>
              <div className="text-xs text-muted-foreground">{t.r}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
