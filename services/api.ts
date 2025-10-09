import { User, Store, StoreType, Product, ProductStatus, Subscription, Payment, StoreStatus } from '../types';
import { ANNUAL_SUBSCRIPTION_FEE } from '../constants';

// --- MOCK DATA ---

let mockUsers: User[] = [
  { id: 'user-1', email: 'fellah@example.com', storeId: 'store-1' },
];

let mockStores: Store[] = [
  { 
    id: 'store-1', 
    name: 'مزرعة الخيرات', 
    description: 'نوفر لكم أجود أنواع الخضروات والفواكه الطازجة مباشرة من الحقل.',
    phone: '0555123456',
    logo: 'https://picsum.photos/seed/farm1/200',
    type: StoreType.FARMER,
    ownerId: 'user-1',
    status: StoreStatus.ACTIVE
  },
  { 
    id: 'store-2', 
    name: 'بستاني للفواكه', 
    description: 'متخصصون في بيع الفواكه الموسمية بالجملة.',
    phone: '0666789012',
    logo: 'https://picsum.photos/seed/orchard/200',
    type: StoreType.WHOLESALER,
    ownerId: 'user-2',
    status: StoreStatus.TRIAL,
  },
    { 
    id: 'store-3', 
    name: 'متجر تحت المراجعة', 
    description: 'هذا المتجر قيد المراجعة ولن يظهر للعامة.',
    phone: '0777000000',
    logo: 'https://picsum.photos/seed/review/200',
    type: StoreType.RETAILER,
    ownerId: 'user-3',
    status: StoreStatus.PENDING_VERIFICATION,
  },
];

let mockProducts: Product[] = [
    // Store 1 Products
    { id: 'prod-1', storeId: 'store-1', name: 'طماطم', price: 120, quantity: 50, description: 'طماطم حمراء طازجة وناضجة، مثالية للسلطات والطبخ.', status: ProductStatus.IN_STOCK, images: ['https://picsum.photos/seed/tomato/400/300'] },
    { id: 'prod-2', storeId: 'store-1', name: 'بطاطا', price: 80, quantity: 100, description: 'بطاطا عالية الجودة، مناسبة للقلي والسلق.', status: ProductStatus.IN_STOCK, images: ['https://picsum.photos/seed/potato/400/300'] },
    { id: 'prod-3', storeId: 'store-1', name: 'خيار', price: 100, quantity: 8, description: 'خيار طازج ومقرمش.', status: ProductStatus.LOW_STOCK, images: ['https://picsum.photos/seed/cucumber/400/300'] },
    { id: 'prod-4', storeId: 'store-1', name: 'فلفل حلو', price: 150, quantity: 0, description: 'فلفل حلو ملون.', status: ProductStatus.OUT_OF_STOCK, images: ['https://picsum.photos/seed/pepper/400/300'] },
    // Store 2 Products
    { id: 'prod-5', storeId: 'store-2', name: 'تفاح', price: 250, quantity: 200, description: 'صناديق تفاح أحمر مستورد.', status: ProductStatus.IN_STOCK, images: ['https://picsum.photos/seed/apple/400/300'] },
    { id: 'prod-6', storeId: 'store-2', name: 'موز', price: 300, quantity: 150, description: 'موز طازج وحلو المذاق.', status: ProductStatus.IN_STOCK, images: ['https://picsum.photos/seed/banana/400/300'] },
    // Products for pending store (should not be visible)
    { id: 'prod-7', storeId: 'store-3', name: 'منتج سري', price: 1000, quantity: 10, description: 'هذا المنتج من متجر قيد المراجعة.', status: ProductStatus.IN_STOCK, images: ['https://picsum.photos/seed/secret/400/300'] },
];


let mockSubscriptions: Subscription[] = [
    { id: 'sub-1', storeId: 'store-1', status: 'active', expires: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
    { id: 'sub-2', storeId: 'store-2', status: 'trial', trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) } // 14 days trial
];

let mockPayments: Payment[] = [];


// --- MOCK API FUNCTIONS ---

// Helper function to simulate checking for expired trials and suspending stores
const _checkAndUpdateAllStoreStatuses = () => {
    const now = new Date();
    mockStores.forEach(store => {
        const sub = mockSubscriptions.find(s => s.storeId === store.id);
        if (sub && sub.status === 'trial' && sub.trialEnds && sub.trialEnds < now) {
            console.log(`Trial for store ${store.name} has expired. Suspending store.`);
            store.status = StoreStatus.SUSPENDED;
            sub.status = 'expired';
        }
    });
};

const mockApiCall = <T>(data: T, delay = 500): Promise<T> => {
    // Run status check before resolving any data to simulate real-time changes
    _checkAndUpdateAllStoreStatuses();
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

const mockApiFail = (message: string, delay = 500): Promise<any> => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));
}

