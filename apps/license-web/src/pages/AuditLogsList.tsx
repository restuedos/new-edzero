import { useList } from '@refinedev/core';
import { Table, Typography } from 'antd';

export function AuditLogsList() {
  const { data, isLoading } = useList({ resource: 'audit-logs' });

  return (
    <div>
      <Typography.Title level={3}>Audit Logs</Typography.Title>
      <Table
        loading={isLoading}
        dataSource={data?.data ?? []}
        rowKey="id"
        columns={[
          { title: 'Action', dataIndex: 'action' },
          { title: 'Entity', dataIndex: 'entityType' },
          { title: 'Entity ID', dataIndex: 'entityId' },
          { title: 'Actor', dataIndex: ['actor', 'email'] },
          { title: 'At', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleString() },
        ]}
      />
    </div>
  );
}
