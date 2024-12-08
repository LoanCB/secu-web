import { ApiProperty } from '@nestjs/swagger';
import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { Ticket } from 'src/ticketing/entities/tickets.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Role } from './roles.entity';

@Entity()
export class User extends SoftDeleteEntity {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'Email of the user', example: 'john.doe@sortcost.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed password of the user used to authenticate', example: 'azerty123' })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'Boolean to check if account is active or not. Inactive user cannot be connect',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.users)
  role: Relation<Role>;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Relation<Ticket>[];
}
