import { Show, TextField } from '@refinedev/antd';
import { useShow } from '@refinedev/core';
import { Button, Descriptions, Space, Table, Tag, Typography, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import type { License, LicenseActivation } from '../types/license';

export function LicenseShow() {
  const { query } = useShow<License>({ resource: 'licenses' });
  const license = query?.data?.data;
  const isLoading = query?.isLoading;

  const copyKey = async () => {
    if (!license?.licenseKey) return;
    await navigator.clipboard.writeText(license.licenseKey);
    message.success('License key copied');
  };

  return (
    <Show isLoading={isLoading} title={`License #${license?.id ?? ''}`}>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="License Key">
          <Space>
            <Typography.Text code>{license?.licenseKey}</Typography.Text>
            <Button type="text" size="small" icon={<CopyOutlined />} onClick={copyKey} />
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={license?.status === 'active' ? 'green' : 'red'}>{license?.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Plan">
          <TextField value={license?.plan} />
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          <TextField value={license?.customerName} />
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          <TextField value={license?.customerEmail} />
        </Descriptions.Item>
        <Descriptions.Item label="Max Activations">{license?.maxActivations}</Descriptions.Item>
        <Descriptions.Item label="Activation Policy">{license?.activationPolicy}</Descriptions.Item>
        <Descriptions.Item label="Allowed Domains">
          {license?.allowedDomains?.length ? license.allowedDomains.join(', ') : 'All domains'}
        </Descriptions.Item>
        <Descriptions.Item label="Expires">
          {license?.expiresAt ? new Date(license.expiresAt).toLocaleString() : 'Never'}
        </Descriptions.Item>
        <Descriptions.Item label="Last Verified">
          {license?.lastVerifiedAt ? new Date(license.lastVerifiedAt).toLocaleString() : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {license?.createdAt ? new Date(license.createdAt).toLocaleString() : '—'}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 24 }}>
        Activations
      </Typography.Title>
      <Table<LicenseActivation>
        size="small"
        rowKey="id"
        dataSource={license?.activations ?? []}
        pagination={false}
        locale={{ emptyText: 'No activations yet' }}
        columns={[
          { title: 'Device', dataIndex: 'deviceFingerprint', ellipsis: true },
          { title: 'App URL', dataIndex: 'appUrl' },
          { title: 'Environment', dataIndex: 'environment' },
          { title: 'Bucket', dataIndex: 'environmentBucket' },
          {
            title: 'Last Seen',
            dataIndex: 'lastSeenAt',
            render: (d: string) => new Date(d).toLocaleString(),
          },
        ]}
      />
    </Show>
  );
}
