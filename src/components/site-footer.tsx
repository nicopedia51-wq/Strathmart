import { Link } from "@tanstack/react-router";
import strathLogo from "@/assets/strathmore-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 lg:px-6">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <img src={strathLogo} alt="Strathmore University" width={36} height={36} className="h-9 w-9 object-contain bg-white rounded-md p-0.5" />
            StrathMart
          </div>
          <p className="mt-3 text-sm text-primary-foreground/70">
            The official student marketplace for Strathmore University. Buy, sell, and eat — all in one place.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/products">All products</Link></li>
            <li><Link to="/products">Electronics</Link></li>
            <li><Link to="/products">Food & meals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Sell</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/sell">Become a seller</Link></li>
            <li>Seller fees: 4.5%</li>
            <li>Payouts via M-PESA</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Help center</li>
            <li>Contact us</li>
            <li>Terms & privacy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © 2026 StrathMart. Built by students, for students.
      </div>
    </footer>
  );
}
