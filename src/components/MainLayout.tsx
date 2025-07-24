import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Avatar, Dropdown, Space, Typography, Badge } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  SafetyOutlined,
  ControlOutlined,
  BarChartOutlined,
  SettingOutlined,
  AuditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  AlertOutlined,
  ClusterOutlined,
  MonitorOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '总览仪表板',
  },
  {
    key: '/status-monitor',
    icon: <MonitorOutlined />,
    label: '状态监测',
  },
  {
    key: '/remote-control',
    icon: <ControlOutlined />,
    label: '远程控制',
  },
  {
    key: '/auto-alarm',
    icon: <AlertOutlined />,
    label: '自动报警',
  },
  {
    key: '/data-analysis',
    icon: <BarChartOutlined />,
    label: '数据分析',
  },
  {
    key: '/data-report',
    icon: <FileTextOutlined />,
    label: '数据上报',
  },
  {
    key: '/erp-platform',
    icon: <GlobalOutlined />,
    label: 'ERP平台',
  },
  {
    key: '/face-clustering',
    icon: <ClusterOutlined />,
    label: '人脸聚类',
  },
  {
    key: '/inspection-management',
    icon: <AuditOutlined />,
    label: '巡检管理',
  },
  {
    key: '/key-control',
    icon: <SafetyOutlined />,
    label: '重点控制',
  },
  {
    key: '/organization-management',
    icon: <TeamOutlined />,
    label: '组织管理',
  },
  {
    key: '/real-time-alert',
    icon: <AlertOutlined />,
    label: '实时预警',
  },
  {
    key: '/safety-management',
    icon: <SecurityScanOutlined />,
    label: '安全管理',
  },
  {
    key: '/system-settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
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
          zIndex: 100
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          {collapsed ? '机房监控' : '艾孚特数据机房监控'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
            <Typography.Title level={4} style={{ margin: 0 }}>
              山东艾孚特科技有限公司数据机房监控系统
            </Typography.Title>
          </div>
          
          <Space size={24}>
            <Badge count={notificationCount} overflowCount={99}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ fontSize: '16px' }}
              />
            </Badge>
            
            <Dropdown menu={{
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: '个人资料',
                },
                {
                  key: 'settings',
                  icon: <SettingOutlined />,
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
              onClick: handleMenuClick,
            }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{localStorage.getItem('username') || '管理员'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ padding: 24, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 