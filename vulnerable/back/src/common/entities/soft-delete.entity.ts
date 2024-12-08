import { ApiProperty } from '@nestjs/swagger';
import { DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export class SoftDeleteEntity extends BaseEntity {
  @ApiProperty({ example: '2023-01-01T08:00:00.303Z' })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
