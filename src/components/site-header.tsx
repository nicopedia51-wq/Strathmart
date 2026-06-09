import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, Megaphone, Utensils, Sparkles, Flame } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { NotificationsBell } from "@/components/notifications-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import strathLogo from "@/assets/strathmore-logo.png";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <img src={strathLogo} alt="Strathmore University" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline">
            Strath<span className="text-accent">Mart</span>
          </span>
        </Link>

        <div className="relative ml-2 hidden flex-1 max-w-xl md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products, sellers, food..."
            className="h-10 w-full rounded-full border border-border bg-secondary pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <Link to="/products" className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:block">
            Market
          </Link>
          <Link to="/meals" className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:block">
            Meals
          </Link>
          <Link to="/sellers" className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:block">
            Sellers
          </Link>
          <Link to="/activities" className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:block">
            Activities
          </Link>
          <Link to="/moments" className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:inline-flex">
            <Sparkles className="h-3.5 w-3.5" /> Moments
          </Link>

          {/* Streak chip */}
          <div className="hidden items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent md:inline-flex" title="Campus streak">
            <Flame className="h-3.5 w-3.5" /> 5
          </div>

          {/* Mobile icons */}
          <Link to="/moments" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground lg:hidden" aria-label="Moments">
            <Sparkles className="h-5 w-5" />
          </Link>
          <Link to="/meals" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden" aria-label="Meals">
            <Utensils className="h-5 w-5" />
          </Link>
          <Link to="/activities" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground md:hidden" aria-label="Activities">
            <Megaphone className="h-5 w-5" />
          </Link>

          <NotificationsBell />
          <ThemeToggle />

          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <Link to="/sell" className="ml-1 hidden rounded-full gradient-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-card transition hover:shadow-glow sm:block">
            Sell
          </Link>
        </nav>
      </div>
    </header>
  );
}
