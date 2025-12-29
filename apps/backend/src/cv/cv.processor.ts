import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiIntegrationService } from './ai-integration.service';
import { CvStatus } from '@prisma/client';

@Processor('cv_queue')
export class CvProcessor extends WorkerHost {
  private readonly logger = new Logger(CvProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiIntegrationService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { cvId, fileKey, jobContext } = job.data;
    this.logger.log(`Processing Job ${job.id} for CV: ${cvId}`);

    try {
     
      await this.prisma.cV.update({
        where: { id: cvId },
        data: { status: CvStatus.PROCESSING },
      });

  
      const mockBuffer = Buffer.from("%PDF-1.4 ... (Real PDF Content Here)"); 

      
      const aiResult = await this.aiService.analyzeCv(
        mockBuffer, 
        'resume.pdf', 
        jobContext
      );

      
      await this.prisma.cV.update({
        where: { id: cvId },
        data: {
          status: CvStatus.COMPLETED,
          analysisResult: aiResult, 
        },
      });

      this.logger.log(`Job ${job.id} Analysis Completed.`);
    } catch (error) {
      this.logger.error(`Job ${job.id} Failed: ${error.message}`);
      
      await this.prisma.cV.update({
        where: { id: cvId },
        data: { status: CvStatus.FAILED },
      });
      
      throw error; 
    }
  }
}