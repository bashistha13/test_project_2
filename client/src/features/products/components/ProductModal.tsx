import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Product, Category } from '../types';
import { getCategories } from '../api/getProducts';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Product | null;
  title: string;
}

export const ProductModal = ({ isOpen, onClose, onSubmit, initialData, title }: ProductModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: 0 // Will default to the first category found
  });
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Categories on Mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // If we are adding a new product, default to the first category
        if (!initialData && data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].categoryId }));
        }
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  // 2. Load Product Data (For Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        description: initialData.description || '',
        price: initialData.price,
        quantity: initialData.quantity,
        categoryId: initialData.categoryId
      });
    } else {
      // Reset for Add Mode
      setFormData(prev => ({ 
        productName: '', 
        description: '', 
        price: 0, 
        quantity: 0, 
        categoryId: prev.categoryId || 0 
      }));
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Category Dropdown (NEW) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500 bg-white"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
            >
              <option value={0} disabled>Select a Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};