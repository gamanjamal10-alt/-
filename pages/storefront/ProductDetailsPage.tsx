
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, Store } from '../../types';
import { getProductById, getStoreById } from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          const fetchedStore = await getStoreById(fetchedProduct.storeId);
          setStore(fetchedStore || null);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  if (loading) return <Spinner />;
  if (!product) return <div className="text-center py-12 text-2xl font-bold">لم يتم العثور على المنتج.</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
          {/* Add a gallery for multiple images if available */}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-4xl font-bold text-green-700">{product.price.toLocaleString()} دج</p>
          <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>
          <div className="mt-8 p-4 bg-gray-50 rounded-md border">
            <h2 className="font-bold text-lg">معلومات البائع</h2>
            {store ? (
                <>
                    <p className="mt-2 text-gray-800">
                        <span className="font-semibold">المتجر:</span>{' '}
                        <Link to={`/stores/${store.id}`} className="text-green-600 hover:underline">{store.name}</Link>
                    </p>
                    <a href={`tel:${store.phone}`} className="mt-4 inline-block w-full text-center bg-green-700 text-white font-bold py-3 px-6 rounded-md hover:bg-green-800 transition-colors">
                        اتصل بالبائع ({store.phone})
                    </a>
                </>
            ) : <p>جاري تحميل معلومات البائع...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
