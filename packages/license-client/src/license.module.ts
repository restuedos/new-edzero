import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import type { LicenseClientConfig } from './types.js';
import { LicenseService } from './license.service.js';
import { LicenseGuard } from './license.guard.js';
import { createLicenseConfigFromEnv } from './config.js';

export const LICENSE_CONFIG = 'LICENSE_CONFIG';
export const LICENSE_SERVICE = 'LICENSE_SERVICE';

@Global()
@Module({})
export class LicenseModule {
  static forRoot(config?: Partial<LicenseClientConfig>): DynamicModule {
    const configProvider: Provider = {
      provide: LICENSE_CONFIG,
      useFactory: () => ({ ...createLicenseConfigFromEnv(), ...config }),
    };

    const serviceProvider: Provider = {
      provide: LICENSE_SERVICE,
      useFactory: (cfg: LicenseClientConfig) => new LicenseService(cfg),
      inject: [LICENSE_CONFIG],
    };

    const guardProvider: Provider = {
      provide: LicenseService,
      useExisting: LICENSE_SERVICE,
    };

    return {
      module: LicenseModule,
      providers: [
        configProvider,
        serviceProvider,
        guardProvider,
        { provide: APP_GUARD, useClass: LicenseGuard },
      ],
      exports: [LICENSE_CONFIG, LICENSE_SERVICE, LicenseService],
    };
  }
}
