import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Typography, Spin, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { apiService } from '../services/api';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的产品经理面试辅导老师。请先完善你的个人信息，然后告诉我你想了解什么，我会结合元宝公司的情况为你提供专业指导！' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiService.chat(input);
      const assistantMessage: Message = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      message.error('发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column' }}>
      <Typography.Title level={2} style={{ marginBottom: '16px' }}>智能辅导</Typography.Title>
      
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          <List
            dataSource={messages}
            renderItem={msg => (
              <List.Item style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  background: msg.role === 'user' ? '#1890ff' : '#f0f0f0',
                  color: msg.role === 'user' ? '#fff' : '#000',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  {msg.role === 'assistant' && <RobotOutlined />}
                  <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</Paragraph>
                  {msg.role === 'user' && <UserOutlined />}
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的问题，Shift+Enter换行，Enter发送"
            autoSize={{ minRows: 2, maxRows: 6 }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            style={{ height: 'auto', alignSelf: 'flex-end' }}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
