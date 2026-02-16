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
  const [isLoading, setIsLoading] = useState(false);
  
  // State: Strings used to control inputs perfectly
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',    
    quantity: '', 
    categoryId: 0
  });

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // Default to first category if adding new and categories exist
        if (!initialData && data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].categoryId }));
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen, initialData]);

  // 2. Load Data (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName,
        description: initialData.description || '',
        price: initialData.price.toString(),       
        quantity: initialData.quantity.toString(), 
        categoryId: initialData.categoryId
      });
    } else {
      // Reset (Add Mode)
      setFormData(prev => ({ 
        productName: '', 
        description: '', 
        price: '', 
        quantity: '', 
        categoryId: prev.categoryId || 0 
      }));
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check for category
    if (formData.categoryId === 0) {
      alert("Please select a category");
      return;
    }

    setIsLoading(true);

    try {
      // CONVERT: Validates and converts strings to numbers just before saving
      const finalPrice = parseFloat(formData.price);
      const finalQty = parseInt(formData.quantity);

      if (isNaN(finalPrice) || finalPrice <= 0) {
        alert("Price must be greater than 0");
        setIsLoading(false);
        return;
      }

      const payload = {
        ...formData,
        price: finalPrice,
        quantity: isNaN(finalQty) ? 0 : finalQty
      };
      
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save product. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  // INPUT HANDLER: Allows valid typing (decimals, clearing box)
  const handleNumberChange = (field: 'price' | 'quantity', value: string) => {
    // Regex: Allows empty string OR numbers with one optional decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    // BLUR EFFECT: backdrop-blur-sm is applied here to blur the background
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b p-6 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
            >
              <option value={0} disabled>Choose a category...</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (NPR)</label>
              <input
                type="text"
                inputMode="decimal"
                required
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.price}
                onChange={(e) => handleNumberChange('price', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.quantity}
                onChange={(e) => handleNumberChange('quantity', e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-all active:scale-95"
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