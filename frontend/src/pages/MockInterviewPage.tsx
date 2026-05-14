import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Progress, message } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { apiService, ProductKnowledge } from '../services/api';

const { Title, Paragraph } = Typography;

const MockInterviewPage: React.FC = () => {
  const [knowledge, setKnowledge] = useState<ProductKnowledge | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [answered, setAnswered] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadKnowledge();
  }, []);

  const loadKnowledge = async () => {
    try {
      const response = await apiService.getProductKnowledge();
      setKnowledge(response.data);
    } catch (error) {
      console.error('Failed to load knowledge:', error);
    }
  };

  const getRandomQuestion = () => {
    if (!knowledge) return;
    const randomIndex = Math.floor(Math.random() * knowledge.questions.length);
    setCurrentQuestion(knowledge.questions[randomIndex]);
    setShowAnswer(false);
  };

  const nextQuestion = () => {
    setAnswered(prev => prev + 1);
    getRandomQuestion();
  };

  const reset = () => {
    setAnswered(0);
    getRandomQuestion();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Title level={2}>模拟面试</Title>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Paragraph>已回答: {answered} 题</Paragraph>
          <Progress percent={Math.min(answered * 10, 100)} status="active" />
        </div>

        {!currentQuestion ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={getRandomQuestion}
            >
              开始模拟面试
            </Button>
          </div>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>问题 ({currentQuestion.category})</Title>
              <Paragraph style={{ fontSize: '18px', fontWeight: '500' }}>{currentQuestion.question}</Paragraph>
            </div>

            {showAnswer && (
              <Card title="参考答案" type="inner">
                <Paragraph>{currentQuestion.answer}</Paragraph>
              </Card>
            )}

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              {!showAnswer ? (
                <Button onClick={() => setShowAnswer(true)}>查看答案</Button>
              ) : (
                <Button type="primary" onClick={nextQuestion}>下一题</Button>
              )}
              <Button icon={<ReloadOutlined />} onClick={reset}>重新开始</Button>
            </Space>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default MockInterviewPage;
