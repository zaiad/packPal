import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, ProfileOutlined, ProductOutlined, TeamOutlined, PieChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Link, Route, Routes, BrowserRouter } from 'react-router-dom'; 
import Dashboard from './pages/Dashboard';
import Customer from './pages/Customer';
import Product from './pages/Product';
import Category from './pages/Category';
import {logout} from './Redux/actions/Login';
import Order from './pages/Order';
import logo1 from './assets/logo 1.png'; 
import logo2 from './assets/logo 2.png'; 
import Login from './pages/Login';
import { useDispatch } from 'react-redux';
import VismeForm from './pages/Customer.login';

const { Header, Sider, Content, Footer } = Layout;


const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logo, setLogo] = useState(logo1);
  const dispatch = useDispatch();

  const toggleLogo = () => {
    setLogo(logo === logo1 ? logo2 : logo1);
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('authToken');
    window.location.href = "/login";
  };
  const buttonStyle = {
    backgroundColor: '#0C2D57',
    borderColor: '#0C2D57',
    color: 'white',
  };
  
  return (
    <BrowserRouter> 
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            background: '#0C2D57',
            overflow: 'auto', // Added for smaller screens
            height: '100vh', // Added for smaller screens
            position: 'fixed', // Added for smaller screens
            left: 0, // Added for smaller screens
          }}
        >
          <div className="demo-logo-vertical">
            <img src={logo} alt="Logo" style={{ width: '100%', padding: '20px' }} />
          </div>
          <Menu
            mode="inline"
            style={{
              background: '#0C2D57',
            }}
            defaultSelectedKeys={['1']}
          >
            <Menu.Item
              key="1"
              icon={<PieChartOutlined />}
              style={{ color: '#0C2D57', background: '#d9a74a' }}
            >
              <Link to="/Dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<TeamOutlined />}
              style={{ color: '#0C2D57', background: '#d9a74a' }}
            >
              <Link to="/Customers">Customers</Link>
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<ProductOutlined />}
              style={{ color: '#0C2D57', background: '#d9a74a' }}
            >
              <Link to="/Products">Products</Link>
            </Menu.Item>
            <Menu.Item
              key="4"
              icon={<ProfileOutlined />}
              style={{ color: '#0C2D57', background: '#d9a74a' }}
            >
              <Link to="/Categorys">Categorys</Link>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<ShoppingCartOutlined />}
              style={{ color: '#0C2D57', background: '#d9a74a' }}
            >
              <Link to="/Orders">Orders</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            style={{
              padding: 0,
              background: '#d9a74a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  setCollapsed(!collapsed);
                  toggleLogo(); 
                }}
                style={{
                  fontSize: '16px',
                  width: 40,
                  height: 40,
                  marginLeft: 12,
                  background: '#0C2D57',
                  color: '#d9a74a',
                }}
              />
            </div>
            <div>
              <Button type="dashed" ghost style={{ ...buttonStyle, marginRight: '12px' }} icon={<LogoutOutlined />} onClick={() => {handleLogout()}}>
                LogOut
              </Button>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#EFEFEF',
              flex: '1 0 auto',
            }}
          >
            <Routes>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Customers" element={<Customer />} />
              <Route path="/Products" element={<Product />} />
              <Route path="/Categorys" element={<Category />} />
              <Route path="/Orders" element={<Order />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Customer-login" element={<VismeForm />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center', background: '#d9a74a', color: '#0C2D57', flexShrink: '0' }}>Copyright © 2024 PackPal</Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
