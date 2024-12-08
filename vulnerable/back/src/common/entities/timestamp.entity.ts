import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class TimestampEntity {
  @ApiProperty({ example: '2023-01-01T08:00:00.303Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-20T10:00:00.303Z' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
