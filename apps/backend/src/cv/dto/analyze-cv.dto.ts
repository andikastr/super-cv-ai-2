import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

/**
 * DTO for CV analysis request
 * Note: The file itself is received via @UploadedFile() with FileInterceptor,
 * not through the DTO body. These fields are optional metadata.
 */
export class AnalyzeCvDto {
  @IsOptional()
  @IsString()
  fileKey?: string; // Optional - only used if file is pre-uploaded to storage

  @IsOptional()
  @IsString()
  jobDescriptionText?: string;

  @IsOptional()
  @IsUrl()
  jobDescriptionUrl?: string;
}

export class WebhookResultDto {
  @IsString()
  @IsNotEmpty()
  cvId: string;

  @IsNotEmpty()
  result: any;

  @IsString()
  status: 'COMPLETED' | 'FAILED';
}