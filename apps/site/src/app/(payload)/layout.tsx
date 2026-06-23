import type { ServerFunctionClient } from 'payload';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import '@payloadcms/next/css';
import '@/admin/live-preview.css';
import config from '@payload-config';
import React from 'react';

import { importMap } from './admin/importMap.js';

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async (args) => {
  'use server';
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
