import { SoftDeleteEntity } from 'src/common/entities/soft-delete.entity';
import { File } from 'src/ticketing/entities/files.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

@Entity()
export class Ticket extends SoftDeleteEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.tickets)
  user: Relation<User>;

  @OneToMany(() => File, (file) => file.ticket)
  files: Relation<File>[];
}
