import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetSummaryQueryDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
