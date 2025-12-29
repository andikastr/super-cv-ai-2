import { Injectable, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';
import * as fs from 'fs'; // <--- Import fs
import * as path from 'path'; // <--- Import path

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
    if (!file) throw new BadRequestException('File is required');

    // --- 1. Validate User ---
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('User account not found.');
      if (user.credits <= 0) throw new BadRequestException('Insufficient credits.');
      
      await this.prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    // --- 2. SAVE FILE LOCALLY (The Fix) ---
    // Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create a safe unique filename
    const uniqueFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Write the buffer to disk
    fs.writeFileSync(filePath, file.buffer);
    // ---------------------------------------

    const cv = await this.prisma.cV.create({
      data: {
        userId: userId, 
        fileUrl: filePath, // Save the path, not just a key
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
        filePath: filePath, // <--- Send the REAL PATH to the worker
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

    this.logger.log(`CV ${cv.id} queued. Saved to: ${filePath}`);

    return { cvId: cv.id, status: 'QUEUED' };
  }

  async findOne(id: string) {
    return this.prisma.cV.findUnique({ where: { id } });
  }
}