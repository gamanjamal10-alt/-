import React, { useState, useEffect } from 'react';
import { getProducts, getStores } from '../../services/api';
import { Product, Store } from '../../types';
import ProductCard from '../../components/ProductCard';
import Spinner from '../../components/ui/Spinner';
import StoreCard from '../../components/StoreCard';

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            setLoading(true);
            try {
                const [fetchedProducts, fetchedStores] = await Promise.all([
                    getProducts(),
                    getStores()
                ]);
                setProducts(fetchedProducts);
                setStores(fetchedStores);
            } catch (error) {
                console.error("Failed to fetch home page data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900">أهلاً بك في سوق الفلاح</h1>
                <p className="mt-4 text-lg text-gray-600">منصة المزارعين وتجار الجملة في الجزائر. اكتشف أجود المنتجات الطازجة مباشرة من مصدرها.</p>
            </div>
            
            <section>
                <h2 className="text-3xl font-bold mb-6 text-green-800">أحدث المنتجات</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">لا توجد منتجات لعرضها حالياً.</p>
                )}
            </section>

            <section className="mt-16">
                <h2 className="text-3xl font-bold mb-6 text-green-800">المتاجر المميزة</h2>
                {stores.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map(store => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">لا توجد متاجر لعرضها حالياً.</p>
                )}
            </section>
        </div>
    );
};

export default HomePage;
