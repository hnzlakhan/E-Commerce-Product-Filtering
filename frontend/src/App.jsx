import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import RequireAuth from './components/RequireAuth';
import ContactScreen from './screens/ContactScreen';
import AdminOrderScreen from './screens/admin/AdminOrderScreen';
import AdminProductEditScreen from './screens/admin/AdminProductEditScreen';
import AdminProductScreen from './screens/admin/AdminProductScreen';
import AdminUserScreen from './screens/admin/AdminUserScreen';
import DashboardScreen from './screens/admin/DashboardScreen';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import SearchProductScreen from './screens/SearchProductScreen';

const App = () => {
  return (
    <>
      <Header />
      <main className='main-view py-3'>
        <Container>
          <Routes>
            <Route path='' element={<HomeScreen />} />
           
            <Route path='product/:id' element={<ProductScreen />} />
            <Route path='search-products' element={<SearchProductScreen />} />
            <Route path='cart' element={<CartScreen />} />
            <Route path='cart/:productId' element={<CartScreen />} />
            <Route path='login' element={<LoginScreen />} />
            <Route path='register' element={<RegisterScreen />} />
            <Route path='shipping' element={<ShippingScreen />} />
            <Route path='payment' element={<PaymentScreen />} />
            <Route path='placeorder' element={<PlaceOrderScreen />} />
            <Route path='order/:id' element={<OrderScreen />} />
            <Route path='profile' element={<ProfileScreen />} />
            <Route path='cont' element={<ContactScreen />} />

          </Routes>
        </Container>

        <Routes>
          <Route path='admin' element={<RequireAuth isAdmin />}>
            <Route path='' element={<Navigate replace to='dashboard' />} />
            <Route path='dashboard' element={<DashboardScreen />} />
            <Route path='products' element={<AdminProductScreen />} />
            <Route path='orders' element={<AdminOrderScreen />} />
            <Route path='users' element={<AdminUserScreen />} />
            <Route
              path='products/:id/edit'
              element={<AdminProductEditScreen />} />


          </Route>


        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
