import { Edit, useForm } from '@refinedev/antd';
import { useParsed } from '@refinedev/core';
import { Form, InputNumber, Select } from 'antd';
import type { LicenseFormValues } from '../types/license';

export function LicenseEdit() {
  const { id } = useParsed();
  const { formProps, saveButtonProps } = useForm<LicenseFormValues>({
    resource: 'licenses',
    redirect: 'show',
  });

  return (
    <Edit saveButtonProps={saveButtonProps} title={`Edit License #${id ?? ''}`}>
      <Form {...formProps} layout="vertical">
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Revoked', value: 'revoked' },
              { label: 'Suspended', value: 'suspended' },
            ]}
          />
        </Form.Item>
        <Form.Item name="plan" label="Plan" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'PRO', value: 'PRO' },
              { label: 'BASIC', value: 'BASIC' },
              { label: 'ENTERPRISE', value: 'ENTERPRISE' },
            ]}
          />
        </Form.Item>
        <Form.Item name="maxActivations" label="Max Activations">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="allowedDomains" label="Allowed Domains">
          <Select mode="tags" placeholder="edzero.test" tokenSeparators={[',', ' ']} />
        </Form.Item>
      </Form>
    </Edit>
  );
}
