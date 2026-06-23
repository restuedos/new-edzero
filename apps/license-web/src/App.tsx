import { Refine } from '@refinedev/core';
import { RefineThemes, ThemedLayoutV2, useNotificationProvider } from '@refinedev/antd';
import { ConfigProvider, App as AntApp } from 'antd';
import { Routes, Route, Outlet } from 'react-router-dom';
import routerProvider from '@refinedev/react-router-v6';
import { authProvider, dataProvider } from './providers';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LicensesList } from './pages/LicensesList';
import { LicenseCreate } from './pages/LicenseCreate';
import { LicenseEdit } from './pages/LicenseEdit';
import { LicenseShow } from './pages/LicenseShow';
import { AuditLogsList } from './pages/AuditLogsList';
import { GenerationLogsList } from './pages/GenerationLogsList';
import '@refinedev/antd/dist/reset.css';

export default function App() {
  return (
    <ConfigProvider theme={RefineThemes.Blue}>
      <AntApp>
        <Refine
          authProvider={authProvider}
          dataProvider={dataProvider}
          routerProvider={routerProvider}
          notificationProvider={useNotificationProvider}
          resources={[
            {
              name: 'licenses',
              list: '/licenses',
              create: '/licenses/create',
              edit: '/licenses/edit/:id',
              show: '/licenses/show/:id',
              meta: { label: 'Licenses' },
            },
            { name: 'audit-logs', list: '/audit-logs', meta: { label: 'Audit Logs' } },
            { name: 'generation-logs', list: '/generation-logs', meta: { label: 'Generation Logs' } },
          ]}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ThemedLayoutV2 Title={() => <span>License Server</span>}>
                  <Outlet />
                </ThemedLayoutV2>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="licenses" element={<LicensesList />} />
              <Route path="licenses/create" element={<LicenseCreate />} />
              <Route path="licenses/edit/:id" element={<LicenseEdit />} />
              <Route path="licenses/show/:id" element={<LicenseShow />} />
              <Route path="audit-logs" element={<AuditLogsList />} />
              <Route path="generation-logs" element={<GenerationLogsList />} />
            </Route>
          </Routes>
        </Refine>
      </AntApp>
    </ConfigProvider>
  );
}
