import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { User } from './users.entity';
import { RoleType } from '../types/role-type';

@Entity()
export class Role extends BaseEntity {
  @ApiProperty({ description: 'Title of the role', example: 'Lecture uniquement' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Name of the role. It use for permissions', enum: RoleType, example: RoleType.READ_ONLY })
  @Column({ type: 'varchar' })
  name: RoleType;

  @ApiProperty({ description: 'Description of the role', example: 'Rôle permettant uniquement la lecture de données' })
  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: Relation<User[]>;
}
