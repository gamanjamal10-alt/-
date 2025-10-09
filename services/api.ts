import { User, Store, Product, Subscription, Payment, StoreType, ProductStatus } from '../types';
import { ANNUAL_SUBSCRIPTION_FEE } from '../constants';

// --- MOCK DATABASE ---

let users: User[] = [
  { id: 'user-1', email: 'fellah@example.com', phone: '0555123456', role: 'seller', storeId: 'store-1' }
];

let stores: Store[] = [
  { id: 'store-1', name: 'مزرعة الخيرات', logo: 'https://picsum.photos/seed/farm1/200', type: StoreType.FARMER, description: 'أجود أنواع الخضروات والفواكه الطازجة مباشرة من الحقل.', phone: '0555123456', ownerId: 'user-1', isActive: true },
  { id: 'store-2', name: 'تمور الواحات', logo: 'https://picsum.photos/seed/dates/200', type: StoreType.WHOLESALER, description: 'بيع التمور بالجملة لكل أنحاء الوطن.', phone: '0666789012', ownerId: 'user-2', isActive: true },
  { id: 'store-3', name: 'زيت زيتون القبائل', logo: 'https://picsum.photos/seed/olive/200', type: StoreType.RETAILER, description: 'زيت زيتون بكر عصْرة أولى على البارد.', phone: '0777456789', ownerId: 'user-3', isActive: true },
  { id: 'store-4', name: 'نقل سريع', logo: 'https://picsum.photos/seed/truck/200', type: StoreType.TRANSPORT, description: 'خدمات نقل وتوصيل المنتجات الفلاحية.', phone: '0550987654', ownerId: 'user-4', isActive: false },
];

let products: Product[] = [
  { id: 'prod-1', name: 'طماطم طازجة', price: 120, description: 'طماطم حمراء ناضجة، مثالية للسلطات والطبخ.', images: ['https://picsum.photos/seed/tomato1/400/300', 'https://picsum.photos/seed/tomato2/400/300'], quantity: 500, storeId: 'store-1', status: ProductStatus.IN_STOCK },
  { id: 'prod-2', name: 'بطاطا', price: 80, description: 'بطاطا عالية الجودة من حقولنا.', images: ['https://picsum.photos/seed/potato1/400/300'], quantity: 1000, storeId: 'store-1', status: ProductStatus.IN_STOCK },
  { id: 'prod-3', name: 'تمر دقلة نور', price: 800, description: 'تمر دقلة نور الفاخر من بسكرة.', images: ['https://picsum.photos/seed/dates1/400/300', 'https://picsum.photos/seed/dates2/400/300'], quantity: 15, storeId: 'store-2', status: ProductStatus.LOW_STOCK },
  { id: 'prod-4', name: 'زيت زيتون 5 لتر', price: 4500, description: 'عبوة 5 لتر من زيت الزيتون البكر الممتاز.', images: ['https://picsum.photos/seed/oliveoil1/400/300'], quantity: 0, storeId: 'store-3', status: ProductStatus.OUT_OF_STOCK },
];

let subscriptions: Subscription[] = [
  { storeId: 'store-1', status: 'active', trialEnds: null, expires: new Date(new Date().setDate(new Date().getDate() + 300)) },
  { storeId: 'store-2', status: 'trial', trialEnds: new Date(new Date().setDate(new Date().getDate() + 15)), expires: null },
  { storeId: 'store-3', status: 'active', trialEnds: null, expires: new Date(new Date().setDate(new Date().getDate() + 5)) },
  { storeId: 'store-4', status: 'expired', trialEnds: null, expires: new Date(new Date().setDate(new Date().getDate() - 10)) },
];

let payments: Payment[] = [
    { id: 'pay-1', storeId: 'store-1', amount: ANNUAL_SUBSCRIPTION_FEE, date: new Date(new Date().setDate(new Date().getDate() - 65)), method: 'BaridiMob', status: 'completed' },
];

const MOCK_API_DELAY = 500;

// --- API FUNCTIONS ---

// AUTH
export const login = (email: string, _pass: string): Promise<User | null> => new Promise((resolve, reject) => {
  setTimeout(() => {
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem('MOCK_USER_ID', user.id);
      resolve(user);
    } else {
      reject(new Error('مستخدم غير موجود'));
    }
  }, MOCK_API_DELAY);
});

export const logout = () => localStorage.removeItem('MOCK_USER_ID');

export const getMockUser = (): Promise<User | null> => new Promise((resolve) => {
    setTimeout(() => {
        const userId = localStorage.getItem('MOCK_USER_ID');
        if (userId) {
            resolve(users.find(u => u.id === userId) || null);
        } else {
            resolve(null);
        }
    }, 100);
});


