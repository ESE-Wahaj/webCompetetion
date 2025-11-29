import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Admin/AdminRoute';

// Pages
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Placeholder components for remaining pages
const CartPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Cart Page</h1><p>Cart functionality coming soon. Backend API is ready!</p></div>;
const CheckoutPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Checkout Page</h1></div>;
const OrdersPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Orders Page</h1></div>;
const AdminPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p>Admin features coming soon. DLL module is ready!</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
