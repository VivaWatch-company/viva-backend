import { Module } from '@nestjs/common';
import { ElderlyController } from './elderly.controller';
import { ElderlyService } from './elderly.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ElderlyController],
  providers: [ElderlyService],
  exports: [ElderlyService],
})
export class ElderlyModule {}
