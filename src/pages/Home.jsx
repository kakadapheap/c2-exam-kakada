import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import products from "../assets/data/products.json";

export default function Home() {
  const [categories, setCategories] = useState([]); // dynamic categories

  const items = products;

  // Featured: first 4 items
  const featured = items.slice(0, 4);

  // Latest: sort by creationAt desc, take 4
  const latest = [...items]
    .sort(
      (a, b) =>
        new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime()
    )
    .slice(0, 4);

  // Fetch 4 categories dynamically from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://api.escuelajs.co/api/v1/categories?limit=4"
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="rounded-2xl border bg-white p-5">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            New arrivals
          </div>

          <h1 className="mt-3 text-2xl font-semibold leading-tight">
            Discover products you’ll love
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Browse categories, view latest items, and manage products & users in
            one simple app.
          </p>

          <div className="mt-4 flex gap-3">
            <Link
              to="/products"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Explore products
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Featured products</h2>
            <Link to="/products" className="text-sm text-slate-700 underline">
              View all
            </Link>
          </div>

          {/* Responsive grid: 1 col mobile, 2 md, 4 lg */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="flex flex-col w-full rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
              >
                {/* Product Image */}
                <img
                  src={p.images?.[0] ?? "https://placehold.co/600x400"}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />

                {/* Card Content */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.title}</div>
                      <div className="truncate text-xs text-slate-600">
                        {p.category?.name}
                      </div>
                    </div>
                    <div className="shrink-0 font-semibold">${p.price}</div>
                  </div>

                  <p className="line-clamp-2 text-sm text-slate-600">
                    {p.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Categories</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 hover:bg-slate-50 transition"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-20 w-20 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="text-center">
                  <div className="truncate font-medium">{c.name}</div>
                  <div className="text-xs text-slate-600">Tap to browse</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Products */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Latest products</h2>
            <Link to="/products" className="text-sm text-slate-700 underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {latest.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="flex flex-col w-full rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
              >
                <img
                  src={p.images?.[0] ?? "https://placehold.co/600x400"}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="shrink-0 font-semibold">${p.price}</div>
                  </div>
                  <div className="truncate text-xs text-slate-600">
                    {p.category?.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
