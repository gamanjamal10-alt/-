
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Store, Product } from '../../types';
import { getStoreById, getProductsByStoreId } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import ProductCard from '../../components/ProductCard';

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Spinner />;
  if (!store) return <div className="text-center py-12 text-2xl font-bold">لم يتم العثور على المتجر.</div>;

  return (
    <div>
      <header className="bg-white p-8 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row items-center gap-8">
        <img src={store.logo} alt={`${store.name} logo`} className="w-32 h-32 rounded-full object-cover border-4 border-green-200" />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{store.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{store.type}</p>
          <p className="mt-4 text-gray-700">{store.description}</p>
          <a href={`tel:${store.phone}`} className="mt-6 inline-block bg-green-700 text-white font-bold py-3 px-8 rounded-md hover:bg-green-800 transition-colors">
            اتصل بالبائع
          </a>
        </div>
      </header>
      
      <h2 className="text-3xl font-bold mb-8">منتجات المتجر</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">هذا المتجر لم يضف أي منتجات بعد.</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;
