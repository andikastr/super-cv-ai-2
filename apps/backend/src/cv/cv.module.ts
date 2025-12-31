import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <--- Required for talking to Python
import { BullModule } from '@nestjs/bullmq';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvProcessor } from './cv.processor'; // <--- The Worker
import { AiIntegrationService } from './ai-integration.service'; // <--- The Bridge
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    // 1. Register the Queue so we can write to it AND read from it
    BullModule.registerQueue({
      name: 'cv_queue',
    }),
    // 2. Register HttpModule so AiIntegrationService can make requests
    HttpModule,
    PrismaModule,
  ],
  controllers: [CvController],
  providers: [
    CvService, 
    PrismaService, 
    // 3. CRITICAL: These must be in providers to run!
    CvProcessor, 
    AiIntegrationService
  ],
  exports: [CvService],
})
export class CvModule {}