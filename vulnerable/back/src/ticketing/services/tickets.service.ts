import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { getEntityFilteredList } from 'src/common/helpers/filter-repository.helper';
import { EntityFilteredListResults } from 'src/common/types/filter-repository.types';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { Ticket } from '../entities/tickets.entity';

@Injectable()
export class TicketsService {
  @InjectRepository(Ticket)
  ticketsRepository: Repository<Ticket>;

  async findAll(query: PaginationParamsDto): EntityFilteredListResults<Ticket> {
    const [tickets, totalResults] = await getEntityFilteredList({
      repository: this.ticketsRepository,
      queryFilter: query,
      relations: [{ relation: 'file', alias: 'f' }],
    });
    return [tickets, tickets.length, totalResults];
  }

  async findOneById(id: number, withDeleted: boolean = true) {
    return await this.ticketsRepository.findOneOrFail({
      where: { id },
      relations: { files: true },
      withDeleted,
    });
  }

  async createTicketWithFiles(
    createTicketDto: CreateTicketDto,
    user: User,
    files: Express.Multer.File[] = [],
  ): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({ ...createTicketDto, user });
    // TODO save files
    console.log(files);
    return await this.ticketsRepository.save(ticket);
  }
}
