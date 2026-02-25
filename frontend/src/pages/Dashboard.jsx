import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const { role } = useAuth();
  return role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
