import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiIntegrationService {
  private readonly logger = new Logger(AiIntegrationService.name);
  private readonly aiEngineUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiEngineUrl = this.configService.get<string>('AI_ENGINE_URL') || 'http://ai-engine:8000';
  }

  async analyzeCv(fileBuffer: Buffer, filename: string, jobContext: { text?: string; url?: string }) {
    try {
      const formData = new FormData();
      
      // 1. Attach the file
      formData.append('file', fileBuffer, { filename });

      // 2. Attach Job Context (Prioritize Text, fallback to URL)
      if (jobContext?.text) {
        formData.append('job_description', jobContext.text);
      }
      if (jobContext?.url) {
        formData.append('job_url', jobContext.url);
      }

      this.logger.log(`Sending CV to AI Engine: ${this.aiEngineUrl}/api/analyze`);

      // 3. Send Request
      // We must explicitly set headers from formData to include the 'boundary'
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/api/analyze`, formData, {
          headers: {
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity, // Allow large files
        }),
      );

      return data;
    } catch (error) {
      this.logger.error(
        `AI Engine Error: ${error.response?.data?.detail || error.message}`,
      );
      
      throw new HttpException(
        error.response?.data?.detail || 'AI Service Unavailable',
        error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // Tambahkan method ini
async improveCv(fileBuffer: Buffer, filename: string, jobContext: any) {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, { filename });
    
    if (jobContext?.text) formData.append('job_description', jobContext.text);
    if (jobContext?.url) formData.append('job_url', jobContext.url);

    // Panggil endpoint /api/improve di Python
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiEngineUrl}/api/improve`, formData, {
        headers: { ...formData.getHeaders() },
        maxBodyLength: Infinity,
      }),
    );
    return data; // Ini akan mengembalikan JSON structure (ImprovedCVResult)
  } catch (error) {
    this.logger.error('AI Improve Error', error);
    throw new HttpException('AI Service Failed', 503);
  }
}
}