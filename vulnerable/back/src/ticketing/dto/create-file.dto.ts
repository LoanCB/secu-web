import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString({ message: 'FileName must be a string' })
  @IsNotEmpty({ message: 'FileName is required' })
  fileName: string;

  @IsString({ message: 'FileName must be a string' })
  @IsNotEmpty({ message: 'FileName is required' })
  path: string;

  @IsInt({ message: 'Size must an integer' })
  size: number;

  @IsInt({ message: 'TicketId must be an integer' })
  ticketId: number;
}
