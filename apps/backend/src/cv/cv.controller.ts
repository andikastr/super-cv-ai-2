import { 
  Body, 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  Headers, 
  Get, 
  Param, 
  UnauthorizedException // <--- Import this
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

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
    // This prevents the code from running for guests, which causes the database crash.
    if (!userId) {
      throw new UnauthorizedException('You must be signed in to analyze a CV.');
    }

    return this.cvService.processCvUpload(file, dto, userId);
  }

  @Get(':id')
  async getCv(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }
}