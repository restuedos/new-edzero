import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuditLogService } from './audit-log.service';
import { LicenseApiModule } from '../license-api/license-api.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [LicenseApiModule, AuthModule],
  controllers: [AdminController],
  providers: [AuditLogService],
})
export class AdminModule {}
