export interface User {
  id: string;
  email: string;
  storeId: string;
}

export enum StoreType {
  FARMER = 'فلاح',
  WHOLESALER = 'تاجر جملة',
  RETAILER = 'تاجر تجزئة',
}

export enum StoreStatus {
  PENDING_VERIFICATION = 'قيد التحقق',
  TRIAL = 'فترة تجريبية',
  ACTIVE = 'نشط',
  SUSPENDED = 'موقوف',
}

export interface Store {
  id: string;
  name: string;
  description: string;
  phone: string;
  logo: string;
  type: StoreType;
  ownerId: string;
  status: StoreStatus;
}

export enum ProductStatus {
  IN_STOCK = 'متوفر',
  LOW_STOCK = 'كمية قليلة',
  OUT_OF_STOCK = 'نفذ المخزون',
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  status: ProductStatus;
  images: string[];
  storeId: string;
}

export interface Subscription {
  id: string;
  storeId: string;
  status: 'active' | 'trial' | 'expired';
  expires?: Date;
  trialEnds?: Date;
}

export interface Payment {
  id: string;
  storeId: string;
  date: Date;
  amount: number;
  method: 'BaridiMob' | 'CCP';
  status: 'completed';
}
