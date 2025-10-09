
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Payment } from '../../types';
import { getPayments } from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const InvoicesPage: React.FC = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = useCallback(async () => {
        if (!user?.storeId) return;
        setLoading(true);
        try {
            const fetchedPayments = await getPayments(user.storeId);
            setPayments(fetchedPayments);
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.storeId]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">سجل الفواتير</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {payments.length > 0 ? (
                    <table className="w-full text-right">
                        <thead className="border-b">
                            <tr>
                                <th className="p-3">رقم الفاتورة</th>
                                <th className="p-3">التاريخ</th>
                                <th className="p-3">المبلغ</th>
                                <th className="p-3">طريقة الدفع</th>
                                <th className="p-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">{payment.id}</td>
                                    <td className="p-3">{payment.date.toLocaleDateString('ar-DZ')}</td>
                                    <td className="p-3 font-bold">{payment.amount.toLocaleString()} دج</td>
                                    <td className="p-3">{payment.method}</td>
                                    <td className="p-3">
                                        <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                                            {payment.status === 'completed' ? 'مكتملة' : payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center p-8 text-gray-500">لا يوجد سجل دفعات لعرضه.</p>
                )}
            </div>
        </div>
    );
};

export default InvoicesPage;
