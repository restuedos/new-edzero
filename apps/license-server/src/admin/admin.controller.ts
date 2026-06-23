import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.module';
import { LicenseManagerService } from '../license-api/license-verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private manager: LicenseManagerService,
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
  async generateLicense(@Body() body: Record<string, unknown>) {
    return this.manager.generate({
      plan: body.plan as string,
      customerName: body.customerName as string,
      customerEmail: body.customerEmail as string,
      maxActivations: body.maxActivations as number,
      allowedDomains: body.allowedDomains as string[],
      expiresInDays: body.expiresInDays as number,
      activationPolicy: body.activationPolicy as string,
    });
  }

  @Patch('licenses/:id')
  async updateLicense(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.prisma.license.update({
      where: { id: parseInt(id, 10) },
      data: {
        status: body.status as string,
        plan: body.plan as string,
        maxActivations: body.maxActivations as number,
        allowedDomains: body.allowedDomains as string[],
      },
    });
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
