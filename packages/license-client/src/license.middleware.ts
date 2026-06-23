import type { Request, Response, NextFunction } from 'express';
import type { LicenseService } from './license.service.js';

const BYPASS_PATHS = [
  '/health',
  '/version',
  '/license/activate',
  '/auth/login',
  '/auth/register',
];

export function licenseMiddleware(licenseService: LicenseService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!licenseService.shouldEnforce()) {
      next();
      return;
    }

    const path = req.path;
    if (BYPASS_PATHS.some((b) => path.startsWith(b))) {
      next();
      return;
    }

    if (licenseService.isVerified()) {
      next();
      return;
    }

    res.status(403).json({
      message: 'License belum valid. Aktivasi di /license/activate.',
      code: 'LICENSE_REQUIRED',
    });
  };
}
