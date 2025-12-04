import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Products from "./pages/Products";
import About from "./pages/About";
import Stores from "./pages/Stores";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import UsersReport from "./pages/UsersReport";
import InventoryManagement from "./pages/InventoryManagement";
import SuppliersManagement from "./pages/SuppliersManagement";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeList from "./pages/RecipeList";
import ImportIngredients from "./pages/ImportIngredients";
import Pay from "./pages/Pay";
import PaymentPage from "./pages/PaymentPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CartPage from "./pages/CartPage";
import ProviderReport from "./pages/ProviderReport";
import ReportsPage from "./pages/ReportsPage";
import SalesReportPage from "./pages/SalesReportPage";


import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* públicas */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />

            {/* auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ámbito cliente */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/pay" element={<PaymentPage />} />
            </Route>

            {/* ámbito worker / admin */}
            <Route element={<ProtectedRoute />}>
              <Route path="/worker/reports/users" element={<UsersReport />} />
            </Route>

            {/* ámbito admin */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/suppliers" element={<SuppliersManagement />} />
              <Route path="/admin/inventory" element={<InventoryManagement />} />
              <Route path="/admin/inventory/import" element={<ImportIngredients />} />
              <Route path="/admin/import" element={<Navigate to="/admin/inventory/import" replace />} />
              <Route path="/admin/recipes/create" element={<CreateRecipe />} />
              <Route path="/admin/recipes" element={<RecipeList />} />
              <Route path="/admin/reports/users" element={<UsersReport />} />
              <Route path="/admin/reports/providers" element={<ProviderReport />} />
              <Route path="/admin/reports/sales" element={<SalesReportPage />} />
            </Route>


            {/* 404 */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
