import { useEffect, useState } from "react";
import type { Product } from "../types";
import { getProducts } from "../api/getProducts";

export const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Is the .NET server running?");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="p-4 text-center text-gray-500">Loading products...</div>
    );
  if (error)
    return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-900">
                Product Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">
                Description
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">
                Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">
                Stock
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.productName}
                </td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-xs">
                  {product.description || "-"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-700">{product.quantity}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.quantity > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
