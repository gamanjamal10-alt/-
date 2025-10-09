import React, { useState, useEffect, useMemo } from 'react';
import { Product, Store, StoreType } from '../../types';
import { getProducts, getStores } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/ui/Spinner';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<StoreType | 'all'>('all');
  
  const storeTypes = useMemo(() => ['all', ...Object.values(StoreType)], []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedStores] = await Promise.all([
          getProducts(),
          getStores(),
        ]);
        setProducts(fetchedProducts);
        setStores(fetchedStores);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const storeTypeMap = useMemo(() => {
    return stores.reduce((map, store) => {
      map.set(store.id, store.type);
      return map;
    }, new Map<string, StoreType>());
  }, [stores]);
  
  const filteredProducts = useMemo(() => {
    return products
        .filter(product => {
            const storeType = storeTypeMap.get(product.storeId);
            if (selectedType !== 'all' && storeType !== selectedType) {
                return false;
            }
            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
  }, [products, searchTerm, selectedType, storeTypeMap]);


  return (
    <div>
      <section className="text-center py-12 bg-stone-100 rounded-lg">
        <h1 className="text-4xl font-extrabold text-green-900">أهلاً بك في سوق الفلاح</h1>
        <p className="mt-4 text-lg text-gray-700">منصة لبيع وشراء المنتجات الفلاحية مباشرة من المصدر.</p>
      </section>

      <section className="mt-12">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-green-500 focus:border-green-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as StoreType | 'all')}
            >
            {storeTypes.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'كل الأنواع' : type}</option>
            ))}
          </select>
        </div>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        { !loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-700">لا توجد منتجات مطابقة</h3>
                <p className="text-gray-500 mt-2">حاول تغيير كلمات البحث أو الفلاتر.</p>
            </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;