import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { LicenseService } from './license.service.js';
import { LICENSE_SERVICE } from './license.module.js';

const BYPASS_PATHS = [
  '/health',
  '/version',
  '/license/activate',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(@Inject(LICENSE_SERVICE) private readonly licenseService: LicenseService) {}

  canActivate(context: ExecutionContext): boolean {
    if (!this.licenseService.shouldEnforce()) return true;

    const req = context.switchToHttp().getRequest<{ url?: string; path?: string }>();
    const path = req.url?.split('?')[0] ?? req.path ?? '';

    if (BYPASS_PATHS.some((b) => path.startsWith(b))) return true;

    if (this.licenseService.isVerified()) return true;

    throw new ForbiddenException({
      message: 'License belum valid. Aktivasi di /license/activate.',
      code: 'LICENSE_REQUIRED',
    });
  }
}
