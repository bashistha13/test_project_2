export interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  // If your API returns the category name nested:
  category?: {
    categoryId: number;
    categoryName: string;
  };
}