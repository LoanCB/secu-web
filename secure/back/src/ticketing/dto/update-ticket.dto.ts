import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}
