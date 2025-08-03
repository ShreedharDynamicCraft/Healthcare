import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the API is running and healthy',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 12345.67 },
        environment: { type: 'string', example: 'development' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      service: 'Clinic Front Desk API',
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness check',
    description: 'Check if the API is ready to receive requests',
  })
  @ApiResponse({
    status: 200,
    description: 'API is ready',
  })
  getReadiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  @ApiOperation({
    summary: 'Liveness check',
    description: 'Check if the API is alive',
  })
  @ApiResponse({
    status: 200,
    description: 'API is alive',
  })
  getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
