import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Pay from "./pages/Pay";
import About from "./pages/About";
import Account from "./pages/Account";
import Stores from "./pages/Stores";
import Contact from "./pages/Contact";
import UsersReport from "./pages/UsersReport";
import CartPage from "./pages/CartPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App(): React.ReactElement {
  return (
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
            <Route path="/pay" element={<Pay />} />
          </Route>

          {/* ámbito worker / admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/worker/reports/users" element={<UsersReport />} />
          </Route>

          {/* ámbito admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/reports/users" element={<UsersReport />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
