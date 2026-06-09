import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { categories, type Category, formatKsh } from "@/lib/mock-data";
import { useProducts, productsStore } from "@/lib/products-store";
import { notificationsStore } from "@/lib/notifications-store";
import { Search, SlidersHorizontal, Plus, X, Upload, ShoppingBag, Tag, Zap, Award, Truck } from "lucide-react";

async function compressImage(file: File, maxDim = 1280, quality = 0.78): Promise<string> {
  const dataUrl: string = await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("Could not read image."));
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error("Invalid image file."));
    i.src = dataUrl;
  });
  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    const r = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * r);
    height = Math.round(height * r);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Marketplace — StrathMart" },
      { name: "description", content: "Buy and sell anything on campus. Browse student-listed products or upload your own in seconds." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc" | "rating">("newest");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (query === "" || p.title.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "newest")
      list = [...list].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || ""),
      );
    return list;
  }, [products, query, cat, sort]);

  const deals = useMemo(
    () => products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 6),
    [products],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Header band */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Marketplace</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {products.length} active listing{products.length !== 1 ? "s" : ""} from verified Strathmore students
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 rounded-full gradient-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow transition hover:scale-105"
            >
              <Plus className="h-4 w-4" /> Upload product
            </button>
          </div>

          {/* Amazon-style feature strip */}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { i: Tag, t: "Today's deals", d: "Discounted listings" },
              { i: Zap, t: "Lightning shipping", d: "Same-day on campus" },
              { i: Award, t: "Top-rated sellers", d: "Verified students" },
              { i: Truck, t: "Hostel delivery", d: "Pickup or drop-off" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-accent">
                  <f.i className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{f.t}</div>
                  <div className="text-[11px] text-muted-foreground">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        {/* Deals row */}
        {deals.length > 0 && (
          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">⚡ Today's deals</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {deals.map((p) => {
                const off = Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100);
                return (
                  <Link
                    key={p.id}
                    to="/products/$id"
                    params={{ id: p.id }}
                    className="group relative w-44 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-hover"
                  >
                    <img src={p.image} alt={p.title} className="aspect-square w-full object-cover transition group-hover:scale-110" />
                    <span className="absolute right-2 top-2 rounded-md bg-destructive px-2 py-1 text-[10px] font-bold text-destructive-foreground">
                      -{off}%
                    </span>
                    <div className="p-3">
                      <div className="line-clamp-1 text-xs font-medium">{p.title}</div>
                      <div className="font-display text-base font-bold text-accent">{formatKsh(p.price)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Search + sort */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-accent"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(["All", ...categories.map((c) => c.name)] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c as Category | "All")}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                cat === c
                  ? "border-accent bg-accent text-accent-foreground shadow-card"
                  : "border-border bg-card text-foreground hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-16 grid place-items-center text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">
              {products.length === 0 ? "No products yet — be the first to upload!" : "No products match your search."}
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {products.length === 0
                ? "List your first item in under a minute. Books, electronics, fashion — anything goes."
                : "Try a different category or clear your search."}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => setShowUpload(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-full gradient-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow"
              >
                <Upload className="h-4 w-4" /> Upload your first product
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {showUpload && <UploadProductDialog onClose={() => setShowUpload(false)} />}

      <SiteFooter />
    </div>
  );
}

function UploadProductDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState<Category>("Electronics");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState("1");
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large. Please pick one under 10 MB.");
      return;
    }
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim() || !sellerName.trim() || !sellerPhone.trim() || !image) {
      setError("Please fill in all fields and add a photo.");
      return;
    }
    try {
      const created = productsStore.add({
        title: title.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image,
        category,
        sellerId: `u-${sellerPhone.replace(/\D/g, "")}`,
        sellerName: sellerName.trim(),
        sellerPhone: sellerPhone.trim(),
        description: description.trim(),
        inStock: Math.max(1, Number(inStock) || 1),
      });
      toast.success("Product published 🎉", { description: `${created.title} is now live.` });
      notificationsStore.push({
        kind: "order",
        title: "Listing live",
        body: `${created.title} is now visible to other students.`,
        href: "/products",
      });
      onClose();
    } catch (err) {
      const msg = (err as Error).message || "Could not save product.";
      setError(
        msg.toLowerCase().includes("quota")
          ? "Browser storage is full. Try a smaller image or remove some old listings."
          : msg,
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-hover"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Upload a product</h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">List your item — fellow students will see it instantly.</p>

        {error && <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Product photo</span>
            <div className="flex items-center gap-3">
              <label className="grid h-24 w-24 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary hover:border-accent">
                {image ? (
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
              <p className="text-xs text-muted-foreground">Tap to upload (JPG/PNG · max 3 MB).</p>
            </div>
          </label>

          <Field label="Title" value={title} onChange={setTitle} placeholder="e.g., HP ProBook 440 (used, 8GB RAM)" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (KSh)" value={price} onChange={setPrice} type="number" placeholder="3500" />
            <Field label="Original Price (optional)" value={originalPrice} onChange={setOriginalPrice} type="number" placeholder="5000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm">
                {categories.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </label>
            <Field label="In stock" value={inStock} onChange={setInStock} type="number" placeholder="1" />
          </div>
          <Field label="Your name" value={sellerName} onChange={setSellerName} placeholder="Jane Wanjiku" />
          <Field label="Your phone (M-PESA)" value={sellerPhone} onChange={setSellerPhone} placeholder="07XX XXX XXX" />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Condition, what's included, where buyers can pick it up..."
              className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-11 flex-1 rounded-full border border-border bg-card text-sm font-semibold hover:bg-secondary">
            Cancel
          </button>
          <button type="submit" className="h-11 flex-1 rounded-full gradient-accent text-sm font-semibold text-accent-foreground shadow-card hover:shadow-glow">
            Publish listing
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </label>
  );
}
