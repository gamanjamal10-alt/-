
export enum StoreType {
  FARMER = 'فلاح',
  WHOLESALER = 'تاجر جملة',
  RETAILER = 'تاجر تجزئة',
  TRANSPORT = 'نقل',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'seller' | 'admin';
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  type: StoreType;
  description: string;
  phone: string;
  ownerId: string;
  isActive: boolean; // Based on subscription
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  quantity: number;
  storeId: string;
}

export interface Subscription {
  storeId: string;
  status: 'active' | 'trial' | 'expired';
  trialEnds: Date | null;
  expires: Date | null;
}

export interface Payment {
  id: string;
  storeId: string;
  amount: number;
  date: Date;
  method: 'BaridiMob' | 'CCP';
  status: 'completed';
}
