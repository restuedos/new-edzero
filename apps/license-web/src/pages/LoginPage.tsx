import { useLogin } from '@refinedev/core';
import { Button, Card, Form, Input } from 'antd';

export function LoginPage() {
  const { mutate: login, isLoading } = useLogin();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="License Admin Login" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={(v) => login(v)}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
