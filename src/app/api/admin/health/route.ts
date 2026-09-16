import { NextResponse } from 'next/server';
import type { ApiResponse, ServiceHealth } from '@/types/api';

export async function GET(): Promise<NextResponse<ApiResponse<ServiceHealth[]>>> {
  const timestamp = new Date().toISOString();
  const uptime = process.uptime();

  const services: ServiceHealth[] = [
    {
      service: 'Auth & Identity Service',
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      timestamp,
    },
    {
      service: 'Surplus Food Inventory Service',
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      timestamp,
    },
    {
      service: 'Booking & Distribution Service',
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      timestamp,
    },
    {
      service: 'Ecology & Carbon Analytics Service',
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      timestamp,
    },
    {
      service: 'Governance & Audit Service',
      status: 'healthy',
      uptimeSeconds: Math.floor(uptime),
      timestamp,
    },
  ];

  return NextResponse.json({
    success: true,
    data: services,
    timestamp,
  });
}
