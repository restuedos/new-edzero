import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { api } from '../providers';

export function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, revoked: 0, activations: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <div>
      <Typography.Title level={3}>License Overview</Typography.Title>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Total Licenses" value={stats.total} /></Card></Col>
        <Col span={6}><Card><Statistic title="Active" value={stats.active} /></Card></Col>
        <Col span={6}><Card><Statistic title="Revoked" value={stats.revoked} /></Card></Col>
        <Col span={6}><Card><Statistic title="Activations" value={stats.activations} /></Card></Col>
      </Row>
    </div>
  );
}
