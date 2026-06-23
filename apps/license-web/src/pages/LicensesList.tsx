import { useList } from '@refinedev/core';
import { CreateButton, EditButton, ShowButton } from '@refinedev/antd';
import { Button, Space, Table, Tag, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { License } from '../types/license';

export function LicensesList() {
  const { data, isLoading } = useList<License>({ resource: 'licenses' });

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    message.success('License key copied');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Licenses
        </Typography.Title>
        <CreateButton resource="licenses">Create License</CreateButton>
      </div>
      <Table
        loading={isLoading}
        dataSource={data?.data ?? []}
        rowKey="id"
        scroll={{ x: 1100 }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 60 },
          {
            title: 'License Key',
            dataIndex: 'licenseKey',
            width: 280,
            render: (key: string) => (
              <Space size="small">
                <Typography.Text code style={{ fontSize: 12 }}>
                  {key}
                </Typography.Text>
                <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyKey(key)} />
              </Space>
            ),
          },
          { title: 'Plan', dataIndex: 'plan', width: 80 },
          { title: 'Customer', dataIndex: 'customerName' },
          {
            title: 'Status',
            dataIndex: 'status',
            width: 100,
            render: (s: string) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
          },
          { title: 'Max Activations', dataIndex: 'maxActivations', width: 130 },
          { title: 'Activations', dataIndex: ['_count', 'activations'], width: 100 },
          {
            title: 'Expires',
            dataIndex: 'expiresAt',
            width: 110,
            render: (d: string) => (d ? new Date(d).toLocaleDateString() : 'Never'),
          },
          {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_: unknown, record: License) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <EditButton hideText size="small" recordItemId={record.id} />
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}
