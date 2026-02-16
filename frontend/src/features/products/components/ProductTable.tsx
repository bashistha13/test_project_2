import { useEffect, useState } from "react";
import type { Product } from "../types";
import { getProducts, deleteProduct, updateProduct, createProduct } from "../api/getProducts";
import { Package, Loader2, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useDashboard } from "../../../context/DashboardContext"; // Import Context
import { ProductModal } from "./ProductModal";

export const ProductTable = () => {
  const { user } = useAuth(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get State from the Bridge
  const { searchTerm, selectedCategory, triggerAddModal, setTriggerAddModal } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load Data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen for "Add Product" click from Sidebar
  useEffect(() => {
    if (triggerAddModal) {
      setEditingProduct(null);
      setIsModalOpen(true);
      setTriggerAddModal(false); // Reset trigger
    }
  }, [triggerAddModal, setTriggerAddModal]);

  // Filter & Sort
  const filtered = products.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "All" || p.categoryName === selectedCategory)
  );

  const handleSave = async (payload: any) => {
    if (editingProduct) {
      await updateProduct(editingProduct.productId, payload);
    } else {
      await createProduct(payload);
    }
    await loadData();
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-4">
      {/* FIXED: Removed duplicate 'Product Management' header here */}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Price (NPR)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                {user?.role === 'Admin' && <th className="p-4 text-right pr-6">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filtered.map(product => (
                <tr key={product.productId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 pl-6 flex items-center gap-3 font-medium text-gray-900">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Package size={18} /></div>
                    {product.productName}
                  </td>
                  <td className="p-4 font-bold">Rs. {product.price.toLocaleString()}</td>
                  <td className="p-4 text-gray-600">{product.quantity}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                      {product.categoryName || "Uncategorized"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${product.quantity > 0 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  {user?.role === 'Admin' && (
                    <td className="p-4 text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                        <button onClick={() => deleteProduct(product.productId).then(loadData)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} initialData={editingProduct} 
        title={editingProduct ? "Edit Product" : "Add New Product"} 
      />
    </div>
  );
};