// STOREFRONT
export const getActiveStores = (): Promise<Store[]> => new Promise((resolve) => {
  setTimeout(() => resolve(stores.filter(s => s.isActive)), MOCK_API_DELAY);
});

export const getProducts = (filter?: { storeType?: StoreType, searchTerm?: string }): Promise<Product[]> => new Promise((resolve) => {
  setTimeout(() => {
    const activeStoreIds = stores.filter(s => s.isActive).map(s => s.id);
    let filteredProducts = products.filter(p => activeStoreIds.includes(p.storeId));

    if (filter?.storeType) {
        const storeIdsOfType = stores.filter(s => s.type === filter.storeType).map(s => s.id);
        filteredProducts = filteredProducts.filter(p => storeIdsOfType.includes(p.storeId));
    }
    
    if (filter?.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }

    resolve(filteredProducts);
  }, MOCK_API_DELAY);
});

export const getProductById = (id: string): Promise<Product | undefined> => new Promise((resolve) => {
    setTimeout(() => resolve(products.find(p => p.id === id)), MOCK_API_DELAY);
});

export const getStoreById = (id: string): Promise<Store | undefined> => new Promise((resolve) => {
    setTimeout(() => resolve(stores.find(s => s.id === id)), MOCK_API_DELAY);
});

export const getProductsByStoreId = (storeId: string): Promise<Product[]> => new Promise((resolve) => {
    setTimeout(() => resolve(products.filter(p => p.storeId === storeId)), MOCK_API_DELAY);
});


// DASHBOARD
export const getStoreForUser = (userId: string): Promise<Store | undefined> => new Promise((resolve) => {
    setTimeout(() => {
        const user = users.find(u => u.id === userId);
        resolve(stores.find(s => s.id === user?.storeId));
    }, MOCK_API_DELAY);
});

export const getProductsForStore = (storeId: string): Promise<Product[]> => new Promise((resolve) => {
    setTimeout(() => {
        resolve(products.filter(p => p.storeId === storeId));
    }, MOCK_API_DELAY);
});

export const addProduct = (product: Omit<Product, 'id'>): Promise<Product> => new Promise((resolve) => {
    setTimeout(() => {
        const newProduct = { ...product, id: `prod-${Date.now()}` };
        products.push(newProduct);
        resolve(newProduct);
    }, MOCK_API_DELAY);
});

export const updateProduct = (updatedProduct: Product): Promise<Product> => new Promise((resolve) => {
    setTimeout(() => {
        products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        resolve(updatedProduct);
    }, MOCK_API_DELAY);
});

export const deleteProduct = (productId: string): Promise<void> => new Promise((resolve) => {
    setTimeout(() => {
        products = products.filter(p => p.id !== productId);
        resolve();
    }, MOCK_API_DELAY);
});


export const getSubscription = (storeId: string): Promise<Subscription | undefined> => new Promise((resolve) => {
    setTimeout(() => {
        resolve(subscriptions.find(s => s.storeId === storeId));
    }, MOCK_API_DELAY);
});

export const getPayments = (storeId: string): Promise<Payment[]> => new Promise((resolve) => {
    setTimeout(() => {
        resolve(payments.filter(p => p.storeId === storeId));
    }, MOCK_API_DELAY);
});

export const processMockPayment = (storeId: string, method: 'BaridiMob' | 'CCP'): Promise<Payment> => new Promise((resolve) => {
    setTimeout(() => {
        // Update subscription
        const subIndex = subscriptions.findIndex(s => s.storeId === storeId);
        const newExpiry = new Date();
        newExpiry.setFullYear(newExpiry.getFullYear() + 1);
        
        if (subIndex > -1) {
            subscriptions[subIndex] = { ...subscriptions[subIndex], status: 'active', expires: newExpiry, trialEnds: null };
        } else {
             subscriptions.push({ storeId, status: 'active', expires: newExpiry, trialEnds: null });
        }

        // Update store status
        const storeIndex = stores.findIndex(s => s.id === storeId);
        if (storeIndex > -1) {
            stores[storeIndex].isActive = true;
        }

        // Create payment record
        const newPayment: Payment = {
            id: `pay-${Date.now()}`,
            storeId,
            amount: ANNUAL_SUBSCRIPTION_FEE,
            date: new Date(),
            method,
            status: 'completed',
        };
        payments.push(newPayment);
        resolve(newPayment);
    }, MOCK_API_DELAY * 2);
});

export const updateStoreDetails = (storeId: string, details: Partial<Store>): Promise<Store> => new Promise((resolve, reject) => {
    setTimeout(() => {
        const storeIndex = stores.findIndex(s => s.id === storeId);
        if (storeIndex > -1) {
            stores[storeIndex] = { ...stores[storeIndex], ...details };
            resolve(stores[storeIndex]);
        } else {
            reject(new Error("المتجر غير موجود"));
        }
    }, MOCK_API_DELAY);
});