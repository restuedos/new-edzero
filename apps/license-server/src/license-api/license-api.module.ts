import { Module } from '@nestjs/common';
import { LicenseApiController } from './license-api.controller';
import { LicenseCryptoService } from './license-crypto.service';
import { LicenseInboundValidator } from './license-inbound-validator.service';
import {
  LicenseVerificationService,
  LicenseManagerService,
} from './license-verification.service';
import { LicenseHeartbeatService } from './license-heartbeat.service';

@Module({
  controllers: [LicenseApiController],
  providers: [
    LicenseCryptoService,
    LicenseInboundValidator,
    LicenseVerificationService,
    LicenseHeartbeatService,
    LicenseManagerService,
  ],
  exports: [LicenseManagerService],
})
export class LicenseApiModule {}
