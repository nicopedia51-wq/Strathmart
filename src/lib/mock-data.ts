// Static reference data only. Real products are user-uploaded via
// `products-store.ts` and real meals via `meals-store.ts`.

export type Category =
  | "Electronics"
  | "Books"
  | "Fashion"
  | "Beauty"
  | "Sports"
  | "Home"
  | "Stationery"
  | "Other";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  rating: number;
  reviews: number;
  sold: number;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  description: string;
  inStock: number;
  badge?: "Hot" | "New" | "Deal";
  createdAt?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  followers: number;
  bio: string;
}

export const categories: { name: Category; icon: string }[] = [
  { name: "Electronics", icon: "💻" },
  { name: "Books", icon: "📚" },
  { name: "Fashion", icon: "👕" },
  { name: "Beauty", icon: "✨" },
  { name: "Sports", icon: "⚽" },
  { name: "Home", icon: "🏠" },
  { name: "Stationery", icon: "✏️" },
  { name: "Other", icon: "🎁" },
];

export const formatKsh = (n: number) =>
  `KSh ${n.toLocaleString("en-KE")}`;
