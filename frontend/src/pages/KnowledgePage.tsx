import React, { useState, useEffect } from 'react';
import { Card, Tabs, Collapse, Tag, Typography, Space } from 'antd';
import { apiService, YuanbaoInfo, ProductKnowledge } from '../services/api';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const KnowledgePage: React.FC = () => {
  const [yuanbaoInfo, setYuanbaoInfo] = useState<YuanbaoInfo | null>(null);
  const [knowledge, setKnowledge] = useState<ProductKnowledge | null>(null);
  const [activeTab, setActiveTab] = useState('yuanbao');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [yuanbaoRes, knowledgeRes] = await Promise.all([
        apiService.getYuanbaoInfo(),
        apiService.getProductKnowledge()
      ]);
      setYuanbaoInfo(yuanbaoRes.data);
      setKnowledge(knowledgeRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const categories = knowledge ? [...new Set(knowledge.questions.map(q => q.category))] : [];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>知识库</Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="元宝公司信息" key="yuanbao">
          {yuanbaoInfo && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="公司简介">
                <Title level={4}>{yuanbaoInfo.company.name}</Title>
                <Paragraph>母公司：{yuanbaoInfo.company.parent}</Paragraph>
                <Paragraph>{yuanbaoInfo.company.description}</Paragraph>
              </Card>

              <Card title="核心产品">
                {yuanbaoInfo.products.map((product, index) => (
                  <div key={index} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: index < yuanbaoInfo.products.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    <Title level={5}>{product.name}</Title>
                    <Paragraph>{product.description}</Paragraph>
                    <Space wrap>
                      {product.features.map((feature, i) => (
                        <Tag key={i} color="blue">{feature}</Tag>
                      ))}
                    </Space>
                  </div>
                ))}
              </Card>

              <Card title="业务重点">
                <Space wrap>
                  {yuanbaoInfo.businessFocus.map((focus, index) => (
                    <Tag key={index} color="green" style={{ fontSize: '14px', padding: '8px 16px' }}>{focus}</Tag>
                  ))}
                </Space>
              </Card>

              <Card title="面试关键点">
                <ul>
                  {yuanbaoInfo.interviewKeyPoints.map((point, index) => (
                    <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>{point}</li>
                  ))}
                </ul>
              </Card>
            </Space>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane tab="产品知识库" key="knowledge">
          {knowledge && (
            <Card>
              <Title level={4}>常用产品框架</Title>
              <Space wrap style={{ marginBottom: '32px' }}>
                {knowledge.frameworks.map((framework, index) => (
                  <Tag key={index} color="purple" style={{ fontSize: '14px', padding: '8px 16px' }}>{framework}</Tag>
                ))}
              </Space>

              <Title level={4}>常见面试问题</Title>
              <Tabs type="card">
                {categories.map(category => (
                  <Tabs.TabPane tab={category} key={category}>
                    <Collapse defaultActiveKey={[]}>
                      {knowledge.questions.filter(q => q.category === category).map(q => (
                        <Panel header={q.question} key={q.id}>
                          <Paragraph>{q.answer}</Paragraph>
                        </Panel>
                      ))}
                    </Collapse>
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Card>
          )}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default KnowledgePage;
