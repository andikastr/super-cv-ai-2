import { 
  Body, 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Headers, 
  Get, 
  Param, 
  UnauthorizedException,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  // --- 1. UPLOAD & ANALYZE ---
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AnalyzeCvDto,
    @Headers('userId') userIdHeader: string 
  ) {
    // 1. CLEANUP: Handle cases where header is string "null" or undefined
    const userId = userIdHeader && userIdHeader !== 'null' && userIdHeader !== 'undefined' 
      ? userIdHeader 
      : null;

    // 2. SAFEGUARD: Strict Login Enforcement
    if (!userId) {
      throw new UnauthorizedException('You must be signed in to analyze a CV.');
    }

    // Panggil Service (yang sekarang masuk Queue)
    return this.cvService.processCvUpload(file, dto, userId);
  }

  // --- 2. GET STATUS / DATA (POLLING) ---
  @Get(':id')
  async getCv(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }

  // --- 3. CUSTOMIZE / IMPROVE (UPDATED) ---
  // Kita ubah endpoint jadi 'customize' agar sesuai dengan fitur baru
  // Menerima body: { "mode": "analysis" } atau { "mode": "job_desc" }
  @Post(':id/customize')
  async customizeCv(
    @Param('id') id: string, 
    @Body('mode') mode: string
  ) {
    if (!mode) {
        throw new BadRequestException("Mode is required ('analysis' or 'job_desc')");
    }
    
    // Panggil Service (masuk Queue)
    return this.cvService.customizeCv(id, mode);
  }
}