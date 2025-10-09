import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Product, ProductStatus } from '../../types';
import { getProductsForStore, addProduct, updateProduct, deleteProduct } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ProductForm: React.FC<{ product?: Product | null; onSave: (product: Omit<Product, 'id'> | Product) => void; onCancel: () => void; isLoading: boolean }> = 
({ product, onSave, onCancel, isLoading }) => {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [quantity, setQuantity] = useState(product?.quantity || 0);
    const [description, setDescription] = useState(product?.description || '');
    const [status, setStatus] = useState<ProductStatus>(product?.status || ProductStatus.IN_STOCK);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name,
            price: Number(price),
            quantity: Number(quantity),
            description,
            status,
            images: product?.images || ['https://picsum.photos/seed/newproduct/400/300'],
            storeId: product?.storeId || '', // StoreId should be passed from parent
        };
        if (product && 'id' in product) {
            onSave({ ...productData, id: product.id });
        } else {
            onSave(productData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4 mb-8">
            <h2 className="text-xl font-bold">{product ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <Input id="name" label="اسم المنتج" value={name} onChange={e => setName(e.target.value)} required />
            <div className="flex gap-4">
                <Input id="price" label="السعر (دج)" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                <Input id="quantity" label="الكمية" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">حالة المنتج</label>
              <select id="status" value={status} onChange={e => setStatus(e.target.value as ProductStatus)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                {Object.values(ProductStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
            </div>
            {/* Image upload would go here */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={onCancel}>إلغاء</Button>
                <Button type="submit" isLoading={isLoading}>حفظ</Button>
            </div>
        </form>
    );
};


const ProductsManagementPage: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const fetchProducts = useCallback(async () => {
        if (!user?.storeId) return;
        setLoading(true);
        try {
            const fetchedProducts = await getProductsForStore(user.storeId);
            setProducts(fetchedProducts);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.storeId]);
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
        if (!user?.storeId) return;
        setIsSaving(true);
        try {
            if ('id' in productData) {
                await updateProduct(productData as Product);
            } else {
                await addProduct({ ...productData, storeId: user.storeId });
            }
            await fetchProducts();
            setIsFormVisible(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("Failed to save product:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            try {
                await deleteProduct(productId);
                await fetchProducts();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };
    
    const handleAddNew = () => {
        setEditingProduct(null);
        setIsFormVisible(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };
    
    const handleCancel = () => {
        setIsFormVisible(false);
        setEditingProduct(null);
    };
    
    const getStatusBadge = (status: ProductStatus) => {
        switch (status) {
            case ProductStatus.IN_STOCK:
                return <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">{status}</span>;
            case ProductStatus.LOW_STOCK:
                return <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">{status}</span>;
            case ProductStatus.OUT_OF_STOCK:
                return <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">{status}</span>;
            default:
                return <span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">{status}</span>;
        }
    };


    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
                {!isFormVisible && <Button onClick={handleAddNew}>إضافة منتج جديد</Button>}
            </div>
            
            {isFormVisible && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCancel}
                    isLoading={isSaving}
                />
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-right">
                    <thead className="border-b">
                        <tr>
                            <th className="p-3">المنتج</th>
                            <th className="p-3">السعر</th>
                            <th className="p-3">الكمية</th>
                            <th className="p-3">الحالة</th>
                            <th className="p-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3">{product.price.toLocaleString()} دج</td>
                                <td className="p-3">{product.quantity}</td>
                                <td className="p-3">{getStatusBadge(product.status)}</td>
                                <td className="p-3 space-x-2 space-x-reverse">
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>تعديل</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>حذف</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {products.length === 0 && <p className="text-center p-8 text-gray-500">لا توجد منتجات لعرضها.</p>}
            </div>
        </div>
    );
};

export default ProductsManagementPage;