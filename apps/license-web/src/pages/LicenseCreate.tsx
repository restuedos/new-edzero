import { Create, useForm } from '@refinedev/antd';
import { Form, Input, InputNumber, Select } from 'antd';
import type { LicenseFormValues } from '../types/license';

export function LicenseCreate() {
  const { formProps, saveButtonProps } = useForm<LicenseFormValues>({
    resource: 'licenses',
    redirect: 'show',
  });

  return (
    <Create saveButtonProps={saveButtonProps} title="Create License">
      <Form {...formProps} layout="vertical">
        <Form.Item name="plan" label="Plan" initialValue="PRO" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'PRO', value: 'PRO' },
              { label: 'BASIC', value: 'BASIC' },
              { label: 'ENTERPRISE', value: 'ENTERPRISE' },
            ]}
          />
        </Form.Item>
        <Form.Item name="customerName" label="Customer Name">
          <Input placeholder="Acme Corp" />
        </Form.Item>
        <Form.Item name="customerEmail" label="Customer Email">
          <Input type="email" placeholder="hello@example.com" />
        </Form.Item>
        <Form.Item name="maxActivations" label="Max Activations" initialValue={1}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="activationPolicy" label="Activation Policy" initialValue="block_new">
          <Select
            options={[
              { label: 'Block new devices when limit reached', value: 'block_new' },
              { label: 'Auto-revoke oldest device', value: 'auto_revoke_oldest' },
            ]}
          />
        </Form.Item>
        <Form.Item name="allowedDomains" label="Allowed Domains" tooltip="Leave empty to allow all domains">
          <Select mode="tags" placeholder="edzero.test" tokenSeparators={[',', ' ']} />
        </Form.Item>
        <Form.Item name="expiresInDays" label="Expires In (days)" tooltip="Leave empty for no expiry">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Create>
  );
}
