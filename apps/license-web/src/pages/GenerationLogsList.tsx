import { useList } from '@refinedev/core';
import { Table, Typography } from 'antd';

export function GenerationLogsList() {
  const { data, isLoading } = useList({ resource: 'generation-logs' });

  return (
    <div>
      <Typography.Title level={3}>Generation Logs</Typography.Title>
      <Table
        loading={isLoading}
        dataSource={data?.data ?? []}
        rowKey="id"
        columns={[
          { title: 'License ID', dataIndex: 'licenseId' },
          { title: 'Channel', dataIndex: 'channel' },
          { title: 'User', dataIndex: ['user', 'email'] },
          { title: 'At', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
        ]}
      />
    </div>
  );
}
