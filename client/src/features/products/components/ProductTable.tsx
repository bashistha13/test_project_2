import { useEffect, useState } from "react";
import type { Product } from "../types";
import { getProducts } from "../api/getProducts";
import { Package, AlertCircle, Loader2 } from "lucide-react";

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
        setError("Failed to fetch products. Is the backend server running?");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-6 w-6" />
          <span className="text-lg font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 sm:rounded-3xl">
      <div className="border-b border-gray-200 px-6 py-5">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          All Products
        </h3>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          A list of all products in your inventory including their name, price, and stock status.
        </p>
      </div>
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-8"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/50">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        {product.productName}
                      </div>
                    </td>
                    <td className="max-w-xs truncate px-3 py-4 text-sm text-gray-500">
                      {product.description || (
                        <span className="italic text-gray-400">No description</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.quantity} units
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          product.quantity > 0
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${product.quantity > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};