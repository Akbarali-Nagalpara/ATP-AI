import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'ATP AI Test Engine Backend',
      uptime: process.uptime(),
    };
  }
}
