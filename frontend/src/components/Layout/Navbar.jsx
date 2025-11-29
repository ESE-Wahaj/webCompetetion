import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-primary-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="ml-2 text-2xl font-bold text-white">ShoppingMart</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition relative"
                >
                  <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-spring-400 text-primary-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Orders */}
                <Link
                  to="/orders"
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Orders
                </Link>

                {/* Admin Link */}
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="text-spring-400 hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Admin
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">Hi, {user?.first_name || user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-spring-400 text-primary-900 hover:bg-spring-500 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
