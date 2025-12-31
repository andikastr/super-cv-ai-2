import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data'; // Pastikan import * as FormData
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiIntegrationService {
  private readonly logger = new Logger(AiIntegrationService.name);
  private readonly aiEngineUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiEngineUrl = this.configService.get<string>('AI_ENGINE_URL') || 'http://localhost:8000';
  }

  // --- 1. ANALYZE ---
  async analyzeCv(fileBuffer: Buffer, filename: string, jobContext: any) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, { filename });

      // Handle Job Context (Text atau URL)
      // Pastikan format jobContext sesuai dengan yang dikirim dari Service/Controller
      if (typeof jobContext === 'string') {
          formData.append('job_description', jobContext);
      } else if (jobContext?.text) {
          formData.append('job_description', jobContext.text);
      } else if (jobContext?.url) {
          formData.append('job_url', jobContext.url);
      }

      this.logger.log(`[AI] Sending Analyze Request to ${this.aiEngineUrl}`);

      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/api/analyze`, formData, {
          headers: { ...formData.getHeaders() },
          maxBodyLength: Infinity,
        }),
      );

      return data; // { analysis: ..., cv_data: ... }
    } catch (error) {
      this.handleError(error);
    }
  }

  // --- 2. CUSTOMIZE (Update agar sesuai Python) ---
  async customizeCv(fileBuffer: Buffer, filename: string, mode: string, contextData: any) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, { filename });
      formData.append('mode', mode);

      // Logic payload sesuai endpoint Python /api/customize
      if (mode === 'analysis') {
        // Jika context adalah object JSON, stringify dulu
        const contextStr = typeof contextData === 'string' ? contextData : JSON.stringify(contextData);
        formData.append('analysis_context', contextStr);
      } else {
        // Mode job_desc
        const jobStr = typeof contextData === 'string' ? contextData : (contextData?.text || '');
        formData.append('job_description', jobStr);
      }

      this.logger.log(`[AI] Sending Customize Request (Mode: ${mode})`);

      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiEngineUrl}/api/customize`, formData, {
          headers: { ...formData.getHeaders() },
          maxBodyLength: Infinity,
        }),
      );

      return data; // ImprovedCVResult JSON
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    const msg = error.response?.data?.detail || error.message;
    this.logger.error(`AI Engine Error: ${msg}`);
    throw new HttpException(
      msg || 'AI Service Unavailable',
      error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}