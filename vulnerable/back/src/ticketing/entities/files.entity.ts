import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { Ticket } from './tickets.entity';

@Entity()
export class File extends SoftDeleteEntity {
  @Column()
  fileName: string;

  @Column()
  path: string;

  @Column({ type: 'int' })
  size: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.files)
  @JoinColumn({ name: 'ticketId' })
  ticket: Relation<Ticket>;

  @Column({ nullable: true })
  ticketId: number;
}
