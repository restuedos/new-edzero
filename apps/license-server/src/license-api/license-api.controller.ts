import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { LicenseVerificationService, LicenseManagerService } from './license-verification.service';
import { LicenseHeartbeatService } from './license-heartbeat.service';

class VerifyDto {
  @IsString() payload: string;
  @IsString() app_url: string;
  @IsString() environment: string;
  @IsString() timestamp: string;
  @IsString() @MinLength(16) nonce: string;
  @IsOptional() @IsString() request_signature?: string;
  @IsOptional() @IsString() device_fingerprint?: string;
}

class HeartbeatDto {
  @IsString() license_token: string;
  @IsString() signature: string;
  @IsString() app_url: string;
  @IsString() environment: string;
  @IsString() timestamp: string;
  @IsString() @MinLength(16) nonce: string;
  @IsOptional() @IsString() request_signature?: string;
  @IsOptional() @IsString() device_fingerprint?: string;
}

class GenerateDto {
  @IsOptional() @IsString() plan?: string;
  @IsOptional() @IsString() customer_name?: string;
  @IsOptional() @IsString() customer_email?: string;
}

@ApiTags('License API')
@Controller('license')
export class LicenseApiController {
  constructor(
    private verification: LicenseVerificationService,
    private heartbeat: LicenseHeartbeatService,
    private manager: LicenseManagerService,
  ) {}

  @Post('verify')
  async verify(@Body() dto: VerifyDto, @Res() res: Response) {
    const result = await this.verification.verify(dto as unknown as Record<string, string>);
    return res.status(result.status).json(result.body);
  }

  @Post('heartbeat')
  async heartbeatEndpoint(@Body() dto: HeartbeatDto, @Res() res: Response) {
    const result = await this.heartbeat.heartbeat(dto as unknown as Record<string, string>);
    return res.status(result.status).json(result.body);
  }

  @Post('generate')
  async generate(@Body() dto: GenerateDto, @Res() res: Response) {
    const apiKey = process.env.LICENSE_ADMIN_API_KEY;
    if (apiKey) {
      // Simple API key check would go here via header
    }
    const license = await this.manager.generate({
      plan: dto.plan,
      customerName: dto.customer_name,
      customerEmail: dto.customer_email,
    });
    return res.status(201).json({
      valid: true,
      message: 'License generated.',
      license_key: license.licenseKey,
      license_id: license.id,
    });
  }
}
