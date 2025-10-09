
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import StorefrontLayout from './components/layout/StorefrontLayout';
import HomePage from './pages/storefront/HomePage';
import ProductDetailsPage from './pages/storefront/ProductDetailsPage';
import StorePage from './pages/storefront/StorePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import ProductsManagementPage from './pages/dashboard/ProductsManagementPage';
import StoreSettingsPage from './pages/dashboard/StoreSettingsPage';
import SubscriptionPage from './pages/dashboard/SubscriptionPage';
import InvoicesPage from './pages/dashboard/InvoicesPage';
import { useAuth } from './hooks/useAuth';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<StorefrontLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:productId" element={<ProductDetailsPage />} />
          <Route path="stores/:storeId" element={<StorePage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<DashboardOverviewPage />} />
          <Route path="products" element={<ProductsManagementPage />} />
          <Route path="settings" element={<StoreSettingsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
