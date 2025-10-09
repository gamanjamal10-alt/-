
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Store } from '../../types';
import { getStoreForUser, updateStoreDetails } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const StoreSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');

    const fetchStoreData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const fetchedStore = await getStoreForUser(user.id);
            setStore(fetchedStore || null);
            if (fetchedStore) {
                setName(fetchedStore.name);
                setDescription(fetchedStore.description);
                setPhone(fetchedStore.phone);
            }
        } catch (error) {
            console.error("Failed to fetch store settings:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStoreData();
    }, [fetchStoreData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!store) return;
        setIsSaving(true);
        try {
            await updateStoreDetails(store.id, { name, description, phone });
            alert('تم تحديث معلومات المتجر بنجاح!');
            await fetchStoreData();
        } catch (error) {
            console.error('Failed to update store:', error);
            alert('حدث خطأ أثناء تحديث المعلومات.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <Spinner />;
    if (!store) return <p>لم يتم العثور على متجرك.</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">إعدادات المتجر</h1>
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                    <img src={store.logo} alt="logo" className="w-24 h-24 rounded-full mx-auto mb-4" />
                    {/* File input for logo upload would go here */}
                    <Button type="button" variant="secondary">تغيير الشعار</Button>
                </div>
                <Input id="name" label="اسم المتجر" value={name} onChange={e => setName(e.target.value)} required />
                <Input id="phone" label="رقم هاتف المتجر" value={phone} onChange={e => setPhone(e.target.value)} required />
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر</label>
                  <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                </div>
                <div className="text-left">
                    <Button type="submit" isLoading={isSaving}>حفظ التغييرات</Button>
                </div>
            </form>
        </div>
    );
};

export default StoreSettingsPage;
