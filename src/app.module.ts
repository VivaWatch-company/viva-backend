import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { CompanyModule } from './modules/company/company.module';
import { DeviceModule } from './modules/device/device.module';
import { ElderlyModule } from './modules/elderly/elderly.module';
import { MeasurementModule } from './modules/measurement/measurement.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    PrismaModule,
    CompanyModule,
    DeviceModule,
    ElderlyModule,
    MeasurementModule,
    NotificationModule,
    PlanModule,
    SubscriptionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
