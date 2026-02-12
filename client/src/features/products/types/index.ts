export interface Product {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: number;    // Ensure this exists
  categoryName?: string; // Optional for display
}

// --- NEW INTERFACE ---
export interface Category {
  categoryId: number;
  categoryName: string;
}