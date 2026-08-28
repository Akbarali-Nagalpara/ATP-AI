import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log(`[${new Date().toISOString()}] [INFO]:`, message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(`[${new Date().toISOString()}] [ERROR]:`, message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(`[${new Date().toISOString()}] [WARN]:`, message, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    console.debug(`[${new Date().toISOString()}] [DEBUG]:`, message, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    console.log(`[${new Date().toISOString()}] [VERBOSE]:`, message, ...optionalParams);
  }
}
