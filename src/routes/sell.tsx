import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Sparkles, TrendingUp, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Become a seller — StrathMart" }] }),
  component: SellPage,
});

function SellPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center lg:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Start earning from your dorm
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
            Turn your campus
            <br />
            <span className="bg-gradient-to-r from-accent to-orange-300 bg-clip-text text-transparent">into your storefront.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/80">
            Sell textbooks, gadgets, fashion, or food directly to fellow Strathmore students. Keep 95.5% of every sale.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full gradient-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-105">
            Open my store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto -mt-10 grid max-w-5xl gap-4 px-4 md:grid-cols-3 lg:px-6">
        {[
          { i: Wallet, t: "4.5% commission", d: "Lowest fees in town. Keep KSh 95.50 of every KSh 100." },
          { i: TrendingUp, t: "Built-in audience", d: "Thousands of students browse daily. No marketing needed." },
          { i: ShieldCheck, t: "Safe payments", d: "Get paid via M-PESA the day after delivery." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-6 shadow-hover">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-accent text-accent-foreground">
              <b.i className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold">{b.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-6">
        <h2 className="text-center font-display text-3xl font-bold">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "1", t: "Sign up", d: "Use your @strathmore.edu email to get verified instantly." },
            { n: "2", t: "List products", d: "Snap a photo, set your price. Goes live in 60 seconds." },
            { n: "3", t: "Get paid", d: "Buyers pay via M-PESA. Funds hit your account next day." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
