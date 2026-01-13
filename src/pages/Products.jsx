import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products dynamically
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.escuelajs.co/api/v1/products?limit=12&offset=12"
        );
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-slate-600 mt-10">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">
            Manage your product catalog
          </p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add product
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="flex flex-col w-full rounded-xl border bg-white overflow-hidden hover:shadow-lg transition"
          >
            {/* Product Image */}
            <img
              src={p.images?.[0] ?? "https://placehold.co/600x400"}
              alt={p.title}
              className="h-52 w-full object-cover"
              loading="lazy"
            />

            {/* Card Content */}
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium line-clamp-1">{p.title}</div>
                  <div className="text-sm text-slate-600 line-clamp-1">
                    {p.category?.name}
                  </div>
                </div>
                <div className="shrink-0 font-semibold">${p.price}</div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2">
                {p.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
