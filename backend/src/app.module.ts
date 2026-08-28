import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { QueueRootModule } from './queue/queue.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SwaggerModule } from './modules/swagger/swagger.module';
import { EndpointsModule } from './modules/endpoints/endpoints.module';
import { TestingModule } from './modules/testing/testing.module';
import { WorkersModule } from './modules/workers/workers.module';
import { QueueModule } from './modules/queue/queue.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';
import { OtpModule } from './modules/otp/otp.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { RolesModule } from './modules/roles/roles.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    QueueRootModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    SwaggerModule,
    EndpointsModule,
    TestingModule,
    WorkersModule,
    QueueModule,
    ReportsModule,
    AiModule,
    OtpModule,
    SessionsModule,
    RolesModule,
    CredentialsModule,
    LogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
