import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getStoreForUser, getProductsForStore, getSubscription } from '../../services/api';
import { Store, Product, Subscription } from '../../types';
import Spinner from '../../components/ui/Spinner';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 space-x-reverse">
        <div className="bg-green-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const DashboardOverviewPage: React.FC = () => {
    const { user } = useAuth();
    const [store, setStore] = useState<Store | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const fetchedStore = await getStoreForUser(user.id);
                if (fetchedStore) {
                    setStore(fetchedStore);
                    const [fetchedProducts, fetchedSub] = await Promise.all([
                        getProductsForStore(fetchedStore.id),
                        getSubscription(fetchedStore.id)
                    ]);
                    setProducts(fetchedProducts);
                    setSubscription(fetchedSub || null);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <Spinner />;
    if (!store) return <p>لم يتم العثور على متجرك.</p>

    const getSubscriptionStatusText = () => {
        if (!subscription) return "غير معروف";
        switch (subscription.status) {
            case 'active': return `نشط (ينتهي في ${subscription.expires?.toLocaleDateString('ar-DZ')})`;
            case 'trial': return `فترة تجريبية (تنتهي في ${subscription.trialEnds?.toLocaleDateString('ar-DZ')})`;
            case 'expired': return "منتهي الصلاحية";
        }
    };
    
    const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    const SubscriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">مرحباً في متجر {store.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="إجمالي المنتجات" value={products.length} icon={<ProductIcon />} />
                <StatCard title="حالة الاشتراك" value={getSubscriptionStatusText()} icon={<SubscriptionIcon />} />
                {/* Add more stats here */}
            </div>

            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">المنتجات المضافة مؤخراً</h2>
                {products.length > 0 ? (
                    <ul className="space-y-3">
                        {products.slice(0, 5).map(p => (
                            <li key={p.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-md">
                                <span>{p.name}</span>
                                <span className="font-bold text-gray-800">{p.price} دج</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>لم تقم بإضافة أي منتجات بعد.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardOverviewPage;