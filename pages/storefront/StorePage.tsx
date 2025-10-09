import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, Product } from '../../types';
import { getStoreById, getProductsByStoreId } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../hooks/useAuth';

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const [fetchedStore, fetchedProducts] = await Promise.all([
          getStoreById(storeId),
          getProductsByStoreId(storeId)
        ]);
        setStore(fetchedStore || null);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);
  
  const isOwner = user && store && user.id === store.ownerId;

  if (loading) return <Spinner />;
  if (!store) return <div className="text-center py-12 text-2xl font-bold">لم يتم العثور على المتجر.</div>;

  return (
    <div>
      <header className="bg-white p-8 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row items-center gap-8">
        <img src={store.logo} alt={`${store.name} logo`} className="w-32 h-32 rounded-full object-cover border-4 border-amber-100" />
        <div>
          <h1 className="text-4xl font-extrabold text-green-800">{store.name}</h1>
          <p className="mt-2 text-lg text-gray-600 font-bold">{store.type}</p>
          <p className="mt-4 text-gray-700">{store.description}</p>
          <div className="mt-6 flex items-center flex-wrap gap-4">
            <a href={`tel:${store.phone}`} className="inline-block bg-green-800 text-white font-bold py-3 px-8 rounded-md hover:bg-green-900 transition-colors">
              اتصل بالبائع
            </a>
            {isOwner && (
              <Link to="/dashboard" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors">
                إدارة متجرك
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <h2 className="text-3xl font-bold mb-8 text-green-800">منتجات المتجر</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-700">هذا المتجر لم يضف أي منتجات بعد.</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;