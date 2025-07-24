import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RemoteControl from './pages/RemoteControl';
import StatusMonitor from './pages/StatusMonitor';
import AutoAlarm from './pages/AutoAlarm';
import DataAnalysis from './pages/DataAnalysis';
import DataReport from './pages/DataReport';
import ERPPlatform from './pages/ERPPlatform';
import FaceClustering from './pages/FaceClustering';
import InspectionManagement from './pages/InspectionManagement';
import KeyControl from './pages/KeyControl';
import OrganizationManagement from './pages/OrganizationManagement';
import RealTimeAlert from './pages/RealTimeAlert';
import SafetyManagement from './pages/SafetyManagement';
import SystemSettings from './pages/SystemSettings';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  // 检查是否已登录
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
    <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          
          {/* 私有路由 */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/remote-control" element={
            <PrivateRoute>
              <MainLayout>
                <RemoteControl />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/status-monitor" element={
            <PrivateRoute>
              <MainLayout>
                <StatusMonitor />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/auto-alarm" element={
            <PrivateRoute>
              <MainLayout>
                <AutoAlarm />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/data-analysis" element={
            <PrivateRoute>
              <MainLayout>
                <DataAnalysis />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/data-report" element={
            <PrivateRoute>
              <MainLayout>
                <DataReport />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/erp-platform" element={
            <PrivateRoute>
              <MainLayout>
                <ERPPlatform />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/face-clustering" element={
            <PrivateRoute>
              <MainLayout>
                <FaceClustering />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/inspection-management" element={
            <PrivateRoute>
              <MainLayout>
                <InspectionManagement />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/key-control" element={
            <PrivateRoute>
              <MainLayout>
                <KeyControl />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/organization-management" element={
            <PrivateRoute>
              <MainLayout>
                <OrganizationManagement />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/real-time-alert" element={
            <PrivateRoute>
              <MainLayout>
                <RealTimeAlert />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/safety-management" element={
            <PrivateRoute>
              <MainLayout>
                <SafetyManagement />
              </MainLayout>
            </PrivateRoute>
          } />
          <Route path="/system-settings" element={
            <PrivateRoute>
              <MainLayout>
                <SystemSettings />
              </MainLayout>
            </PrivateRoute>
          } />

          {/* 默认路由 - 根据登录状态重定向 */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />

          {/* 捕获所有未匹配的路由 */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </Layout>
    </Router>
  );
};

export default App; 