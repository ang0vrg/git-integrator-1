import React from "react";
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
import AdminReportsPage from "./pages/AdminReportsPage";
import WorkerReportsPage from "./pages/WorkerReportsPage";
import CartPage from "./pages/CartPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App(): React.ReactElement {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Cliente: rutas protegidas */}
          <Route
            path="/account"
            element={
              <ProtectedRoute
                allowedRoles={["cliente", "administrador", "trabajador"]}
              >
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pay"
            element={
              <ProtectedRoute allowedRoles={["cliente"]}>
                <Pay />
              </ProtectedRoute>
            }
          />

          {/* Administrador */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/users"
            element={
              <ProtectedRoute allowedRoles={["administrador"]}>
                <UsersReport />
              </ProtectedRoute>
            }
          />

          {/* Trabajador (y admin) */}
          <Route
            path="/worker/reports"
            element={
              <ProtectedRoute allowedRoles={["trabajador", "administrador"]}>
                <WorkerReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/reports/users"
            element={
              <ProtectedRoute allowedRoles={["trabajador", "administrador"]}>
                <UsersReport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
