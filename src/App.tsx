import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  SafetyOutlined,
  ControlOutlined,
  BarChartOutlined,
  SettingOutlined,
  EnvironmentOutlined,
  AuditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined as SettingIcon,
  BellOutlined,
  AlertOutlined,
  EyeOutlined,
  ClusterOutlined,
  MonitorOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  FileTextOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import CommandDispatch from './pages/CommandDispatch';
import RealTimeAlert from './pages/RealTimeAlert';
import KeyControl from './pages/KeyControl';
import AutoAlarm from './pages/AutoAlarm';
import RemoteControl from './pages/RemoteControl';
import FaceClustering from './pages/FaceClustering';
import DataAnalysis from './pages/DataAnalysis';
import StatusMonitor from './pages/StatusMonitor';
import SafetyManagement from './pages/SafetyManagement';
import SystemSettings from './pages/SystemSettings';
import InspectionManagement from './pages/InspectionManagement';
import DataReport from './pages/DataReport';
import ImageTest from './components/ImageTest';
import FaceInfoTest from './components/FaceInfoTest';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '总览仪表板',
  },
  {
    key: '/command-dispatch',
    icon: <GlobalOutlined />,
    label: '指挥调度',
  },
  {
    key: '/status-monitor',
    icon: <MonitorOutlined />,
    label: '状态监测',
  },
  {
    key: '/safety-management',
    icon: <SafetyOutlined />,
    label: '安全管理',
  },
  {
    key: '/remote-control',
    icon: <ControlOutlined />,
    label: '远程控制',
  },
  {
    key: '/data-report',
    icon: <FileTextOutlined />,
    label: '数据上报',
  },
  {
    key: '/data-analysis',
    icon: <BarChartOutlined />,
    label: '数据分析',
  },
  {
    key: '/real-time-alert',
    icon: <AlertOutlined />,
    label: '实时预警',
  },
  {
    key: '/inspection-management',
    icon: <AuditOutlined />,
    label: '巡检管理',
  },
  {
    key: '/system-settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // 模拟通知数量
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 处理通知点击
  const handleNotificationClick = () => {
    console.log('查看系统通知');
    // 这里可以添加通知面板的逻辑
  };

  // 处理管理员菜单点击
  const handleAdminMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        console.log('查看个人资料');
        break;
      case 'settings':
        console.log('打开账户设置');
        break;
      case 'logout':
        console.log('用户退出登录');
        // 这里可以添加退出登录的逻辑
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          zIndex: 1000,
          overflow: 'auto'
        }}
      >
        <div className="logo">
          {collapsed ? '机房监控' : '艾孚特数据机房监控'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          position: 'fixed',
          top: 0,
          right: 0,
          left: collapsed ? 80 : 200,
          zIndex: 999,
          transition: 'left 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              山东艾孚特科技有限公司数据机房监控系统
            </div>
          </div>
          
          {/* 管理员组件 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 通知图标 */}
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px', position: 'relative' }}
              title="系统通知"
              onClick={handleNotificationClick}
            >
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '16px',
                  textAlign: 'center',
                  lineHeight: 1
                }}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
            
            {/* 管理员下拉菜单 */}
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: '个人资料',
                  },
                  {
                    key: 'settings',
                    icon: <SettingIcon />,
                    label: '账户设置',
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    danger: true,
                  },
                ],
                onClick: handleAdminMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: 6 }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography.Text strong style={{ fontSize: '14px', lineHeight: 1 }}>
                    超级管理员
                  </Typography.Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '88px 16px 24px',
            padding: 0,
            minHeight: 'calc(100vh - 112px)',
            background: 'transparent',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/command-dispatch" element={<CommandDispatch />} />
            <Route path="/status-monitor" element={<StatusMonitor />} />
            <Route path="/safety-management" element={<SafetyManagement />} />
            <Route path="/remote-control" element={<RemoteControl />} />
            <Route path="/data-report" element={<DataReport />} />
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/real-time-alert" element={<RealTimeAlert />} />
            <Route path="/inspection-management" element={<InspectionManagement />} />
            <Route path="/system-settings" element={<SystemSettings />} />
            <Route path="/image-test" element={<ImageTest />} />
            <Route path="/face-info-test" element={<FaceInfoTest />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App; 