// Auth
export const login = (email: string, pass: string): Promise<User> => {
    console.log(`Attempting login for email: ${email}, pass: ${pass}`);
    const user = mockUsers.find(u => u.email === email);
    if (user && pass === 'password') { // Mock password
        return mockApiCall(user);
    }
    return mockApiFail('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
};

export const register = (data: { storeName: string; email: string; phone: string; password: string }): Promise<User> => {
    if (mockUsers.find(u => u.email === data.email)) {
        return mockApiFail('البريد الإلكتروني مستخدم بالفعل.');
    }

    const newUserId = `user-${Date.now()}`;
    const newStoreId = `store-${Date.now()}`;

    const newUser: User = { id: newUserId, email: data.email, storeId: newStoreId };
    mockUsers.push(newUser);
    
    const newStore: Store = {
        id: newStoreId,
        name: data.storeName,
        description: 'متجر جديد في سوق الفلاح.',
        phone: data.phone,
        logo: 'https://picsum.photos/seed/newfarm/200',
        type: StoreType.FARMER, 
        ownerId: newUserId,
        // NEW LOGIC: Store is immediately in trial and public
        status: StoreStatus.TRIAL,
    };
    mockStores.push(newStore);
    
    const newSubscription: Subscription = {
        id: `sub-${newStoreId}`,
        storeId: newStoreId,
        status: 'trial',
        trialEnds: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day free trial
    };
    mockSubscriptions.push(newSubscription);

    console.log('New user and store created:', newUser, newStore);
    return mockApiCall(newUser);
};


export const logout = (): void => {
    console.log("User logged out");
};

export const getMockUser = (): Promise<User> => {
    return mockApiCall(mockUsers[0]);
};

// Products
export const getProducts = (): Promise<Product[]> => {
    const publicStoreIds = new Set(
        mockStores
            .filter(s => s.status === StoreStatus.ACTIVE || s.status === StoreStatus.TRIAL)
            .map(s => s.id)
    );
    const publicProducts = mockProducts.filter(p => publicStoreIds.has(p.storeId));
    return mockApiCall(publicProducts);
};

export const getProductById = (id: string): Promise<Product | undefined> => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
        return mockApiCall(undefined);
    }
    const store = mockStores.find(s => s.id === product.storeId);
    if (store && (store.status === StoreStatus.ACTIVE || store.status === StoreStatus.TRIAL)) {
        return mockApiCall(product);
    }
    return mockApiCall(undefined);
};

export const getProductsByStoreId = (storeId: string): Promise<Product[]> => {
    return mockApiCall(mockProducts.filter(p => p.storeId === storeId));
};

export const getProductsForStore = (storeId: string): Promise<Product[]> => getProductsByStoreId(storeId);

export const addProduct = (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        images: ['https://picsum.photos/seed/freshproduce/400/300'],
        ...productData
    };
    mockProducts.push(newProduct);
    return mockApiCall(newProduct);
};

export const updateProduct = (updatedProduct: Product): Promise<Product> => {
    const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
        mockProducts[index] = updatedProduct;
        return mockApiCall(updatedProduct);
    }
    return mockApiFail('Product not found');
};

export const deleteProduct = (productId: string): Promise<void> => {
    mockProducts = mockProducts.filter(p => p.id !== productId);
    return mockApiCall(undefined);
};


// Store
export const getStores = (): Promise<Store[]> => {
    return mockApiCall(mockStores.filter(s => s.status === StoreStatus.ACTIVE || s.status === StoreStatus.TRIAL));
};

export const getStoreById = (id: string): Promise<Store | undefined> => {
    const store = mockStores.find(s => s.id === id);
    if (store && (store.status === StoreStatus.ACTIVE || store.status === StoreStatus.TRIAL)) {
        return mockApiCall(store);
    }
    return mockApiCall(undefined);
};

export const getStoreForUser = (userId: string): Promise<Store | undefined> => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return mockApiCall(undefined);
    return mockApiCall(mockStores.find(s => s.id === user.storeId));
};

export const updateStoreDetails = (storeId: string, details: Partial<Pick<Store, 'name' | 'description' | 'phone'>>): Promise<Store> => {
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
        Object.assign(store, details);
        return mockApiCall(store);
    }
    return mockApiFail('Store not found');
};


// Subscription & Payments
export const getSubscription = (storeId: string): Promise<Subscription | undefined> => {
    return mockApiCall(mockSubscriptions.find(s => s.storeId === storeId));
};

export const getPayments = (storeId: string): Promise<Payment[]> => {
    return mockApiCall(mockPayments.filter(p => p.storeId === storeId));
};

export const processMockPayment = (storeId: string, method: 'BaridiMob' | 'CCP'): Promise<Payment> => {
    const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        storeId,
        date: new Date(),
        amount: ANNUAL_SUBSCRIPTION_FEE,
        method,
        status: 'completed'
    };
    mockPayments.push(newPayment);

    let sub = mockSubscriptions.find(s => s.storeId === storeId);
    if (sub) {
        sub.status = 'active';
        sub.expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
        sub.trialEnds = undefined;
    } else {
        sub = {
            id: `sub-${storeId}`,
            storeId,
            status: 'active',
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        };
        mockSubscriptions.push(sub);
    }
    
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
        store.status = StoreStatus.ACTIVE;
    }
    
    return mockApiCall(newPayment);
};