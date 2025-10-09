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
        const fetchStoreData = async () => {
            if (!storeId) return;
            setLoading(true);
            try {
                const [fetchedStore, fetchedProducts] = await Promise.all([
                    getStoreById(storeId),
                    getProductsByStoreId(storeId),
                ]);

                if (fetchedStore) {
                    setStore(fetchedStore);
                    setProducts(fetchedProducts);
                } else {
                    setStore(null);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [storeId]);

    if (loading) return <Spinner />;
    if (!store) return <div className="text-center py-12 text-2xl font-bold">لم يتم العثور على المتجر.</div>;

    return (
        <div>
            <header className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <div className="flex flex-col md:flex-row items-center space-x-6 space-x-reverse">
                    <img src={store.logo} alt={store.name} className="w-32 h-32 rounded-full object-cover border-4 border-green-200" />
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{store.name}</h1>
                        <p className="mt-2 text-gray-600">{store.description}</p>
                        <p className="mt-4 font-semibold text-gray-700">
                            <a href={`tel:${store.phone}`} className="hover:text-green-800">
                                رقم الهاتف: {store.phone}
                            </a>
                        </p>
                    </div>
                </div>
            </header>

            <section>
                <h2 className="text-3xl font-bold mb-6 text-green-800">منتجات المتجر</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-500">هذا المتجر لم يضف أي منتجات بعد.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default StorePage;
