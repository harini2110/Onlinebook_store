import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Product, CartItem, OrderFormData } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import Contact from './components/Contact';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<'home' | 'books' | 'stationery' | 'contact'>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevItems;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const submitOrder = async (formData: OrderFormData) => {
    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            ...formData,
            total_amount: total,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      alert('Order placed successfully! We will contact you soon.');
      setCartItems([]);
      setIsCheckoutOpen(false);
      setCurrentSection('home');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  const getFilteredProducts = () => {
    if (currentSection === 'books') {
      return products.filter((p) => p.category === 'books');
    }
    if (currentSection === 'stationery') {
      return products.filter((p) => p.category === 'stationery');
    }
    return products;
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={setCurrentSection}
      />

      {currentSection === 'home' && (
        <>
          <Hero onShopClick={() => setCurrentSection('books')} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductList
              products={products.filter((p) => p.category === 'books').slice(0, 3)}
              title="Featured Books"
              onAddToCart={addToCart}
            />
            <ProductList
              products={products.filter((p) => p.category === 'stationery').slice(0, 3)}
              title="Featured Stationery"
              onAddToCart={addToCart}
            />
          </div>
        </>
      )}

      {currentSection === 'books' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductList
            products={getFilteredProducts()}
            title="Books"
            onAddToCart={addToCart}
          />
        </div>
      )}

      {currentSection === 'stationery' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductList
            products={getFilteredProducts()}
            title="Stationery"
            onAddToCart={addToCart}
          />
        </div>
      )}

      {currentSection === 'contact' && <Contact />}

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 BookStore. All rights reserved.</p>
        </div>
      </footer>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onSubmitOrder={submitOrder}
      />
    </div>
  );
}

export default App;
