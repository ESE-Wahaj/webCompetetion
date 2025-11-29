import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="card p-4 flex flex-col h-full">
      {/* Image */}
      <div className="w-full h-48 bg-whisper-100 rounded-lg mb-4 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Category Badge */}
      {product.category_name && (
        <span className="badge badge-primary mb-2">{product.category_name}</span>
      )}

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
        {product.description}
      </p>

      {/* Price and Stock */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-primary-600">
          {formatPrice(product.price)}
        </span>
        <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-gray-600'}`}>
          {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
        </span>
      </div>

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleAddToCart}
        disabled={adding || isOutOfStock}
      >
        {isOutOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
      </Button>
    </div>
  );
};

export default ProductCard;
