export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'books' | 'stationery';
  image_url: string;
  stock: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
}
