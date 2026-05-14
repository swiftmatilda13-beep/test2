import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  FormOutlined
} from '@ant-design/icons';
import UserInfoPage from './pages/UserInfoPage';
import KnowledgePage from './pages/KnowledgePage';
import ChatPage from './pages/ChatPage';
import MockInterviewPage from './pages/MockInterviewPage';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type PageKey = 'user' | 'knowledge' | 'chat' | 'interview';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>('user');

  const menuItems = [
    { key: 'user', icon: <UserOutlined />, label: '个人信息' },
    { key: 'knowledge', icon: <BookOutlined />, label: '知识库' },
    { key: 'chat', icon: <MessageOutlined />, label: '智能辅导' },
    { key: 'interview', icon: <FormOutlined />, label: '模拟面试' }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'user':
        return <UserInfoPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'chat':
        return <ChatPage />;
      case 'interview':
        return <MockInterviewPage />;
      default:
        return <UserInfoPage />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>PM面试辅导</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          items={menuItems}
          onClick={({ key }) => setCurrentPage(key as PageKey)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={3} style={{ margin: 0, lineHeight: '64px' }}>
            腾讯元宝 AI产品经理面试助手
          </Title>
        </Header>
        <Content style={{ background: '#f5f5f5', overflow: 'auto' }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
