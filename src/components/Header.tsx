import { ShoppingCart, BookOpen } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onNavigate: (section: string) => void;
}

export default function Header({ cartItemsCount, onCartClick, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BookStore</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-blue-600 transition">
              Home
            </button>
            <button onClick={() => onNavigate('books')} className="text-gray-700 hover:text-blue-600 transition">
              Books
            </button>
            <button onClick={() => onNavigate('stationery')} className="text-gray-700 hover:text-blue-600 transition">
              Stationery
            </button>
            <button onClick={() => onNavigate('contact')} className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </button>
          </nav>

          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
