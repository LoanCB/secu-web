import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { Entity } from 'typeorm';

@Entity()
export class File extends SoftDeleteEntity {}
