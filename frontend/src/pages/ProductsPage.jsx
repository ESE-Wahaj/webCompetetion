import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/Products/ProductCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getAllCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory) filters.category_id = selectedCategory;
      if (searchQuery) filters.search = searchQuery;

      const response = await productService.getAllProducts(filters);
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="my-12" />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">{products.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
