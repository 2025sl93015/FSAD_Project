import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/auth/Login';
import Dashboard from './pages/employee/Dashboard';
import CreateBill from './pages/employee/CreateBill';
import BillDetail from './pages/employee/BillDetail';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerBillDetail from './pages/manager/ManagerBillDetail';
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FinanceBillDetail from './pages/finance/FinanceBillDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import EditUser from './pages/admin/EditUser';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Employee Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute roles={['EMPLOYEE', 'MANAGER', 'FINANCE_MANAGER', 'ADMIN']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/bills/create" element={
            <PrivateRoute roles={['EMPLOYEE', 'ADMIN']}>
              <CreateBill />
            </PrivateRoute>
          } />
          <Route path="/bills/:id" element={
            <PrivateRoute roles={['EMPLOYEE', 'MANAGER', 'FINANCE_MANAGER', 'ADMIN']}>
              <BillDetail />
            </PrivateRoute>
          } />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={
            <PrivateRoute roles={['MANAGER', 'ADMIN']}>
              <ManagerDashboard />
            </PrivateRoute>
          } />
          <Route path="/manager/bills/:id" element={
            <PrivateRoute roles={['MANAGER', 'ADMIN']}>
              <ManagerBillDetail />
            </PrivateRoute>
          } />

          {/* Finance Routes */}
          <Route path="/finance/dashboard" element={
            <PrivateRoute roles={['FINANCE_MANAGER', 'ADMIN']}>
              <FinanceDashboard />
            </PrivateRoute>
          } />
          <Route path="/finance/bills/:id" element={
            <PrivateRoute roles={['FINANCE_MANAGER', 'ADMIN']}>
              <FinanceBillDetail />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/users/create" element={
            <PrivateRoute roles={['ADMIN']}>
              <CreateUser />
            </PrivateRoute>
          } />
          <Route path="/admin/users/:id/edit" element={
            <PrivateRoute roles={['ADMIN']}>
              <EditUser />
            </PrivateRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
