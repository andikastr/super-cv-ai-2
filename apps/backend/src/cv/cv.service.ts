import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq'; // Menggunakan BullMQ
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('cv_queue') private cvQueue: Queue,
    // Kita hapus AiIntegrationService disini karena Service hanya push ke Queue,
    // yang memanggil AI nanti adalah Processor.
  ) {}

  // --- 1. UPLOAD & TRIGGER ANALYZE ---
  async processCvUpload(
    file: Express.Multer.File, 
    dto: AnalyzeCvDto, 
    userId: string
  ) {
    if (!file) throw new BadRequestException('File is required');

    // A. Validate User & Credits
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('User account not found.');
      // if (user.credits <= 0) throw new BadRequestException('Insufficient credits.');
      
      // Credit deduction bisa dilakukan disini atau setelah sukses di Processor (tergantung kebijakan bisnis)
      // Untuk aman, kita potong di sini:
      await this.prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    // B. Save File Locally
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, file.buffer);

    // C. Create DB Record (PENDING)
    const cv = await this.prisma.cV.create({
      data: {
        userId: userId, 
        fileUrl: filePath, 
        status: CvStatus.PENDING,
        jobContext: {
          text: dto.jobDescriptionText,
          url: dto.jobDescriptionUrl
        } as any, 
      },
    });

    // D. Add to Queue (Analyze)
    await this.cvQueue.add(
      'analyze-job', // Pastikan nama ini SAMA dengan di Processor
      {
        cvId: cv.id,
        filePath: filePath, 
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

    this.logger.log(`CV ${cv.id} queued for Analysis.`);

    // Return ID segera agar frontend bisa redirect & polling
    return { cvId: cv.id, status: 'PENDING' };
  }

  // --- 2. TRIGGER CUSTOMIZE / REWRITE ---
  async customizeCv(id: string, mode: string) {
    // A. Ambil Data CV
    const cv = await this.prisma.cV.findUnique({ where: { id } });
    if (!cv) throw new NotFoundException('CV not found');
    if (!cv.fileUrl || !fs.existsSync(cv.fileUrl)) {
        throw new NotFoundException('Physical CV file not found');
    }

    // B. Tentukan Context (Job Desc atau Analysis Feedback)
    let contextData: any = "";
    
    if (mode === 'analysis') {
        // Mode perbaikan berdasarkan feedback AI
        if (!cv.analysisResult) {
            throw new BadRequestException("Analysis result not found. Please analyze first.");
        }
        contextData = cv.analysisResult; 
    } else {
        // Mode penyesuaian dengan Job Desc
        contextData = cv.jobContext; 
    }

    // C. Add to Queue (Customize)
    await this.cvQueue.add(
      'customize-job', // Nama job untuk processor
      {
        cvId: cv.id,
        mode: mode,
        filePath: cv.fileUrl,
        contextData: contextData
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      }
    );

    this.logger.log(`CV ${id} queued for Customization (Mode: ${mode}).`);

    // Return status processing agar frontend mulai polling
    return { message: 'Customization queued', status: 'PROCESSING' };
  }

  // --- HELPER: GET DATA (Untuk Polling) ---
  async findOne(id: string) {
    return this.prisma.cV.findUnique({ where: { id } });
  }
}