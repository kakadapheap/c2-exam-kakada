import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductNew() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categoryId: "",
    description: "",
    image: "",
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://api.escuelajs.co/api/v1/categories?limit=10"
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        alert("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "image") setImagePreview(value);
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) return alert("Please enter a product title");
    if (!formData.price || Number(formData.price) <= 0)
      return alert("Please enter a valid price");
    if (!formData.categoryId) return alert("Please select a category");
    if (!formData.description.trim())
      return alert("Please enter a description");
    if (!formData.image.trim()) return alert("Please enter an image URL");
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const newProduct = {
      title: formData.title.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      categoryId: Number(formData.categoryId),
      images: [formData.image],
    };

    try {
      const res = await fetch(
        "https://api.escuelajs.co/api/v1/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (res.ok) {
        alert("Successfully saved a new product");
        navigate("/"); // redirect after success
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to save product");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-semibold">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Product title"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            name="image"
            type="url"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 w-24 object-cover rounded border"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/80?text=Invalid+Image";
              }}
            />
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Product description"
          />
        </div>

        {/* Submit / Cancel */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
              isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save product"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
