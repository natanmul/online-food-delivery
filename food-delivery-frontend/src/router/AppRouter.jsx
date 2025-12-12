import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { USER_ROLES } from '../utils/constants.js';
import Layout from '../components/layout/Layout.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import RoleRoute from './RoleRoute.jsx';

// Auth Pages
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';

// Customer Pages
import Home from '../pages/customer/Home.jsx';
import RestaurantList from '../pages/customer/RestaurantList.jsx';
import RestaurantDetail from '../pages/customer/RestaurantDetail.jsx';
import Cart from '../pages/customer/Cart.jsx';
import Checkout from '../pages/customer/Checkout.jsx';
import Orders from '../pages/customer/Orders.jsx';
import Profile from '../pages/customer/Profile.jsx';

// Restaurant Pages
import RestaurantDashboard from '../pages/restaurant/Dashboard.jsx';
import RestaurantMenu from '../pages/restaurant/Menu.jsx';
import RestaurantOrders from '../pages/restaurant/RestaurantOrders.jsx';

// Driver Pages
import DriverDashboard from '../pages/driver/Dashboard.jsx';
import DriverDeliveries from '../pages/driver/Deliveries.jsx';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminUsers from '../pages/admin/Users.jsx';

// Shared Pages
import NotFound from '../pages/shared/NotFound.jsx';
import Unauthorized from '../pages/shared/Unauthorized.jsx';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Layout Routes */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurants/:id" element={<RestaurantDetail />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          
          {/* Protected Customer Routes */}
          <Route path="cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="checkout" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                <Checkout />
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="orders" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                <Orders />
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="orders/:id" element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                {/* Order Detail Page - to be implemented */}
                <div>Order Detail Page</div>
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* Protected Restaurant Routes */}
          <Route path="restaurant">
            <Route path="dashboard" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.RESTAURANT]}>
                  <RestaurantDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="menu" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.RESTAURANT]}>
                  <RestaurantMenu />
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="orders" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.RESTAURANT]}>
                  <RestaurantOrders />
                </RoleRoute>
              </PrivateRoute>
            } />
          </Route>
          
          {/* Protected Driver Routes */}
          <Route path="driver">
            <Route path="dashboard" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.DRIVER]}>
                  <DriverDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="deliveries" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.DRIVER]}>
                  <DriverDeliveries />
                </RoleRoute>
              </PrivateRoute>
            } />
          </Route>
          
          {/* Protected Admin Routes */}
          <Route path="admin">
            <Route path="dashboard" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            <Route path="users" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminUsers />
                </RoleRoute>
              </PrivateRoute>
            } />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;