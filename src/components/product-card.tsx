import { Link } from "@tanstack/react-router";
import { Star, ShoppingCart } from "lucide-react";
import { formatKsh, type Product } from "@/lib/mock-data";
import { cart } from "@/lib/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover">
      <Link to="/products/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          {product.badge && (
            <span className="absolute left-2 top-2 rounded-full gradient-accent px-2.5 py-1 text-[10px] font-bold uppercase text-accent-foreground shadow-card">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute right-2 top-2 rounded-md bg-destructive px-2 py-1 text-[10px] font-bold text-destructive-foreground">
              -{discount}%
            </span>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground hover:text-accent">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-accent">{formatKsh(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatKsh(product.originalPrice)}</span>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>· {product.sold} sold</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              cart.add(product.id);
            }}
            aria-label="Add to cart"
            className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 truncate text-xs text-muted-foreground">by {product.sellerName}</p>
      </div>
    </div>
  );
}
