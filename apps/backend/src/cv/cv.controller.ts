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
  BadRequestException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { AnalyzeCvDto } from './dto/analyze-cv.dto';


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) { }

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: AnalyzeCvDto,
    @Headers('userId') userIdHeader: string
  ) {

    if (!file) {
      throw new BadRequestException('File is required');
    }


    if (file.size > MAX_FILE_SIZE) {
      throw new PayloadTooLargeException('File size exceeds 10MB limit');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException('Only PDF and DOCX files are allowed');
    }

    const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      throw new UnsupportedMediaTypeException('Only .pdf and .docx files are allowed');
    }

    const userId = userIdHeader && userIdHeader !== 'null' && userIdHeader !== 'undefined'
      ? userIdHeader
      : undefined;

    return this.cvService.processCvUpload(file, dto, userId);
  }


  @Post(':id/claim')
  async claim(
    @Param('id') id: string,
    @Headers('userId') userId: string
  ) {
    if (!userId) throw new UnauthorizedException('Wajib login untuk mengklaim hasil.');
    return this.cvService.claimCv(id, userId);
  }


  @Get(':id')
  async getCv(@Param('id') id: string) {
    return this.cvService.findOne(id);
  }


  @Post(':id/customize')
  async customizeCv(
    @Param('id') id: string,
    @Body('mode') mode: string
  ) {
    if (!mode) {
      throw new BadRequestException("Mode is required ('analysis' or 'job_desc')");
    }


    return this.cvService.customizeCv(id, mode);
  }
}