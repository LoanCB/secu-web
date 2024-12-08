import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john-doe@example.com' })
  @IsEmail({}, { message: 'invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString({ message: 'password must me a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
