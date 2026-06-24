import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.module';
import { LicenseManagerService } from '../license-api/license-verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from './audit-log.service';

type AdminUser = {
  id: string;
  email: string;
  name: string;
};

type AdminRequest = Request & { user?: AdminUser };

function resolveAuditAction(previousStatus: string, nextStatus: string): string {
  if (previousStatus === nextStatus) return 'license.updated';
  if (nextStatus === 'revoked') return 'license.revoked';
  if (nextStatus === 'suspended') return 'license.suspended';
  if (nextStatus === 'active') return 'license.reactivated';
  return 'license.status_changed';
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private manager: LicenseManagerService,
    private auditLog: AuditLogService,
  ) {}

  @Get('licenses')
  async listLicenses(@Query('page') page = '1', @Query('limit') limit = '20') {
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [data, total] = await Promise.all([
      this.prisma.license.findMany({
        skip,
        take: parseInt(limit, 10),
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { activations: true } } },
      }),
      this.prisma.license.count(),
    ]);
    return { data, meta: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) } };
  }

  @Get('licenses/:id')
  async getLicense(@Param('id') id: string) {
    return this.prisma.license.findUniqueOrThrow({
      where: { id: parseInt(id, 10) },
      include: { activations: true, deviceBlocks: true, generationLogs: true },
    });
  }

  @Post('licenses/generate')
  async generateLicense(@Body() body: Record<string, unknown>, @Req() req: AdminRequest) {
    const license = await this.manager.generate(
      {
        plan: body.plan as string,
        customerName: body.customerName as string,
        customerEmail: body.customerEmail as string,
        maxActivations: body.maxActivations as number,
        allowedDomains: body.allowedDomains as string[],
        expiresInDays: body.expiresInDays as number,
        activationPolicy: body.activationPolicy as string,
      },
      {
        userId: req.user?.id,
        channel: 'admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );

    await this.auditLog.record({
      actorId: req.user?.id,
      action: 'license.generated',
      entityType: 'license',
      entityId: String(license.id),
      metadata: {
        plan: license.plan,
        customerName: license.customerName,
        channel: 'admin',
      },
    });

    return license;
  }

  @Patch('licenses/:id')
  async updateLicense(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Req() req: AdminRequest,
  ) {
    const licenseId = parseInt(id, 10);
    const existing = await this.prisma.license.findUniqueOrThrow({ where: { id: licenseId } });

    const nextStatus = typeof body.status === 'string' ? body.status : existing.status;
    const updated = await this.prisma.license.update({
      where: { id: licenseId },
      data: {
        status: body.status as string,
        plan: body.plan as string,
        maxActivations: body.maxActivations as number,
        allowedDomains: body.allowedDomains as string[],
      },
    });

    await this.auditLog.record({
      actorId: req.user?.id,
      action: resolveAuditAction(existing.status, nextStatus),
      entityType: 'license',
      entityId: String(licenseId),
      metadata: {
        previousStatus: existing.status,
        nextStatus: updated.status,
        plan: updated.plan,
        maxActivations: updated.maxActivations,
        allowedDomains: updated.allowedDomains,
      },
    });

    return updated;
  }

  @Get('audit-logs')
  async auditLogs(@Query('page') page = '1') {
    const skip = (parseInt(page, 10) - 1) * 20;
    return this.prisma.licenseServerAuditLog.findMany({
      skip,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { name: true, email: true } } },
    });
  }

  @Get('generation-logs')
  async generationLogs() {
    return this.prisma.licenseGenerationLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { license: true, user: { select: { name: true, email: true } } },
    });
  }

  @Get('stats')
  async stats() {
    const [total, active, revoked, activations] = await Promise.all([
      this.prisma.license.count(),
      this.prisma.license.count({ where: { status: 'active' } }),
      this.prisma.license.count({ where: { status: 'revoked' } }),
      this.prisma.licenseActivation.count(),
    ]);
    return { total, active, revoked, activations };
  }
}
