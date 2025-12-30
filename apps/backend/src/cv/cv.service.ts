import { Injectable, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';
import { CvStatus } from '@prisma/client';
import * as fs from 'fs'; // <--- Import fs
import * as path from 'path'; // <--- Import path
import { AiIntegrationService } from './ai-integration.service';

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('cv_queue') private cvQueue: Queue,
    private readonly aiService: AiIntegrationService,
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

  // Tambahkan method ini di dalam CvService

async generateImprovement(cvId: string) {
  // 1. Ambil data CV dari Database untuk dapat path filenya
  const cv = await this.prisma.cV.findUnique({ where: { id: cvId } });
  if (!cv || !cv.fileUrl) throw new NotFoundException('CV File not found');

  // 2. Baca File PDF dari disk
  // Pastikan path sesuai dengan saat upload (biasanya absolute path atau relative ke root)
  const filePath = cv.fileUrl; 
  if (!fs.existsSync(filePath)) throw new NotFoundException('File fisik tidak ditemukan');
  
  const fileBuffer = fs.readFileSync(filePath);

  // 3. Panggil Python AI Engine (/api/improve)
  // Kita reuse logic dari AiIntegrationService atau panggil langsung
  // Agar rapi, sebaiknya tambahkan method 'improveCv' di AiIntegrationService
  // Tapi untuk cepat, kita inject AiService di sini:
  return this.aiService.improveCv(fileBuffer, 'resume.pdf', cv.jobContext as any);
}
}