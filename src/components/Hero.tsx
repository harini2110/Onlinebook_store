interface HeroProps {
  onShopClick: () => void;
}

export default function Hero({ onShopClick }: HeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to BookStore
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your one-stop shop for books and stationery
          </p>
          <button
            onClick={onShopClick}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
