import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Space, message, Input as AntInput } from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService, UserInfo } from '../services/api';

const { TextArea } = AntInput;

const UserInfoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await apiService.getUserInfo();
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const onFinish = async (values: UserInfo) => {
    setLoading(true);
    try {
      await apiService.updateUserInfo(values);
      message.success('个人信息保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card title="个人信息管理" extra={<Button icon={<SaveOutlined />} type="primary" loading={loading} onClick={() => form.submit()}>保存</Button>}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            internships: [{}],
            projects: [{}],
            skills: []
          }}
        >
          <Form.Item label="姓名" name="name">
            <Input placeholder="请输入你的姓名" />
          </Form.Item>

          <Form.Item label="教育背景" name="education">
            <TextArea rows={3} placeholder="请输入你的教育背景，如：学校、专业、学历等" />
          </Form.Item>

          <Form.List name="internships">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0 }}>实习经历</h4>
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>添加实习经历</Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: '16px' }} extra={
                    fields.length > 1 ? (
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                    ) : null
                  }>
                    <Form.Item {...restField} label="公司名称" name={[name, 'company']}>
                      <Input placeholder="公司名称" />
                    </Form.Item>
                    <Form.Item {...restField} label="职位" name={[name, 'role']}>
                      <Input placeholder="职位" />
                    </Form.Item>
                    <Form.Item {...restField} label="工作描述" name={[name, 'description']}>
                      <TextArea rows={3} placeholder="描述你的工作内容和成果" />
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '24px' }}>
                  <h4 style={{ margin: 0 }}>项目经历</h4>
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()}>添加项目</Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: '16px' }} extra={
                    fields.length > 1 ? (
                      <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                    ) : null
                  }>
                    <Form.Item {...restField} label="项目名称" name={[name, 'name']}>
                      <Input placeholder="项目名称" />
                    </Form.Item>
                    <Form.Item {...restField} label="项目描述" name={[name, 'description']}>
                      <TextArea rows={3} placeholder="项目描述" />
                    </Form.Item>
                    <Form.Item {...restField} label="你的角色" name={[name, 'role']}>
                      <Input placeholder="你在项目中的角色" />
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item label="技能标签" name="skills">
            <Input placeholder="多个技能用逗号分隔" />
          </Form.Item>

          <Form.Item label="目标岗位" name="targetPosition">
            <Input placeholder="如：产品经理" />
          </Form.Item>

          <Form.Item label="目标公司" name="targetCompany">
            <Input placeholder="如：银联商务-元宝" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                保存信息
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserInfoPage;
