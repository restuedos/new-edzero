import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { LicenseApiModule } from '../license-api/license-api.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LicenseApiModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
