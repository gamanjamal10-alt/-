
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Subscription } from '../../types';
import { getSubscription, processMockPayment } from '../../services/api';
import { ANNUAL_SUBSCRIPTION_FEE } from '../../constants';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';

const SubscriptionPage: React.FC = () => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);

    const fetchSubscription = useCallback(async () => {
        if (!user?.storeId) return;
        setLoading(true);
        try {
            const sub = await getSubscription(user.storeId);
            setSubscription(sub || null);
        } catch (error) {
            console.error("Failed to fetch subscription:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.storeId]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);
    
    const handlePayment = async (method: 'BaridiMob' | 'CCP') => {
        if (!user?.storeId) return;
        setIsPaying(true);
        try {
            await processMockPayment(user.storeId, method);
            alert(`تم الدفع بنجاح عبر ${method}! تم تفعيل اشتراكك.`);
            await fetchSubscription(); // Refresh subscription status
        } catch (error) {
            alert('حدث خطأ أثناء عملية الدفع.');
            console.error("Payment failed:", error);
        } finally {
            setIsPaying(false);
        }
    };

    const renderSubscriptionStatus = () => {
        if (loading) return <Spinner />;
        if (!subscription) return <p>لا توجد معلومات عن اشتراكك.</p>;

        const { status, trialEnds, expires } = subscription;
        let message, title, bgColor;

        switch (status) {
            case 'active':
                title = "اشتراكك نشط";
                message = `شكراً لك! متجرك فعال وسيظل كذلك حتى تاريخ ${expires?.toLocaleDateString('ar-DZ')}.`;
                bgColor = 'bg-green-100 border-green-500 text-green-800';
                break;
            case 'trial':
                title = "أنت في الفترة التجريبية";
                message = `استمتع بكافة الميزات مجاناً. تنتهي الفترة التجريبية في ${trialEnds?.toLocaleDateString('ar-DZ')}.`;
                bgColor = 'bg-blue-100 border-blue-500 text-blue-800';
                break;
            case 'expired':
                title = "انتهت صلاحية اشتراكك";
                message = "تم إيقاف متجرك مؤقتاً. يرجى تجديد اشتراكك لإعادة تفعيله وعرض منتجاتك للزبائن.";
                bgColor = 'bg-red-100 border-red-500 text-red-800';
                break;
        }

        return (
            <div className={`p-6 border-r-4 ${bgColor} rounded-md shadow`}>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-2">{message}</p>
            </div>
        );
    };

    const needsPayment = !subscription || subscription.status === 'expired';

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">الاشتراك</h1>
            <div className="space-y-8">
                {renderSubscriptionStatus()}

                {(needsPayment || subscription?.status === 'trial') && (
                     <div className="p-8 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">تجديد الاشتراك السنوي</h2>
                        <p className="mt-2 text-gray-600">
                            احصل على وصول كامل لمنصة سوق الفلاح لمدة سنة كاملة.
                        </p>
                        <p className="my-4 text-4xl font-extrabold text-green-700">
                            {ANNUAL_SUBSCRIPTION_FEE.toLocaleString()} دج / سنة
                        </p>
                        <p className="font-bold mb-4">اختر طريقة الدفع:</p>
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button className="w-full md:w-auto" onClick={() => handlePayment('BaridiMob')} isLoading={isPaying} disabled={isPaying}>
                                الدفع عبر بريدي موب
                            </Button>
                            <Button className="w-full md:w-auto" variant="secondary" onClick={() => handlePayment('CCP')} isLoading={isPaying} disabled={isPaying}>
                                الدفع عبر CCP
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            هذه عملية دفع تجريبية (Mock). سيتم تفعيل حسابك مباشرة بعد الضغط على الزر.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;
