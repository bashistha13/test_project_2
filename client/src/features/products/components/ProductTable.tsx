import { useEffect, useState } from "react";
import type { Product } from "../types";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/getProducts";
import { Package, AlertCircle, Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ProductModal } from "./ProductModal";

export const ProductTable = () => {
  const { user } = useAuth(); // Get user role
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 1. Fetch Data
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 2. Handle Add/Edit Submit
  const handleSave = async (formData: any) => {
    if (editingProduct) {
      // Edit Mode
      await updateProduct(editingProduct.productId, formData);
    } else {
      // Add Mode
      await createProduct(formData);
    }
    await loadProducts(); // Refresh table
  };

  // 3. Handle Delete
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.productId !== id)); // Optimistic update
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;

  const isAdmin = user?.role === "Admin";

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Inventory</h2>
           <p className="text-sm text-gray-500">Manage your store's products</p>
        </div>
        
        {/* Only show Add button for Admin */}
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                {isAdmin && <th className="p-4 text-right pr-6">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {products.map((product) => (
                <tr key={product.productId} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-gray-900 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="font-semibold">{product.productName}</div>
                      <div className="text-xs text-gray-500 font-normal mt-0.5">{product.description || "No description"}</div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-4">{product.quantity}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      product.quantity > 0 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.productId)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-900">No products found</p>
            <p className="text-sm">Get started by adding a new product.</p>
          </div>
        )}
      </div>

      {/* The Popup Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingProduct}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      />
    </div>
  );
};