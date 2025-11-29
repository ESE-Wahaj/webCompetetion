import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">ShoppingMart</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted e-commerce platform with secure transactions and quality products.
            Experience seamless shopping with advanced security features.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/products">
              <Button variant="primary" className="text-lg px-8 py-3">
                Browse Products
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="text-lg px-8 py-3">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
            <p className="text-gray-600">
              Advanced security with JWT authentication and encrypted transactions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
            <p className="text-gray-600">
              Curated selection of products across multiple categories
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Quick and reliable shipping with real-time order tracking
            </p>
          </div>
        </div>

        {/* Tech Stack Highlight */}
        <div className="mt-20 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-primary-600 font-semibold text-lg">React</p>
              <p className="text-sm text-gray-600">Modern UI</p>
            </div>
            <div>
              <p className="text-primary-600 font-semibold text-lg">Node.js</p>
              <p className="text-sm text-gray-600">Backend API</p>
            </div>
            <div>
              <p className="text-primary-600 font-semibold text-lg">PostgreSQL</p>
              <p className="text-sm text-gray-600">Database</p>
            </div>
            <div>
              <p className="text-primary-600 font-semibold text-lg">DLL Security</p>
              <p className="text-sm text-gray-600">Admin Protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
