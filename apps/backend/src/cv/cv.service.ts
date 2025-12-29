import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('cv_queue') private cvQueue: Queue,
  ) {}

  async processCvUpload(
    file: Express.Multer.File, 
    dto: AnalyzeCvDto, 
    userId: string
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // --- FIX START: Verify User Exists ---
    // This logic fixes the "Foreign Key Violated" error.
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      
      // 1. Ghost User Check
      // If the ID exists in the header but NOT in Postgres, throw a clear error.
      if (!user) {
        throw new UnauthorizedException('User account not found. Please Sign Out and Sign In again to sync your account.');
      }

      // 2. Credit Check
      if (user.credits <= 0) {
        throw new BadRequestException('Insufficient credits. Please upgrade your plan.');
      }
  
      // 3. Decrement Credits
      await this.prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }
    // --- FIX END ---

    const mockFileKey = `uploads/${Date.now()}_${file.originalname}`;

    // Create the CV record safely now that we know the user exists
    const cv = await this.prisma.cV.create({
      data: {
        userId: userId, 
        fileUrl: mockFileKey,
        status: CvStatus.PENDING,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl
        } as any, 
      },
    });

    await this.cvQueue.add(
      'analyze_job',
      {
        cvId: cv.id,
        fileKey: mockFileKey,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl,
        },
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    );

    this.logger.log(`CV ${cv.id} queued for analysis. User: ${userId}`);

    return { 
      cvId: cv.id, 
      status: 'QUEUED', 
      creditsRemaining: 'calculated_next_refresh' 
    };
  }

  async findOne(id: string) {
    return this.prisma.cV.findUnique({ where: { id } });
  }
}